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
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetProfileQuery } from "@/redux/features/user/userApi";
import { useVerifyCheckoutSessionQuery } from "@/redux/features/payment/paymentApi";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useAppSelector } from "@/redux/hook";
import { selectAccessToken } from "@/redux/features/auth/authSlice";

export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const accessToken = useAppSelector(selectAccessToken);
  const currentUser = useAppSelector((state) => state.auth.user);
  const [hasMounted, setHasMounted] = useState(false);

  // Synchronously detect auth from cookies or persisted storage on client render 1
  const [hasAuthClient, setHasAuthClient] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      if (document.cookie.includes("loggedIn=1") || document.cookie.includes("accessToken=")) {
        return true;
      }
      const persisted = localStorage.getItem("persist:auth");
      if (persisted) {
        const parsed = JSON.parse(persisted);
        if (parsed.accessToken && parsed.accessToken !== "null") return true;
        if (parsed.user && parsed.user !== "null") return true;
      }
    } catch { }
    return false;
  });

  useEffect(() => {
    setHasMounted(true);
    if (typeof document !== "undefined") {
      const hasCookie =
        document.cookie.includes("loggedIn=1") ||
        document.cookie.includes("accessToken=");
      if (hasCookie) setHasAuthClient(true);
    }
  }, []);

  const isAuthed = Boolean(accessToken || currentUser || hasAuthClient);

  // Skip profile query for unauthenticated guests to avoid wasteful 401 calls
  const { data: userProfile } = useGetProfileQuery({}, { skip: !isAuthed });

  // Trigger verify checkout query if session_id query exists
  const { data: verifyData, error: verifyError, isLoading: isVerifying } = useVerifyCheckoutSessionQuery(
    sessionId || "",
    { skip: !sessionId }
  );

  useEffect(() => {
    if (verifyData) {
      toast.success("Payment verified successfully! Redirecting to your purchased maps...");
      router.replace("/profile/purchased-maps");
    } else if (verifyError) {
      toast.error("Payment verification failed.");
      router.replace("/maps");
    }
  }, [verifyData, verifyError, router]);

  useEffect(() => {
    // Only auto-redirect to /maps if we are NOT currently verifying a Stripe checkout session
    if (sessionId) return;
    if (searchParams.get("loginRequired") === "1") return;
    if (isAuthed || userProfile) {
      router.replace("/maps");
    }
  }, [isAuthed, userProfile, router, sessionId, searchParams]);

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

  // If the user is logged in or client hydration has not resolved yet, DO NOT flash the landing page!
  // Show a neutral loading spinner while redirecting to /maps.
  if ((!hasMounted || isAuthed || userProfile) && !sessionId) {
    return (
      <div className="flex h-[calc(100vh-90px)] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-yellow-400 border-t-transparent" />
      </div>
    );
  }

  // If user is not logged in, show landing page
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
