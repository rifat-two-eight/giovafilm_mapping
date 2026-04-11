"use client";

import Image, { StaticImageData } from "next/image";
import { useState } from "react";
import { Heart, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

import image1 from "@/public/offers-image/Bella Cucina.png";
import image2 from "@/public/offers-image/Urban Threads.png";
import image3 from "@/public/offers-image/The Daily Grind.png";
import image4 from "@/public/offers-image/L'Escale.png";
import image5 from "@/public/offers-image/Prime Cut.png";
import image6 from "@/public/offers-image/Gourmet Garden.png";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useGetOffersQuery } from "@/redux/features/offer/offerApi";
import { getImageUrl } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

type Offer = {
  id: number;
  title: string;
  category: string;
  image: StaticImageData | string;
  discount: number;
};

export default function OfferSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [favorites, setFavorites] = useState<string[]>([]);

  const { data: offersRes, isLoading } = useGetOffersQuery({});
  const offersData = offersRes?.data || [];

  const filters = ["All", "Near me", "Popular", "New", "Trending", "Favorites"];

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const filteredOffers = offersData.filter((offer: any) => {
    const matchesSearch = offer.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      activeFilter === "All" ||
      (activeFilter === "Favorites" && favorites.includes(offer._id)) ||
      (activeFilter !== "Favorites" && activeFilter !== "All"); // Others are placeholders for now

    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return (
      <section className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-360 mx-auto px-4 md:px-6">
          <div className="flex gap-4 mb-8">
            <Skeleton className="h-10 w-24 rounded-md" />
            <Skeleton className="h-10 w-24 rounded-full" />
            <Skeleton className="h-10 w-24 rounded-full" />
            <Skeleton className="h-10 w-24 rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-[400px] w-full rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-50">
      <div className="max-w-360 mx-auto px-4 md:px-6 py-12">
        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-8">
          <div className="flex gap-3 flex-wrap">
            <Button className="bg-yellow-400 text-black hover:bg-yellow-500">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filter
            </Button>

            {filters.map((filter) => (
              <Button
                key={filter}
                variant={activeFilter === filter ? "default" : "outline"}
                className={`rounded-full ${
                  activeFilter === filter
                    ? "bg-yellow-400 text-black hover:bg-yellow-500 border-none"
                    : ""
                }`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </Button>
            ))}
          </div>

          <div className="w-full md:w-80">
            <Input
              placeholder="Search offers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white"
            />
          </div>
        </div>

        {/* Offer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOffers.map((offer: any) => {
            const isFavorite = favorites.includes(offer._id);

            return (
              <Link key={offer._id} href={`/offer/${offer._id}`}>
                <div className="group rounded-xl overflow-hidden border bg-white hover:shadow-md transition">
                  {/* Image */}
                  <div className="relative h-64 w-full">
                    <Image
                      src={getImageUrl(offer.media?.[0])}
                      alt={offer.title}
                      fill
                      className="object-cover"
                    />

                    {/* Favorite Button */}
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleFavorite(offer._id);
                      }}
                      className="absolute right-3 top-3 rounded-full"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isFavorite ? "fill-red-500 text-red-500" : ""
                        }`}
                      />
                    </Button>

                    {/* Discount Badge */}
                    <div className="absolute bottom-3 right-3 bg-red-500 text-white text-sm px-2 py-1 rounded-md font-bold">
                      {offer.discountValue}
                      {offer.discountType === "Percentage" ? "%" : ""} OFF
                    </div>
                  </div>

                  {/* Text */}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg line-clamp-1">
                      {offer.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {offer.place?.name || "Multiple Locations"}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
