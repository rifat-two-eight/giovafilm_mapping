"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetPlacesQuery } from "@/redux/features/place/placeApi";
import {
  Flame,
  MapPin,
  Search,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { PlaceCard } from "./place-card";

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
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const getSortValue = (filterLabel: string) => {
    switch (filterLabel) {
      case "Popular":
        return "-totalReview";
      case "New":
        return "-createdAt";
      default:
        return "";
    }
  };

  const { data: response, isLoading } = useGetPlacesQuery({
    page,
    limit: 9,
    searchTerm,
    sort: activeFilter ? getSortValue(activeFilter) : "",
  });

  const places = response?.data || [];
  const meta = response?.meta;

  const handleSearch = () => {
    setSearchTerm(searchInput);
    setActiveFilter(null);
    setPage(1);
  };

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-360 mx-auto px-4 md:px-6">
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900 leading-14">
            Explore Places
          </h1>

          <p className="text-gray-500 mt-2 w-full max-w-2xl">
            Discover the most breathtaking hidden gems and popular destinations
            across Puerto Rico for your next road trip adventure.
          </p>
        </div>

        {/* Search */}
        <div className="flex items-center gap-3 bg-white border rounded-lg px-2 mb-6 shadow-sm">
          <Search className="text-gray-400 ml-2" size={20} />

          <Input
            placeholder="Search locations, parks, or beaches..."
            className="border-none h-12 focus-visible:ring-0 shadow-none text-base"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />

          <Button
            onClick={handleSearch}
            className="bg-yellow-400 hover:bg-yellow-500 text-black rounded-lg px-8 h-10 font-bold"
          >
            Search
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-8 flex-wrap">
          {filters.map((filter) => {
            const Icon = filter.icon;
            const isActive = activeFilter === filter.label;

            return (
              <Button
                key={filter.label}
                variant={isActive ? "default" : "outline"}
                onClick={() => {
                  setActiveFilter(isActive ? null : filter.label);
                  setPage(1);
                }}
                className={`rounded-full flex items-center gap-2 transition-all ${
                  isActive
                    ? "bg-yellow-400 text-black hover:bg-yellow-500 border-yellow-500 shadow-md"
                    : "hover:bg-gray-100"
                }`}
              >
                <Icon size={16} />
                {filter.label}
              </Button>
            );
          })}
        </div>

        {/* Places Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            [1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-80 bg-gray-200 animate-pulse rounded-xl"
              />
            ))
          ) : places.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
              <p className="text-xl font-semibold text-gray-400">
                No places found matching your search.
              </p>
              <Button
                variant="link"
                className="text-yellow-600 font-bold"
                onClick={() => {
                  setSearchInput("");
                  setSearchTerm("");
                  setActiveFilter(null);
                  setPage(1);
                }}
              >
                Clear all filters
              </Button>
            </div>
          ) : (
            places.map((place: any) => (
              <PlaceCard key={place._id} data={place} />
            ))
          )}
        </div>

        {/* Pagination */}
        {meta && meta.totalPage > 1 && (
          <div className="flex justify-center mt-12 gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-lg"
            >
              ‹
            </Button>

            {[...Array(meta.totalPage)].map((_, i) => (
              <Button
                key={i + 1}
                className={
                  page === i + 1
                    ? "bg-yellow-400 text-black font-bold hover:bg-yellow-500 rounded-lg shadow-sm"
                    : "bg-white text-gray-600 hover:bg-gray-100 rounded-lg border border-gray-200"
                }
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}

            <Button
              variant="outline"
              size="icon"
              disabled={page === meta.totalPage}
              onClick={() => setPage((p) => Math.min(meta.totalPage, p + 1))}
              className="rounded-lg"
            >
              ›
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
