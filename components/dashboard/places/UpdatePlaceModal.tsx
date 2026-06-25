"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useGetCategoriesQuery } from "@/redux/features/category/categoryApi";
import {
  useGetPlaceDetailsQuery,
  useGetPlacesQuery,
  useUpdatePlaceMutation,
} from "@/redux/features/place/placeApi";
import { X } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { PlaceFormContent } from "./PlaceFormContent";

interface UpdatePlaceModalProps {
  placeId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpdatePlaceModal({
  placeId,
  open,
  onOpenChange,
}: UpdatePlaceModalProps) {
  const { data: placeRes, isLoading: isLoadingPlace } = useGetPlaceDetailsQuery(
    placeId as string,
    { skip: !placeId },
  );

  const { data: categoriesRes } = useGetCategoriesQuery({ limit: 100 });
  const { data: mapsRes } = useGetPlacesQuery({ limit: 1 });
  const [updatePlace, { isLoading: isUpdating }] = useUpdatePlaceMutation();

  const place = placeRes?.data;
  const categories = categoriesRes?.data || [];
  const defaultMapId = mapsRes?.data?.[0]?._id || "";

  // Lock body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    if (open) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  const handleUpdate = async (finalData: any) => {
    if (!placeId) return;

    try {
      console.log("handleUpdate called, placeId:", placeId);
      console.log("finalData received:", finalData);

      const placeData = {
        name: finalData.name,
        map: finalData.map || place.map?._id || place.map || defaultMapId,
        category: finalData.category,
        type: finalData.type || "Regular",
        description: finalData.description,
        address: finalData.address,
        status: finalData.status,
        services: finalData.services,
        accessibility: {
          features: finalData.accessibility
            ? Object.entries(finalData.accessibility)
              .filter(([k, v]) => v === true && k !== "notes")
              .map(([k]) => k)
            : [],
          notes: finalData.accessibility?.notes || "",
        },
        access: finalData.accessDescription || "",
        recommendations: { tips: finalData.tips || "" },
        details: {
          recommendations: finalData.tips || "",
        },
        // New fields
        schedules: finalData.schedules || "",
        entryCost: finalData.entryCost || "",
        hikeTime: finalData.hikeTime || "",
        atmosphere: finalData.atmosphere || "",
        difficulty: finalData.difficulty || "",
        // Pass retained existing images back so backend knows what to keep
        media: finalData.existingImages || [],
      };

      console.log("placeData constructed:", placeData);

      let payload: any = placeData;

      if (finalData.mediaFiles && finalData.mediaFiles.length > 0) {
        const formDataPayload = new FormData();
        formDataPayload.append("data", JSON.stringify(placeData));
        finalData.mediaFiles.forEach((file: File) => {
          formDataPayload.append("images", file);
        });
        payload = formDataPayload;
        console.log("Sending FormData payload");
      } else if (
        finalData.existingImages &&
        finalData.existingImages.length !== (place?.media?.length ?? 0)
      ) {
        // Images were removed but no new files — still send JSON so backend can prune
        payload = placeData;
        console.log("Sending JSON payload (images removed)");
      } else {
        console.log("Sending JSON payload (no image changes)");
      }

      console.log("Sending request to updatePlace...", { id: placeId, data: payload });
      await updatePlace({ id: placeId, data: payload }).unwrap();
      console.log("updatePlace request completed successfully!");
      toast.success("Place updated successfully!");
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update place");
      console.error("Failed to update place error detail:", error);
    }
  };

  if (!open) return null;

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={() => onOpenChange(false)}
    >
      {/* Modal Box */}
      <div
        className="relative max-w-7xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-2xl font-black uppercase tracking-tight">
            Update Place
          </h2>
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-sm p-1 opacity-70 hover:opacity-100 transition-opacity focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        {isLoadingPlace ? (
          <div className="p-8 space-y-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : place ? (
          <div className="w-full">
            <PlaceFormContent
              categories={categories}
              isSaving={isUpdating}
              onClose={() => onOpenChange(false)}
              onSave={handleUpdate}
              initialData={{
                name: place.name || "",
                description: place.description || "",
                category:
                  typeof place.category === "object"
                    ? place.category?._id
                    : place.category || "",
                type: place.type || "Regular",
                address: place.address || "",
                accessDescription: place.access || place.details?.access || "",
                tips:
                  place.recommendations?.tips || place.details?.recommendations || "",
                services: place.services || [],
                accessibility: {
                  wheelchair:
                    (place.accessibility?.features || []).includes("wheelchair"),
                  children: (place.accessibility?.features || []).includes("children"),
                  pets: (place.accessibility?.features || []).includes("pets"),
                  senior: (place.accessibility?.features || []).includes("senior"),
                  notes: place.accessibility?.notes || "",
                },
                images: place.media || [],
                isNew: false,
                // New fields pre-populated from existing place data
                schedules: place.schedules || "",
                entryCost: place.entryCost || "",
                hikeTime: place.hikeTime || "",
                atmosphere: place.atmosphere || "",
                difficulty: place.difficulty || "",
              }}
            />
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            Failed to load place details.
          </div>
        )}
      </div>
    </div>
  );
}
