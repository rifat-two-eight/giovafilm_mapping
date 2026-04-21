// "use client";

// import { CustomLocationButton } from "@/components/shared/maps/CustomLocationButton";
// import { Button } from "@/components/ui/button";
// import { Switch } from "@/components/ui/switch";
// import { getImageUrl } from "@/lib/utils";
// import { useGetPlacesQuery } from "@/redux/features/place/placeApi";
// import { useGetCategoriesQuery } from "@/redux/features/category/categoryApi";
// import {
//   AdvancedMarker,
//   APIProvider,
//   ControlPosition,
//   Map,
//   MapControl,
//   useMap,
// } from "@vis.gl/react-google-maps";
// import {
//   Landmark,
//   MountainSnow,
//   Trees,
//   Umbrella,
//   Utensils,
//   Waves,
//   X,
//   MapPin,
// } from "lucide-react";
// import { useEffect, useState } from "react";
// import LocationDialog from "./location-dialog";

// // --- Dynamic Category Icons & Colors ---
// const PREDEFINED_CATEGORIES: Record<string, { icon: any; color: string }> = {
//   beaches: { icon: Umbrella, color: "#2196F3" },
//   restaurants: { icon: Utensils, color: "#F44336" },
//   parks: { icon: Trees, color: "#4CAF50" },
//   rivers: { icon: Waves, color: "#03A9F4" },
//   caves: { icon: MountainSnow, color: "#795548" },
//   landmarks: { icon: Landmark, color: "#9C27B0" },
// };

// function getCategoryIcon(name: string) {
//   const n = name?.toLowerCase() || "";
//   return PREDEFINED_CATEGORIES[n]?.icon || MapPin;
// }

// function getCategoryColor(name: string) {
//   const n = name?.toLowerCase() || "";
//   return PREDEFINED_CATEGORIES[n]?.color || "#FF9800";
// }

// // ─── Map Categories Panel ─────────────────────────────────────────────────────
// interface MapCategoriesPanelProps {
//   onClose: () => void;
//   categories: any[];
//   enabledCategories: Record<string, boolean>;
//   onToggle: (id: string, value: boolean) => void;
//   onShowResults: () => void;
// }

// function MapCategoriesPanel({
//   onClose,
//   categories,
//   enabledCategories,
//   onToggle,
//   onShowResults,
// }: MapCategoriesPanelProps) {
//   return (
//     <div className="w-[230px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[60vh]">
//       {/* Header */}
//       <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-shrink-0">
//         <span className="text-base font-bold text-gray-900">
//           Map Categories
//         </span>
//         <button
//           onClick={onClose}
//           className="p-1 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
//         >
//           <X size={16} />
//         </button>
//       </div>

//       {/* Category list */}
//       <div className="px-3 py-2 space-y-1 overflow-y-auto">
//         {categories.map((cat) => {
//           const Icon = getCategoryIcon(cat.name);
//           const color = getCategoryColor(cat.name);
//           const enabled = enabledCategories[cat._id] ?? true;
//           return (
//             <div
//               key={cat._id}
//               className={`flex items-center gap-3 px-2 py-2.5 rounded-xl transition-colors ${
//                 enabled ? "" : "hover:bg-gray-50 text-gray-800"
//               }`}
//             >
//               {/* Colored icon circle */}
//               <div
//                 className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
//                 style={{ backgroundColor: color }}
//               >
//                 <Icon size={17} color="#fff" strokeWidth={2.2} />
//               </div>

//               {/* Label */}
//               <span className="flex-1 text-sm font-medium capitalize truncate">
//                 {cat.name}
//               </span>

//               {/* Toggle — yellow when on, gray when off */}
//               <Switch
//                 checked={enabled}
//                 onCheckedChange={(val) => onToggle(cat._id, val)}
//                 className={`${enabled ? "bg-primary" : "bg-gray-300"} data-[state=checked]:bg-amber-400 data-[state=unchecked]:bg-gray-300`}
//               />
//             </div>
//           );
//         })}
//         {categories.length === 0 && (
//           <div className="text-sm text-gray-500 text-center py-4">
//             No categories found.
//           </div>
//         )}
//       </div>

//       {/* Footer button */}
//       <div className="p-3 border-t border-gray-100 shrink-0">
//         <Button
//           onClick={onShowResults}
//           className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold text-sm rounded-xl py-2.5 h-auto"
//         >
//           Show results
//         </Button>
//       </div>
//     </div>
//   );
// }

// // ─── Geolocation on load ──────────────────────────────────────────────────────
// function GeolocationOnLoad({
//   onLocation,
// }: {
//   onLocation: (pos: { lat: number; lng: number }) => void;
// }) {
//   const map = useMap();

//   useEffect(() => {
//     if (!map || !navigator.geolocation) return;
//     navigator.geolocation.getCurrentPosition((pos) => {
//       const location = { lat: pos.coords.latitude, lng: pos.coords.longitude };
//       map.panTo(location);
//       onLocation(location);
//     });
//   }, [map]);

//   return null;
// }

// // ─── Main Page ────────────────────────────────────────────────────────────────
// export default function MapPage() {
//   const defaultPosition = { lat: 23.8103, lng: 90.4125 };
//   const [markerPos, setMarkerPos] = useState(defaultPosition);
//   const [showCategories, setShowCategories] = useState(true);

//   const [enabledCategories, setEnabledCategories] = useState<
//     Record<string, boolean>
//   >({});

//   const handleToggle = (id: string, value: boolean) => {
//     setEnabledCategories((prev) => ({ ...prev, [id]: value }));
//   };

//   const handleShowResults = () => {
//     console.log("Active categories:", enabledCategories);
//     setShowCategories(false);
//   };

//   // --- API Fetches ---
//   const { data: placesRes } = useGetPlacesQuery({ limit: 100 });
//   const fetchedPlaces = placesRes?.data || [];

//   const { data: categoriesRes } = useGetCategoriesQuery({ limit: 100 });
//   const fetchedCategories = categoriesRes?.data || [];

//   // Initialize enabled categories to false when they load
//   useEffect(() => {
//     if (
//       fetchedCategories.length > 0 &&
//       Object.keys(enabledCategories).length === 0
//     ) {
//       const initial: Record<string, boolean> = {};
//       fetchedCategories.forEach((c: any) => {
//         initial[c._id] = false;
//       });
//       setEnabledCategories(initial);
//     }
//   }, [fetchedCategories]);

//   const [selectedLocation, setSelectedLocation] = useState<any>(null);

//   // Filter places based on enabled categories
//   const isAnyCategoryEnabled = Object.values(enabledCategories).some(
//     (val) => val,
//   );

//   const displayPlaces = fetchedPlaces.filter((place: any) => {
//     if (!isAnyCategoryEnabled) return true; // Show all maps if no categories are enabled

//     const categoryId = place.category?._id || place.category;
//     if (!categoryId) return false;

//     const _id =
//       typeof categoryId === "string" ? categoryId : categoryId.toString();

//     return enabledCategories[_id] === true;
//   });

//   return (
//     <div className="min-h-screen">
//       <div style={{ height: "calc(100vh - 100px)", width: "100%" }}>
//         <APIProvider
//           apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY as string}
//         >
//           <Map
//             defaultCenter={defaultPosition}
//             defaultZoom={13}
//             gestureHandling={"greedy"}
//             disableDefaultUI={false}
//             mapId="YOUR_MAP_ID"
//             mapTypeControl={true}
//             mapTypeControlOptions={{
//               position: ControlPosition.TOP_RIGHT,
//             }}
//           >
//             {/* Pans once on mount — no controlled center prop needed */}
//             <GeolocationOnLoad onLocation={setMarkerPos} />

//             <CustomLocationButton />

//             <AdvancedMarker position={markerPos} />

//             {/* Render all fetched places as markers */}
//             {displayPlaces.map((place: any) => {
//               const position = {
//                 lat: place.location?.coordinates[1] || place.latitude,
//                 lng: place.location?.coordinates[0] || place.longitude,
//               };

//               if (!position.lat || !position.lng) return null;

//               return (
//                 <AdvancedMarker
//                   key={place._id}
//                   position={position}
//                   onClick={() => {
//                     setSelectedLocation({
//                       id: place._id,
//                     });
//                   }}
//                 />
//               );
//             })}

//             {/* Categories panel — top-left overlay via MapControl */}
//             <MapControl position={ControlPosition.TOP_LEFT}>
//               <div className="m-3">
//                 {showCategories ? (
//                   <MapCategoriesPanel
//                     onClose={() => setShowCategories(false)}
//                     categories={fetchedCategories}
//                     enabledCategories={enabledCategories}
//                     onToggle={handleToggle}
//                     onShowResults={handleShowResults}
//                   />
//                 ) : (
//                   // Collapsed state — small pill to re-open
//                   <button
//                     onClick={() => setShowCategories(true)}
//                     className="bg-white px-4 py-2 rounded-xl shadow-lg text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors border border-gray-200"
//                   >
//                     Categories
//                   </button>
//                 )}
//               </div>
//             </MapControl>
//           </Map>
//         </APIProvider>

//         {/* Location Dialog Overlay */}
//         {selectedLocation && (
//           <LocationDialog
//             id={selectedLocation}
//             onClose={() => setSelectedLocation(null)}
//           />
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { CustomLocationButton } from "@/components/shared/maps/CustomLocationButton";
import { CategoryMarker } from "@/components/shared/maps/category-marker";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useGetCategoriesQuery } from "@/redux/features/category/categoryApi";
import { useGetPlacesQuery } from "@/redux/features/place/placeApi";
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
  MapPin,
  MountainSnow,
  Trees,
  Umbrella,
  Utensils,
  Waves,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import LocationDialog from "./location-dialog";

// --- Dynamic Category Icons & Colors ---
const PREDEFINED_CATEGORIES: Record<string, { icon: any; color: string }> = {
  beaches: { icon: Umbrella, color: "#2196F3" },
  restaurants: { icon: Utensils, color: "#F44336" },
  parks: { icon: Trees, color: "#4CAF50" },
  rivers: { icon: Waves, color: "#03A9F4" },
  caves: { icon: MountainSnow, color: "#795548" },
  landmarks: { icon: Landmark, color: "#9C27B0" },
};

function getCategoryIcon(name: string) {
  const n = name?.toLowerCase() || "";
  return PREDEFINED_CATEGORIES[n]?.icon || MapPin;
}

function getCategoryColor(name: string) {
  const n = name?.toLowerCase() || "";
  return PREDEFINED_CATEGORIES[n]?.color || "#FF9800";
}

// ─── Map Categories Panel ─────────────────────────────────────────────────────
interface MapCategoriesPanelProps {
  onClose: () => void;
  categories: any[];
  enabledCategories: Record<string, boolean>;
  onToggle: (id: string, value: boolean) => void;
  onShowResults: () => void;
}

function MapCategoriesPanel({
  onClose,
  categories,
  enabledCategories,
  onToggle,
  onShowResults,
}: MapCategoriesPanelProps) {
  return (
    <div className="w-[230px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[60vh]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-shrink-0">
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
      <div className="px-3 py-2 space-y-1 overflow-y-auto">
        {categories.map((cat) => {
          const Icon = getCategoryIcon(cat.name);
          const color = getCategoryColor(cat.name);
          const enabled = enabledCategories[cat._id] ?? true;
          return (
            <div
              key={cat._id}
              className={`flex items-center gap-3 px-2 py-2.5 rounded-xl transition-colors ${
                enabled ? "" : "hover:bg-gray-50 text-gray-800"
              }`}
            >
              {/* Colored icon circle */}
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: color }}
              >
                <Icon size={17} color="#fff" strokeWidth={2.2} />
              </div>

              {/* Label */}
              <span className="flex-1 text-sm font-medium capitalize truncate">
                {cat.name}
              </span>

              {/* Toggle — yellow when on, gray when off */}
              <Switch
                checked={enabled}
                onCheckedChange={(val) => onToggle(cat._id, val)}
                className={`${enabled ? "bg-primary" : "bg-gray-300"} data-[state=checked]:bg-amber-400 data-[state=unchecked]:bg-gray-300`}
              />
            </div>
          );
        })}
        {categories.length === 0 && (
          <div className="text-sm text-gray-500 text-center py-4">
            No categories found.
          </div>
        )}
      </div>

      {/* Footer button */}
      <div className="p-3 border-t border-gray-100 shrink-0">
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
  >({});

  const handleToggle = (id: string, value: boolean) => {
    setEnabledCategories((prev) => ({ ...prev, [id]: value }));
  };

  const handleShowResults = () => {
    console.log("Active categories:", enabledCategories);
    setShowCategories(false);
  };

  // --- API Fetches ---
  const { data: placesRes } = useGetPlacesQuery({ limit: 100 });
  const fetchedPlaces = placesRes?.data || [];

  const { data: categoriesRes } = useGetCategoriesQuery({ limit: 100 });
  const fetchedCategories = categoriesRes?.data || [];

  // Initialize enabled categories to false when they load
  useEffect(() => {
    if (
      fetchedCategories.length > 0 &&
      Object.keys(enabledCategories).length === 0
    ) {
      const initial: Record<string, boolean> = {};
      fetchedCategories.forEach((c: any) => {
        initial[c._id] = false;
      });
      setEnabledCategories(initial);
    }
  }, [fetchedCategories]);

  const [selectedLocation, setSelectedLocation] = useState<any>(null);

  // Filter places based on enabled categories
  const isAnyCategoryEnabled = Object.values(enabledCategories).some(
    (val) => val,
  );

  const displayPlaces = fetchedPlaces.filter((place: any) => {
    if (!isAnyCategoryEnabled) return true; // Show all maps if no categories are enabled

    const categoryId = place.category?._id || place.category;
    if (!categoryId) return false;

    const _id =
      typeof categoryId === "string" ? categoryId : categoryId.toString();

    return enabledCategories[_id] === true;
  });

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

            {/* User's current location marker — default pin style */}
            <AdvancedMarker position={markerPos} />

            {/* Render all fetched places as category-icon markers */}
            {displayPlaces.map((place: any) => {
              const position = {
                lat: place.location?.coordinates[1] || place.latitude,
                lng: place.location?.coordinates[0] || place.longitude,
              };

              if (!position.lat || !position.lng) return null;

              // Resolve category — may be a populated object or just an ID
              const cat =
                typeof place.category === "object"
                  ? place.category
                  : fetchedCategories.find(
                      (c: any) => c._id === place.category,
                    );

              const icon = cat?.icon || "📍";
              const color = getCategoryColor(cat?.name || "");

              return (
                <AdvancedMarker
                  key={place._id}
                  position={position}
                  onClick={() => {
                    setSelectedLocation({
                      id: place._id,
                    });
                  }}
                >
                  <CategoryMarker
                    icon={icon}
                    color={color}
                    isSelected={selectedLocation?.id === place._id}
                  />
                </AdvancedMarker>
              );
            })}

            {/* Categories panel — top-left overlay via MapControl */}
            <MapControl position={ControlPosition.TOP_LEFT}>
              <div className="m-3">
                {showCategories ? (
                  <MapCategoriesPanel
                    onClose={() => setShowCategories(false)}
                    categories={fetchedCategories}
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

        {/* Location Dialog Overlay */}
        {selectedLocation && (
          <LocationDialog
            id={selectedLocation}
            onClose={() => setSelectedLocation(null)}
          />
        )}
      </div>
    </div>
  );
}
