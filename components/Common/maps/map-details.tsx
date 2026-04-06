"use client";

import {
  BarChart3,
  Building2,
  Clock,
  CloudCog,
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
  Utensils,
} from "lucide-react";
import Image from "next/image";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";

import InfoCard from "./info-card";
import Link from "next/link";
import { markers } from "./map copy";

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
  const id = Number(params?.id);

  const marker = markers.find((marker) => marker.id === id);
  const dataToRender =
    marker?.type === "restaurant" ? restaurantData : infoData;
  console.log(marker?.type);

  return (
    <section className="bg-gray-100 py-10">
      <div className="max-w-[1400px] mx-auto px-6  ">
        {/* TOP GRID */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* LEFT HERO CARD */}
          <div className="lg:col-span-2 relative rounded-xl overflow-hidden">
            <div className="h-100 object-cover">
              <Image
                src={marker?.image || "/placeholder-image.jpg"} // Add a default image
                alt={marker?.name || "Image"} // Also provide fallback for alt
                width={1000}
                height={1000}
                className="object-cover w-full! h-full"
              />
            </div>

            {/* overlay */}
            <div className="absolute inset-0 bg-black/40"></div>

            {/* favorite */}
            <button className="absolute top-5 left-5 bg-white/40 backdrop-blur p-4 rounded-lg">
              <Heart className="size-6" />
            </button>

            {/* share */}
            <button className="absolute top-5 right-5 text-yellow-400 flex items-center gap-2 font-semibold">
              <Share2 size={18} />
              SHARE
            </button>

            {/* title */}
            <div className="absolute bottom-6 left-6 text-white">
              <h1 className="text-5xl font-bold font-public-sans">
                {marker?.name}
              </h1>

              <div className="flex items-center gap-2 mt-2 text-lg">
                <MapPin size={16} className="text-[#EC5B13]" />
                {marker?.type}
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
            {marker?.type !== "restaurant" && (
              <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-6 text-base rounded-xl">
                <Send size={18} className="mr-2" />
                DIRECTIONS
              </Button>
            )}

            {marker?.type === "restaurant" && (
              <div className="">
                {marker?.type === "restaurant" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <Button className="flex-1 w-full bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-6 text-base rounded-xl">
                        <Send size={18} className="mr-2" />
                        DIRECTIONS
                      </Button>
                      <Button className="flex-1 w-full bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-6 text-base rounded-xl">
                        <Phone size={18} className="mr-2" />
                        Call
                      </Button>
                    </div>

                    <Link href={`/maps/${marker?.id}/${marker?.id}`}>
                      <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-6 text-base rounded-xl">
                        <Ticket size={18} className="mr-2" />
                        Discounts
                      </Button>
                    </Link>
                  </div>
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

            <AccordionItem value="access" className="border rounded-xl">
              <AccordionTrigger className="font-semibold">
                {marker?.type === "restaurant" ? "Menu" : "ACCESS"}
              </AccordionTrigger>

              <AccordionContent className="text-muted-foreground space-y-4 pb-6">
                <p>
                  Arrival: Reach the trail using the main entrance of Glacier
                  National Park. The trail head is located near the North
                  visitor center, approximately 15 minutes from the entrance
                  gate.
                </p>

                <p>
                  Accessibility: The trail is primarily dirt and gravel. While
                  the first 0.5 miles are relatively flat and ADA accessible,
                  the remaining portion involves steep inclines and rocky
                  terrain.
                </p>

                <p>
                  Parking: A dedicated parking lot is available at the
                  trailhead. During peak summer months, it is recommended to
                  arrive before 8:00 AM as parking fills up quickly.
                </p>
              </AccordionContent>
            </AccordionItem>

            {/* RECOMMENDATIONS */}
            {marker?.type !== "restaurant" && (
              <AccordionItem
                value="recommendations"
                className="border rounded-xl"
              >
                <AccordionTrigger className="font-semibold">
                  RECOMMENDATIONS
                </AccordionTrigger>

                <AccordionContent className="pb-6 space-y-5">
                  <p className="text-muted-foreground">
                    Bring a reusable water bottle, comfortable shoes, and light
                    clothing. Don't forget your camera to capture the
                    spectacular scenery!
                  </p>

                  <div className="flex flex-wrap gap-3">
                    {[
                      "Mosquito repellent",
                      "Hiking boots",
                      "Flashlight",
                      "Sunscreen",
                      "Rain jacket",
                    ].map((item) => (
                      <span
                        key={item}
                        className="text-sm bg-orange-50 text-orange-600 px-4 py-1.5 rounded-full border border-orange-200"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* SERVICES */}
            {marker?.type !== "restaurant" && (
              <AccordionItem value="services" className="border rounded-xl">
                <AccordionTrigger className="font-semibold">
                  SERVICES
                </AccordionTrigger>

                <AccordionContent className="pb-8">
                  <div className="grid grid-cols-3 gap-8 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="bg-gray-100 p-4 rounded-full">
                        <Toilet size={22} />
                      </div>

                      <p className="text-sm font-semibold text-muted-foreground">
                        RESTROOMS
                      </p>
                    </div>

                    <div className="flex flex-col items-center gap-3">
                      <div className="bg-gray-100 p-4 rounded-full">
                        <Building2 size={22} />
                      </div>

                      <p className="text-sm font-semibold text-muted-foreground">
                        VISITOR CENTER
                      </p>
                    </div>

                    <div className="flex flex-col items-center gap-3">
                      <div className="bg-gray-100 p-4 rounded-full">
                        <Utensils size={22} />
                      </div>

                      <p className="text-sm font-semibold text-muted-foreground">
                        CAFETERIA
                      </p>
                    </div>
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
                <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-6 rounded-xl mt-6">
                  <MessageSquare size={18} className="mr-2" />
                  WRITE A REVIEW
                </Button>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {marker?.type === "restaurant" && (
          <div className="px-2 mt-6">
            <h3 className="font-bold uppercase">Online</h3>
            <div className="mt-4 space-y-4">
              {/* WEBSITE */}
              <div className="flex items-center justify-between p-4 border rounded-xl bg-white">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-100 p-3 rounded-lg">🌐</div>

                  <div>
                    <p className="text-xs text-muted-foreground">WEBSITE</p>
                    <p className="font-semibold">latrattoriadelporto.com</p>
                  </div>
                </div>

                <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg font-semibold">
                  VISIT
                </button>
              </div>

              {/* INSTAGRAM */}
              <div className="flex items-center justify-between p-4 border rounded-xl bg-white">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-100 p-3 rounded-lg">📸</div>

                  <div>
                    <p className="text-xs text-muted-foreground">INSTAGRAM</p>
                    <p className="font-semibold">@latrattoriadelporto</p>
                  </div>
                </div>

                <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg font-semibold">
                  VIEW
                </button>
              </div>

              {/* FACEBOOK */}
              <div className="flex items-center justify-between p-4 border rounded-xl bg-white">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-100 p-3 rounded-lg">👍</div>

                  <div>
                    <p className="text-xs text-muted-foreground">FACEBOOK</p>
                    <p className="font-semibold">La Trattoria del Porto</p>
                  </div>
                </div>

                <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg font-semibold">
                  VIEW
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
