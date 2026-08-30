"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hook";
import { selectAccessToken } from "@/redux/features/auth/authSlice";
import { useGetProfileQuery } from "@/redux/features/user/userApi";
import {
  useVerifyPromoCodeQuery,
  useClaimFreePromoMutation,
  useCreatePromoCheckoutSessionMutation,
} from "@/redux/features/promo/promoApi";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Ticket,
  AlertCircle,
  Loader2,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
  ArrowRight,
  ShieldCheck,
  Star,
  Sparkles,
  MapPin,
  WifiOff,
  Navigation,
  RefreshCw,
  MailCheck,
} from "lucide-react";

function ClaimPromoContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = searchParams.get("code") || "";
  const success = searchParams.get("success") === "true";
  const cancelled = searchParams.get("cancelled") === "true";

  const accessToken = useAppSelector(selectAccessToken);
  const [isProcessing, setIsProcessing] = useState(false);

  // RTK Query calls
  const { data: userProfile } = useGetProfileQuery({}, { skip: !accessToken });
  const {
    data: verifyRes,
    isLoading: isLoadingVerify,
    isError: isErrorVerify,
    error: verifyError,
    refetch: refetchVerification,
  } = useVerifyPromoCodeQuery(
    { code },
    { skip: !code || success }
  );

  const [claimFreePromo] = useClaimFreePromoMutation();
  const [createPromoCheckoutSession] = useCreatePromoCheckoutSessionMutation();

  const promoData = verifyRes?.data;
  const isFree = promoData ? promoData.price === 0 : false;
  const mapName = promoData?.mapName || "Selected Map";
  const promoType = promoData?.promoType || (isFree ? "influencer" : "upgrade");

  // Validate if logged-in user already owns this map
  const purchasedMaps = userProfile?.purchasedMaps || [];
  const alreadyOwnsMap =
    promoData?.mapId &&
    purchasedMaps.some((m: any) => {
      const mId = typeof m === "object" ? m._id : m;
      return mId === promoData.mapId;
    });

  // Verify if email matches target email warning
  const emailMismatch =
    accessToken &&
    promoData?.recipientEmail &&
    userProfile?.email &&
    userProfile.email.toLowerCase() !== promoData.recipientEmail.toLowerCase();

  // Auto claim or verify after logging in
  useEffect(() => {
    if (accessToken && code && !success) {
      refetchVerification();
    }
  }, [accessToken, code, success, refetchVerification]);

  // Handle Free Claiming
  const handleFreeClaim = async () => {
    if (!accessToken) {
      router.push(`/login?redirect=/claim-promo?code=${code}`);
      return;
    }

    setIsProcessing(true);
    try {
      const res = await claimFreePromo({ code }).unwrap();
      toast.success(res?.message || "Invitation claimed successfully!");
      setTimeout(() => {
        router.push("/catalog");
      }, 2000);
    } catch (error: any) {
      toast.error(
        error?.data?.message || error?.message || "Failed to redeem pass"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Paid Upgrade Stripe Checkout redirection
  const handlePaidCheckout = async () => {
    if (!accessToken) {
      router.push(`/login?redirect=/claim-promo?code=${code}`);
      return;
    }

    setIsProcessing(true);
    try {
      const result = await createPromoCheckoutSession({ code }).unwrap();
      if (result?.data?.url) {
        toast.loading("Redirecting to payment gateway...");
        window.location.href = result.data.url;
      } else {
        throw new Error("Stripe checkout session creation failed");
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          error?.message ||
          "Failed to process upgrade"
      );
      setIsProcessing(false);
    }
  };

  const handleGoToCatalog = () => {
    router.push("/catalog");
  };

  // Render Loader
  if (isLoadingVerify && !success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-gray-500 font-semibold text-sm">Verifying invitation credentials...</p>
      </div>
    );
  }

  // Case A: Stripe Checkout SUCCESS Redirect
  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-gray-100 shadow-xl p-8 text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-gray-900">Upgrade Successful!</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Payment verified. The map access has been successfully added to your account.
            </p>
          </div>
          <div className="bg-green-50/50 p-4 rounded-2xl border border-green-100 text-xs font-bold text-green-800">
            Status: Lifetime Access Granted ✅
          </div>
          <Button
            onClick={handleGoToCatalog}
            className="w-full h-11 bg-primary hover:bg-primary/95 text-black font-extrabold rounded-xl transition-all shadow-md"
          >
            Open Maps Dashboard <ArrowRight size={16} className="ml-1" />
          </Button>
        </div>
      </div>
    );
  }

  // Case B: Stripe Checkout CANCELLED Redirect
  if (cancelled) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-gray-100 shadow-xl p-8 text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-gray-900">Upgrade Paused</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Checkout was cancelled. No charges were made to your account. You can complete the upgrade whenever you are ready.
            </p>
          </div>
          <div className="flex flex-col gap-2 pt-2">
            <Button
              onClick={handlePaidCheckout}
              className="w-full h-11 bg-primary hover:bg-primary/95 text-black font-extrabold rounded-xl"
            >
              Retry Checkout
            </Button>
            <Button
              onClick={handleGoToCatalog}
              variant="outline"
              className="w-full h-11 border-gray-200 text-gray-600 font-bold rounded-xl"
            >
              Return to Directory
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Case C: Invalid Code / Error State
  if (isErrorVerify || !code) {
    const errorMsg =
      (verifyError as any)?.data?.message ||
      "Invalid promo link or invitation code.";
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-gray-100 shadow-xl p-8 text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-gray-900">Invitation Expired</h2>
            <p className="text-sm text-red-500 font-bold leading-relaxed">{errorMsg}</p>
          </div>
          <Button
            onClick={handleGoToCatalog}
            variant="outline"
            className="w-full h-11 border-gray-200 text-gray-600 font-bold rounded-xl"
          >
            View Public Maps
          </Button>
        </div>
      </div>
    );
  }

  const isVipTheme = promoType === "influencer";

  // Case D: Render User Claim Split Screen Panel
  return (
    <div
      className={`min-h-screen flex items-center justify-center p-6 md:p-12 transition-all ${
        isVipTheme
          ? "bg-[#090D1A] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0B0F19] to-black text-white"
          : "bg-gradient-to-tr from-gray-50 via-slate-100 to-gray-50 text-gray-900"
      }`}
    >
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Left Column: Platform features details */}
        <div className="lg:col-span-7 space-y-8 pr-0 lg:pr-4">
          <div className="space-y-3">
            <span
              className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                isVipTheme ? "bg-amber-400/10 text-yellow-400" : "bg-primary/20 text-gray-800"
              }`}
            >
              {isVipTheme ? "✨ Premium VIP Access" : "🗺️ Platform Upgrade"}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Unlock the Ultimate <br />
              <span className={isVipTheme ? "text-yellow-400" : "text-primary-dark"}>
                Interactive Road Trip Map
              </span>
            </h1>
            <p className={`text-sm sm:text-base leading-relaxed ${isVipTheme ? "text-slate-400" : "text-gray-500"}`}>
              Welcome to Roadtripeado! Get ready to explore curated routes, offline navigation pins, and expert local guidelines.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
            <div className="flex gap-4">
              <div
                className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center ${
                  isVipTheme ? "bg-slate-800 text-yellow-400" : "bg-white text-primary shadow-sm"
                }`}
              >
                <MapPin size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm">Curated Places & Spots</h4>
                <p className={`text-xs mt-0.5 ${isVipTheme ? "text-slate-400" : "text-gray-500"}`}>
                  Handpicked points of interest including photo locations, sights, and dining.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div
                className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center ${
                  isVipTheme ? "bg-slate-800 text-yellow-400" : "bg-white text-primary shadow-sm"
                }`}
              >
                <WifiOff size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm">Offline Access Navigation</h4>
                <p className={`text-xs mt-0.5 ${isVipTheme ? "text-slate-400" : "text-gray-500"}`}>
                  Save all custom pins directly to Google Maps to access offline without signal.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div
                className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center ${
                  isVipTheme ? "bg-slate-800 text-yellow-400" : "bg-white text-primary shadow-sm"
                }`}
              >
                <Navigation size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm">Curated Road Routes</h4>
                <p className={`text-xs mt-0.5 ${isVipTheme ? "text-slate-400" : "text-gray-500"}`}>
                  Optimized road routes mapping the best path for your road trip experience.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div
                className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center ${
                  isVipTheme ? "bg-slate-800 text-yellow-400" : "bg-white text-primary shadow-sm"
                }`}
              >
                <RefreshCw size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm">Regular Auto Updates</h4>
                <p className={`text-xs mt-0.5 ${isVipTheme ? "text-slate-400" : "text-gray-500"}`}>
                  Updates and new recommendations automatically sync to your dashboard instantly.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pre-existing Invitation card with double checks validations */}
        <div className="lg:col-span-5 flex justify-center w-full">
          <div
            className={`w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden transition-all duration-300 ${
              isVipTheme
                ? "bg-[#0E1527] border-slate-800 text-white"
                : "bg-white border-gray-100 text-gray-900"
            }`}
          >
            {/* Card Header Banner */}
            <div
              className={`py-6 px-8 flex items-center gap-4 border-b ${
                isVipTheme
                  ? "bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-black border-slate-800"
                  : "bg-primary/10 text-gray-900 border-gray-100"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md ${
                  isVipTheme ? "bg-black text-yellow-400" : "bg-primary text-black"
                }`}
              >
                {isVipTheme ? <Star className="fill-yellow-400" size={24} /> : <Ticket size={24} />}
              </div>
              <div>
                <span
                  className={`text-[9px] uppercase tracking-widest font-black ${
                    isVipTheme ? "text-black" : "text-gray-500"
                  }`}
                >
                  {isVipTheme ? "VIP GUEST INVITATION" : "EXCLUSIVE MAP OFFER"}
                </span>
                <h2 className="text-lg font-black leading-tight">
                  {isVipTheme ? "Exclusive Guest Pass" : "Upgrade Map Pass"}
                </h2>
              </div>
            </div>

            <div className="p-8 space-y-6">
              {/* Map Target Details */}
              <div
                className={`p-5 rounded-2xl border space-y-1.5 ${
                  isVipTheme ? "bg-slate-900/60 border-slate-800" : "bg-gray-50 border-gray-100"
                }`}
              >
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Target Map</span>
                <h3 className="text-xl font-extrabold flex items-center gap-1.5 leading-tight">
                  {mapName} {isVipTheme && <Sparkles size={16} className="text-yellow-400" />}
                </h3>
                <p className={`text-xs leading-relaxed ${isVipTheme ? "text-slate-400" : "text-gray-500"}`}>
                  Unlocks full geographic locations, guides, pins, and reviews.
                </p>
              </div>

              {/* Price Row */}
              <div
                className={`flex items-center justify-between py-3 border-y border-dashed ${
                  isVipTheme ? "border-slate-800" : "border-gray-200"
                }`}
              >
                <span className="text-xs font-semibold text-gray-400">Upgrade Cost:</span>
                {isFree ? (
                  <span className={`text-lg font-black uppercase ${isVipTheme ? "text-yellow-400" : "text-green-600"}`}>
                    100% Free VIP Pass
                  </span>
                ) : (
                  <span className="text-lg font-black">${promoData?.price?.toFixed(2)} USD</span>
                )}
              </div>

              {/* Validation Warnings / notices */}
              
              {/* Warning A: User already owns the map */}
              {alreadyOwnsMap && (
                <div
                  className={`p-4 rounded-2xl border flex gap-3 ${
                    isVipTheme ? "bg-emerald-950/20 border-emerald-900/50" : "bg-emerald-50 border-emerald-100"
                  }`}
                >
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className={`text-xs font-bold ${isVipTheme ? "text-emerald-400" : "text-emerald-900"}`}>
                      Already Unlocked
                    </h4>
                    <p className={`text-[10px] leading-relaxed ${isVipTheme ? "text-slate-400" : "text-emerald-700"}`}>
                      You already have active access to <strong>{mapName}</strong> in your account. You can open and view it in your dashboard now.
                    </p>
                  </div>
                </div>
              )}

              {/* Warning B: Email Mismatch (Warning only - they can still claim as per client description) */}
              {emailMismatch && !alreadyOwnsMap && (
                <div
                  className={`p-4 rounded-2xl border flex gap-3 ${
                    isVipTheme ? "bg-amber-950/20 border-amber-900/50" : "bg-amber-50 border-amber-100"
                  }`}
                >
                  <MailCheck className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className={`text-xs font-bold ${isVipTheme ? "text-amber-400" : "text-amber-900"}`}>
                      Account Email Note
                    </h4>
                    <p className={`text-[10px] leading-relaxed ${isVipTheme ? "text-slate-400" : "text-amber-700"}`}>
                      This invite was sent to <strong>{promoData.recipientEmail}</strong>. You are currently logged in as <strong>{userProfile?.email}</strong>. Unlocking will link it to your current account.
                    </p>
                  </div>
                </div>
              )}

              {/* Warning C: Not logged in */}
              {!accessToken && (
                <div
                  className={`p-4 rounded-2xl border flex gap-3 ${
                    isVipTheme ? "bg-slate-900 border-slate-800" : "bg-yellow-50 border-yellow-100/50"
                  }`}
                >
                  <Lock className={`w-5 h-5 shrink-0 mt-0.5 ${isVipTheme ? "text-yellow-400" : "text-yellow-600"}`} />
                  <div className="space-y-1">
                    <h4 className={`text-xs font-bold ${isVipTheme ? "text-white" : "text-yellow-900"}`}>
                      Sign In Required
                    </h4>
                    <p className={`text-[10px] leading-relaxed ${isVipTheme ? "text-slate-400" : "text-yellow-700"}`}>
                      Redeem this invitation pass by logging in or creating a new free account. The map will be locked to your profile.
                    </p>
                  </div>
                </div>
              )}

              {/* Action Button */}
              {alreadyOwnsMap ? (
                <Button
                  onClick={handleGoToCatalog}
                  className="w-full h-12 bg-gray-900 hover:bg-black text-white font-extrabold rounded-xl transition-all"
                >
                  Go to Maps Directory <ArrowRight size={16} className="ml-1.5" />
                </Button>
              ) : isFree ? (
                <Button
                  onClick={handleFreeClaim}
                  disabled={isProcessing}
                  className={`w-full h-12 font-extrabold rounded-xl shadow-lg transition-all text-sm uppercase tracking-wider ${
                    isVipTheme
                      ? "bg-yellow-400 hover:bg-yellow-500 text-black shadow-yellow-400/10"
                      : "bg-green-600 hover:bg-green-700 text-white shadow-green-600/10"
                  }`}
                >
                  {isProcessing ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : accessToken ? (
                    <>
                      Redeem Guest Pass <Unlock size={16} className="ml-1.5" />
                    </>
                  ) : (
                    "Log In to Redeem"
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handlePaidCheckout}
                  disabled={isProcessing}
                  className="w-full h-12 bg-primary hover:bg-primary/95 text-black font-extrabold rounded-xl shadow-lg shadow-primary/10 transition-all text-sm uppercase tracking-wider"
                >
                  {isProcessing ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : accessToken ? (
                    <>
                      Confirm Upgrade <ShieldCheck size={16} className="ml-1.5" />
                    </>
                  ) : (
                    "Log In to Upgrade"
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function ClaimPromoPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-gray-500">Retrieving invitation link...</p>
        </div>
      }
    >
      <ClaimPromoContent />
    </Suspense>
  );
}
