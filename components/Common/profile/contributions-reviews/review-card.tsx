"use client";

import { Button } from "@/components/ui/button";
import { NoImage } from "@/lib/others/others";
import { formatDate, getImageUrl } from "@/lib/utils";
import { Star } from "lucide-react";
import Image from "next/image";
import { ReviewModal } from "../../maps/review-modal";
import { useState } from "react";
import Link from "next/link";

export function ReviewCard({ review }: any) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const rating = review?.rating || 0;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  const isBusinessReview = !!review?.businessId;
  const target = isBusinessReview ? review.businessId : review.placeId;
  const targetName = target?.name || "Unknown";
  const coverImage = isBusinessReview
    ? target?.media?.photos?.[0]
    : target?.media?.[0];
  const detailsHref = isBusinessReview
    ? `/maps/${target?._id}?type=business`
    : `/maps/${target?._id}`;

  return (
    <div className="bg-white rounded-xl border border-gray-200 flex flex-col md:flex-row md:gap-6 hover:shadow-sm transition-shadow duration-200 overflow-hidden">
      {coverImage ? (
        <div className="shrink-0">
          <div className="w-full md:w-80 h-56 md:h-full xl:h-56 relative overflow-hidden">
            <Image
              src={getImageUrl(coverImage)}
              alt={targetName}
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

      <div className="flex-1 flex items-start flex-col justify-center font-public-sans p-6 lg:pr-36">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{targetName}</h3>

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
            {review?.status && (
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${
                  review.status === "Approved"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : review.status === "Rejected"
                      ? "bg-red-50 text-red-700 border border-red-200"
                      : "bg-yellow-50 text-yellow-700 border border-yellow-200"
                }`}
              >
                {review.status}
              </span>
            )}
          </div>
        </div>

        <p className="text-gray-700 mb-4">{review?.review}</p>

        <div className="flex gap-3">
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-6 rounded-lg"
          >
            ✎ Edit Review
          </Button>
          <Link href={detailsHref}>
            <Button
              variant="outline"
              className="border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-50 font-semibold px-6 rounded-lg"
            >
              View Details
            </Button>
          </Link>
        </div>
      </div>

      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        placeId={isBusinessReview ? undefined : target?._id}
        businessId={isBusinessReview ? target?._id : undefined}
        initialData={{
          _id: review?._id,
          rating: review?.rating,
          review: review?.review,
        }}
      />
    </div>
  );
}
