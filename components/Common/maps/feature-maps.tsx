"use client";

import { FavouriteButton } from "@/components/shared/favourite-button";
import { Button } from "@/components/ui/button";
import { getImageUrl } from "@/lib/utils";
import { useGetMapsQuery } from "@/redux/features/map/mapApi";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

export default function FeaturedMaps() {
  const { data: mapsRes, isLoading } = useGetMapsQuery({});
  const maps = mapsRes?.data || [];

  console.log(mapsRes);

  const featuredMaps = maps.filter((map: any) => map.isActive);

  return (
    <div className="bg-gray-50 py-10 font-inter">
      <div className="mx-auto px-4 md:px-6" style={{ maxWidth: "1300px" }}>
        <div className="px- 4 md:px-6">
          <div className="flex justify-between items-center mb-5 mt-2">
            <div className="">
              <h2 className="text-3xl font-bold leading-normal">
                Featured Maps
              </h2>
              <p className="text-gray-500/80">
                Explore the best walking tours curated by professionals.
              </p>
            </div>
          </div>

          {/* <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7`}
          >
            {isLoading ? (
              [1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-96 bg-gray-200 animate-pulse rounded-2xl"
                />
              ))
            ) : featuredMaps.length === 0 ? (
              <p className="col-span-full text-center text-gray-500 py-10">
                No featured maps found.
              </p>
            ) : (
              featuredMaps.map((map: any) => {
                return (
                  <motion.div
                    key={map._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col cursor-pointer pb-2"
                  >
                    <div className="relative h-64 mb-2">
                      <Image
                        src={getImageUrl(map.images?.[0])}
                        alt={map.name}
                        unoptimized
                        width={500}
                        height={500}
                        className="w-full h-full object-bottom"
                        referrerPolicy="no-referrer"
                      />

                      <div className="absolute top-2 right-2">
                        <FavouriteButton
                          placeId={map._id}
                          type="Map"
                          Style="w-8 h-8 p-0 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm transition-transform hover:scale-110 border-none"
                        />
                      </div>
                    </div>

                    <div className="p-3 flex flex-col flex-1">
                      <h3 className="text-lg font-bold text-[#1A1A1A] leading-tight mb-1 line-clamp-2">
                        {map.name}
                      </h3>
                      <p className="text-sm text-[#9E9E9E] mb-2 line-clamp-2">
                        {map.description ||
                          "Explore the best of the city with this curated guide."}
                      </p>
                      <div className="mt-auto">
                        <span className="text-xl font-bold text-[#1A1A1A] block mb-2">
                          ${map.price || "0.00"}
                        </span>
                        <Link href={`/catalog/${map._id}`}>
                          <Button className="w-full text-black py-6 px-13.5 text-lg bg-primary/80 hover:bg-primary font-bold rounded-lg transition-colors shadow-sm cursor-pointer border-none">
                            Buy Now
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div> */}

          {/* <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7 mt-10`}
          >
            {isLoading ? (
              [1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-96 bg-gray-200 animate-pulse rounded-2xl"
                />
              ))
            ) : featuredMaps.length === 0 ? (
              <p className="col-span-full text-center text-gray-500 py-10">
                No featured maps found.
              </p>
            ) : (
              featuredMaps.map((map: any) => {
                return (
                  <motion.div
                    key={map._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col cursor-pointer pb-2"
                  >
                    <div className="relative h-64 mb-2">
                      <Image
                        src={getImageUrl(map.images?.[0])}
                        alt={map.name}
                        unoptimized
                        width={500}
                        height={500}
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />

                      <div className="absolute top-2 right-2">
                        <FavouriteButton
                          placeId={map._id}
                          type="Map"
                          Style="w-8 h-8 p-0 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm transition-transform hover:scale-110 border-none"
                        />
                      </div>
                    </div>

                    <div className="p-3 flex flex-col flex-1">
                      <h3 className="text-lg font-bold text-[#1A1A1A] leading-tight mb-1 line-clamp-2">
                        {map.name}
                      </h3>
                      <p className="text-sm text-[#9E9E9E] mb-2 line-clamp-2">
                        {map.description ||
                          "Explore the best of the city with this curated guide."}
                      </p>
                      <div className="mt-auto">
                        <span className="text-xl font-bold text-[#1A1A1A] block mb-2">
                          ${map.price || "0.00"}
                        </span>
                        <Link href={`/catalog/${map._id}`}>
                          <Button className="w-full text-black py-6 px-13.5 text-lg bg-primary/80 hover:bg-primary font-bold rounded-lg transition-colors shadow-sm cursor-pointer border-none">
                            Buy Now
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div> */}

          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 mt-10`}
          >
            {isLoading ? (
              [1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-96 bg-gray-200 animate-pulse rounded-2xl"
                />
              ))
            ) : featuredMaps.length === 0 ? (
              <p className="col-span-full text-center text-gray-500 py-10">
                No featured maps found.
              </p>
            ) : (
              featuredMaps.map((map: any) => {
                return (
                  <motion.div
                    key={map._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col cursor-pointer pb-2"
                  >
                    {/* Image Container */}
                    <div className="relative h-96 w-96 mb-2 overflow-hidden">
                      <Image
                        src={getImageUrl(map.images?.[0])}
                        alt={map.name}
                        unoptimized
                        width={500}
                        height={500}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />

                      <div className="absolute top-2 right-2">
                        <FavouriteButton
                          placeId={map._id}
                          type="Map"
                          Style="w-8 h-8 p-0 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm transition-transform hover:scale-110 border-none"
                        />
                      </div>
                    </div>

                    {/* Card Details */}
                    <div className="p-3 flex flex-col flex-1">
                      <h3 className="text-lg font-bold text-[#1A1A1A] leading-tight mb-1 line-clamp-2">
                        {map.name}
                      </h3>
                      <p className="text-sm text-[#9E9E9E] mb-2 line-clamp-2">
                        {map.description ||
                          "Explore the best of the city with this curated guide."}
                      </p>
                      <div className="mt-auto">
                        <span className="text-xl font-bold text-[#1A1A1A] block mb-2">
                          ${map.price || "0.00"}
                        </span>
                        <Link href={`/catalog/${map._id}`}>
                          <Button className="w-full text-black py-6 px-13.5 text-lg bg-primary/80 hover:bg-primary font-bold rounded-lg transition-colors shadow-sm cursor-pointer border-none">
                            Buy Now
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
