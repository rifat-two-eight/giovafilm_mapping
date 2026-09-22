"use client";

import { ControlPosition, MapControl, useMap } from "@vis.gl/react-google-maps";
import { useCallback, useEffect, useState } from "react";
import { Layers } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface SatelliteToggleButtonProps {
  position?: ControlPosition;
  className?: string;
}

export const SatelliteToggleButton = ({
  position = ControlPosition.RIGHT_BOTTOM,
  className = "",
}: SatelliteToggleButtonProps) => {
  const { t } = useLanguage();
  const map = useMap();
  const [isSatellite, setIsSatellite] = useState(false);

  useEffect(() => {
    if (!map) return;

    const syncState = () => {
      const type = map.getMapTypeId();
      setIsSatellite(type === "satellite" || type === "hybrid");
    };

    syncState();
    const listener = map.addListener("maptypeid_changed", syncState);

    return () => {
      google.maps.event.removeListener(listener);
    };
  }, [map]);

  const toggleMapType = useCallback(() => {
    if (!map) return;
    const nextIsSatellite = !isSatellite;
    setIsSatellite(nextIsSatellite);
    map.setMapTypeId(nextIsSatellite ? "hybrid" : "roadmap");
  }, [map, isSatellite]);

  const title = isSatellite
    ? t("map.default_view") || "Map"
    : t("map.satellite_view") || "Satellite";

  return (
    <MapControl position={position}>
      <div className={`m-3 mb-0 pointer-events-auto flex flex-col items-end ${className}`}>
        <button
          type="button"
          onClick={toggleMapType}
          className={`flex h-10 w-10 items-center justify-center rounded-xl border shadow-lg transition-all duration-200 active:scale-95 ${
            isSatellite
              ? "bg-amber-500 border-amber-600 text-white shadow-amber-500/25 ring-2 ring-amber-400/50"
              : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
          }`}
          title={title}
          aria-label={title}
        >
          <Layers size={20} className={isSatellite ? "text-white" : "text-gray-700"} />
        </button>
      </div>
    </MapControl>
  );
};
