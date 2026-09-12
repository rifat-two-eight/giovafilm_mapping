"use client";

import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface Feature {
  icon: React.ReactNode;
  text: string;
}

interface StepCardProps {
  stepNumber: number;
  tag?: string;
  title: string;
  description: string;
  features: Feature[];
  image: React.ReactNode;
  imagePosition: "left" | "right";
  badges?: { label: string; icon?: React.ReactNode }[];
}

export function StepCard({
  stepNumber,
  tag,
  title,
  description,
  features,
  image,
  imagePosition,
  badges,
}: StepCardProps) {
  const isImageRight = imagePosition === "right";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      <div
        className={cn(
          "grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center bg-white rounded-3xl p-6 sm:p-10 md:p-12 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgba(255,193,7,0.12)] transition-all duration-300",
          !isImageRight && "lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1"
        )}
      >
        {/* Text Content */}
        <div className="lg:col-span-6 space-y-6">
          {/* Step Tag & Number */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-11 h-11 bg-[#FFC107] text-black font-black text-lg rounded-2xl shadow-[0_4px_12px_rgba(255,193,7,0.4)]">
              0{stepNumber}
            </div>
            {tag && (
              <span className="text-xs font-bold tracking-wider uppercase bg-amber-50 text-amber-800 border border-amber-200/80 px-3.5 py-1 rounded-full">
                {tag}
              </span>
            )}
          </div>

          {/* Heading */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-950 tracking-tight leading-tight">
            {title}
          </h2>

          {/* Description */}
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed font-normal">
            {description}
          </p>

          {/* Feature List */}
          <div className="space-y-3 pt-2">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-3.5 p-2.5 rounded-xl hover:bg-gray-50/80 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-100/70 text-amber-900 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  {feature.icon}
                </div>
                <p className="text-gray-700 font-medium text-sm sm:text-base leading-snug pt-0.5">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>

          {/* Category Badges (if any) */}
          {badges && badges.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {badges.map((b, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-200 shadow-2xs"
                >
                  {b.icon}
                  {b.label}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Image Preview */}
        <div className="lg:col-span-6 w-full">
          <div className="relative group rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-200/70 bg-gray-100 shadow-[0_12px_36px_rgba(0,0,0,0.08)]">
            <div className="relative overflow-hidden aspect-4/3 sm:aspect-16/10 flex items-center justify-center">
              <div className="w-full h-full transform transition-transform duration-500 ease-out group-hover:scale-103">
                {image}
              </div>
            </div>

            {/* Glowing Accent Corner */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFC107]/10 rounded-full blur-2xl pointer-events-none" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
