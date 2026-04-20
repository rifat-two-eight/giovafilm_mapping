"use client";

import { Button } from "@/components/ui/button";
import {
  useAddToFavouriteMutation,
  useGetFavouritesQuery,
} from "@/redux/features/favourite/favouriteApi";
import { Heart } from "lucide-react";
import { toast } from "sonner";

type Props = {
  placeId: string;
  type: "Map" | "Place" | "Offer";
  Style?: string;
};

export function FavouriteButton({ placeId, type, Style }: Props) {
  const [addToFavourite, { isLoading }] = useAddToFavouriteMutation();

  // ✅ Get the full favourites list from the server (cached and shared by RTK Query)
  const { data: favouritesData } = useGetFavouritesQuery();
  const favouritesList: any[] = favouritesData?.data || [];

  // ✅ Derive isFavourite purely from server data — no useState, no useEffect
  //    This automatically stays correct on every reload and after any mutation
  const key = type === "Map" ? "map" : type === "Place" ? "place" : "offer";
  const isFavourite = favouritesList.some((fav: any) => {
    if (fav.type !== type) return false;
    const id = typeof fav[key] === "string" ? fav[key] : fav[key]?._id;
    return id === placeId;
  });

  const handleFavourite = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    try {
      // POST /favourite acts as a toggle on the backend
      const payload =
        type === "Map"
          ? { type, map: placeId }
          : type === "Place"
            ? { type, place: placeId }
            : { type, offer: placeId };

      await addToFavourite(payload).unwrap();

      // invalidatesTags: ["Favourite"] auto-refetches useGetFavouritesQuery
      // → isFavourite recomputes → heart icon updates without any local state
      toast.success(
        isFavourite ? "Removed from favourites" : "Added to favourites",
      );
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update favourites");
    }
  };

  return (
    <Button
      variant="outline"
      className={Style || ""}
      onClick={handleFavourite}
      disabled={isLoading}
    >
      <Heart
        size={20}
        className={
          isFavourite
            ? "text-red-500 fill-red-500"
            : isLoading
              ? "animate-pulse text-gray-300"
              : "text-gray-400"
        }
      />
    </Button>
  );
}
