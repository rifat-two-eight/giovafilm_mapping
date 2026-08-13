"use client";

import { AddCategoryDialog } from "@/components/dashboard/categories/AddCategoryDialog";

import { CategoryIcon } from "@/components/shared/categories/category-icon";
import { CategoryMarker } from "@/components/shared/maps/category-marker";
import { CustomLocationButton } from "@/components/shared/maps/CustomLocationButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mapStyles } from "@/lib/utils";
import { editorCanAccessMap } from "@/lib/editor-access";
import { useGetCategoriesQuery } from "@/redux/features/category/categoryApi";
import { useGetMapsQuery } from "@/redux/features/map/mapApi";
import { useGetProfileQuery } from "@/redux/features/user/userApi";
import {
  useCreatePlaceMutation,
  useUpdatePlaceMutation,
  useExtractCoordinatesMutation,
  useLazyGetPlaceDetailsQuery,
} from "@/redux/features/place/placeApi";
import { useGetPublicPlacesBusinessQuery } from "@/redux/features/public/publicApi";
import {
  AdvancedMarker,
  APIProvider,
  Map,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { ChevronRight, Map as MapIcon, Plus, Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PlaceInfoWindow } from "./PlaceInfoWindow";
import { asId, asMediaUrls } from "./place-payload";

// ─── Category color palette ────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, string> = {
  restaurant: "#EF4444",
  food: "#EF4444",
  cafe: "#F97316",
  coffee: "#F97316",
  hotel: "#8B5CF6",
  accommodation: "#8B5CF6",
  lodging: "#8B5CF6",
  park: "#10B981",
  nature: "#10B981",
  beach: "#06B6D4",
  shopping: "#F59E0B",
  store: "#F59E0B",
  mall: "#F59E0B",
  museum: "#6366F1",
  culture: "#6366F1",
  art: "#EC4899",
  hospital: "#EF4444",
  pharmacy: "#10B981",
  gas: "#64748B",
  transport: "#0EA5E9",
  airport: "#0EA5E9",
  bar: "#A855F7",
  nightlife: "#A855F7",
  sport: "#22C55E",
  gym: "#22C55E",
  default: "#3B82F6",
};

/**
 * Resolves a pin color from a category object.
 * Tries the category's own `color` field first,
 * then falls back to the CATEGORY_COLORS map keyed on name.
 */
function resolveCategoryColor(cat: any): string {
  if (!cat) return CATEGORY_COLORS.default;
  if (cat.color) return cat.color;
  const key = (cat.name || "").toLowerCase();
  for (const [k, v] of Object.entries(CATEGORY_COLORS)) {
    if (key.includes(k)) return v;
  }
  return CATEGORY_COLORS.default;
}

// ─── Inner component: pans to user's location once on mount ───────────────────
// Must live inside <APIProvider> so useMap() works.
function GeolocationOnLoad() {
  const map = useMap();

  useEffect(() => {
    if (!map || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      map.panTo({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    });
  }, [map]);

  return null;
}

function CountryPanner({ countryName }: { countryName: string | null }) {
  const map = useMap();
  const geocodingLib = useMapsLibrary("geocoding");

  useEffect(() => {
    if (!map || !geocodingLib || !countryName) return;

    const geocoder = new geocodingLib.Geocoder();
    geocoder.geocode({ address: countryName }, (results, status) => {
      if (status === "OK" && results?.[0]) {
        if (results[0].geometry.viewport) {
          map.fitBounds(results[0].geometry.viewport);
        } else {
          map.setCenter(results[0].geometry.location);
          map.setZoom(6);
        }
      }
    });
  }, [countryName, map, geocodingLib]);

  return null;
}

function MapPanner({
  position,
}: {
  position: { lat: number; lng: number } | null;
}) {
  const map = useMap();
  useEffect(() => {
    if (map && position) {
      map.panTo(position);
    }
  }, [map, position]);
  return null;
}

export default function AddPlacePage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  // filterCategoryId: the category clicked in the sidebar for map filtering
  // null = show all, otherwise show only places in that category
  const [filterCategoryId, setFilterCategoryId] = useState<string | null>(null);
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(
    null,
  );
  const [selectedMapId, setSelectedMapId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const defaultPosition = { lat: 23.8103, lng: 90.4125 };

  // --- API Fetches ---
  const { data: user } = useGetProfileQuery({});
  const { data: mapsRes } = useGetMapsQuery({ limit: 100 });
  const { data: categoriesRes } = useGetCategoriesQuery({ limit: 100 });
  const { data: placesRes } = useGetPublicPlacesBusinessQuery({
    limit: 1000,
    map: selectedMapId || ""
  });

  const rawMaps = mapsRes?.data || [];
  const maps =
    user?.role === "map_editor"
      ? rawMaps.filter((map: any) =>
        editorCanAccessMap(user, map._id, map.country),
      )
      : rawMaps;
  const categories = categoriesRes?.data || [];
  const fetchedPlaces = (placesRes?.data?.data ? placesRes.data.data : placesRes?.data) || [];
  const selectedMap = maps.find((m: any) => m._id === selectedMapId);

  // Track which place IDs are manually disabled (hidden from map)
  const [disabledPlaces, setDisabledPlaces] = useState<Set<string>>(new Set());
  // Track which category IDs are manually disabled (hidden from map)
  const [disabledCategories, setDisabledCategories] = useState<Set<string>>(new Set());

  const togglePlaceVisibility = (placeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDisabledPlaces((prev) => {
      const next = new Set(prev);
      if (next.has(placeId)) {
        next.delete(placeId);
      } else {
        next.add(placeId);
      }
      return next;
    });
  };

  const toggleCategoryVisibility = (categoryId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDisabledCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  // Map shows ALL places by default — only manually disabled ones are hidden
  const displayPlaces = fetchedPlaces.filter((place: any) => {
    const pCatId = typeof place.category === "object" ? place.category?._id : place.category;
    return !disabledPlaces.has(place._id) && (!pCatId || !disabledCategories.has(pCatId));
  });

  // --- States for Marker Management ---
  const [isAddingMarker, setIsAddingMarker] = useState(false);
  const [mapUrl, setMapUrl] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);

  const [tempMarker, setTempMarker] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<any | null>(null);
  const [draggedPositions, setDraggedPositions] = useState<
    Record<string, { lat: number; lng: number }>
  >({});

  const [formData, setFormData] = useState({ name: "", description: "" });
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);

  const updateAddressFromCoords = async (lat: number, lng: number) => {
    setIsFetchingAddress(true);
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}`
      );
      const data = await response.json();
      if (data.status === "OK" && data.results.length > 0) {
        const address = data.results[0].formatted_address;
        setSelectedPlace((prev: any) => (prev ? { ...prev, address } : null));
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    } finally {
      setIsFetchingAddress(false);
    }
  };

  const [createPlace, { isLoading: isCreating }] = useCreatePlaceMutation();
  const [fetchPlaceDetails] = useLazyGetPlaceDetailsQuery();
  const [updatePlace, { isLoading: isUpdating }] = useUpdatePlaceMutation();
  const [extractCoordinates] = useExtractCoordinatesMutation();

  const handleExtractLocation = async () => {
    let url = mapUrl;
    if (!url) {
      toast.error("Please enter a Google Maps URL first");
      return;
    }

    if (!selectedMapId) {
      toast.error("Please select a map first!");
      return;
    }

    if (!url.startsWith("http")) {
      url = `https://${url}`;
    }

    setIsExtracting(true);

    try {
      const response = await extractCoordinates({ url }).unwrap();

      if (response.success && response.data) {
        const newLat = response.data.lat;
        const newLng = response.data.lng;

        setTempMarker({ lat: newLat, lng: newLng });
        setSelectedPlace({
          position: { lat: newLat, lng: newLng },
          isNew: true,
          address: "",
        });
        updateAddressFromCoords(newLat, newLng);
        setFormData({ name: "", description: "" });
        setMapUrl("");
        setIsAddingMarker(false);
        toast.success("Location extracted successfully!");
      } else {
        toast.error("Could not extract coordinates from this URL.");
      }
    } catch (error: any) {
      console.error("Failed to extract location:", error);
      toast.error(
        error?.data?.message || "Could not extract coordinates. Try using the full URL from your browser address bar."
      );
    } finally {
      setIsExtracting(false);
    }
  };

  const handleMapClick = (e: any) => {
    if (!isAddingMarker) return;
    if (!selectedMapId) {
      toast.error("Please select a map first!");
      setIsAddingMarker(false);
      return;
    }
    const newLat = e.detail.latLng.lat;
    const newLng = e.detail.latLng.lng;

    setTempMarker({ lat: newLat, lng: newLng });
    setSelectedPlace({
      position: { lat: newLat, lng: newLng },
      isNew: true,
      address: "",
    });
    updateAddressFromCoords(newLat, newLng);
    setFormData({ name: "", description: "" });
    setIsAddingMarker(false);
  };

  const handleSelectPlace = async (place: any) => {
    const position = {
      lat: place?.location?.coordinates?.[1] || place?.latitude || 0,
      lng: place?.location?.coordinates?.[0] || place?.longitude || 0,
    };

    // Sync marker from discovery list first (slim payload — no description)
    setSelectedPlace({ ...place, position, isNew: false });

    const catId =
      typeof place.category === "object" ? place.category?._id : place.category;
    setSelectedCategoryId(catId || null);

    setFormData({
      name: place.name,
      description: place.description || "",
    });

    // Load full place details (description, etc.) on demand
    const placeId = place._id || place.id;
    if (!placeId) return;
    try {
      const res = await fetchPlaceDetails(String(placeId)).unwrap();
      const full = res?.data || res;
      if (!full) return;
      const fullCatId =
        typeof full.category === "object"
          ? full.category?._id
          : full.category;
      setSelectedCategoryId(fullCatId || catId || null);
      setFormData({
        name: full.name || place.name,
        description: full.description || "",
      });
      setSelectedPlace({ ...full, position, isNew: false });
    } catch {
      // Keep slim discovery fields if detail fetch fails
    }
  };

  const handleSavePlace = async (data?: any) => {
    const finalData = data || formData;
    console.log("finalData", finalData);
    const saveMarker = tempMarker || selectedPlace?.position || null;

    if (!saveMarker || !selectedMapId) return;

    if (!finalData.category && !selectedCategoryId) {
      toast.error("Please select a category first!");
      return;
    }

    try {
      const placeData = {
        name: finalData.name || "Untitled Place",
        map: selectedMapId,
        category: asId(finalData.category || selectedCategoryId),
        type: finalData.type || "Regular",
        description: finalData.description,
        location: {
          type: "Point",
          coordinates: [saveMarker.lng, saveMarker.lat],
        },
        address: finalData.address || "New Address",
        status: finalData.status || "Published",
        services: finalData.services || [],
        accessibility: {
          features: finalData.accessibility
            ? Object.entries(finalData.accessibility)
              .filter(([k, v]) => v === true && k !== "notes")
              .map(([k]) => k)
            : [],
          notes: finalData.accessibility?.notes || "",
        },
        access: finalData.accessDescription || "",
        recommendations: { tips: finalData.tips || "" },
        schedules: finalData.type === 'Business' ? undefined : (finalData.schedules || ""),
        operatingHours: finalData.type === 'Business' ? (finalData.operatingHours || null) : undefined,
        phone: finalData.type === 'Business' ? (finalData.phone || "") : undefined,
        website: finalData.type === 'Business' ? (finalData.website || "") : undefined,
        instagram: finalData.type === 'Business' ? (finalData.instagram || "") : undefined,
        entryCost: finalData.entryCost || "",
        hikeTime: finalData.hikeTime || "",
        atmosphere: finalData.atmosphere || "",
        difficulty: finalData.difficulty || undefined,
        media: asMediaUrls(finalData.existingImages),
        menuImages: asMediaUrls(finalData.existingMenuImages),
      };

      const hasMedia = finalData.mediaFiles && finalData.mediaFiles.length > 0;
      const hasMenu = finalData.menuFiles && finalData.menuFiles.length > 0;
      const isExisting = selectedPlace && !selectedPlace.isNew;

      const buildFormData = () => {
        const formDataPayload = new FormData();
        formDataPayload.append("data", JSON.stringify(placeData));
        if (hasMedia) {
          finalData.mediaFiles.forEach((file: File) => {
            if (file.type && file.type.startsWith("video/")) {
              formDataPayload.append("media", file);
            } else {
              formDataPayload.append("images", file);
            }
          });
        }
        if (hasMenu) {
          finalData.menuFiles.forEach((file: File) => {
            formDataPayload.append("documents", file);
          });
        }
        return formDataPayload;
      };

      if (isExisting) {
        await updatePlace({
          id: selectedPlace._id,
          data: buildFormData(),
        }).unwrap();
      } else if (hasMedia || hasMenu) {
        await createPlace(buildFormData()).unwrap();
      } else {
        await createPlace(placeData).unwrap();
      }

      toast.success(
        `Place ${finalData.status === "Published" ? "published" : "saved as draft"} successfully!`,
      );

      if (selectedPlace?._id) {
        setDraggedPositions((prev) => {
          const next = { ...prev };
          delete next[selectedPlace._id];
          return next;
        });
      }
      setSelectedPlace(null);
      setTempMarker(null);
      setFormData({ name: "", description: "" });
      setSelectedCategoryId(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save place");
      console.error("Failed to save place:", error);
    }
  };

  // Helper: find a category object by its _id
  const findCategoryById = (id: string | undefined) =>
    categories.find((c: any) => c._id === id);

  // The currently selected category (used for the temp marker icon)
  const activeCategory = findCategoryById(selectedCategoryId || undefined);

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY as string}>
      <div className="flex h-[85vh] w-full bg-white overflow-hidden font-sans rounded-2xl">
        {/* Sidebar */}
        <div className="w-80 flex flex-col border-r border-gray-200 bg-white z-20 shadow-sm">
          <div className="p-6 space-y-4">
            <div className="space-y-3">
              <div className="space-y-1">
                <h1 className="text-xl font-black tracking-tight text-gray-900 uppercase">
                  {selectedMap?.name || "Select a Map"}
                </h1>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Roadtripeado Maps 9.0</span>
                </div>
              </div>

              {/* Map Selector */}
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                  Active Map
                </Label>
                <Select
                  value={selectedMapId || ""}
                  onValueChange={setSelectedMapId}
                >
                  <SelectTrigger className="w-full bg-gray-50 border-gray-200">
                    <SelectValue placeholder="Choose a map..." />
                  </SelectTrigger>
                  <SelectContent position="popper" style={{ zIndex: 99999 }}>
                    {maps.map((map: any) => (
                      <SelectItem key={map._id} value={map._id}>
                        <div className="flex items-center gap-2">
                          <MapIcon size={14} className="text-blue-500" />
                          <span className="truncate">{map.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <div className="space-y-2">
                <button
                  onClick={() => {
                    if (!selectedMapId) {
                      toast.error("Please select a map before adding a place.");
                      return;
                    }
                    setIsAddingMarker((prev) => !prev);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors ${isAddingMarker
                    ? "bg-blue-600 text-white border-blue-600 shadow-md"
                    : "border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  <Plus size={16} />
                  {isAddingMarker
                    ? "Cancel Adding Place"
                    : "Add Place (Drop Pin)"}
                </button>

                {isAddingMarker && (
                  <div className="p-3 border border-gray-200 rounded-lg bg-gray-50 space-y-3 shadow-inner">
                    <p className="text-xs text-blue-600 font-medium">
                      Click anywhere on the map to drop a pin, OR use a Google
                      Maps URL:
                    </p>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">
                        Put Your Google Map Location Url
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          name="mapURL"
                          placeholder="https://maps.app.goo.gl/..."
                          value={mapUrl}
                          onChange={(e) => setMapUrl(e.target.value)}
                          className="flex-1 bg-white border-gray-200 text-xs h-8 px-2"
                        />
                        <Button
                          type="button"
                          onClick={handleExtractLocation}
                          disabled={isExtracting}
                          className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-3 py-1 h-8 text-xs rounded-md shadow-sm"
                        >
                          {isExtracting ? "..." : "Add Place"}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={() => setIsDialogOpen(true)}
                className="w-full flex items-center gap-3 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Plus size={16} /> Add Category
              </button>
            </div>

            {/* <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search places..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div> */}
          </div>

          {/* Categories List */}
          <div className="flex-1 overflow-y-auto px-2">
            <div className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Categories
            </div>

            <div className="space-y-1">
              {/* Show All Toggle */}
              <button
                onClick={() => {
                  setFilterCategoryId(null);
                  setExpandedCategoryId(null);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${filterCategoryId === null
                  ? "bg-gray-100 text-blue-600"
                  : "text-gray-400 hover:bg-gray-50"
                  }`}
              >
                <MapIcon size={14} />
                Show All Places
              </button>

              {categories
                .map((cat: any) => {
                  const placesInCat = fetchedPlaces.filter((p: any) => {
                    const pCatId = typeof p.category === "object" ? p.category?._id : p.category;
                    return pCatId === cat._id;
                  });
                  return { cat, placesInCat };
                })
                .filter(({ placesInCat }: { placesInCat: any[] }) => {
                  return placesInCat.length > 0;
                })
                .map(({ cat, placesInCat }: { cat: any; placesInCat: any[] }) => {
                  const isFilterActive = filterCategoryId === cat._id;
                  const isExpanded = expandedCategoryId === cat._id;

                  return (
                    <div key={cat._id} className="flex flex-col">
                      <div className="flex items-center hover:bg-gray-50 rounded-lg transition-colors w-full min-w-0">
                        <button
                          onClick={() => {
                            setFilterCategoryId(cat._id);
                            setSelectedCategoryId(cat._id);
                            setExpandedCategoryId(isExpanded ? null : cat._id);
                          }}
                          className={`flex-1 flex items-center justify-between px-4 py-2.5 text-sm transition-colors min-w-0 text-left ${isFilterActive
                            ? "bg-blue-50/50 text-blue-700 font-semibold rounded-l-lg"
                            : "text-gray-600"
                            }`}
                        >
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <ChevronRight
                              size={14}
                              className={`flex-shrink-0 transition-transform duration-200 ${isExpanded
                                ? "rotate-90 text-blue-500"
                                : "text-gray-300"
                                }`}
                            />
                            <CategoryIcon
                              icon={cat.icon}
                              size={22}
                              color={cat.color}
                            />
                            <span className="truncate pr-2">{cat.name}</span>
                          </div>
                          <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full flex-shrink-0 ml-1">
                            {placesInCat.length}
                          </span>
                        </button>

                        {/* Category Visibility Toggle Button */}
                        <button
                          onClick={(e) => toggleCategoryVisibility(cat._id, e)}
                          title={disabledCategories.has(cat._id) ? "Show category on map" : "Hide category from map"}
                          className="px-3 py-2.5 text-gray-400 hover:text-blue-600 transition-colors flex-shrink-0 border-l border-gray-100/50"
                        >
                          {disabledCategories.has(cat._id) ? (
                            <EyeOff size={16} className="text-gray-400" />
                          ) : (
                            <Eye size={16} className="text-blue-500" />
                          )}
                        </button>
                      </div>

                      {/* Expandable Place List */}
                      {isExpanded && (
                        <div className="ml-9 mt-1 mb-2 pl-4 border-l-2 border-blue-100 space-y-1 animate-in slide-in-from-top-1 duration-200">
                          {placesInCat.map((place: any) => {
                            const isDisabled = disabledPlaces.has(place._id);
                            return (
                              <div
                                key={place._id}
                                className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs transition-all ${selectedPlace?._id === place._id
                                  ? "bg-blue-600 text-white font-bold shadow-sm"
                                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                  } ${isDisabled ? "opacity-50" : ""}`}
                              >
                                {/* Visibility checkbox */}
                                <button
                                  onClick={(e) => togglePlaceVisibility(place._id, e)}
                                  title={isDisabled ? "Show on map" : "Hide from map"}
                                  className={`flex-shrink-0 w-4 h-4 rounded border transition-colors ${isDisabled
                                    ? "border-gray-300 bg-white"
                                    : selectedPlace?._id === place._id
                                      ? "border-blue-200 bg-blue-500"
                                      : "border-gray-400 bg-blue-500"
                                    }`}
                                >
                                  {!isDisabled && (
                                    <svg viewBox="0 0 10 10" className="w-full h-full p-0.5 text-white" fill="none" stroke="currentColor" strokeWidth="1.5">
                                      <polyline points="1.5,5 4,7.5 8.5,2.5" />
                                    </svg>
                                  )}
                                </button>
                                {/* Place name button */}
                                <button
                                  onClick={() => handleSelectPlace(place)}
                                  className="flex-1 text-left min-w-0"
                                >
                                  <div className="flex flex-col">
                                    <span className="truncate">{place.name}</span>
                                    <span
                                      className={`text-[9px] ${selectedPlace?._id === place._id ? "text-blue-100" : "text-gray-400"}`}
                                    >
                                      {place.address
                                        ? place.address.split(",")[0]
                                        : "No address"}
                                    </span>
                                  </div>
                                </button>
                              </div>
                            );
                          })}
                          {placesInCat.length === 0 && (
                            <p className="text-[10px] text-gray-400 italic py-2 pl-3">
                              No places in this category yet.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>

          {/* <div className="p-4 border-t border-gray-100 space-y-2">
            <button className="w-full text-left text-xs text-gray-500 hover:text-blue-600 transition-colors">
              Import places (CSV)
            </button>
            <button className="w-full text-left text-xs text-gray-500 hover:text-blue-600 transition-colors">
              Export map
            </button>
          </div> */}

          <div className="bg-gray-100 p-3 text-[10px] font-bold text-gray-500 uppercase">
            Selected Map: {selectedMap?.name || "None"}
          </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 relative">
          <div className="w-full h-full bg-gray-200">
            <Map
              defaultCenter={defaultPosition}
              defaultZoom={13}
              minZoom={3}
              maxZoom={19}
              renderingType={"RASTER"}
              gestureHandling={"greedy"}
              disableDefaultUI={false}
              mapId={process.env.NEXT_PUBLIC_GOOGLE_MAP_ID as string}
              onClick={handleMapClick}
              style={{ cursor: isAddingMarker ? "crosshair" : "grab" }}
            >
              {/* Pans to user's geolocation once on mount */}
              <GeolocationOnLoad />

              <CustomLocationButton />

              {/* Pans to selected country when map/country is chosen */}
              <CountryPanner countryName={selectedMap?.name || null} />

              <MapPanner position={selectedPlace?.position} />

              {/* ── Saved markers from server ── */}
              {displayPlaces.map((place: any) => {
                const placeId = place._id || place.id;
                const serverPosition = {
                  lat: place?.location?.coordinates?.[1] || place?.latitude,
                  lng: place?.location?.coordinates?.[0] || place?.longitude,
                };
                const position = (placeId && draggedPositions[placeId]) || serverPosition;

                if (!position.lat || !position.lng) return null;

                // Resolve category — it may be a populated object or just an ID string
                const cat =
                  typeof place.category === "object"
                    ? place.category
                    : findCategoryById(place.category);

                const isSelected = selectedPlace?._id === place._id;

                return (
                  <AdvancedMarker
                    key={place._id}
                    position={position}
                    draggable={true}
                    onDragEnd={(e: any) => {
                      if (!e.latLng || !placeId) return;
                      const newLat = e.latLng.lat();
                      const newLng = e.latLng.lng();
                      const updatedPosition = { lat: newLat, lng: newLng };

                      setDraggedPositions((prev) => ({
                        ...prev,
                        [placeId]: updatedPosition,
                      }));
                      setSelectedPlace((prev: any) => ({
                        ...(prev?._id === placeId ? prev : place),
                        position: updatedPosition,
                        isNew: false,
                      }));
                      updateAddressFromCoords(newLat, newLng);
                      toast.info("Location moved. Click Save to save changes.");

                      void (async () => {
                        try {
                          const res = await fetchPlaceDetails(String(placeId)).unwrap();
                          const full = res?.data || res;
                          if (!full) return;
                          const catId =
                            typeof full.category === "object"
                              ? full.category?._id
                              : full.category;
                          setSelectedCategoryId(catId || null);
                          setFormData({
                            name: full.name || "",
                            description: full.description || "",
                          });
                          setSelectedPlace((prev: any) => ({
                            ...full,
                            position: prev?.position || updatedPosition,
                            isNew: false,
                          }));
                        } catch (err) {
                          console.error("Failed to load details on drag", err);
                        }
                      })();
                    }}
                    onClick={() => handleSelectPlace(place)}
                  >
                    <CategoryMarker
                      icon={cat?.icon || "📍"}
                      color={resolveCategoryColor(cat)}
                      isSelected={isSelected}
                    />
                  </AdvancedMarker>
                );
              })}

              {/* ── Temporary marker (not yet saved) ── */}
              {tempMarker && (
                <AdvancedMarker
                  position={tempMarker}
                  draggable={true}
                  onDragEnd={(e: any) => {
                    if (e.latLng) {
                      const newLat = e.latLng.lat();
                      const newLng = e.latLng.lng();
                      setTempMarker({ lat: newLat, lng: newLng });
                      setSelectedPlace({
                        position: { lat: newLat, lng: newLng },
                        isNew: true,
                        address: ""
                      });
                      updateAddressFromCoords(newLat, newLng);
                    }
                  }}
                  onClick={() =>
                    setSelectedPlace({
                      position: tempMarker,
                      isNew: true,
                      address: selectedPlace?.address || "",
                    })
                  }
                >
                  <CategoryMarker
                    icon={activeCategory?.icon || "📍"}
                    color={resolveCategoryColor(activeCategory)}
                    isTemp={true}
                    isSelected={true}
                  />
                </AdvancedMarker>
              )}

              {/* ── InfoWindow for new or existing place ── */}
              {selectedPlace && (
                <PlaceInfoWindow
                  key={selectedPlace._id || "new-place"}
                  position={selectedPlace.position}
                  onClose={() => setSelectedPlace(null)}
                  categories={categories}
                  onSave={handleSavePlace}
                  isSaving={isCreating || isUpdating}
                  isFetchingAddress={isFetchingAddress}
                  initialData={{
                    ...selectedPlace,
                    category: selectedCategoryId || "",
                    type: selectedPlace.type || "Regular",
                    phone: selectedPlace.phone || "",
                    website: selectedPlace.website || "",
                    instagram: selectedPlace.instagram || "",
                    address: selectedPlace.address || "",
                    accessDescription: selectedPlace.access || selectedPlace.details?.access || "",
                    tips:
                      selectedPlace.recommendations?.tips || selectedPlace.details?.recommendations || "",
                    images: asMediaUrls(selectedPlace.media),
                    menuImages: asMediaUrls(selectedPlace.menuImages),
                    isNew: selectedPlace.isNew,
                  }}
                />
              )}
            </Map>
          </div>
        </div>

        <AddCategoryDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      </div>
    </APIProvider>
  );
}
