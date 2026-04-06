"use client";

import { useGetProfileQuery } from "@/redux/features/user/userApi";
import { ContributionsSection } from "./contributions-section";
import { ProfileSidebar } from "./profile-sidebar";
import { ReviewsSection } from "./reviews-section";

import profileData from "@/lib/profile.json";

export default function ProfilePage() {
  const { user, contributions, reviews } = profileData;

  const { data } = useGetProfileQuery({});

  
  return (
    <main className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Left Sidebar - 1/4 width */}
          <div className="lg:col-span-1">
            <ProfileSidebar data={data} />
          </div>

          {/* Right Content - 3/4 width */}
          <div className="lg:col-span-3 space-y-10">
            {/* Contributions Section */}
            <ContributionsSection contributions={contributions} />

            {/* Reviews Section */}
            <ReviewsSection
              reviews={reviews}
              reviewCount={contributions.reviews}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
