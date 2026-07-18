"use client";

import { Button } from "@/components/ui/button";
import {
  useAddToFavouriteMutation,
  useGetFavouritesQuery,
} from "@/redux/features/favourite/favouriteApi";
import { TFavouriteItem, TAddFavouritePayload } from "@/lib/types/favourite";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hook";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/utils";

type Props = {
  placeId: string;
  type: "Map" | "Place" | "Offer";
  Style?: string;
};

export function FavouriteButton({ placeId, type, Style }: Props) {
  const [addToFavourite, { isLoading }] = useAddToFavouriteMutation();

  const { data: favouritesData } = useGetFavouritesQuery();
  const favouritesList: TFavouriteItem[] = favouritesData?.data || [];

  const key = type === "Map" ? "map" : type === "Place" ? "place" : "offer";
  const isFavourite = favouritesList.some((fav: TFavouriteItem) => {
    if (fav.type !== type) return false;
    const id = typeof fav[key] === "string" ? fav[key] : (fav[key] as { _id: string })?._id;
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
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    try {
      // POST /favourite acts as a toggle on the backend
      const payload: TAddFavouritePayload =
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
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error));
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

