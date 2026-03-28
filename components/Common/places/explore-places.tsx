"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Search, SlidersHorizontal } from "lucide-react";
import { PlaceCard, PlaceCardProps } from "./place-card";

import image1 from "@/public/favorite-places/favorite-places (1).png";
import image2 from "@/public/favorite-places/favorite-places (2).png";
import image3 from "@/public/favorite-places/favorite-places (3).png";
import image4 from "@/public/favorite-places/favorite-places (4).png";

const places: PlaceCardProps[] = [
  {
    id: 1,
    title: "Playa Flamingo",
    location: "Culebra, PR",
    reviews: 120,
    category: "Beach & Snorkeling",
    rating: 4.9,
    image: image2,
  },
  {
    id: 2,
    title: "El Yunque Forest",
    location: "Rio Grande, PR",
    reviews: 250,
    category: "Hiking & Nature",
    rating: 4.8,
    image: image1,
  },
  {
    id: 3,
    title: "Old San Juan",
    location: "San Juan, PR",
    reviews: 500,
    category: "History & Architecture",
    rating: 4.7,
    image: image3,
  },
  {
    id: 4,
    title: "Cueva Ventana",
    location: "Arecibo, PR",
    reviews: 180,
    category: "Adventure & Caves",
    rating: 4.6,
    image: image4,
  },
  {
    id: 5,
    title: "Río Camuy",
    location: "Camuy, PR",
    reviews: 90,
    category: "Exploration & Cave River",
    rating: 4.5,
    image: image1,
  },
  {
    id: 6,
    title: "La Parrilla",
    location: "Luquillo, PR",
    reviews: 310,
    category: "Local Food & Dining",
    rating: 4.4,
    image: image2,
  },
];

import { Flame, Sparkles } from "lucide-react";

const filters = [
  {
    label: "Filter",
    icon: SlidersHorizontal,
  },
  {
    label: "Near me",
    icon: MapPin,
  },
  {
    label: "Popular",
    icon: Flame,
  },
  {
    label: "New",
    icon: Sparkles,
  },
];

export default function ExplorePlaces() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-360 mx-auto px-4 md:px-6">
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900 leading-14">
            Explore Places
          </h1>

          <p className="text-gray-500 mt-2 w-167.5">
            Discover the most breathtaking hidden gems and popular destinations
            across Puerto Rico for your next road trip adventure.
          </p>
        </div>

        {/* Search */}
        <div className="flex items-center gap-3 bg-white border rounded-lg  px-2 mb-6">
          <Search className="text-gray-400 ml-2" />

          <Input
            placeholder="Search locations, parks, or beaches in Puerto Rico..."
            className="border-none  h-12 focus-visible:ring-0 shadow-none"
          />

          <Button className="bg-yellow-400 hover:bg-yellow-500 text-black rounded-full px-6">
            Search
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-8 flex-wrap">
          {/* Dynamic Filters */}
          {filters.map((filter) => {
            const Icon = filter.icon;

            return (
              <Button
                key={filter.label}
                variant="outline"
                className="rounded-full flex items-center gap-2"
              >
                <Icon size={16} />
                {filter.label}
              </Button>
            );
          })}
        </div>

        {/* Places Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {places.map((place) => (
            <PlaceCard key={place?.id} data={place} />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-10 gap-2">
          <Button variant="outline" size="icon">
            ‹
          </Button>

          <Button className="bg-yellow-400 text-black">1</Button>

          <Button variant="outline">2</Button>
          <Button variant="outline">3</Button>

          <span className="flex items-center px-2">...</span>

          <Button variant="outline">12</Button>

          <Button variant="outline" size="icon">
            ›
          </Button>
        </div>
      </div>
    </section>
  );
}
