"use client";

import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMap,
} from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import { CustomLocationButton } from "./CustomLocationButton";

interface MapLocationPickerProps {
  initialLocation?: { lat: number; lng: number };
  onLocationSelect: (location: { lat: number; lng: number }) => void;
}

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
  }, [map, onLocation]);

  return null;
}

export function MapLocationPicker({
  initialLocation,
  onLocationSelect,
}: MapLocationPickerProps) {
  const defaultPosition = initialLocation || { lat: 23.8103, lng: 90.4125 };
  const [markerPos, setMarkerPos] = useState(defaultPosition);

  const handleMapClick = (e: any) => {
    const newLat = e.detail.latLng.lat;
    const newLng = e.detail.latLng.lng;
    const newPos = { lat: newLat, lng: newLng };
    setMarkerPos(newPos);
    onLocationSelect(newPos);
  };

  return (
    <div className="w-full h-full min-h-[400px] relative rounded-lg overflow-hidden border border-gray-200">
      <APIProvider
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY as string}
      >
        <Map
          defaultCenter={defaultPosition}
          defaultZoom={13}
          gestureHandling={"greedy"}
          disableDefaultUI={false}
          mapId="LOCATION_PICKER_MAP"
          onClick={handleMapClick}
          style={{ width: "100%", height: "100%" }}
        >
          {!initialLocation && (
            <GeolocationOnLoad
              onLocation={(pos) => {
                setMarkerPos(pos);
                onLocationSelect(pos);
              }}
            />
          )}
          <CustomLocationButton />
          <AdvancedMarker
            position={markerPos}
            draggable={true}
            onDragEnd={(e: any) => {
              if (e.latLng) {
                const newPos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
                setMarkerPos(newPos);
                onLocationSelect(newPos);
              }
            }}
          />
        </Map>
      </APIProvider>
    </div>
  );
}
