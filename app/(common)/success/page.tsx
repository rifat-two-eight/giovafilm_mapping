"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useVerifySubscriptionCheckoutMutation } from "@/redux/features/subscription/subscriptionApi";
import { useAppSelector } from "@/redux/hook";
import { selectAccessToken } from "@/redux/features/auth/authSlice";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const accessToken = useAppSelector(selectAccessToken);
  const [verifyCheckout, { isLoading }] = useVerifySubscriptionCheckoutMutation();
  const [verified, setVerified] = useState(!sessionId);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!sessionId || !accessToken) return;

    let cancelled = false;
    verifyCheckout(sessionId)
      .unwrap()
      .then(() => {
        if (!cancelled) setVerified(true);
      })
      .catch(() => {
        if (!cancelled) {
          setFailed(true);
          setVerified(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [sessionId, accessToken, verifyCheckout]);

  const waiting =
    Boolean(sessionId) && !verified && (isLoading || Boolean(accessToken));

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-6 py-20">
      <div className="max-w-md w-full bg-white rounded-3xl p-10 shadow-xl text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center">
            {waiting ? (
              <Loader2 className="w-16 h-16 text-green-500 animate-spin" />
            ) : (
              <CheckCircle2 className="w-16 h-16 text-green-500" />
            )}
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-gray-900">
            {waiting ? "Confirming your subscription..." : "Payment Successful!"}
          </h1>
          <p className="text-gray-600 leading-relaxed">
            {waiting
              ? "Please wait while we activate your business listing."
              : failed
                ? "Thank you. If My Business still shows unpaid, refresh that page in a moment."
                : "Thank you for your subscription. Your business journey with Roadtripeado starts now!"}
          </p>
        </div>

        <div className="pt-4 space-y-3">
          <Link href="/profile/my-business" className="block w-full">
            <Button
              disabled={waiting}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold h-14 rounded-2xl shadow-lg shadow-yellow-100 transition-all active:scale-95"
            >
              GO TO MY BUSINESSES
            </Button>
          </Link>
          <Link href="/" className="block w-full">
            <Button variant="ghost" className="w-full text-gray-500 font-semibold h-12 hover:bg-gray-50">
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-gray-50">
          <Loader2 className="w-10 h-10 text-green-500 animate-spin" />
        </main>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
