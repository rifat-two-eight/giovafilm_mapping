"use client";

import { useGetMyReviewsQuery } from "@/redux/features/review/reviewApi";
import { useGetProfileQuery } from "@/redux/features/user/userApi";
import { ProfileSidebar } from "./profile-sidebar";
import { ReviewsSection } from "./reviews-section";

export default function ProfilePage() {
  const { data, isLoading: isProfileLoading } = useGetProfileQuery({});
  const { data: reviewsData = [], isLoading: isReviewsLoading } =
    useGetMyReviewsQuery({});

  return (
    <main className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1">
            {isProfileLoading ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 flex flex-col items-center gap-4">
                <div className="h-24 w-24 rounded-full bg-gray-200 animate-pulse" />
                <div className="h-5 w-32 bg-gray-200 animate-pulse rounded" />
                <div className="h-4 w-24 bg-gray-100 animate-pulse rounded" />
              </div>
            ) : (
              <ProfileSidebar data={data} />
            )}
          </div>

          <div className="lg:col-span-3 space-y-10">
            {isReviewsLoading ? (
              <div className="flex flex-col items-center justify-center gap-3 py-20 bg-white rounded-2xl border border-gray-200">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
                <p className="text-sm text-gray-500">Loading reviews...</p>
              </div>
            ) : (
              <ReviewsSection reviews={reviewsData?.data || []} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
