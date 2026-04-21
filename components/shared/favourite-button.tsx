"use client";

import { Button } from "@/components/ui/button";
import {
  useAddToFavouriteMutation,
  useGetFavouritesQuery,
} from "@/redux/features/favourite/favouriteApi";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hook";
import { toast } from "sonner";

type Props = {
  placeId: string;
  type: "Map" | "Place" | "Offer";
  Style?: string;
};

export function FavouriteButton({ placeId, type, Style }: Props) {
  const [addToFavourite, { isLoading }] = useAddToFavouriteMutation();

  const { data: favouritesData } = useGetFavouritesQuery();
  const favouritesList: any[] = favouritesData?.data || [];

  const key = type === "Map" ? "map" : type === "Place" ? "place" : "offer";
  const isFavourite = favouritesList.some((fav: any) => {
    if (fav.type !== type) return false;
    const id = typeof fav[key] === "string" ? fav[key] : fav[key]?._id;
    return id === placeId;
  });

  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const router = useRouter();

  const handleFavourite = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!accessToken) {
      toast.error("Login Required", {
        description: "You must be logged in to add items to favorites.",
      });
      router.push("/login");
      return;
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
