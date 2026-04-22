"use client";

import Image from "next/image";
import React, { useState } from "react";
import { ReviewCard } from "./review-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGetProfileQuery } from "@/redux/features/user/userApi";
import { useGetMyReviewsQuery } from "@/redux/features/review/reviewApi";
import { getImageUrl } from "@/lib/utils";
import { NoImage } from "@/lib/others/others";

export default function ContributionsReviews() {
  const [displayedReviews, setDisplayedReviews] = useState(3);

  const { data: user } = useGetProfileQuery({});
  const { data: reviewsData = [], isLoading } = useGetMyReviewsQuery({});
  console.log(user);

  // ✅ NEW: Progress logic (no UI style change, just text)
  const currentPoints = 1250;
  const nextLevelPoints = 2000;

  const handleLoadMore = () => {
    setDisplayedReviews((prev) => prev + 3);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 ">
      {/* Main container */}
      <div className="max-w-360 mx-auto p-6 bg-white rounded-2xl">
        {/* Profile header */}
        <div className="flex flex-col items-center py-12 bg-white rounded-2xl mb-8">
          {/* Profile image with border */}
          <div className="w-32 h-32 mb-6 relative">
            {user?.profile ? (
              <Image
                src={getImageUrl(user?.profile)}
                alt="John Doe"
                unoptimized
                width={500}
                height={500}
                className="w-full h-full rounded-full object-cover border-4 border-gray-200"
              />
            ) : (
              <NoImage />
            )}
          </div>

          {/* User name */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">John Doe</h1>

          {/* Badge and join date */}
          <div className="flex items-center gap-3 text-sm">
            <span className="bg-yellow-100 text-yellow-700 font-semibold px-4 py-1 rounded-full">
              Level {user?.level || 0} EXPLORER
            </span>
            •
            <span className="bg-yellow-100 text-yellow-700 font-semibold px-4 py-1 rounded-full">
              {user?.points.toLocaleString() || 0} POINTS
            </span>
            <span className="text-gray-600">• Joined Oct 2023</span>
          </div>

          {/* ✅ NEW: Progress info (no style change) */}
          <p className="text-gray-500 text-sm mt-2">
            {currentPoints.toLocaleString()} /{" "}
            {nextLevelPoints.toLocaleString()} points to next level
          </p>
        </div>

        {/* Reviews section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            My Reviews ({reviewsData.length})
          </h2>

          {/* Reviews list */}
          <div className="space-y-6">
            {reviewsData?.data?.map((review: any) => (
              <ReviewCard key={review._id} review={review} />
            ))}
          </div>

          {/* Load more button */}
          {reviewsData.length > displayedReviews && (
            <div className="flex justify-center mt-12">
              <Button
                onClick={handleLoadMore}
                variant="outline"
                className="border-2 border-yellow-400 text-gray-900 hover:bg-yellow-50 font-semibold px-8 py-6 rounded-xl text-base"
              >
                Load More Contributions
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
