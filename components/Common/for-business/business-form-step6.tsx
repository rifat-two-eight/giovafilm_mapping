"use client";

import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface BusinessFormStep6Props {
  form: UseFormReturn<any>;
}

interface PlanDetails {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  highlighted: boolean;
  badge?: string;
  features: string[];
  buttonText: string;
}

const plans: PlanDetails[] = [
  {
    id: "starter",
    name: "Starter",
    price: "$0",
    period: "/month",
    description: "Perfect for small local spots getting started.",
    highlighted: false,
    features: [
      "Basic business listing",
      "1 Professional photo",
      "Standard map pin",
    ],
    buttonText: "Select Plan",
  },
  {
    id: "pro",
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "Maximize visibility and drive more customers.",
    highlighted: true,
    badge: "MOST POPULAR",
    features: [
      "Featured listing status",
      "Up to 10 photos",
      "Custom offer integration",
      "Priority in search results",
    ],
    buttonText: "Select Plan",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Scalable solutions for multiple locations.",
    highlighted: false,
    features: [
      "Unlimited locations",
      "Dedicated account manager",
      "Advanced analytics dashboard",
    ],
    buttonText: "Select Plan",
  },
];

export function BusinessFormStep6({ form }: BusinessFormStep6Props) {
  const selectedPlan = form.watch("selectedPlan");

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
              <div className="grid md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => field.onChange(plan.id)}
                    className={`relative rounded-2xl p-6 cursor-pointer transition-all duration-200 ${
                      plan.highlighted
                        ? "border-2 border-yellow-400 bg-white shadow-lg scale-105"
                        : selectedPlan === plan.id
                          ? "border-2 border-yellow-400 bg-white"
                          : "border-2 border-gray-200 bg-white hover:border-gray-300"
                    } ${plan.id === "enterprise" ? "bg-gray-900! border-black! text-white" : ""}`}
                  >
                    {/* Badge */}
                    {plan.badge && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full">
                          {plan.badge}
                        </span>
                      </div>
                    )}

                    {/* Plan Header */}
                    <div className="space-y-2 mb-4">
                      <h3
                        className={`text-xl font-bold ${plan.id === "enterprise" ? "text-white" : "text-gray-900"}`}
                      >
                        {plan.name}
                      </h3>
                      <div className="flex items-baseline gap-1">
                        <span
                          className={`text-3xl font-bold ${plan.id === "enterprise" ? "text-yellow-400" : "text-gray-900"}`}
                        >
                          {plan.price}
                        </span>
                        {plan.period && (
                          <span
                            className={`text-sm ${plan.id === "enterprise" ? "text-gray-300" : "text-gray-600"}`}
                          >
                            {plan.period}
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-sm ${plan.id === "enterprise" ? "text-gray-300" : "text-gray-600"}`}
                      >
                        {plan.description}
                      </p>
                    </div>

                    {/* Button */}
                    <Button
                      type="button"
                      onClick={() => field.onChange(plan.id)}
                      className={`w-full py-2 mb-6 font-semibold rounded-lg transition-all ${
                        selectedPlan === plan.id
                          ? plan.id === "enterprise"
                            ? "bg-white text-black hover:bg-gray-100"
                            : "bg-yellow-400 text-black hover:bg-yellow-500"
                          : plan.id === "enterprise"
                            ? "bg-white text-black hover:bg-gray-100"
                            : plan.id === "pro"
                              ? "bg-yellow-400 text-black hover:bg-yellow-500"
                              : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                      }`}
                    >
                      {plan.buttonText}
                    </Button>

                    {/* Features */}
                    <div className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <Check
                            className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                              plan.id === "enterprise"
                                ? "text-yellow-400"
                                : "text-green-500"
                            }`}
                          />
                          <span
                            className={`text-sm ${
                              plan.id === "enterprise"
                                ? "text-gray-200"
                                : "text-gray-700"
                            }`}
                          >
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Submit Button */}
      <div className="flex gap-3 pt-6">
        <Button
          type="button"
          disabled={!selectedPlan}
          className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-black font-semibold py-6 text-base rounded-lg"
        >
          Submit and Finish
        </Button>
      </div>
    </div>
  );
}
