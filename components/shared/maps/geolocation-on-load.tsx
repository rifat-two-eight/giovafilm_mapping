import { useMap } from "@vis.gl/react-google-maps";
import { useEffect } from "react";

// ─── Geolocation on load ──────────────────────────────────────────────────────
export function GeolocationOnLoad({
  onLocation,
}: {
  onLocation: (pos: { lat: number; lng: number }) => void;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const handleSuccess = (pos: GeolocationPosition) => {
      const location = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      map.panTo(location);
      onLocation(location);
    };

    const handleFallback = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();
        if (data.latitude && data.longitude) {
          const location = { lat: data.latitude, lng: data.longitude };
          map.panTo(location);
          onLocation(location);
        }
      } catch (error) {
        console.error("IP Geolocation failed:", error);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(handleSuccess, (error) => {
        console.warn(
          "Browser geolocation denied or failed, using fallback:",
          error.message,
        );
        handleFallback();
      });
    } else {
      handleFallback();
    }
  }, [map]);

  return null;
}
