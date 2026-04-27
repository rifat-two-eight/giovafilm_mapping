"use client";

import {
  AdvancedMarker,
  APIProvider,
  Map,
  useMap,
} from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import { CustomLocationButton } from "./CustomLocationButton";
import { mapStyles } from "@/components/Common/maps/map";

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
          styles={mapStyles}
          onClick={handleMapClick}
          style={{ width: "100%", height: "100%" }}
          clickableIcons={false}
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
