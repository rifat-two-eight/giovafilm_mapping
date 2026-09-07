import { useMap } from "@vis.gl/react-google-maps";
import { useEffect } from "react";

// ─── Geolocation on load ──────────────────────────────────────────────────────
export function GeolocationOnLoad({
  onLocation,
  shouldPan = true,
}: {
  onLocation: (pos: { lat: number; lng: number }) => void;
  shouldPan?: boolean;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const handleSuccess = (pos: GeolocationPosition) => {
      const location = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      if (shouldPan) {
        map.panTo(location);
      }
      onLocation(location);
    };

    const handleFallback = async () => {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 2500);
        const response = await fetch("https://ipapi.co/json/", {
          signal: controller.signal,
        });
        clearTimeout(timer);
        const data = await response.json();
        if (data.latitude && data.longitude) {
          const location = { lat: data.latitude, lng: data.longitude };
          if (shouldPan) {
            map.panTo(location);
          }
          onLocation(location);
        }
      } catch (error) {
        // Silently catch abort or network failures
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        handleSuccess,
        (error) => {
          handleFallback();
        },
        {
          timeout: 3000,
          maximumAge: 120000,
          enableHighAccuracy: false,
        },
      );
    } else {
      handleFallback();
    }
  }, [map]);

  return null;
}
