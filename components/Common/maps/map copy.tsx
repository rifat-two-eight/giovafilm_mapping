"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Bed,
  Coffee,
  Cross,
  Heart,
  MapPin,
  Plane,
  Star,
  Utensils,
  X,
} from "lucide-react";
import Link from "next/link";

export const markers = [
  {
    id: 1,
    top: "20%",
    left: "30%",
    icon: Coffee,
    color: "bg-yellow-500",
    name: "Old San Juan Coffee",
    rating: 4.8,
    reviews: 210,
    type: "restaurant",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800",
    description:
      "A historic colonial district featuring vibrant Spanish architecture, cobblestone streets, and centuries-old forts. Home to colorful buildings, charming plazas, art galleries, and authentic Puerto Rican restaurants.",
  },
  {
    id: 2,
    top: "40%",
    left: "15%",
    icon: Bed,
    color: "bg-yellow-500",
    name: "San Juan Grand Hotel",
    rating: 4.5,
    reviews: 150,
    type: "place",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800",
    description:
      "Experience luxury in the heart of the city. Our hotel offers stunning ocean views, world-class dining, and exceptional service for an unforgettable stay.",
  },
  {
    id: 3,
    top: "60%",
    left: "25%",
    icon: Utensils,
    color: "bg-green-500",
    name: "El Jibarito",
    rating: 4.7,
    reviews: 320,
    type: "restaurant",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800",
    description:
      "Authentic Puerto Rican cuisine served in a vibrant, colorful setting. Famous for our mofongo and traditional stews that capture the essence of local flavors.",
  },
  {
    id: 4,
    top: "30%",
    left: "45%",
    icon: MapPin,
    color: "bg-red-500",
    name: "Castillo San Felipe",
    rating: 4.9,
    reviews: 1200,
    type: "place",
    image:
      "https://images.unsplash.com/photo-1589308454676-435948967982?auto=format&fit=crop&q=80&w=800",
    description:
      "A 16th-century citadel located in San Juan. It is one of the most iconic landmarks in Puerto Rico, offering breathtaking views of the Atlantic Ocean.",
  },
  {
    id: 5,
    top: "15%",
    left: "60%",
    icon: Cross,
    color: "bg-blue-500",
    name: "San Juan Medical Center",
    rating: 4.2,
    reviews: 85,
    type: "place",
    image:
      "https://images.unsplash.com/photo-1586773860418-d3b9a8ec817f?auto=format&fit=crop&q=80&w=800",
    description:
      "Providing high-quality healthcare services to the community. Our facility is equipped with modern technology and staffed by experienced medical professionals.",
  },
  {
    id: 6,
    top: "50%",
    left: "70%",
    icon: Plane,
    color: "bg-purple-500",
    name: "Luis Muñoz Marín Int'l",
    rating: 4.4,
    reviews: 5400,
    type: "place",
    image:
      "https://images.unsplash.com/photo-1436491865332-7a61a109c0f2?auto=format&fit=crop&q=80&w=800",
    description:
      "The main international gateway to Puerto Rico. Modern facilities, numerous dining options, and efficient service to start or end your journey comfortably.",
  },
];

export default function MapPage2() {
  const [selectedLocation, setSelectedLocation] = useState<
    (typeof markers)[0] | null
  >(null);

  return (
    <div className="min-h-[calc(100vh-82px)] flex flex-col overflow-hidden">
      <main className="flex-1 relative bg-gray-100">
        {/* Mock Map Background */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-80 cursor-grab active:cursor-grabbing"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&q=80&w=2000')`,
            filter: "grayscale(20%) contrast(90%) brightness(110%)",
          }}
          onClick={() => setSelectedLocation(null)}
        />

        {/* Markers Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {markers.map((marker) => (
            <div
              key={marker.id}
              className={`absolute p-1.5 rounded-full shadow-md border-2 border-white text-white ${marker.color} transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform pointer-events-auto group`}
              style={{ top: marker.top, left: marker.left }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedLocation(marker);
              }}
            >
              <marker.icon size={14} fill="currentColor" />
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {marker.name}
              </div>
            </div>
          ))}
        </div>

        {/* Location Dialog/Card */}
        {selectedLocation && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-4">
            <div className="bg-white rounded-[32px] overflow-hidden shadow-2xl w-full max-w-md pointer-events-auto transform animate-in fade-in zoom-in duration-300 relative">
              {/* Close Button */}
              <button
                onClick={() => setSelectedLocation(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-900 hover:bg-white transition-colors shadow-lg"
              >
                <X size={20} />
              </button>

              <div className="h-48 overflow-hidden">
                <img
                  src={selectedLocation.image}
                  alt={selectedLocation.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="p-8">
                <h2 className="text-2xl font-black text-gray-900 mb-2">
                  {selectedLocation.name}
                </h2>

                <div className="flex items-center gap-2 mb-6">
                  <div className="flex items-center text-black font-bold text-sm">
                    <Star size={14} className="fill-black mr-1" />
                    {selectedLocation.rating}
                  </div>
                  <span className="text-gray-400 text-sm font-medium">
                    ({selectedLocation.reviews} reviews) {selectedLocation.type}
                  </span>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed mb-8 font-medium">
                  {selectedLocation.description}
                </p>

                <div className="flex items-center gap-3">
                  <Link
                    className="flex-1"
                    href={`/maps/${selectedLocation.id}`}
                  >
                    <Button className=" w-full bg-[#FFC107] hover:bg-[#FFB300] text-black font-bold rounded-xl h-12 shadow-none cursor-pointer">
                      View Details
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-12 h-12 p-0 rounded-xl border-gray-200 hover:bg-gray-50"
                  >
                    <Heart size={20} className="text-gray-400" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
