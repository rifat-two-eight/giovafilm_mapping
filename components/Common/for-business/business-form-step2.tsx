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
import { useExtractCoordinatesMutation } from "@/redux/features/place/placeApi";
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
        minZoom={3}
        maxZoom={19}
        renderingType={"RASTER"}
        gestureHandling={"greedy"}
        disableDefaultUI={false}
        mapId={mapId}
        mapTypeControl={true}
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

  const [extractCoordinates] = useExtractCoordinatesMutation();

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

    if (!url.startsWith("http")) {
      url = `https://${url}`;
    }

    setIsExtracting(true);

    try {
      const response = await extractCoordinates({ url }).unwrap();
      
      if (response.success && response.data) {
        const extractedCoords = { lat: response.data.lat, lng: response.data.lng };
        setMarkerPosition(extractedCoords);
        form.setValue("mapLocation", extractedCoords);

        // Attempt to extract address components and fill form
        await reverseGeocodeAndSetAddress(
          extractedCoords.lat,
          extractedCoords.lng,
        );

        toast.success("Location and address extracted successfully!");
        setIsAddMode(false);
      } else {
        toast.error("Could not extract coordinates from this URL.");
      }
    } catch (error: any) {
      console.error("Failed to extract location:", error);
      toast.error(
        error?.data?.message || "Could not extract coordinates. Try using the full URL from your browser address bar.",
      );
      console.warn("Extraction failed for URL:", url);
    } finally {
      setIsExtracting(false);
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
          />
        </div>
      </APIProvider>
    </div>
  );
}
