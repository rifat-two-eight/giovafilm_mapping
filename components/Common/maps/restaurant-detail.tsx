"use client";

import { Button } from "@/components/ui/button";
import { ChevronRight, HelpCircle, Star } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface OfferData {
  id: string;
  title: string;
  place: string;
  location: string;
  discount: string;
  discountType: string;
  description: string;
  image: string;
  rating: number;
  reviews: number;
  validFrom: string;
  validUntil: string;
  redemptionRules: string[];
  offerCode: string;
  timeLeft?: string;
}

const OFFERS_DATA: Record<string, OfferData> = {
  "1": {
    id: "1",
    title: "20% off Coffee",
    place: "Cafe Mocha",
    location: "Downtown, City",
    discount: "20%",
    discountType: "OFF",
    description:
      "Enjoy a 20% discount on your entire bill when you visit us. Experience premium coffee with freshly roasted beans and artisan pastries in a cozy café setting.",
    image:
      "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&h=500&fit=crop",
    rating: 4.5,
    reviews: 87,
    validFrom: "Jan 15, 2024",
    validUntil: "Mar 15, 2026",
    redemptionRules: [
      "One redemption per user",
      "Valid for all days",
      "Cannot combine with other promotions",
    ],
    offerCode: "CAFE-MC-2024",
    timeLeft: "14:06",
  },
  "2": {
    id: "2",
    title: "10% OFF",
    place: "Gourmet Garden Bistro",
    location: "Old San Juan, Puerto Rico",
    discount: "10%",
    discountType: "OFF",
    description:
      "Enjoy a 10% discount on your entire bill when you dine with us. Experience the best of local ingredients in a beautiful garden setting, where modern culinary techniques meet traditional Puerto Rican flavors.",
    image:
      "https://images.unsplash.com/photo-1517457373614-b7152f800fd1?w=800&h=500&fit=crop",
    rating: 4.8,
    reviews: 120,
    validFrom: "Oct 01, 2023",
    validUntil: "Dec 31, 2023",
    redemptionRules: [
      "One redemption per user",
      "Valid for weekdays only (Mon-Fri)",
      "Cannot combine with other promotions",
    ],
    offerCode: "RDTR-Q6-1023",
    timeLeft: "14:06",
  },
  "3": {
    id: "3",
    title: "Free Dessert",
    place: "Bella Italia",
    location: "Historic District",
    discount: "Free item",
    discountType: "FREE",
    description:
      "Get a complimentary dessert with any main course purchase. Enjoy authentic Italian cuisine with house-made pasta and traditional recipes passed down through generations.",
    image:
      "https://images.unsplash.com/photo-1414235077418-8ea6b8f0c9f9?w=800&h=500&fit=crop",
    rating: 4.6,
    reviews: 203,
    validFrom: "Feb 01, 2024",
    validUntil: "Feb 28, 2026",
    redemptionRules: [
      "One redemption per user",
      "Valid for weekdays and weekends",
      "Cannot combine with other promotions",
    ],
    offerCode: "BELLA-IT-2024",
  },
};

export default function RestaurantDetail() {
  const params = useParams();
  const pathname = usePathname();
  const offerId = params.id as string;
  const offer = OFFERS_DATA[offerId] || OFFERS_DATA["2"];
  const [timeLeft, setTimeLeft] = useState(offer.timeLeft || "14:06");

  // Check if the current path is from /maps
  const isFromMaps = pathname?.startsWith("/maps");

  useEffect(() => {
    // Simulate countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const [minutes, seconds] = prev.split(":").map(Number);
        let totalSeconds = minutes * 60 + seconds - 1;

        if (totalSeconds < 0) {
          clearInterval(timer);
          return "00:00";
        }

        const newMinutes = Math.floor(totalSeconds / 60);
        const newSeconds = totalSeconds % 60;
        return `${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
                {offer.place}
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
                <img
                  src={offer.image}
                  alt={offer.place}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {/* Rating Badge */}
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white rounded-full px-2 py-1.5 sm:px-3 sm:py-2 flex items-center gap-1 shadow-md">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs sm:text-sm font-semibold text-gray-900">
                    {offer.rating} ({offer.reviews} reviews)
                  </span>
                </div>
              </div>

              <div className="space-y-4 sm:space-y-5 md:space-y-6 p-4 sm:p-5 md:p-6 pt-2 sm:pt-2 md:pt-2">
                {/* Restaurant Name and Discount */}
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                    <div className="space-y-1 sm:space-y-2">
                      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 break-words">
                        {offer.place}
                      </h1>
                      <p className="text-sm sm:text-base text-gray-600 flex items-center gap-2 break-words">
                        <span>📍</span> {offer.location}
                      </p>
                    </div>
                    <div className="bg-yellow-100 text-gray-900 font-bold px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full text-base sm:text-lg md:text-xl inline-block w-fit">
                      {offer.discount} {offer.discountType}
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
                          <p className="text-sm sm:text-base font-semibold text-gray-900 break-words">
                            {offer.validFrom}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="text-xl sm:text-2xl">📅</div>
                        <div>
                          <p className="text-[10px] sm:text-xs text-gray-500 uppercase">
                            UNTIL
                          </p>
                          <p className="text-sm sm:text-base font-semibold text-gray-900 break-words">
                            {offer.validUntil}
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
                      {offer.redemptionRules.map((rule, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 sm:gap-3"
                        >
                          <div className="text-yellow-500 text-base sm:text-lg mt-0.5">
                            ✓
                          </div>
                          <p className="text-xs sm:text-sm text-gray-700 break-words">
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
                          Time Left
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="p-3 sm:p-4 bg-gray-50 rounded-lg text-center">
                    <p className="text-xs sm:text-sm text-gray-600">
                      Present this screen to the staff member at{" "}
                      <span className="font-semibold break-words">
                        {offer.place}
                      </span>{" "}
                      to validate your redemption.
                    </p>
                  </div>
                </div>

                {/* Redeem Button */}
                <Button className="w-full bg-[#FFC107] hover:bg-[#FFB300] text-black font-bold rounded-lg px-6 sm:px-8 md:px-10 h-11 sm:h-12 md:h-14 text-sm sm:text-base shadow-lg shadow-yellow-500/20">
                  REDEEM OFFER
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
