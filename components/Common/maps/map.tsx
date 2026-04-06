"use client";

import { useEffect, useState, useCallback } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  ControlPosition,
  MapControl,
  useMap,
} from "@vis.gl/react-google-maps";

// ১. কাস্টম লোকেশন বাটন কম্পোনেন্ট
const CustomLocationButton = () => {
  const map = useMap(); // ম্যাপের ইন্সট্যান্স নেয়ার জন্য

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
        title="Show my location"
      >
        {/* লোকেশন ডিটেক্টর আইকন (SVG) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#666"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z" />
          <circle cx="12" cy="12" r="3" />
          <line x1="12" y1="2" x2="12" y2="5" />
          <line x1="12" y1="19" x2="12" y2="22" />
          <line x1="2" y1="12" x2="5" y2="12" />
          <line x1="19" y1="12" x2="22" y2="12" />
        </svg>
      </button>
    </MapControl>
  );
};

export default function MapPage() {
  const defaultPosition = { lat: 23.8103, lng: 90.4125 }; 
  const [currentPos, setCurrentPos] = useState(defaultPosition);

  
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setCurrentPos({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }
  }, []);

  return (
    <div className="min-h-screen">
      <div style={{ height: "calc(100vh - 100px)", width: "100%" }}>
        <APIProvider
          apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY as string}
        >
          <Map
            defaultCenter={defaultPosition}
            center={currentPos}
            defaultZoom={13}
            gestureHandling={"greedy"}
            disableDefaultUI={false}
            mapId="YOUR_MAP_ID"
          >
            {/* কাস্টম লোকেশন বাটনটি ম্যাপের ভেতরে দেখাবে */}
            <CustomLocationButton />

            {/* কারেন্ট লোকেশন মার্কার */}
            <AdvancedMarker position={currentPos} />
          </Map>
        </APIProvider>
      </div>
    </div>
  );
}
