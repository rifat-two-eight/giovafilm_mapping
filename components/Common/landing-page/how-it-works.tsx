"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Search, ShoppingBag, Box } from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
} as const;

export default function HowItWorks() {
  const { t } = useLanguage();

  const steps = [
    {
      title: t("landing.step1_title"),
      description: t("landing.step1_desc"),
      icon: <Search className="w-6 h-6 text-amber-500" />,
    },
    {
      title: t("landing.step2_title"),
      description: t("landing.step2_desc"),
      icon: <ShoppingBag className="w-6 h-6 text-amber-500" />,
    },
    {
      title: t("landing.step3_title"),
      description: t("landing.step3_desc"),
      icon: <Box className="w-6 h-6 text-amber-500" />,
    },
  ];

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="max-w-360 mx-auto px-4 md:px-6">
        {/* Section Title */}
        <motion.h2
          className="text-4xl font-bold text-center text-gray-900 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {t("landing.how_it_works_title")}
        </motion.h2>

        {/* Cards */}
        <motion.div
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="h-full"
            >
              <Card className="border-gray-100 shadow-none hover:shadow-lg transition-shadow duration-300 rounded-2xl py-2 h-full">
                <CardContent className="flex flex-col items-center text-center p-10 space-y-4">
                  {/* Icon */}
                  <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-yellow-100">
                    {step.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-gray-900">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
