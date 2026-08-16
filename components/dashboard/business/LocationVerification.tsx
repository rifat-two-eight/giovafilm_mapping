"use client";

import { Switch } from "@/components/ui/switch";
import { useUpdateBusinessMutation } from "@/redux/features/business/businessApi";
import { AdvancedMarker, APIProvider, Map } from "@vis.gl/react-google-maps";
import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";

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

  const [verified, setVerified] = useState(!!isAccuracyVerified);
  const [updateBusiness, { isLoading }] = useUpdateBusinessMutation();

  useEffect(() => {
    setVerified(!!isAccuracyVerified);
  }, [isAccuracyVerified]);

  const handleToggle = async (checked: boolean) => {
    if (!businessId) return;
    const previous = verified;
    setVerified(checked);
    const formData = new FormData();
    formData.append(
      "data",
      JSON.stringify({
        isAccuracyVerified: checked,
        adminReview: { locationPinVerified: checked },
      }),
    );
    try {
      await updateBusiness({ id: businessId, data: formData }).unwrap();
    } catch (error: any) {
      setVerified(previous);
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
            maxZoom={19}
            renderingType={"RASTER"}
            gestureHandling="greedy"
            mapId={process.env.NEXT_PUBLIC_GOOGLE_MAP_ID as string}
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

        <p className="text-gray-700 mt-2">
          {[location?.address, location?.city, location?.country]
            .filter(Boolean)
            .join(", ") || "No address provided"}
        </p>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
        <div>
          <p className="text-sm font-medium text-gray-700">
            Verify pin accuracy
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {isLoading
              ? "Saving..."
              : verified
                ? "This pin matches the listed address"
                : "Turn on after confirming the map pin"}
          </p>
        </div>
        <Switch
          checked={verified}
          onCheckedChange={handleToggle}
          disabled={isLoading}
          className={verified ? "!bg-green-500" : ""}
        />
      </div>
    </div>
  );
}
