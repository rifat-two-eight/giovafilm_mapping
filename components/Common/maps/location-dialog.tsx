"use client";

import { Button } from "@/components/ui/button";
import { getImageUrl } from "@/lib/utils";
import { Heart, Star, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Marker = {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  type: string;
  image: string;
  description: string;
};

export default function LocationDialog({
  location,
  onClose,
}: {
  location: Marker;
  onClose: () => void;
}) {
  if (!location) return null;

  console.log("modal", location);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-4">
      <div className="bg-white rounded-[32px] overflow-hidden shadow-2xl w-full max-w-md pointer-events-auto relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-lg"
        >
          <X size={20} />
        </button>

        {/* Image */}
        <div className="h-48 overflow-hidden">
          <Image
            src={getImageUrl(location.image)}
            alt={location.name}
            width={500}
            height={500}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="p-8">
          <h2 className="text-2xl font-black mb-2">{location.name}</h2>

          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center text-sm font-bold">
              <Star size={14} className="fill-black mr-1" />
              {location.rating}
            </div>
            <span className="text-gray-400 text-sm">
              ({location.reviews} reviews) {location.type}
            </span>
          </div>

          <p className="text-sm text-gray-600 mb-8">{location.description}</p>

          <div className="flex gap-3">
            <Link href={`/maps/${location.id}`} className="flex-1">
              <Button className="w-full bg-[#FFC107] text-black font-bold rounded-xl h-12">
                View Details
              </Button>
            </Link>

            <Button variant="outline" className="w-12 h-12 rounded-xl">
              <Heart size={20} className="text-gray-400" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
