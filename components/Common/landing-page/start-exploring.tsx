"use client";

import { Button } from "@/components/ui/button";
import bgImg from "@/public/exploring-today.jpg";
import Link from "next/link";
import { motion } from "motion/react";

export default function StartExploring() {
  return (
    <section className="w-full flex justify-center px-6 py-16 overflow-hidden">
      <motion.div
        className="relative w-full max-w-360 mx-auto px-4 md:px-6 rounded-3xl overflow-hidden"
        style={{
          backgroundImage: `url(${bgImg.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/70" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center py-20 px-6 text-white">
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-4"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Start Exploring Today
          </motion.h2>

          <motion.p
            className="max-w-xl text-gray-200 mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Don’t settle for tourist traps. Get the map that locals use and
            experience the city like never before.
          </motion.p>

          <motion.div
            className="flex flex-col md:flex-row items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link href={"/catalog"}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-5 rounded-xl cursor-pointer">
                  Browse Maps
                </Button>
              </motion.div>
            </Link>

            <span className="text-sm text-gray-300">
              No subscription required.
            </span>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
