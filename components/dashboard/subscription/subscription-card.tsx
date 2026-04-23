"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  plan: any;
  onSubscribe: (planId: string) => void;
  isLoading: boolean;
};

export function SubscriptionCard({ plan, onSubscribe, isLoading }: Props) {
  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl transition-all p-8 flex flex-col relative overflow-hidden group">
      {plan.isPopular && (
        <div className="absolute top-0 right-0 bg-primary text-black text-[10px] font-black uppercase px-4 py-1 rounded-bl-xl tracking-widest">
          Popular
        </div>
      )}

      <div className="mb-8">
        <h3 className="text-xl font-black uppercase tracking-tight text-gray-900 mb-2">
          {plan.name}
        </h3>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-black text-gray-900">
            ${plan.price}
          </span>
          <span className="text-gray-500 font-medium lowercase">
            /{plan.duration}
          </span>
        </div>
      </div>

      <div className="space-y-4 mb-10 flex-1">
        {plan.features?.map((feature: string, idx: number) => (
          <div key={idx} className="flex items-start gap-3">
            <div className="mt-1 bg-green-100 p-0.5 rounded-full">
              <Check className="w-3.5 h-3.5 text-green-600 stroke-[3]" />
            </div>
            <p className="text-sm text-gray-600 font-medium">{feature}</p>
          </div>
        ))}
      </div>

      <Button
        onClick={() => onSubscribe(plan._id)}
        disabled={isLoading}
        className="w-full bg-primary hover:bg-primary/90 text-black font-black uppercase tracking-widest py-6 rounded-2xl"
      >
        {isLoading ? "Processing..." : "Subscribe Now"}
      </Button>
    </div>
  );
}
