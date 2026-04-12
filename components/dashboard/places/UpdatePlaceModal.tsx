"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetCategoriesQuery } from "@/redux/features/category/categoryApi";
import {
  useGetPlaceDetailsQuery,
  useGetPlacesQuery,
  useUpdatePlaceMutation,
} from "@/redux/features/place/placeApi";
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

  console.log("placeId", placeId);

  const { data: categoriesRes } = useGetCategoriesQuery({ limit: 100 });
  const { data: mapsRes } = useGetPlacesQuery({ limit: 1 });
  const [updatePlace, { isLoading: isUpdating }] = useUpdatePlaceMutation();

  console.log("mapsRes", mapsRes);

  const place = placeRes?.data;
  const categories = categoriesRes?.data || [];
  const defaultMapId = mapsRes?.data?.[0]?._id || "";

  const handleUpdate = async (finalData: any) => {
    if (!placeId) return;

    try {
      const placeData = {
        name: finalData.name,
        map: finalData.map || place.map?._id || place.map || defaultMapId, // Include map ID with fallback
        category: finalData.category,
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

      await updatePlace({ id: placeId, data: payload }).unwrap();
      toast.success("Place updated successfully!");
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update place");
      console.error("Failed to update place:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 overflow-hidden border-none shadow-2xl rounded-2xl bg-white">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-black uppercase tracking-tight">
            Update Place
          </DialogTitle>
        </DialogHeader>

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
                address: place.address || "",
                accessDescription: place.details?.access || "",
                recommendations:
                  place.details?.recommendations || place.recommendations || "",
                services: place.services || [],
                accessibility: {
                  wheelchair:
                    place.accessibility?.features?.includes("wheelchair"),
                  children: place.accessibility?.features?.includes("children"),
                  pets: place.accessibility?.features?.includes("pets"),
                  senior: place.accessibility?.features?.includes("senior"),
                  notes: place.accessibility?.notes || "",
                },
                isNew: false,
              }}
            />
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            Failed to load place details.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
