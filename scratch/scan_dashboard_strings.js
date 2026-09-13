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

console.log(`Found ${dashboardFiles.length} files to scan.`);

dashboardFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const hasUseLanguage = content.includes('useLanguage');
  const hasTCall = content.includes('t(');
  console.log(`${file}: useLanguage=${hasUseLanguage}, t()=${hasTCall}`);
});
