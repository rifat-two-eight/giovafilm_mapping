"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Clock, Compass, SlidersHorizontal, BadgePercent, MapPin } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, x: -25 },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100 } },
} as const;

export default function MapEasier() {
  const { t } = useLanguage();

  const benefits = [
    {
      title: t("landing.map_easier_b1_title"),
      description: t("landing.map_easier_b1_desc"),
      icon: <Clock className="w-5 h-5" />,
    },
    {
      title: t("landing.map_easier_b2_title"),
      description: t("landing.map_easier_b2_desc"),
      icon: <Compass className="w-5 h-5" />,
    },
    {
      title: t("landing.map_easier_b3_title"),
      description: t("landing.map_easier_b3_desc"),
      icon: <SlidersHorizontal className="w-5 h-5" />,
    },
    {
      title: t("landing.map_easier_b4_title"),
      description: t("landing.map_easier_b4_desc"),
      icon: <BadgePercent className="w-5 h-5" />,
    },
  ];

  return (
    <section className="relative py-16 md:py-24 overflow-hidden font-inter">
      {/* Background Shape: full cover on mobile, curved on md+ */}
      <div className="absolute inset-0 bg-primary/20 rounded-none md:rounded-tr-[200px] z-0" />

      <div className="relative z-10 max-w-360 mx-auto px-4 md:px-6 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
        {/* LEFT SIDE: Heading & Horizontal Cards */}
        <div className="space-y-8 w-full lg:w-1/2">
          <motion.h2
            className="text-3xl md:text-4xl lg:text-4.5xl font-bold text-gray-900 tracking-tight leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {t("landing.map_easier_title")}
          </motion.h2>

          <motion.div
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ x: 6, scale: 1.01 }}
                className="w-full"
              >
                <Card className="rounded-2xl shadow-xs bg-white py-0 border border-gray-100/80 hover:shadow-md hover:border-yellow-200 transition-all duration-300 group cursor-default">
                  <CardContent className="flex items-start gap-4 p-5">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-yellow-50 text-yellow-600 shrink-0 group-hover:scale-108 group-hover:bg-[#FFC107] group-hover:text-black transition-all duration-300">
                      {benefit.icon}
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-bold text-base text-gray-900 group-hover:text-black transition-colors">
                        {benefit.title}
                      </h3>

                      <p className="text-gray-600 text-sm leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* RIGHT SIDE: Real Photo */}
        <motion.div
          className="relative flex justify-center w-full lg:w-1/2"
          initial={{ opacity: 0, scale: 0.95, x: 30 }}
          whileInView={{ opacity: 1, scale: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="relative w-full max-w-md lg:max-w-lg aspect-4/5 rounded-3xl overflow-hidden shadow-2xl border-4 border-white group">
            <Image
              src="/landing/Isla Desecheo - Aguadilla 1.png"
              alt="Isla Desecheo — Aguadilla"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />

            {/* Floating Location Card */}
            <div className="absolute bottom-5 left-5 right-5 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/50 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFC107] flex items-center justify-center text-black shrink-0 shadow-xs">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-sm text-gray-900 truncate">
                  Isla Desecheo — Aguadilla
                </p>
                <p className="text-xs text-gray-600 truncate">Puerto Rico</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
