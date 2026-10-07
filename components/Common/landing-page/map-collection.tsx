"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getImageUrl } from "@/lib/utils";
import { useGetMapsQuery } from "@/redux/features/map/mapApi";
import Link from "next/link";
import { motion } from "motion/react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function MapCollection() {
  const { t } = useLanguage();
  const { data: mapsRes, isLoading } = useGetMapsQuery({});
  const mapsData = mapsRes?.data || [];

  return (
    <section className="max-w-360 mx-auto px-4 md:px-6 py-16 sm:py-20 lg:py-24 space-y-8 sm:space-y-10 overflow-hidden font-inter">
      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h2 className="text-3xl sm:text-4xl lg:text-4.5xl font-bold text-gray-900 tracking-tight leading-tight">
            {t("landing.collection_title")}
          </h2>
          <p className="text-gray-500 text-sm sm:text-base mt-1.5 max-w-xl leading-relaxed">
            {t("landing.collection_subtitle")}
          </p>
        </div>

        <Link href={"/catalog"} className="self-start sm:self-auto shrink-0">
          <motion.button
            className="text-sm font-semibold border-b-2 border-yellow-500 text-gray-900 hover:text-black cursor-pointer pb-0.5"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t("landing.view_full_catalog")} →
          </motion.button>
        </Link>
      </motion.div>

      {/* Carousel Container */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Carousel
          className="w-full"
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent className="-ml-3 md:-ml-4">
            {isLoading ? (
              [1, 2, 3].map((i) => (
                <CarouselItem
                  key={i}
                  className="pl-3 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                >
                  <div className="h-80 sm:h-96 md:h-105 bg-gray-200 animate-pulse rounded-3xl" />
                </CarouselItem>
              ))
            ) : mapsData.length === 0 ? (
              <div className="w-full text-center py-12 text-gray-500 font-medium">
                {t("landing.no_maps")}
              </div>
            ) : (
              mapsData.map((map: any, index: number) => (
                <CarouselItem
                  key={map._id || index}
                  className="pl-3 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                >
                  <Link href={`/catalog/${map._id}`} className="block h-full">
                    <div className="relative rounded-3xl overflow-hidden group cursor-pointer h-full border border-gray-100 shadow-xs hover:shadow-xl transition-all duration-300">
                      {/* Image */}
                      <img
                        src={getImageUrl(map.images?.[0])}
                        alt={map.name}
                        className="w-full h-80 sm:h-96 md:h-105 object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />

                      {/* Dark gradient */}
                      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

                      {/* Price Badge */}
                      <div className="absolute top-4 right-4 bg-yellow-400 text-black text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                        ${map.price || "0.00"}
                      </div>

                      {/* Text details */}
                      <div className="absolute bottom-5 left-5 right-5 text-white pointer-events-none space-y-1">
                        <h3 className="text-lg sm:text-xl font-bold line-clamp-1 group-hover:text-yellow-300 transition-colors">
                          {map.name}
                        </h3>

                        <p className="text-xs sm:text-sm text-gray-200 line-clamp-2 leading-relaxed">
                          <span className="font-semibold text-yellow-400">
                            {map.placeCount ?? 0} {t("landing.spots")}
                          </span>{" "}
                          • {map.description || t("landing.default_map_desc")}
                        </p>
                      </div>
                    </div>
                  </Link>
                </CarouselItem>
              ))
            )}
          </CarouselContent>

          {/* Controls for Desktop / Tablet */}
          {mapsData.length > 3 && (
            <div className="hidden md:flex justify-end gap-2 mt-4">
              <CarouselPrevious className="static translate-y-0 hover:bg-yellow-400 hover:text-black border-gray-200" />
              <CarouselNext className="static translate-y-0 hover:bg-yellow-400 hover:text-black border-gray-200" />
            </div>
          )}
        </Carousel>
      </motion.div>
    </section>
  );
}
