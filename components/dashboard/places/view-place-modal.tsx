"use client";

import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatEntryCost, formatHikeTime, getImageUrl } from "@/lib/utils";
import { useGetPlaceDetailsQuery } from "@/redux/features/place/placeApi";
import { useGetReviewsByPlaceQuery } from "@/redux/features/review/reviewApi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import {
  Accessibility,
  Baby,
  Calendar,
  Car,
  Clock,
  Coins,
  Compass,
  Dog,
  ExternalLink,
  Gauge,
  Globe,
  Heart,
  Info,
  Instagram,
  Lightbulb,
  MapPin,
  MessageSquare,
  Navigation,
  Phone,
  Sparkles,
  Star,
  ToolCase,
  Users,
  Utensils,
  Wifi,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";

interface ViewPlaceModalProps {
  placeId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewPlaceModal({
  placeId,
  open,
  onOpenChange,
}: ViewPlaceModalProps) {
  const { t } = useLanguage();
  const { data: response, isLoading } = useGetPlaceDetailsQuery(
    placeId as string,
    {
      skip: !placeId,
    }
  );
  const { data: reviews, isLoading: isReviewsLoading } =
    useGetReviewsByPlaceQuery(placeId as string, {
      skip: !placeId,
    });

  const [activeTab, setActiveTab] = useState("overview");
  const [imageErrorIndex, setImageErrorIndex] = useState<Record<number, boolean>>({});

  const place = response?.data;

  const categoryName =
    typeof place?.category === "object" && place?.category?.name
      ? place.category.name
      : typeof place?.category === "string"
      ? place.category
      : "";

  const isBusinessOrRestaurant =
    place?.type === "Business" ||
    categoryName.toLowerCase().includes("restaurant") ||
    categoryName.toLowerCase().includes("cafe") ||
    categoryName.toLowerCase().includes("bar");

  const dynamicTabs = [
    { id: "overview", label: t("place.overview") || "Overview", icon: <Info size={15} /> },
    ...(isBusinessOrRestaurant
      ? [{ id: "menu", label: t("place.menu_and_prices") || "Menu & Prices", icon: <Utensils size={15} /> }]
      : []),
    {
      id: "accessibility",
      label: t("place.accessibility_features") || "Accessibility",
      icon: <Accessibility size={15} />,
    },
    { id: "services", label: t("place.services_available") || "Services", icon: <ToolCase size={15} /> },
    { id: "reviews", label: t("place.reviews") || "Reviews", icon: <MessageSquare size={15} /> },
  ];

  useEffect(() => {
    if (place && !isBusinessOrRestaurant && activeTab === "menu") {
      setActiveTab("overview");
    }
  }, [place, isBusinessOrRestaurant, activeTab]);

  const servicesIcons: Record<string, React.ReactNode> = {
    Parking: <Car size={16} />,
    Restrooms: <Users size={16} />,
    "Food Nearby": <Utensils size={16} />,
    "Guided Tour": <MapPin size={16} />,
    "Family Friendly": <Baby size={16} />,
    Wifi: <Wifi size={16} />,
    "Pet Friendly": <Dog size={16} />,
  };

  const serviceKeyMap: Record<string, string> = {
    Parking: "parking",
    Restrooms: "restrooms",
    "Food Nearby": "food_nearby",
    "Guided Tour": "guided_tour",
    "Family Friendly": "family_friendly",
    Wifi: "wifi",
    "Pet Friendly": "pet_friendly",
  };

  const getDifficultyLabel = (diff?: string) => {
    if (!diff) return "";
    const lower = diff.toLowerCase();
    if (lower === "easy") return t("place.easy") || "Easy";
    if (lower === "medium") return t("place.medium") || "Medium";
    if (lower === "hard") return t("place.hard") || "Hard";
    return diff;
  };

  const hasRating = Boolean(place?.rating && Number(place.rating) > 0);
  const ratingValue = hasRating ? Number(place.rating).toFixed(1) : null;
  const reviewCount = place?.totalReview ? Number(place.totalReview) : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-3xl lg:max-w-4xl max-h-[90vh] sm:h-[85vh] flex flex-col gap-0 p-0 overflow-hidden border border-gray-100 shadow-2xl rounded-3xl bg-white text-gray-900"
      >
        {isLoading ? (
          <div className="p-12 space-y-4 flex-1 flex flex-col justify-center items-center bg-gray-50/50">
            <div className="w-10 h-10 rounded-full border-3 border-[#FFC107] border-t-transparent animate-spin" />
            <p className="text-sm font-semibold text-gray-500">{t("place.loading_details")}</p>
          </div>
        ) : place ? (
          <>
            {/* Hero Image Header */}
            <div className="relative h-60 sm:h-72 w-full overflow-hidden shrink-0 bg-neutral-900">
              {/* Close Button */}
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/60 hover:bg-black/85 text-white transition-all backdrop-blur-md shadow-md cursor-pointer"
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>

              {/* Media Carousel */}
              <Carousel className="absolute inset-0 w-full h-full">
                <CarouselContent className="h-full ml-0">
                  {place?.media && place.media.length > 0 ? (
                    place.media.map((mediaUrl: string, index: number) => {
                      const isFailed = imageErrorIndex[index];
                      const fullUrl = getImageUrl(mediaUrl);

                      return (
                        <CarouselItem key={index} className="pl-0 h-full">
                          <div className="relative w-full h-full bg-neutral-900 flex items-center justify-center">
                            {!isFailed && fullUrl ? (
                              <img
                                src={fullUrl}
                                alt={place.name || "Place image"}
                                onError={() =>
                                  setImageErrorIndex((prev) => ({ ...prev, [index]: true }))
                                }
                                className="w-full h-full object-cover brightness-90"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-tr from-neutral-800 via-neutral-900 to-neutral-800 flex flex-col items-center justify-center text-amber-400 gap-2">
                                <Compass size={40} className="text-[#FFC107] opacity-80" />
                                <span className="text-xs text-gray-400 font-medium tracking-wide">
                                  {place.name}
                                </span>
                              </div>
                            )}
                          </div>
                        </CarouselItem>
                      );
                    })
                  ) : (
                    <CarouselItem className="pl-0 h-full">
                      <div className="w-full h-full bg-gradient-to-tr from-neutral-800 via-neutral-900 to-neutral-800 flex flex-col items-center justify-center text-amber-400 gap-2">
                        <Compass size={40} className="text-[#FFC107] opacity-80" />
                        <span className="text-xs text-gray-400 font-medium tracking-wide">
                          {place.name}
                        </span>
                      </div>
                    </CarouselItem>
                  )}
                </CarouselContent>

                {place?.media && place.media.length > 1 && (
                  <>
                    <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/70 text-white border-none size-8 backdrop-blur-xs transition-all" />
                    <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/70 text-white border-none size-8 backdrop-blur-xs transition-all" />
                  </>
                )}
              </Carousel>

              {/* Gradient Bottom Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 pointer-events-none" />

              {/* Hero Information */}
              <div className="absolute bottom-0 left-0 w-full p-5 sm:p-6 z-20 flex flex-col justify-end space-y-2">
                {/* Badges Row */}
                <div className="flex flex-wrap items-center gap-2">
                  {categoryName && (
                    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FFC107] text-black shadow-xs">
                      {categoryName}
                    </span>
                  )}

                  {place.type === "Business" && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500 text-white shadow-xs">
                      Business
                    </span>
                  )}

                  {hasRating && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-md border border-white/20">
                      <Star size={12} className="fill-amber-400 text-amber-400" />
                      <span>{ratingValue}</span>
                      {reviewCount > 0 && (
                        <span className="text-white/75 font-normal text-[11px]">
                          ({reviewCount})
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Place Name */}
                <DialogTitle className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight drop-shadow-md">
                  {place.name}
                </DialogTitle>

                {/* Location Address */}
                {place.address && (
                  <div className="flex items-center gap-1.5 text-white/85 text-xs sm:text-sm font-medium">
                    <MapPin size={14} className="text-[#FFC107] shrink-0" />
                    <span className="truncate max-w-xl">{place.address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation Tabs (Roadtripeado Gold Theme) */}
            <div className="flex border-b border-gray-100 bg-white sticky top-0 z-10 overflow-x-auto no-scrollbar shrink-0 px-4 sm:px-6">
              <div className="flex w-full gap-2">
                {dynamicTabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 py-3.5 px-3 text-xs font-bold uppercase tracking-wider transition-all relative cursor-pointer outline-none whitespace-nowrap ${
                        isActive
                          ? "text-black font-extrabold"
                          : "text-gray-500 hover:text-gray-900"
                      }`}
                    >
                      <span className={isActive ? "text-[#D97706]" : "text-gray-400"}>
                        {tab.icon}
                      </span>
                      <span>{tab.label}</span>
                      {isActive && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FFC107] rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content Area */}
            <ScrollArea className="flex-1 p-5 sm:p-6 bg-neutral-50/60">
              <div className="space-y-5 animate-in fade-in duration-200">
                {/* 1. OVERVIEW TAB */}
                {activeTab === "overview" && (
                  <div className="space-y-4">
                    {/* About This Place */}
                    {place.description && (
                      <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-2xs space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800">
                          <Info size={14} className="text-amber-600" />
                          <span>{t("place.about_this_place")}</span>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed font-normal">
                          {place.description}
                        </p>
                      </div>
                    )}

                    {/* Access & Directions */}
                    {place.access && (
                      <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-2xs space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800">
                          <Compass size={14} className="text-amber-600" />
                          <span>{t("place.access_and_getting_here")}</span>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed font-normal">
                          {place.access}
                        </p>
                      </div>
                    )}

                    {/* Tips & Recommendations */}
                    {place.recommendations?.tips && (
                      <div className="bg-white border border-amber-100 bg-amber-50/30 p-5 rounded-2xl shadow-2xs space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800">
                          <Lightbulb size={14} className="text-amber-600" />
                          <span>{t("place.tips")}</span>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed font-normal">
                          {place.recommendations.tips}
                        </p>
                      </div>
                    )}

                    {/* Operating Hours or Schedules */}
                    {place.type === "Business" && place.operatingHours ? (
                      <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-2xs space-y-3">
                        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800">
                          <Clock size={14} className="text-amber-600" />
                          <span>{t("place.business_hours")}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                            <span className="text-gray-500 font-medium">{t("place.daily_hours")}</span>
                            <span className="font-bold text-gray-900">
                              {place.operatingHours.openTime} - {place.operatingHours.closeTime}
                            </span>
                          </div>
                          {place.operatingHours.offDays && place.operatingHours.offDays.length > 0 && (
                            <div className="flex items-center justify-between p-3 rounded-xl bg-red-50/50 border border-red-100">
                              <span className="text-red-700 font-medium">{t("place.closed_days")}</span>
                              <span className="font-bold text-red-800">
                                {place.operatingHours.offDays.join(", ")}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      place.schedules && (
                        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-2xs space-y-2">
                          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800">
                            <Clock size={14} className="text-amber-600" />
                            <span>{t("place.schedules")}</span>
                          </div>
                          <p className="text-gray-700 text-sm leading-relaxed font-normal">
                            {place.schedules}
                          </p>
                        </div>
                      )
                    )}

                    {/* Key Specifications Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {/* Coordinates */}
                      <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-2xs space-y-1">
                        <div className="flex items-center gap-1.5 text-gray-400 text-xs font-bold uppercase tracking-wider">
                          <MapPin size={13} className="text-amber-600" />
                          <span>{t("place.coordinates")}</span>
                        </div>
                        <p className="text-xs font-mono font-bold text-gray-800 truncate">
                          {place?.location?.coordinates?.[1] !== undefined
                            ? place.location.coordinates[1].toFixed(4)
                            : "N/A"}
                          ,{" "}
                          {place?.location?.coordinates?.[0] !== undefined
                            ? place.location.coordinates[0].toFixed(4)
                            : "N/A"}
                        </p>
                      </div>

                      {/* Connected Map */}
                      <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-2xs space-y-1">
                        <div className="flex items-center gap-1.5 text-gray-400 text-xs font-bold uppercase tracking-wider">
                          <Navigation size={13} className="text-blue-600" />
                          <span>{t("place.connected_map")}</span>
                        </div>
                        <p className="text-xs font-bold text-gray-900 truncate">
                          {typeof place.map === "object" ? place.map.name : (t("place.general_map") || "General Map")}
                        </p>
                      </div>

                      {/* Difficulty */}
                      {place.difficulty && (
                        <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-2xs space-y-1">
                          <div className="flex items-center gap-1.5 text-gray-400 text-xs font-bold uppercase tracking-wider">
                            <Gauge size={13} className="text-emerald-600" />
                            <span>{t("place.difficulty")}</span>
                          </div>
                          <span
                            className={`inline-block text-[11px] font-bold uppercase px-2 py-0.5 rounded-md ${
                              place.difficulty === "Easy"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                                : place.difficulty === "Medium"
                                ? "bg-amber-50 text-amber-700 border border-amber-200/60"
                                : "bg-red-50 text-red-700 border border-red-200/60"
                            }`}
                          >
                            {getDifficultyLabel(place.difficulty)}
                          </span>
                        </div>
                      )}

                      {/* Walking / Hike Time */}
                      {place.hikeTime && (
                        <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-2xs space-y-1">
                          <div className="flex items-center gap-1.5 text-gray-400 text-xs font-bold uppercase tracking-wider">
                            <Clock size={13} className="text-indigo-600" />
                            <span>{t("place.walking_time")}</span>
                          </div>
                          <p className="text-xs font-bold text-gray-800">
                            {formatHikeTime(place.hikeTime)}
                          </p>
                        </div>
                      )}

                      {/* Entry Cost */}
                      {place.entryCost && (
                        <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-2xs space-y-1">
                          <div className="flex items-center gap-1.5 text-gray-400 text-xs font-bold uppercase tracking-wider">
                            <Coins size={13} className="text-amber-600" />
                            <span>{t("place.entry_cost")}</span>
                          </div>
                          <p className="text-xs font-bold text-gray-800">
                            {formatEntryCost(place.entryCost)}
                          </p>
                        </div>
                      )}

                      {/* Atmosphere */}
                      {place.atmosphere && (
                        <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-2xs space-y-1">
                          <div className="flex items-center gap-1.5 text-gray-400 text-xs font-bold uppercase tracking-wider">
                            <Sparkles size={13} className="text-rose-500" />
                            <span>{t("place.atmosphere")}</span>
                          </div>
                          <p className="text-xs font-bold text-gray-800 truncate">
                            {place.atmosphere}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Contact & External Links */}
                    {(place.phone || place.website || place.instagram) && (
                      <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-2xs space-y-3">
                        <div className="text-xs font-bold uppercase tracking-wider text-amber-800">
                          {t("place.contact_and_links")}
                        </div>
                        <div className="flex flex-wrap gap-3 text-xs">
                          {place.phone && (
                            <a
                              href={`tel:${place.phone}`}
                              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-800 font-semibold border border-gray-200 transition-colors"
                            >
                              <Phone size={13} className="text-emerald-600" />
                              <span>{place.phone}</span>
                            </a>
                          )}

                          {place.website && (
                            <a
                              href={place.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-800 font-semibold border border-gray-200 transition-colors"
                            >
                              <Globe size={13} className="text-blue-600" />
                              <span>{t("place.visit_website")}</span>
                              <ExternalLink size={11} className="text-gray-400" />
                            </a>
                          )}

                          {place.instagram && (
                            <a
                              href={`https://instagram.com/${place.instagram.replace("@", "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-pink-50 hover:bg-pink-100/80 text-pink-800 font-semibold border border-pink-200 transition-colors"
                            >
                              <Instagram size={13} className="text-pink-600" />
                              <span>{place.instagram}</span>
                              <ExternalLink size={11} className="text-pink-400" />
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. MENU & PRICES TAB */}
                {activeTab === "menu" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        <Utensils className="text-[#D97706]" size={16} />
                        <span>{t("place.menu_pricing_photos")}</span>
                      </h3>
                      {place?.menuImages && place.menuImages.length > 0 && (
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900">
                          {place.menuImages.length} {t("place.photos")}
                        </span>
                      )}
                    </div>

                    {place?.menuImages && place.menuImages.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {place.menuImages.map((image: string, index: number) => (
                          <div
                            key={index}
                            className="relative aspect-square rounded-2xl overflow-hidden bg-white border border-gray-200 cursor-pointer group shadow-2xs hover:shadow-md transition-all"
                            onClick={() => window.open(getImageUrl(image), "_blank")}
                          >
                            <img
                              src={getImageUrl(image)}
                              alt={`Menu ${index + 1}`}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="text-xs font-bold text-white bg-black/60 px-3 py-1 rounded-full backdrop-blur-xs flex items-center gap-1">
                                <ExternalLink size={12} />
                                {t("place.view_full")}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-white border border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2">
                        <Utensils size={24} className="text-gray-300" />
                        <p className="text-xs text-gray-500 font-medium">
                          {t("place.no_menu")}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. ACCESSIBILITY TAB */}
                {activeTab === "accessibility" && (
                  <div className="space-y-4">
                    <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-2xs space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800">
                        {t("place.accessibility_features")}
                      </h3>
                      {place.accessibility?.features && place.accessibility.features.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {place.accessibility.features.map((feature: string) => (
                            <div
                              key={feature}
                              className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-800 text-xs font-semibold"
                            >
                              <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
                                <Accessibility size={14} />
                              </div>
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500 italic">
                          {t("place.no_accessibility_features")}
                        </p>
                      )}
                    </div>

                    {place.accessibility?.notes && (
                      <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-2xs space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                          {t("place.additional_notes")}
                        </h4>
                        <p className="text-xs text-gray-700 leading-relaxed">
                          {place.accessibility.notes}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* 4. SERVICES TAB */}
                {activeTab === "services" && (
                  <div className="space-y-4">
                    <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-2xs space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800">
                        {t("place.services_available")}
                      </h3>
                      {place.services && place.services.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {place.services.map((service: string) => (
                            <div
                              key={service}
                              className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex flex-col items-center justify-center gap-2 text-center"
                            >
                              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center">
                                {servicesIcons[service] || <Info size={16} />}
                              </div>
                              <span className="text-xs font-bold text-gray-800">
                                {serviceKeyMap[service] ? t(`services.${serviceKeyMap[service]}`) : service}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500 italic text-center py-6">
                          {t("place.no_services_listed")}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* 5. REVIEWS TAB */}
                {activeTab === "reviews" && (
                  <div className="space-y-4">
                    {isReviewsLoading ? (
                      <div className="flex justify-center py-10">
                        <div className="w-8 h-8 border-2 border-[#FFC107] border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : reviews?.data && reviews.data.length > 0 ? (
                      <div className="space-y-4">
                        {/* Rating Summary Card */}
                        <div className="flex items-center gap-5 bg-white border border-gray-100 p-5 rounded-2xl shadow-2xs">
                          <div className="text-center pr-5 border-r border-gray-100 shrink-0">
                            <div className="text-3xl font-black text-gray-950 leading-none">
                              {(
                                reviews.data.reduce(
                                  (acc: number, rev: any) => acc + rev.rating,
                                  0
                                ) / reviews.data.length
                              ).toFixed(1)}
                            </div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                              {t("reviews.average")}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex text-amber-400 gap-0.5">
                              {Array(5)
                                .fill(0)
                                .map((_, i) => (
                                  <Star
                                    key={i}
                                    size={14}
                                    className="fill-amber-400 text-amber-400"
                                  />
                                ))}
                            </div>
                            <p className="text-xs text-gray-500 font-medium">
                              {(t("reviews.based_on_customer_reviews") || "Based on {count} customer reviews").replace("{count}", String(reviews.data.length))}
                            </p>
                          </div>
                        </div>

                        {/* Reviews List */}
                        <div className="space-y-3">
                          {reviews.data.map((review: any) => (
                            <div
                              key={review._id}
                              className="bg-white border border-gray-100 p-4 sm:p-5 rounded-2xl space-y-3 shadow-2xs"
                            >
                              <div className="flex justify-between items-start gap-4">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-9 w-9 border border-gray-100">
                                    <AvatarImage
                                      src={getImageUrl(review?.reviewer?.profile)}
                                    />
                                    <AvatarFallback className="bg-amber-100 text-amber-900 font-bold text-xs">
                                      {review?.reviewer?.name?.charAt(0) || "U"}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="text-xs font-bold text-gray-900">
                                      {review?.reviewer?.name || t("reviews.anonymous_user")}
                                    </p>
                                    <div className="flex items-center gap-1 text-[10px] text-gray-400">
                                      <Calendar size={10} />
                                      {new Date(review.createdAt).toLocaleDateString()}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex gap-0.5 text-amber-400 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">
                                  {Array(5)
                                    .fill(0)
                                    .map((_, i) => (
                                      <Star
                                        key={i}
                                        size={11}
                                        className={
                                          i < review.rating
                                            ? "fill-amber-400 text-amber-400"
                                            : "text-gray-200"
                                        }
                                      />
                                    ))}
                                </div>
                              </div>

                              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed bg-gray-50/70 p-3 rounded-xl border border-gray-100">
                                {review.review}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-white border border-dashed border-gray-200 rounded-2xl space-y-2">
                        <MessageSquare className="mx-auto h-8 w-8 text-gray-300" />
                        <p className="text-xs text-gray-500 font-medium">
                          {t("reviews.no_reviews_yet_place")}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </ScrollArea>
          </>
        ) : (
          <div className="p-12 text-center text-gray-400 bg-gray-50 flex-1 flex items-center justify-center">
            {t("place.failed_to_load")}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
