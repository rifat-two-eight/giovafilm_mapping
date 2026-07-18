"use client";

import { Circle, Shield, Map } from "lucide-react";
import { StepCard } from "./step-card";
import browseMap from "@/public/how-it-works/browse-maps.png";
import purchaseYourMap from "@/public/how-it-works/purchase-your-map.png";
import exploreCity from "@/public/how-it-works/explore-the-city.png";
import Image from "next/image";

/**
 * How It Works Page
 *
 * This page showcases the three-step process for using Roadtripeado:
 * 1. Browse Maps - Explore curated city maps
 * 2. Purchase Your Map - Unlock premium content
 * 3. Explore the City - Navigate and discover locations
 */

export default function HowItWorks() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Page container with max width and padding */}
      <div className="max-w-360 mx-auto px-4 md:px-6 py-12 md:py-20">
        {/* Header section */}
        <div className="text-center space-y-6 mb-16">
          {/* Yellow badge with uppercase text */}
          <div>
            <span className="inline-block bg-primary/20 text-gray-900 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
              Your Guide to the World
            </span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 text-balance">
            How It Works
          </h1>

          {/* Description text */}
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Discover how Roadtripeado helps you explore the world's most vibrant
            cities with curated digital maps designed for modern explorers.
          </p>
        </div>

        {/* Steps section */}
        <div className="space-y-20 pt-10">
          {/* Step 1: Browse Maps */}
          <StepCard
            stepNumber={1}
            title="Browse Maps"
            description="Explore our extensive catalog of curated city maps. From the romantic streets of Paris to the neon-lit alleys of Tokyo, discover the best places to visit, from iconic landmarks to hidden local favorites only insiders know about."
            features={[
              {
                icon: <Circle className="w-5 h-5" />,
                text: "Filter by interests, cuisine, or vibe",
              },
              {
                icon: <Circle className="w-5 h-5" />,
                text: "Preview top-rated locations in each city",
              },
            ]}
            image={
              <Image
                src={browseMap.src}
                alt="Browse maps interface showing location markers"
                width={600}
                height={500}
              />
            }
            imagePosition="right"
          />

          {/* Step 2: Purchase Your Map */}
          <StepCard
            stepNumber={2}
            title="Purchase Your Map"
            description="Unlock detailed locations, high-resolution photos, and exclusive offers with a simple one-time purchase. No subscriptions, just permanent access to your travel guides across all your desktop devices."
            features={[
              {
                icon: <Shield className="w-5 h-5" />,
                text: "Exclusive Content - Gain access to specialized itineraries and discount codes for local tours and partner restaurants.",
              },
            ]}
            image={
              <Image
                src={purchaseYourMap.src}
                alt="Browse maps interface showing location markers"
                width={600}
                height={500}
              />
            }
            imagePosition="left"
          />

          {/* Step 3: Explore the City */}
          <StepCard
            stepNumber={3}
            title="Explore the City"
            description="Use the interactive web map to navigate effortlessly. Filter through restaurants, attractions, and hidden gems. Every location comes with descriptions, opening hours, and why it was chosen for our curated lists."
            features={[
              {
                icon: <Map className="w-5 h-5" />,
                text: "Eat & Drink",
              },
              {
                icon: <Map className="w-5 h-5" />,
                text: "Sightseeing",
              },
              {
                icon: <Map className="w-5 h-5" />,
                text: "Shopping",
              },
              {
                icon: <Map className="w-5 h-5" />,
                text: "Parks & Nature",
              },
            ]}
            image={
              <Image
                src={exploreCity.src}
                alt="Browse maps interface showing location markers"
                width={600}
                height={500}
              />
            }
            imagePosition="right"
          />
        </div>

        {/* Call to action section */}
        <div className="mt-20">{/* <CTASection /> */}</div>
      </div>
    </main>
  );
}
