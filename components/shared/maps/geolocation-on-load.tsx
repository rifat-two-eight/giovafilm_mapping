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
    if (!map || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      const location = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      map.panTo(location);
      onLocation(location);
    });
  }, [map]);

  return null;
}
