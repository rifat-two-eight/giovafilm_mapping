import { InfoWindow } from "@vis.gl/react-google-maps";
import { PlaceFormContent } from "./PlaceFormContent";

interface PlaceInfoWindowProps {
  position: { lat: number; lng: number };
  onClose: () => void;
  categories: any[];
  onSave: (data: any) => Promise<void>;
  isSaving: boolean;
  isFetchingAddress?: boolean;
  initialData?: {
    name: string;
    description: string;
    category: string;
    type?: string;
    address?: string;
    accessDescription?: string;
    recommendations?: string;
    services?: string[];
    accessibility?: any;
    images?: string[];
    isNew: boolean;
    phone?: string;
    website?: string;
    instagram?: string;
    schedules?: string;
    entryCost?: number;
    hikeTime?: string | number;
    atmosphere?: string;
    operatingHours?: Record<string, { open: string; close: string; closed: boolean }>;
  };
}

export const PlaceInfoWindow = ({
  position,
  onClose,
  categories,
  onSave,
  isSaving,
  isFetchingAddress,
  initialData,
}: PlaceInfoWindowProps) => {
  // Offset InfoWindow upward so the pin and its drag icon remain fully visible beneath it
  const offsetSize = typeof window !== "undefined" ? new window.google.maps.Size(0, -45) : undefined;

  return (
    <InfoWindow position={position} onCloseClick={onClose} headerDisabled pixelOffset={offsetSize}>
      <div className="w-[650px] max-w-[650px] bg-white rounded-2xl overflow-hidden shadow-2xl border border-gray-200 flex flex-col animate-in fade-in duration-300">
        <PlaceFormContent
          categories={categories}
          isSaving={isSaving}
          isFetchingAddress={isFetchingAddress}
          onClose={onClose}
          onSave={onSave}
          initialData={initialData}
        />
      </div>

      <style jsx global>{`
        .gm-style-iw {
          padding: 0 !important;
          max-width: none !important;
          background: transparent !important;
          box-shadow: none !important;
        }
        .gm-style-iw-d {
          overflow: visible !important;
          max-height: none !important;
        }
        .gm-style-iw-c {
          padding: 0 !important;
          border-radius: 20px !important;
          background: white !important;
          max-width: 650px !important;
          overflow: auto !important;
        }
        .gm-style-iw-tc::after {
          background: white !important;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </InfoWindow>
  );
};
