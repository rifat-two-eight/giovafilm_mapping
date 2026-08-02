"use client";

import { CustomLocationButton } from "@/components/shared/maps/CustomLocationButton";
import { CategoryMarker } from "@/components/shared/maps/category-marker";
import { GeolocationOnLoad } from "@/components/shared/maps/geolocation-on-load";
import { mapStyles } from "@/lib/utils";
import { useGetCategoriesQuery } from "@/redux/features/category/categoryApi";
import { useGetMapsQuery } from "@/redux/features/map/mapApi";
import { useGetPublicPlacesBusinessQuery } from "@/redux/features/public/publicApi";
import { useGetProfileQuery } from "@/redux/features/user/userApi";
import { useAppSelector } from "@/redux/hook";
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
      !isManualSelection
    )
      return;

    const geocoder = new geocodingLib.Geocoder();
    geocoder.geocode(
      { address: selectedCountry },
      (results: any[] | null, status: string) => {
        if (status === "OK" && results?.[0]) {
          if (results[0].geometry.viewport) {
            map.fitBounds(results[0].geometry.viewport);
          } else {
            map.setCenter(results[0].geometry.location);
            map.setZoom(6);
          }
        }
      },
    );
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

  const [selectedCountry, setSelectedCountry] = useState<string>("");
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

  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const {
    data: userProfile,
    isLoading: isLoadingUser,
    isFetching: isFetchingUser,
  } = useGetProfileQuery({}, { skip: !accessToken });
  const isLoggedIn = !!userProfile;
  // Guests skip profile; logged-in users wait until profile request finishes
  const isUserResolved = !accessToken || (!isLoadingUser && !isFetchingUser) || !!userProfile;

  const geocodingLib = useMapsLibrary("geocoding");

  const handleToggle = (id: string, value: boolean) => {
    setEnabledCategories((prev) => ({ ...prev, [String(id)]: value }));
  };

  const {
    data: mapsResponse,
    isLoading: isLoadingMaps,
    isFetching: isFetchingMaps,
    isSuccess: isMapsSuccess,
  } = useGetMapsQuery({
    limit: 100,
  });
  const availableCountries = mapsResponse?.data?.map((m: any) => m.name) || [];

  const selectedMapObj = mapsResponse?.data?.find((m: any) => m.name === selectedCountry);
  const mapIdFilter = selectedMapObj ? String(selectedMapObj._id) : "";
  const canFetchPlaces = Boolean(mapIdFilter);

  const {
    data: placesRes,
    isLoading: isLoadingPlaces,
    isFetching: isFetchingPlaces,
    isSuccess: isPlacesSuccess,
    isError: isPlacesError,
  } = useGetPublicPlacesBusinessQuery(
    {
      limit: 1000,
      map: mapIdFilter,
    },
    { skip: !canFetchPlaces },
  );

  // Only treat discovery as settled for the *current* map after its fetch completes.
  // Cleared immediately when mapId changes so empty-state cannot flash mid-switch.
  const [settledMapId, setSettledMapId] = useState<string | null>(null);

  useEffect(() => {
    setSettledMapId(null);
  }, [mapIdFilter]);

  useEffect(() => {
    if (!mapIdFilter) return;
    if ((isPlacesSuccess || isPlacesError) && !isFetchingPlaces && !isLoadingPlaces) {
      setSettledMapId(mapIdFilter);
    }
  }, [
    mapIdFilter,
    isPlacesSuccess,
    isPlacesError,
    isFetchingPlaces,
    isLoadingPlaces,
  ]);

  const isPlacesSettledForMap =
    !!mapIdFilter && settledMapId === mapIdFilter;

  const fetchedPlaces = Array.isArray(placesRes?.data)
    ? placesRes.data
    : Array.isArray(placesRes)
      ? placesRes
      : [];

  const {
    data: categoriesRes,
    isLoading: isLoadingCategories,
    isSuccess: isCategoriesSuccess,
    isError: isCategoriesError,
  } = useGetCategoriesQuery({ limit: 100 });

  const rawCategories = Array.isArray(categoriesRes?.data)
    ? categoriesRes.data
    : Array.isArray(categoriesRes)
      ? categoriesRes
      : [];

  const isCategoriesSettled =
    (isCategoriesSuccess || isCategoriesError) && !isLoadingCategories;

  const isMapsSettled =
    (isMapsSuccess || (!isLoadingMaps && !isFetchingMaps)) && !isLoadingMaps;

  // Selected map name exists in list but id not resolved yet, OR still picking a map
  const mapMissingAfterMapsLoaded =
    isMapsSettled &&
    !!selectedCountry &&
    availableCountries.length > 0 &&
    !availableCountries.includes(selectedCountry);

  // Strict gate: spinner until EVERY dependency for the sidebar is ready.
  // Empty state is ONLY allowed after this is false.
  const isSidebarLoading =
    !hasMounted ||
    !isUserResolved ||
    !isMapsSettled ||
    !isCategoriesSettled ||
    !selectedCountry ||
    (!mapIdFilter && !mapMissingAfterMapsLoaded) ||
    (canFetchPlaces &&
      (!isPlacesSettledForMap ||
        isLoadingPlaces ||
        (isFetchingPlaces && settledMapId !== mapIdFilter)));

  // Identify categories that are inherently "business"
  const inherentlyBusinessCatIds = new Set(
    rawCategories
      // Backend Category has no `type` field — detect by name only
      .filter((cat: any) => cat.name?.toLowerCase().includes("business"))
      .map((cat: any) => String(cat._id)),
  );

  // Discovery overwrites Place.type with "place"; original Business|Regular lives in placeType.
  // Business-collection rows use type "business".
  const isBusinessLocation = (p: any) =>
    p?.type === "business" ||
    p?.type === "Business" ||
    p?.placeType === "Business";

  const getCategoryId = (p: any) => {
    const raw =
      typeof p.category === "object" && p.category !== null
        ? p.category._id || p.category.id
        : p.category;
    return raw != null ? String(raw) : "";
  };

  // Places are scoped by map id; Business docs have no `map` — match by country/map name.
  const belongsToSelectedMap = (place: any) => {
    if (!selectedCountry) return true;

    if (place?.type === "business" || place?.map == null) {
      const placeCountry = place?.location?.country || place?.country || "";
      const target = selectedMapObj?.name || selectedCountry;
      return placeCountry.toLowerCase() === String(target).toLowerCase();
    }

    if (selectedMapObj) {
      const placeMapId =
        typeof place.map === "object" ? place.map._id : place.map;
      return String(placeMapId) === String(selectedMapObj._id);
    }

    const placeCountry = place?.location?.country || place?.country || "";
    return placeCountry.toLowerCase() === selectedCountry.toLowerCase();
  };

  let fetchedCategories: any[] = [];

  // Never compute empty sidebar lists until loading is fully done for this map.
  if (!isSidebarLoading && isPlacesSettledForMap) {
    fetchedCategories = [...rawCategories];

    if (!isLoggedIn) {
      const businessPlaceCatIds = new Set(
        fetchedPlaces
          .filter(isBusinessLocation)
          .map(getCategoryId)
          .filter(Boolean),
      );

      fetchedCategories = fetchedCategories.filter(
        (cat: any) =>
          inherentlyBusinessCatIds.has(String(cat._id)) ||
          businessPlaceCatIds.has(String(cat._id)),
      );
    }

    const validPlacesForCurrentCountry =
      fetchedPlaces?.filter(belongsToSelectedMap) || [];

    const validCatIds = new Set(
      validPlacesForCurrentCountry.map(getCategoryId).filter(Boolean),
    );

    fetchedCategories = fetchedCategories.filter((cat: any) =>
      validCatIds.has(String(cat._id)),
    );
  }

  // Detect country from markerPos (current location)
  useEffect(() => {
    if (!geocodingLib || !markerPos.lat || !markerPos.lng) return;

    const geocoder = new geocodingLib.Geocoder();
    geocoder.geocode(
      { location: markerPos },
      (results: any[] | null, status: string) => {
        if (status === "OK" && results?.[0]) {
          const countryComponent = results[0].address_components.find(
            (c: { types: string[]; long_name: string }) =>
              c.types.includes("country"),
          );
          if (countryComponent) {
            setDetectedCountry(countryComponent.long_name);
          }
        }
      },
    );
  }, [markerPos, geocodingLib]);

  // Set initial selectedCountry based on detection, profile, or default
  useEffect(() => {
    // Only set automatically if it's currently empty and not manually changed
    if (selectedCountry || isManualSelection || availableCountries.length === 0) return;

    const savedCountry = localStorage.getItem("selectedCountryFilter");

    if (savedCountry && availableCountries.includes(savedCountry)) {
      setSelectedCountry(savedCountry);
      setIsManualSelection(true);
    } else if (detectedCountry && availableCountries.includes(detectedCountry)) {
      setSelectedCountry(detectedCountry);
    } else if (userProfile?.country && availableCountries.includes(userProfile.country)) {
      setSelectedCountry(userProfile.country);
    } else {
      setSelectedCountry(availableCountries[0]);
    }
  }, [detectedCountry, userProfile, isManualSelection, selectedCountry, availableCountries]);

  useEffect(() => {
    if (selectedCountry) {
      localStorage.setItem("selectedCountryFilter", selectedCountry);
    }
  }, [selectedCountry]);

  // Initialize all categories to true (visible) once loaded
  useEffect(() => {
    if (
      fetchedCategories.length > 0 &&
      Object.keys(enabledCategories).length === 0
    ) {
      const initial: Record<string, boolean> = {};
      fetchedCategories.forEach((c: any) => {
        initial[String(c._id)] = true;
      });
      setEnabledCategories(initial);
    }
  }, [fetchedCategories, enabledCategories]);

  const [selectedLocation, setSelectedLocation] = useState<any>(null);

  const displayPlaces = fetchedPlaces?.filter((place: any) => {
    if (!belongsToSelectedMap(place)) return false;

    const categoryId = getCategoryId(place);
    if (!categoryId) return true;

    // Guest: only business-type locations OR inherently business categories
    if (!isLoggedIn && isUserResolved) {
      if (!isBusinessLocation(place) && !inherentlyBusinessCatIds.has(categoryId)) {
        return false;
      }
    }

    return enabledCategories[categoryId] !== false;
  });

  // Guest sidebar: same visibility rules as map markers
  const sidebarPlaces =
    !isLoggedIn && isUserResolved
      ? fetchedPlaces.filter((place: any) => {
          if (!belongsToSelectedMap(place)) return false;
          const categoryId = getCategoryId(place);
          return (
            isBusinessLocation(place) ||
            inherentlyBusinessCatIds.has(categoryId)
          );
        })
      : fetchedPlaces.filter(belongsToSelectedMap);

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
            maxZoom={19}
            renderingType={"RASTER"}
            gestureHandling={"greedy"}
            disableDefaultUI={false}
            mapId={process.env.NEXT_PUBLIC_GOOGLE_MAP_ID as string}
            mapTypeControl={!isMobile}
            mapTypeControlOptions={{
              position: ControlPosition.TOP_RIGHT,
            }}
            clickableIcons={false}
          >
            <GeolocationOnLoad onLocation={setMarkerPos} />
            <CountryPanner
              selectedCountry={selectedCountry}
              isManualSelection={isManualSelection}
            />

            <MapPanner
              position={
                selectedLocation
                  ? (() => {
                      const selected = displayPlaces.find(
                        (p: any) => p._id === selectedLocation.id,
                      );
                      const coords =
                        selected?.location?.mapLocation?.coordinates ||
                        selected?.location?.coordinates;
                      return coords?.[0] != null && coords?.[1] != null
                        ? { lat: coords[1], lng: coords[0] }
                        : null;
                    })()
                  : null
              }
            />
            <CustomLocationButton />

            {/* User's current location marker — default pin style */}
            <AdvancedMarker position={markerPos} />

            {/* Render all fetched places as category-icon markers */}
            {displayPlaces?.map((place: any) => {
              const coords =
                place?.location?.mapLocation?.coordinates ||
                place?.location?.coordinates;
              const position = {
                lat: coords?.[1] ?? place?.latitude,
                lng: coords?.[0] ?? place?.longitude,
              };

              if (!position.lat || !position.lng) return null;

              // Resolve category — may be a populated object or just an ID
              const cat =
                typeof place.category === "object" && place.category !== null
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
                    isLocked={place.isLocked}
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
                  fetchedPlaces={sidebarPlaces}
                  handleToggle={handleToggle}
                  setSelectedLocation={setSelectedLocation}
                  selectedLocation={selectedLocation}
                  selectedCountry={selectedCountry}
                  setSelectedCountry={setSelectedCountry}
                  setIsManualSelection={setIsManualSelection}
                  availableCountries={availableCountries}
                  isLoggedIn={isLoggedIn}
                  isLoading={isSidebarLoading}
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
