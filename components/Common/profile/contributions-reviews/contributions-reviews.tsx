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
    <div className="min-h-screen bg-gray-50 py-10 ">
      <div className="max-w-360 mx-auto p-6 bg-white rounded-2xl">
        <ContributionsSection />

        <div className="mt-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            My Reviews {isLoading ? "" : `(${reviews.length})`}
          </h2>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
              <p className="text-sm text-gray-500">Loading reviews...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="py-16 text-center text-gray-500 text-sm">
              No reviews yet. Explore places and share your experience!
            </div>
          ) : (
            <>
              <div className="space-y-6">
                {reviews.slice(0, displayedReviews).map((review: any) => (
                  <ReviewCard key={review._id} review={review} />
                ))}
              </div>

              {reviews.length > displayedReviews && (
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
