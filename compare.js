const fs = require('fs');

async function main() {
  console.log("Parsing KML file...");
  const kml = fs.readFileSync('d:/Mohosin/projects/giovafilm-roadtripeado/Roadtripeado Maps 1.0 🇵🇷.kml', 'utf8');
  const kmlNames = [...kml.matchAll(/<name>(.*?)<\/name>/g)].map(m => m[1].trim()).filter(n => n !== 'Roadtripeado Maps 1.0 🇵🇷');
  const uniqueKmlNames = new Set(kmlNames);
  console.log(`Found ${kmlNames.length} names in KML (${uniqueKmlNames.size} unique).`);

  console.log("Fetching places from DB...");
  let dbNames = [];
  try {
    const res = await fetch('http://10.10.26.208:5004/api/v1/place?limit=2000');
    if (!res.ok) console.log("Place API Error:", res.status, res.statusText);
    const data = await res.json();
    if (data && data.data && Array.isArray(data.data)) {
      dbNames = dbNames.concat(data.data.map(p => p.name?.trim()).filter(Boolean));
      console.log(`Fetched ${data.data.length} places.`);
    }
  } catch (e) {
    console.error("Error fetching places:", e.message);
  }

  try {
    const res = await fetch('http://10.10.26.208:5004/api/v1/business?limit=2000');
    if (!res.ok) console.log("Business API Error:", res.status, res.statusText);
    const data = await res.json();
    if (data && data.data && Array.isArray(data.data)) {
      dbNames = dbNames.concat(data.data.map(p => p.name?.trim()).filter(Boolean));
      console.log(`Fetched ${data.data.length} businesses.`);
    }
  } catch (e) {
    console.error("Error fetching businesses:", e.message);
  }

  const uniqueDbNames = new Set(dbNames);
  console.log(`Total unique names in DB: ${uniqueDbNames.size}`);

  const missingInDb = [...uniqueKmlNames].filter(name => {
    // try exact match or case-insensitive match
    return !dbNames.some(dbName => dbName.toLowerCase() === name.toLowerCase());
  });

  const extraInDb = [...uniqueDbNames].filter(name => {
    return !kmlNames.some(kmlName => kmlName.toLowerCase() === name.toLowerCase());
  });

  console.log(`\nPlaces in KML but missing in DB (${missingInDb.length}):`);
  if (missingInDb.length > 0) {
    console.log(missingInDb.slice(0, 20).join(', '));
    if (missingInDb.length > 20) console.log('...and more');
  } else {
    console.log("None!");
  }

  console.log(`\nPlaces in DB but not in KML (${extraInDb.length}):`);
  if (extraInDb.length > 0) {
    console.log(extraInDb.slice(0, 20).join(', '));
    if (extraInDb.length > 20) console.log('...and more');
  } else {
    console.log("None!");
  }
}

main();
