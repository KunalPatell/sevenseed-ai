const fs = require('fs');
const path = require('path');

const REPO = path.resolve(__dirname, '..');
const SITES_DIR = path.join(REPO, 'sites');
const STATIC_DIR = path.join(REPO, 'apps', 'sevenseed', 'backend', 'static');

console.log('='.repeat(70));
console.log('🔄 SYNCING SITES/ TO APPS/SEVENSEED/BACKEND/STATIC/');
console.log('='.repeat(70));

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 1. Copy entire sites/ into apps/sevenseed/backend/static/
console.log('Copying all files and directories from sites/ to backend/static/...');
copyDirRecursive(SITES_DIR, STATIC_DIR);

// 2. Ensure canonical <-> alias sync in backend/static/
const aliases = [
  ['comonk', 'comonk-ai'],
  ['decode-forest-pharmacy', 'pharmacy'],
  ['breakdown-factor', 'breakdown'],
  ['avp-charitable-trust', 'trust']
];

for (const [a, b] of aliases) {
  const dirA = path.join(STATIC_DIR, a);
  const dirB = path.join(STATIC_DIR, b);
  // Mirror dirA to dirB and dirB to dirA
  if (fs.existsSync(dirA)) copyDirRecursive(dirA, dirB);
  if (fs.existsSync(dirB)) copyDirRecursive(dirB, dirA);
  console.log(`Mirrored ${a} <-> ${b} in backend/static/`);
}

console.log('\nSync completed successfully!');
