const fs = require('fs');
const path = require('path');

const REPO = path.resolve(__dirname, '..');

// Helper to copy
function copy(src, dest) {
  const fullSrc = path.join(REPO, src);
  const fullDest = path.join(REPO, dest);
  fs.mkdirSync(path.dirname(fullDest), { recursive: true });
  fs.copyFileSync(fullSrc, fullDest);
  console.log(`Copied ${src} -> ${dest}`);
}

// 1. Sync marketing-examples.html to sites/comonk-ai/
copy('sites/comonk/marketing-examples.html', 'sites/comonk-ai/marketing-examples.html');
copy('sites/comonk/index.html', 'sites/comonk-ai/index.html');

// 2. Sync pharmacy wiki.html to sites/pharmacy/
copy('sites/decode-forest-pharmacy/wiki.html', 'sites/pharmacy/wiki.html');
copy('sites/decode-forest-pharmacy/index.html', 'sites/pharmacy/index.html');

// 3. Update Comonk subpages to include Marketing Gallery
const comonkDirs = ['sites/comonk', 'sites/comonk-ai'];
const comonkPages = ['resume-analyzer.html', 'interview-arena.html', 'salary-insights.html'];
for (const dir of comonkDirs) {
  for (const page of comonkPages) {
    const filePath = path.join(REPO, dir, page);
    let content = fs.readFileSync(filePath, 'utf8');
    if (!content.includes('marketing-examples.html')) {
      content = content.replace(
        /(<a href="salary-insights\.html"[^>]*>Salary Insights<\/a>)/,
        '$1\n      <a href="marketing-examples.html">Marketing Gallery</a>'
      );
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Added marketing-examples.html to ${dir}/${page}`);
    }
  }
}

// 4. Update Pharmacy subpages to include Health Wiki
const pharmDirs = ['sites/decode-forest-pharmacy', 'sites/pharmacy'];
const pharmPages = ['generic-finder.html', 'hospital-finder.html', 'interaction-checker.html', 'prescription-ocr.html'];
for (const dir of pharmDirs) {
  for (const page of pharmPages) {
    const filePath = path.join(REPO, dir, page);
    if (!fs.existsSync(filePath)) continue;
    let content = fs.readFileSync(filePath, 'utf8');
    if (!content.includes('wiki.html')) {
      content = content.replace(
        /(<a href="hospital-finder\.html"[^>]*>Hospital Finder<\/a>)/,
        '$1\n      <a href="wiki.html">Health Wiki</a>'
      );
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Added wiki.html to ${dir}/${page}`);
    }
  }
}

// 5. Update Sevenforce subpages to include Growth Teardowns
const sfPages = ['employees.html', 'workflows.html', 'pricing.html', 'devin-terminal.html'];
for (const page of sfPages) {
  const filePath = path.join(REPO, 'sites/sevenforce', page);
  if (!fs.existsSync(filePath)) continue;
  let content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes('growth-teardown.html')) {
    content = content.replace(
      /(<a href="pricing\.html"[^>]*>Pricing<\/a>)/,
      '$1\n        <a href="growth-teardown.html">Growth Teardowns</a>'
    );
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Added growth-teardown.html to sites/sevenforce/${page}`);
  }
}

// 6. Update AVPU subpages to include Varsity Modules & 100-Day Challenge
const avpuPages = ['code-lab.html', 'duo-league.html', 'marketing-teardowns.html', 'learn-dag.html', 'mental-models.html'];
for (const page of avpuPages) {
  const filePath = path.join(REPO, 'sites/avpu', page);
  if (!fs.existsSync(filePath)) continue;
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  if (!content.includes('modules.html') && content.includes('<a href="index.html">Home</a>')) {
    content = content.replace(
      '<a href="index.html">Home</a>',
      '<a href="index.html">Home</a>\n      <a href="modules.html">Varsity</a>'
    );
    changed = true;
  }
  if (!content.includes('100-day-challenge.html') && content.includes('challenge-100days.html')) {
    content = content.replaceAll('challenge-100days.html', '100-day-challenge.html');
    changed = true;
  }
  if (!content.includes('certifications.html') && content.includes('<a href="100-day-challenge.html"')) {
    content = content.replace(
      /(<a href="100-day-challenge\.html"[^>]*>.*?<\/a>)/,
      '$1\n      <a href="certifications.html">Certifications</a>'
    );
    changed = true;
  }
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated nav links in sites/avpu/${page}`);
  }
}

console.log('\nAll venture navigation and subpage files synced successfully!');
