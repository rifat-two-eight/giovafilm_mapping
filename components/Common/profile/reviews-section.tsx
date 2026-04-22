"use client";

import { Button } from "@/components/ui/button";
import { NoImage } from "@/lib/others/others";
import { getImageUrl } from "@/lib/utils";
import { MapPin, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ReviewModal } from "../maps/review-modal";

interface Review {
  _id: string;
  placeId: {
    _id: string;
    name: string;
    address?: string;
    media?: string[];
  };
  rating: number;
  createdAt: string;
  review: string;
}

interface ReviewsSectionProps {
  reviews: Review[];
}

export function ReviewsSection({ reviews }: ReviewsSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  const handleEdit = (review: Review) => {
    setSelectedReview(review);
    setIsModalOpen(true);
  };

  console.log("reviews", reviews);
  return (
    <div className="space-y-6">
      {/* Header with View All Link */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          My Reviews ({reviews?.length})
        </h2>
        <Link
          href="/profile/contributions-reviews"
          className="text-green-600 font-semibold text-sm hover:text-green-700 transition-colors"
        >
          View All →
        </Link>
      </div>

      {/* Reviews List */}
      <div className="space-y-5">
        {reviews?.map((review) => (
          <div
            key={review._id}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow flex flex-col md:flex-row"
          >
            {/* Image Section */}
            <div className="relative w-full md:w-56 h-56 shrink-0">
              {review?.placeId?.media?.length ? (
                <Image
                  src={getImageUrl(review?.placeId?.media?.[0])}
                  alt={review.placeId?.name || "Place"}
                  unoptimized
                  width={500}
                  height={500}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full md:w-56 h-56">
                  <NoImage />
                </div>
              )}

              {/* Location Badge */}
              <div className="absolute bottom-3 left-1 bg-white px-2 py-1 rounded-md text-xs font-semibold text-gray-900 shadow-md flex items-center gap-1">
                <MapPin size={14} /> {review.placeId?.name || "Unknown"}
              </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 p-6 flex flex-col justify-between">
              {/* Title and Rating */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-900">
                    {review.placeId?.name}
                  </h3>
                  {/* Star Rating */}
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className={`${
                          i < Math.floor(review.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : i < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Review Date */}
                <p className="text-xs text-gray-500 mb-3">
                  Reviewed on{" "}
                  {review.createdAt
                    ? new Date(review.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      })
                    : "N/A"}
                </p>

                {/* Description */}
                <p className="text-sm text-gray-600 line-clamp-2">
                  {review.review}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-4">
                <Button
                  onClick={() => handleEdit(review)}
                  className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold text-sm rounded-lg px-6"
                >
                  Edit Review
                </Button>
                <Link href={`/maps/${review.placeId?._id}`}>
                  <Button
                    variant="outline"
                    className="text-gray-900 font-semibold text-sm rounded-lg px-6 border-gray-200"
                  >
                    View Details
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        placeId={selectedReview?.placeId?._id}
        initialData={
          selectedReview
            ? {
                _id: selectedReview._id,
                rating: selectedReview.rating,
                review: selectedReview.review,
              }
            : undefined
        }
      />
    </div>
  );
}
