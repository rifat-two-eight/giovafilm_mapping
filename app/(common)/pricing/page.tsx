"use client";

import { useGetSubscriptionPlansQuery, useGetMySubscriptionQuery } from "@/redux/features/subscription/subscriptionApi";
import { PricingCard, Plan } from "@/components/Common/pricing/PricingCard";
import { Button } from "@/components/ui/button";

export default function PricingPage() {
  const { data: plansRes, isLoading: plansLoading, error } = useGetSubscriptionPlansQuery();
  const { data: subRes, isLoading: subLoading } = useGetMySubscriptionQuery();
  
  const plans: Plan[] = plansRes?.data || [];
  const currentSub = subRes?.data;
  const currentPlanId = currentSub?.status !== "canceled" ? currentSub?.planId?._id : null;
  
  const isLoading = plansLoading || subLoading;

  return (
    <main className="min-h-screen bg-gray-50 py-20 px-6">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header Section */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight">
            Simple, transparent <span className="text-yellow-400">pricing</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            Choose the perfect plan to grow your business and connect with
            travelers like never before.
          </p>
        </div>

        {/* Loading/Error States */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 font-medium font-public-sans text-xl">
              Loading pricing plans...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300 space-y-4">
            <p className="text-red-500 font-medium text-lg">
              Failed to load subscription plans.
            </p>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="rounded-xl"
            >
              Try Again
            </Button>
          </div>
        ) : (
          /* Pricing Grid */
          <div className="grid md:grid-cols-3 gap-8 items-stretch pt-8">
            {plans.map((plan) => (
              <PricingCard 
                key={plan._id} 
                plan={plan} 
                isSelected={currentPlanId === plan._id}
              />
            ))}
          </div>
        )}

        {/* FAQ Preview or Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-500 font-medium">
            Need a custom solution for your enterprise?
          </p>
          {/* <Button variant="link" className="text-blue-600 font-bold text-lg hover:text-blue-700">
            Contact our sales team →
          </Button> */}
        </div>
      </div>
    </main>
  );
}
