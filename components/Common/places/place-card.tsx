"use client";

import { NoImage } from "@/lib/others/others";
import { TPlace } from "@/lib/types/place/place";
import { getImageUrl } from "@/lib/utils";
import { MapPin, Star, Lock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import Swal from "sweetalert2";

export function PlaceCard({ data }: { data: TPlace }) {
  console.log(data);

  const handleClick = (e: React.MouseEvent) => {
    if (data?.isLocked) {
      e.preventDefault();
      const mapId = data?.map 
        ? (typeof data.map === 'object' ? (data.map._id || data.map.id) : data.map)
        : null;
      
      Swal.fire({
        title: "<strong>Unlock Premium Place</strong>",
        html: `
          <div class="flex flex-col items-center text-center space-y-3 font-inter">
            <p class="text-gray-500 text-sm">
              This beautiful location and its details are locked. Purchase the map to unlock directions, photos, and local insights.
            </p>
          </div>
        `,
        icon: "info",
        iconColor: "#FFC107",
        showCancelButton: true,
        confirmButtonText: "Unlock Map",
        cancelButtonText: "Maybe Later",
        customClass: {
          popup: "rounded-3xl p-6",
          confirmButton: "bg-[#FFC107] hover:bg-[#FFB300] text-black font-bold px-6 py-3.5 rounded-xl border-none cursor-pointer focus:outline-none focus:ring-0 w-full sm:w-auto font-inter text-sm",
          cancelButton: "bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-6 py-3.5 rounded-xl border-none cursor-pointer focus:outline-none focus:ring-0 ml-3 w-full sm:w-auto font-inter text-sm"
        },
        buttonsStyling: false,
        background: "#ffffff",
        color: "#1f2937",
      }).then((result) => {
        if (result.isConfirmed) {
          if (mapId) {
            window.location.href = `/catalog/${mapId}`;
          } else {
            window.location.href = "/catalog";
          }
        }
      });
    }
  };

  return (
    <Link href={`/places/${data?._id || data?.id}`} onClick={handleClick}>
      <div className="rounded-xl overflow-hidden bg-white border hover:shadow-lg transition">
        {/* Image Section */}
        <div className="relative h-64 w-full">
          {data?.media?.length > 0 ? (
            <Image
              src={getImageUrl(data?.media[0])}
              alt={data?.name}
              unoptimized
              fill
              className="w-full h-full object-cover hover:scale-105 transition-all"
            />
          ) : (
            <NoImage />
          )}

          {/* Rating Badge */}
          <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full flex items-center gap-1 text-sm font-medium shadow">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            {parseFloat(data?.rating?.toFixed(1))}
          </div>

          {/* Lock Badge */}
          {data?.isLocked && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-2.5 py-1 rounded-full flex items-center gap-1.5 text-xs font-bold shadow-lg">
              <Lock className="w-3.5 h-3.5" />
              LOCKED
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-lg">{data?.name}</h3>

          <div className="flex items-center text-gray-500 text-sm mt-1 gap-1">
            <MapPin size={14} />
            {data?.address}
          </div>

          <p className="text-gray-400 text-sm mt-1">
            {data?.totalReview} Reviews • {data?.category?.name}
          </p>
        </div>
      </div>
    </Link>
  );
}
