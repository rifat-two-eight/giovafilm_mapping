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

// Load locale files
const enJsonPath = './lib/i18n/locales/en.json';
const esJsonPath = './lib/i18n/locales/es.json';

const enJson = fs.existsSync(enJsonPath) ? JSON.parse(fs.readFileSync(enJsonPath, 'utf8')) : {};
const esJson = fs.existsSync(esJsonPath) ? JSON.parse(fs.readFileSync(esJsonPath, 'utf8')) : {};

console.log(`Loaded en.json keys count: ${Object.keys(enJson).length}`);

let totalHardcoded = 0;
const results = [];

dashboardFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  const fileIssues = [];

  // Match raw JSX text: >Text< where Text contains letters
  lines.forEach((line, index) => {
    const lineNum = index + 1;
    // Skip imports, comments
    if (line.trim().startsWith('import') || line.trim().startsWith('//') || line.trim().startsWith('/*')) return;

    // Check for raw JSX text outside t(...) calls
    // Pattern 1: > [A-Za-z0-9...,!?'" -]{2,} <
    const jsxTextRegex = />\s*([A-Za-z][A-Za-z0-9\s,.\-!?/:()'"]{2,})\s*</g;
    let match;
    while ((match = jsxTextRegex.exec(line)) !== null) {
      const text = match[1].trim();
      if (text && !text.includes('useLanguage') && !text.includes('className') && !text.includes('t(')) {
        fileIssues.push({ lineNum, type: 'JSX Text', text });
      }
    }

    // Pattern 2: placeholder="Static text"
    const placeholderRegex = /placeholder\s*=\s*["']([^"']+)["']/g;
    while ((match = placeholderRegex.exec(line)) !== null) {
      const text = match[1].trim();
      if (text && !text.startsWith('{')) {
        fileIssues.push({ lineNum, type: 'Placeholder', text });
      }
    }

    // Pattern 3: toast.error("..."), toast.success("...")
    const toastRegex = /toast\.(error|success|info|warning)\s*\(\s*["']([^"']+)["']/g;
    while ((match = toastRegex.exec(line)) !== null) {
      const text = match[2].trim();
      fileIssues.push({ lineNum, type: 'Toast Error/Msg', text });
    }

    // Pattern 4: throw new Error("..."), alert("...")
    const errRegex = /(?:throw\s+new\s+Error|alert)\s*\(\s*["']([^"']+)["']/g;
    while ((match = errRegex.exec(line)) !== null) {
      const text = match[1].trim();
      fileIssues.push({ lineNum, type: 'JS Error/Alert', text });
    }
  });

  if (fileIssues.length > 0) {
    results.push({ file, issues: fileIssues });
    totalHardcoded += fileIssues.length;
  }
});

console.log(`Found ${totalHardcoded} potentially static/hardcoded strings across ${results.length} files.`);
fs.writeFileSync('./scratch/hardcoded_results.json', JSON.stringify(results, null, 2));
