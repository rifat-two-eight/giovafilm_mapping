"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import Link from "next/link";

interface Review {
  id: number;
  title: string;
  location: string;
  rating: number;
  reviewDate: string;
  description: string;
  image: string;
}

interface ReviewsSectionProps {
  reviews: Review[];
  reviewCount: number;
}

export function ReviewsSection({ reviews, reviewCount }: ReviewsSectionProps) {
  return (
    <div className="space-y-6">
      {/* Header with View All Link */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          My Reviews ({reviewCount})
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
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow flex flex-col md:flex-row"
          >
            {/* Image Section */}
            <div className="relative w-full md:w-56  h-64 md:h-auto shrink-0">
              <Image
                src={review.image}
                alt={review.title}
                fill
                className="object-cover"
              />
              {/* Location Badge */}
              <div className="absolute bottom-3 left-1 bg-white px-2 py-1 rounded-md text-xs font-semibold text-gray-900 shadow-md">
                📍 {review.location}
              </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 p-6 flex flex-col justify-between">
              {/* Title and Rating */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-900">
                    {review.title}
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
                  Reviewed on {review.reviewDate}
                </p>

                {/* Description */}
                <p className="text-sm text-gray-600 line-clamp-2">
                  {review.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-4">
                <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold text-sm rounded-lg px-6">
                  Edit Review
                </Button>
                <Button
                  variant="outline"
                  className="text-gray-900 font-semibold text-sm rounded-lg px-6 border-gray-200"
                >
                  View Details
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
