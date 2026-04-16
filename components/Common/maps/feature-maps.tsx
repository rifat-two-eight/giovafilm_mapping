"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Heart } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useGetMapsQuery } from "@/redux/features/map/mapApi";
import { getImageUrl } from "@/lib/utils";

export const MAP_CARDS = [
  {
    id: 1,
    title: "Rome Historic Center Walking Tour",
    subtitle: "Professional Guide",
    price: "$9.99",
    image:
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 2,
    title: "Rome Historic Center Walking Tour",
    subtitle: "Professional Guide",
    price: "$9.99",
    image:
      "https://images.unsplash.com/photo-1772289935663-80aa987be656?q=80&w=1170",
  },
  {
    id: 3,
    title: "Rome Historic Center Walking Tour",
    subtitle: "Professional Guide",
    price: "$9.99",
    image:
      "https://images.unsplash.com/photo-1693707994429-95caaceab2a4?q=80&w=1074",
  },
  {
    id: 4,
    title: "Rome Historic Center Walking Tour",
    subtitle: "Professional Guide",
    price: "$9.99",
    image:
      "https://images.unsplash.com/photo-1772289935663-80aa987be656?q=80&w=1170",
  },
  {
    id: 5,
    title: "Rome Historic Center Walking Tour",
    subtitle: "Professional Guide",
    price: "$9.99",
    image:
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 6,
    title: "Rome Historic Center Walking Tour",
    subtitle: "Professional Guide",
    price: "$9.99",
    image:
      "https://images.unsplash.com/photo-1693707994429-95caaceab2a4?q=80&w=1074",
  },
];

export default function FeaturedMaps() {
  const { data: mapsRes, isLoading } = useGetMapsQuery({});
  const maps = mapsRes?.data || [];

  return (
    <div className="bg-gray-50 py-10 font-inter">
      <div className="max-w-360 mx-auto px-4 md:px-6">
        <div className="px- 4 md:px-6">
          <div className="flex justify-between items-center mb-5 mt-2">
            <div className="">
              <h2 className="text-3xl  font-bold leading-normal">
                Featured Maps
              </h2>
              <p className="text-gray-500/80">
                Explore the best walking tours curated by professionals.
              </p>
            </div>
            {/* <Link href="/catalog">
              <button className="text-black font-bold flex justify-between items-center bg-transparent border-none cursor-pointer">
                View All <ArrowRight className="ml-2" />
              </button>
            </Link> */}
          </div>

          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7`}
          >
            {isLoading ? (
              [1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-96 bg-gray-200 animate-pulse rounded-2xl"
                />
              ))
            ) : maps.length === 0 ? (
              <p className="col-span-full text-center text-gray-500 py-10">
                No featured maps found.
              </p>
            ) : (
              maps.map((map: any) => (
                <motion.div
                  key={map._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col cursor-pointer pb-2"
                >
                  {/* Image Container */}
                  <div className="relative h-64 mb-2">
                    <img
                      src={getImageUrl(map.images?.[0])}
                      alt={map.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <button className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm">
                      <Heart className="w-4 h-4 text-[#FFC107]" />
                    </button>
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
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
