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

type MapLike = { _id?: unknown; country?: string | null };

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

/** Whether a map_editor user can manage a given map / country */
export function editorCanAccessMap(
  user: {
    role?: string;
    assignedMaps?: unknown[];
    assignedCountries?: string[];
  } | null | undefined,
  mapId?: unknown,
  country?: string | null,
): boolean {
  if (!user || user.role !== "map_editor") return true;
  const assigned = new Set(normalizeIdList(user.assignedMaps));
  const countries = user.assignedCountries || [];
  const id = normalizeId(mapId);
  if (id && assigned.has(id)) return true;
  if (country && countries.includes(country)) return true;
  return false;
}
