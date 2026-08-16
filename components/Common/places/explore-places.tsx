"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetPlacesQuery } from "@/redux/features/place/placeApi";
import { useGetCategoriesQuery } from "@/redux/features/category/categoryApi";
import { useGetMapsQuery } from "@/redux/features/map/mapApi";
import { useGetProfileQuery } from "@/redux/features/user/userApi";
import Link from "next/link";
import {
  Flame,
  MapPin,
  Search,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { PlaceCard } from "./place-card";

const filters = [
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
  const { data: profile } = useGetProfileQuery({});
  const isPremium = profile && ["super_admin", "admin", "map_editor"].includes(profile.role);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(9);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [enterSearching, setEnterSearching] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const { data: categoriesResponse } = useGetCategoriesQuery({ limit: 100 });

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

  const { data: mapsResponse, isLoading: isLoadingMaps } = useGetMapsQuery({
    limit: 100,
  });
  const selectedMapObj = mapsResponse?.data?.find(
    (m: any) => m.name === selectedCountry
  );
  const mapIdFilter = selectedMapObj ? selectedMapObj._id : "";

  useEffect(() => {
    const saved = localStorage.getItem("selectedCountryFilter");
    if (saved) {
      setSelectedCountry(saved);
    }
  }, []);

  // Clear stale localStorage country that no longer exists in maps
  useEffect(() => {
    const maps = mapsResponse?.data;
    if (isLoadingMaps || !maps?.length || !selectedCountry) return;
    const exists = maps.some((m: any) => m.name === selectedCountry);
    if (!exists) {
      setSelectedCountry("");
      localStorage.removeItem("selectedCountryFilter");
    }
  }, [isLoadingMaps, mapsResponse, selectedCountry]);

  const { data: response, isLoading, isFetching } = useGetPlacesQuery({
    page,
    limit,
    searchTerm,
    sort: activeFilter && activeFilter !== "Near me" ? getSortValue(activeFilter) : "",
    map: selectedCountry ? mapIdFilter : "",
    category: selectedCategory,
    lat: activeFilter === "Near me" ? userLocation?.lat : undefined,
    lng: activeFilter === "Near me" ? userLocation?.lng : undefined,
  });

  const places = response?.data || [];
  const meta = response?.meta;
  const isWaitingForMapId =
    !!selectedCountry &&
    !mapIdFilter &&
    (isLoadingMaps ||
      !!mapsResponse?.data?.some((m: any) => m.name === selectedCountry));
  const isPlacesLoading =
    isLoading || (isFetching && !response) || isWaitingForMapId;

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(1);
    }, 400); // 400ms debounce delay

    return () => clearTimeout(delayDebounceFn);
  }, [searchInput]);

  const handleSearch = () => {
    setEnterSearching(true);
    setSearchTerm(searchInput);
    setActiveFilter(null);
    setPage(1);
  };

  useEffect(() => {
    if (!enterSearching) return;
    if (isFetching) return;
    const timer = setTimeout(() => setEnterSearching(false), 500);
    return () => clearTimeout(timer);
  }, [enterSearching, isFetching]);

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-360 mx-auto px-4 md:px-6">
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900 leading-14">
            Places
          </h1>
        </div>

        {/* Search */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 mb-6">
          <div className="relative flex-1">
            <div className="flex items-center gap-3 bg-white border rounded-lg px-2 shadow-sm">
              <Search className="text-gray-400 ml-2" size={20} />

              <Input
                placeholder="Search locations, parks, or beaches..."
                className="border-none h-12 focus-visible:ring-0 shadow-none text-base"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    setSearchFocused(false);
                    handleSearch();
                  }
                }}
              />
            </div>
            {searchFocused && searchInput.trim().length >= 2 && (
              <div className="absolute top-full z-40 mt-2 w-full overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl">
                {isFetching || searchInput !== searchTerm ? (
                  <div className="flex items-center justify-center gap-2 p-4 text-sm text-gray-500">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
                    Searching...
                  </div>
                ) : places.length > 0 ? (
                  <div className="max-h-64 overflow-y-auto">
                    {places.slice(0, 6).map((place: any) => (
                      <button
                        key={place._id}
                        type="button"
                        className="flex w-full flex-col items-start gap-0.5 border-b border-gray-50 px-4 py-3 text-left last:border-0 hover:bg-gray-50"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          setSearchInput(place.name);
                          setSearchTerm(place.name);
                          setEnterSearching(true);
                          setSearchFocused(false);
                          setPage(1);
                        }}
                      >
                        <span className="text-sm font-semibold text-gray-900">
                          {place.name}
                        </span>
                        {place.address && (
                          <span className="truncate text-xs text-gray-500">
                            {place.address}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-gray-500">
                    No matching places
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Country Filter Selector */}
          <select
            value={selectedCountry}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedCountry(val);
              if (val) {
                localStorage.setItem("selectedCountryFilter", val);
              } else {
                localStorage.removeItem("selectedCountryFilter");
              }
              setPage(1);
            }}
            className="h-12 px-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm bg-white font-semibold text-gray-700 cursor-pointer min-w-[200px] shadow-sm"
          >
            <option value="">All Countries</option>
            {mapsResponse?.data?.map((map: any) => (
              <option key={map._id} value={map.name}>
                {map.name}
              </option>
            ))}
          </select>

          <Button
            onClick={handleSearch}
            className="bg-yellow-400 hover:bg-yellow-500 text-black rounded-lg px-8 h-12 font-bold"
          >
            Search
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-8 flex-wrap items-center">
          {/* Categories Selector */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setPage(1);
            }}
            className="h-10 px-4 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm bg-white font-semibold text-gray-700 cursor-pointer shadow-sm hover:bg-gray-100 transition-colors"
          >
            <option value="">All Categories</option>
            {categoriesResponse?.data?.map((cat: any) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          {filters.map((filter) => {
            const Icon = filter.icon;
            const isActive = activeFilter === filter.label;

            return (
              <Button
                key={filter.label}
                variant={isActive ? "default" : "outline"}
                onClick={() => {
                  if (filter.label === "Near me") {
                    if (isActive) {
                      setActiveFilter(null);
                      setUserLocation(null);
                      setPage(1);
                      return;
                    }
                    if (!navigator.geolocation) {
                      toast.error("Geolocation is not supported by your browser");
                      return;
                    }
                    navigator.geolocation.getCurrentPosition(
                      (pos) => {
                        setUserLocation({
                          lat: pos.coords.latitude,
                          lng: pos.coords.longitude,
                        });
                        setActiveFilter("Near me");
                        setPage(1);
                      },
                      () => {
                        toast.error("Allow location access to use Near me");
                      },
                      { enableHighAccuracy: true, timeout: 10000 },
                    );
                    return;
                  }

                  setUserLocation(null);
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

        {/* Premium Upgrade Banner for Free Users / Guests */}
        {!isPremium && (
          <div className="mb-8 p-4 bg-gradient-to-r from-yellow-500/10 via-amber-500/10 to-yellow-500/10 border border-yellow-200/50 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm animate-in fade-in duration-300">
            <div className="flex items-center gap-3 text-left">
              <span className="text-2xl">✨</span>
              <div>
                <p className="font-extrabold text-gray-900 text-sm md:text-base">Unlock 100+ Standard Adventure Locations & Hidden Gems!</p>
                <p className="text-xs text-gray-500 font-medium">
                  {profile 
                    ? "Explore our curated catalog of custom travel maps to unlock full details and hidden spots."
                    : "Log in or browse the catalog to unlock full travel maps and exclusive local offers."}
                </p>
              </div>
            </div>
            <Link href={profile ? "/catalog" : "/login"}>
              <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-md transition-all whitespace-nowrap">
                {profile ? "Browse Maps" : "Log In to Unlock"}
              </Button>
            </Link>
          </div>
        )}

        {(isFetching || enterSearching) && (
          <p className="mb-4 flex items-center gap-2 text-sm font-medium text-gray-500">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
            Updating results...
          </p>
        )}

        {/* Places Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isPlacesLoading ? (
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
                  setUserLocation(null);
                  setSelectedCategory("");
                  setSelectedCountry("");
                  localStorage.removeItem("selectedCountryFilter");
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
        {meta && meta.totalPage > 1 && (() => {
          const total = meta.totalPage;
          
          // Generate professional pagination range
          const getPaginationRange = (current: number, totalPages: number) => {
            const delta = 1; // Number of pages to show around current page
            const range: (number | "dots")[] = [];

            for (let i = 1; i <= totalPages; i++) {
              if (
                i === 1 ||
                i === totalPages ||
                (i >= current - delta && i <= current + delta)
              ) {
                range.push(i);
              } else if (range[range.length - 1] !== "dots") {
                range.push("dots");
              }
            }
            return range;
          };

          const pages = getPaginationRange(page, total);

          return (
            <div className="flex flex-col items-center gap-6 mt-16">
              {/* Pagination buttons */}
              <div className="flex items-center gap-1.5 flex-wrap justify-center">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded-xl border-gray-200 h-10 w-10 hover:bg-gray-50 disabled:opacity-50 transition-all"
                >
                  <ChevronLeft size={16} className="text-gray-500" />
                </Button>

                {pages.map((p, idx) =>
                  p === "dots" ? (
                    <span
                      key={`dots-${idx}`}
                      className="flex items-center justify-center w-10 h-10 text-gray-400 font-medium select-none"
                    >
                      ...
                    </span>
                  ) : (
                    <Button
                      key={p}
                      onClick={() => setPage(p as number)}
                      className={`h-10 min-w-[40px] rounded-xl font-medium transition-all text-sm ${
                        page === p
                          ? "bg-[#3B82F6] text-white hover:bg-blue-600 shadow-sm border-[#3B82F6]"
                          : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                      }`}
                    >
                      {p}
                    </Button>
                  )
                )}

                <Button
                  variant="outline"
                  size="icon"
                  disabled={page === total}
                  onClick={() => setPage((p) => Math.min(total, p + 1))}
                  className="rounded-xl border-gray-200 h-10 w-10 hover:bg-gray-50 disabled:opacity-50 transition-all"
                >
                  <ChevronRight size={16} className="text-gray-500" />
                </Button>
              </div>

              {/* Status and dropdown limit selector */}
              <div className="w-full max-w-[500px] flex items-center justify-between mt-2 px-2 text-sm text-gray-700">
                {/* Result Info */}
                <div className="font-semibold text-gray-700 text-base">
                  Results: {(page - 1) * limit + 1} - {Math.min(page * limit, meta.total || 0)} of {meta.total || 0}
                </div>

                {/* Dropdown Limit Selector */}
                <div className="flex items-center gap-2">
                  <select
                    value={limit}
                    onChange={(e) => {
                      setLimit(Number(e.target.value));
                      setPage(1);
                    }}
                    className="bg-[#eef2f6] text-gray-700 font-semibold px-4 py-2 rounded-xl border-none focus:ring-2 focus:ring-blue-500 text-sm cursor-pointer appearance-none pr-8 relative bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%234B5563%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:0.65rem_auto] bg-[right_0.75rem_center] bg-no-repeat"
                  >
                    <option value={9}>9</option>
                    <option value={18}>18</option>
                    <option value={27}>27</option>
                    <option value={45}>45</option>
                  </select>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </section>
  );
}
