"use client";

import Image from "next/image";
import { Filter, Eye, Heart, Navigation } from "lucide-react";
import { motion } from "motion/react";

const features = [
  {
    icon: Filter,
    text: "Filter by preference, time of day, or popularity.",
  },
  {
    icon: Eye,
    text: "View immersive details and history for every spot.",
  },
  {
    icon: Heart,
    text: "Save favorites to your personal itinerary.",
  },
  {
    icon: Navigation,
    text: "Seamless navigation with your favorite GPS app.",
  },
];

const listVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100 } },
} as const;

export default function ExploreMaps() {
  return (
    <section className="bg-[#0f0f0f] text-white py-24 overflow-hidden">
      <div className="max-w-360 mx-auto px-4 md:px-6 grid lg:grid-cols-2 gap-16 items-center">
        {/* Map Image */}
        <motion.div
          className="w-full md:w-135 md:h-135 relative rounded-3xl p-4 bg-blue-900/30"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="rounded-2xl overflow-hidden w-full h-full relative min-h-[350px]">
            <Image
              src={require("@/public/map-img.jpg")}
              alt="Interactive Map"
              fill
              className="object-cover"
            />
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-4xl font-inter font-bold">
            Explore With Interactive Maps
          </h2>

          <p className="text-base font-inter text-gray-400 leading-relaxed">
            Our dynamic platform transforms a static map into a powerful
            exploration tool. Real-time data and community insights ensure you
            never miss a beat.
          </p>

          {/* Features */}
          <motion.div
            className="space-y-4 pt-4"
            variants={listVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  className="flex items-start gap-3"
                  variants={itemVariants}
                >
                  <Icon className="text-yellow-400 w-5 h-5 mt-1" />
                  <p className="text-gray-300 text-sm">{feature.text}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
