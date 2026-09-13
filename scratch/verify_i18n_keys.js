const fs = require('fs');
const path = require('path');

const enPath = path.join(__dirname, '..', 'lib', 'i18n', 'locales', 'en.json');
const esPath = path.join(__dirname, '..', 'lib', 'i18n', 'locales', 'es.json');

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const es = JSON.parse(fs.readFileSync(esPath, 'utf8'));

function getAllKeys(obj, prefix = '') {
  let keys = [];
  for (const k in obj) {
    const fullKey = prefix ? `${prefix}.${k}` : k;
    if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
      keys = keys.concat(getAllKeys(obj[k], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

const enKeys = getAllKeys(en);
const esKeys = getAllKeys(es);

const missingInEs = enKeys.filter(k => !esKeys.includes(k));
const missingInEn = esKeys.filter(k => !enKeys.includes(k));

console.log(`Total EN keys: ${enKeys.length}`);
console.log(`Total ES keys: ${esKeys.length}`);
console.log(`Missing in ES: ${missingInEs.length}`, missingInEs);
console.log(`Missing in EN: ${missingInEn.length}`, missingInEn);
