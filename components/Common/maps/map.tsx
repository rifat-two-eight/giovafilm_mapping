"use client";

import { CustomLocationButton } from "@/components/shared/maps/CustomLocationButton";
import { CategoryMarker } from "@/components/shared/maps/category-marker";
import { GeolocationOnLoad } from "@/components/shared/maps/geolocation-on-load";
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
import { useGetCategoriesQuery } from "@/redux/features/category/categoryApi";
import { useGetAvailableCountriesQuery } from "@/redux/features/map/mapApi";
import { useGetPlacesQuery } from "@/redux/features/place/placeApi";
import { useGetProfileQuery } from "@/redux/features/user/userApi";
import {
  AdvancedMarker,
  APIProvider,
  ControlPosition,
  Map,
  MapControl,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import {
  Utensils,
  Waves,
} from "lucide-react";
import { CategoryIcon } from "@/components/shared/categories/category-icon";
import { useEffect, useState } from "react";
import LocationDialog from "./location-dialog";
import { mapStyles } from "@/lib/utils";


export function getCategoryColor(cat: any) {
  return cat?.color || "#FF9800";
}

function CountryPanner({
  selectedCountry,
  isManualSelection,
}: {
  selectedCountry: string;
  isManualSelection: boolean;
}) {
  const map = useMap();
  const geocodingLib = useMapsLibrary("geocoding");

  useEffect(() => {
    if (
      !map ||
      !geocodingLib ||
      !selectedCountry ||
      selectedCountry === "all" ||
      !isManualSelection
    )
      return;

    const geocoder = new geocodingLib.Geocoder();
    geocoder.geocode({ address: selectedCountry }, (results, status) => {
      if (status === "OK" && results?.[0]) {
        if (results[0].geometry.viewport) {
          map.fitBounds(results[0].geometry.viewport);
        } else {
          map.setCenter(results[0].geometry.location);
          map.setZoom(6);
        }
      }
    });
  }, [selectedCountry, map, geocodingLib]);

  return null;
}

export default function MapPage() {
  const defaultPosition = { lat: 23.8103, lng: 90.4125 };
  const [markerPos, setMarkerPos] = useState(defaultPosition);

  const [enabledCategories, setEnabledCategories] = useState<
    Record<string, boolean>
  >({});
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [detectedCountry, setDetectedCountry] = useState<string>("");
  const [isManualSelection, setIsManualSelection] = useState(false);

  const { data: userProfile } = useGetProfileQuery({});
  const geocodingLib = useMapsLibrary("geocoding");

  const handleToggle = (id: string, value: boolean) => {
    setEnabledCategories((prev) => ({ ...prev, [id]: value }));
  };

  // --- API Fetches ---
  const { data: placesRes } = useGetPlacesQuery({
    limit: 100,
    country: selectedCountry || undefined,
  });
  const fetchedPlaces = placesRes?.data || [];

  const { data: categoriesRes } = useGetCategoriesQuery({ limit: 100 });
  const fetchedCategories = categoriesRes?.data || [];

  const { data: availableCountries = [] } = useGetAvailableCountriesQuery();

  // Detect country from markerPos (current location)
  useEffect(() => {
    if (!geocodingLib || !markerPos.lat || !markerPos.lng) return;

    const geocoder = new geocodingLib.Geocoder();
    geocoder.geocode({ location: markerPos }, (results, status) => {
      if (status === "OK" && results?.[0]) {
        const countryComponent = results[0].address_components.find((c) =>
          c.types.includes("country"),
        );
        if (countryComponent) {
          setDetectedCountry(countryComponent.long_name);
        }
      }
    });
  }, [markerPos, geocodingLib]);

  // Set initial selectedCountry based on detection, profile, or default to "all"
  useEffect(() => {
    // Only set automatically if it's currently "all" and not manually changed
    if (selectedCountry !== "all" || isManualSelection) return;

    if (detectedCountry) {
      setSelectedCountry(detectedCountry);
    } else if (userProfile?.country) {
      setSelectedCountry(userProfile.country);
    }
  }, [detectedCountry, userProfile, isManualSelection, selectedCountry]);

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
  }, [fetchedCategories, enabledCategories]);

  const [selectedLocation, setSelectedLocation] = useState<any>(null);

  const displayPlaces = fetchedPlaces.filter((place: any) => {
    // Country filter (Strict: must match selected country unless "all" is selected)
    if (selectedCountry && selectedCountry !== "all") {
      const placeCountry = place.location?.country || place.country;
      if (placeCountry?.toLowerCase() !== selectedCountry.toLowerCase())
        return false;
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
    <div className="">
      <div style={{ height: "calc(100vh - 90px)", width: "100%" }}>
        <APIProvider
          apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY as string}
        >
          <Map
            defaultCenter={defaultPosition}
            defaultZoom={13}
            minZoom={3}
            restriction={{
              latLngBounds: {
                north: 85,
                south: -85,
                west: -180,
                east: 180,
              },
              strictBounds: true,
            }}
            gestureHandling={"greedy"}
            disableDefaultUI={false}
            mapId={process.env.NEXT_PUBLIC_GOOGLE_MAP_ID as string}
            mapTypeControl={true}
            mapTypeControlOptions={{
              position: ControlPosition.TOP_RIGHT,
            }}
            clickableIcons={false}
            styles={mapStyles}
          >
            <GeolocationOnLoad onLocation={setMarkerPos} />
            <CountryPanner
              selectedCountry={selectedCountry}
              isManualSelection={isManualSelection}
            />

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
              const color = getCategoryColor(cat);

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
                <div className="flex flex-col md:flex-row gap-2">
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
                              const color = getCategoryColor(cat);
                              const enabled =
                                enabledCategories[cat._id] ?? true;
                              return (
                                <div
                                  key={cat._id}
                                  className={`flex items-center gap-3 px-2 py-2.5 rounded-xl transition-colors ${
                                    enabled
                                      ? ""
                                      : "hover:bg-gray-50 text-gray-800"
                                  }`}
                                >
                                  <CategoryIcon 
                                    icon={cat.icon} 
                                    size={24} 
                                    color={color} 
                                  />

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
                      onValueChange={(val) => {
                        setSelectedCountry(val);
                        setIsManualSelection(true);
                      }}
                      value={selectedCountry}
                    >
                      <SelectTrigger className="w-full py-6 border-none focus:ring-0 font-semibold text-gray-800 bg-white">
                        <SelectValue placeholder="Select Country" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border border-gray-100 shadow-xl capitalize">
                        <SelectItem
                          value="all"
                          className="capitalize font-medium"
                        >
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
