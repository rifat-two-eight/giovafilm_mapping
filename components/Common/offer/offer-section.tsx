"use client";

import { Button } from "@/components/ui/button";
import Image, { StaticImageData } from "next/image";
import { useState } from "react";

import { FavouriteButton } from "@/components/shared/favourite-button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getImageUrl } from "@/lib/utils";
import { useGetFavouritesQuery } from "@/redux/features/favourite/favouriteApi";
import { useGetOffersQuery } from "@/redux/features/offer/offerApi";
import { useGetProfileQuery } from "@/redux/features/user/userApi";
import Link from "next/link";

export default function OfferSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const { data: profile } = useGetProfileQuery({});
  const isPremium = profile && (
    ["super_admin", "admin", "map_editor"].includes(profile.role) ||
    ["active", "trialing"].includes(profile.subscriptionStatus)
  );

  const { data: offersRes, isLoading } = useGetOffersQuery({});
  const offersData = offersRes?.data || [];
  console.log(offersData);

  // Fetch the user's full favourites list — persists across reloads
  const { data: favouritesRes } = useGetFavouritesQuery();
  const favouritesList: any[] = favouritesRes?.data || [];

  const filters = ["All", "Near me", "Popular", "New", "Trending"];

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
      (activeFilter === "Favorites" && isOfferFavourited(offer._id)) ||
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
  if (!isPremium) {
    return (
      <section className="bg-gray-50 min-h-[80vh] flex items-center justify-center py-20 font-sans">
        <div className="max-w-md w-full mx-auto px-6 text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 text-yellow-600 rounded-full animate-bounce">
            <span className="text-4xl">🎁</span>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Exclusive Offers</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Unlock special discounts, deals, and coupon codes from local businesses and premium hotspots across Puerto Rico.
            </p>
          </div>
          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-left">
              <span className="text-xl">⭐</span>
              <div>
                <p className="font-bold text-gray-800 text-sm">Premium Feature</p>
                <p className="text-xs text-gray-400">
                  {profile ? "This feature is reserved for Paid members only." : "Log in to upgrade and unlock exclusive deals."}
                </p>
              </div>
            </div>
            <Link href={profile ? "/pricing" : "/login"} className="block">
              <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-extrabold py-5 rounded-xl transition-all">
                {profile ? "Upgrade to Premium" : "Log In to Unlock"}
              </Button>
            </Link>
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
            const favourited = isOfferFavourited(offer._id);
            console.log("offer data:", offer);
            console.log("offer.photo:", offer.photo);
            console.log("offer.place:", offer.place);
            
            // Handle case where offer.place is an object
            const placeId = (offer.place && typeof offer.place === 'object') ? offer.place._id : (offer.place || null);
            
            return (
              <Link
                key={offer._id}
                href={`/offer/${offer?._id}`}
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

                    {/* Discount Badge */}
                    <div className="absolute bottom-3 right-3 bg-red-500 text-white text-sm px-2 py-1 rounded-md font-bold">
                      {offer.discountValue}
                      {offer.discountType === "Percentage" ? "%" : ""}% OFF
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
      </div>
    </section>
  );
}
