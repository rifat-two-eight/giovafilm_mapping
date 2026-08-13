import { ControlPosition, MapControl, useMap } from "@vis.gl/react-google-maps";
import { useCallback } from "react";

export const CustomLocationButton = ({
  onLocated,
  label = "My location",
}: {
  onLocated?: (lat: number, lng: number) => void;
  label?: string;
} = {}) => {
  const map = useMap();

  const handleLocationClick = useCallback(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        if (map) {
          map.panTo({ lat, lng });
          map.setZoom(15);
        }
        onLocated?.(lat, lng);
      },
      () => undefined,
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }, [map, onLocated]);

  return (
    <MapControl position={ControlPosition.RIGHT_BOTTOM}>
      <button
        type="button"
        onClick={handleLocationClick}
        className="m-3 flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 shadow-lg transition hover:bg-gray-50"
        title="Use my location"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#444"
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
        {label ? (
          <span className="hidden text-xs font-semibold text-gray-700 sm:inline">
            {label}
          </span>
        ) : null}
      </button>
    </MapControl>
  );
};
