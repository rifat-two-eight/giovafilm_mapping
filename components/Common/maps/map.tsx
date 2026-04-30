"use client";

import { CategoryIcon } from "@/components/shared/categories/category-icon";
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
import { mapStyles } from "@/lib/utils";
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
import { useEffect, useState } from "react";
import LocationDialog from "./location-dialog";

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
    country: selectedCountry === "all" ? "" : selectedCountry,
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

            <MapPanner
              position={
                selectedLocation
                  ? displayPlaces.find(
                      (p: any) => p._id === selectedLocation.id,
                    )?.location?.coordinates
                    ? {
                        lat: displayPlaces.find(
                          (p: any) => p._id === selectedLocation.id,
                        ).location.coordinates[1],
                        lng: displayPlaces.find(
                          (p: any) => p._id === selectedLocation.id,
                        ).location.coordinates[0],
                      }
                    : null
                  : null
              }
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
                <div className="flex items-start gap-2">
                  <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden w-60">
                    <Accordion type="single" collapsible className="w-full">
                      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50/50">
                        <span className="text-sm font-black text-gray-900 uppercase tracking-tighter">
                          Map Categories
                        </span>
                      </div>
                      <div className="max-h-[50vh] overflow-y-auto ">
                        {fetchedCategories.map((cat: any) => {
                          const enabled = enabledCategories[cat._id] ?? true;
                          const placesInCat = fetchedPlaces.filter((p: any) => {
                            const pCatId =
                              typeof p.category === "object"
                                ? p.category?._id
                                : p.category;
                            return pCatId === cat._id;
                          });

                          return (
                            <AccordionItem
                              key={cat._id}
                              value={cat._id}
                              className=""
                            >
                              <div className="flex items-center justify-between group border-b border-gray-100 last:border-b-0">
                                <AccordionTrigger className="flex-1 py-2 px-4 transition-colors">
                                  <div className="flex items-center gap-3 w-full">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm">
                                      <CategoryIcon
                                        icon={cat.icon}
                                        size={18}
                                        color="#fff"
                                      />
                                    </div>
                                    <span className="flex-1 text-left text-sm font-bold text-gray-700 capitalize truncate">
                                      {cat.name}
                                    </span>
                                    {/* <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full mr-2">
                                      {placesInCat.length}
                                    </span> */}
                                  </div>
                                </AccordionTrigger>
                                <div className="pr-4 py-3 bg-transparent group-hover:bg-gray-50 transition-colors">
                                  <Switch
                                    checked={enabled}
                                    onCheckedChange={(val) =>
                                      handleToggle(cat._id, val)
                                    }
                                    className={`${enabled ? "bg-primary" : "bg-gray-300"} data-[state=checked]:bg-amber-400 data-[state=unchecked]:bg-gray-300 scale-75`}
                                  />
                                </div>
                              </div>
                              <AccordionContent className="bg-gray-50/30 px-0 pb-0">
                                <div className="py-1">
                                  {placesInCat.length > 0 ? (
                                    placesInCat.map((place: any) => (
                                      <button
                                        key={place._id}
                                        onClick={() =>
                                          setSelectedLocation({ id: place._id })
                                        }
                                        className={`w-full flex items-center gap-3 px-6 py-2 text-left transition-all ${
                                          selectedLocation?.id === place._id
                                            ? "bg-blue-600 text-white font-bold shadow-md"
                                            : "text-gray-600 hover:bg-white hover:text-blue-600"
                                        }`}
                                      >
                                        <div
                                          className={`w-1.5 h-1.5 rounded-full ${selectedLocation?.id === place._id ? "bg-white" : "bg-blue-400"}`}
                                        />
                                        <div className="flex flex-col min-w-0">
                                          <span className="truncate">
                                            {place.name}
                                          </span>
                                        </div>
                                      </button>
                                    ))
                                  ) : (
                                    <div className="px-10 py-3 text-gray-400 italic">
                                      No places in this category yet.
                                    </div>
                                  )}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          );
                        })}
                      </div>
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
