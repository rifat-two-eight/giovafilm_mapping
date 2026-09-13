const fs = require('fs');
const path = require('path');

function getFiles(dir, fileList = []) {
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

dashboardFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  const untranslatedLines = [];

  lines.forEach((line, idx) => {
    // Check for hardcoded text inside JSX tags like >Text< or placeholder="Text"
    const textMatch = line.match(/>([^<>{}\n]+)</);
    const placeholderMatch = line.match(/placeholder="([^"{}\n]+)"/);
    const titleMatch = line.match(/title="([^"{}\n]+)"/);

    if (textMatch && textMatch[1].trim().length > 1 && !textMatch[1].trim().startsWith('//')) {
      const text = textMatch[1].trim();
      if (!/^[\d\s.,\/#!$%\^&\*;:{}=\-_`~()]+$/.test(text)) {
        untranslatedLines.push({ line: idx + 1, text, type: 'JSX Text' });
      }
    }
    if (placeholderMatch && placeholderMatch[1].trim().length > 1) {
      untranslatedLines.push({ line: idx + 1, text: placeholderMatch[1].trim(), type: 'Placeholder' });
    }
    if (titleMatch && titleMatch[1].trim().length > 1) {
      untranslatedLines.push({ line: idx + 1, text: titleMatch[1].trim(), type: 'Title' });
    }
  });

  if (untranslatedLines.length > 0) {
    console.log(`\n=== ${file} (${untranslatedLines.length} potential untranslated items) ===`);
    untranslatedLines.slice(0, 15).forEach(item => console.log(`  L${item.line} [${item.type}]: "${item.text}"`));
    if (untranslatedLines.length > 15) {
      console.log(`  ... and ${untranslatedLines.length - 15} more.`);
    }
  }
});
