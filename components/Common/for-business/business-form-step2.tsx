"use client";

import { CustomLocationButton } from "@/components/shared/maps/CustomLocationButton";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { UseFormReturn } from "react-hook-form";

interface BusinessFormStep2Props {
  form: UseFormReturn<any>;
}

export function BusinessFormStep2({ form }: BusinessFormStep2Props) {
  const mapLocation = form.watch("mapLocation");

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold text-gray-900">Map Location</h2>

      <APIProvider
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY as string}
      >
        <div style={{ width: "100%", height: "500px" }}>
          <Map
            style={{ width: "100%", height: "100%" }}
            defaultZoom={13}
            gestureHandling={"greedy"}
            disableDefaultUI={false}
            mapId="YOUR_MAP_ID"
            mapTypeControl={true}
          >
            <CustomLocationButton />
          </Map>
        </div>
      </APIProvider>
    </div>
  );
}
