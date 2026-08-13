"use client";

import { Button } from "@/components/ui/button";
import Image, { StaticImageData } from "next/image";
import { useState } from "react";

import { FavouriteButton } from "@/components/shared/favourite-button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { formatOfferDiscountLabel } from "@/lib/offer-label";
import { getImageUrl } from "@/lib/utils";
import { useGetFavouritesQuery } from "@/redux/features/favourite/favouriteApi";
import { useGetOffersQuery } from "@/redux/features/offer/offerApi";
import Link from "next/link";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import Swal from "sweetalert2";

export default function OfferSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");



  const { data: offersRes, isLoading } = useGetOffersQuery({});
  const offersData = offersRes?.data || [];

  // Fetch the user's full favourites list — persists across reloads
  const { data: favouritesRes } = useGetFavouritesQuery();
  const favouritesList: any[] = favouritesRes?.data || [];

  // Only filters that are actually implemented
  const filters = ["All", "Favorites"];

  // Derive if an offer is favourited from the server list
  const isOfferFavourited = (offerId: string) =>
    favouritesList.some(
      (fav: any) =>
        fav.type === "Offer" &&
        (typeof fav.offer === "string" ? fav.offer : fav.offer?._id) ===
        offerId,
    );

  const filteredOffers = offersData.filter((offer: any) => {
    const matchesSearch = offer.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      activeFilter === "All" ||
      (activeFilter === "Favorites" && isOfferFavourited(offer._id));

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
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center mb-8">
          <div className="flex gap-3 flex-wrap">
            {/* <Button className="text-black ">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filter
            </Button> */}

            {filters.map((filter) => (
              <Button
                key={filter}
                variant={activeFilter === filter ? "default" : "outline"}
                className={`rounded-full ${activeFilter === filter
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
        {filteredOffers.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-xl font-semibold text-gray-400">
              No offers available
            </p>
            <p className="mt-2 text-sm text-gray-500">
              {searchTerm
                ? "Try a different search term."
                : "Check back later for new deals."}
            </p>
          </div>
        ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOffers.map((offer: any) => {
            const favourited = isOfferFavourited(offer._id);

            // Handle case where offer.place is an object
            const placeId = (offer.place && typeof offer.place === 'object') ? offer.place._id : (offer.place || null);

            const handleOfferClick = (e: React.MouseEvent) => {
              if (offer.isLocked) {
                e.preventDefault();
                const mapId = offer.map
                  ? (typeof offer.map === 'object' ? (offer.map._id || offer.map.id) : offer.map)
                  : (offer.place && typeof offer.place === 'object' && offer.place.map)
                    ? (typeof offer.place.map === 'object' ? (offer.place.map._id || offer.place.map.id) : offer.place.map)
                    : (offer.business && typeof offer.business === 'object' && offer.business.map)
                      ? (typeof offer.business.map === 'object' ? (offer.business.map._id || offer.business.map.id) : offer.business.map)
                      : null;

                Swal.fire({
                  title: "<strong>Unlock Premium Offer</strong>",
                  html: `
                    <div class="flex flex-col items-center text-center space-y-3">
                      <p class="text-gray-500 text-sm">
                        This exclusive offer and its local benefits are locked. Purchase the curated map to unlock lifetime access to all spots and deals.
                      </p>
                    </div>
                  `,
                  icon: "info",
                  iconColor: "#FFC107",
                  showCancelButton: true,
                  confirmButtonText: "Unlock Map",
                  cancelButtonText: "Maybe Later",
                  customClass: {
                    popup: "rounded-3xl p-6",
                    confirmButton: "bg-[#FFC107] hover:bg-[#FFB300] text-black font-bold px-6 py-3.5 rounded-xl border-none cursor-pointer focus:outline-none focus:ring-0 w-full sm:w-auto font-inter text-sm",
                    cancelButton: "bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-6 py-3.5 rounded-xl border-none cursor-pointer focus:outline-none focus:ring-0 ml-3 w-full sm:w-auto font-inter text-sm"
                  },
                  buttonsStyling: false,
                  background: "#ffffff",
                  color: "#1f2937",
                }).then((result) => {
                  if (result.isConfirmed) {
                    if (mapId) {
                      window.location.href = `/catalog/${mapId}`;
                    } else {
                      window.location.href = "/catalog";
                    }
                  }
                });
              }
            };

            // Build the href: business page → place page → offer page as fallback
            const businessId = offer.business?._id || (typeof offer.business === 'string' ? offer.business : null);
            const offerPlaceId = placeId;
            const offerHref = businessId
              ? `/maps/${businessId}?type=business`
              : offerPlaceId
                ? `/maps/${offerPlaceId}?type=place`
                : `/offer/${offer?._id}`;

            return (
              <Link
                key={offer._id}
                href={offerHref}
                onClick={handleOfferClick}
              >
                <div className="group rounded-xl overflow-hidden border bg-white hover:shadow-md transition">
                  {/* Image */}
                  <div className="relative h-72 w-full">
                    <Image
                      src={getImageUrl(offer?.images || offer?.photo || offer?.photos)}
                      alt={offer.title}
                      width={500}
                      height={500}
                      unoptimized
                      className="object-cover h-72 w-full hover:scale-105 transition-all"
                    />

                    {/* Favorite Button */}
                    <div className="absolute right-3 top-3">
                      <FavouriteButton
                        placeId={offer._id}
                        type="Offer"
                        Style="rounded-full w-10 h-10 border-none bg-secondary hover:bg-secondary/80 p-0 shadow-sm"
                      />
                    </div>

                    {/* Lock Badge */}
                    {offer.isLocked && (
                      <div className="absolute left-3 top-3 bg-red-500 text-white px-2.5 py-1 rounded-full flex items-center gap-1.5 text-xs font-bold shadow-lg">
                        <Lock className="w-3.5 h-3.5" />
                        LOCKED
                      </div>
                    )}

                    {/* Discount Badge */}
                    <div className="absolute bottom-3 right-3 bg-red-500 text-white text-sm px-2 py-1 rounded-md font-bold max-w-[70%] text-right leading-tight">
                      {formatOfferDiscountLabel(offer)}
                    </div>
                  </div>

                  {/* Text */}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg line-clamp-1">
                      {offer.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {offer.business?.name || offer.place?.name || "Multiple Locations"}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        )}
      </div>
    </section>
  );
}
