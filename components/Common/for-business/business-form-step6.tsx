"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";

import { useGetSubscriptionPlansQuery } from "@/redux/features/subscription/subscriptionApi";
import { Plan, PricingCard } from "../pricing/PricingCard";

interface BusinessFormStep6Props {
  form: UseFormReturn<any>;
}

export function BusinessFormStep6({ form }: BusinessFormStep6Props) {
  const { data: plansRes, isLoading, error } = useGetSubscriptionPlansQuery();
  const selectedPlan = form.watch("selectedPlan");
  console.log("selectedPlan", selectedPlan);

  const plans: Plan[] = plansRes?.data || [];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium font-public-sans text-xl">
          Loading subscription plans...
        </p>
      </div>
    );
  }

  if (error) {
    return (
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
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <p className="text-sm md:text-base text-gray-500/80 uppercase tracking-wider font-bold">
          CURRENT STEP: SUBSCRIPTION PLAN
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Choose the right plan for your journey
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Select a plan to unlock powerful tools and reach more travelers. You
          can change this at any time later.
        </p>
      </div>

      {/* Plans Grid */}
      <FormField
        control={form.control}
        name="selectedPlan"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div className="grid md:grid-cols-3 gap-6 pt-4">
                {plans.map((plan) => (
                  <PricingCard
                    key={plan._id}
                    plan={plan}
                    isSelected={selectedPlan === plan._id}
                    onSelect={(id) => field.onChange(id)}
                    isFormStep={true}
                  />
                ))}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
