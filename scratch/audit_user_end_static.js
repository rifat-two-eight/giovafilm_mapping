const fs = require('fs');
const path = require('path');

const targetDirs = [
  path.join(__dirname, '../app/(common)'),
  path.join(__dirname, '../app/(auth)'),
  path.join(__dirname, '../components/Common'),
  path.join(__dirname, '../components/auth'),
  path.join(__dirname, '../components/shared'),
];

function getAllFiles(dirPath, arrayOfFiles = []) {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

const allFiles = targetDirs.flatMap((d) => getAllFiles(d));

const findings = [];

allFiles.forEach((filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  lines.forEach((line, idx) => {
    const lineNum = idx + 1;
    const trimmed = line.trim();

    // Ignore comments & imports & console.logs
    if (
      trimmed.startsWith('//') ||
      trimmed.startsWith('/*') ||
      trimmed.startsWith('*') ||
      trimmed.startsWith('import ') ||
      trimmed.startsWith('console.')
    ) {
      return;
    }

    // Check for hardcoded JSX text outside t(...) calls
    // Example: >Some English Text<
    const jsxTextMatch = trimmed.match(/>([^<>{}\\\n]+)</g);
    if (jsxTextMatch) {
      jsxTextMatch.forEach((match) => {
        const text = match.replace(/^>|<$/g, '').trim();
        // Ignore single symbols, numbers, punctuation, icon components, empty spaces
        if (
          text.length > 2 &&
          !/^[0-9\s.,!?:;$/%()#@&*\-+_=\\|"']+$/.test(text) &&
          !text.includes('${') &&
          !text.startsWith('t(')
        ) {
          findings.push({
            file: path.relative(path.join(__dirname, '..'), filePath),
            line: lineNum,
            type: 'JSX Text',
            text,
          });
        }
      });
    }

    // Check for hardcoded placeholders
    const placeholderMatch = trimmed.match(/placeholder=["']([^"']+)["']/);
    if (placeholderMatch) {
      const ph = placeholderMatch[1].trim();
      if (ph.length > 1 && !ph.startsWith('{')) {
        findings.push({
          file: path.relative(path.join(__dirname, '..'), filePath),
          line: lineNum,
          type: 'Input Placeholder',
          text: ph,
        });
      }
    }

    // Check for hardcoded toast messages
    const toastMatch = trimmed.match(/toast\.(success|error|info|warning)\(["']([^"']+)["']/);
    if (toastMatch) {
      const msg = toastMatch[2].trim();
      findings.push({
        file: path.relative(path.join(__dirname, '..'), filePath),
        line: lineNum,
        type: 'Toast Notification',
        text: msg,
      });
    }
  });
});

console.log(`Scanned ${allFiles.length} files in User End / Public section.`);
console.log(`Total static string occurrences found: ${findings.length}\n`);

const fileGroup = {};
findings.forEach((f) => {
  if (!fileGroup[f.file]) fileGroup[f.file] = [];
  fileGroup[f.file].push(f);
});

Object.keys(fileGroup).forEach((f) => {
  console.log(`File: ${f} (${fileGroup[f].length} items)`);
  fileGroup[f].slice(0, 10).forEach((item) => {
    console.log(`  [L${item.line}] [${item.type}] "${item.text}"`);
  });
  if (fileGroup[f].length > 10) {
    console.log(`  ... and ${fileGroup[f].length - 10} more`);
  }
  console.log('');
});

fs.writeFileSync(
  path.join(__dirname, 'user_end_audit_details.json'),
  JSON.stringify(findings, null, 2),
  'utf8'
);
