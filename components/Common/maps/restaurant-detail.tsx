"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Star, Copy, HelpCircle } from "lucide-react";

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
  const offerId = params.id as string;
  const offer = OFFERS_DATA[offerId] || OFFERS_DATA["2"];
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(offer.timeLeft || "14:06");

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

  const handleCopyCode = () => {
    navigator.clipboard.writeText(offer.offerCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link
              href="/offers"
              className="text-blue-600 hover:underline font-medium"
            >
              Offers
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-700 font-medium">{offer.place}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Section - Image and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image with Rating */}
            <div className="relative rounded-2xl overflow-hidden h-96 bg-gray-200">
              <img
                src={offer.image}
                alt={offer.place}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              {/* Rating Badge */}
              <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-2 flex items-center gap-1 shadow-md">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-gray-900">
                  {offer.rating} ({offer.reviews} reviews)
                </span>
              </div>
            </div>

            {/* Restaurant Name and Discount */}
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h1 className="text-4xl font-bold text-gray-900">
                    {offer.place}
                  </h1>
                  <p className="text-gray-600 flex items-center gap-2">
                    <span>📍</span> {offer.location}
                  </p>
                </div>
                <div className="bg-yellow-100 text-gray-900 font-bold px-6 py-3 rounded-full text-xl">
                  {offer.discount} {offer.discountType}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <p className="text-gray-700 leading-relaxed">
                {offer.description}
              </p>
            </div>

            {/* Validity and Rules Section */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Validity Period */}
              <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Validity Period
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">📅</div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">FROM</p>
                      <p className="font-semibold text-gray-900">
                        {offer.validFrom}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">📅</div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">UNTIL</p>
                      <p className="font-semibold text-gray-900">
                        {offer.validUntil}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Redemption Rules */}
              <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Redemption Rules
                </h3>
                <div className="space-y-3">
                  {offer.redemptionRules.map((rule, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="text-yellow-500 text-lg mt-0.5">✓</div>
                      <p className="text-gray-700">{rule}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Redemption Status */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
              {/* Redemption Status Header */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Redemption Status
                </h2>

                {/* Timer Circle */}
                <div className="flex justify-center mb-6">
                  <div className="w-40 h-40 rounded-full border-8 border-yellow-400 flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-900">
                        {timeLeft}
                      </div>
                      <div className="text-sm text-gray-500 uppercase tracking-wide">
                        Time Left
                      </div>
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                <p className="text-sm text-gray-600 text-center mb-6">
                  Present this screen to the staff member at{" "}
                  <span className="font-semibold">{offer.place}</span> to
                  validate your redemption.
                </p>
              </div>

              {/* Redeem Button */}
              <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 text-base rounded-lg">
                REDEEM OFFER
              </Button>

              {/* Offer Code */}
              <div className="border-t border-gray-200 pt-6">
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">
                  Offer Code
                </p>
                <div className="flex items-center gap-3">
                  <code className="flex-1 bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm font-mono text-gray-900">
                    {offer.offerCode}
                  </code>
                  <button
                    onClick={handleCopyCode}
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                    aria-label="Copy code"
                  >
                    <Copy className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
                {copied && (
                  <p className="text-xs text-green-600 mt-2">
                    Copied to clipboard!
                  </p>
                )}
              </div>

              {/* Help Section */}
              <div className="border-t border-gray-200 pt-6">
                <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded transition-colors">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">
                      Need help?
                    </span>
                  </div>
                  <span className="text-gray-400">›</span>
                </button>
                <p className="text-xs text-gray-500 px-3">Contact support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
