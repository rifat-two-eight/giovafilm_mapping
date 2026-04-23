"use client";

import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetPlaceDetailsQuery } from "@/redux/features/place/placeApi";
import {
  Accessibility,
  Baby,
  Car,
  Dog,
  Info,
  MapPin,
  MessageSquare,
  Play,
  ToolCase,
  Users,
  Utensils,
  Wifi,
} from "lucide-react";
import { useState } from "react";

interface ViewPlaceModalProps {
  placeId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TABS = [
  { id: "overview", label: "Overview", icon: <Info size={16} /> },
  { id: "media", label: "Media", icon: <Play size={16} /> },
  {
    id: "accessibility",
    label: "Accessibility",
    icon: <Accessibility size={16} />,
  },
  { id: "services", label: "Services", icon: <ToolCase size={16} /> },
  { id: "recommendations", label: "Tips", icon: <MessageSquare size={16} /> },
];

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
  const [activeTab, setActiveTab] = useState("overview");

  const place = response?.data;

  const servicesIcons: Record<string, React.ReactNode> = {
    Parking: <Car size={18} />,
    Restrooms: <Users size={18} />,
    "Food Nearby": <Utensils size={18} />,
    "Guided Tour": <MapPin size={18} />,
    "Family Friendly": <Baby size={18} />,
    Wifi: <Wifi size={18} />,
    "Pet Friendly": <Dog size={18} />,
  };

  const renderMedia = () => {
    const images = place?.images || [];
    if (images.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 text-gray-400">
          <Play size={48} strokeWidth={1} className="mb-2 opacity-20" />
          <p className="text-sm">No media available for this place</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-4">
        {images.map((img: string, index: number) => {
          const isVideo = img.match(/\.(mp4|webm|ogg)$/i);
          return (
            <div
              key={index}
              className="relative aspect-video rounded-xl overflow-hidden bg-black group shadow-sm border border-gray-100"
            >
              {isVideo ? (
                <video
                  src={img}
                  className="w-full h-full object-cover"
                  controls
                />
              ) : (
                <img
                  src={img}
                  alt={`Media ${index}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[80vh] flex flex-col p-0 overflow-hidden border-none shadow-2xl rounded-2xl">
        {isLoading ? (
          <div className="p-8 space-y-6">
            <Skeleton className="h-12 w-3/4" />
            <div className="flex gap-4">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-24" />
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
        ) : place ? (
          <>
            <div className="relative h-48 w-full bg-gradient-to-br from-blue-600 to-indigo-700 p-8 flex flex-col justify-end">
              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold uppercase tracking-wider">
                {place.status}
              </div>
              <div className="space-y-2">
                <Badge
                  variant="secondary"
                  className="bg-white/90 text-blue-700 hover:bg-white border-none shadow-sm"
                >
                  {typeof place.category === "object"
                    ? place?.category?.name
                    : "Place"}
                </Badge>
                <DialogTitle className="text-4xl font-black text-white tracking-tight leading-tight">
                  {place.name}
                </DialogTitle>
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <MapPin size={14} />
                  <span className="truncate">{place.address}</span>
                </div>
              </div>
            </div>

            <div className="flex border-b border-gray-100 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 text-xs font-bold uppercase tracking-widest transition-all relative ${
                    activeTab === tab.id
                      ? "text-blue-600"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-t-full shadow-[0_-2px_8px_rgba(37,99,235,0.3)]" />
                  )}
                </button>
              ))}
            </div>

            <ScrollArea className="flex-1 p-8 bg-gray-50/30">
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {activeTab === "overview" && (
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
                        About this place
                      </h3>
                      <p className="text-gray-600 leading-relaxed italic text-sm bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                        {place.description || "No description provided."}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">
                          Position
                        </h3>
                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-2">
                          <p className="text-xs font-medium text-gray-500">
                            Coordinates
                          </p>
                          <p className="text-sm font-mono text-blue-600">
                            {place.location.coordinates[1].toFixed(6)},{" "}
                            {place.location.coordinates[0].toFixed(6)}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">
                          Map
                        </h3>
                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-2">
                          <p className="text-xs font-medium text-gray-500">
                            Connected to
                          </p>
                          <p className="text-sm font-bold text-gray-900">
                            {typeof place.map === "object"
                              ? place.map.name
                              : "General Map"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "media" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <div className="w-1.5 h-6 bg-purple-500 rounded-full" />
                      Gallery & Videos
                    </h3>
                    {renderMedia()}
                  </div>
                )}

                {activeTab === "accessibility" && (
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-green-500 rounded-full" />
                        Accessibility Features
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {place.accessibility?.features?.length > 0 ? (
                          place.accessibility.features.map(
                            (feature: string) => (
                              <div
                                key={feature}
                                className="flex items-center gap-3 p-3 bg-green-50/50 border border-green-100 rounded-xl text-green-700 text-xs font-bold uppercase tracking-wider"
                              >
                                <div className="bg-green-100 p-1.5 rounded-lg">
                                  <Accessibility size={14} />
                                </div>
                                {feature}
                              </div>
                            ),
                          )
                        ) : (
                          <div className="col-span-2 text-gray-400 text-sm italic py-4 text-center border-2 border-dashed border-gray-100 rounded-xl">
                            No special accessibility features listed
                          </div>
                        )}
                      </div>
                    </div>
                    {place.accessibility?.notes && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-black uppercase tracking-widest text-gray-400">
                          Additional Notes
                        </h4>
                        <div className="p-4 bg-white rounded-xl border border-gray-100 italic text-sm text-gray-600">
                          {place.accessibility.notes}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "services" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <div className="w-1.5 h-6 bg-yellow-500 rounded-full" />
                      Available Services
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      {place.services?.length > 0 ? (
                        place.services.map((service: string) => (
                          <div
                            key={service}
                            className="p-4 bg-white border border-gray-100 rounded-2xl flex flex-col items-center gap-3 shadow-sm hover:shadow-md transition-shadow"
                          >
                            <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600">
                              {servicesIcons[service] || <Info size={20} />}
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-tighter text-gray-600 text-center leading-tight">
                              {service}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-3 text-gray-400 text-sm italic py-8 text-center border-2 border-dashed border-gray-100 rounded-2xl">
                          No services specified
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "recommendations" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <div className="w-1.5 h-6 bg-red-500 rounded-full" />
                      Local Tips & Recommendations
                    </h3>
                    <div className="bg-red-50/30 p-8 rounded-3xl border border-red-100 relative group overflow-hidden">
                      <MessageSquare className="absolute -bottom-4 -right-4 w-32 h-32 text-red-100 rotate-12 transition-transform duration-700 group-hover:scale-110" />
                      <div className="relative z-10">
                        <h4 className="text-red-700 font-bold mb-4 flex items-center gap-2">
                          <MessageSquare size={18} />
                          Expert Advice
                        </h4>
                        <p className="text-gray-700 leading-relaxed italic text-sm">
                          {place.details?.recommendations ||
                            place.recommendations ||
                            "No recommendations yet. Be the first to add one!"}
                        </p>
                      </div>
                    </div>

                    <div className="p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                      <h4 className="text-indigo-700 font-bold mb-2 text-sm uppercase tracking-wider">
                        Access Details
                      </h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {place.details?.access ||
                          "Public access available during standard hours."}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </>
        ) : (
          <div className="p-8 text-center text-gray-400">
            Failed to load place details
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
