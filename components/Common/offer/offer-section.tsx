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
import Link from "next/link";

type Offer = {
  id: number;
  title: string;
  category: string;
  image: StaticImageData | string;
  discount: number;
};

const offers: Offer[] = [
  {
    id: 1,
    title: "Bella Cucina",
    category: "Restaurant",
    image: image1,
    discount: 15,
  },
  {
    id: 2,
    title: "Urban Threads",
    category: "Modern Boutique",
    image: image2,
    discount: 10,
  },
  {
    id: 3,
    title: "The Daily Grind",
    category: "Coffee & Bakery",
    image: image3,
    discount: 10,
  },
  {
    id: 4,
    title: "L’Escale",
    category: "French Fine Dining",
    image: image4,
    discount: 15,
  },
  {
    id: 5,
    title: "Prime Cut",
    category: "Premium Steakhouse",
    image: image5,
    discount: 15,
  },
  {
    id: 6,
    title: "Gourmet Garden",
    category: "Farm to Table",
    image: image6,
    discount: 15,
  },
];

export default function OfferSection() {
  const [favorites, setFavorites] = useState<number[]>([]);

  const filters = ["Near me", "Popular", "New", "Trending", "Favorites"];

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  return (
    <section className="bg-gray-50">
      <div className="max-w-360 mx-auto px-4 md:px-6 py-12">
        {/* Filters */}
        <div className="flex gap-3 flex-wrap mb-8">
          <Button className="bg-yellow-400 text-black hover:bg-yellow-500">
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filter
          </Button>

          {filters.map((filter) => (
            <Button key={filter} variant="outline" className="rounded-full">
              {filter}
            </Button>
          ))}
        </div>

        {/* Offer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => {
            const isFavorite = favorites.includes(offer.id);

            return (
              <Link href={`/offer/${offer.id}`}>
                <div
                  key={offer.id}
                  className="group rounded-xl overflow-hidden border bg-white hover:shadow-md transition"
                >
                  {/* Image */}
                  <div className="relative h-64 w-full">
                    <Image
                      src={offer.image}
                      alt={offer.title}
                      fill
                      className="object-cover"
                    />

                    {/* Favorite Button */}
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() => toggleFavorite(offer.id)}
                      className="absolute right-3 top-3 rounded-full"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isFavorite ? "fill-red-500 text-red-500" : ""
                        }`}
                      />
                    </Button>

                    {/* Discount Badge */}
                    <div className="absolute bottom-3 right-3 bg-red-500 text-white text-sm px-2 py-1 rounded-md">
                      {offer.discount}%
                    </div>
                  </div>

                  {/* Text */}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg">{offer.title}</h3>

                    <p className="text-sm text-gray-500">{offer.category}</p>
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
