"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Bookmark, Download, Share2 } from "lucide-react";
import { motion } from "motion/react";

type Feature = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

const features: Feature[] = [
  {
    title: "Wishlist Collection",
    description:
      "Save maps you're planning to buy later for your next big adventure.",
    icon: <Bookmark className="text-yellow-500" size={20} />,
  },
  {
    title: "Offline Access",
    description:
      "Download your maps to navigate even without an internet connection.",
    icon: <Download className="text-yellow-500" size={20} />,
  },
  {
    title: "Collaborative Trips",
    description:
      "Invite friends to view your purchased maps and plan together.",
    icon: <Share2 className="text-yellow-500" size={20} />,
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, x: -30 },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100 } },
} as const;

export default function PersonalizedExperience() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Shape */}
      <div className="absolute inset-0 bg-primary/20 rounded-tr-[200px] z-0" />

      <div className="relative max-w-360 mx-auto px-4 md:px-6 flex flex-col lg:flex-row items-center justify-between gap-10 ">
        {/* LEFT SIDE */}
        <div className="space-y-8 w-full lg:w-1/2">
          <motion.h2
            className="text-4xl font-bold"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Personalized Experience
          </motion.h2>

          <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ x: 6, scale: 1.01 }}
                className="w-full"
              >
                <Card className="rounded-xl shadow-none bg-white py-0 cursor-pointer border border-gray-100/50 hover:shadow-md transition-shadow">
                  <CardContent className="flex items-start gap-4 p-6">
                    <div className="w-9 h-9 rounded-md flex items-center justify-center bg-yellow-50">
                      {feature.icon}
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg">{feature.title}</h3>

                      <p className="text-muted-foreground text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* RIGHT SIDE MOCK UI */}
        <motion.div
          className="relative flex justify-center w-full lg:w-1/2"
          initial={{ opacity: 0, scale: 0.95, x: 40 }}
          whileInView={{ opacity: 1, scale: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          whileHover={{ y: -5 }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full md:w-lg p-6 border border-gray-100">
            {/* Fake Browser Top */}
            <div className="flex gap-2 mb-6">
              <div className="w-3 h-3 bg-red-400 rounded-full" />
              <div className="w-3 h-3 bg-yellow-400 rounded-full" />
              <div className="w-3 h-3 bg-green-400 rounded-full" />
            </div>

            {/* Profile Row */}
            <div className="flex items-center gap-4 mb-6">
              <motion.div
                className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-white"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              >
                <span className="text-black font-bold">👤</span>
              </motion.div>

              <div>
                <p className="font-semibold">Welcome back, Explorer!</p>

                <p className="text-sm text-muted-foreground">
                  You have 3 active maps in your collection.
                </p>
              </div>
            </div>

            {/* Fake Content */}
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse" />

              <div className="grid grid-cols-2 gap-4">
                <div className="h-32 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center bg-gray-50/50">
                  <div className="w-6 h-6 bg-gray-300 rounded-full" />
                </div>

                <div className="space-y-3">
                  <div className="h-10 bg-yellow-100/50 rounded-md" />
                  <div className="h-10 bg-gray-100 rounded-md" />
                  <div className="h-10 bg-gray-100 rounded-md" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
