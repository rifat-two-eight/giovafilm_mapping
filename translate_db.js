const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoSWQiOiI2OWVmYzk5YTA2ODU3N2RjYmQ2ZDdmNWEiLCJyb2xlIjoic3VwZXJfYWRtaW4iLCJuYW1lIjoiTWQuIE1vaG9zaW4iLCJlbWFpbCI6IndlYi5tb2hvc2luQGdtYWlsLmNvbSIsImlhdCI6MTc4NjI2NTUxNCwiZXhwIjoxNzg3MTI5NTE0fQ.kXYBuL4_1sjc1WhMRMz81EtXzkL6-kpctq50d0xOrnY";
const BASE_URL = "http://10.10.26.208:5004/api/v1";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Translate via MyMemory API (free, no key needed, 5000 words/day)
async function translateToEnglish(text) {
  if (!text || text.trim() === "" || text.trim() === "N/A") return text;
  
  // If already mostly English (no Spanish chars), skip
  const spanishPattern = /[áéíóúñü]/i;
  const spanishWords = /\b(este|esta|para|que|los|las|del|una|con|por|son|más|como|pero|donde|puede|desde|cuando|hasta|sobre)\b/i;
  if (!spanishPattern.test(text) && !spanishWords.test(text)) return text;
  
  try {
    // MyMemory API - completely free, no API key needed
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=es|en`;
    const res = await fetch(url);
    const data = await res.json();
    
    if (data.responseStatus === 200 && data.responseData && data.responseData.translatedText) {
      const translated = data.responseData.translatedText;
      // MyMemory returns "QUERY LENGTH LIMIT EXCEEDED" for long texts
      if (translated.includes("QUERY LENGTH LIMIT")) {
        // Split into chunks and translate separately
        const chunks = text.match(/.{1,400}/gs) || [text];
        const translatedChunks = [];
        for (const chunk of chunks) {
          const chunkUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(chunk)}&langpair=es|en`;
          const chunkRes = await fetch(chunkUrl);
          const chunkData = await chunkRes.json();
          translatedChunks.push(chunkData.responseData?.translatedText || chunk);
          await sleep(200);
        }
        return translatedChunks.join(" ");
      }
      return translated;
    }
    return text; // Return original if translation fails
  } catch (e) {
    return text;
  }
}

async function fetchAll(url) {
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data && data.data && Array.isArray(data.data) ? data.data : [];
  } catch (e) {
    console.error("Fetch error:", e.message);
    return [];
  }
}

async function main() {
  console.log("Fetching all places & businesses from DB...");
  const places = await fetchAll(`${BASE_URL}/place?limit=2000`);
  const businesses = await fetchAll(`${BASE_URL}/business?limit=2000`);
  const allItems = [...places, ...businesses];

  console.log(`Total items: ${allItems.length}`);

  const fieldsToTranslate = ["description", "access"];

  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;

  for (let i = 0; i < allItems.length; i++) {
    const item = allItems[i];
    const type = item.type === "Business" ? "business" : "place";

    let payload = {};
    let needsUpdate = false;

    for (const field of fieldsToTranslate) {
      const val = item[field];
      if (val && val.trim() !== "" && val.trim() !== "N/A") {
        const translated = await translateToEnglish(val);
        if (translated && translated !== val) {
          payload[field] = translated;
          needsUpdate = true;
        }
        await sleep(150);
      }
    }

    // Translate recommendations.tips
    if (item.recommendations && item.recommendations.tips && item.recommendations.tips.trim() !== "") {
      const translated = await translateToEnglish(item.recommendations.tips);
      if (translated && translated !== item.recommendations.tips) {
        payload.recommendations = { ...item.recommendations, tips: translated };
        needsUpdate = true;
      }
      await sleep(150);
    }

    if (!needsUpdate) {
      skipCount++;
      process.stdout.write(`\r[${i + 1}/${allItems.length}] Skipped: ${item.name.slice(0, 40)}`);
      continue;
    }

    try {
      const res = await fetch(`${BASE_URL}/${type}/${item._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        successCount++;
        process.stdout.write(`\r[${i + 1}/${allItems.length}] ✓ Updated: ${item.name.slice(0, 40)}          `);
      } else {
        failCount++;
        console.log(`\n✗ Failed to update ${item.name}: ${res.statusText}`);
      }
    } catch (e) {
      failCount++;
      console.log(`\n✗ Error: ${e.message}`);
    }

    await sleep(200);
  }

  console.log(`\n\n=== Done ===`);
  console.log(`✓ Updated: ${successCount}`);
  console.log(`→ Skipped: ${skipCount}`);
  console.log(`✗ Failed: ${failCount}`);
}

main();
