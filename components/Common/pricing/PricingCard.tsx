"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Plan {
  _id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: string;
  features: string[];
  priority: number;
}

interface PricingCardProps {
  plan: Plan;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  isFormStep?: boolean;
}

export function PricingCard({
  plan,
  isSelected,
  onSelect,
  isFormStep = false,
}: PricingCardProps) {
  const isEnterprise = plan.name.toLowerCase() === "enterprise";
  const isPro = plan.name.toLowerCase() === "pro";

  const formatPrice = (price: number, name: string) => {
    if (name.toLowerCase() === "enterprise") return "Custom";
    return `$${price}`;
  };

  const handleClick = () => {
    if (onSelect) {
      onSelect(plan._id);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`relative rounded-2xl p-6 cursor-pointer transition-all duration-200 h-full flex flex-col ${
        isPro && isFormStep
          ? "border-2 border-yellow-400 bg-white shadow-lg scale-105"
          : isSelected
            ? "border-2 border-yellow-400 bg-white"
            : "border-2 border-gray-200 bg-white hover:border-gray-300"
      } ${isEnterprise ? "bg-gray-900! border-black! text-white" : ""}`}
    >
      {/* Badge */}
      {isPro && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
            MOST POPULAR
          </span>
        </div>
      )}

      {/* Plan Header */}
      <div className="space-y-2 mb-4">
        <h3 className={`text-xl font-bold ${isEnterprise ? "text-white" : "text-gray-900"}`}>
          {plan.name}
        </h3>
        <div className="flex items-baseline gap-1">
          <span className={`text-3xl font-bold ${isEnterprise ? "text-yellow-400" : "text-gray-900"}`}>
            {formatPrice(plan.price, plan.name)}
          </span>
          {plan.interval && plan.name.toLowerCase() !== "enterprise" && (
            <span className={`text-sm ${isEnterprise ? "text-gray-300" : "text-gray-600"}`}>
              /{plan.interval}
            </span>
          )}
        </div>
        <p className={`text-sm ${isEnterprise ? "text-gray-300" : "text-gray-600"}`}>
          {plan.description}
        </p>
      </div>

      {/* Select Button */}
      <Button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleClick();
        }}
        className={`w-full py-2 mb-6 font-semibold rounded-lg transition-all ${
          isSelected
            ? isEnterprise
              ? "bg-white text-black hover:bg-gray-100"
              : "bg-yellow-400 text-black hover:bg-yellow-500"
            : isEnterprise
              ? "bg-white text-black hover:bg-gray-100"
              : isPro
                ? "bg-yellow-400 text-black hover:bg-yellow-500"
                : "bg-gray-100 text-gray-900 hover:bg-gray-200"
        }`}
      >
        {isFormStep ? "Select Plan" : "Get Started"}
      </Button>

      {/* Features */}
      <div className="space-y-3 mt-auto">
        {plan.features.map((feature, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <Check
              className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                isEnterprise ? "text-yellow-400" : "text-green-500"
              }`}
            />
            <span
              className={`text-sm ${
                isEnterprise ? "text-gray-200" : "text-gray-700"
              }`}
            >
              {feature}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
