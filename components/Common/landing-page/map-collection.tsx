"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { getImageUrl } from "@/lib/utils";
import { useGetMapsQuery } from "@/redux/features/map/mapApi";
import Link from "next/link";

export default function MapCollection() {
  const { data: mapsRes, isLoading } = useGetMapsQuery({});
  const mapsData = mapsRes?.data || [];

  console.log(mapsData);

  return (
    <section className="max-w-360 mx-auto px-4 md:px-6 py-16 space-y-10">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold">Explore Our Map Collection</h2>
          <p className="text-muted-foreground mt-2">
            Curated by experts and updated daily.
          </p>
        </div>

        <Link href={"/catalog"}>
          <button className="text-sm font-medium border-b-2 border-yellow-500 cursor-pointer">
            View Full Catalog
          </button>
        </Link>
      </div>

      {/* Carousel */}
      <Carousel
        className="w-full"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent>
          {isLoading ? (
            [1, 2, 3].map((i) => (
              <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3">
                <div className="h-105 bg-gray-200 animate-pulse rounded-3xl" />
              </CarouselItem>
            ))
          ) : mapsData.length === 0 ? (
            <div className="w-full text-center py-10 text-muted-foreground">
              No maps found
            </div>
          ) : (
            mapsData.map((map: any, index: number) => (
              <CarouselItem
                key={map._id || index}
                className="md:basis-1/2 lg:basis-1/3"
              >
                <Link href={`/catalog/${map._id}`}>
                  <div className="relative rounded-3xl overflow-hidden group cursor-pointer h-full">
                    {/* Image */}
                    <img
                      src={getImageUrl(map.images?.[0])}
                      alt={map.name}
                      className="w-full h-105 object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />

                    {/* Dark gradient */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent pointer-events-none" />

                    {/* Price */}
                    <div className="absolute top-4 right-4 bg-yellow-400 text-black text-xs font-semibold px-3 py-1 rounded-full">
                      ${map.price || "0.00"}
                    </div>

                    {/* Text */}
                    <div className="absolute bottom-6 left-6 right-6 text-white pointer-events-none">
                      <h3 className="text-xl font-semibold mb-1 line-clamp-1">
                        {map.name}
                      </h3>

                      <p className="text-sm text-white/80 line-clamp-2">
                        {map.places?.length} spots •{" "}
                        {map.description ||
                          "Explore the best of the city with this curated guide."}
                      </p>
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            ))
          )}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
