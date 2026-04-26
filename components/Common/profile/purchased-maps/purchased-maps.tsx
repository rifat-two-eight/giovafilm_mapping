"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Compass,
  Droplets,
  Mountain,
  ShieldCheck,
} from "lucide-react";
import PurchasedMapsCard from "./purchased-maps-card";
import { useGetPurchasedMapsQuery } from "@/redux/features/map/mapApi";

const purchasedMaps = [
  {
    id: 1,
    title: "PUERTO RICO ADVENTURE",
    badge: "PREMIUM ACCESS",
    badgeColor: "bg-yellow-100 text-yellow-700",
    info: "Last updated 2 days ago",
    image:
      "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80&w=400",
    status: "active",
    offline: true,
    icon: ShieldCheck,
    iconColor: "text-yellow-500",
  },
  {
    id: 2,
    title: "SAN JUAN HISTORIC",
    badge: "VERIFIED GUIDE",
    badgeColor: "bg-blue-100 text-blue-700",
    info: "1.2 GB • Ready for offline",
    image:
      "https://images.unsplash.com/photo-1589308454676-435948967982?auto=format&fit=crop&q=80&w=400",
    status: "active",
    offline: true,
    icon: Compass,
    iconColor: "text-gray-400",
  },
  {
    id: 3,
    title: "HIDDEN WATERFALLS",
    badge: "EXPLORER PACK",
    badgeColor: "bg-emerald-100 text-emerald-700",
    info: "85% Downloaded...",
    image:
      "https://images.unsplash.com/photo-1433086566608-e93777ef39c1?auto=format&fit=crop&q=80&w=400",
    status: "active",
    offline: false,
    icon: Droplets,
    iconColor: "text-emerald-500",
  },
  {
    id: 4,
    title: "MOUNTAIN TRAILS",
    badge: "INACTIVE",
    badgeColor: "bg-gray-100 text-gray-500",
    info: "Click to renew subscription",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=400",
    status: "inactive",
    offline: false,
    icon: Mountain,
    iconColor: "text-gray-300",
  },
];

export default function PurchasedMapsPage() {
  const [activeTab, setActiveTab] = useState("All Maps");

  const { data, isLoading, error } = useGetPurchasedMapsQuery();
  console.log(data);

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      <main className="flex-1 max-w-[1440px] mx-auto w-full px-6 py-12">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b pb-4 mb-4">
          <div>
            <h1 className="text-4xl font-black font-public-sans text-gray-900 mb-2">
              Purchased Maps
            </h1>
            <p className="text-gray-500/80 text-lg font-public-sans">
              Manage and access your offline adventure guides
            </p>
          </div>
          <Button className="bg-[#FFC107] hover:bg-[#FFB300] text-black font-bold rounded-lg px-10 h-14 text-base shadow-lg shadow-yellow-500/20">
            <Compass size={20} />
            Browse More Maps
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-8 border-b border-gray-200 mb-8">
          {["All Maps", "Active", "Inactive"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4  font-public-sans transition-all relative ${
                activeTab === tab
                  ? "text-yellow-500 font-bold"
                  : "text-gray-400 hover:text-gray-600 font-medium"
              }`}
            >
              {tab}{" "}
              {tab === "All Maps" && (
                <span className="ml-1 text-[10px] opacity-60">12</span>
              )}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-500 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Map List */}
        <div className="space-y-4 mb-12">
          {purchasedMaps?.map((map) => (
            <PurchasedMapsCard key={map.id} map={map} />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2">
          <button className="w-10 h-10 rounded-xl border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-white hover:shadow-sm transition-all">
            <ChevronLeft size={20} />
          </button>
          {[1, 2, 3].map((page) => (
            <button
              key={page}
              className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                page === 1
                  ? "bg-[#FFC107] text-black shadow-lg shadow-yellow-500/20"
                  : "bg-white border border-gray-100 text-gray-400 hover:border-gray-200"
              }`}
            >
              {page}
            </button>
          ))}
          <button className="w-10 h-10 rounded-xl border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-white hover:shadow-sm transition-all">
            <ChevronRight size={20} />
          </button>
        </div>
      </main>
    </div>
  );
}
