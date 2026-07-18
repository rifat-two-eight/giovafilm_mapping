import { NoImage } from "@/lib/others/others";
import { TPlace } from "@/lib/types/place/place";
import { getImageUrl } from "@/lib/utils";
import { MapPin, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function PlaceCard({ data }: { data: TPlace }) {
  console.log(data);
  return (
    <Link href={`/places/${data?._id || data?.id}`}>
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
