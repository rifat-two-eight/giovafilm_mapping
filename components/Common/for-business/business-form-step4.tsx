"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Shield } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface BusinessFormStep3Props {
  form: UseFormReturn<any>;
}

export const step4Inputs = [
  "offerTitle",
  "offerDescription",
  "offerMaxRedemptions",
  "offerDuration",
  "offerDiscountType",
  "offerDiscount",
  "offerValidFrom",
  "offerValidUntil",
  "offerNoExpiration",
  "offerRedemptionRules",
] as const;

export function BusinessFormStep4({ form }: BusinessFormStep3Props) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">
          Boost your visibility
        </h2>
        <p className="text-gray-600">
          Businesses that integrate exclusive offers tend to gain greater
          visibility, interaction, and conversion within the app, increasing
          their chances of attracting more customers and generating higher
          sales.
        </p>
      </div>
      {/* 
      <div className="bg-yellow-400 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          <h3 className="font-bold text-gray-900">EXCLUSIVE OFFER</h3>
        </div>
        <p className="text-sm text-gray-800">
          Get priority placement in search results by offering exclusive
          discounts to our Pro members.
        </p>

        <div className="bg-yellow-500 rounded-lg p-4 space-y-4">
          <div className="flex gap-4">
            <div className="w-20 h-20 bg-yellow-300 rounded border-2 border-dashed border-yellow-600 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">📷</span>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 mb-1">
                10% OFF for Pro members
              </h4>
              <p className="text-sm text-gray-800">Valid until: 30 Mar 2026</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="bg-white text-gray-900 text-xs font-semibold px-3 py-1 rounded-full">
              🍽️ DINE-IN ONLY
            </span>
            <span className="bg-white text-gray-900 text-xs font-semibold px-3 py-1 rounded-full">
              👤 1 PER USER
            </span>
            <span className="bg-white text-gray-900 text-xs font-semibold px-3 py-1 rounded-full">
              ❌ NO STACKING
            </span>
          </div>
        </div>

        <div className="bg-yellow-200 rounded-lg p-4 flex gap-3">
          <Shield className="w-5 h-5 text-yellow-700 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-gray-900 text-sm mb-1">
              Pro Verification
            </p>
            <p className="text-xs text-gray-800">
              Offer Validation: Your staff must validate the offer when the user
              with a Pro membership presents the active coupon within the
              application at the time of placing their order.
            </p>
          </div>
        </div>
      </div> */}

      {/* Form Fields */}
      <div className="space-y-4 text-left">
        <FormField
          control={form.control}
          name="offerTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base text-gray-900 font-semibold">
                Offer Title
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., 10% OFF for Pro members"
                  {...field}
                  className="bg-gray-50 border-gray-200"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="offerDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base text-gray-900 font-semibold">
                Offer Description
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your exclusive offer..."
                  {...field}
                  className="bg-gray-50 border-gray-200 min-h-24"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Limits */}
        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="offerMaxRedemptions"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base text-gray-900 font-semibold">
                  Max Redemptions
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    placeholder="e.g., 100"
                    {...field}
                    className="bg-gray-50 border-gray-200"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="offerDuration"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base text-gray-900 font-semibold">
                  Duration (Minutes)
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    placeholder="e.g., 60"
                    {...field}
                    className="bg-gray-50 border-gray-200"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Discount Type and Value */}
        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="offerDiscountType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base text-gray-900 font-semibold">
                  Discount Type
                </FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    <option value="">Select type</option>
                    <option value="Percentage">Percentage</option>
                    <option value="Flat">Flat Amount</option>
                    <option value="BOGO">Buy One Get One (BOGO)</option>
                    <option value="Free item">Free Item</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="offerDiscount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base text-gray-900 font-semibold">
                  Discount Value
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    placeholder="e.g., 10"
                    {...field}
                    className="bg-gray-50 border-gray-200"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Validity */}
        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="offerValidFrom"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base text-gray-900 font-semibold">
                  Valid From
                </FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    className="bg-gray-50 border-gray-200"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="offerValidUntil"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base text-gray-900 font-semibold">
                  Valid Until
                </FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    disabled={form.watch("offerNoExpiration")}
                    className="bg-gray-50 border-gray-200 disabled:opacity-50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="offerNoExpiration"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-gray-50/50">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm font-semibold text-gray-900 cursor-pointer">
                  No Expiration
                </FormLabel>
                <p className="text-xs text-gray-500">
                  Checking this will make the offer valid indefinitely.
                </p>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="offerRedemptionRules"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base text-gray-900 font-semibold">
                Redemption Rules
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., One per user per visit, No stacking with other offers..."
                  {...field}
                  className="bg-gray-50 border-gray-200 min-h-20"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
