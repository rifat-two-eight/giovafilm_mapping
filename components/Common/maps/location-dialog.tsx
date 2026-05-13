"use client";

import { FavouriteButton } from "@/components/shared/favourite-button";
import { Button } from "@/components/ui/button";
import { NoImage } from "@/lib/others/others";
import { TPlace } from "@/lib/types/place/place";

import { getImageUrl } from "@/lib/utils";
import { useGetSingleBusinessQuery } from "@/redux/features/business/businessApi";
import { useGetPlaceDetailsQuery } from "@/redux/features/place/placeApi";
import { Star, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Props = {
  id: { id: string; type: string };
  onClose: () => void;
};

export default function LocationDialog({ id, onClose }: Props) {
  const placeId = id?.id;
  const type = id?.type;

  // Fetch based on type
  const { data: businessRes, isLoading: isBusinessLoading } =
    useGetSingleBusinessQuery(placeId, {
      skip: type !== "business",
    });

  const { data: placeRes, isLoading: isPlaceLoading } = useGetPlaceDetailsQuery(
    placeId,
    {
      skip: type !== "place",
    },
  );

  const isLoading = isBusinessLoading || isPlaceLoading;
  const location: TPlace =
    type === "business" ? businessRes?.data : placeRes?.data;

  if (isLoading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-4">
        <div className="bg-white rounded-[32px] p-10 shadow-2xl flex items-center justify-center pointer-events-auto">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

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
              src={getImageUrl(location?.media[0])}
              alt={location?.name}
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
          <h2 className="text-2xl font-black mb-2">{location?.name}</h2>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center text-sm font-bold">
              <Star size={14} className="fill-black mr-1" />
              {location?.rating}
            </div>

            <span className="text-gray-400 text-sm">
              ({location?.totalReview} reviews) {location?.map?.name}
            </span>
          </div>

          <p className="text-sm text-gray-600 mb-6">{location?.description}</p>

          <div className="flex gap-3">
            <Link href={`/maps/${location?.id}`} className="flex-1">
              <Button className="w-full bg-[#FFC107] text-black font-bold rounded-xl h-12">
                View Details
              </Button>
            </Link>

            {/* <Button variant="outline" className="">
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
            </Button> */}
            <FavouriteButton
              placeId={location?.id}
              type="Place"
              Style="w-12 h-12 rounded-xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
