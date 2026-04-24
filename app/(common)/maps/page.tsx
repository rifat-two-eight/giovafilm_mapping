"use client";

import LocationDialog from "@/components/Common/maps/location-dialog";
import { CustomLocationButton } from "@/components/shared/maps/CustomLocationButton";
import { CategoryMarker } from "@/components/shared/maps/category-marker";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { CLEAN_MAP_STYLES } from "@/lib/utils";
import { useGetCategoriesQuery } from "@/redux/features/category/categoryApi";
import { useGetAvailableCountriesQuery } from "@/redux/features/map/mapApi";
import { useGetPlacesQuery } from "@/redux/features/place/placeApi";
import {
  AdvancedMarker,
  APIProvider,
  ControlPosition,
  Map,
  MapControl,
  useMap,
} from "@vis.gl/react-google-maps";
import {
  Landmark,
  MapPin,
  MountainSnow,
  Trees,
  Umbrella,
  Utensils,
  Waves,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

// --- Dynamic Category Icons & Colors ---
const PREDEFINED_CATEGORIES: Record<string, { icon: any; color: string }> = {
  beaches: { icon: Umbrella, color: "#2196F3" },
  restaurants: { icon: Utensils, color: "#F44336" },
  parks: { icon: Trees, color: "#4CAF50" },
  rivers: { icon: Waves, color: "#03A9F4" },
  caves: { icon: MountainSnow, color: "#795548" },
  landmarks: { icon: Landmark, color: "#9C27B0" },
};

function getCategoryIcon(name: string) {
  const n = name?.toLowerCase() || "";
  return PREDEFINED_CATEGORIES[n]?.icon || MapPin;
}

function getCategoryColor(name: string) {
  const n = name?.toLowerCase() || "";
  return PREDEFINED_CATEGORIES[n]?.color || "#FF9800";
}

// ─── Map Categories Panel ─────────────────────────────────────────────────────
interface MapCategoriesPanelProps {
  onClose: () => void;
  categories: any[];
  enabledCategories: Record<string, boolean>;
  onToggle: (id: string, value: boolean) => void;
}

function MapCategoriesPanel({
  onClose,
  categories,
  enabledCategories,
  onToggle,
}: MapCategoriesPanelProps) {
  return (
    <div className="w-[230px] bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[60vh]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-shrink-0">
        <span className="text-base font-bold text-gray-900">
          Map Categories
        </span>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
        >
          <X size={16} />
        </button>
      </div>

      {/* Category list */}
      <div className="px-3 py-2 space-y-1 overflow-y-auto">
        {categories.map((cat) => {
          const Icon = getCategoryIcon(cat.name);
          const color = getCategoryColor(cat.name);
          const enabled = enabledCategories[cat._id] ?? true;
          return (
            <div
              key={cat._id}
              className={`flex items-center gap-3 px-2 py-2.5 rounded-xl transition-colors ${
                enabled ? "" : "hover:bg-gray-50 text-gray-800"
              }`}
            >
              {/* Colored icon circle */}
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: color }}
              >
                <Icon size={17} color="#fff" strokeWidth={2.2} />
              </div>

              {/* Label */}
              <span className="flex-1 text-sm font-medium capitalize truncate">
                {cat.name}
              </span>

              {/* Toggle — yellow when on, gray when off */}
              <Switch
                checked={enabled}
                onCheckedChange={(val) => onToggle(cat._id, val)}
                className={`${enabled ? "bg-primary" : "bg-gray-300"} data-[state=checked]:bg-amber-400 data-[state=unchecked]:bg-gray-300`}
              />
            </div>
          );
        })}
        {categories.length === 0 && (
          <div className="text-sm text-gray-500 text-center py-4">
            No categories found.
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Geolocation on load ──────────────────────────────────────────────────────
function GeolocationOnLoad({
  onLocation,
}: {
  onLocation: (pos: { lat: number; lng: number }) => void;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      const location = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      map.panTo(location);
      onLocation(location);
    });
  }, [map]);

  return null;
}

export default function MapPage() {
  const defaultPosition = { lat: 23.8103, lng: 90.4125 };
  const [markerPos, setMarkerPos] = useState(defaultPosition);

  // enabledCategories: true = visible, false = hidden
  // We start with an empty object and treat a missing key as true (visible) via ?? true
  const [enabledCategories, setEnabledCategories] = useState<
    Record<string, boolean>
  >({});
  const [selectedCountry, setSelectedCountry] = useState<string>("all");

  const handleToggle = (id: string, value: boolean) => {
    setEnabledCategories((prev) => ({ ...prev, [id]: value }));
  };

  // --- API Fetches ---
  const { data: placesRes } = useGetPlacesQuery({ limit: 100 });
  const fetchedPlaces = placesRes?.data || [];

  const { data: categoriesRes } = useGetCategoriesQuery({ limit: 100 });
  const fetchedCategories = categoriesRes?.data || [];

  const { data: availableCountries = [] } = useGetAvailableCountriesQuery();

  // Initialize all categories to true (visible) once loaded
  useEffect(() => {
    if (
      fetchedCategories.length > 0 &&
      Object.keys(enabledCategories).length === 0
    ) {
      const initial: Record<string, boolean> = {};
      fetchedCategories.forEach((c: any) => {
        initial[c._id] = true; // ← all switches ON by default
      });
      setEnabledCategories(initial);
    }
  }, [fetchedCategories]);

  const [selectedLocation, setSelectedLocation] = useState<any>(null);

  const displayPlaces = fetchedPlaces.filter((place: any) => {
    // Country filter
    if (selectedCountry !== "all") {
      const placeCountry = place.location?.country || place.country;
      if (placeCountry !== selectedCountry) return false;
    }

    // Category filter:
    // Show the place unless its category switch is explicitly set to false.
    const categoryId = place.category?._id || place.category;
    if (!categoryId) return true; // no category → always show

    const id =
      typeof categoryId === "string" ? categoryId : categoryId.toString();

    // Missing key defaults to visible; only hide when explicitly false
    return enabledCategories[id] !== false;
  });

  return (
    <div className="min-h-screen">
      <div style={{ height: "calc(100vh - 100px)", width: "100%" }}>
        <APIProvider
          apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY as string}
        >
          <Map
            defaultCenter={defaultPosition}
            defaultZoom={13}
            gestureHandling={"greedy"}
            disableDefaultUI={false}
            // Remove the mapId prop — inline styles don't work with Cloud-based Map IDs
            styles={CLEAN_MAP_STYLES} // ← add this
            mapTypeControl={true}
            mapTypeControlOptions={{
              position: ControlPosition.TOP_RIGHT,
            }}
          >
            {/* Pans once on mount — no controlled center prop needed */}
            <GeolocationOnLoad onLocation={setMarkerPos} />

            <CustomLocationButton />

            {/* User's current location marker — default pin style */}
            <AdvancedMarker position={markerPos} />

            {/* Render all fetched places as category-icon markers */}
            {displayPlaces.map((place: any) => {
              const position = {
                lat: place.location?.coordinates[1] || place.latitude,
                lng: place.location?.coordinates[0] || place.longitude,
              };

              if (!position.lat || !position.lng) return null;

              // Resolve category — may be a populated object or just an ID
              const cat =
                typeof place.category === "object"
                  ? place.category
                  : fetchedCategories.find(
                      (c: any) => c._id === place.category,
                    );

              const icon = cat?.icon || "📍";
              const color = getCategoryColor(cat?.name || "");

              return (
                <AdvancedMarker
                  key={place._id}
                  position={position}
                  onClick={() => {
                    setSelectedLocation({
                      id: place._id,
                    });
                  }}
                >
                  <CategoryMarker
                    icon={icon}
                    color={color}
                    isSelected={selectedLocation?.id === place._id}
                  />
                </AdvancedMarker>
              );
            })}

            {/* Categories panel — top-left overlay via MapControl */}
            <MapControl position={ControlPosition.TOP_LEFT}>
              <div className="flex items-start gap-2 m-3">
                {/* Category Filter */}
                {/* <MapCategoriesPanel
                  categories={fetchedCategories}
                  enabledCategories={enabledCategories}
                  onToggle={handleToggle}
                /> */}

                <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden w-60">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="categories" className="border-none">
                      <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-gray-50">
                        <span className="text-base font-bold text-gray-900">
                          Map Categories
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="pb-0">
                        <div className=" space-y-1 max-h-[40vh] overflow-y-auto">
                          {fetchedCategories.map((cat: any) => {
                            const Icon = getCategoryIcon(cat.name);
                            const color = getCategoryColor(cat.name);
                            const enabled = enabledCategories[cat._id] ?? true;
                            return (
                              <div
                                key={cat._id}
                                className={`flex items-center gap-3 px-2 py-2.5 rounded-xl transition-colors ${
                                  enabled
                                    ? ""
                                    : "hover:bg-gray-50 text-gray-800"
                                }`}
                              >
                                <div
                                  className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                                  style={{ backgroundColor: color }}
                                >
                                  <Icon
                                    size={17}
                                    color="#fff"
                                    strokeWidth={2.2}
                                  />
                                </div>

                                <span className="flex-1 text-sm font-medium capitalize truncate">
                                  {cat.name}
                                </span>

                                <Switch
                                  checked={enabled}
                                  onCheckedChange={(val) =>
                                    handleToggle(cat._id, val)
                                  }
                                  className={`${enabled ? "bg-primary" : "bg-gray-300"} data-[state=checked]:bg-amber-400 data-[state=unchecked]:bg-gray-300`}
                                />
                              </div>
                            );
                          })}
                          {fetchedCategories.length === 0 && (
                            <div className="text-sm text-gray-500 text-center py-4">
                              No categories found.
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>

                {/* Country Filter */}
                <div className="w-40 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                  <Select
                    onValueChange={setSelectedCountry}
                    value={selectedCountry}
                  >
                    <SelectTrigger className="w-full py-6 border-none focus:ring-0 font-semibold text-gray-800 bg-white">
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border border-gray-100 shadow-xl capitalize">
                      <SelectItem value="all" className="font-medium">
                        All Countries
                      </SelectItem>
                      {availableCountries.map((country: string) => (
                        <SelectItem
                          key={country}
                          value={country}
                          className="capitalize font-medium"
                        >
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </MapControl>
          </Map>
        </APIProvider>

        {/* Location Dialog Overlay */}
        {selectedLocation && (
          <LocationDialog
            id={selectedLocation}
            onClose={() => setSelectedLocation(null)}
          />
        )}
      </div>
    </div>
  );
}
