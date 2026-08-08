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
import { getImageUrl } from "@/lib/utils";
import { useGetPlaceDetailsQuery } from "@/redux/features/place/placeApi";
import { useGetReviewsByPlaceQuery } from "@/redux/features/review/reviewApi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Accessibility,
  Baby,
  Calendar,
  Car,
  Clock,
  Coins,
  Compass,
  Dog,
  Gauge,
  Globe,
  Heart,
  Info,
  Instagram,
  MapPin,
  MessageSquare,
  Phone,
  Play,
  Sparkles,
  Star,
  ToolCase,
  Users,
  Utensils,
  Wifi,
  X,
} from "lucide-react";
import Image from "next/image";
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
  const { data: response, isLoading } = useGetPlaceDetailsQuery(
    placeId as string,
    {
      skip: !placeId,
    },
  );
  const { data: reviews, isLoading: isReviewsLoading } =
    useGetReviewsByPlaceQuery(placeId as string, {
      skip: !placeId,
    });

  const [activeTab, setActiveTab] = useState("overview");

  const place = response?.data;

  const isBusinessOrRestaurant = place?.type === "Business" || 
    (typeof place?.category === "object" ? place?.category?.name : "")?.toLowerCase() === "restaurant";

  const dynamicTabs = [
    { id: "overview", label: "Overview", icon: <Info size={16} /> },
    ...(isBusinessOrRestaurant ? [{ id: "menu", label: "Menu & Prices", icon: <Utensils size={16} /> }] : []),
    {
      id: "accessibility",
      label: "Accessibility",
      icon: <Accessibility size={16} />,
    },
    { id: "services", label: "Services", icon: <ToolCase size={16} /> },
    { id: "reviews", label: "Reviews", icon: <MessageSquare size={16} /> },
  ];

  useEffect(() => {
    if (place && !isBusinessOrRestaurant && activeTab === "menu") {
      setActiveTab("overview");
    }
  }, [place, isBusinessOrRestaurant, activeTab]);

  const servicesIcons: Record<string, React.ReactNode> = {
    Parking: <Car size={18} />,
    Restrooms: <Users size={18} />,
    "Food Nearby": <Utensils size={18} />,
    "Guided Tour": <MapPin size={18} />,
    "Family Friendly": <Baby size={18} />,
    Wifi: <Wifi size={18} />,
    "Pet Friendly": <Dog size={18} />,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="max-w-4xl h-[80vh] flex flex-col gap-0 p-0 overflow-hidden border-none shadow-2xl rounded-2xl bg-white text-gray-900">
        {isLoading ? (
          <div className="p-8 space-y-6 flex-1 flex flex-col justify-center items-center bg-gray-50">
            <div className="w-12 h-12 rounded-full border-4 border-blue-500/30 border-t-blue-600 animate-spin mb-4" />
            <p className="text-sm text-gray-500">Loading place details...</p>
          </div>
        ) : place ? (
          <>
            {/* Header Area with Hero Carousel */}
            <div className="relative h-56 w-full overflow-hidden group flex-shrink-0">
              {/* Custom Close Button - Positioned on top of everything */}
              <button
                onClick={() => onOpenChange(false)}
                className="absolute top-4 right-4 z-[99] p-1.5 rounded-full bg-black/50 hover:bg-black/75 text-white transition-all backdrop-blur-md shadow-md"
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>

              <Carousel className="absolute inset-0 w-full h-full">
                <CarouselContent className="h-full ml-0">
                  {place?.media?.length > 0 ? (
                    place.media.map((media: string, index: number) => (
                      <CarouselItem key={index} className="pl-0 h-full">
                        <div className="relative w-full h-full">
                          <Image
                            src={getImageUrl(media)}
                            alt={`media ${index}`}
                            unoptimized
                            width={1200}
                            height={600}
                            className="object-cover w-full h-full filter brightness-[0.85]"
                          />
                        </div>
                      </CarouselItem>
                    ))
                  ) : (
                    <CarouselItem className="pl-0 h-full">
                      <div className="w-full h-full bg-gradient-to-tr from-blue-50 via-indigo-50 to-blue-100 flex items-center justify-center">
                        <Utensils className="w-20 h-20 text-blue-200" />
                      </div>
                    </CarouselItem>
                  )}
                </CarouselContent>

                {place?.media?.length > 1 && (
                  <>
                    <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/60 hover:bg-white/80 border-none text-gray-800 transition-all size-9" />
                    <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/60 hover:bg-white/80 border-none text-gray-800 transition-all size-9" />
                  </>
                )}
              </Carousel>

              {/* Gradient Bottom Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent z-10" />

              {/* Floating Details Overlay */}
              <div className="absolute bottom-0 left-0 w-full p-6 z-20 flex flex-col justify-end">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-blue-600 text-white border-none shadow-sm font-bold text-[10px] tracking-wider uppercase px-2.5 py-0.5 rounded-md">
                      {typeof place.category === "object" ? place?.category?.name : "Place"}
                    </Badge>
                    {place.type === "Business" && (
                      <Badge className="bg-amber-500 text-white border-none shadow-sm font-bold text-[10px] tracking-wider uppercase px-2.5 py-0.5 rounded-md">
                        Business
                      </Badge>
                    )}
                    {(place.rating || place.totalReview) && (
                      <div className="flex items-center gap-1 text-amber-400 bg-black/40 border border-amber-400/20 px-2 py-0.5 rounded-md text-[10px] font-bold backdrop-blur-sm">
                        <span>⭐</span>
                        <span>{place.rating || 0}</span>
                        <span className="text-white/80 font-normal ml-0.5">({place.totalReview || 0})</span>
                      </div>
                    )}
                  </div>

                  <DialogTitle className="text-3xl font-black tracking-tight leading-tight text-white drop-shadow-md">
                    {place.name}
                  </DialogTitle>

                  <div className="flex items-center gap-1.5 text-white/85 text-xs mt-0.5">
                    <MapPin size={13} className="text-blue-400" />
                    <span className="truncate max-w-[90%] font-medium">{place.address}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs (Line Style matching Website Theme) */}
            <div className="flex border-b border-gray-100 bg-white sticky top-0 z-10 overflow-x-auto no-scrollbar flex-shrink-0">
              <div className="flex w-full min-w-max">
                {dynamicTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 min-w-[125px] flex items-center justify-center gap-2 py-4 text-xs font-bold uppercase tracking-widest transition-all relative ${
                      activeTab === tab.id
                        ? "text-blue-600"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-t-full shadow-[0_-2px_8px_rgba(37,99,235,0.3)]" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Area */}
            <ScrollArea className="flex-1 p-6 bg-gray-50/30">
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    {/* Description */}
                    <div className="bg-white border border-gray-100 p-5 rounded-2xl space-y-2.5 shadow-sm">
                      <h3 className="text-xs font-black uppercase tracking-widest text-blue-600">
                        About this place
                      </h3>
                      <p className="text-gray-700 leading-relaxed text-sm font-medium italic">
                        &ldquo;{place.description || "No description provided."}&rdquo;
                      </p>
                    </div>

                    {/* Access & Directions */}
                    {place.access && (
                      <div className="bg-white border border-gray-100 p-5 rounded-2xl space-y-2.5 shadow-sm">
                        <h3 className="text-xs font-black uppercase tracking-widest text-blue-600 flex items-center gap-1.5">
                          <Compass size={14} className="text-blue-500" />
                          Access & Directions
                        </h3>
                        <p className="text-gray-700 leading-relaxed text-xs font-medium">
                          {place.access}
                        </p>
                      </div>
                    )}

                    {/* Tips & Recommendations */}
                    {place.recommendations?.tips && (
                      <div className="bg-white border border-gray-100 p-5 rounded-2xl space-y-2.5 shadow-sm">
                        <h3 className="text-xs font-black uppercase tracking-widest text-blue-600 flex items-center gap-1.5">
                          <Heart size={14} className="text-pink-500" />
                          Tips & Recommendations
                        </h3>
                        <p className="text-gray-700 leading-relaxed text-xs font-medium">
                          {place.recommendations.tips}
                        </p>
                      </div>
                    )}

                    {/* Operating Hours or Schedules */}
                    {place.type === "Business" && place.operatingHours ? (
                      <div className="bg-white border border-gray-100 p-5 rounded-2xl space-y-3 shadow-sm">
                        <h3 className="text-xs font-black uppercase tracking-widest text-blue-600 flex items-center gap-1.5">
                          <Clock size={14} className="text-blue-500" />
                          Operating Hours
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-gray-700">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400">Hours:</span>
                            <span className="text-gray-900 bg-gray-50 px-2 py-1 rounded">
                              {place.operatingHours.openTime} - {place.operatingHours.closeTime}
                            </span>
                          </div>
                          {place.operatingHours.offDays?.length > 0 && (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400">Closed Days:</span>
                              <span className="text-red-600 bg-red-50 px-2 py-1 rounded">
                                {place.operatingHours.offDays.join(", ")}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      place.schedules && (
                        <div className="bg-white border border-gray-100 p-5 rounded-2xl space-y-2.5 shadow-sm">
                          <h3 className="text-xs font-black uppercase tracking-widest text-blue-600 flex items-center gap-1.5">
                            <Clock size={14} className="text-blue-500" />
                            Schedules
                          </h3>
                          <p className="text-gray-700 leading-relaxed text-xs font-medium">
                            {place.schedules}
                          </p>
                        </div>
                      )
                    )}

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {/* Coordinates */}
                      <div className="bg-white border border-gray-100 p-4 rounded-xl space-y-1.5 shadow-sm">
                        <div className="flex items-center gap-2 text-blue-500">
                          <MapPin size={14} />
                          <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Coordinates</span>
                        </div>
                        <p className="text-[11px] font-mono font-bold text-gray-800">
                          {place?.location?.coordinates?.[1] !== undefined ? place.location.coordinates[1].toFixed(5) : "N/A"},{" "}
                          {place?.location?.coordinates?.[0] !== undefined ? place.location.coordinates[0].toFixed(5) : "N/A"}
                        </p>
                      </div>

                      {/* Connected Map */}
                      <div className="bg-white border border-gray-100 p-4 rounded-xl space-y-1.5 shadow-sm">
                        <div className="flex items-center gap-2 text-purple-500">
                          <Info size={14} />
                          <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Connected Map</span>
                        </div>
                        <p className="text-[11px] font-bold text-gray-800 truncate">
                          {typeof place.map === "object" ? place.map.name : "General Map"}
                        </p>
                      </div>

                      {/* Difficulty */}
                      {place.difficulty && (
                        <div className="bg-white border border-gray-100 p-4 rounded-xl space-y-1.5 shadow-sm">
                          <div className="flex items-center gap-2 text-emerald-500">
                            <Gauge size={14} />
                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Difficulty</span>
                          </div>
                          <span className={`inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                            place.difficulty === "Easy" ? "bg-emerald-50 text-emerald-700" :
                            place.difficulty === "Medium" ? "bg-amber-50 text-amber-700" :
                            "bg-red-50 text-red-700"
                          }`}>
                            {place.difficulty}
                          </span>
                        </div>
                      )}

                      {/* Hike Time */}
                      {place.hikeTime && (
                        <div className="bg-white border border-gray-100 p-4 rounded-xl space-y-1.5 shadow-sm">
                          <div className="flex items-center gap-2 text-indigo-500">
                            <Clock size={14} />
                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Hike Time</span>
                          </div>
                          <p className="text-[11px] font-bold text-gray-800">
                            {place.hikeTime}
                          </p>
                        </div>
                      )}

                      {/* Entry Cost */}
                      {place.entryCost && (
                        <div className="bg-white border border-gray-100 p-4 rounded-xl space-y-1.5 shadow-sm">
                          <div className="flex items-center gap-2 text-amber-500">
                            <Coins size={14} />
                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Entry Cost</span>
                          </div>
                          <p className="text-[11px] font-bold text-gray-800">
                            {place.entryCost}
                          </p>
                        </div>
                      )}

                      {/* Atmosphere */}
                      {place.atmosphere && (
                        <div className="bg-white border border-gray-100 p-4 rounded-xl space-y-1.5 shadow-sm">
                          <div className="flex items-center gap-2 text-rose-500">
                            <Sparkles size={14} />
                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Atmosphere</span>
                          </div>
                          <p className="text-[11px] font-bold text-gray-800">
                            {place.atmosphere}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Contact details */}
                    {(place.phone || place.website || place.instagram) && (
                      <div className="bg-white border border-gray-100 p-5 rounded-2xl space-y-3 shadow-sm">
                        <h3 className="text-xs font-black uppercase tracking-widest text-blue-600">
                          Contact & Links
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold text-gray-700">
                          {place.phone && (
                            <div className="flex items-center gap-2">
                              <Phone size={14} className="text-blue-500" />
                              <a href={`tel:${place.phone}`} className="hover:text-blue-600 transition-colors">
                                {place.phone}
                              </a>
                            </div>
                          )}
                          {place.website && (
                            <div className="flex items-center gap-2">
                              <Globe size={14} className="text-blue-500" />
                              <a href={place.website} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors truncate max-w-[150px]">
                                Visit Website
                              </a>
                            </div>
                          )}
                          {place.instagram && (
                            <div className="flex items-center gap-2">
                              <Instagram size={14} className="text-pink-500" />
                              <a href={`https://instagram.com/${place.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors truncate max-w-[150px]">
                                {place.instagram}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "menu" && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                      <h3 className="text-sm font-bold text-gray-855 flex items-center gap-2">
                        <Utensils className="text-blue-500" size={16} />
                        Menu & Pricing Photos
                      </h3>
                      {place?.menuImages?.length > 0 && (
                        <span className="text-[10px] bg-gray-100 border border-gray-200 text-gray-650 px-2 py-0.5 rounded-full font-bold">
                          {place.menuImages.length} Photos
                        </span>
                      )}
                    </div>
                    {place?.menuImages && place.menuImages.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {place.menuImages.map((image: string, index: number) => (
                          <div
                            key={index}
                            className="relative aspect-square rounded-2xl overflow-hidden bg-white border border-gray-200 cursor-zoom-in group transition-all duration-300 hover:border-blue-500/50 shadow-sm"
                            onClick={() => window.open(getImageUrl(image), "_blank")}
                          >
                            <img
                              src={getImageUrl(image)}
                              alt={`Menu ${index + 1}`}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                              <span className="text-[9px] font-bold uppercase tracking-widest text-white bg-blue-600 px-2 py-0.5 rounded-md">
                                Open Full Size
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-white border border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                          <Utensils size={20} />
                        </div>
                        <p className="text-xs text-gray-500 italic">
                          No menu or price list has been uploaded yet.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "accessibility" && (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <h3 className="text-xs font-black uppercase tracking-widest text-gray-450">
                        Accessibility Features
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {place.accessibility?.features?.length > 0 ? (
                          place.accessibility.features.map((feature: string) => (
                            <div
                              key={feature}
                              className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl text-gray-700 text-xs font-bold uppercase tracking-wider shadow-sm"
                            >
                              <div className="bg-emerald-50 p-1.5 rounded-lg text-emerald-600">
                                <Accessibility size={14} />
                              </div>
                              <span>{feature}</span>
                            </div>
                          ))
                        ) : (
                          <div className="col-span-2 text-gray-400 text-xs italic py-6 text-center border border-dashed border-gray-200 rounded-2xl bg-white">
                            No special accessibility features listed
                          </div>
                        )}
                      </div>
                    </div>
                    {place.accessibility?.notes && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-black uppercase tracking-widest text-gray-400">
                          Additional Notes
                        </h4>
                        <div className="p-4 bg-white border border-gray-200 rounded-2xl italic text-xs text-gray-600 leading-relaxed shadow-sm">
                          {place.accessibility.notes}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "services" && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-gray-455">
                      Available Services
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {place.services?.length > 0 ? (
                        place.services.map((service: string) => (
                          <div
                            key={service}
                            className="p-4 bg-white border border-gray-200 rounded-2xl flex flex-col items-center gap-2.5 shadow-sm hover:border-blue-500/20 transition-all text-center"
                          >
                            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                              {servicesIcons[service] || <Info size={16} />}
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-wider text-gray-605 leading-none">
                              {service}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-3 text-gray-400 text-xs italic py-8 text-center border border-dashed border-gray-200 rounded-2xl bg-white">
                          No services specified
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-gray-455">
                      Customer Reviews
                    </h3>
                    {isReviewsLoading ? (
                      <div className="flex justify-center py-6">
                        <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-400 rounded-full animate-spin" />
                      </div>
                    ) : reviews && reviews?.data?.length > 0 ? (
                      <div className="space-y-4">
                        {/* Rating Summary Card */}
                        <div className="flex items-center gap-6 bg-white border border-gray-200 p-5 rounded-2xl shadow-sm">
                          <div className="text-center pr-6 border-r border-gray-255 flex-shrink-0">
                            <h4 className="text-3xl font-black text-gray-900 leading-none">
                              {(
                                reviews?.data?.reduce(
                                  (acc: number, rev: any) => acc + rev.rating,
                                  0,
                                ) / reviews?.data?.length
                              ).toFixed(1)}
                            </h4>
                            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                              Average Rating
                            </p>
                          </div>
                          <div>
                            <div className="flex text-amber-400 gap-0.5 mb-1.5">
                              {Array(5)
                                .fill(0)
                                .map((_, i) => (
                                  <Star
                                    key={i}
                                    size={14}
                                    fill={
                                      i <
                                      Math.round(
                                        reviews?.data?.reduce(
                                          (acc: number, rev: any) =>
                                            acc + rev.rating,
                                          0,
                                        ) / reviews?.data?.length,
                                      )
                                        ? "currentColor"
                                        : "none"
                                    }
                                  />
                                ))}
                            </div>
                            <p className="text-xs text-gray-500 font-medium">
                              Based on {reviews?.data?.length} reviews
                            </p>
                          </div>
                        </div>

                        {/* Reviews List */}
                        <div className="space-y-3">
                          {reviews?.data?.map((review: any) => (
                            <div
                              key={review._id}
                              className="bg-white border border-gray-200 p-4 rounded-2xl space-y-3 shadow-sm"
                            >
                              <div className="flex justify-between items-start gap-4">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-9 w-9 border border-gray-100">
                                    <AvatarImage
                                      src={getImageUrl(review?.reviewer?.profile)}
                                    />
                                    <AvatarFallback className="bg-gray-100 text-gray-600 font-semibold text-xs">
                                      {review?.reviewer?.name?.charAt(0) || "U"}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="space-y-0.5">
                                    <p className="text-xs font-bold text-gray-800">
                                      {review?.reviewer?.name || "Anonymous"}
                                    </p>
                                    <div className="flex items-center gap-1 text-[8px] text-gray-400 uppercase font-bold tracking-wider">
                                      <Calendar size={8} />
                                      {new Date(review.createdAt).toLocaleDateString()}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-0.5 text-amber-400 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-lg">
                                  {Array(5)
                                    .fill(0)
                                    .map((_, i) => (
                                      <Star
                                        key={i}
                                        size={10}
                                        fill={i < review.rating ? "currentColor" : "none"}
                                      />
                                    ))}
                                </div>
                              </div>
                              <p className="text-xs text-gray-650 leading-relaxed italic bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                                &ldquo;{review.review}&rdquo;
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-10 bg-white border border-dashed border-gray-200 rounded-2xl">
                        <MessageSquare className="mx-auto h-10 w-10 text-gray-300 mb-2" />
                        <p className="text-xs text-gray-400 italic">
                          No reviews yet for this place.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </ScrollArea>
          </>
        ) : (
          <div className="p-8 text-center text-gray-400 bg-gray-50 flex-1 flex items-center justify-center">
            Failed to load place details
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
