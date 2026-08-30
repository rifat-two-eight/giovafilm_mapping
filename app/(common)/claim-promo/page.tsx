"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hook";
import { selectAccessToken } from "@/redux/features/auth/authSlice";
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
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-gray-500 font-semibold text-sm">Verifying invitation credentials...</p>
      </div>
    );
  }

  // Case A: Stripe Checkout SUCCESS Redirect
  if (success) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-3xl border border-gray-100 shadow-xl p-8 text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-gray-900">Map Unlocked!</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Your payment was completed successfully. The interactive map is now fully unlocked in your account.
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
    );
  }

  // Case B: Stripe Checkout CANCELLED Redirect
  if (cancelled) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-3xl border border-gray-100 shadow-xl p-8 text-center space-y-6">
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
    );
  }

  // Case C: Invalid Code / Error State
  if (isErrorVerify || !code) {
    const errorMsg =
      (verifyError as any)?.data?.message ||
      "Invalid promo link or invitation code.";
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-3xl border border-gray-100 shadow-xl p-8 text-center space-y-6">
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
    );
  }

  // Case D: Render User Claim Panel based on type
  if (promoType === "influencer") {
    // Influencer Layout - Luxurious VIP Pass
    return (
      <div className="max-w-md mx-auto my-12 bg-[#0F172A] rounded-3xl border border-slate-800 shadow-2xl overflow-hidden text-white">
        {/* VIP Golden Banner */}
        <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 py-6 px-8 flex items-center gap-4">
          <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-yellow-400 shadow-lg">
            <Star className="fill-yellow-400 text-yellow-400" size={24} />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-widest font-black text-black">
              VIP GUEST INVITATION
            </span>
            <h2 className="text-lg font-black text-black">Exclusive Guest Pass</h2>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 space-y-1.5">
            <span className="text-[9px] text-yellow-500 font-black uppercase tracking-wider">Target Map Access</span>
            <h3 className="text-xl font-black text-white flex items-center gap-1.5">
              {mapName} <Sparkles size={16} className="text-yellow-400 animate-pulse" />
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Unlock the complete premium interactive Road Trip Guide with offline pins, reviews, and route guidelines.
            </p>
          </div>

          <div className="flex items-center justify-between py-3 border-y border-dashed border-slate-800">
            <span className="text-xs font-bold text-slate-400">Upgrade Cost:</span>
            <span className="text-lg font-black text-yellow-400 tracking-wider">100% FREE VIP PASS</span>
          </div>

          {!accessToken && (
            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex gap-3">
              <Lock className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white">Sign In Required</h4>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Redeem this guest pass by creating a free account or logging in. The map will be locked to your account.
                </p>
              </div>
            </div>
          )}

          <Button
            onClick={handleFreeClaim}
            disabled={isProcessing}
            className="w-full h-12 bg-yellow-400 hover:bg-yellow-500 text-black font-extrabold rounded-xl shadow-lg shadow-yellow-400/10 transition-all text-sm uppercase tracking-wider"
          >
            {isProcessing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : accessToken ? (
              <>
                Redeem Free Guest Pass <Unlock size={16} className="ml-1" />
              </>
            ) : (
              "Log In to Redeem Pass"
            )}
          </Button>
        </div>
      </div>
    );
  }

  // Customer Upgrade Layout ($5 Upgrade UI)
  return (
    <div className="max-w-md mx-auto my-12 bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
      {/* Brand Blue/Yellow clean header */}
      <div className="bg-primary/10 py-6 px-8 flex items-center gap-4 border-b border-gray-100">
        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-black">
          <Ticket size={24} />
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-wider font-extrabold text-gray-500">
            Roadtripeado Platform
          </span>
          <h2 className="text-lg font-black text-gray-900">Map Upgrade Offer</h2>
        </div>
      </div>

      <div className="p-8 space-y-6">
        <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Interactive Map</span>
          <h3 className="text-xl font-extrabold text-gray-900">{mapName}</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Upgrade your standard Google My Maps access to our premium interactive road trip map interface.
          </p>
        </div>

        <div className="flex items-center justify-between py-2 border-y border-dashed border-gray-200">
          <span className="text-xs font-semibold text-gray-400">Upgrade Pricing:</span>
          <span className="text-lg font-extrabold text-gray-900">
            ${promoData?.price?.toFixed(2)} USD
          </span>
        </div>

        {!accessToken && (
          <div className="p-4 bg-yellow-50 rounded-2xl border border-yellow-100/50 flex gap-3">
            <Lock className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-yellow-900">Authentication Required</h4>
              <p className="text-[10px] text-yellow-700 leading-relaxed">
                Log in or sign up to claim your upgrade. You can use any email address to login.
              </p>
            </div>
          </div>
        )}

        <Button
          onClick={handlePaidCheckout}
          disabled={isProcessing}
          className="w-full h-12 bg-primary hover:bg-primary/95 text-black font-extrabold rounded-xl shadow-lg shadow-primary/10 transition-all text-sm uppercase tracking-wider"
        >
          {isProcessing ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : accessToken ? (
            <>
              Confirm Upgrade <ShieldCheck size={16} className="ml-1" />
            </>
          ) : (
            "Log In to Upgrade Map"
          )}
        </Button>
      </div>
    </div>
  );
}

export default function ClaimPromoPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-gray-500">Retrieving invitation link...</p>
        </div>
      }
    >
      <ClaimPromoContent />
    </Suspense>
  );
}
