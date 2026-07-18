"use client";

import {
  BarChart3,
  Car,
  ChevronLeft,
  ChevronRight,
  Clock,
  Dog,
  Lock,
  Map,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  Star,
  Ticket,
  Timer,
  Toilet,
  User2,
  Utensils,
  Wifi,
  X,
} from "lucide-react";
import Image from "next/image";
import { useMemo, useState, useEffect } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";

import { FavouriteButton } from "@/components/shared/favourite-button";
import { NoImage } from "@/lib/others/others";
import { getImageUrl } from "@/lib/utils";
import { useGetOffersByPlaceOrBusinessIdQuery } from "@/redux/features/offer/offerApi";
import { useGetPlaceDetailsQuery } from "@/redux/features/place/placeApi";
import { useGetReviewsByPlaceQuery } from "@/redux/features/review/reviewApi";
import Link from "next/link";
import InfoCard from "./info-card";
import { ReviewModal } from "./review-modal";

export default function MapDetails() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const { data: placeRes, isLoading, error } = useGetPlaceDetailsQuery(id, {
    skip: !id,
  });
  const { data: reviews, isLoading: isReviewsLoading } =
    useGetReviewsByPlaceQuery(id, {
      skip: !id,
    });

  const placeData = placeRes?.data;
  const coordinates = placeData?.location?.coordinates;

  console.log("placeData", placeData?._id);

  const lat = coordinates?.[1];
  const lng = coordinates?.[0];

  const { data: offersRes, isLoading: isOffersLoading } =
    useGetOffersByPlaceOrBusinessIdQuery(placeData?._id, {
      skip: !placeData?._id,
    });

  const offerId = offersRes?.data?._id;

  console.log("offersRes", offerId);

  const infoData = [
    {
      icon: Clock,
      label: "SCHEDULES",
      value: placeData?.schedules || "N/A",
    },
    {
      icon: Ticket,
      label: "ENTRY COST",
      value: `$${placeData?.entryCost || 0}/vehicle` || "N/A",
    },
    {
      icon: BarChart3,
      label: "DIFFICULTY",
      value: placeData?.difficulty || "N/A",
      highlight: true,
    },
    {
      icon: Timer,
      label: "HIKE TIME",
      value: placeData?.hikeTime ? `${placeData.hikeTime} Hours` : "N/A",
    },
  ];

  const restaurantData = [
    {
      icon: Clock,
      label: "SCHEDULES",
      value: placeData?.schedules || "",
    },
    {
      icon: Ticket,
      label: "Atmosphere:",
      value: placeData?.atmosphere || "",
    },
  ];

  const isRestaurant =
    placeData?.category?.name?.toLowerCase() === "restaurant";
  const dataToRender = isRestaurant ? restaurantData : infoData;

  const reviewData = reviews?.data;
  // console.log("placeRes", reviewData);

  const servicesMap: Record<string, any> = {
    Parking: { icon: Car, label: "PARKING" },
    Restrooms: { icon: Toilet, label: "RESTROOMS" },
    "Food Nearby": { icon: Utensils, label: "FOOD NEARBY" },
    "Guided Tour": { icon: MapPin, label: "GUIDED TOUR" },
    "Family Friendly": { icon: User2, label: "FAMILY FRIENDLY" },
    Wifi: { icon: Wifi, label: "WIFI" },
    "Pet Friendly": { icon: Dog, label: "PET FRIENDLY" },
  };

  const handleViewOnMap = () => {
    if (!lat || !lng) {
      console.error("Invalid coordinates");
      return;
    }
    router.push(`/view-location?lat=${lat}&lng=${lng}`);
  };

  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(
    null,
  );

  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Reset zoom and position when selected media changes
  useEffect(() => {
    if (selectedMediaIndex !== null) {
      setZoom(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [selectedMediaIndex]);

  const mediaList = useMemo(() => {
    return placeData?.media || [];
  }, [placeData]);

  const isVideo = (url: string) => {
    return /\.(mp4|webm|ogg)$/i.test(url);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY > 0) {
      handleZoomOut();
    } else {
      handleZoomIn();
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleDirections = () => {
    if (!lat || !lng) {
      console.error("Invalid coordinates");
      return;
    }

    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

    window.open(url, "_blank");
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

  if (error && ((error as any).status === 403 || (error as any).originalStatus === 403)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center space-y-6 max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Unlock this Location!</h2>
          <p className="text-gray-600 leading-relaxed">
            This spot is part of a premium map. Purchase the map to get access to all hidden viewpoints, waterfalls, and locations.
          </p>
          <div className="pt-4">
            <Link href="/maps">
              <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-6 rounded-xl shadow-lg shadow-yellow-200 transition-all text-lg">
                <Ticket className="w-5 h-5 mr-2" />
                Purchase Map
              </Button>
            </Link>
          </div>
          <div className="pt-2">
            <Link href="/maps">
              <Button variant="ghost" className="text-gray-500 w-full">Back to Maps</Button>
            </Link>
          </div>
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
      <div className="max-w-[1400px] mx-auto px-4 md:px-6  ">
        {/* TOP GRID */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* LEFT HERO CARD */}
          <div className="lg:col-span-2 relative rounded-xl overflow-hidden group">
            <Carousel className="w-full h-full">
              <CarouselContent className="h-100 ml-0">
                {mediaList.length > 0 ? (
                  mediaList.map((media: string, index: number) => (
                    <CarouselItem
                      key={index}
                      className="pl-0 h-full cursor-pointer"
                      onClick={() => setSelectedMediaIndex(index)}
                    >
                      <div className="h-full w-full relative">
                        {isVideo(media) ? (
                          <video
                            src={getImageUrl(media)}
                            className="object-cover w-full h-full"
                            muted
                            loop
                            onMouseOver={(e) => e.currentTarget.play()}
                            onMouseOut={(e) => e.currentTarget.pause()}
                          />
                        ) : (
                          <Image
                            src={getImageUrl(media)}
                            alt={`${placeData?.name} media ${index + 1}`}
                            width={1000}
                            height={1000}
                            unoptimized
                            className="object-cover w-full h-full"
                          />
                        )}
                      </div>
                    </CarouselItem>
                  ))
                ) : (
                  <CarouselItem className="pl-0 h-full">
                    <NoImage />
                  </CarouselItem>
                )}
              </CarouselContent>

              {/* Navigation Arrows - Overlay */}
              {mediaList.length > 1 && (
                <>
                  <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 border-none text-white transition-opacity opacity-0 group-hover:opacity-100 size-12" />
                  <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 border-none text-white transition-opacity opacity-0 group-hover:opacity-100 size-12" />
                </>
              )}
            </Carousel>

            {/* overlay */}
            <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>

            <FavouriteButton
              placeId={id}
              type="Place"
              Style="absolute top-5 left-5 w-12 h-12 border-none bg-white/40 backdrop-blur p-4 rounded-lg"
            />

            {/* share */}
            {/* <button className="absolute top-5 right-5 text-yellow-400 flex items-center gap-2 font-semibold">
              <Share2 size={18} />
              SHARE
            </button> */}

            {/* title */}
            <div className="absolute bottom-6 left-6 text-white">
              <h1 className=" text-2xl md:text-5xl font-bold font-public-sans drop-shadow-lg">
                {placeData?.name}
              </h1>

              <div className="flex items-center gap-2 mt-2 md:text-lg drop-shadow-md">
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

            <Button
              onClick={handleViewOnMap}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-6 text-base rounded-xl transition-all"
            >
              <Map size={18} className="mr-2" />
              View on Map
            </Button>

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

                {offerId && (
                  <Link href={`/offer/${offerId}`} className="block">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 text-base rounded-xl transition-all">
                      <Ticket size={18} className="mr-2" />
                      Discounts
                    </Button>
                  </Link>
                )}
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
                  {placeData?.access || placeData?.accessDescription || placeData?.details?.access ||
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
                    {placeData?.recommendations?.tips || placeData?.details?.recommendations ||
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

            {/* OFFERS & DISCOUNTS */}
            {offersRes?.data && offersRes.data.length > 0 && (
              <AccordionItem
                value="offers"
                className="border rounded-xl bg-white"
              >
                <AccordionTrigger className="font-semibold px-6 hover:no-underline text-blue-600">
                  <div className="flex items-center gap-2">
                    <Ticket size={20} />
                    OFFERS & DISCOUNTS ({offersRes.data.length})
                  </div>
                </AccordionTrigger>

                <AccordionContent className="px-6 pb-6 space-y-4">
                  <div className="grid gap-4">
                    {offersRes.data.map((offer: any) => (
                      <div
                        key={offer._id}
                        className="p-4 border border-blue-100 bg-blue-50/30 rounded-xl relative overflow-hidden group hover:bg-blue-50 transition-colors"
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1 space-y-1">
                            <h4 className="font-bold text-lg text-gray-900 leading-tight">
                              {offer.title}
                            </h4>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {offer.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded uppercase">
                                {offer.discountType === "Percentage"
                                  ? `${offer.discountValue}% OFF`
                                  : offer.discountType === "Flat"
                                    ? `$${offer.discountValue} OFF`
                                    : offer.discountType}
                              </span>
                              {offer.validUntil && (
                                <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded uppercase">
                                  Valid until:{" "}
                                  {new Date(
                                    offer.validUntil,
                                  ).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                          <Link href={`/discounts/${id}`} className="shrink-0">
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-4 h-auto rounded-lg">
                              REDEEM
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
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

      {/* Media Modal */}
      <Dialog
        open={selectedMediaIndex !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedMediaIndex(null);
            setZoom(1);
            setPosition({ x: 0, y: 0 });
          }
        }}
      >
        <DialogContent className="max-w-[100vw] w-full h-[100vh] p-0 bg-black/98 border-none flex flex-col items-center justify-center overflow-hidden">
          <DialogHeader className="sr-only">
            <DialogTitle>Media Gallery</DialogTitle>
          </DialogHeader>
          
          {/* Top Bar */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-50">
            <div className="flex items-center gap-2">
              <span className="text-white/70 text-sm font-medium">
                {selectedMediaIndex !== null && selectedMediaIndex + 1} /{" "}
                {mediaList.length}
              </span>
            </div>
            
            {/* Zoom Controls */}
            {selectedMediaIndex !== null && !isVideo(mediaList[selectedMediaIndex]) && (
              <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md rounded-full px-3 py-2">
                <button
                  onClick={handleZoomOut}
                  className="text-white hover:text-yellow-400 p-1 transition-colors"
                  disabled={zoom <= 0.5}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    <line x1="8" y1="11" x2="14" y2="11" />
                  </svg>
                </button>
                <span className="text-white text-sm font-medium min-w-[40px] text-center">{Math.round(zoom * 100)}%</span>
                <button
                  onClick={handleZoomIn}
                  className="text-white hover:text-yellow-400 p-1 transition-colors"
                  disabled={zoom >= 3}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    <line x1="11" y1="8" x2="11" y2="14" />
                    <line x1="8" y1="11" x2="14" y2="11" />
                  </svg>
                </button>
                <div className="w-px h-6 bg-white/30 mx-1"></div>
                <button
                  onClick={handleResetZoom}
                  className="text-white hover:text-yellow-400 p-1 transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                  </svg>
                </button>
              </div>
            )}
            
            {/* Close Button */}
            <button
              onClick={() => {
                setSelectedMediaIndex(null);
                setZoom(1);
                setPosition({ x: 0, y: 0 });
              }}
              className="text-white/70 hover:text-white transition-colors p-2 bg-black/40 backdrop-blur-md rounded-full"
            >
              <X size={28} />
            </button>
          </div>

          <div 
            className="relative w-full h-full flex items-center justify-center"
            onWheel={handleWheel}
          >
            {selectedMediaIndex !== null && (
              <div 
                className="relative w-full h-full flex items-center justify-center"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                style={{ 
                  cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' 
                }}
              >
                {isVideo(mediaList[selectedMediaIndex]) ? (
                  <video
                    src={getImageUrl(mediaList[selectedMediaIndex])}
                    className="max-w-[95vw] max-h-[95vh] object-contain"
                    controls
                    autoPlay
                  />
                ) : (
                  <div style={{
                    transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                    transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                  }}>
                    <Image
                      src={getImageUrl(mediaList[selectedMediaIndex])}
                      alt="Gallery view"
                      width={2400}
                      height={1600}
                      unoptimized
                      className="max-w-[95vw] max-h-[95vh] object-contain"
                    />
                  </div>
                )}

                {/* Navigation Buttons in Modal */}
                {mediaList.length > 1 && (
                  <>
                    <button
                      onClick={() => {
                        setSelectedMediaIndex(
                          (selectedMediaIndex - 1 + mediaList.length) %
                            mediaList.length,
                        );
                      }}
                      className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 text-white hover:bg-white/10 rounded-full transition-colors z-[100]"
                    >
                      <ChevronLeft size={56} strokeWidth={1.5} />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedMediaIndex(
                          (selectedMediaIndex + 1) % mediaList.length,
                        );
                      }}
                      className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 text-white hover:bg-white/10 rounded-full transition-colors z-[100]"
                    >
                      <ChevronRight size={56} strokeWidth={1.5} />
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
