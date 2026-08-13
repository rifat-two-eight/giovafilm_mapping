"use client";

import { AnimatedMapPin } from "@/components/shared/maps/animated-map-pin";
import { CustomLocationButton } from "@/components/shared/maps/CustomLocationButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { pinMatchesSelectedMap } from "@/lib/map-country";
import { parseCoordinatesFromMapsUrl } from "@/lib/parse-maps-url";
import { useExtractCoordinatesMutation } from "@/redux/features/place/placeApi";
import { useGetMapsQuery } from "@/redux/features/map/mapApi";
import {
  APIProvider,
  Map,
  MapMouseEvent,
  useMap,
} from "@vis.gl/react-google-maps";
import { useEffect, useMemo, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { appAlert } from "@/lib/app-alert";

interface BusinessFormStep2Props {
  form: UseFormReturn<any>;
}

interface MarkerPosition {
  lat: number;
  lng: number;
  zoom?: number;
}

function MapContent({
  markerPosition,
  onMapClick,
  onMarkerDragEnd,
  mapId,
  defaultCenter,
  defaultZoom,
}: {
  markerPosition: MarkerPosition | null;
  onMapClick: (e: MapMouseEvent) => void | Promise<void>;
  onMarkerDragEnd: (lat: number, lng: number) => void | Promise<void>;
  mapId?: string;
  defaultCenter: { lat: number; lng: number };
  defaultZoom: number;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    if (markerPosition) {
      map.panTo(markerPosition);
      const zoom = map.getZoom() ?? defaultZoom;
      if (zoom < 11) map.setZoom(markerPosition.zoom || 15);
      return;
    }
    map.panTo(defaultCenter);
    map.setZoom(defaultZoom);
  }, [
    map,
    markerPosition?.lat,
    markerPosition?.lng,
    defaultCenter.lat,
    defaultCenter.lng,
    defaultZoom,
  ]);

  if (map) {
    map.setOptions({ draggableCursor: "crosshair" });
  }

  return (
    <Map
      style={{ width: "100%", height: "100%" }}
      defaultCenter={defaultCenter}
      defaultZoom={defaultZoom}
      minZoom={3}
      maxZoom={19}
      renderingType={"RASTER"}
      gestureHandling={"greedy"}
      disableDefaultUI={false}
      mapId={mapId}
      mapTypeControl={true}
      onClick={onMapClick}
    >
      <CustomLocationButton />
      {markerPosition && (
        <AnimatedMapPin
          position={markerPosition}
          draggable
          onDragEnd={onMarkerDragEnd}
        />
      )}
    </Map>
  );
}

type MapViewport = {
  southwest: { lat: number; lng: number };
  northeast: { lat: number; lng: number };
};

const googleMapsApiKey = () =>
  (process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || "").trim();

async function geocodeQuery(query: string): Promise<{
  lat: number;
  lng: number;
  country?: string;
  viewport?: MapViewport | null;
} | null> {
  const apiKey = googleMapsApiKey();
  if (!apiKey || !query) return null;

  const res = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${apiKey}`,
  );
  const data = await res.json();
  const result = data?.results?.[0];
  const loc = result?.geometry?.location;
  if (!loc) return null;
  const country = result.address_components?.find((component: any) =>
    component.types.includes("country"),
  )?.long_name;
  const viewport = result.geometry?.viewport
    ? {
        southwest: result.geometry.viewport.southwest,
        northeast: result.geometry.viewport.northeast,
      }
    : null;
  return { lat: loc.lat, lng: loc.lng, country, viewport };
}

function isInsideViewport(lat: number, lng: number, viewport?: MapViewport | null) {
  if (!viewport) return false;
  const { southwest, northeast } = viewport;
  return (
    lat >= southwest.lat &&
    lat <= northeast.lat &&
    lng >= southwest.lng &&
    lng <= northeast.lng
  );
}

async function reverseGeocode(lat: number, lng: number) {
  const apiKey = googleMapsApiKey();
  if (!apiKey) return null;

  const res = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`,
  );
  const data = await res.json();
  if (!data.results?.length) return null;

  let streetAddress = "";
  let city = "";
  let country = "";

  for (const result of data.results) {
    result.address_components?.forEach((component: any) => {
      const types = component.types || [];
      if (!streetAddress && types.includes("street_number")) {
        streetAddress = `${component.long_name} `;
      }
      if (types.includes("route")) streetAddress += component.long_name;
      if (
        !city &&
        (types.includes("locality") ||
          types.includes("administrative_area_level_2") ||
          types.includes("postal_town"))
      ) {
        city = component.long_name;
      }
      if (!country && types.includes("country")) {
        country = component.long_name;
      }
    });
    if (!streetAddress && result.formatted_address) {
      streetAddress = result.formatted_address.split(",")[0];
    }
    if (country) break;
  }

  return {
    streetAddress: streetAddress.trim(),
    city,
    country,
  };
}

export function BusinessFormStep2({ form }: BusinessFormStep2Props) {
  const selectedMapName = form.watch("country");
  const savedLocation = form.watch("mapLocation");
  const { data: mapsRes } = useGetMapsQuery({ limit: 100 });
  const selectedMap = useMemo(
    () => (mapsRes?.data || []).find((map: any) => map.name === selectedMapName),
    [mapsRes?.data, selectedMapName],
  );

  const [isExtracting, setIsExtracting] = useState(false);
  const [isCheckingPin, setIsCheckingPin] = useState(false);
  const [markerPosition, setMarkerPosition] = useState<MarkerPosition | null>(
    () => savedLocation ?? null,
  );
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number; zoom: number } | null>(
    savedLocation
      ? { lat: savedLocation.lat, lng: savedLocation.lng, zoom: 15 }
      : null,
  );

  const [expectedGeoCountry, setExpectedGeoCountry] = useState<string>("");
  const [mapViewport, setMapViewport] = useState<MapViewport | null>(null);
  const [extractCoordinates] = useExtractCoordinatesMutation();

  useEffect(() => {
    if (savedLocation?.lat != null && savedLocation?.lng != null) {
      setMarkerPosition(savedLocation);
      setMapCenter({ lat: savedLocation.lat, lng: savedLocation.lng, zoom: 15 });
      return;
    }
    setMarkerPosition(null);
  }, [savedLocation?.lat, savedLocation?.lng]);

  useEffect(() => {
    if (!selectedMapName) return;

    let cancelled = false;
    const query = selectedMap?.country || selectedMapName;

    geocodeQuery(query).then((coords) => {
      if (cancelled) return;
      if (coords) {
        if (!savedLocation) {
          setMapCenter({ lat: coords.lat, lng: coords.lng, zoom: 7 });
        }
        if (coords.country) setExpectedGeoCountry(coords.country);
        setMapViewport(coords.viewport || null);
      } else if (!savedLocation) {
        setMapCenter({ lat: 20, lng: 0, zoom: 2 });
        setMapViewport(null);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [selectedMapName, selectedMap?.country, savedLocation]);

  const applyAddressIfValid = async (lat: number, lng: number) => {
    const address = await reverseGeocode(lat, lng);
    const pinCountry = address?.country;
    const insideSelectedMap = isInsideViewport(lat, lng, mapViewport);

    if (!pinCountry) {
      if (insideSelectedMap) {
        if (address?.streetAddress) form.setValue("streetAddress", address.streetAddress);
        if (address?.city) form.setValue("city", address.city);
        return true;
      }
      toast.error("Could not verify this location. Please try another pin.");
      return false;
    }

    if (
      !pinMatchesSelectedMap(
        pinCountry,
        selectedMap || { name: selectedMapName },
        [expectedGeoCountry, selectedMapName],
      ) &&
      !insideSelectedMap
    ) {
      toast.error(
        `This pin is in ${pinCountry}. Place it inside ${selectedMapName}.`,
      );
      return false;
    }

    if (address?.streetAddress) form.setValue("streetAddress", address.streetAddress);
    if (address?.city) form.setValue("city", address.city);
    return true;
  };

  const confirmLocationChange = async (title: string, text: string) => {
    const result = await appAlert.fire({
      title,
      text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, update it",
      cancelButtonText: "Cancel",
    });
    return result.isConfirmed;
  };

  const clearLocation = async () => {
    const confirmed = await confirmLocationChange(
      "Clear this location?",
      "The current pin will be removed. You can set a new location after that.",
    );
    if (!confirmed) return;
    form.setValue("mapLocation", null);
    form.setValue("mapUrl", "");
    setMarkerPosition(null);
    toast.success("Location cleared. You can set a new pin.");
  };

  const setLocation = async (
    lat: number,
    lng: number,
    successMessage?: string,
    requireConfirm = false,
  ) => {
    if (requireConfirm) {
      const confirmed = await confirmLocationChange(
        "Update this location?",
        "A location is already set. Do you want to replace it with the new pin?",
      );
      if (!confirmed) return false;
    }

    setIsCheckingPin(true);
    try {
      const valid = await applyAddressIfValid(lat, lng);
      if (!valid) return false;
      setMarkerPosition({ lat, lng });
      form.setValue("mapLocation", { lat, lng });
      toast.success(
        successMessage || `Location updated inside ${selectedMapName}.`,
      );
      return true;
    } finally {
      setIsCheckingPin(false);
    }
  };

  const handleExtractLocation = async () => {
    let url = (form.getValues("mapUrl") || "").trim();
    if (!url) {
      toast.error("Please enter a Google Maps URL first");
      return;
    }
    if (!selectedMapName) {
      toast.error("Please select a Country/Map in Step 1 first.");
      return;
    }

    if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
    setIsExtracting(true);

    try {
      let extractedCoords = parseCoordinatesFromMapsUrl(url);

      if (!extractedCoords) {
        const response = await extractCoordinates({ url }).unwrap();
        const coords = response?.data || response;
        const lat = Number(coords?.lat);
        const lng = Number(coords?.lng);
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
          toast.error("Could not extract coordinates from this URL.");
          return;
        }
        extractedCoords = { lat, lng };
      }

      await setLocation(
        extractedCoords.lat,
        extractedCoords.lng,
        markerPosition
          ? `Location updated inside ${selectedMapName}.`
          : `Location set inside ${selectedMapName}.`,
        !!markerPosition,
      );
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          "Could not extract coordinates. Try using the full URL from your browser address bar.",
      );
    } finally {
      setIsExtracting(false);
    }
  };

  const handleMapClick = async (e: MapMouseEvent) => {
    if (!e.detail.latLng) return;
    if (!selectedMapName) {
      toast.error("Please select a Country/Map in Step 1 first.");
      return;
    }

    await setLocation(
      e.detail.latLng.lat,
      e.detail.latLng.lng,
      markerPosition
        ? `Location updated inside ${selectedMapName}.`
        : `Location set inside ${selectedMapName}.`,
      !!markerPosition,
    );
  };

  const handleMarkerDragEnd = async (lat: number, lng: number) => {
    await setLocation(
      lat,
      lng,
      `Location updated inside ${selectedMapName}.`,
      true,
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Map Location</h2>
          <p className="text-sm text-gray-500 mt-1">
            Drop the pin inside{" "}
            <span className="font-semibold text-gray-800">
              {selectedMapName || "the selected map"}
            </span>
            . This business will appear on that map only.
          </p>
        </div>
        {markerPosition && (
          <Button type="button" variant="outline" onClick={clearLocation}>
            Clear location
          </Button>
        )}
      </div>

      {selectedMapName && (
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
          Selected map: <strong>{selectedMapName}</strong>. A pin outside this
          country will be rejected.
        </div>
      )}

      <div className="space-y-2">
        <Label className="text-base font-semibold text-gray-500 uppercase tracking-wide">
          Put Your Google Map Location Url
        </Label>
        <div className="flex gap-2">
          <Input
            placeholder="Paste a Google Maps URL inside the selected country"
            {...form.register("mapUrl")}
            className="bg-gray-50 border-gray-200"
          />
          <Button
            type="button"
            onClick={handleExtractLocation}
            disabled={isExtracting || isCheckingPin}
            className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold px-6"
          >
            {isExtracting ? "..." : markerPosition ? "Update" : "Add"}
          </Button>
        </div>
      </div>

      <p className="text-sm text-yellow-700 font-medium">
        Click the map or drag the pin to {markerPosition ? "update" : "set"} the
        location inside {selectedMapName || "the selected map"}.
      </p>

      {markerPosition && (
        <p className="text-sm text-green-600 font-medium">
          Location set: {markerPosition.lat.toFixed(5)},{" "}
          {markerPosition.lng.toFixed(5)}
        </p>
      )}

      <APIProvider apiKey={googleMapsApiKey()}>
        <div className="relative" style={{ width: "100%", height: "500px" }}>
          {!mapCenter ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-500">Opening {selectedMapName || "map"}...</p>
            </div>
          ) : (
            <MapContent
              markerPosition={markerPosition}
              onMapClick={handleMapClick}
              onMarkerDragEnd={handleMarkerDragEnd}
              mapId={process.env.NEXT_PUBLIC_GOOGLE_MAP_ID as string}
              defaultCenter={{ lat: mapCenter.lat, lng: mapCenter.lng }}
              defaultZoom={mapCenter.zoom}
            />
          )}
          {isCheckingPin && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
              <p className="text-sm font-medium text-gray-700">Checking location...</p>
            </div>
          )}
        </div>
      </APIProvider>
    </div>
  );
}
