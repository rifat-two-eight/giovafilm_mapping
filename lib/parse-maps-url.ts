const COORD_PATTERNS = [
  /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/,
  /[?&](?:q|query|ll|center)=(-?\d+\.\d+)[, ]+(-?\d+\.\d+)/i,
  /\/maps\/(?:search|place)\/(-?\d+\.\d+)[, ]+(-?\d+\.\d+)/i,
  /\/dir\/(-?\d+\.\d+),(-?\d+\.\d+)/,
  /[?&](?:destination|origin)=(-?\d+\.\d+),(-?\d+\.\d+)/i,
  /@(-?\d+\.\d+),(-?\d+\.\d+)/,
];

export const isShortMapsUrl = (url: string) =>
  /maps\.app\.goo\.gl|goo\.gl\/maps|g\.co\/maps/i.test(url);

export function parseCoordinatesFromMapsUrl(
  rawUrl: string,
): { lat: number; lng: number } | null {
  if (!rawUrl) return null;

  const cleaned = decodeURIComponent(
    rawUrl.replace(/[\u200B-\u200D\uFEFF]/g, "").trim(),
  )
    .replace(/,\s*\+/g, ",")
    .replace(/\+/g, " ");

  for (const url of [cleaned, rawUrl.trim()]) {
    for (const regex of COORD_PATTERNS) {
      const match = url.match(regex);
      if (!match) continue;
      const lat = Number(match[1]);
      const lng = Number(match[2]);
      if (
        Number.isFinite(lat) &&
        Number.isFinite(lng) &&
        Math.abs(lat) <= 90 &&
        Math.abs(lng) <= 180
      ) {
        return { lat, lng };
      }
    }
  }

  return null;
}
