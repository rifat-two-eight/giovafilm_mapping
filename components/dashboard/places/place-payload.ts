export function asId(value: any): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  return String(value._id || value.id || "");
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
