"use client";

import {
  BarChart3,
  Car,
  Clock,
  Dog,
  Heart,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  Share2,
  Star,
  Ticket,
  Timer,
  Toilet,
  User2,
  Utensils,
  Wifi,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";

import { NoImage } from "@/lib/others/others";
import { getImageUrl } from "@/lib/utils";
import {
  useAddToFavouriteMutation,
  useGetFavouritesQuery,
} from "@/redux/features/favourite/favouriteApi";
import { useGetPlaceDetailsQuery } from "@/redux/features/place/placeApi";
import Link from "next/link";
import { toast } from "sonner";
import InfoCard from "./info-card";
import { ReviewModal } from "./review-modal";

export const infoData = [
  {
    icon: Clock,
    label: "SCHEDULES",
    value: "Sunrise - Sunset",
  },
  {
    icon: Ticket,
    label: "ENTRY COST",
    value: "$15.00 / vehicle",
  },
  {
    icon: BarChart3,
    label: "DIFFICULTY",
    value: "Moderate",
    highlight: true,
  },
  {
    icon: Timer,
    label: "HIKE TIME",
    value: "~ 3.5 Hours",
  },
];

export const restaurantData = [
  {
    icon: Clock,
    label: "SCHEDULES",
    value: "09:00 AM - 11:00 PM",
  },
  {
    icon: Ticket,
    label: "Atmosphere:",
    value: "Cozy & Romantic",
  },
];

export default function MapDetails() {
  const params = useParams();
  const id = params?.id as string;
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const [addToFavourite, { isLoading: isFavouriteLoading }] =
    useAddToFavouriteMutation();

  const { data: placeRes, isLoading } = useGetPlaceDetailsQuery(id, {
    skip: !id,
  });

  // Fetch the user's full favourites list from the backend
  const { data: favouritesRes } = useGetFavouritesQuery();
  const favouritesList: any[] = favouritesRes?.data || [];

  const placeData = placeRes?.data;
  const coordinates = placeData?.location?.coordinates;

  const lat = coordinates?.[1];
  const lng = coordinates?.[0];

  // Derive isFavourite from the real API list — persists across reloads
  const mapId = placeData?.map?._id;
  const isFavourite = favouritesList.some(
    (fav: any) =>
      (typeof fav.map === "string" ? fav.map : fav.map?._id) === mapId,
  );

  const isRestaurant =
    placeData?.category?.name?.toLowerCase() === "restaurant";
  const dataToRender = isRestaurant ? restaurantData : infoData;

  const servicesMap: Record<string, any> = {
    Parking: { icon: Car, label: "PARKING" },
    Restrooms: { icon: Toilet, label: "RESTROOMS" },
    "Food Nearby": { icon: Utensils, label: "FOOD NEARBY" },
    "Guided Tour": { icon: MapPin, label: "GUIDED TOUR" },
    "Family Friendly": { icon: User2, label: "FAMILY FRIENDLY" },
    Wifi: { icon: Wifi, label: "WIFI" },
    "Pet Friendly": { icon: Dog, label: "PET FRIENDLY" },
  };

  // ✅ Must be before any early returns — Rules of Hooks
  // isFavourite is now derived from server data — no useEffect needed

  const handleDirections = () => {
    if (!lat || !lng) {
      console.error("Invalid coordinates");
      return;
    }

    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

    window.open(url, "_blank");
  };

  // ✅ Toggle favourite (POST acts as toggle on backend)
  const handleFavourite = async () => {
    if (!mapId) return;
    try {
      await addToFavourite({
        type: "Map",
        map: mapId,
      }).unwrap();

      toast.success(
        isFavourite ? "Removed from favourites" : "Added to favourites",
      );
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update favourites");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading place details...</p>
        </div>
      </div>
    );
  }

  if (!placeData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <p className="text-xl font-bold text-gray-800">Place not found</p>
          <Link href="/maps">
            <Button variant="outline">Back to Map</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-gray-100 py-10">
      <div className="max-w-[1400px] mx-auto px-6  ">
        {/* TOP GRID */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* LEFT HERO CARD */}
          <div className="lg:col-span-2 relative rounded-xl overflow-hidden">
            <div className="h-100 object-cover">
              {placeData?.media.length > 0 ? (
                <Image
                  src={getImageUrl(placeData?.media?.[0])}
                  alt={placeData?.name || "Place Image"}
                  width={1000}
                  height={1000}
                  unoptimized
                  className="object-cover w-full h-full"
                />
              ) : (
                <NoImage />
              )}
            </div>

            {/* overlay */}
            <div className="absolute inset-0 bg-black/40"></div>

            {/* favorite */}
            <button
              onClick={handleFavourite}
              className="absolute top-5 left-5 bg-white/40 backdrop-blur p-4 rounded-lg"
            >
              <Heart
                size={20}
                className={
                  isFavourite
                    ? "text-red-500 fill-red-500"
                    : isFavouriteLoading
                      ? "animate-pulse"
                      : "text-gray-400"
                }
              />
            </button>

            {/* share */}
            <button className="absolute top-5 right-5 text-yellow-400 flex items-center gap-2 font-semibold">
              <Share2 size={18} />
              SHARE
            </button>

            {/* title */}
            <div className="absolute bottom-6 left-6 text-white">
              <h1 className="text-5xl font-bold font-public-sans drop-shadow-lg">
                {placeData?.name}
              </h1>

              <div className="flex items-center gap-2 mt-2 text-lg drop-shadow-md">
                <MapPin size={16} className="text-[#EC5B13]" />
                {placeData?.category?.name} • {placeData?.address}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE INFO */}
          <div className="space-y-4 flex flex-col justify-between">
            {/* grid cards */}
            <div className="grid grid-cols-2 gap-4">
              {dataToRender.map((item, index) => {
                const Icon = item.icon;

                return (
                  <InfoCard
                    key={index}
                    icon={<Icon size={18} />}
                    label={item.label}
                    value={item.value}
                    highlight={(item as any)?.highlight}
                  />
                );
              })}
            </div>

            {/* directions button */}
            {!isRestaurant && (
              <Button
                onClick={handleDirections}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-6 text-base rounded-xl transition-all"
              >
                <Send size={18} className="mr-2" />
                DIRECTIONS
              </Button>
            )}

            {isRestaurant && (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <Button
                    onClick={handleDirections}
                    className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-6 text-base rounded-xl transition-all"
                  >
                    <Send size={18} className="mr-2" />
                    DIRECTIONS
                  </Button>
                  <Button className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-6 text-base rounded-xl transition-all">
                    <Phone size={18} className="mr-2" />
                    Call
                  </Button>
                </div>

                <Link href={`/discounts/${id}`} className="block">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 text-base rounded-xl transition-all">
                    <Ticket size={18} className="mr-2" />
                    Discounts
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* ACCORDIONS */}
        <div className="mt-10 space-y-4">
          <Accordion
            type="single"
            collapsible
            defaultValue="access"
            className="space-y-4"
          >
            {/* ACCESS */}

            <AccordionItem
              value="access"
              className="border rounded-xl bg-white"
            >
              <AccordionTrigger className="font-semibold px-6 hover:no-underline">
                {isRestaurant ? "DESCRIPTION & ACCESS" : "ACCESS"}
              </AccordionTrigger>

              <AccordionContent className="text-muted-foreground space-y-4 px-6 pb-6">
                <p className="leading-relaxed">
                  {placeData?.description ||
                    "No specific access details available for this location."}
                </p>
                {placeData?.details?.access && (
                  <div className="pt-2 border-t border-gray-100">
                    <p className="font-semibold text-gray-800 mb-1">
                      Getting Here:
                    </p>
                    <p>{placeData.details.access}</p>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>

            {/* RECOMMENDATIONS */}
            {!isRestaurant && (
              <AccordionItem
                value="recommendations"
                className="border rounded-xl bg-white"
              >
                <AccordionTrigger className="font-semibold px-6 hover:no-underline">
                  RECOMMENDATIONS
                </AccordionTrigger>

                <AccordionContent className="px-6 pb-6 space-y-5">
                  <p className="text-muted-foreground leading-relaxed">
                    {placeData?.details?.recommendations ||
                      "No specific recommendations available for this place."}
                  </p>

                  {placeData?.accessibility?.features?.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Accessibility Features
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {placeData.accessibility.features.map(
                          (feature: string) => (
                            <span
                              key={feature}
                              className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-100 capitalize"
                            >
                              {feature}
                            </span>
                          ),
                        )}
                      </div>
                      {placeData.accessibility.notes && (
                        <p className="text-sm italic text-gray-500">
                          {placeData.accessibility.notes}
                        </p>
                      )}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            )}

            {/* SERVICES */}
            {!isRestaurant && placeData?.services?.length > 0 && (
              <AccordionItem
                value="services"
                className="border rounded-xl bg-white"
              >
                <AccordionTrigger className="font-semibold px-6 hover:no-underline">
                  SERVICES AVAILABLE
                </AccordionTrigger>

                <AccordionContent className="px-6 pb-8">
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-6 text-center">
                    {placeData.services.map((serviceName: string) => {
                      const serviceInfo = servicesMap[serviceName];
                      if (!serviceInfo) return null;
                      const Icon = serviceInfo.icon;

                      return (
                        <div
                          key={serviceName}
                          className="flex flex-col items-center gap-2"
                        >
                          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 group-hover:bg-yellow-50 transition-colors">
                            <Icon size={22} className="text-gray-600" />
                          </div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                            {serviceInfo.label}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* REVIEWS */}
            <AccordionItem
              value="reviews"
              className="border! rounded-xl overflow-hidden"
            >
              <AccordionTrigger className="px-6 py-4 font-semibold bg-yellow-50 text-yellow-700">
                REVIEWS
              </AccordionTrigger>

              <AccordionContent className="px-6 pb-6 space-y-6">
                {/* Rating summary */}
                <div className="flex items-center gap-3">
                  <h3 className="text-3xl font-bold">4.8</h3>

                  <div className="flex text-yellow-500">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <Star key={i} size={18} fill="currentColor" />
                      ))}
                  </div>

                  <p className="text-sm text-muted-foreground">
                    Based on 124 reviews
                  </p>
                </div>

                {/* REVIEW 1 */}
                <div className="flex gap-4">
                  <Avatar>
                    <AvatarImage src="/avatar.png" />
                    <AvatarFallback>M</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">Marcus Chen</p>
                        <p className="text-xs text-muted-foreground">
                          2 DAYS AGO
                        </p>
                      </div>

                      <div className="flex text-yellow-500">
                        {Array(5)
                          .fill(0)
                          .map((_, i) => (
                            <Star key={i} size={16} fill="currentColor" />
                          ))}
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      Absolutely stunning views! The hike was moderately
                      challenging but well worth it when you reach the
                      crystal-clear water at the top. Highly recommend arriving
                      early.
                    </p>
                  </div>
                </div>

                <div className="border-t"></div>

                {/* REVIEW 2 */}
                <div className="flex gap-4">
                  <Avatar>
                    <AvatarImage src="/avatar.png" />
                    <AvatarFallback>S</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">Sarah Jenkins</p>
                        <p className="text-xs text-muted-foreground">
                          1 WEEK AGO
                        </p>
                      </div>

                      <div className="flex text-yellow-500">
                        {Array(4)
                          .fill(0)
                          .map((_, i) => (
                            <Star key={i} size={16} fill="currentColor" />
                          ))}
                        <Star size={16} />
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      The trail was well-marked. A bit crowded on the weekend
                      but the scenery is spectacular. Don't forget to bring
                      plenty of water!
                    </p>
                  </div>
                </div>

                {/* Button */}
                <Button
                  onClick={() => setIsReviewOpen(true)}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-6 rounded-xl mt-6"
                >
                  <MessageSquare size={18} className="mr-2" />
                  WRITE A REVIEW
                </Button>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {isRestaurant && (
          <div className="px-2 mt-10">
            <h3 className="font-black text-xl uppercase tracking-tight text-gray-900 mb-6">
              Online Presence
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {/* WEBSITE placeholder or real data if available in details */}
              <div className="flex items-center justify-between p-5 border rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-50 p-3 rounded-xl">🌐</div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      WEBSITE
                    </p>
                    <p className="font-bold text-gray-900 truncate max-w-[150px]">
                      Official Site
                    </p>
                  </div>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-bold text-xs uppercase transition-colors">
                  VISIT
                </button>
              </div>

              {/* SOCIAL placeholder */}
              <div className="flex items-center justify-between p-5 border rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="bg-pink-50 p-3 rounded-xl">📸</div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      INSTAGRAM
                    </p>
                    <p className="font-bold text-gray-900">
                      @visit_{placeData.name.toLowerCase().replace(/\s+/g, "_")}
                    </p>
                  </div>
                </div>
                <button className="bg-pink-600 hover:bg-pink-700 text-white px-5 py-2 rounded-xl font-bold text-xs uppercase transition-colors">
                  VIEW
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <ReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        placeId={placeData?._id}
      />
    </section>
  );
}
