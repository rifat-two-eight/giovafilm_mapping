"use client";

import { XCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason") || searchParams.get("message");

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-6 py-20">
      <div className="max-w-md w-full bg-white rounded-3xl p-10 shadow-xl text-center space-y-8 animate-in fade-in slide-in-from-bottom duration-500">
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center">
            <XCircle className="w-16 h-16 text-red-500" />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-gray-900">Payment Failed</h1>
          <p className="text-gray-600 leading-relaxed">
            {reason
              ? decodeURIComponent(reason)
              : "We could not process your transaction. Your card was not charged. Please try again with a different payment method or verify your card details."}
          </p>
        </div>

        <div className="pt-4 space-y-3">
          <Link href="/pricing" className="block w-full">
            <Button className="w-full bg-gray-900 hover:bg-black text-white font-bold h-14 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95">
              <RefreshCcw className="w-5 h-5" />
              TRY AGAIN
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

export default function PaymentFailedPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
        </main>
      }
    >
      <PaymentFailedContent />
    </Suspense>
  );
}
