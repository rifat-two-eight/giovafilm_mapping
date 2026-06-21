"use client";

import DealsSection from "@/components/Common/landing-page/deals-section";
import ExploreMaps from "@/components/Common/landing-page/explore-maps";
import { Features } from "@/components/Common/landing-page/features";
import HeroBanner from "@/components/Common/landing-page/hero-banner";
import HowItWorks from "@/components/Common/landing-page/how-it-works";
import MapCollection from "@/components/Common/landing-page/map-collection";
import PersonalizedExperience from "@/components/Common/landing-page/personalized-experience";
import PromoteBusiness from "@/components/Common/landing-page/promote-business";
import StartExploring from "@/components/Common/landing-page/start-exploring";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetProfileQuery } from "@/redux/features/user/userApi";

export default function HomePage() {
  const router = useRouter();
  const { data: userProfile, isLoading } = useGetProfileQuery({});

  useEffect(() => {
    if (!isLoading && userProfile) {
      router.push("/maps");
    }
  }, [userProfile, isLoading, router]);

  // If loading or user is not logged in, show landing page
  return (
    <div>
      <HeroBanner />
      <HowItWorks />
      <Features />
      <ExploreMaps />
      <PromoteBusiness />
      <DealsSection />
      <MapCollection />
      <PersonalizedExperience />
      <StartExploring />
    </div>
  );
}
