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
  
  const subs = Array.isArray(data?.data)
    ? data.data
    : data?.data
    ? [data.data]
    : [];

  const token = useAppSelector((state) => state.auth.accessToken);

  const handleCancelSubscription = async (subscriptionId: string) => {
    if (!subscriptionId || !token) return;

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
      await cancelSubscription({
        subscriptionId,
        token,
      }).unwrap();

      toast.success("Subscription cancelled successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to cancel subscription");
    }
  };

  const activeSubs = subs.filter((s: any) => s.status !== "canceled");

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle>Billing & Subscription</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="p-4 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center min-h-[80px]">
            <p className="text-sm text-gray-500">
              Loading subscription details...
            </p>
          </div>
        ) : activeSubs.length > 0 ? (
          activeSubs.map((sub: any) => (
            <div key={sub._id} className="p-4 rounded-lg border border-blue-500 bg-blue-500/10">
              <div className="flex justify-between items-center mb-1">
                <div>
                  <p className="font-bold text-gray-900">
                    {sub.planId?.name || "Premium Plan"}
                  </p>
                  <p className="text-xs text-blue-700 font-bold mt-0.5">
                    For Business: {sub.businessId?.name || "Unknown Business"}
                  </p>
                </div>
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
              <p className="text-sm text-gray-600 font-medium mt-2">
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
                    onClick={() => handleCancelSubscription(sub._id)}
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
          ))
        ) : (
          <div className="p-4 rounded-lg border border-gray-200 bg-gray-50 text-center">
            <p className="font-bold text-gray-700 mb-1">No Active Subscriptions</p>
            <p className="text-sm text-gray-500 mb-4">
              You do not have any active business subscriptions. Activate your business listings from your dashboard.
            </p>
            <Link href="/profile/my-business">
              <Button size="sm" className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold">
                Go to My Businesses
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
