"use client";

import { mapStyles } from "@/lib/utils";
import {
  AdvancedMarker,
  APIProvider,
  Map,
  Pin,
} from "@vis.gl/react-google-maps";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function MapContent() {
  const searchParams = useSearchParams();
  const lat = parseFloat(searchParams.get("lat") || "0");
  const lng = parseFloat(searchParams.get("lng") || "0");

  const position = { lat, lng };

  if (!lat || !lng) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500">Invalid coordinates provided.</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-full">
      <APIProvider
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY as string}
      >
        <Map
          defaultCenter={position}
          defaultZoom={15}
          minZoom={3}
          maxZoom={19}
          renderingType={"RASTER"}
          gestureHandling={"greedy"}
          disableDefaultUI={false}
          mapId={process.env.NEXT_PUBLIC_GOOGLE_MAP_ID as string}
          clickableIcons={false}
        >
          <AdvancedMarker position={position}>
            <Pin
              background={"#FBBC04"}
              glyphColor={"#000"}
              borderColor={"#000"}
            />
          </AdvancedMarker>
        </Map>
      </APIProvider>
    </div>
  );
}

export default function ViewLocation() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
        </div>
      }
    >
      <MapContent />
    </Suspense>
  );
}
