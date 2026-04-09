"use client";

import { useCallback } from "react";
import { MapControl, ControlPosition, useMap } from "@vis.gl/react-google-maps";

export default function CustomLocationButton2() {
  const map = useMap();

  const handleLocationClick = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        if (map) {
          map.panTo({ lat: latitude, lng: longitude });
          map.setZoom(15);
        }
      });
    }
  }, [map]);

  return (
    <MapControl position={ControlPosition.RIGHT_BOTTOM}>
      <button
        onClick={handleLocationClick}
        className="m-3 p-3 bg-white rounded-md shadow-lg hover:bg-gray-100 transition-all flex items-center justify-center border border-gray-300"
      >
        <svg width="24" height="24" viewBox="0 0 24 24">
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z" />
        </svg>
      </button>
    </MapControl>
  );
}
