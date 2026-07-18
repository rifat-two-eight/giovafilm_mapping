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
import { useRouter, useSearchParams } from "next/navigation";
import { useGetProfileQuery } from "@/redux/features/user/userApi";
import { useVerifyCheckoutSessionQuery } from "@/redux/features/payment/paymentApi";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const success = searchParams.get("success");

  const { data: userProfile, isLoading } = useGetProfileQuery({});

  // Trigger verify checkout query if session_id query exists
  const { data: verifyData, error: verifyError, isLoading: isVerifying } = useVerifyCheckoutSessionQuery(
    sessionId || "",
    { skip: !sessionId }
  );

  useEffect(() => {
    if (verifyData) {
      toast.success("Payment verified successfully! Redirecting to your purchased maps...");
      router.push("/profile/purchased-maps");
    } else if (verifyError) {
      toast.error("Payment verification failed.");
      router.push("/maps");
    }
  }, [verifyData, verifyError, router]);

  useEffect(() => {
    // Only auto-redirect to /maps if we are NOT currently verifying a Stripe checkout session!
    if (!sessionId && !isLoading && userProfile) {
      router.push("/maps");
    }
  }, [userProfile, isLoading, router, sessionId]);

  // Loading state for checkout verification
  if (sessionId && isVerifying) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#0f0f0f] text-white">
        <Loader2 className="h-12 w-12 animate-spin text-yellow-400 mb-4" />
        <h2 className="text-xl font-bold font-inter">Verifying your purchase...</h2>
        <p className="text-gray-400 mt-2 text-sm">Please do not close or refresh this page.</p>
      </div>
    );
  }

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
