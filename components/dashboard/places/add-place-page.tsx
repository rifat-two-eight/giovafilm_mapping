// "use client";

// import { AddCategoryDialog } from "@/components/dashboard/categories/AddCategoryDialog";
// import { CustomLocationButton } from "@/components/shared/maps/CustomLocationButton";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { useGetCategoriesQuery } from "@/redux/features/category/categoryApi";
// import { useGetMapsQuery } from "@/redux/features/map/mapApi";
// import {
//   useCreatePlaceMutation,
//   useGetPlacesQuery,
// } from "@/redux/features/place/placeApi";
// import {
//   AdvancedMarker,
//   APIProvider,
//   Map,
//   useMap,
// } from "@vis.gl/react-google-maps";
// import { ChevronRight, Map as MapIcon, Plus, Search } from "lucide-react";
// import { useEffect, useState } from "react";
// import { toast } from "sonner";
// import { PlaceInfoWindow } from "./PlaceInfoWindow";

// // ─── Inner component: pans to user's location once on mount ───────────────────
// // Must live inside <APIProvider> so useMap() works.
// function GeolocationOnLoad() {
//   const map = useMap();

//   useEffect(() => {
//     if (!map || !navigator.geolocation) return;
//     navigator.geolocation.getCurrentPosition((pos) => {
//       map.panTo({ lat: pos.coords.latitude, lng: pos.coords.longitude });
//     });
//   }, [map]);

//   return null;
// }

// export default function AddPlacePage() {
//   const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
//     null,
//   );
//   const [selectedMapId, setSelectedMapId] = useState<string | null>(null);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const defaultPosition = { lat: 23.8103, lng: 90.4125 };

//   // --- API Fetches ---
//   const { data: mapsRes } = useGetMapsQuery({ limit: 100 });
//   const { data: categoriesRes } = useGetCategoriesQuery({ limit: 100 });
//   const { data: placesRes } = useGetPlacesQuery(
//     { map: selectedMapId || "" },
//     { skip: !selectedMapId },
//   );

//   const maps = mapsRes?.data || [];
//   const categories = categoriesRes?.data || [];
//   const fetchedPlaces = placesRes?.data || [];
//   const selectedMap = maps.find((m: any) => m._id === selectedMapId);

//   // --- States for Marker Management ---
//   const [isAddingMarker, setIsAddingMarker] = useState(false);
//   const [tempMarker, setTempMarker] = useState<{
//     lat: number;
//     lng: number;
//   } | null>(null);
//   const [selectedPlace, setSelectedPlace] = useState<any | null>(null);

//   const [formData, setFormData] = useState({ name: "", description: "" });

//   const [createPlace, { isLoading: isCreating }] = useCreatePlaceMutation();

//   const handleMapClick = (e: any) => {
//     if (!isAddingMarker) return;
//     if (!selectedMapId) {
//       toast.error("Please select a map first!");
//       setIsAddingMarker(false);
//       return;
//     }
//     const newLat = e.detail.latLng.lat;
//     const newLng = e.detail.latLng.lng;

//     setTempMarker({ lat: newLat, lng: newLng });
//     setSelectedPlace({ position: { lat: newLat, lng: newLng }, isNew: true });
//     setFormData({ name: "", description: "" });
//     setIsAddingMarker(false);
//   };

//   const handleSavePlace = async (data?: any) => {
//     // data comes from PlaceInfoWindow for new places
//     const finalData = data || formData;
//     const saveMarker =
//       tempMarker || (selectedPlace?.isNew ? selectedPlace.position : null);

//     if (!saveMarker || !selectedMapId) return;

//     if (!finalData.category && !selectedCategoryId) {
//       toast.error("Please select a category first!");
//       return;
//     }

//     try {
//       const placeData = {
//         name: finalData.name || "Untitled Place",
//         map: selectedMapId,
//         category: finalData.category || selectedCategoryId,
//         description: finalData.description,
//         location: {
//           type: "Point",
//           coordinates: [saveMarker.lng, saveMarker.lat],
//         },
//         address: finalData.address || "New Address",
//         status: finalData.status || "Published",
//         services: finalData.services || [],
//         accessibility: {
//           features: finalData.accessibility
//             ? Object.entries(finalData.accessibility)
//                 .filter(([k, v]) => v === true && k !== "notes")
//                 .map(([k]) => k)
//             : [],
//           notes: finalData.accessibility?.notes || "",
//         },
//         details: {
//           access: finalData.accessDescription || "",
//           recommendations: finalData.recommendations || "",
//         },
//       };

//       let payload: any = placeData;

//       // If there are media files, we must use FormData
//       if (finalData.mediaFiles && finalData.mediaFiles.length > 0) {
//         const formDataPayload = new FormData();
//         formDataPayload.append("data", JSON.stringify(placeData));

//         finalData.mediaFiles.forEach((file: File) => {
//           formDataPayload.append("images", file);
//         });

//         payload = formDataPayload;
//       }

//       await createPlace(payload).unwrap();
//       toast.success(
//         `Place ${finalData.status === "Published" ? "published" : "saved as draft"} successfully!`,
//       );

//       setSelectedPlace(null);
//       setTempMarker(null);
//       setFormData({ name: "", description: "" });
//       setSelectedCategoryId(null);
//     } catch (error: any) {
//       toast.error(error?.data?.message || "Failed to save place");
//       console.error("Failed to save place:", error);
//     }
//   };

//   return (
//     <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY as string}>
//       <div className="flex h-[85vh] w-full bg-white overflow-hidden font-sans rounded-2xl">
//         {/* Sidebar */}
//         <div className="w-80 flex flex-col border-r border-gray-200 bg-white z-20 shadow-sm">
//           <div className="p-6 space-y-4">
//             <div className="space-y-3">
//               <div className="space-y-1">
//                 <h1 className="text-xl font-black tracking-tight text-gray-900 uppercase">
//                   {selectedMap?.name || "Select a Map"}
//                 </h1>
//                 <div className="flex items-center gap-2 text-sm text-gray-600">
//                   <span>Roadtripeado Maps 9.0</span>
//                 </div>
//               </div>

//               {/* Map Selector */}
//               <div className="space-y-1.5">
//                 <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
//                   Active Map
//                 </Label>
//                 <Select
//                   value={selectedMapId || ""}
//                   onValueChange={setSelectedMapId}
//                 >
//                   <SelectTrigger className="w-full bg-gray-50 border-gray-200">
//                     <SelectValue placeholder="Choose a map..." />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {maps.map((map: any) => (
//                       <SelectItem key={map._id} value={map._id}>
//                         <div className="flex items-center gap-2">
//                           <MapIcon size={14} className="text-blue-500" />
//                           <span className="truncate">{map.name}</span>
//                         </div>
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>

//             <div className="space-y-2">
//               <button
//                 onClick={() => {
//                   if (!selectedMapId) {
//                     toast.error("Please select a map before adding a place.");
//                     return;
//                   }
//                   setIsAddingMarker(true);
//                 }}
//                 className={`w-full flex items-center gap-3 px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors ${
//                   isAddingMarker
//                     ? "bg-blue-600 text-white border-blue-600 shadow-md"
//                     : "border-gray-200 text-gray-700 hover:bg-gray-50"
//                 }`}
//               >
//                 <Plus size={16} />
//                 {isAddingMarker ? "Click on Map" : "Add Place (Drop Pin)"}
//               </button>
//               <button
//                 onClick={() => setIsDialogOpen(true)}
//                 className="w-full flex items-center gap-3 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
//               >
//                 <Plus size={16} /> Add Category
//               </button>
//             </div>

//             <div className="relative">
//               <Search
//                 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                 size={16}
//               />
//               <input
//                 type="text"
//                 placeholder="Search places..."
//                 className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
//               />
//             </div>
//           </div>

//           {/* Categories List */}
//           <div className="flex-1 overflow-y-auto px-2">
//             <div className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
//               Categories
//             </div>
//             <div className="space-y-0.5">
//               {categories.map((cat: any) => (
//                 <button
//                   key={cat._id}
//                   onClick={() => setSelectedCategoryId(cat._id)}
//                   className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm transition-colors ${
//                     selectedCategoryId === cat._id
//                       ? "bg-blue-50 text-blue-700 font-semibold"
//                       : "text-gray-600 hover:bg-gray-50"
//                   }`}
//                 >
//                   <div className="flex items-center gap-3">
//                     <ChevronRight
//                       size={14}
//                       className={
//                         selectedCategoryId === cat._id
//                           ? "text-blue-500"
//                           : "text-gray-300"
//                       }
//                     />
//                     <span className="text-lg">{cat.icon}</span>
//                     <span className="truncate">{cat.name}</span>
//                   </div>
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div className="p-4 border-t border-gray-100 space-y-2">
//             <button className="w-full text-left text-xs text-gray-500 hover:text-blue-600 transition-colors">
//               Import places (CSV)
//             </button>
//             <button className="w-full text-left text-xs text-gray-500 hover:text-blue-600 transition-colors">
//               Export map
//             </button>
//           </div>

//           <div className="bg-gray-100 p-3 text-[10px] font-bold text-gray-500 uppercase">
//             Selected Map: {selectedMap?.name || "None"}
//           </div>
//         </div>

//         {/* Map Area */}
//         <div className="flex-1 relative">
//           <div className="w-full h-full bg-gray-200">
//             <Map
//               defaultCenter={defaultPosition}
//               defaultZoom={13}
//               gestureHandling={"greedy"}
//               disableDefaultUI={false}
//               mapId="YOUR_MAP_ID"
//               onClick={handleMapClick}
//               style={{ cursor: isAddingMarker ? "crosshair" : "grab" }}
//             >
//               {/* Pans to user's geolocation once on mount — no controlled center prop */}
//               <GeolocationOnLoad />

//               <CustomLocationButton />

//               {/* Saved markers from server */}
//               {fetchedPlaces.map((place: any) => {
//                 const position = {
//                   lat: place.location.coordinates[1],
//                   lng: place.location.coordinates[0],
//                 };
//                 return (
//                   <AdvancedMarker
//                     key={place._id}
//                     position={position}
//                     onClick={() => {
//                       setSelectedPlace({ ...place, position, isNew: false });
//                       setFormData({
//                         name: place.name,
//                         description: place.description || "",
//                       });
//                       // If category is an object, get its ID, otherwise it's already the ID string
//                       const catId =
//                         typeof place.category === "object"
//                           ? place.category?._id
//                           : place.category;
//                       setSelectedCategoryId(catId || null);
//                     }}
//                   />
//                 );
//               })}

//               {/* Temporary marker (not yet saved) */}
//               {tempMarker && (
//                 <AdvancedMarker
//                   position={tempMarker}
//                   onClick={() =>
//                     setSelectedPlace({ position: tempMarker, isNew: true })
//                   }
//                 />
//               )}

//               {/* InfoWindow for new or existing place */}
//               {selectedPlace && (
//                 <PlaceInfoWindow
//                   position={selectedPlace.position}
//                   onClose={() => setSelectedPlace(null)}
//                   categories={categories}
//                   onSave={handleSavePlace}
//                   isSaving={isCreating}
//                   initialData={{
//                     name: selectedPlace.name || "",
//                     description: selectedPlace.description || "",
//                     category: selectedCategoryId || "",
//                     isNew: selectedPlace.isNew,
//                   }}
//                 />
//               )}
//             </Map>
//           </div>
//         </div>

//         <AddCategoryDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
//       </div>
//     </APIProvider>
//   );
// }

"use client";

import { AddCategoryDialog } from "@/components/dashboard/categories/AddCategoryDialog";

import { CustomLocationButton } from "@/components/shared/maps/CustomLocationButton";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetCategoriesQuery } from "@/redux/features/category/categoryApi";
import { useGetMapsQuery } from "@/redux/features/map/mapApi";
import {
  useCreatePlaceMutation,
  useGetPlacesQuery,
} from "@/redux/features/place/placeApi";
import {
  AdvancedMarker,
  APIProvider,
  Map,
  useMap,
} from "@vis.gl/react-google-maps";
import { ChevronRight, Map as MapIcon, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PlaceInfoWindow } from "./PlaceInfoWindow";
import { CategoryMarker } from "@/components/shared/maps/category-marker";

// ─── Category color palette ────────────────────────────────────────────────────
// Maps category name (lowercase) to a pin color.
// Extend this as you add more categories.
const CATEGORY_COLORS: Record<string, string> = {
  restaurant: "#EF4444",
  food: "#EF4444",
  cafe: "#F97316",
  coffee: "#F97316",
  hotel: "#8B5CF6",
  accommodation: "#8B5CF6",
  lodging: "#8B5CF6",
  park: "#10B981",
  nature: "#10B981",
  beach: "#06B6D4",
  shopping: "#F59E0B",
  store: "#F59E0B",
  mall: "#F59E0B",
  museum: "#6366F1",
  culture: "#6366F1",
  art: "#EC4899",
  hospital: "#EF4444",
  pharmacy: "#10B981",
  gas: "#64748B",
  transport: "#0EA5E9",
  airport: "#0EA5E9",
  bar: "#A855F7",
  nightlife: "#A855F7",
  sport: "#22C55E",
  gym: "#22C55E",
  default: "#3B82F6",
};

/**
 * Resolves a pin color from a category object.
 * Tries the category's own `color` field first,
 * then falls back to the CATEGORY_COLORS map keyed on name.
 */
function resolveCategoryColor(cat: any): string {
  if (!cat) return CATEGORY_COLORS.default;
  if (cat.color) return cat.color;
  const key = (cat.name || "").toLowerCase();
  for (const [k, v] of Object.entries(CATEGORY_COLORS)) {
    if (key.includes(k)) return v;
  }
  return CATEGORY_COLORS.default;
}

// ─── Inner component: pans to user's location once on mount ───────────────────
// Must live inside <APIProvider> so useMap() works.
function GeolocationOnLoad() {
  const map = useMap();

  useEffect(() => {
    if (!map || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      map.panTo({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    });
  }, [map]);

  return null;
}

export default function AddPlacePage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [selectedMapId, setSelectedMapId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const defaultPosition = { lat: 23.8103, lng: 90.4125 };

  // --- API Fetches ---
  const { data: mapsRes } = useGetMapsQuery({ limit: 100 });
  const { data: categoriesRes } = useGetCategoriesQuery({ limit: 100 });
  const { data: placesRes } = useGetPlacesQuery(
    { map: selectedMapId || "" },
    { skip: !selectedMapId },
  );

  const maps = mapsRes?.data || [];
  const categories = categoriesRes?.data || [];
  const fetchedPlaces = placesRes?.data || [];
  const selectedMap = maps.find((m: any) => m._id === selectedMapId);

  // --- States for Marker Management ---
  const [isAddingMarker, setIsAddingMarker] = useState(false);
  const [tempMarker, setTempMarker] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<any | null>(null);

  const [formData, setFormData] = useState({ name: "", description: "" });

  const [createPlace, { isLoading: isCreating }] = useCreatePlaceMutation();

  const handleMapClick = (e: any) => {
    if (!isAddingMarker) return;
    if (!selectedMapId) {
      toast.error("Please select a map first!");
      setIsAddingMarker(false);
      return;
    }
    const newLat = e.detail.latLng.lat;
    const newLng = e.detail.latLng.lng;

    setTempMarker({ lat: newLat, lng: newLng });
    setSelectedPlace({ position: { lat: newLat, lng: newLng }, isNew: true });
    setFormData({ name: "", description: "" });
    setIsAddingMarker(false);
  };

  const handleSavePlace = async (data?: any) => {
    const finalData = data || formData;
    const saveMarker =
      tempMarker || (selectedPlace?.isNew ? selectedPlace.position : null);

    if (!saveMarker || !selectedMapId) return;

    if (!finalData.category && !selectedCategoryId) {
      toast.error("Please select a category first!");
      return;
    }

    try {
      const placeData = {
        name: finalData.name || "Untitled Place",
        map: selectedMapId,
        category: finalData.category || selectedCategoryId,
        description: finalData.description,
        location: {
          type: "Point",
          coordinates: [saveMarker.lng, saveMarker.lat],
        },
        address: finalData.address || "New Address",
        status: finalData.status || "Published",
        services: finalData.services || [],
        accessibility: {
          features: finalData.accessibility
            ? Object.entries(finalData.accessibility)
                .filter(([k, v]) => v === true && k !== "notes")
                .map(([k]) => k)
            : [],
          notes: finalData.accessibility?.notes || "",
        },
        details: {
          access: finalData.accessDescription || "",
          recommendations: finalData.recommendations || "",
        },
      };

      let payload: any = placeData;

      if (finalData.mediaFiles && finalData.mediaFiles.length > 0) {
        const formDataPayload = new FormData();
        formDataPayload.append("data", JSON.stringify(placeData));
        finalData.mediaFiles.forEach((file: File) => {
          formDataPayload.append("images", file);
        });
        payload = formDataPayload;
      }

      await createPlace(payload).unwrap();
      toast.success(
        `Place ${finalData.status === "Published" ? "published" : "saved as draft"} successfully!`,
      );

      setSelectedPlace(null);
      setTempMarker(null);
      setFormData({ name: "", description: "" });
      setSelectedCategoryId(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save place");
      console.error("Failed to save place:", error);
    }
  };

  // Helper: find a category object by its _id
  const findCategoryById = (id: string | undefined) =>
    categories.find((c: any) => c._id === id);

  // The currently selected category (used for the temp marker icon)
  const activeCategory = findCategoryById(selectedCategoryId || undefined);

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY as string}>
      <div className="flex h-[85vh] w-full bg-white overflow-hidden font-sans rounded-2xl">
        {/* Sidebar */}
        <div className="w-80 flex flex-col border-r border-gray-200 bg-white z-20 shadow-sm">
          <div className="p-6 space-y-4">
            <div className="space-y-3">
              <div className="space-y-1">
                <h1 className="text-xl font-black tracking-tight text-gray-900 uppercase">
                  {selectedMap?.name || "Select a Map"}
                </h1>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Roadtripeado Maps 9.0</span>
                </div>
              </div>

              {/* Map Selector */}
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                  Active Map
                </Label>
                <Select
                  value={selectedMapId || ""}
                  onValueChange={setSelectedMapId}
                >
                  <SelectTrigger className="w-full bg-gray-50 border-gray-200">
                    <SelectValue placeholder="Choose a map..." />
                  </SelectTrigger>
                  <SelectContent>
                    {maps.map((map: any) => (
                      <SelectItem key={map._id} value={map._id}>
                        <div className="flex items-center gap-2">
                          <MapIcon size={14} className="text-blue-500" />
                          <span className="truncate">{map.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  if (!selectedMapId) {
                    toast.error("Please select a map before adding a place.");
                    return;
                  }
                  setIsAddingMarker(true);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors ${
                  isAddingMarker
                    ? "bg-blue-600 text-white border-blue-600 shadow-md"
                    : "border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Plus size={16} />
                {isAddingMarker ? "Click on Map" : "Add Place (Drop Pin)"}
              </button>
              <button
                onClick={() => setIsDialogOpen(true)}
                className="w-full flex items-center gap-3 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Plus size={16} /> Add Category
              </button>
            </div>

            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search places..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Categories List */}
          <div className="flex-1 overflow-y-auto px-2">
            <div className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Categories
            </div>
            <div className="space-y-0.5">
              {categories.map((cat: any) => (
                <button
                  key={cat._id}
                  onClick={() => setSelectedCategoryId(cat._id)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm transition-colors ${
                    selectedCategoryId === cat._id
                      ? "bg-blue-50 text-blue-700 font-semibold"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ChevronRight
                      size={14}
                      className={
                        selectedCategoryId === cat._id
                          ? "text-blue-500"
                          : "text-gray-300"
                      }
                    />
                    {/* Small colored dot matching pin color */}
                    <span
                      style={{
                        display: "inline-block",
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: resolveCategoryColor(cat),
                        flexShrink: 0,
                      }}
                    />
                    <span className="text-lg">{cat.icon}</span>
                    <span className="truncate">{cat.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 border-t border-gray-100 space-y-2">
            <button className="w-full text-left text-xs text-gray-500 hover:text-blue-600 transition-colors">
              Import places (CSV)
            </button>
            <button className="w-full text-left text-xs text-gray-500 hover:text-blue-600 transition-colors">
              Export map
            </button>
          </div>

          <div className="bg-gray-100 p-3 text-[10px] font-bold text-gray-500 uppercase">
            Selected Map: {selectedMap?.name || "None"}
          </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 relative">
          <div className="w-full h-full bg-gray-200">
            <Map
              defaultCenter={defaultPosition}
              defaultZoom={13}
              gestureHandling={"greedy"}
              disableDefaultUI={false}
              mapId="YOUR_MAP_ID"
              onClick={handleMapClick}
              style={{ cursor: isAddingMarker ? "crosshair" : "grab" }}
            >
              {/* Pans to user's geolocation once on mount */}
              <GeolocationOnLoad />

              <CustomLocationButton />

              {/* ── Saved markers from server ── */}
              {fetchedPlaces.map((place: any) => {
                const position = {
                  lat: place.location.coordinates[1],
                  lng: place.location.coordinates[0],
                };

                // Resolve category — it may be a populated object or just an ID string
                const cat =
                  typeof place.category === "object"
                    ? place.category
                    : findCategoryById(place.category);

                const isSelected = selectedPlace?._id === place._id;

                return (
                  <AdvancedMarker
                    key={place._id}
                    position={position}
                    onClick={() => {
                      setSelectedPlace({ ...place, position, isNew: false });
                      setFormData({
                        name: place.name,
                        description: place.description || "",
                      });
                      const catId =
                        typeof place.category === "object"
                          ? place.category?._id
                          : place.category;
                      setSelectedCategoryId(catId || null);
                    }}
                  >
                    <CategoryMarker
                      icon={cat?.icon || "📍"}
                      color={resolveCategoryColor(cat)}
                      isSelected={isSelected}
                    />
                  </AdvancedMarker>
                );
              })}

              {/* ── Temporary marker (not yet saved) ── */}
              {tempMarker && (
                <AdvancedMarker
                  position={tempMarker}
                  onClick={() =>
                    setSelectedPlace({ position: tempMarker, isNew: true })
                  }
                >
                  <CategoryMarker
                    icon={activeCategory?.icon || "📍"}
                    color={resolveCategoryColor(activeCategory)}
                    isTemp={true}
                    isSelected={true}
                  />
                </AdvancedMarker>
              )}

              {/* ── InfoWindow for new or existing place ── */}
              {selectedPlace && (
                <PlaceInfoWindow
                  position={selectedPlace.position}
                  onClose={() => setSelectedPlace(null)}
                  categories={categories}
                  onSave={handleSavePlace}
                  isSaving={isCreating}
                  initialData={{
                    name: selectedPlace.name || "",
                    description: selectedPlace.description || "",
                    category: selectedCategoryId || "",
                    isNew: selectedPlace.isNew,
                  }}
                />
              )}
            </Map>
          </div>
        </div>

        <AddCategoryDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      </div>
    </APIProvider>
  );
}
