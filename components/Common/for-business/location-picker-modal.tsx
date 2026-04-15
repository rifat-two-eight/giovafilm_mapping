"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapLocationPicker } from "@/components/shared/maps/MapLocationPicker";
import { useState } from "react";
import { MapPin } from "lucide-react";

interface LocationPickerModalProps {
  initialLocation?: { lat: number; lng: number };
  onSelect: (location: { lat: number; lng: number }) => void;
  trigger?: React.ReactNode;
}

export function LocationPickerModal({
  initialLocation,
  onSelect,
  trigger,
}: LocationPickerModalProps) {
  const [tempLocation, setTempLocation] = useState<{ lat: number; lng: number } | undefined>(
    initialLocation
  );
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = () => {
    if (tempLocation) {
      onSelect(tempLocation);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="w-full h-48 border-dashed border-2 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100">
            <MapPin className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-sm text-gray-500 font-semibold uppercase">
              Click to Set Pin Location
            </span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden rounded-2xl">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-bold">Set Business Location</DialogTitle>
        </DialogHeader>
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-500">
            Click on the map to place a pin or drag the marker to the exact location of your business.
          </p>
          <div className="h-[400px]">
            <MapLocationPicker
              initialLocation={initialLocation}
              onLocationSelect={setTempLocation}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-bold"
              onClick={handleConfirm}
              disabled={!tempLocation}
            >
              Confirm Location
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
