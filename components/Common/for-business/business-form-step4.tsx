"use client";

import { Button } from "@/components/ui/button";
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
import { Camera, Shield, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { UseFormReturn } from "react-hook-form";

interface BusinessFormStep4Props {
  form: UseFormReturn<any>;
  offerPhoto?: File | null;
  onOfferPhotoChange?: (file: File | null) => void;
}

export const step4Inputs = [
  "offerTitle",
  "offerDescription",
  "offerMaxRedemptions",
  "offerDuration",
  "offerDiscountType",
  "offerDiscount",
  "offerBogoSecondType",
  "offerValidFrom",
  "offerValidUntil",
  "offerNoExpiration",
  "offerRedemptionRules",
] as const;

export function BusinessFormStep4({
  form,
  offerPhoto = null,
  onOfferPhotoChange,
}: BusinessFormStep4Props) {
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const discountType = form.watch("offerDiscountType");
  const bogoSecondType = form.watch("offerBogoSecondType");

  useEffect(() => {
    if (!offerPhoto) {
      setPhotoPreview(null);
      return;
    }
    const url = URL.createObjectURL(offerPhoto);
    setPhotoPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [offerPhoto]);

  const handleResetOffer = () => {
    form.setValue("offerTitle", "");
    form.setValue("offerDescription", "");
    form.setValue("offerMaxRedemptions", "");
    form.setValue("offerDuration", "");
    form.setValue("offerDiscountType", "");
    form.setValue("offerDiscount", "");
    form.setValue("offerBogoSecondType", "");
    form.setValue("offerValidFrom", "");
    form.setValue("offerValidUntil", "");
    form.setValue("offerNoExpiration", false);
    form.setValue("offerRedemptionRules", "");
    onOfferPhotoChange?.(null);
    if (photoInputRef.current) photoInputRef.current.value = "";
  };

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
        <p className="text-sm text-gray-500">
          This step is optional. You can skip it, or add an offer with a photo.
        </p>
      </div>

      <div className="flex justify-end -mb-4">
        <Button
          type="button"
          onClick={handleResetOffer}
          variant="outline"
          className="text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
        >
          Reset Offer Details
        </Button>
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
        <div className="space-y-3">
          <h3 className="text-base text-gray-900 font-semibold">
            Offer Photo <span className="text-red-500">*</span>
          </h3>
          {photoPreview ? (
            <div className="relative w-full max-w-sm">
              <img
                src={photoPreview}
                alt="Offer preview"
                className="w-full h-48 object-cover rounded-xl border border-gray-200"
              />
              <button
                type="button"
                onClick={() => {
                  onOfferPhotoChange?.(null);
                  if (photoInputRef.current) photoInputRef.current.value = "";
                }}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow"
                aria-label="Remove offer photo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              className="bg-gray-100 rounded-xl h-48 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors border border-dashed border-gray-300"
              onClick={() => photoInputRef.current?.click()}
            >
              <div className="text-center">
                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500 font-medium">TAP TO ADD OFFER PHOTO</p>
              </div>
            </div>
          )}
          <p className="text-sm text-gray-600">
            This photo is shown on the Offers page. PNG or JPG, up to 10MB.
          </p>
          <Button
            type="button"
            onClick={() => photoInputRef.current?.click()}
            className="w-full max-w-sm bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
          >
            <Camera className="w-4 h-4 mr-2" />
            {photoPreview ? "Change Offer Photo" : "Upload Offer Photo"}
          </Button>
          <input
            ref={photoInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              onOfferPhotoChange?.(file);
            }}
          />
        </div>

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
                    onChange={(e) => {
                      field.onChange(e);
                      form.setValue("offerBogoSecondType", "");
                      if (e.target.value === "Free item" || e.target.value === "BOGO") {
                        form.setValue("offerDiscount", "");
                      }
                    }}
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

          {discountType !== "BOGO" && discountType !== "Free item" && (
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
          )}
        </div>

        {discountType === "BOGO" && (
          <div className="space-y-3 rounded-xl border border-yellow-200 bg-yellow-50/60 p-4">
            <FormField
              control={form.control}
              name="offerBogoSecondType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base text-gray-900 font-semibold">
                    Second item
                  </FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    >
                      <option value="">Choose how the second item is discounted</option>
                      <option value="free">Second item is free</option>
                      <option value="percentage">Second item has a % discount</option>
                    </select>
                  </FormControl>
                  <p className="text-xs text-gray-500">
                    Customers will see this clearly, e.g. “Buy 1 Get 1 Free” or “Buy 1 Get 1 · 50% off 2nd”.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            {bogoSecondType === "percentage" && (
              <FormField
                control={form.control}
                name="offerDiscount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base text-gray-900 font-semibold">
                      % off second item
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={100}
                        placeholder="e.g., 50"
                        {...field}
                        className="bg-white border-gray-200"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        )}

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
