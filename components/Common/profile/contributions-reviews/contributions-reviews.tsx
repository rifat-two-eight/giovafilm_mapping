"use client";

import Image from "next/image";
import React, { useState } from "react";
import { ReviewCard } from "./review-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGetProfileQuery } from "@/redux/features/user/userApi";
import { getImageUrl } from "@/lib/utils";
import { NoImage } from "@/lib/others/others";

const reviewsData = [
  {
    id: 1,
    title: "Grand Canyon National Park",
    rating: 5,
    reviewDate: "Oct 12, 2023",
    description:
      "An absolutely breathtaking experience! We started the hike at sunrise and the colors were unreal. Highly recommend bringing extra water and starting early to avoid the crowds at the main overlooks. Truly a world wonder that everyone...",
    mapImage:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop",
  },
  {
    id: 2,
    title: "Golden Gate Bridge",
    rating: 4.5,
    reviewDate: "Sep 28, 2023",
    description:
      "Classic landmark! A bit foggy when we went (Karl the Fog was out in full force), but walking across the bridge is an essential SF experience. Don't forget a jacket, even if it's sunny in the city center!",
    mapImage:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop",
  },
  {
    id: 3,
    title: "Playa Delfines",
    rating: 5,
    reviewDate: "Aug 15, 2023",
    description:
      "One of the most beautiful public beaches in Cancun. The water is incredibly blue. It's quite windy and the waves can be strong, so be careful if you aren't a strong swimmer. The 'Cancun' sign is here for great photos!",
    mapImage:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop",
  },
];

export default function ContributionsReviews() {
  const [displayedReviews, setDisplayedReviews] = useState(3);

  const { data: user } = useGetProfileQuery({});
  console.log("user", user);

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
            {reviewsData.slice(0, displayedReviews).map((review) => (
              <ReviewCard
                key={review.id}
                title={review.title}
                rating={review.rating}
                reviewDate={review.reviewDate}
                description={review.description}
                mapImage={review.mapImage}
              />
            ))}
          </div>

          {/* Load more button */}
          <div className="flex justify-center mt-12">
            <Button
              onClick={handleLoadMore}
              variant="outline"
              className="border-2 border-yellow-400 text-gray-900 hover:bg-yellow-50 font-semibold px-8 py-6 rounded-xl text-base"
            >
              Load More Contributions
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
