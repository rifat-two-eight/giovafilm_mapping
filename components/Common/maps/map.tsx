"use client";

import { CustomLocationButton } from "@/components/shared/maps/CustomLocationButton";
import { CategoryMarker } from "@/components/shared/maps/category-marker";
import { GeolocationOnLoad } from "@/components/shared/maps/geolocation-on-load";
import { mapStyles } from "@/lib/utils";
import { useGetCategoriesQuery } from "@/redux/features/category/categoryApi";
import { useGetAvailableCountriesQuery, useGetMapsQuery } from "@/redux/features/map/mapApi";
import { useGetPublicPlacesBusinessQuery } from "@/redux/features/public/publicApi";
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
import { MapFilters } from "./MapFilters";
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

  const [isMobile, setIsMobile] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { data: userProfile, isLoading: isLoadingUser } = useGetProfileQuery({});
  const isLoggedIn = !!userProfile;
  
  const geocodingLib = useMapsLibrary("geocoding");

  const handleToggle = (id: string, value: boolean) => {
    setEnabledCategories((prev) => ({ ...prev, [id]: value }));
  };

  const { data: mapsResponse } = useGetMapsQuery({ limit: 100 });
  const availableCountries = mapsResponse?.data?.map((m: any) => m.name) || [];

  const selectedMapObj = mapsResponse?.data?.find((m: any) => m.name === selectedCountry);
  const mapIdFilter = selectedMapObj ? selectedMapObj._id : "";

  const { data: placesRes } = useGetPublicPlacesBusinessQuery({
    limit: 1000,
    map: selectedCountry === "all" ? "" : mapIdFilter,
    // country: selectedCountry === "all" ? "" : selectedCountry, // keep map query parameter only to match what the user is selecting
  });

  const fetchedPlaces = Array.isArray(placesRes?.data)
    ? placesRes.data
    : Array.isArray(placesRes)
    ? placesRes
    : [];

  const { data: categoriesRes } = useGetCategoriesQuery({ limit: 100 });
  let fetchedCategories = Array.isArray(categoriesRes?.data)
    ? categoriesRes.data
    : Array.isArray(categoriesRes)
    ? categoriesRes
    : [];

  // If user is not logged in, filter to only business categories
  if (!isLoggedIn && !isLoadingUser) {
    fetchedCategories = fetchedCategories.filter(
      (cat: any) =>
        cat.type === "business" || cat.name?.toLowerCase().includes("business"),
    );
  }



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

  const displayPlaces = fetchedPlaces?.filter((place: any) => {
    // Country filter (Strict: must match selected country unless "all" is selected)
    // "Select Country" acts as Map selector in our setup
    if (selectedCountry && selectedCountry !== "all") {
      if (selectedMapObj) {
        const placeMapId = typeof place.map === 'object' ? place.map._id : place.map;
        if (placeMapId !== selectedMapObj._id) return false;
      } else {
        const placeCountry = place?.location?.country || place?.country;
        if (placeCountry?.toLowerCase() !== selectedCountry.toLowerCase())
          return false;
      }
    }

    // Category filter:
    // Show the place unless its category switch is explicitly set to false.
    const categoryId = place.category?._id || place.category;
    if (!categoryId) return true; // no category → always show

    // If user is not logged in, only show places in business categories
    if (!isLoggedIn && !isLoadingUser) {
      const isBusinessCategory = fetchedCategories.some(
        (cat: any) => cat._id === categoryId,
      );
      if (!isBusinessCategory) return false;
    }

    const id =
      typeof categoryId === "string" ? categoryId : categoryId.toString();

    // Missing key defaults to visible; only hide when explicitly false
    return enabledCategories[id] !== false;
  });

  if (!hasMounted) return null;

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
            mapTypeControl={!isMobile}
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
                      )?.location?.coordinates?.[1],
                      lng: displayPlaces.find(
                        (p: any) => p._id === selectedLocation.id,
                      )?.location?.coordinates?.[0],
                    }
                    : null
                  : null
              }
            />
            <CustomLocationButton />

            {/* User's current location marker — default pin style */}
            <AdvancedMarker position={markerPos} />

            {/* Render all fetched places as category-icon markers */}
            {displayPlaces?.map((place: any) => {
              const position = {
                lat: place?.location?.coordinates?.[1] || place?.latitude,
                lng: place?.location?.coordinates?.[0] || place?.longitude,
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
                      type: place.type,
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

            <MapControl position={ControlPosition.TOP_LEFT}>
              <div className="flex items-start gap-2 m-3">
                <MapFilters
                  isMobile={isMobile}
                  fetchedCategories={fetchedCategories}
                  enabledCategories={enabledCategories}
                  fetchedPlaces={fetchedPlaces}
                  handleToggle={handleToggle}
                  setSelectedLocation={setSelectedLocation}
                  selectedLocation={selectedLocation}
                  selectedCountry={selectedCountry}
                  setSelectedCountry={setSelectedCountry}
                  setIsManualSelection={setIsManualSelection}
                  availableCountries={availableCountries}
                />
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
