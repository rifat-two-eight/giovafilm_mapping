const fs = require('fs');

const en = JSON.parse(fs.readFileSync('./lib/i18n/locales/en.json', 'utf8'));
const es = JSON.parse(fs.readFileSync('./lib/i18n/locales/es.json', 'utf8'));

function getKeys(obj, prefix = '') {
  let keys = [];
  for (let key in obj) {
    const fullPath = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      keys = keys.concat(getKeys(obj[key], fullPath));
    } else {
      keys.push(fullPath);
    }
  }
  return keys;
}

const enKeys = getKeys(en);
const esKeys = getKeys(es);

const missingInEs = enKeys.filter(k => !esKeys.includes(k));
const missingInEn = esKeys.filter(k => !enKeys.includes(k));

console.log(`EN total keys: ${enKeys.length}`);
console.log(`ES total keys: ${esKeys.length}`);
console.log(`Keys in EN but missing in ES: ${missingInEs.length}`);
if (missingInEs.length > 0) {
  console.log('Missing in ES:', missingInEs);
}
console.log(`Keys in ES but missing in EN: ${missingInEn.length}`);
if (missingInEn.length > 0) {
  console.log('Missing in EN:', missingInEn);
}
