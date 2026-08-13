export function normalizePlaceName(value?: string | null): string {
  return (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function pinMatchesSelectedMap(
  pinCountry: string | null | undefined,
  selectedMap?: { name?: string; country?: string } | null,
  extraNames: Array<string | null | undefined> = [],
): boolean {
  const pin = normalizePlaceName(pinCountry);
  if (!pin) return false;

  const targets = [selectedMap?.country, selectedMap?.name, ...extraNames]
    .map(normalizePlaceName)
    .filter(Boolean);

  return targets.some(
    (target) => pin === target || pin.includes(target) || target.includes(pin),
  );
}
