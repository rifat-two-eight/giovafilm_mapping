import { ControlPosition, MapControl, useMap } from "@vis.gl/react-google-maps";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export const CustomLocationButton = ({
  onLocated,
  label = "My location",
}: {
  onLocated?: (lat: number, lng: number) => void;
  label?: string;
} = {}) => {
  const map = useMap();
  const [loading, setLoading] = useState(false);

  const handleLocationClick = useCallback(() => {
    if (loading) return;

    setLoading(true);

    const panAndLocate = (lat: number, lng: number, zoom = 16) => {
      if (map) {
        map.setCenter({ lat, lng });
        map.setZoom(zoom);
      }
      onLocated?.(lat, lng);
      setLoading(false);
    };

    const handleFallback = async (isPermissionDenied = false) => {
      try {
        const res = await fetch("https://ipwho.is/");
        const data = await res.json();
        if (data && data.success && data.latitude && data.longitude) {
          panAndLocate(data.latitude, data.longitude, 13);
          toast.warning(
            isPermissionDenied
              ? "Location permission blocked. Showing approximate area — allow location in browser for exact GPS."
              : "Could not get exact GPS. Showing approximate area based on your internet connection.",
            { duration: 5000 }
          );
          return;
        }
      } catch (e) {
        console.warn("ipwho.is failed, trying ipapi.co", e);
      }

      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        if (data && data.latitude && data.longitude) {
          panAndLocate(data.latitude, data.longitude, 13);
          toast.warning(
            isPermissionDenied
              ? "Location permission blocked. Showing approximate area — allow location in browser for exact GPS."
              : "Could not get exact GPS. Showing approximate area based on your internet connection.",
            { duration: 5000 }
          );
          return;
        }
      } catch (e) {
        console.error("IP Geolocation failed:", e);
      }

      setLoading(false);
      toast.error("Unable to access location. Please allow location permissions in your browser.");
    };

    if (typeof window !== "undefined" && "geolocation" in navigator) {
      // Try high accuracy GPS — maximumAge:0 forces fresh location (no stale cache)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;

          if (accuracy > 500) {
            // Poor accuracy — try once more with high accuracy
            console.warn(`Low accuracy GPS (${Math.round(accuracy)}m), retrying...`);
            navigator.geolocation.getCurrentPosition(
              (pos2) => {
                if (pos2.coords.accuracy < accuracy) {
                  panAndLocate(pos2.coords.latitude, pos2.coords.longitude, 16);
                } else {
                  panAndLocate(latitude, longitude, 16);
                }
                if (Math.min(accuracy, pos2.coords.accuracy) > 500) {
                  toast.warning(`Location accuracy is low (~${Math.round(Math.min(accuracy, pos2.coords.accuracy))}m). Allow GPS in browser settings for better results.`, { duration: 5000 });
                }
              },
              () => {
                panAndLocate(latitude, longitude, 16);
                toast.warning(`Location accuracy is low (~${Math.round(accuracy)}m). Allow GPS in browser settings for better results.`, { duration: 5000 });
              },
              { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
            );
          } else {
            panAndLocate(latitude, longitude, 16);
          }
        },
        (error) => {
          console.warn("GPS geolocation failed:", error);
          handleFallback(error.code === error.PERMISSION_DENIED);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
      );
    } else {
      handleFallback(false);
    }
  }, [map, onLocated, loading]);

  return (
    <MapControl position={ControlPosition.RIGHT_BOTTOM}>
      <button
        type="button"
        onClick={handleLocationClick}
        disabled={loading}
        className="m-3 flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 shadow-lg transition hover:bg-gray-50 disabled:opacity-50"
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
          className={loading ? "animate-spin" : ""}
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
