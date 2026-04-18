"use client";

import { useState, useMemo } from "react";
import { Search, MapPin, Map, Tag, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGetFavouritesQuery } from "@/redux/features/favourite/favouriteApi";
import { useAddToFavouriteMutation } from "@/redux/features/favourite/favouriteApi";
import { getImageUrl } from "@/lib/utils";
import { NoImage } from "@/lib/others/others";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";

const PAGE_SIZE = 10;

const TYPE_FILTERS = [
  { label: "All", value: "all" },
  { label: "Places", value: "Place", icon: MapPin },
  { label: "Maps", value: "Map", icon: Map },
  { label: "Offers", value: "Offer", icon: Tag },
];

export default function FavoritePlaces() {
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState("all");
  const [page, setPage] = useState(1);

  const { data: favouritesRes, isLoading } = useGetFavouritesQuery();
  const [addToFavourite, { isLoading: isRemoving }] = useAddToFavouriteMutation();

  const allFavourites: any[] = favouritesRes?.data || [];

  // --- Filter by type ---
  const byType = useMemo(
    () =>
      activeType === "all"
        ? allFavourites
        : allFavourites.filter((fav) => fav.type === activeType),
    [allFavourites, activeType],
  );

  // --- Filter by search (searches name of nested place/map/offer) ---
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return byType;
    return byType.filter((fav) => {
      const name =
        fav.place?.name || fav.map?.name || fav.offer?.title || "";
      return name.toLowerCase().includes(q);
    });
  }, [byType, search]);

  // --- Pagination ---
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Reset to page 1 when filter/search changes
  const handleTypeChange = (value: string) => {
    setActiveType(value);
    setPage(1);
  };
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  // Remove from favourite (POST acts as toggle on the backend)
  const handleRemove = async (fav: any) => {
    const key =
      fav.type === "Map" ? "map" : fav.type === "Offer" ? "offer" : "place";
    const refId =
      typeof fav[key] === "string" ? fav[key] : fav[key]?._id;
    if (!refId) return;
    try {
      await addToFavourite({ type: fav.type, [key]: refId }).unwrap();
      toast.success("Removed from favourites");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to remove");
    }
  };

  // Resolve display data from the favourite object
  const getItemData = (fav: any) => {
    if (fav.type === "Place" && fav.place) {
      return {
        name: fav.place.name,
        description: fav.place.description,
        image: fav.place.media?.[0],
        href: `/maps/${fav.place.id || fav.place._id}`,
        badge: "Place",
        badgeColor: "bg-blue-100 text-blue-700",
      };
    }
    if (fav.type === "Map" && fav.map) {
      return {
        name: fav.map.name,
        description: fav.map.description,
        image: fav.map.images?.[0],
        href: `/catalog/${fav.map._id}`,
        badge: "Map",
        badgeColor: "bg-yellow-100 text-yellow-700",
      };
    }
    if (fav.type === "Offer" && fav.offer) {
      return {
        name: fav.offer.title,
        description: fav.offer.description,
        image: fav.offer.photo,
        href: `/offer/${fav.offer._id}`,
        badge: "Offer",
        badgeColor: "bg-green-100 text-green-700",
      };
    }
    return null;
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Favourite Places</h1>

        {/* Search */}
        <div className="flex items-center border rounded-lg px-3 py-1 bg-white">
          <Search className="text-gray-400 w-4 h-4 mr-2" />
          <Input
            placeholder="Search favourites..."
            className="border-none focus-visible:ring-0 w-52"
            value={search}
            onChange={handleSearch}
          />
        </div>
      </div>

      {/* Type Filter Tabs */}
      <div className="flex gap-2 mb-7 flex-wrap">
        {TYPE_FILTERS.map(({ label, value, icon: Icon }) => (
          <button
            key={value}
            onClick={() => handleTypeChange(value)}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              activeType === value
                ? "bg-yellow-400 border-yellow-400 text-black"
                : "bg-white border-gray-200 text-gray-600 hover:border-yellow-400"
            }`}
          >
            {Icon && <Icon className="w-3.5 h-3.5" />}
            {label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-80 bg-gray-100 animate-pulse rounded-xl" />
          ))}
        </div>
      )}

      {/* Empty */}
      {!isLoading && filtered.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg font-medium">No favourites found</p>
          <p className="text-sm mt-1">Try a different filter or search term.</p>
        </div>
      )}

      {/* Grid */}
      {!isLoading && paginated.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6">
          {paginated.map((fav) => {
            const item = getItemData(fav);
            if (!item) return null;

            return (
              <div
                key={fav._id || fav.id}
                className="bg-white rounded-xl overflow-hidden border hover:shadow-md transition"
              >
                {/* Image */}
                <Link href={item.href}>
                  <div className="relative w-full h-52">
                    {item.image ? (
                      <Image
                        src={getImageUrl(item.image)}
                        alt={item.name || "Favourite"}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    ) : (
                      <NoImage />
                    )}

                    {/* Type Badge */}
                    <span
                      className={`absolute top-3 left-3 text-xs font-bold px-2 py-1 rounded-full ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  </div>
                </Link>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                    {item.description || "No description available."}
                  </p>

                  {/* Remove */}
                  <button
                    onClick={() => handleRemove(fav)}
                    disabled={isRemoving}
                    className="text-xs tracking-widest text-gray-400 mt-3 hover:text-red-500 transition-colors disabled:opacity-50"
                  >
                    REMOVE
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination — only shown when total items > PAGE_SIZE */}
      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Button
              key={p}
              variant={p === page ? "default" : "outline"}
              size="sm"
              onClick={() => setPage(p)}
              className={
                p === page
                  ? "bg-yellow-400 text-black border-yellow-400 hover:bg-yellow-500"
                  : ""
              }
            >
              {p}
            </Button>
          ))}

          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </section>
  );
}
