"use client";

import { CustomLocationButton } from "@/components/shared/maps/CustomLocationButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mapStyles } from "@/lib/utils";
import {
  AdvancedMarker,
  APIProvider,
  Map,
  MapMouseEvent,
  useMap,
} from "@vis.gl/react-google-maps";
import { useCallback, useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

interface BusinessFormStep2Props {
  form: UseFormReturn<any>;
}

interface MarkerPosition {
  lat: number;
  lng: number;
  zoom?: number;
}

// Inner component that has access to the map instance
function MapContent({
  isAddMode,
  markerPosition,
  onMapClick,
  mapId,
  styles,
}: {
  isAddMode: boolean;
  markerPosition: MarkerPosition | null;
  onMapClick: (e: MapMouseEvent) => void | Promise<void>;
  mapId?: string;
  styles?: object[];
}) {
  const map = useMap();

  useEffect(() => {
    if (map && markerPosition) {
      map.panTo(markerPosition);
      if (markerPosition.zoom) {
        map.setZoom(markerPosition.zoom);
      }
    }
  }, [map, markerPosition]);

  // Apply crosshair cursor when in add mode
  if (map) {
    map.setOptions({
      draggableCursor: isAddMode ? "crosshair" : "",
    });
  }

  return (
    <>
      <Map
        style={{ width: "100%", height: "100%" }}
        defaultCenter={{ lat: 23.7806, lng: 90.407 }}
        defaultZoom={13}
        gestureHandling={"greedy"}
        disableDefaultUI={false}
        mapId={mapId}
        mapTypeControl={true}
        styles={styles as any}
        onClick={isAddMode ? onMapClick : undefined}
      >
        <CustomLocationButton />

        {markerPosition && <AdvancedMarker position={markerPosition} />}
      </Map>
    </>
  );
}

export function BusinessFormStep2({ form }: BusinessFormStep2Props) {
  const [isAddMode, setIsAddMode] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [markerPosition, setMarkerPosition] = useState<MarkerPosition | null>(
    () => {
      const existing = form.getValues("mapLocation");
      return existing ?? null;
    },
  );

  const handleAddLocationClick = () => {
    setIsAddMode((prev) => !prev);
  };

  const extractFromUrlString = (urlString: string): MarkerPosition | null => {
    let lat: number | null = null;
    let lng: number | null = null;
    let zoom: number | undefined = undefined;

    // First try to find exact marker coordinates !3d(lat)!4d(lng) or !2d(lng)!3d(lat)
    const bangMatch3d4d = urlString.match(
      /!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/,
    );
    if (bangMatch3d4d) {
      lat = parseFloat(bangMatch3d4d[1]);
      lng = parseFloat(bangMatch3d4d[2]);
    } else {
      const bangMatch2d3d = urlString.match(
        /!2d(-?\d+(?:\.\d+)?)!3d(-?\d+(?:\.\d+)?)/,
      );
      if (bangMatch2d3d) {
        lng = parseFloat(bangMatch2d3d[1]);
        lat = parseFloat(bangMatch2d3d[2]);
      }
    }

    // Try to find viewport coordinates and zoom
    const atMatch = urlString.match(
      /@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)(?:,(\d+(?:\.\d+)?)z)?/,
    );
    if (atMatch) {
      if (lat === null) lat = parseFloat(atMatch[1]);
      if (lng === null) lng = parseFloat(atMatch[2]);
      if (atMatch[3]) zoom = parseFloat(atMatch[3]);
    }

    // Try search query or other params if still not found
    if (lat === null || lng === null) {
      const llMatch =
        urlString.match(/[?&]ll=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/) ||
        urlString.match(/[?&]q=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
      if (llMatch) {
        lat = parseFloat(llMatch[1]);
        lng = parseFloat(llMatch[2]);
      }
    }

    if (lat !== null && lng !== null) {
      return { lat, lng, zoom };
    }
    return null;
  };

  const reverseGeocodeAndSetAddress = async (lat: number, lng: number) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY;
      if (!apiKey) return;

      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`,
      );
      const data = await res.json();

      if (data.results && data.results.length > 0) {
        const result = data.results[0];

        let streetAddress = "";
        let city = "";
        let country = "";

        result.address_components.forEach((component: any) => {
          const types = component.types;
          if (types.includes("street_number")) {
            streetAddress = component.long_name + " ";
          }
          if (types.includes("route")) {
            streetAddress += component.long_name;
          }
          if (
            types.includes("locality") ||
            types.includes("administrative_area_level_2") ||
            types.includes("postal_town")
          ) {
            city = component.long_name;
          }
          if (types.includes("country")) {
            country = component.long_name;
          }
        });

        if (!streetAddress.trim()) {
          // Fallback if no specific street parts
          streetAddress = result.formatted_address.split(",")[0];
        }

        const addressData = {
          streetAddress: streetAddress.trim(),
          city,
          country,
        };

        // console.log("Reverse Geocoded Address Data:", addressData);

        if (addressData.streetAddress)
          form.setValue("streetAddress", addressData.streetAddress);
        if (addressData.city) form.setValue("city", addressData.city);
        if (addressData.country) form.setValue("country", addressData.country);
      }
    } catch (err) {
      console.error("Reverse geocoding failed:", err);
    }
  };

  const handleExtractLocation = async () => {
    let url = form.getValues("mapUrl");
    if (!url) {
      toast.error("Please enter a Google Maps URL first");
      return;
    }

    setIsExtracting(true);
    let extractedCoords = extractFromUrlString(url);

    // If we couldn't extract coordinates and it looks like a short URL, try expanding it
    if (
      !extractedCoords &&
      (url.includes("goo.gl") || url.includes("maps.app.goo.gl"))
    ) {
      try {
        // Ensure the url has http/https
        if (!url.startsWith("http")) {
          url = `https://${url}`;
        }
        const res = await fetch("/api/expand-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });
        const data = await res.json();
        if (data.expandedUrl) {
          extractedCoords = extractFromUrlString(data.expandedUrl);
        }
      } catch (error) {
        console.error("Failed to expand URL", error);
      }
    }

    setIsExtracting(false);

    if (extractedCoords) {
      setMarkerPosition(extractedCoords);
      form.setValue("mapLocation", extractedCoords);
      // console.log("Extracted Location:", extractedCoords);

      // Attempt to extract address components and fill form
      await reverseGeocodeAndSetAddress(
        extractedCoords.lat,
        extractedCoords.lng,
      );

      toast.success("Location and address extracted successfully!");
      setIsAddMode(false);
    } else {
      toast.error(
        "Could not extract coordinates. Try using the full URL from your browser address bar.",
      );
      console.warn("Extraction failed for URL:", url);
    }
  };

  const handleMapClick = useCallback(
    async (e: MapMouseEvent) => {
      if (!e.detail.latLng) return;

      const coords: MarkerPosition = {
        lat: e.detail.latLng.lat,
        lng: e.detail.latLng.lng,
      };

      setMarkerPosition(coords);
      form.setValue("mapLocation", coords);
      setIsAddMode(false); // exit add mode after placing marker

      console.log(coords);

      // Attempt to extract address components and fill form
      await reverseGeocodeAndSetAddress(coords.lat, coords.lng);
      toast.success("Location and address set successfully!");
    },
    [form],
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Map Location</h2>
        <Button
          type="button"
          onClick={handleAddLocationClick}
          variant={isAddMode ? "destructive" : "default"}
        >
          {isAddMode ? "Cancel" : "Add Location"}
        </Button>
      </div>
      <div className="space-y-2">
        <Label className="text-base font-semibold text-gray-500 uppercase tracking-wide">
          Put Your Google Map Location Url
        </Label>
        <div className="flex gap-2">
          <Input
            placeholder="https://www.google.com/maps/.../@23.7806,90.407,15z"
            {...form.register("mapUrl")}
            className="bg-gray-50 border-gray-200"
          />
          <Button
            type="button"
            onClick={handleExtractLocation}
            disabled={isExtracting}
            className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold px-6"
          >
            {isExtracting ? "..." : "Add"}
          </Button>
        </div>
      </div>

      {isAddMode && (
        <p className="text-sm text-yellow-600 font-medium -mt-4">
          Click anywhere on the map to place your marker.
        </p>
      )}

      {markerPosition && !isAddMode && (
        <p className="text-sm text-green-600 font-medium -mt-4">
          Location set: {markerPosition.lat.toFixed(5)},{" "}
          {markerPosition.lng.toFixed(5)}
        </p>
      )}

      <APIProvider
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY as string}
      >
        <div style={{ width: "100%", height: "500px" }}>
          <MapContent
            isAddMode={isAddMode}
            markerPosition={markerPosition}
            onMapClick={handleMapClick}
            mapId={process.env.NEXT_PUBLIC_GOOGLE_MAP_ID as string}
            styles={mapStyles}
          />
        </div>
      </APIProvider>
    </div>
  );
}
