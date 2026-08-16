export function asId(value: any): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  return String(value._id || value.id || "");
}

export type PlaceKind = "Business" | "Regular";

export function isPlaceKind(value: unknown): value is PlaceKind {
  return value === "Business" || value === "Regular";
}

/**
 * Map/discovery responses overwrite Place.type with "place" | "business"
 * (collection kind). The real Business|Regular value is in placeType.
 */
export function normalizePlaceType(source: unknown): PlaceKind {
  const record =
    source && typeof source === "object" ? (source as Record<string, unknown>) : null;
  const type = record ? record.type : source;
  const placeType = record ? record.placeType : undefined;

  // Prefer an explicit Business|Regular `type`. Fall back to `placeType` only
  // when `type` is the discovery discriminator ("place" / "business").
  if (isPlaceKind(type)) return type;
  if (isPlaceKind(placeType)) return placeType;

  for (const raw of [type, placeType]) {
    if (typeof raw !== "string") continue;
    const value = raw.trim().toLowerCase();
    if (value === "regular place" || value === "regular location") {
      return "Regular";
    }
  }

  return "Regular";
}

export function asMediaUrls(items: unknown): string[] {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => {
      if (typeof item === "string") return item;
      if (!item || typeof item !== "object") return "";
      const rec = item as Record<string, unknown>;
      const url = rec.url || rec.path || rec.src;
      return typeof url === "string" ? url : "";
    })
    .filter(Boolean);
}
