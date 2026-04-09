"use client";

import { CustomLocationButton } from "@/components/shared/maps/CustomLocationButton";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  AdvancedMarker,
  APIProvider,
  ControlPosition,
  Map,
  MapControl,
  useMap,
} from "@vis.gl/react-google-maps";
import {
  Landmark,
  MountainSnow,
  Trees,
  Umbrella,
  Utensils,
  Waves,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

// ─── Category data ────────────────────────────────────────────────────────────
const CATEGORIES = [
  {
    id: "beaches",
    label: "Beaches",
    icon: Umbrella,
    color: "#2196F3",
    defaultEnabled: true,
  },
  {
    id: "restaurants",
    label: "Restaurants",
    icon: Utensils,
    color: "#F44336",
    defaultEnabled: true,
  },
  {
    id: "parks",
    label: "Parks",
    icon: Trees,
    color: "#4CAF50",
    defaultEnabled: false,
  },
  {
    id: "rivers",
    label: "Rivers",
    icon: Waves,
    color: "#03A9F4",
    defaultEnabled: true,
  },
  {
    id: "caves",
    label: "Caves",
    icon: MountainSnow,
    color: "#795548",
    defaultEnabled: false,
  },
  {
    id: "landmarks",
    label: "Landmarks",
    icon: Landmark,
    color: "#9C27B0",
    defaultEnabled: true,
  },
];

// ─── Map Categories Panel ─────────────────────────────────────────────────────
interface MapCategoriesPanelProps {
  onClose: () => void;
  enabledCategories: Record<string, boolean>;
  onToggle: (id: string, value: boolean) => void;
  onShowResults: () => void;
}

function MapCategoriesPanel({
  onClose,
  enabledCategories,
  onToggle,
  onShowResults,
}: MapCategoriesPanelProps) {
  return (
    <div className="w-[230px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <span className="text-base font-bold text-gray-900">
          Map Categories
        </span>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
        >
          <X size={16} />
        </button>
      </div>

      {/* Category list */}

      <div className="px-3 py-2 space-y-1">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const enabled = enabledCategories[cat.id] ?? cat.defaultEnabled;
          return (
            <div
              key={cat.id}
              className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
            >
              {/* Colored icon circle */}
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: cat.color }}
              >
                <Icon size={17} color="#fff" strokeWidth={2.2} />
              </div>

              {/* Label */}
              <span className="flex-1 text-sm font-medium text-gray-800">
                {cat.label}
              </span>

              {/* Toggle — yellow when on, gray when off */}
              <Switch
                checked={enabled}
                onCheckedChange={(val) => onToggle(cat.id, val)}
                className="data-[state=checked]:bg-amber-400 data-[state=unchecked]:bg-gray-300"
              />
            </div>
          );
        })}
      </div>

      {/* Footer button */}
      <div className="p-3 border-t border-gray-100">
        <Button
          onClick={onShowResults}
          className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold text-sm rounded-xl py-2.5 h-auto"
        >
          Show results
        </Button>
      </div>
    </div>
  );
}

// ─── Geolocation on load ──────────────────────────────────────────────────────
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
  }, [map]);

  return null;
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function MapPage() {
  const defaultPosition = { lat: 23.8103, lng: 90.4125 };
  const [markerPos, setMarkerPos] = useState(defaultPosition);
  const [showCategories, setShowCategories] = useState(true);

  const [enabledCategories, setEnabledCategories] = useState<
    Record<string, boolean>
  >(Object.fromEntries(CATEGORIES.map((c) => [c.id, c.defaultEnabled])));

  const handleToggle = (id: string, value: boolean) => {
    setEnabledCategories((prev) => ({ ...prev, [id]: value }));
  };

  const handleShowResults = () => {
    console.log("Active categories:", enabledCategories);
    setShowCategories(false);
  };

  return (
    <div className="min-h-screen">
      <div style={{ height: "calc(100vh - 100px)", width: "100%" }}>
        <APIProvider
          apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY as string}
        >
          <Map
            defaultCenter={defaultPosition}
            defaultZoom={13}
            gestureHandling={"greedy"}
            disableDefaultUI={false}
            mapId="YOUR_MAP_ID"
            mapTypeControl={true}
            mapTypeControlOptions={{
              position: ControlPosition.TOP_RIGHT,
            }}
          >
            {/* Pans once on mount — no controlled center prop needed */}
            <GeolocationOnLoad onLocation={setMarkerPos} />

            <CustomLocationButton />

            <AdvancedMarker position={markerPos} />

            {/* Categories panel — top-left overlay via MapControl */}
            <MapControl position={ControlPosition.TOP_LEFT}>
              <div className="m-3">
                {showCategories ? (
                  <MapCategoriesPanel
                    onClose={() => setShowCategories(false)}
                    enabledCategories={enabledCategories}
                    onToggle={handleToggle}
                    onShowResults={handleShowResults}
                  />
                ) : (
                  // Collapsed state — small pill to re-open
                  <button
                    onClick={() => setShowCategories(true)}
                    className="bg-white px-4 py-2 rounded-xl shadow-lg text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors border border-gray-200"
                  >
                    Categories
                  </button>
                )}
              </div>
            </MapControl>
          </Map>
        </APIProvider>
      </div>
    </div>
  );
}
