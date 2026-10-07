"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "motion/react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
} as const;

export default function PromoteBusiness() {
  const { t } = useLanguage();

  const features = [
    {
      title: t("landing.promote_f1_title"),
      description: t("landing.promote_f1_desc"),
    },
    {
      title: t("landing.promote_f2_title"),
      description: t("landing.promote_f2_desc"),
    },
    {
      title: t("landing.promote_f3_title"),
      description: t("landing.promote_f3_desc"),
    },
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gray-100 overflow-hidden font-inter">
      <div className="max-w-360 mx-auto px-4 md:px-6">
        {/* Yellow Container */}
        <motion.div
          className="bg-primary rounded-3xl sm:rounded-[48px] p-6 sm:p-10 md:py-16 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Heading */}
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-4.5xl font-bold mb-3 sm:mb-4 text-gray-900 tracking-tight leading-tight"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {t("landing.promote_title")}
          </motion.h2>

          <motion.p
            className="text-gray-800 text-sm sm:text-base max-w-2xl mx-auto mb-8 sm:mb-12 leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {t("landing.promote_desc")}
          </motion.p>

          {/* Feature Cards */}
          <motion.div
            className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8 sm:mb-12 max-w-4xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -6, scale: 1.01 }}
                className="h-full"
              >
                <Card className="bg-yellow-200/40 border-none rounded-2xl shadow-none h-full cursor-default">
                  <CardContent className="p-5 sm:p-6 text-center">
                    <h3 className="font-bold text-base text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-800 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block w-full sm:w-auto"
          >
            <Link href={"/for-business"} className="block w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-black hover:bg-gray-900 text-white font-bold px-8 py-5 sm:py-6 rounded-xl cursor-pointer text-base">
                {t("landing.add_business")}
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
