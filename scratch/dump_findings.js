const fs = require('fs');
const path = require('path');

const results = JSON.parse(fs.readFileSync('./scratch/hardcoded_results.json', 'utf8'));

results.forEach(r => {
  console.log(`=== ${r.file} (${r.issues.length} items) ===`);
  r.issues.forEach(iss => {
    console.log(`  L${iss.lineNum} [${iss.type}]: "${iss.text}"`);
  });
});
