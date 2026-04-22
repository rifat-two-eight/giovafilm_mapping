"use client";

import { Button } from "@/components/ui/button";
import { NoImage } from "@/lib/others/others";
import { formatDate, getImageUrl } from "@/lib/utils";
import { Star } from "lucide-react";
import Image from "next/image";

export function ReviewCard({ review }: any) {
  console.log("review data", review);
  // ✅ Rating logic
  const rating = review?.rating || 0;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 flex flex-col md:flex-row md:gap-6 hover:shadow-sm transition-shadow duration-200 overflow-hidden">
      {/* Map image container */}
      {review?.placeId?.media?.length > 0 ? (
        <div className="shrink-0">
          <div className="w-full md:w-80 h-56 md:h-full xl:h-56 relative overflow-hidden">
            <Image
              src={getImageUrl(review?.placeId?.media[0])}
              alt={review?.placeId?.name}
              width={100}
              height={100}
              unoptimized
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      ) : (
        <div className="w-full md:w-80 h-56 md:h-full xl:h-56 overflow-hidden">
          <NoImage />
        </div>
      )}

      {/* Review content */}
      <div className="flex-1 flex items-start flex-col justify-center font-public-sans p-6 lg:pr-36">
        {/* Title and rating */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {review?.placeId?.name}
          </h3>

          {/* Star rating */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i}>
                  {i < fullStars ? (
                    <Star
                      size={20}
                      className="fill-yellow-400 text-yellow-400"
                    />
                  ) : i === fullStars && hasHalfStar ? (
                    <div className="relative w-5 h-5">
                      <Star size={20} className="fill-gray-300 text-gray-300" />
                      <div className="absolute top-0 left-0 overflow-hidden w-2.5">
                        <Star
                          size={20}
                          className="fill-yellow-400 text-yellow-400"
                        />
                      </div>
                    </div>
                  ) : (
                    <Star size={20} className="fill-gray-300 text-gray-300" />
                  )}
                </div>
              ))}
            </div>
            <span className="text-sm text-gray-500">
              Reviewed on {formatDate(review?.createdAt)}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-700 mb-4">{review?.review}</p>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-6 rounded-lg">
            ✎ Edit Review
          </Button>
          <Button
            variant="outline"
            className="border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-50 font-semibold px-6 rounded-lg"
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
}
