export function toExternalUrl(value?: string | null): string | null {
  const raw = (value || "").trim();
  if (!raw || raw.toLowerCase() === "n/a") return null;
  if (/^https?:\/\//i.test(raw)) return raw;
  return `https://${raw}`;
}

export function toInstagramUrl(value?: string | null): string | null {
  const raw = (value || "").trim();
  if (!raw || raw.toLowerCase() === "n/a") return null;
  if (/^https?:\/\//i.test(raw)) return raw;
  const handle = raw.replace(/^@/, "");
  return `https://instagram.com/${handle}`;
}
