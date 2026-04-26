"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useGetMySubscriptionQuery } from "@/redux/features/subscription/subscriptionApi";

export function BillingSettings() {
  const { data, isLoading } = useGetMySubscriptionQuery();
  const sub = data?.data;

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle>Billing & Subscription</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="p-4 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center min-h-[80px]">
            <p className="text-sm text-gray-500">Loading subscription details...</p>
          </div>
        ) : sub && sub.status !== "canceled" ? (
          <div className="p-4 rounded-lg border border-blue-500 bg-blue-500/10">
            <div className="flex justify-between items-center mb-1">
              <p className="font-bold text-gray-900">{sub.planId?.name || "Premium"} Plan</p>
              <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold ${
                sub.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {sub.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 font-medium">
              ${sub.planId?.price}/{sub.planId?.interval} • Next billing date: {new Date(sub.currentPeriodEnd).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            {sub.cancelAtPeriodEnd && (
              <p className="text-xs text-red-500 font-medium mt-2">
                Your subscription will cancel at the end of the current period.
              </p>
            )}
          </div>
        ) : (
          <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
            <p className="font-bold text-gray-700 mb-1">Free Plan</p>
            <p className="text-sm text-gray-500">
              You do not have an active premium subscription. Upgrade to unlock more features!
            </p>
          </div>
        )}

        <Link href="/pricing" className="block w-full">
          <Button variant="outline" className="py-5 w-full justify-center font-bold">
            {sub && sub.status !== "canceled" ? "Manage Subscription" : "Upgrade to Pro"}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

