const fs = require('fs');
const path = require('path');

function getFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getFiles(filePath, fileList);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

const dashboardFiles = [
  ...getFiles('./app/(dashboard)'),
  ...getFiles('./components/dashboard')
];

const auditResults = [];

dashboardFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  const items = [];

  lines.forEach((line, idx) => {
    const lineNum = idx + 1;
    const trimmed = line.trim();

    if (trimmed.startsWith('import ') || trimmed.startsWith('//') || trimmed.startsWith('/*')) return;

    // 1. Toast messages
    const toastMatches = line.matchAll(/toast\.(error|success|info|warning|message)\s*\(\s*(?:\([^\)]*\)\s*=>\s*)?["']([^"']+)["']/g);
    for (const m of toastMatches) {
      if (!m[2].includes('t(')) {
        items.push({ lineNum, category: 'Toast Notification', text: m[2] });
      }
    }

    // 2. Alert / Error throw
    const alertMatches = line.matchAll(/(?:alert|throw\s+new\s+Error)\s*\(\s*["']([^"']+)["']/g);
    for (const m of alertMatches) {
      items.push({ lineNum, category: 'JS Alert/Error', text: m[1] });
    }

    // 3. Placeholders
    const placeholderMatches = line.matchAll(/placeholder\s*=\s*["']([^"']+)["']/g);
    for (const m of placeholderMatches) {
      if (!m[1].includes('{') && m[1].trim().length > 0) {
        items.push({ lineNum, category: 'Input Placeholder', text: m[1] });
      }
    }

    // 4. Labels and JSX text nodes (e.g. >Some Text<)
    const jsxTextMatches = line.matchAll(/>\s*([A-Z0-9][A-Za-z0-9\s,.\-!?/:()'"]{1,})\s*</g);
    for (const m of jsxTextMatches) {
      const txt = m[1].trim();
      // Filter out code symbols, CSS classes, numbers, single letters, etc.
      if (
        txt &&
        !txt.startsWith('useLanguage') &&
        !txt.startsWith('className') &&
        !txt.includes('t(') &&
        !txt.includes('=>') &&
        !/^[0-9+$\-.,\/#%:]+$/.test(txt) &&
        txt.length > 1
      ) {
        items.push({ lineNum, category: 'JSX Text', text: txt });
      }
    }

    // 5. Button or Badge title/label attributes: title="Static", label="Static"
    const attrMatches = line.matchAll(/(?:title|label|aria-label|description|alt|name)\s*=\s*["']([^"']+)["']/g);
    for (const m of attrMatches) {
      const txt = m[1].trim();
      if (
        txt &&
        !txt.includes('{') &&
        !['button', 'submit', 'text', 'number', 'email', 'checkbox', 'radio', 'hidden', 'file'].includes(txt.toLowerCase()) &&
        txt.length > 2
      ) {
        items.push({ lineNum, category: 'HTML Attribute', text: txt });
      }
    }
  });

  if (items.length > 0) {
    auditResults.push({ file, items });
  }
});

console.log(`=== AUDIT SUMMARY ===`);
console.log(`Total files with static strings: ${auditResults.length}`);
let totalItems = 0;
auditResults.forEach(res => {
  totalItems += res.items.length;
  console.log(`\nFile: ${res.file} (${res.items.length} items)`);
  res.items.forEach(it => {
    console.log(`  [L${it.lineNum}] [${it.category}] "${it.text}"`);
  });
});
console.log(`\nTotal static string occurrences found: ${totalItems}`);

fs.writeFileSync('./scratch/audit_details.json', JSON.stringify(auditResults, null, 2));
