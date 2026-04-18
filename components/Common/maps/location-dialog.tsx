"use client";

import { Button } from "@/components/ui/button";
import { NoImage } from "@/lib/others/others";
import { TPlace } from "@/lib/types/place/place";

import { getImageUrl } from "@/lib/utils";
import {
  useAddToFavouriteMutation,
  useGetFavouritesQuery,
} from "@/redux/features/favourite/favouriteApi";
import { useGetPlaceDetailsQuery } from "@/redux/features/place/placeApi";
import { Heart, Star, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

type Props = {
  id: { id: string };
  onClose: () => void;
};

type PlaceDetailsResponse = {
  data: TPlace;
};

export default function LocationDialog({ id, onClose }: Props) {
  const placeId = id?.id;

  const { data } = useGetPlaceDetailsQuery(placeId);
  const [addToFavourite, { isLoading: isFavouriteLoading }] =
    useAddToFavouriteMutation();

  // Fetch the user's full favourites list — persists across reloads
  const { data: favouritesRes } = useGetFavouritesQuery();
  const favouritesList: any[] = favouritesRes?.data || [];

  if (!data) return null;

  const location: TPlace = (data as PlaceDetailsResponse).data;

  const mapId =
    typeof location.map === "string" ? location.map : location.map?._id;

  // Derive isFavourite from server data — no local state needed
  const isFavourite = favouritesList.some(
    (fav: any) =>
      (typeof fav.map === "string" ? fav.map : fav.map?._id) === mapId,
  );

  const handleFavourite = async () => {
    if (!mapId) return;
    try {
      await addToFavourite({
        type: "Map",
        map: mapId,
      }).unwrap();

      toast.success(
        isFavourite ? "Removed from favourites" : "Added to favourites",
      );
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update favourites");
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-4">
      <div className="bg-white rounded-[32px] overflow-hidden shadow-2xl w-full max-w-md pointer-events-auto relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow-lg"
        >
          <X size={20} />
        </button>

        {/* Image */}
        <div className="h-48 overflow-hidden">
          {location?.media?.length > 0 &&
          typeof location.media[0] === "string" ? (
            <Image
              src={getImageUrl(location.media[0])}
              alt={location.name}
              unoptimized
              width={500}
              height={500}
              className="w-full h-full object-cover"
            />
          ) : (
            <NoImage />
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <h2 className="text-2xl font-black mb-2">{location.name}</h2>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center text-sm font-bold">
              <Star size={14} className="fill-black mr-1" />
              {location.rating}
            </div>

            <span className="text-gray-400 text-sm">
              ({location.totalReview} reviews) {location.map?.name}
            </span>
          </div>

          <p className="text-sm text-gray-600 mb-6">{location.description}</p>

          <div className="flex gap-3">
            <Link href={`/maps/${location.id}`} className="flex-1">
              <Button className="w-full bg-[#FFC107] text-black font-bold rounded-xl h-12">
                View Details
              </Button>
            </Link>

            <Button
              variant="outline"
              className="w-12 h-12 rounded-xl"
              onClick={handleFavourite}
              disabled={isFavouriteLoading}
            >
              <Heart
                size={20}
                className={
                  isFavourite
                    ? "text-red-500 fill-red-500"
                    : isFavouriteLoading
                      ? "animate-pulse"
                      : "text-gray-400"
                }
              />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
