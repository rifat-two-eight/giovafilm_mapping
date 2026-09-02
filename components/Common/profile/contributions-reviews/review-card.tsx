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
    <div className="bg-white rounded-xl border border-gray-200 flex flex-col md:flex-row gap-3 md:gap-6 hover:shadow-md transition-all duration-200 overflow-hidden">
      {coverImage ? (
        <div className="shrink-0 w-full md:w-64 lg:w-72 h-40 sm:h-52 md:h-auto relative overflow-hidden bg-gray-100">
          <Image
            src={getImageUrl(coverImage)}
            alt={targetName}
            width={300}
            height={200}
            unoptimized
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="shrink-0 w-full md:w-64 lg:w-72 h-40 sm:h-52 md:h-auto overflow-hidden">
          <NoImage />
        </div>
      )}

      <div className="flex-1 flex flex-col justify-between font-public-sans p-3.5 sm:p-5">
        <div>
          <div className="flex flex-wrap items-start justify-between gap-2 mb-1.5">
            <h3 className="text-base sm:text-xl font-bold text-gray-900 leading-snug">{targetName}</h3>
            {review?.status && (
              <span
                className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full capitalize shrink-0 ${
                  review.status === "Approved"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : review.status === "Rejected"
                      ? "bg-red-50 text-red-700 border border-red-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                }`}
              >
                {review.status}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-2.5">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <div key={i}>
                  {i < fullStars ? (
                    <Star
                      size={16}
                      className="fill-amber-400 text-amber-400"
                    />
                  ) : i === fullStars && hasHalfStar ? (
                    <div className="relative w-4 h-4">
                      <Star size={16} className="fill-gray-300 text-gray-300" />
                      <div className="absolute top-0 left-0 overflow-hidden w-2">
                        <Star
                          size={16}
                          className="fill-amber-400 text-amber-400"
                        />
                      </div>
                    </div>
                  ) : (
                    <Star size={16} className="fill-gray-300 text-gray-300" />
                  )}
                </div>
              ))}
            </div>
            <span className="text-[11px] sm:text-xs text-gray-500">
              Reviewed on {formatDate(review?.createdAt)}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-3 line-clamp-3 sm:line-clamp-4">
            {review?.review}
          </p>
        </div>

        <div className="flex gap-2 pt-2 border-t border-gray-100 sm:border-none sm:pt-0">
          <Button
            onClick={() => setIsModalOpen(true)}
            className="flex-1 sm:flex-none bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold text-xs sm:text-sm py-2 sm:py-2.5 px-3 sm:px-5 rounded-lg"
          >
            ✎ Edit Review
          </Button>
          <Link href={detailsHref} className="flex-1 sm:flex-none">
            <Button
              variant="outline"
              className="w-full border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100 font-bold text-xs sm:text-sm py-2 sm:py-2.5 px-3 sm:px-5 rounded-lg"
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
