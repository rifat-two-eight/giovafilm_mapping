const fs = require('fs');
const path = require('path');

function getFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.next') && !file.includes('.git')) {
        getFiles(filePath, fileList);
      }
    } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const files = [...getFiles('app'), ...getFiles('components')];
console.log('Total TSX/TS files to check:', files.length);

let totalPotentialStatic = 0;
const results = {};

// Common English words or phrases patterns
const englishPattern = /\b(Select|Create|Add|Update|Delete|Save|Cancel|Edit|Remove|Search|Filter|Export|Import|Loading|Submit|Next|Back|Close|Open|View|Details|Actions|Status|Name|Email|Password|Phone|Address|Description|Title|Category|Type|Date|Time|Total|Active|Inactive|Pending|Approved|Rejected|Success|Error|Warning|Info|Confirm|Are you sure|Please|Required|Invalid|Failed|User|Role|Admin|Profile|Settings|Logout|Login|Register|Sign in|Sign up|Forgot|Reset|Verify|Code|Points|Reward|Promo|Offer|Discount|Price|Free|Location|Map|Image|Upload|Download|File|PDF|CSV)\b/i;

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  const matches = [];

  lines.forEach((line, index) => {
    // 1. Check for JSX text nodes containing English words >Text<
    const jsxTextMatches = line.match(/>\s*([A-Za-z][A-Za-z0-9\?\!\.\,\:\-\'\s]{2,})\s*</g);
    if (jsxTextMatches) {
      jsxTextMatches.forEach(m => {
        const text = m.replace(/^>\s*/, '').replace(/\s*<$/, '').trim();
        // Ignore component names or HTML tags or pure numbers/code
        if (text && englishPattern.test(text) && !text.includes('t(') && !text.startsWith('{') && !text.endsWith('}')) {
          // Exclude HTML element names or icon names or imports
          if (!/^(div|span|button|input|h1|h2|h3|h4|p|a|li|ul|ol|table|tr|td|th|thead|tbody|Form|FormField|FormItem|FormLabel|FormControl|FormMessage|Lucide|Icon)$/i.test(text)) {
            matches.push({ line: index + 1, type: 'JSX text', text });
          }
        }
      });
    }

    // 2. Check string literal placeholders: placeholder="Literal Text"
    const placeholderMatches = line.match(/placeholder=["']([^"']{3,})["']/g);
    if (placeholderMatches) {
      placeholderMatches.forEach(m => {
        const text = m.replace(/placeholder=["']/, '').replace(/["']$/, '').trim();
        if (text && englishPattern.test(text) && !text.includes('t(')) {
          matches.push({ line: index + 1, type: 'placeholder', text });
        }
      });
    }

    // 3. Check toast notifications: toast.error("Literal Text")
    const toastMatches = line.match(/toast\.(success|error|info|warning)\(["']([^"']{4,})["']\)/g);
    if (toastMatches) {
      toastMatches.forEach(m => {
        if (!m.includes('t(')) {
          matches.push({ line: index + 1, type: 'toast', text: m });
        }
      });
    }
  });

  if (matches.length > 0) {
    results[file] = matches;
    totalPotentialStatic += matches.length;
  }
});

console.log('Files with potential static text:', Object.keys(results).length);
console.log('Total potential static text instances:', totalPotentialStatic);
console.log('\n--- DETAILED AUDIT FINDINGS ---');
Object.keys(results).forEach(f => {
  console.log(`\nFile: ${f}`);
  results[f].forEach(m => {
    console.log(`  Line ${m.line} [${m.type}]: ${m.text}`);
  });
});
