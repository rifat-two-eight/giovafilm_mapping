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
  CarouselApi,
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
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";

import { FavouriteButton } from "@/components/shared/favourite-button";
import { NoImage } from "@/lib/others/others";
import { getImageUrl } from "@/lib/utils";
import { useGetSingleBusinessQuery } from "@/redux/features/business/businessApi";
import { useGetOffersByPlaceOrBusinessIdQuery } from "@/redux/features/offer/offerApi";
import { useGetPlaceDetailsQuery } from "@/redux/features/place/placeApi";
import {
  useGetReviewsByBusinessQuery,
  useGetReviewsByPlaceQuery,
} from "@/redux/features/review/reviewApi";
import Link from "next/link";
import InfoCard from "./info-card";
import { ReviewModal } from "./review-modal";

export default function MapDetails() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = params?.id as string;
  const entityType = (searchParams.get("type") || "place").toLowerCase();
  const isBusinessEntity = entityType === "business";
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const {
    data: placeRes,
    isLoading: isPlaceLoading,
    error: placeError,
  } = useGetPlaceDetailsQuery(id, {
    skip: !id || isBusinessEntity,
  });
  const {
    data: businessRes,
    isLoading: isBusinessLoading,
    error: businessError,
  } = useGetSingleBusinessQuery(id, {
    skip: !id || !isBusinessEntity,
  });

  const isLoading = isBusinessEntity ? isBusinessLoading : isPlaceLoading;
  const error = isBusinessEntity ? businessError : placeError;

  const rawData = isBusinessEntity ? businessRes?.data : placeRes?.data;

  // Normalize Place vs Business schemas for the shared details UI
  const placeData = useMemo(() => {
    if (!rawData) return null;
    if (!isBusinessEntity) return rawData;

    return {
      ...rawData,
      type: "Business",
      media: rawData.media?.photos || [],
      address: rawData.location?.address || "",
      phone: rawData.contact?.phone || rawData.phone,
      website: rawData.contact?.website || rawData.website,
      instagram: rawData.contact?.instagram || rawData.instagram,
      location: {
        type: "Point",
        coordinates: rawData.location?.mapLocation?.coordinates || [],
      },
      map: { name: rawData.location?.country },
      schedules:
        rawData.hours?.schedule
          ?.map(
            (s: any) =>
              `${s.days}: ${s.openTime || ""} - ${s.closeTime || ""}`,
          )
          .join(", ") || "",
    };
  }, [rawData, isBusinessEntity]);

  const coordinates = placeData?.location?.coordinates;

  const lat = coordinates?.[1];
  const lng = coordinates?.[0];

  const { data: offersRes, isLoading: isOffersLoading } =
    useGetOffersByPlaceOrBusinessIdQuery(placeData?._id, {
      skip: !placeData?._id,
    });

  // Backend returns a single offer object (findOne), not always an array
  const offersList = Array.isArray(offersRes?.data)
    ? offersRes.data
    : offersRes?.data
      ? [offersRes.data]
      : [];
  const offerId = offersList[0]?._id;

  const { data: placeReviews, isLoading: isPlaceReviewsLoading } =
    useGetReviewsByPlaceQuery(id, {
      skip: !id || isBusinessEntity,
    });
  const { data: businessReviews, isLoading: isBusinessReviewsLoading } =
    useGetReviewsByBusinessQuery(id, {
      skip: !id || !isBusinessEntity,
    });
  const reviews = isBusinessEntity ? businessReviews : placeReviews;
  const isReviewsLoading = isBusinessEntity
    ? isBusinessReviewsLoading
    : isPlaceReviewsLoading;

  const hasText = (v?: unknown) =>
    typeof v === "string" && v.trim().length > 0;

  const formatHours = () => {
    if (hasText(placeData?.schedules)) return placeData.schedules.trim();
    const schedule = placeData?.hours?.schedule;
    if (Array.isArray(schedule) && schedule.length > 0) {
      return schedule
        .map((s: any) => {
          const days = s.days || "Days";
          const open = s.openTime || "?";
          const close = s.closeTime || "?";
          return `${days}: ${open} – ${close}`;
        })
        .join(" · ");
    }
    return "";
  };

  const schedulesValue = formatHours();
  const entryCostRaw = placeData?.entryCost;
  const entryCostValue = hasText(entryCostRaw)
    ? String(entryCostRaw).match(/^\$/)
      ? String(entryCostRaw)
      : `$${entryCostRaw}`
    : "";

  const infoData = [
    {
      icon: Clock,
      label: "HOURS",
      value: schedulesValue || "Hours not listed yet",
      empty: !schedulesValue,
    },
    {
      icon: Ticket,
      label: "ENTRY COST",
      value: entryCostValue || "Not listed",
      empty: !entryCostValue,
    },
    {
      icon: BarChart3,
      label: "DIFFICULTY",
      value: hasText(placeData?.difficulty)
        ? placeData.difficulty
        : "Not specified",
      empty: !hasText(placeData?.difficulty),
      highlight: hasText(placeData?.difficulty),
    },
    {
      icon: Timer,
      label: "WALKING TIME",
      value: hasText(placeData?.hikeTime)
        ? placeData.hikeTime
        : "Not specified",
      empty: !hasText(placeData?.hikeTime),
    },
  ];

  const restaurantData = [
    {
      icon: Clock,
      label: "HOURS",
      value: schedulesValue || "Hours not listed yet",
      empty: !schedulesValue,
    },
    {
      icon: Ticket,
      label: "ATMOSPHERE",
      value: hasText(placeData?.atmosphere)
        ? placeData.atmosphere
        : "Not specified yet",
      empty: !hasText(placeData?.atmosphere),
    },
  ];

  const isBusiness = placeData?.type === "Business";
  const dataToRender = isBusiness ? restaurantData : infoData;

  const descriptionText =
    (hasText(placeData?.description) && placeData.description.trim()) || "";
  const accessText =
    (hasText(placeData?.access) && placeData.access.trim()) ||
    (hasText(placeData?.accessDescription) &&
      placeData.accessDescription.trim()) ||
    "";

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
    if (!lat || !lng) return;

    const mapName =
      (typeof placeData?.map === "object" && placeData?.map?.name) ||
      placeData?.country ||
      "";

    if (mapName) {
      localStorage.setItem("selectedCountryFilter", mapName);
    }

    const params = new URLSearchParams({
      focus: String(placeData?._id || id || ""),
      type: isBusinessEntity ? "business" : "place",
      lat: String(lat),
      lng: String(lng),
      satellite: "1",
    });
    if (mapName) params.set("map", mapName);

    router.push(`/maps?${params.toString()}`);
  };

  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(
    null,
  );
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);

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
    const list = placeData?.media || [];
    return Array.isArray(list) ? list.filter(Boolean) : [];
  }, [placeData]);

  useEffect(() => {
    if (!carouselApi) return;
    const onSelect = () => setCurrentSlide(carouselApi.selectedScrollSnap());
    onSelect();
    carouselApi.on("select", onSelect);
    return () => {
      carouselApi.off("select", onSelect);
    };
  }, [carouselApi]);

  const isVideo = (url: string) => {
    if (!url || typeof url !== "string") return false;
    const path = url.split("?")[0];
    return /\.(mp4|webm|ogg|mov|mkv|3gp|3gpp|avi|wmv|flv)$/i.test(path);
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
            <Link href="/catalog">
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
          <div className="lg:col-span-2 space-y-3">
            <div className="relative rounded-xl overflow-hidden group bg-gray-200 aspect-[16/10] md:aspect-[16/9]">
              <Carousel
                setApi={setCarouselApi}
                opts={{ loop: mediaList.length > 1 }}
                className="w-full h-full"
              >
                <CarouselContent className="h-full ml-0">
                  {mediaList.length > 0 ? (
                    mediaList.map((media: string, index: number) => (
                      <CarouselItem
                        key={index}
                        className="pl-0 h-full basis-full cursor-pointer"
                        onClick={() => setSelectedMediaIndex(index)}
                      >
                        <div className="relative h-full w-full min-h-[280px] md:min-h-[420px]">
                          {isVideo(media) ? (
                            <video
                              src={getImageUrl(media)}
                              className="object-cover w-full h-full absolute inset-0"
                              muted
                              loop
                              playsInline
                              onMouseOver={(e) => e.currentTarget.play()}
                              onMouseOut={(e) => e.currentTarget.pause()}
                            />
                          ) : (
                            <Image
                              src={getImageUrl(media)}
                              alt={`${placeData?.name} photo ${index + 1}`}
                              fill
                              unoptimized
                              className="object-cover"
                              sizes="(max-width: 1024px) 100vw, 66vw"
                            />
                          )}
                        </div>
                      </CarouselItem>
                    ))
                  ) : (
                    <CarouselItem className="pl-0 h-full basis-full">
                      <div className="min-h-[280px] md:min-h-[420px] flex items-center justify-center bg-gray-100">
                        <NoImage />
                      </div>
                    </CarouselItem>
                  )}
                </CarouselContent>

                {mediaList.length > 1 && (
                  <>
                    <CarouselPrevious className="absolute left-3 top-1/2 -translate-y-1/2 z-20 size-10 md:size-12 border-0 bg-black/45 hover:bg-black/65 text-white shadow-lg disabled:opacity-30" />
                    <CarouselNext className="absolute right-3 top-1/2 -translate-y-1/2 z-20 size-10 md:size-12 border-0 bg-black/45 hover:bg-black/65 text-white shadow-lg disabled:opacity-30" />
                  </>
                )}
              </Carousel>

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

              <FavouriteButton
                placeId={id}
                type={isBusinessEntity ? "Business" : "Place"}
                Style="absolute top-4 left-4 z-20 w-11 h-11 border-none bg-white/50 backdrop-blur p-3 rounded-lg"
              />

              {mediaList.length > 0 && (
                <div className="absolute top-4 right-4 z-20 rounded-full bg-black/55 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                  {currentSlide + 1} / {mediaList.length}
                  <span className="ml-1.5 font-normal text-white/80">
                    · tap to enlarge
                  </span>
                </div>
              )}

              {/* Bottom title card (Desktop Only) */}
              <div className="hidden md:block absolute bottom-0 inset-x-0 z-10 p-3 md:p-4">
                {mediaList.length > 1 && (
                  <div className="mb-3 flex justify-center gap-1.5">
                    {mediaList.map((_: string, index: number) => (
                      <button
                        key={index}
                        type="button"
                        aria-label={`Go to photo ${index + 1}`}
                        onClick={() => carouselApi?.scrollTo(index)}
                        className={`h-1.5 rounded-full transition-all ${currentSlide === index
                            ? "w-6 bg-yellow-400"
                            : "w-1.5 bg-white/55 hover:bg-white"
                          }`}
                      />
                    ))}
                  </div>
                )}

                <div className="rounded-2xl border border-white/15 bg-black/45 px-4 py-3.5 md:px-5 md:py-4 backdrop-blur-md shadow-lg">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {placeData?.category?.name && (
                      <span className="inline-flex items-center rounded-full bg-yellow-400/95 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-black">
                        {placeData.category.name}
                      </span>
                    )}
                    {typeof placeData?.rating === "number" &&
                      placeData.rating > 0 && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold text-white">
                          <Star
                            size={12}
                            className="fill-yellow-400 text-yellow-400"
                          />
                          {placeData.rating.toFixed(1)}
                          {placeData?.totalReview > 0 && (
                            <span className="font-normal text-white/70">
                              ({placeData.totalReview})
                            </span>
                          )}
                        </span>
                      )}
                  </div>

                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold font-public-sans text-white leading-tight tracking-tight">
                    {placeData?.name || "Untitled location"}
                  </h1>

                  <div className="mt-2 flex items-start gap-2 text-sm text-white/90">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#EC5B13]/20">
                      <MapPin size={13} className="text-[#FF8A4C]" />
                    </span>
                    <span className="leading-snug pt-0.5">
                      {placeData?.address || "Address not available"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile-Only Title Card (Below the image) */}
            <div className="md:hidden mt-3 rounded-2xl border border-gray-200 bg-white px-4 py-4 shadow-sm">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {placeData?.category?.name && (
                  <span className="inline-flex items-center rounded-full bg-yellow-400 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-black">
                    {placeData.category.name}
                  </span>
                )}
                {typeof placeData?.rating === "number" && placeData.rating > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-semibold text-gray-800 border border-gray-200">
                    <Star size={12} className="fill-yellow-400 text-yellow-400" />
                    {placeData.rating.toFixed(1)}
                    {placeData?.totalReview > 0 && (
                      <span className="font-normal text-gray-500">
                        ({placeData.totalReview})
                      </span>
                    )}
                  </span>
                )}
              </div>

              <h1 className="text-2xl font-bold font-public-sans text-gray-900 leading-tight tracking-tight">
                {placeData?.name || "Untitled location"}
              </h1>

              <div className="mt-2 flex items-start gap-2 text-sm text-gray-600">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#EC5B13]/10">
                  <MapPin size={13} className="text-[#FF8A4C]" />
                </span>
                <span className="leading-snug pt-0.5">
                  {placeData?.address || "Address not available"}
                </span>
              </div>
            </div>

            {mediaList.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                {mediaList.map((media: string, index: number) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => carouselApi?.scrollTo(index)}
                    className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${currentSlide === index
                        ? "border-yellow-400 ring-2 ring-yellow-200"
                        : "border-transparent opacity-80 hover:opacity-100"
                      }`}
                  >
                    {isVideo(media) ? (
                      <video
                        src={getImageUrl(media)}
                        className="h-full w-full object-cover"
                        muted
                      />
                    ) : (
                      <Image
                        src={getImageUrl(media)}
                        alt={`Thumbnail ${index + 1}`}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT SIDE INFO */}
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              {dataToRender.map((item, index) => {
                const Icon = item.icon;

                return (
                  <InfoCard
                    key={index}
                    icon={<Icon size={18} />}
                    label={item.label}
                    value={item.value}
                    highlight={(item as any)?.highlight}
                    empty={(item as any)?.empty}
                  />
                );
              })}
            </div>

            <div className="flex flex-col gap-2 mt-1">
              <Button
                onClick={handleViewOnMap}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold h-11 text-sm rounded-xl transition-all"
              >
                <Map size={16} className="mr-2" />
                View on Map
              </Button>

              {!isBusiness && (
                <Button
                  onClick={handleDirections}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold h-11 text-sm rounded-xl transition-all"
                >
                  <Send size={16} className="mr-1.5" />
                  Directions
                </Button>
              )}

              {isBusiness && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={handleDirections}
                      className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold h-11 text-sm rounded-xl transition-all"
                    >
                      <Send size={16} className="mr-1.5" />
                      Directions
                    </Button>
                    {hasText(placeData?.phone) ? (
                      <a href={`tel:${placeData.phone}`} className="w-full">
                        <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold h-11 text-sm rounded-xl transition-all">
                          <Phone size={16} className="mr-1.5" />
                          Call
                        </Button>
                      </a>
                    ) : (
                      <Button
                        disabled
                        title="This business hasn’t shared a phone number"
                        className="w-full bg-gray-50 text-gray-500 border border-gray-200 h-11 text-xs rounded-xl cursor-not-allowed"
                      >
                        <Phone size={16} className="mr-1.5" />
                        No phone
                      </Button>
                    )}
                  </div>
                  <Button
                    onClick={() => setIsReviewOpen(true)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold h-11 text-sm rounded-xl transition-all"
                  >
                    <MessageSquare size={16} className="mr-1.5" />
                    Write Review
                  </Button>
                  {offerId && (
                    <Link href={`/offer/${offerId}`} className="block">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-11 text-sm rounded-xl transition-all">
                        <Ticket size={16} className="mr-1.5" />
                        Discounts
                      </Button>
                    </Link>
                  )}
                </>
              )}
            </div>
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
                {isBusiness ? "DESCRIPTION & ACCESS" : "ABOUT THIS PLACE"}
              </AccordionTrigger>

              <AccordionContent className="text-muted-foreground space-y-4 px-6 pb-6">
                {descriptionText ? (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                      Description
                    </p>
                    <p className="leading-relaxed text-gray-700 whitespace-pre-wrap">
                      {descriptionText}
                    </p>
                  </div>
                ) : (
                  <p className="leading-relaxed text-gray-400 italic">
                    {isBusiness
                      ? "This business hasn’t added a description yet."
                      : "No description has been added for this place yet."}
                  </p>
                )}

                <div className="pt-3 border-t border-gray-100">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                    Access & getting here
                  </p>
                  {accessText ? (
                    <p className="leading-relaxed text-gray-700 whitespace-pre-wrap">
                      {accessText}
                    </p>
                  ) : (
                    <p className="leading-relaxed text-gray-400 italic">
                      Access tips aren’t listed yet. Use Directions below to
                      navigate with Google Maps.
                    </p>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* RECOMMENDATIONS */}
            {!isBusiness && (
              <AccordionItem
                value="recommendations"
                className="border rounded-xl bg-white"
              >
                <AccordionTrigger className="font-semibold px-6 hover:no-underline">
                  RECOMMENDATIONS
                </AccordionTrigger>

                <AccordionContent className="px-6 pb-6 space-y-5">
                  <p
                    className={`leading-relaxed ${hasText(placeData?.recommendations?.tips) ||
                        hasText(placeData?.details?.recommendations)
                        ? "text-gray-700"
                        : "text-gray-400 italic"
                      }`}
                  >
                    {placeData?.recommendations?.tips ||
                      placeData?.details?.recommendations ||
                      "No tips or recommendations have been added yet."}
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
            {!isBusiness && placeData?.services?.length > 0 && (
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

            {/* MENU & PRICES */}
            {(isBusiness || (placeData?.menuImages && placeData.menuImages.length > 0)) && (
              <AccordionItem
                value="menu"
                className="border rounded-xl bg-white"
              >
                <AccordionTrigger className="font-semibold px-6 hover:no-underline">
                  MENU & PRICES
                </AccordionTrigger>

                <AccordionContent className="px-6 pb-6">
                  {placeData?.menuImages && placeData.menuImages.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {placeData.menuImages.map((image: string, index: number) => (
                        <div
                          key={index}
                          className="relative aspect-square rounded-lg overflow-hidden border border-gray-100 cursor-zoom-in group"
                          onClick={() => window.open(getImageUrl(image), "_blank")}
                        >
                          <img
                            src={getImageUrl(image)}
                            alt={`Menu ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="leading-relaxed text-gray-400 italic">
                      No menu or price list has been uploaded yet.
                    </p>
                  )}
                </AccordionContent>
              </AccordionItem>
            )}

            {/* OFFERS & DISCOUNTS */}
            {offersList.length > 0 && (
              <AccordionItem
                value="offers"
                className="border rounded-xl bg-white"
              >
                <AccordionTrigger className="font-semibold px-6 hover:no-underline text-blue-600">
                  <div className="flex items-center gap-2">
                    <Ticket size={20} />
                    OFFERS & DISCOUNTS ({offersList.length})
                  </div>
                </AccordionTrigger>

                <AccordionContent className="px-6 pb-6 space-y-4">
                  <div className="grid gap-4">
                    {offersList.map((offer: any) => (
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

        {isBusiness && (
          <div className="px-2 mt-10">
            <h3 className="font-black text-xl uppercase tracking-tight text-gray-900 mb-2">
              Online Presence
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Links shared by this business. Missing links mean they haven’t been
              added yet.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {/* WEBSITE */}
              <div
                className={`flex items-center justify-between p-5 border rounded-2xl bg-white shadow-sm transition-shadow ${hasText(placeData?.website) ? "hover:shadow-md" : "opacity-90"
                  }`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="bg-blue-50 p-3 rounded-xl shrink-0">🌐</div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      WEBSITE
                    </p>
                    <p className="font-bold text-gray-900 truncate">
                      {hasText(placeData?.website)
                        ? "Official website"
                        : "Not provided yet"}
                    </p>
                  </div>
                </div>
                {hasText(placeData?.website) ? (
                  <button
                    onClick={() => {
                      const url = placeData.website.startsWith("http")
                        ? placeData.website
                        : `https://${placeData.website}`;
                      window.open(url, "_blank");
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-bold text-xs uppercase transition-colors shrink-0"
                  >
                    VISIT
                  </button>
                ) : (
                  <span className="text-xs text-gray-400 font-medium shrink-0 px-2">
                    Coming soon
                  </span>
                )}
              </div>

              {/* INSTAGRAM */}
              <div
                className={`flex items-center justify-between p-5 border rounded-2xl bg-white shadow-sm transition-shadow ${hasText(placeData?.instagram)
                    ? "hover:shadow-md"
                    : "opacity-90"
                  }`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="bg-pink-50 p-3 rounded-xl shrink-0">📸</div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      INSTAGRAM
                    </p>
                    <p className="font-bold text-gray-900 truncate">
                      {hasText(placeData?.instagram)
                        ? `@${placeData.instagram.replace("@", "")}`
                        : "Not provided yet"}
                    </p>
                  </div>
                </div>
                {hasText(placeData?.instagram) ? (
                  <button
                    onClick={() => {
                      const username = placeData.instagram
                        .replace("@", "")
                        .trim();
                      window.open(
                        `https://instagram.com/${username}`,
                        "_blank",
                      );
                    }}
                    className="bg-pink-600 hover:bg-pink-700 text-white px-5 py-2 rounded-xl font-bold text-xs uppercase transition-colors shrink-0"
                  >
                    VIEW
                  </button>
                ) : (
                  <span className="text-xs text-gray-400 font-medium shrink-0 px-2">
                    Coming soon
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
        {/* REVIEWS LIST SECTION */}
        <div className="mt-12 bg-white rounded-2xl border p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <h3 className="font-black text-xl uppercase tracking-tight text-gray-900">
              Reviews & Experiences ({reviewData?.length || 0})
            </h3>
            <Button
              onClick={() => setIsReviewOpen(true)}
              className="bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs uppercase"
            >
              Write Review
            </Button>
          </div>

          {isReviewsLoading ? (
            <div className="py-8 text-center text-gray-500">Loading reviews...</div>
          ) : !reviewData || reviewData.length === 0 ? (
            <div className="py-8 text-center text-gray-500 italic">No reviews yet. Be the first to share your experience!</div>
          ) : (
            <div className="space-y-6 divide-y divide-gray-100">
              {reviewData.map((rev: any, index: number) => (
                <div key={rev._id} className={`${index > 0 ? "pt-6" : ""} flex gap-4 items-start`}>
                  <Avatar className="w-10 h-10 border shrink-0">
                    <AvatarImage src={getImageUrl(rev.reviewer?.profile)} alt={rev.reviewer?.name} />
                    <AvatarFallback className="capitalize bg-yellow-100 text-yellow-800 font-bold">
                      {rev.reviewer?.name?.slice(0, 2) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-sm">{rev.reviewer?.name || "User"}</span>
                        {/* Display User level badge in place reviews */}
                        <span className="text-[9px] font-bold bg-yellow-100 text-yellow-800 border border-yellow-200 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                          Level {rev.reviewer?.level || 0}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(rev.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    {/* Star ratings */}
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={`${i < Math.floor(rev.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-200"
                            }`}
                        />
                      ))}
                    </div>

                    <p className="text-sm text-gray-600 leading-relaxed mt-1">
                      {rev.review || <span className="italic text-gray-400">Rated {rev.rating} stars (star-only review).</span>}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <ReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        placeId={isBusinessEntity ? undefined : placeData?._id}
        businessId={isBusinessEntity ? placeData?._id : undefined}
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
        <DialogContent
          showCloseButton={false}
          className="fixed inset-0 top-0 left-0 z-50 flex h-[100dvh] w-screen max-w-none translate-x-0 translate-y-0 flex-col gap-0 rounded-none border-0 bg-black p-0 shadow-none sm:max-w-none data-[state=open]:zoom-in-100 overflow-hidden"
        >
          {/* Blurred low-opacity background image */}
          {selectedMediaIndex !== null && !isVideo(mediaList[selectedMediaIndex]) && (
            <div
              className="absolute inset-0 bg-cover bg-center blur-2xl opacity-20 pointer-events-none select-none"
              style={{
                backgroundImage: `url(${getImageUrl(mediaList[selectedMediaIndex])})`,
              }}
            />
          )}

          <DialogHeader className="sr-only">
            <DialogTitle>Photo gallery</DialogTitle>
          </DialogHeader>

          <div className="absolute top-0 inset-x-0 z-50 flex items-center justify-between gap-3 px-4 py-3 bg-gradient-to-b from-black/80 to-transparent">
            <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white backdrop-blur">
              {selectedMediaIndex !== null ? selectedMediaIndex + 1 : 0} /{" "}
              {mediaList.length}
            </span>

            <div className="flex items-center gap-2">
              {selectedMediaIndex !== null &&
                !isVideo(mediaList[selectedMediaIndex]) && (
                  <div className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-1 backdrop-blur">
                    <button
                      type="button"
                      onClick={handleZoomOut}
                      className="rounded-full p-2 text-white hover:bg-white/15 disabled:opacity-40"
                      disabled={zoom <= 0.5}
                      aria-label="Zoom out"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        <line x1="8" y1="11" x2="14" y2="11" />
                      </svg>
                    </button>
                    <span className="min-w-10 text-center text-xs text-white">
                      {Math.round(zoom * 100)}%
                    </span>
                    <button
                      type="button"
                      onClick={handleZoomIn}
                      className="rounded-full p-2 text-white hover:bg-white/15 disabled:opacity-40"
                      disabled={zoom >= 3}
                      aria-label="Zoom in"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        <line x1="11" y1="8" x2="11" y2="14" />
                        <line x1="8" y1="11" x2="14" y2="11" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={handleResetZoom}
                      className="rounded-full p-2 text-white hover:bg-white/15"
                      aria-label="Reset zoom"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                        <path d="M3 3v5h5" />
                      </svg>
                    </button>
                  </div>
                )}

              <button
                type="button"
                onClick={() => {
                  setSelectedMediaIndex(null);
                  setZoom(1);
                  setPosition({ x: 0, y: 0 });
                }}
                className="rounded-full bg-white/10 p-2.5 text-white backdrop-blur hover:bg-white/20"
                aria-label="Close gallery"
              >
                <X size={22} />
              </button>
            </div>
          </div>

          <div
            className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-4 pb-6 pt-16"
            onWheel={handleWheel}
          >
            {selectedMediaIndex !== null && (
              <>
                <div
                  className="relative flex h-full w-full max-w-6xl items-center justify-center"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseLeave}
                  style={{
                    cursor:
                      zoom > 1
                        ? isDragging
                          ? "grabbing"
                          : "grab"
                        : "default",
                  }}
                >
                  {isVideo(mediaList[selectedMediaIndex]) ? (
                    <video
                      src={getImageUrl(mediaList[selectedMediaIndex])}
                      className="max-h-[min(85dvh,900px)] max-w-full object-contain"
                      controls
                      autoPlay
                    />
                  ) : (
                    <div
                      className="flex max-h-[min(85dvh,900px)] max-w-full items-center justify-center"
                      style={{
                        transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                        transition: isDragging
                          ? "none"
                          : "transform 0.12s ease-out",
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getImageUrl(mediaList[selectedMediaIndex])}
                        alt={`${placeData?.name || "Gallery"} photo ${selectedMediaIndex + 1}`}
                        className="max-h-[min(85dvh,900px)] max-w-full object-contain select-none"
                        draggable={false}
                      />
                    </div>
                  )}
                </div>

                {mediaList.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setZoom(1);
                        setPosition({ x: 0, y: 0 });
                        setSelectedMediaIndex(
                          (selectedMediaIndex - 1 + mediaList.length) %
                          mediaList.length,
                        );
                      }}
                      className="absolute left-2 md:left-6 top-1/2 z-[60] -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur hover:bg-black/70 md:p-3"
                      aria-label="Previous photo"
                    >
                      <ChevronLeft size={36} strokeWidth={1.5} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setZoom(1);
                        setPosition({ x: 0, y: 0 });
                        setSelectedMediaIndex(
                          (selectedMediaIndex + 1) % mediaList.length,
                        );
                      }}
                      className="absolute right-2 md:right-6 top-1/2 z-[60] -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur hover:bg-black/70 md:p-3"
                      aria-label="Next photo"
                    >
                      <ChevronRight size={36} strokeWidth={1.5} />
                    </button>
                  </>
                )}
              </>
            )}
          </div>

          {mediaList.length > 1 && (
            <div className="flex shrink-0 justify-center gap-2 overflow-x-auto px-4 pb-5">
              {mediaList.map((media: string, index: number) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    setZoom(1);
                    setPosition({ x: 0, y: 0 });
                    setSelectedMediaIndex(index);
                  }}
                  className={`relative h-14 w-16 shrink-0 overflow-hidden rounded-md border-2 ${selectedMediaIndex === index
                      ? "border-yellow-400"
                      : "border-white/20 opacity-70 hover:opacity-100"
                    }`}
                >
                  {isVideo(media) ? (
                    <video
                      src={getImageUrl(media)}
                      className="h-full w-full object-cover"
                      muted
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={getImageUrl(media)}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
