"use client";

import React from "react";
import { MapPin, Camera, Tag, LayoutGrid } from "lucide-react";
import Image from "next/image";
import { motion } from "motion/react";

const features = [
  {
    title: "Curated Locations",
    description: "Hand-picked spots from locals.",
    icon: MapPin,
    color: "bg-[#FFC107]",
  },
  {
    title: "Photos & Videos",
    description: "Visual previews of every spot.",
    icon: Camera,
    color: "bg-[#FFC107]",
  },
  {
    title: "Exclusive Local Offers",
    description: "Deals only for our explorers.",
    icon: Tag,
    color: "bg-[#FFC107]",
  },
  {
    title: "Smart Categories",
    description: "Filter by mood or activity.",
    icon: LayoutGrid,
    color: "bg-[#FFC107]",
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100 } },
} as const;

const imageGridVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
} as const;

const imageVariantsLeft = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
} as const;

const imageVariantsRight = {
  hidden: { opacity: 0, y: -40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
} as const;

export function Features() {
  return (
    <section className="relative py-16 overflow-hidden">
      {/* Curved Background Shape */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-full h-full bg-[#FFFDF5] clip-path-hero"></div>
      </div>

      <div className="relative z-10 max-w-360 mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        {/* Left Content */}
        <div>
          <motion.h2
            className="text-4xl font-inter font-bold text-gray-900 leading-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            What You Get Inside Every Map
          </motion.h2>
          
          <motion.p
            className="text-gray-500 leading-relaxed mb-12 max-w-lg"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Every digital map is hand-crafted to provide the ultimate urban
            exploration experience, far beyond what simple GPS apps offer.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10"
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                className="flex items-start gap-4"
                variants={itemVariants}
              >
                <div
                  className={`${feature.color} p-2 rounded-lg text-white shrink-0`}
                >
                  <feature.icon size={20} fill="currentColor" />
                </div>
                <div>
                  <h4 className="font-black text-gray-900 mb-1">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-gray-500 font-medium">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Right Content - Image Grid */}
        <motion.div
          className="grid grid-cols-2 gap-4 md:gap-6"
          variants={imageGridVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="space-y-6">
            <motion.div
              className="md:h-64 rounded-[32px] overflow-hidden shadow-lg"
              variants={imageVariantsLeft}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src="https://picsum.photos/seed/night-city/600/600"
                alt="Night City"
                width={500}
                height={500}
                className="w-full h-full object-cover aspect-square"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <motion.div
              className="h-60 md:h-75 rounded-[32px] overflow-hidden shadow-lg"
              variants={imageVariantsLeft}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src="https://picsum.photos/seed/coffee/600/600"
                alt="Coffee"
                width={500}
                height={500}
                className="w-full h-full object-cover aspect-square"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>
          <div className="space-y-6 pt-8 md:pt-12">
            <motion.div
              className="md:h-80 rounded-[32px] overflow-hidden shadow-lg"
              variants={imageVariantsRight}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src="https://picsum.photos/seed/alley/600/800"
                alt="Alley"
                width={500}
                height={500}
                className="w-full h-full object-cover aspect-3/4"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <motion.div
              className="md:h-70 rounded-[32px] overflow-hidden shadow-lg"
              variants={imageVariantsRight}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src="https://picsum.photos/seed/interior/600/600"
                alt="Interior"
                width={500}
                height={500}
                className="w-full h-full object-cover aspect-square"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
