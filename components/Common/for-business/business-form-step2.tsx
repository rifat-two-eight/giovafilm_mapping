// "use client";

// import { CustomLocationButton } from "@/components/shared/maps/CustomLocationButton";
// import { Button } from "@/components/ui/button";
// import { APIProvider, Map } from "@vis.gl/react-google-maps";
// import { UseFormReturn } from "react-hook-form";

// interface BusinessFormStep2Props {
//   form: UseFormReturn<any>;
// }

// export function BusinessFormStep2({ form }: BusinessFormStep2Props) {
//   const mapLocation = form.watch("mapLocation");

//   return (
//     <div className="space-y-8">
//       <div className="flex items-center justify-between">
//         <h2 className="text-xl font-bold text-gray-900">Map Location</h2>
//         <Button>Add Location</Button>
//       </div>

//       <APIProvider
//         apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY as string}
//       >
//         <div style={{ width: "100%", height: "500px" }}>
//           <Map
//             style={{ width: "100%", height: "100%" }}
//             defaultZoom={13}
//             gestureHandling={"greedy"}
//             disableDefaultUI={false}
//             mapId="YOUR_MAP_ID"
//             mapTypeControl={true}
//           >
//             <CustomLocationButton />
//           </Map>
//         </div>
//       </APIProvider>
//     </div>
//   );
// }

"use client";

import { CustomLocationButton } from "@/components/shared/maps/CustomLocationButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AdvancedMarker,
  APIProvider,
  Map,
  MapMouseEvent,
  useMap,
} from "@vis.gl/react-google-maps";
import { useCallback, useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

interface BusinessFormStep2Props {
  form: UseFormReturn<any>;
}

interface MarkerPosition {
  lat: number;
  lng: number;
  zoom?: number;
}

// Inner component that has access to the map instance
function MapContent({
  isAddMode,
  markerPosition,
  onMapClick,
}: {
  isAddMode: boolean;
  markerPosition: MarkerPosition | null;
  onMapClick: (e: MapMouseEvent) => void;
}) {
  const map = useMap();

  useEffect(() => {
    if (map && markerPosition) {
      map.panTo(markerPosition);
      if (markerPosition.zoom) {
        map.setZoom(markerPosition.zoom);
      }
    }
  }, [map, markerPosition]);

  // Apply crosshair cursor when in add mode
  if (map) {
    map.setOptions({
      draggableCursor: isAddMode ? "crosshair" : "",
    });
  }

  return (
    <>
      <Map
        style={{ width: "100%", height: "100%" }}
        defaultCenter={{ lat: 23.7806, lng: 90.407 }}
        defaultZoom={13}
        gestureHandling={"greedy"}
        disableDefaultUI={false}
        mapId="YOUR_MAP_ID"
        mapTypeControl={true}
        onClick={isAddMode ? onMapClick : undefined}
      >
        <CustomLocationButton />

        {markerPosition && <AdvancedMarker position={markerPosition} />}
      </Map>
    </>
  );
}

export function BusinessFormStep2({ form }: BusinessFormStep2Props) {
  const [isAddMode, setIsAddMode] = useState(false);
  const [markerPosition, setMarkerPosition] = useState<MarkerPosition | null>(
    () => {
      const existing = form.getValues("mapLocation");
      return existing ?? null;
    },
  );

  const handleAddLocationClick = () => {
    setIsAddMode((prev) => !prev);
  };

  const handleExtractLocation = () => {
    const url = form.getValues("mapUrl");
    if (!url) {
      toast.error("Please enter a Google Maps URL first");
      return;
    }

    // Extraction Regex Patterns
    const patterns = [
      /@(-?\d+\.\d+),(-?\d+\.\d+)(?:,(\d+\.?\d*)z)?/, // @lat,lng,zoomz pattern
      /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/, // !3d!4d pattern
      /ll=(-?\d+\.\d+),(-?\d+\.\d+)/, // ll parameter
      /q=(-?\d+\.\d+),(-?\d+\.\d+)/, // q parameter
    ];

    let extractedCoords: MarkerPosition | null = null;

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        extractedCoords = {
          lat: parseFloat(match[1]),
          lng: parseFloat(match[2]),
          zoom: match[3] ? parseFloat(match[3]) : undefined,
        };
        break;
      }
    }

    if (extractedCoords) {
      setMarkerPosition(extractedCoords);
      form.setValue("mapLocation", extractedCoords);
      console.log("Extracted Location:", extractedCoords);
      toast.success("Location extracted successfully!");
      setIsAddMode(false);
    } else {
      toast.error(
        "Could not extract coordinates. Try using the full URL from your browser address bar.",
      );
      console.warn("Extraction failed for URL:", url);
    }
  };

  const handleMapClick = useCallback(
    (e: MapMouseEvent) => {
      if (!e.detail.latLng) return;

      const coords: MarkerPosition = {
        lat: e.detail.latLng.lat,
        lng: e.detail.latLng.lng,
      };

      setMarkerPosition(coords);
      form.setValue("mapLocation", coords);
      setIsAddMode(false); // exit add mode after placing marker

      console.log(coords);
    },
    [form],
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Map Location</h2>
        <Button
          type="button"
          onClick={handleAddLocationClick}
          variant={isAddMode ? "destructive" : "default"}
        >
          {isAddMode ? "Cancel" : "Add Location"}
        </Button>
      </div>
      <div className="space-y-2">
        <Label className="text-base font-semibold text-gray-500 uppercase tracking-wide">
          Put Your Google Map Location Url
        </Label>
        <div className="flex gap-2">
          <Input
            placeholder="https://www.google.com/maps/.../@23.7806,90.407,15z"
            {...form.register("mapUrl")}
            className="bg-gray-50 border-gray-200"
          />
          <Button
            type="button"
            onClick={handleExtractLocation}
            className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold px-6"
          >
            Add
          </Button>
        </div>
      </div>

      {isAddMode && (
        <p className="text-sm text-yellow-600 font-medium -mt-4">
          Click anywhere on the map to place your marker.
        </p>
      )}

      {markerPosition && !isAddMode && (
        <p className="text-sm text-green-600 font-medium -mt-4">
          Location set: {markerPosition.lat.toFixed(5)},{" "}
          {markerPosition.lng.toFixed(5)}
        </p>
      )}

      <APIProvider
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY as string}
      >
        <div style={{ width: "100%", height: "500px" }}>
          <MapContent
            isAddMode={isAddMode}
            markerPosition={markerPosition}
            onMapClick={handleMapClick}
          />
        </div>
      </APIProvider>
    </div>
  );
}
