"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Coffee, Calendar, Home, Gift } from "lucide-react";
import { motion } from "motion/react";

type Deal = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

const deals: Deal[] = [
  {
    title: "FREE TREAT",
    description: "Free pastry with any brew at Artisan Bakeries.",
    icon: <Coffee className="text-yellow-500" size={24} />,
  },
  {
    title: "20% OFF DINNER",
    description: "Exclusive evening discounts at top-rated local bistros.",
    icon: <Calendar className="text-yellow-500" size={24} />,
  },
  {
    title: "SKIP THE LINE",
    description: "Priority entry at boutique galleries and local museums.",
    icon: <Home className="text-yellow-500" size={24} />,
  },
  {
    title: "LOCAL CURIO",
    description: "Special gift with purchases at concept stores.",
    icon: <Gift className="text-yellow-500" size={24} />,
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
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
} as const;

export default function DealsSection() {
  return (
    <section className="py-16 bg-gray-50 overflow-hidden">
      <div className="max-w-360 mx-auto px-4 md:px-6 text-center space-y-10 font-inter">
        {/* Heading */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold">Unlock Exclusive Local Deals</h2>

          <p className="text-muted-foreground max-w-xl mx-auto">
            Access perks and discounts at our partner locations that you won't
            find anywhere else.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
        >
          {deals.map((deal, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="h-full"
            >
              <Card className="bg-white border border-gray-100 rounded-xl shadow-none hover:shadow-lg transition-shadow duration-300 py-0 h-full cursor-pointer">
                <CardContent className="p-6 text-left space-y-3">
                  {/* Icon */}
                  <div className="w-10 h-10 flex items-center justify-center">
                    {deal.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-xs text-[#9CA3AF] font-semibold tracking-wide">
                    {deal.title}
                  </h3>

                  {/* Description */}
                  <p className="font-bold">{deal.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
