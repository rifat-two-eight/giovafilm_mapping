"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useCancelSubscriptionMutation,
  useGetMySubscriptionQuery,
} from "@/redux/features/subscription/subscriptionApi";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { useAppSelector } from "@/redux/hook";

export function BillingSettings() {
  const { data, isLoading } = useGetMySubscriptionQuery();
  const [cancelSubscription, { isLoading: isCanceling }] =
    useCancelSubscriptionMutation();
  const sub = data?.data;
  const token = useAppSelector((state) => state.auth.accessToken);
  console.log(token, sub);

  const handleCancelSubscription = async () => {
    if (!sub?._id || !token) return;

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will still have access until the end of your billing period.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel it!",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const res = await cancelSubscription({
        subscriptionId: sub._id,
        token,
      }).unwrap();

      // console.log(res);
      toast.success("Subscription cancelled successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to cancel subscription");
    }
  };

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle>Billing & Subscription</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="p-4 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center min-h-[80px]">
            <p className="text-sm text-gray-500">
              Loading subscription details...
            </p>
          </div>
        ) : sub && sub.status !== "canceled" && sub.planId?.name ? (
          <div className="p-4 rounded-lg border border-blue-500 bg-blue-500/10">
            <div className="flex justify-between items-center mb-1">
              <p className="font-bold text-gray-900">
                {sub.planId.name} Plan
              </p>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold ${
                  sub.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {sub.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 font-medium">
              {sub.planId?.price != null ? `$${sub.planId.price}` : ""}
              {sub.planId?.interval ? `/${sub.planId.interval}` : ""}
              {sub.currentPeriodEnd
                ? ` • Next billing date: ${new Date(sub.currentPeriodEnd).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`
                : ""}
            </p>
            {sub.cancelAtPeriodEnd && (
              <p className="text-xs text-red-500 font-medium mt-2">
                Your subscription will cancel at the end of the current period.
              </p>
            )}

            {!sub.cancelAtPeriodEnd && (
              <div className="mt-4 flex justify-end">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleCancelSubscription}
                  disabled={isCanceling}
                >
                  {isCanceling && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Cancel Subscription
                </Button>
              </div>
            )}
          </div>
        ) : sub && sub.status !== "canceled" ? (
          // Subscription exists in DB but plan details not yet synced
          <div className="p-4 rounded-lg border border-amber-400 bg-amber-50">
            <p className="font-bold text-amber-700 mb-1">⏳ Subscription Pending Sync</p>
            <p className="text-sm text-amber-600">
              Your payment was received. Subscription details will be fully visible once
              the system syncs your plan information. This usually takes a few moments.
            </p>
          </div>
        ) : (
          <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
            <p className="font-bold text-gray-700 mb-1">Free Plan</p>
            <p className="text-sm text-gray-500">
              You do not have an active premium subscription. Upgrade to unlock
              more features!
            </p>
          </div>
        )}

        <Link href="/pricing" className="block w-full">
          <Button
            variant="outline"
            className="py-5 w-full justify-center font-bold"
          >
            {sub && sub.status !== "canceled"
              ? "Manage Subscription"
              : "Upgrade to Pro"}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
