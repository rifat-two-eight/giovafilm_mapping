"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useGetOffersQuery } from "@/redux/features/offer/offerApi";
import { getImageUrl } from "@/lib/utils";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
} as const;

interface DealItem {
  id: string;
  name: string;
  badge: string;
  description: string;
  image: string;
  fallbackImage: string;
  href: string;
}

function DealCard({ deal }: { deal: DealItem }) {
  const [imgSrc, setImgSrc] = useState(deal.image);

  return (
    <Link href={deal.href} className="block h-full">
      <Card className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col group cursor-pointer p-0">
        {/* Business Image Container */}
        <div className="relative w-full h-48 overflow-hidden bg-gray-100">
          <Image
            src={imgSrc}
            alt={deal.name}
            fill
            unoptimized
            className="object-cover group-hover:scale-108 transition-transform duration-500"
            onError={() => {
              if (imgSrc !== deal.fallbackImage) {
                setImgSrc(deal.fallbackImage);
              }
            }}
          />
          {/* Discount Badge */}
          <div className="absolute top-3 right-3 bg-[#FFC107] text-black font-extrabold text-xs px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 uppercase tracking-wide">
            <Tag className="w-3.5 h-3.5" />
            <span>{deal.badge}</span>
          </div>
        </div>

        {/* Card Content */}
        <CardContent className="p-5 text-left flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1 mb-1.5">
              {deal.name}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
              {deal.description}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function DealsSection() {
  const { t } = useLanguage();
  const { data: offersRes } = useGetOffersQuery({ limit: 50 });
  const allOffers: any[] = offersRes?.data || [];

  const defaultDeals = [
    {
      id: "adventure-water",
      name: t("landing.deal1_business"),
      badge: t("landing.deal1_badge"),
      description: t("landing.deal1_desc"),
      localImage: "/landing/deals/adventure-water.jpg",
      searchMatch: /Aventura|Adventure/i,
    },
    {
      id: "dokas",
      name: t("landing.deal2_business"),
      badge: t("landing.deal2_badge"),
      description: t("landing.deal2_desc"),
      localImage: "/landing/deals/dokas-pizza.jpg",
      searchMatch: /Dokas/i,
    },
    {
      id: "labranza",
      name: t("landing.deal3_business"),
      badge: t("landing.deal3_badge"),
      description: t("landing.deal3_desc"),
      localImage: "/landing/deals/labranza-rest.jpg",
      searchMatch: /Labranza/i,
    },
    {
      id: "best-ice-cream",
      name: t("landing.deal4_business"),
      badge: t("landing.deal4_badge"),
      description: t("landing.deal4_desc"),
      localImage: "/landing/deals/best-ice-cream.jpg",
      searchMatch: /Best Ice/i,
    },
  ];

  const deals: DealItem[] = defaultDeals.map((deal) => {
    // 1. Try to find the real matching offer from the database
    const matchedOffer = allOffers.find((o) =>
      deal.searchMatch.test(o.place?.name || o.business?.name || o.title || "")
    );

    // 2. Extract the actual photo uploaded to the map/offer
    const apiImage = matchedOffer
      ? getImageUrl(
          matchedOffer.photo ||
          matchedOffer.images ||
          matchedOffer.place?.media?.[0]
        )
      : null;

    const offerHref = matchedOffer
      ? matchedOffer.place?._id
        ? `/places/${matchedOffer.place._id}`
        : `/offer/${matchedOffer._id}`
      : "/offer";

    return {
      ...deal,
      image: apiImage || deal.localImage,
      fallbackImage: deal.localImage,
      href: offerHref,
    };
  });

  return (
    <section className="py-20 bg-gray-50 overflow-hidden font-inter">
      <div className="max-w-360 mx-auto px-4 md:px-6 text-center space-y-12">
        {/* Heading */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            {t("landing.deals_title")}
          </h2>

          <p className="text-gray-500 max-w-2xl mx-auto text-base">
            {t("landing.deals_subtitle")}
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
        >
          {deals.map((deal, index) => (
            <motion.div
              key={deal.id || index}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="h-full"
            >
              <DealCard deal={deal} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
