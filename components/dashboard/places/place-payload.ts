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

const COORD_EPSILON = 1e-6;

export function coordsChanged(
  next?: [number, number] | number[] | null,
  prev?: [number, number] | number[] | null,
): boolean {
  if (!next || next.length < 2) return false;
  if (!prev || prev.length < 2) return true;
  return (
    Math.abs(Number(next[0]) - Number(prev[0])) > COORD_EPSILON ||
    Math.abs(Number(next[1]) - Number(prev[1])) > COORD_EPSILON
  );
}

function omitEmpty(placeData: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(placeData).filter(([key, value]) => {
      if (value === undefined || value === null) return false;
      // Empty media arrays wipe photos on save — skip unless there are files
      if ((key === "media" || key === "menuImages") && Array.isArray(value) && value.length === 0) {
        return false;
      }
      return true;
    }),
  );
}

export function buildPlaceRequestBody(
  placeData: Record<string, unknown>,
  mediaFiles: File[] = [],
  menuFiles: File[] = [],
): FormData | Record<string, unknown> {
  const compactData = omitEmpty(placeData);
  if (mediaFiles.length === 0 && menuFiles.length === 0) {
    return compactData;
  }

  const formDataPayload = new FormData();
  formDataPayload.append("data", JSON.stringify(compactData));
  mediaFiles.forEach((file) => {
    if (file.type && file.type.startsWith("video/")) {
      formDataPayload.append("media", file);
    } else {
      formDataPayload.append("images", file);
    }
  });
  menuFiles.forEach((file) => {
    formDataPayload.append("documents", file);
  });
  return formDataPayload;
}
