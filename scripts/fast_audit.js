const fs = require('fs');
const path = require('path');
const vm = require('vm');

const REPO_ROOT = path.resolve(__dirname, '..');
const SITES_DIR = path.join(REPO_ROOT, 'sites');

console.log('='.repeat(60));
console.log('⚡ FAST IN-MEMORY CODE AUDIT');
console.log('='.repeat(60));

const bugs = [];

// Recursive directory walk excluding _next
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

const htmlFiles = getHtmlFiles(SITES_DIR);
console.log(`Auditing ${htmlFiles.length} HTML files in sites/...\n`);

for (const filePath of htmlFiles) {
  const relPath = path.relative(REPO_ROOT, filePath).replace(/\\/g, '/');
  const dirPath = path.dirname(filePath);
  const content = fs.readFileSync(filePath, 'utf8');

  // 1. Extract all element IDs
  const idRegex = /id=["']([^"']+)["']/g;
  const ids = new Set();
  const duplicateIds = new Set();
  let m;
  while ((m = idRegex.exec(content)) !== null) {
    const id = m[1];
    if (ids.has(id)) {
      duplicateIds.add(id);
    }
    ids.add(id);
  }
  for (const dup of duplicateIds) {
    bugs.push({ file: relPath, type: 'DUPLICATE_ID', detail: `Duplicate ID: #${dup}` });
  }

  // 2. Check internal links
  const hrefRegex = /href=["']([^"']+)["']/g;
  while ((m = hrefRegex.exec(content)) !== null) {
    const href = m[1].trim();
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:') || href.startsWith('data:')) continue;
    if (href.startsWith('http://') || href.startsWith('https://')) continue;

    if (href.startsWith('/')) {
      // Root-relative
      const cleanHref = href.split('?')[0].split('#')[0];
      const candidate1 = path.join(REPO_ROOT, 'sites', cleanHref);
      const candidate2 = path.join(REPO_ROOT, cleanHref);
      const candidate3 = path.join(REPO_ROOT, 'sites', cleanHref.replace(/^\//, ''));
      if (!fs.existsSync(candidate1) && !fs.existsSync(candidate2) && !fs.existsSync(candidate3)) {
        if (!cleanHref.includes('/app') && cleanHref !== '/' && !cleanHref.startsWith('/api/')) {
          bugs.push({ file: relPath, type: 'BROKEN_LINK', detail: `Root-relative link broken: href="${href}"` });
        }
      }
    } else {
      // Relative
      const cleanHref = href.split('?')[0].split('#')[0];
      if (cleanHref) {
        const targetPath = path.resolve(dirPath, cleanHref);
        if (!fs.existsSync(targetPath)) {
          bugs.push({ file: relPath, type: 'BROKEN_LINK', detail: `Relative link broken: href="${href}" -> missing file: ${cleanHref}` });
        }
      }
    }
  }

  // 2b. Check image sources
  const imgSrcRegex = /<img[^>]+src=["']([^"']+)["']/g;
  while ((m = imgSrcRegex.exec(content)) !== null) {
    const src = m[1].trim();
    if (!src || src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) continue;
    if (src.startsWith('/')) {
      const cleanSrc = src.split('?')[0].split('#')[0];
      const target = path.join(REPO_ROOT, 'sites', cleanSrc);
      if (!fs.existsSync(target)) {
        bugs.push({ file: relPath, type: 'BROKEN_IMAGE', detail: `Root-relative img src broken: "${src}"` });
      }
    } else {
      const cleanSrc = src.split('?')[0].split('#')[0];
      const target = path.resolve(dirPath, cleanSrc);
      if (!fs.existsSync(target)) {
        bugs.push({ file: relPath, type: 'BROKEN_IMAGE', detail: `Relative img src broken: "${src}"` });
      }
    }
  }

  // 2c. Check stylesheet links
  const cssRegex = /<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+)["']/g;
  while ((m = cssRegex.exec(content)) !== null) {
    const href = m[1].trim();
    if (!href || href.startsWith('http://') || href.startsWith('https://') || href.startsWith('data:')) continue;
    const cleanHref = href.split('?')[0].split('#')[0];
    const target = cleanHref.startsWith('/') ? path.join(REPO_ROOT, 'sites', cleanHref) : path.resolve(dirPath, cleanHref);
    if (!fs.existsSync(target)) {
      bugs.push({ file: relPath, type: 'BROKEN_STYLESHEET', detail: `Stylesheet missing: "${href}"` });
    }
  }

  // 3. Extract and validate all <script> blocks
  const scriptRegex = /<script(?:\s+[^>]*)?>([\s\S]*?)<\/script>/gi;
  let scriptMatch;
  let scriptIndex = 0;
  while ((scriptMatch = scriptRegex.exec(content)) !== null) {
    scriptIndex++;
    const fullTag = scriptMatch[0];
    const jsCode = scriptMatch[1];

    if (/type=["']application\/(?:ld\+)?json["']/i.test(fullTag)) {
      try {
        JSON.parse(jsCode);
      } catch (err) {
        bugs.push({ file: relPath, type: 'JSON_SYNTAX_ERROR', detail: `Script #${scriptIndex} JSON Error: ${err.message}` });
      }
      continue;
    }

    if (/src=["']([^"']+)["']/i.test(fullTag)) {
      const src = fullTag.match(/src=["']([^"']+)["']/i)[1];
      if (!src.startsWith('http') && !src.startsWith('//') && !src.startsWith('data:')) {
        const target = src.startsWith('/') ? path.join(REPO_ROOT, 'sites', src) : path.resolve(dirPath, src);
        if (!fs.existsSync(target)) {
          bugs.push({ file: relPath, type: 'MISSING_SCRIPT_SRC', detail: `Script src missing: "${src}"` });
        }
      }
      continue;
    }

    if (!jsCode || !jsCode.trim()) continue;

    // Syntax validation with vm.Script
    try {
      new vm.Script(jsCode, { filename: `${relPath}:script[${scriptIndex}]` });
    } catch (err) {
      bugs.push({ file: relPath, type: 'JS_SYNTAX_ERROR', detail: `Script #${scriptIndex} Syntax Error: ${err.message}` });
    }

    // 4. Check getElementById calls
    const getElemRegex = /document\.getElementById\(['"]([^'"]+)['"]\)/g;
    let gem;
    while ((gem = getElemRegex.exec(jsCode)) !== null) {
      const targetId = gem[1];
      if (!ids.has(targetId)) {
        // Exclude dynamically generated element IDs commonly appended in code
        if (!['expl-', 'item-', 'user-', 'opt-'].some(p => targetId.startsWith(p))) {
          bugs.push({ file: relPath, type: 'MISSING_DOM_ID', detail: `JS calls getElementById("${targetId}"), but #${targetId} is not in HTML!` });
        }
      }
    }
  }

  // 5. Check inline onclick / onchange handlers
  const onHandlerRegex = /\son[a-zA-Z]+=["']([^"']+)["']/g;
  let ohm;
  while ((ohm = onHandlerRegex.exec(content)) !== null) {
    const handlerVal = ohm[1].trim();
    const funcMatch = handlerVal.match(/^([a-zA-Z0-9_$]+)\s*\(/);
    if (funcMatch) {
      const funcName = funcMatch[1];
      if (['print', 'alert', 'confirm', 'prompt', 'open', 'close', 'navigateChapter', 'toggleModAccordion'].includes(funcName)) continue;
      // Search for function definition in content
      const funcRegex = new RegExp(`(function\\s+${funcName}|${funcName}\\s*=|window\\.${funcName}\\s*=)`);
      if (!funcRegex.test(content)) {
        bugs.push({ file: relPath, type: 'UNDEFINED_EVENT_HANDLER', detail: `Inline handler calls undefined function "${funcName}()"` });
      }
    }
  }
}

console.log(`Audit Complete. Found ${bugs.length} issues.\n`);

const grouped = {};
for (const b of bugs) {
  if (!grouped[b.type]) grouped[b.type] = [];
  grouped[b.type].push(b);
}

for (const [type, list] of Object.entries(grouped)) {
  console.log(`--- ${type} (${list.length} issues) ---`);
  for (const item of list.slice(0, 15)) {
    console.log(`  [${item.file}] ${item.detail}`);
  }
  if (list.length > 15) {
    console.log(`  ... and ${list.length - 15} more`);
  }
  console.log();
}
