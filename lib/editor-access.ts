/** Normalize Mongo ids / populated refs to plain string ids */
export function normalizeId(id: unknown): string {
  if (id == null) return "";
  if (typeof id === "object") {
    const obj = id as { _id?: unknown };
    return obj._id != null ? String(obj._id) : "";
  }
  return String(id);
}

export function normalizeIdList(ids: unknown[] | undefined | null): string[] {
  if (!Array.isArray(ids)) return [];
  return Array.from(new Set(ids.map(normalizeId).filter(Boolean)));
}

type MapLike = { _id?: unknown; name?: string; country?: string | null };

/**
 * Toggle a map assignment and keep assignedCountries in sync with
 * the countries of currently selected maps (+ any manually kept extras).
 */
export function toggleMapAssignment(
  map: MapLike,
  checked: boolean,
  selectedMaps: string[],
  selectedCountries: string[],
  allMaps: MapLike[],
): { maps: string[]; countries: string[] } {
  const mapId = normalizeId(map._id);
  if (!mapId) {
    return { maps: selectedMaps, countries: selectedCountries };
  }

  let maps = [...selectedMaps];
  let countries = [...selectedCountries];

  if (checked) {
    if (!maps.includes(mapId)) maps.push(mapId);
    if (map.country && !countries.includes(map.country)) {
      countries.push(map.country);
    }
  } else {
    maps = maps.filter((id) => id !== mapId);
    if (map.country) {
      const stillUsedBySelectedMap = allMaps.some(
        (m) =>
          maps.includes(normalizeId(m._id)) && m.country === map.country,
      );
      if (!stillUsedBySelectedMap) {
        countries = countries.filter((c) => c !== map.country);
      }
    }
  }

  return { maps, countries };
}

/** Countries implied by the currently selected maps */
export function countriesFromSelectedMaps(
  selectedMaps: string[],
  allMaps: MapLike[],
): string[] {
  const set = new Set<string>();
  for (const map of allMaps) {
    if (selectedMaps.includes(normalizeId(map._id)) && map.country) {
      set.add(map.country);
    }
  }
  return Array.from(set);
}

type EditorUser = {
  role?: string;
  assignedMaps?: unknown[];
  assignedCountries?: string[];
} | null | undefined;

/** Whether a map_editor user can manage a given map / country */
export function editorCanAccessMap(
  user: EditorUser,
  mapId?: unknown,
  country?: string | null,
): boolean {
  if (!user || user.role !== "map_editor") return true;
  const assigned = new Set(normalizeIdList(user.assignedMaps));
  const countries = user.assignedCountries || [];
  const id = normalizeId(mapId);
  if (id && assigned.has(id)) return true;
  if (country && countries.includes(country)) return true;

  // assignedMaps may be populated with { _id, name, country }
  for (const raw of user.assignedMaps || []) {
    if (!raw || typeof raw !== "object") continue;
    const m = raw as { _id?: unknown; name?: string; country?: string };
    if (id && normalizeId(m._id) === id) return true;
    if (country && (m.name === country || m.country === country)) return true;
  }

  return false;
}

/**
 * Business.location.country may be a map name OR geographic country.
 * Optional allMaps lets country-only assignments resolve map-name businesses.
 */
export function editorCanAccessBusiness(
  user: EditorUser,
  businessCountry?: string | null,
  allMaps: MapLike[] = [],
): boolean {
  if (!user || user.role !== "map_editor") return true;
  const country = (businessCountry || "").trim();
  if (!country) return false;

  if (editorCanAccessMap(user, null, country)) return true;

  const match = allMaps.find(
    (m) => m.name === country || m.country === country,
  );
  if (match) {
    return editorCanAccessMap(user, match._id, match.country);
  }

  return false;
}
