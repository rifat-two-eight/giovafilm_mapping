const fs = require('fs');

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoSWQiOiI2OWVmYzk5YTA2ODU3N2RjYmQ2ZDdmNWEiLCJyb2xlIjoic3VwZXJfYWRtaW4iLCJuYW1lIjoiTWQuIE1vaG9zaW4iLCJlbWFpbCI6IndlYi5tb2hvc2luQGdtYWlsLmNvbSIsImlhdCI6MTc4NjI2NTUxNCwiZXhwIjoxNzg3MTI5NTE0fQ.kXYBuL4_1sjc1WhMRMz81EtXzkL6-kpctq50d0xOrnY";

async function main() {
  console.log("Parsing KML file...");
  const kml = fs.readFileSync('d:/Mohosin/projects/giovafilm-roadtripeado/Roadtripeado Maps 1.0 🇵🇷.kml', 'utf8');
  
  const placemarks = [...kml.matchAll(/<Placemark>([\s\S]*?)<\/Placemark>/g)];
  const kmlData = {};
  
  for (const p of placemarks) {
    const content = p[1];
    let nameMatch = content.match(/<name>([\s\S]*?)<\/name>/);
    let descMatch = content.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/);
    if(!descMatch) descMatch = content.match(/<description>([\s\S]*?)<\/description>/);
    let coordMatch = content.match(/<coordinates>([\s\S]*?)<\/coordinates>/);
    
    if (nameMatch) {
      let name = nameMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim();
      let rawDescription = descMatch ? descMatch[1].trim() : "";

      const parsed = {
        videoUrl: "",
        access: "",
        description: "",
        recommendation: "",
        phone: "",
        website: "",
        kids: "",
        pets: "",
        disabled: "",
        preparation: "",
      };

      // Strip unicode bold for parsing purposes
      const stripUnicode = (str) => {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
          .replace(/[\u{1D400}-\u{1D7FF}]/gu, char => {
            let code = char.codePointAt(0);
            if (code >= 0x1D5D4 && code <= 0x1D5ED) return String.fromCharCode(code - 0x1D5D4 + 65);
            if (code >= 0x1D5EE && code <= 0x1D607) return String.fromCharCode(code - 0x1D5EE + 97);
            return char;
          });
      };

      // Create a plain text version for regex matching, replacing <br> with newlines
      let textForParsing = rawDescription.replace(/<br\s*\/?>/gi, '\n');
      textForParsing = stripUnicode(textForParsing);
      // We will remove HTML tags ONLY for the regex match string so it's clean to search
      let cleanTextForParsing = textForParsing.replace(/<[^>]+>/g, '');

      const extractSection = (regex) => {
        const match = cleanTextForParsing.match(regex);
        return match ? match[1].trim() : "";
      };

      parsed.videoUrl = extractSection(/Video del Lugar:\s*(.*?)(?:\n|[A-Z]{3,}:|$)/i);
      parsed.access = extractSection(/(?:FACIL ACCESO|ACCESO):\s*(.*?)(?:\n|[A-Z]{3,}:|$)/i);
      parsed.description = extractSection(/(?:EXPERIENCIA|CONCEPTO|HISTORIA|DETALLES):\s*(.*?)(?:\n|[A-Z]{3,}:|$)/i);
      
      // If there was no specific section for description, we fallback to plain clean text
      if (!parsed.description) {
        let fallbackDesc = cleanTextForParsing;
        
        // Remove known sections from the fallback description so they aren't duplicated
        const sectionsToRemove = [
          /Video del Lugar:.*?(?:\n|$)/ig,
          /𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗖𝗜𝗢𝗡:.*?(?:\n|$)/ig,
          /INFORMACION:.*?(?:\n|$)/ig,
          /Telefono:.*?(?:\n|$)/ig,
          /Horarios:.*?(?:\n|$)/ig,
          /Web:.*?(?:\n|$)/ig,
          /FACIL ACCESO:.*?(?:\n|$)/ig,
          /ACCESO:.*?(?:\n|$)/ig,
          /RECOMENDACION:.*?(?:\n|$)/ig,
          /PREPARACION:.*?(?:\n|$)/ig,
          /NINOS:.*?(?:\n|$)/ig,
          /IMPEDIDOS:.*?(?:\n|$)/ig,
          /MASCOTAS:.*?(?:\n|$)/ig,
        ];
        
        for (const regex of sectionsToRemove) {
          fallbackDesc = fallbackDesc.replace(regex, '');
        }
        
        parsed.description = fallbackDesc.trim();
      }
      
      parsed.recommendation = extractSection(/(?:RECOMENDACION|PREPARACION):\s*(.*?)(?:\n|[A-Z]{3,}:|$)/i);
      parsed.phone = extractSection(/Telefono:\s*(.*?)(?:\n|[A-Z]{3,}:|$)/i);
      parsed.website = extractSection(/Web:\s*(.*?)(?:\n|[A-Z]{3,}:|$)/i);
      
      const kidsMatch = cleanTextForParsing.match(/NINOS:\s*(SI|NO)/i);
      if (kidsMatch) parsed.kids = kidsMatch[1].toUpperCase() === 'SI';
      
      const petsMatch = cleanTextForParsing.match(/MASCOTAS:\s*(SI|NO)/i);
      if (petsMatch) parsed.pets = petsMatch[1].toUpperCase() === 'SI';

      let coordinates = [];
      if (coordMatch) {
        const coords = coordMatch[1].trim().split(',');
        if (coords.length >= 2) {
          coordinates = [parseFloat(coords[0]), parseFloat(coords[1])];
        }
      }

      kmlData[name.toLowerCase()] = { parsed, coordinates };
    }
  }

  console.log(`Parsed ${Object.keys(kmlData).length} places from KML.`);

  const fetchAll = async (url) => {
    try {
      const res = await fetch(url);
      const data = await res.json();
      return (data && data.data && Array.isArray(data.data)) ? data.data : [];
    } catch (e) {
      console.error("Fetch error:", e.message);
      return [];
    }
  };

  const dbPlaces = await fetchAll('http://10.10.26.208:5004/api/v1/place?limit=2000');
  const dbBusinesses = await fetchAll('http://10.10.26.208:5004/api/v1/business?limit=2000');
  
  const allDb = [...dbPlaces, ...dbBusinesses];
  console.log(`Fetched ${allDb.length} items from DB.`);

  let updates = [];

  for (const item of allDb) {
    if (!item.name) continue;
    const key = item.name.trim().toLowerCase();
    
    if (kmlData[key]) {
      const kmlItem = kmlData[key];
      let payload = {};
      
      // Update with parsed specific fields
      if (kmlItem.parsed.access) payload.access = kmlItem.parsed.access;
      if (kmlItem.parsed.phone) payload.phone = kmlItem.parsed.phone;
      if (kmlItem.parsed.website) payload.website = kmlItem.parsed.website;
      
      if (kmlItem.parsed.recommendation) {
        payload.recommendations = { tips: kmlItem.parsed.recommendation };
      }
      
      if (typeof kmlItem.parsed.kids === 'boolean') payload.isKidsFriendly = kmlItem.parsed.kids;
      if (typeof kmlItem.parsed.pets === 'boolean') payload.isPetsFriendly = kmlItem.parsed.pets;
      
      // Keep the FULL raw KML description which contains the images and all text
      if (kmlItem.parsed.description) {
         payload.description = kmlItem.parsed.description;
      }
      
      if (kmlItem.coordinates.length === 2) {
        payload.location = {
          type: "Point",
          coordinates: kmlItem.coordinates
        };
      }
      
      if (Object.keys(payload).length > 0) {
        updates.push({
          id: item._id,
          type: item.type === 'Business' ? 'business' : 'place',
          name: item.name,
          payload
        });
      }
    }
  }

  console.log(`Found ${updates.length} items to update.`);
  
  // EXECUTE UPDATES
  let successCount = 0;
  let failCount = 0;
  
  // Define sleep to prevent rate limiting
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  for (let i = 0; i < updates.length; i++) {
    const update = updates[i];
    try {
      const res = await fetch(`http://10.10.26.208:5004/api/v1/${update.type}/${update.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${TOKEN}`
        },
        body: JSON.stringify(update.payload)
      });
      
      if (res.ok) {
        successCount++;
        process.stdout.write(`\rUpdating... ${i+1}/${updates.length} (Success: ${successCount})`);
      } else {
        failCount++;
        console.log(`\nFailed to update ${update.name}: ${res.statusText}`);
      }
    } catch (e) {
      failCount++;
      console.log(`\nError updating ${update.name}: ${e.message}`);
    }
    
    // Add small delay
    await sleep(50);
  }
  
  console.log(`\n\nSync Complete!`);
  console.log(`Successfully updated: ${successCount}`);
  console.log(`Failed to update: ${failCount}`);
}

main();
