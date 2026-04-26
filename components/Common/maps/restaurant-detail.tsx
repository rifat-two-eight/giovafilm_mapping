"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, getImageUrl } from "@/lib/utils";
import {
  useGetSingleOfferQuery,
  useRedeemOfferMutation,
} from "@/redux/features/offer/offerApi";
import { CheckCircle2, ChevronRight, HelpCircle, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function RestaurantDetail() {
  const params = useParams();
  const pathname = usePathname();
  const offerId = params.id as string;

  const { data: offerRes, isLoading } = useGetSingleOfferQuery(offerId, {
    skip: !offerId,
  });
  const offer = offerRes?.data;

  const [redeemOffer, { isLoading: isRedeeming }] = useRedeemOfferMutation();

  const [timeLeft, setTimeLeft] = useState<string>("00:00");
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [expiry, setExpiry] = useState<string | null>(null);

  useEffect(() => {
    // If the offer has an active redemption, start the timer
    if (offer?.activeRedemption?.expiresAt) {
      setExpiry(offer.activeRedemption.expiresAt);
    }
  }, [offer]);

  useEffect(() => {
    if (!expiry) return;

    setIsTimerActive(true);
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(expiry).getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft("00:00");
        setIsTimerActive(false);
        setExpiry(null);
        return;
      }

      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(
        `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [expiry]);

  const handleRedeem = async () => {
    try {
      const res = await redeemOffer(offerId).unwrap();
      if (res.data?.expiresAt) {
        toast.success("Offer redeemed successfully!");
        setExpiry(res.data.expiresAt);
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to redeem offer");
    }
  };

  // Check if the current path is from /maps
  const isFromMaps = pathname?.startsWith("/maps");

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-96 w-full rounded-2xl" />
              <Skeleton className="h-20 w-3/4" />
              <Skeleton className="h-32 w-full" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-80 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl font-bold">Offer not found</p>
      </div>
    );
  }

  const redemptionRules = offer.redemptionRules || [
    "One redemption per user",
    "Valid for all days",
    "Cannot combine with other promotions",
  ];

  return (
    <div className="bg-gray-50 py-4 sm:py-6 md:py-8 pb-10 sm:pb-12 md:pb-14">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Breadcrumb */}
        {!isFromMaps && (
          <div className="mb-4 sm:mb-5 md:mb-6">
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <Link
                href="/offers"
                className="text-blue-600 hover:underline font-medium"
              >
                Offers
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-700 font-medium line-clamp-1">
                {offer?.title}
              </span>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="">
          <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {/* Left Section - Image and Details */}
            <div className="bg-white lg:col-span-2 space-y-4 sm:space-y-5 md:space-y-6 rounded-xl sm:rounded-2xl overflow-hidden">
              {/* Hero Image with Rating */}
              <div className="relative rounded-t-xl sm:rounded-t-2xl overflow-hidden h-48 sm:h-64 md:h-80 lg:h-96 bg-gray-200">
                <Image
                  src={getImageUrl(offer.photo)}
                  alt={offer?.title}
                  width={500}
                  height={500}
                  unoptimized
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {/* Rating Badge */}
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white rounded-full px-2 py-1.5 sm:px-3 sm:py-2 flex items-center gap-1 shadow-md">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs sm:text-sm font-semibold text-gray-900">
                    {offer?.place?.rating || 0} (
                    {offer?.place?.totalReview || 0} reviews)
                  </span>
                </div>
              </div>

              <div className="space-y-4 sm:space-y-5 md:space-y-6 p-4 sm:p-5 md:p-6 pt-2 sm:pt-2 md:pt-2">
                {/* Restaurant Name and Discount */}
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                    <div className="space-y-1 sm:space-y-2">
                      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 wrap-break-word">
                        {offer?.title}
                      </h1>
                      <p className="text-sm sm:text-base text-gray-600 flex items-center gap-2 wrap-break-word">
                        <span>📍</span>{" "}
                        {offer.place?.address || "Location not specified"}
                      </p>
                    </div>
                    <div className="bg-yellow-100 text-gray-900 font-bold px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full text-base sm:text-lg md:text-xl inline-block w-fit">
                      {offer.discountValue}
                      {offer.discountType === "Percentage" ? "%" : ""} OFF
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="">
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    {offer.description}
                  </p>
                </div>

                {/* Validity and Rules Section */}
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6 p-4 sm:p-5 md:p-6 bg-gray-100/80 rounded-lg">
                  {/* Validity Period */}
                  <div className="space-y-3 sm:space-y-4">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                      Validity Period
                    </h3>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="text-xl sm:text-2xl">📅</div>
                        <div>
                          <p className="text-[10px] sm:text-xs text-gray-500 uppercase">
                            FROM
                          </p>
                          <p className="text-sm sm:text-base font-semibold text-gray-900 wrap-break-word">
                            {formatDate(offer.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="text-xl sm:text-2xl">📅</div>
                        <div>
                          <p className="text-[10px] sm:text-xs text-gray-500 uppercase">
                            UNTIL
                          </p>
                          <p className="text-sm sm:text-base font-semibold text-gray-900 wrap-break-word">
                            {new Date(offer.validUntil).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Redemption Rules */}
                  <div className="mt-3 sm:mt-0">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 sm:mb-4">
                      Redemption Rules
                    </h3>
                    <div className="space-y-2 sm:space-y-3">
                      {redemptionRules.map((rule: string, idx: number) => (
                        <div
                          key={idx}
                          className="flex  items-center gap-2 sm:gap-3"
                        >
                          <CheckCircle2 className="size-5 text-yellow-500" />

                          <p className="text-sm sm:text-base text-gray-700">
                            {rule}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section - Redemption Status */}
            <div className="lg:col-span-1 space-y-4 sm:space-y-5 md:space-y-6">
              <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200/50 shadow-md p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5 md:space-y-6">
                {/* Redemption Status Header */}
                <div>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4 sm:mb-5 md:mb-6">
                    Redemption Status
                  </h2>

                  {/* Timer Circle */}
                  <div className="flex justify-center mb-4 sm:mb-5 md:mb-6">
                    <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full border-4 sm:border-6 md:border-8 border-yellow-400 flex items-center justify-center bg-gray-50">
                      <div className="text-center">
                        <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
                          {timeLeft}
                        </div>
                        <div className="text-[10px] sm:text-xs md:text-sm text-gray-500 uppercase tracking-wide">
                          {isTimerActive ? "Time Left" : "Redeem Now"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="p-3 sm:p-4 bg-gray-50 rounded-lg text-center">
                    <p className="text-xs sm:text-sm text-gray-600">
                      Present this screen to the staff member at{" "}
                      <span className="font-semibold wrap-break-word">
                        {offer.place?.name}
                      </span>{" "}
                      to validate your redemption.
                    </p>
                  </div>
                </div>

                {/* Redeem Button */}
                <Button
                  onClick={handleRedeem}
                  disabled={isRedeeming || isTimerActive}
                  className="w-full bg-[#FFC107] hover:bg-[#FFB300] text-black font-bold rounded-lg px-6 sm:px-8 md:px-10 h-11 sm:h-12 md:h-14 text-sm sm:text-base shadow-lg shadow-yellow-500/20"
                >
                  {isRedeeming
                    ? "REDEEMING..."
                    : isTimerActive
                      ? "OFFER REDEEMED"
                      : "REDEEM OFFER"}
                </Button>

                {/* Offer Code */}
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <p className="text-[10px] sm:text-xs text-gray-500 uppercase">
                    Offer Code:
                  </p>
                  <code className="text-xs sm:text-sm break-all text-center">
                    {offer.offerCode}
                  </code>
                </div>

                {/* Help Section */}
                <div className="border rounded-lg bg-gray-100/50 border-gray-200 p-3 sm:p-4">
                  <div className="flex items-center justify-between">
                    <div className="">
                      <button className="w-full">
                        <div className="flex items-center gap-2">
                          <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                          <span className="text-sm sm:text-base font-medium text-gray-900">
                            Need help?
                          </span>
                        </div>
                      </button>
                      <p className="text-[10px] sm:text-xs text-gray-500 px-2 sm:px-3">
                        Contact support
                      </p>
                    </div>
                    <div className="">
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
