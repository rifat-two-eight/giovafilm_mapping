const fs = require('fs');

async function main() {
  console.log("Parsing KML file...");
  const kml = fs.readFileSync('d:/Mohosin/projects/giovafilm-roadtripeado/Roadtripeado Maps 1.0 🇵🇷.kml', 'utf8');
  
  // Extract Placemarks
  const placemarks = [...kml.matchAll(/<Placemark>([\s\S]*?)<\/Placemark>/g)];
  
  const kmlData = {};
  
  for (const p of placemarks) {
    const content = p[1];
    let nameMatch = content.match(/<name>([\s\S]*?)<\/name>/);
    let descMatch = content.match(/<description>([\s\S]*?)<\/description>/);
    
    if (nameMatch) {
      let name = nameMatch[1].trim();
      // Remove CDATA from name if present
      name = name.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim();
      
      let description = descMatch ? descMatch[1].trim() : "";
      // Remove CDATA from description if present
      description = description.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim();
      // Strip HTML tags from description
      description = description.replace(/<[^>]*>?/gm, '').trim();
      
      kmlData[name.toLowerCase()] = description;
    }
  }

  console.log(`Extracted ${Object.keys(kmlData).length} unique places with descriptions from KML.`);

  console.log("Fetching places from DB...");
  let dbData = {};
  try {
    const res = await fetch('http://10.10.26.208:5004/api/v1/place?limit=2000');
    const data = await res.json();
    if (data && data.data && Array.isArray(data.data)) {
      data.data.forEach(p => {
        if (p.name) {
          let desc = p.description ? p.description.trim() : "";
          desc = desc.replace(/<[^>]*>?/gm, '').trim();
          dbData[p.name.trim().toLowerCase()] = desc;
        }
      });
    }
  } catch (e) {
    console.error("Error fetching places:", e.message);
  }

  try {
    const res = await fetch('http://10.10.26.208:5004/api/v1/business?limit=2000');
    const data = await res.json();
    if (data && data.data && Array.isArray(data.data)) {
      data.data.forEach(p => {
        if (p.name) {
          let desc = p.description ? p.description.trim() : "";
          desc = desc.replace(/<[^>]*>?/gm, '').trim();
          dbData[p.name.trim().toLowerCase()] = desc;
        }
      });
    }
  } catch (e) {
    console.error("Error fetching businesses:", e.message);
  }

  console.log(`Total unique places in DB: ${Object.keys(dbData).length}`);

  let matchCount = 0;
  let mismatchCount = 0;
  let missingDescInDbCount = 0;
  const mismatches = [];

  for (const [name, kmlDesc] of Object.entries(kmlData)) {
    if (dbData.hasOwnProperty(name)) {
      const dbDesc = dbData[name];
      
      // Normalize strings for comparison (remove extra spaces, newlines)
      const normKml = kmlDesc.replace(/\s+/g, ' ').trim();
      const normDb = dbDesc.replace(/\s+/g, ' ').trim();

      if (normKml === normDb) {
        matchCount++;
      } else if (normDb === "") {
        missingDescInDbCount++;
        mismatches.push({ name, reason: "DB has no description", kmlDesc: normKml, dbDesc: normDb });
      } else {
        mismatchCount++;
        mismatches.push({ name, reason: "Descriptions do not match", kmlDesc: normKml, dbDesc: normDb });
      }
    }
  }

  console.log(`\n--- Results ---`);
  console.log(`Matches: ${matchCount}`);
  console.log(`DB Missing Description: ${missingDescInDbCount}`);
  console.log(`Mismatches: ${mismatchCount}`);
  
  if (mismatches.length > 0) {
    fs.writeFileSync('description_mismatches.json', JSON.stringify(mismatches, null, 2));
    console.log(`\nSaved mismatches to description_mismatches.json for review.`);
  }
}

main();
