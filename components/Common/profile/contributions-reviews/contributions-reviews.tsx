"use client";

import { Button } from "@/components/ui/button";
import { useGetMyReviewsQuery } from "@/redux/features/review/reviewApi";
import { useState } from "react";
import { ContributionsSection } from "../contributions-section";
import { ReviewCard } from "./review-card";

export default function ContributionsReviews() {
  const [displayedReviews, setDisplayedReviews] = useState(3);

  const { data: reviewsData = [], isLoading } = useGetMyReviewsQuery({});
  const reviews = reviewsData?.data || [];

  const handleLoadMore = () => {
    setDisplayedReviews((prev) => prev + 3);
  };

  return (
    <div className="min-h-screen bg-gray-50/60 py-3 sm:py-8">
      <div className="max-w-360 mx-auto p-3 sm:p-6 md:p-8 bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-xs">
        <ContributionsSection />

        <div className="mt-4 sm:mt-8">
          <div className="flex items-center justify-between border-b pb-3 mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-900 uppercase tracking-wide">
              My Reviews {isLoading ? "" : `(${reviews.length})`}
            </h2>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-12 sm:py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
              <p className="text-xs sm:text-sm text-gray-500 font-medium">Loading reviews...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="py-12 sm:py-16 text-center text-gray-500 text-xs sm:text-sm bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
              No reviews yet. Explore places and share your experience to earn points!
            </div>
          ) : (
            <>
              <div className="space-y-3 sm:space-y-5">
                {reviews.slice(0, displayedReviews).map((review: any) => (
                  <ReviewCard key={review._id} review={review} />
                ))}
              </div>

              {reviews.length > displayedReviews && (
                <div className="flex justify-center mt-6 sm:mt-10">
                  <Button
                    onClick={handleLoadMore}
                    variant="outline"
                    className="w-full sm:w-auto border-2 border-amber-400 text-gray-900 hover:bg-amber-50 font-bold px-6 py-3.5 sm:py-5 rounded-xl text-xs sm:text-sm uppercase tracking-wider"
                  >
                    Load More Contributions
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
