"use client";

import { Switch } from "@/components/ui/switch";
import { mapStyles } from "@/lib/utils";
import { useUpdateBusinessStatusMutation } from "@/redux/features/business/businessApi";
import { AdvancedMarker, APIProvider, Map } from "@vis.gl/react-google-maps";
import { MapPin } from "lucide-react";

import { toast } from "sonner";

export default function LocationVerification({
  businessId,
  location,
  isAccuracyVerified,
}: any) {
  // mapLocation.coordinates is [lng, lat] (GeoJSON order)
  const lng = location?.mapLocation?.coordinates?.[0];
  const lat = location?.mapLocation?.coordinates?.[1];

  const hasCoords = lat !== undefined && lng !== undefined;
  const center = hasCoords ? { lat, lng } : { lat: 23.8103, lng: 90.4125 }; // fallback: Dhaka

  const [updateStatus, { isLoading }] =
    useUpdateBusinessStatusMutation();

  const handleToggle = async (checked: boolean) => {
    if (!businessId) return;
    try {
      await updateStatus({
        id: businessId,
        isAccuracyVerified: checked,
      }).unwrap();
      toast.success(
        checked
          ? "Location accuracy verified!"
          : "Location accuracy unverified.",
      );
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update accuracy status.");
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <MapPin size={20} className="text-blue-600" />
        <h2 className="text-lg font-bold text-gray-900">
          Location Verification
        </h2>
      </div>

      {/* Map replaces the placeholder — same h-48 + rounded-lg + mb-4 classes */}
      <div className="bg-gray-200 rounded-lg h-48 mb-4 overflow-hidden">
        <APIProvider
          apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY as string}
        >
          <Map
            style={{ width: "100%", height: "100%" }}
            center={center}
            zoom={15}
            minZoom={3}
            restriction={{
              latLngBounds: {
                north: 85,
                south: -85,
                west: -180,
                east: 180,
              },
              strictBounds: true,
            }}
            gestureHandling="greedy"
            mapId={process.env.NEXT_PUBLIC_GOOGLE_MAP_ID as string}
            styles={mapStyles}
            disableDefaultUI={true}
            clickableIcons={false}
          >
            {hasCoords && <AdvancedMarker position={{ lat, lng }} />}
          </Map>
        </APIProvider>
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Physical Address
        </p>

        <p className="text-gray-700 mt-2">{location.address}</p>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
        <span className="text-sm font-medium text-gray-700">
          Verify Pin Accuracy
        </span>
        <Switch
          checked={isAccuracyVerified}
          onCheckedChange={handleToggle}
          disabled={isLoading}
          className={`${isAccuracyVerified ? "!bg-yellow-400" : ""}`}
        />
      </div>
    </div>
  );
}
