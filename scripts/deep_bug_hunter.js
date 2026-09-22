const fs = require('fs');
const path = require('path');
const vm = require('vm');

const REPO_ROOT = path.resolve(__dirname, '..');
const SITES_DIR = path.join(REPO_ROOT, 'sites');

console.log('='.repeat(70));
console.log('🔍 DEEP MULTI-DIMENSIONAL BUG HUNTER');
console.log('='.repeat(70));

const issues = [];

function record(file, category, severity, message, line = null) {
  issues.push({ file, category, severity, message, line });
}

function getHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    if (file === '_next' || file === 'node_modules' || file === '.git') continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(getHtmlFiles(fullPath));
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

const htmlFiles = [
  ...getHtmlFiles(SITES_DIR),
  ...getHtmlFiles(path.join(REPO_ROOT, 'apps', 'sevenseed', 'backend', 'static'))
];
console.log(`Analyzing ${htmlFiles.length} HTML files across sites/ and backend/static/...\n`);

for (const filePath of htmlFiles) {
  const relPath = path.relative(REPO_ROOT, filePath).replace(/\\/g, '/');
  const dirPath = path.dirname(filePath);
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  // 1. Collect all element IDs and anchor names
  const ids = new Set();
  const duplicateIds = new Set();
  const idRegex = /\sid=["']([^"']+)["']/g;
  let m;
  while ((m = idRegex.exec(content)) !== null) {
    const id = m[1];
    if (ids.has(id)) duplicateIds.add(id);
    ids.add(id);
  }
  const nameRegex = /<a[^>]+name=["']([^"']+)["']/g;
  while ((m = nameRegex.exec(content)) !== null) {
    ids.add(m[1]);
  }
  for (const dup of duplicateIds) {
    record(relPath, 'DOM_DUPLICATE_ID', 'WARNING', `Duplicate DOM ID: #${dup}`);
  }

  // 2. Check in-page anchor links href="#..."
  const anchorHrefRegex = /href=["']#([^"'?]+)["']/g;
  while ((m = anchorHrefRegex.exec(content)) !== null) {
    const targetAnchor = m[1];
    if (!targetAnchor || targetAnchor === 'top' || targetAnchor.startsWith('!')) continue;
    if (!ids.has(targetAnchor)) {
      record(relPath, 'BROKEN_INPAGE_ANCHOR', 'WARNING', `In-page anchor href="#${targetAnchor}" has no matching element with id="${targetAnchor}"`);
    }
  }

  // 3. Check internal relative & root-relative links
  const hrefRegex = /href=["']([^"']+)["']/g;
  while ((m = hrefRegex.exec(content)) !== null) {
    const href = m[1].trim();
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:') || href.startsWith('data:')) continue;
    if (href.startsWith('http://') || href.startsWith('https://')) continue;

    const cleanHref = href.split('?')[0].split('#')[0];
    if (!cleanHref) continue;

    if (href.startsWith('/')) {
      const cand1 = path.join(REPO_ROOT, 'sites', cleanHref);
      const cand2 = path.join(REPO_ROOT, cleanHref);
      const cand3 = path.join(REPO_ROOT, 'sites', cleanHref.replace(/^\//, ''));
      // also check if candidate is a directory containing index.html
      const isDirWithIndex = (c) => fs.existsSync(c) && fs.statSync(c).isDirectory() && fs.existsSync(path.join(c, 'index.html'));
      if (!fs.existsSync(cand1) && !fs.existsSync(cand2) && !fs.existsSync(cand3) && !isDirWithIndex(cand1) && !isDirWithIndex(cand2) && !isDirWithIndex(cand3)) {
        if (!cleanHref.includes('/app') && cleanHref !== '/' && !cleanHref.startsWith('/api/')) {
          record(relPath, 'BROKEN_ROOT_LINK', 'ERROR', `Root-relative link broken: href="${href}"`);
        }
      }
    } else {
      const targetPath = path.resolve(dirPath, cleanHref);
      const isDirWithIndex = fs.existsSync(targetPath) && fs.statSync(targetPath).isDirectory() && fs.existsSync(path.join(targetPath, 'index.html'));
      if (!fs.existsSync(targetPath) && !isDirWithIndex) {
        record(relPath, 'BROKEN_RELATIVE_LINK', 'ERROR', `Relative link broken: href="${href}" -> missing target: ${cleanHref}`);
      }
    }
  }

  // 4. Check images
  const imgRegex = /<img[^>]+src=["']([^"']+)["']/g;
  while ((m = imgRegex.exec(content)) !== null) {
    const src = m[1].trim();
    if (!src || src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) continue;
    const cleanSrc = src.split('?')[0].split('#')[0];
    if (src.startsWith('/')) {
      const target = path.join(REPO_ROOT, 'sites', cleanSrc);
      if (!fs.existsSync(target)) {
        record(relPath, 'BROKEN_IMAGE_SRC', 'ERROR', `Image src not found: "${src}"`);
      }
    } else {
      const target = path.resolve(dirPath, cleanSrc);
      if (!fs.existsSync(target)) {
        record(relPath, 'BROKEN_IMAGE_SRC', 'ERROR', `Image src not found: "${src}"`);
      }
    }
  }

  // 5. Check stylesheets
  const cssRegex = /<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+)["']/g;
  while ((m = cssRegex.exec(content)) !== null) {
    const href = m[1].trim();
    if (!href || href.startsWith('http://') || href.startsWith('https://') || href.startsWith('data:')) continue;
    const cleanHref = href.split('?')[0].split('#')[0];
    const target = cleanHref.startsWith('/') ? path.join(REPO_ROOT, 'sites', cleanHref) : path.resolve(dirPath, cleanHref);
    if (!fs.existsSync(target)) {
      record(relPath, 'BROKEN_STYLESHEET', 'ERROR', `Stylesheet not found: "${href}"`);
    }
  }

  // 6. Scripts syntax & DOM queries
  const scriptRegex = /<script(?:\s+[^>]*)?>([\s\S]*?)<\/script>/gi;
  let scriptMatch;
  let scriptIdx = 0;
  while ((scriptMatch = scriptRegex.exec(content)) !== null) {
    scriptIdx++;
    const fullTag = scriptMatch[0];
    const jsCode = scriptMatch[1];

    if (/type=["']application\/(?:ld\+)?json["']/i.test(fullTag)) {
      try {
        JSON.parse(jsCode);
      } catch (err) {
        record(relPath, 'JSON_SYNTAX_ERROR', 'ERROR', `JSON Script #${scriptIdx} parse error: ${err.message}`);
      }
      continue;
    }

    if (/src=["']([^"']+)["']/i.test(fullTag)) {
      const src = fullTag.match(/src=["']([^"']+)["']/i)[1];
      if (!src.startsWith('http') && !src.startsWith('//') && !src.startsWith('data:')) {
        const target = src.startsWith('/') ? path.join(REPO_ROOT, 'sites', src) : path.resolve(dirPath, src);
        if (!fs.existsSync(target)) {
          record(relPath, 'BROKEN_SCRIPT_SRC', 'ERROR', `Script src not found: "${src}"`);
        }
      }
      continue;
    }

    if (!jsCode || !jsCode.trim()) continue;

    // Syntax validation
    try {
      new vm.Script(jsCode, { filename: `${relPath}:script[${scriptIdx}]` });
    } catch (err) {
      record(relPath, 'JS_SYNTAX_ERROR', 'ERROR', `Script #${scriptIdx} Syntax Error: ${err.message}`);
    }

    // DOM getElementById checks
    const getElemRegex = /document\.getElementById\(['"]([^'"]+)['"]\)/g;
    let gem;
    while ((gem = getElemRegex.exec(jsCode)) !== null) {
      const targetId = gem[1];
      if (!ids.has(targetId)) {
        // Exclude prefixes commonly created dynamically
        if (!['expl-', 'item-', 'user-', 'opt-', 'tab-', 'card-', 'step-', 'badge-', 'dot-', 'toast-', 'row-', 'bar-', 'filter-'].some(p => targetId.startsWith(p))) {
          record(relPath, 'MISSING_DOM_TARGET', 'WARNING', `getElementById("${targetId}") called, but no element with id="${targetId}" exists`);
        }
      }
    }
  }

  // 7. Event Handlers
  const onHandlerRegex = /\son[a-zA-Z]+=["']([^"']+)["']/g;
  let ohm;
  while ((ohm = onHandlerRegex.exec(content)) !== null) {
    const handlerVal = ohm[1].trim();
    // Exclude basic inline expressions like "if(...)", "return ...", "this.value..."
    const funcMatch = handlerVal.match(/^([a-zA-Z0-9_$]+)\s*\(/);
    if (funcMatch) {
      const funcName = funcMatch[1];
      if (['if', 'for', 'while', 'switch', 'return', 'print', 'alert', 'confirm', 'prompt', 'open', 'close', 'navigateChapter', 'toggleModAccordion', 'fetch', 'setTimeout', 'clearTimeout'].includes(funcName)) continue;
      // Search for function definition
      const funcRegex = new RegExp(`(function\\s+${funcName}|${funcName}\\s*=|window\\.${funcName}\\s*=)`);
      if (!funcRegex.test(content)) {
        record(relPath, 'UNDEFINED_EVENT_HANDLER', 'ERROR', `Inline handler calls undefined function "${funcName}()"`);
      }
    }
  }
}

// Print results grouped
const errors = issues.filter(i => i.severity === 'ERROR');
const warnings = issues.filter(i => i.severity === 'WARNING');

console.log(`Audit Finished: ${errors.length} ERRORS, ${warnings.length} WARNINGS found.\n`);

const grouped = {};
for (const iss of issues) {
  if (!grouped[iss.category]) grouped[iss.category] = [];
  grouped[iss.category].push(iss);
}

for (const [category, list] of Object.entries(grouped)) {
  const sev = list[0].severity;
  console.log(`=== [${sev}] ${category} (${list.length} occurrences) ===`);
  for (const item of list) {
    console.log(`  [${item.file}] ${item.message}`);
  }
  console.log();
}
