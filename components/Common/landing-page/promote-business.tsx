"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "motion/react";

type Feature = {
  title: string;
  description: string;
};

const features: Feature[] = [
  {
    title: "High-Quality Traffic",
    description: "Reach intentional travelers who want what you offer.",
  },
  {
    title: "Brand Storytelling",
    description: "Share your story through rich media on our platform.",
  },
  {
    title: "Actionable Data",
    description: "Understand visitor trends and preferences.",
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
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
} as const;

export default function PromoteBusiness() {
  return (
    <section className="py-20 bg-gray-100 overflow-hidden">
      <div className="max-w-360 mx-auto px-4 md:px-6">
        {/* Yellow Container */}
        <motion.div
          className="bg-primary rounded-[48px] p-10 md:py-16 px-8 text-center font-inter"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Heading */}
          <motion.h2
            className="text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Promote Your Business
          </motion.h2>

          <motion.p
            className="text-gray-800 max-w-2xl mx-auto mb-9 md:mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Get discovered by travelers looking for authentic local experiences.
            Join our network of curated partners and grow your reach.
          </motion.p>

          {/* Feature Cards */}
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -6, scale: 1.02 }}
                className="h-full"
              >
                <Card className="bg-yellow-200/40 border-none rounded-2xl shadow-none h-full cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-800">{feature.description}</p>
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
            className="inline-block"
          >
            <Link href={"/for-business"}>
              <Button className="bg-black hover:bg-gray-900 text-white font-semibold px-8 py-6 rounded-xl cursor-pointer">
                Add Your Business
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
