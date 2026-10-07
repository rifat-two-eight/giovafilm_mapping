"use client";

import { Zap } from "lucide-react";
import { Button } from "../../ui/button";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { useLoginRequired } from "@/components/shared/login-required-modal";
import { useAppSelector } from "@/redux/hook";
import { selectAccessToken } from "@/redux/features/auth/authSlice";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function HeroBanner() {
  const { t } = useLanguage();
  const accessToken = useAppSelector(selectAccessToken);
  const { openLoginRequired } = useLoginRequired();

  const handleExplorePlaces = (e: React.MouseEvent) => {
    if (!accessToken) {
      e.preventDefault();
      openLoginRequired("/places");
    }
  };

  return (
    <section className="relative min-h-[75vh] lg:min-h-[80vh] py-10 sm:py-16 flex items-center overflow-hidden font-inter">
      {/* Background Split */}
      <div className="absolute inset-0 flex">
        <div className="w-full lg:w-1/2 bg-[#F9FAFB] relative">
          {/* Diagonal Lines Pattern */}
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.08]"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <line
              x1="0"
              y1="100"
              x2="100"
              y2="0"
              stroke="black"
              strokeWidth="0.1"
            />
            <line
              x1="-20"
              y1="100"
              x2="80"
              y2="0"
              stroke="black"
              strokeWidth="0.1"
            />
            <line
              x1="20"
              y1="100"
              x2="120"
              y2="0"
              stroke="black"
              strokeWidth="0.1"
            />
          </svg>
        </div>
        <div className="hidden lg:block lg:w-1/2 bg-[#FFFDF5]"></div>
      </div>

      <div className="relative z-10 max-w-360 mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full">
        {/* Left Content */}
        <motion.div
          className="max-w-xl mx-auto lg:mx-0 text-center lg:text-left"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.p
            className="text-amber-600 font-extrabold font-inter text-xs sm:text-sm tracking-[0.18em] mb-2 sm:mb-3 leading-4 uppercase"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {t("landing.hero_tagline")}
          </motion.p>

          <motion.h1
            className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight text-gray-900 leading-[1.18] sm:leading-tight lg:leading-20 mb-3.5 sm:mb-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {t("landing.hero_title_1")}{" "}
            <br className="hidden xl:block" />
            <span className="text-[#FFC107]">{t("landing.hero_title_2")}</span>
          </motion.h1>

          <motion.p
            className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed mb-6 sm:mb-10 max-w-md sm:max-w-lg mx-auto lg:mx-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {t("landing.hero_desc")}
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3 sm:gap-4 mb-6 sm:mb-12 w-full"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Link href={"/places"} onClick={handleExplorePlaces} className="w-full sm:w-auto">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
                <Button className="w-full sm:w-auto bg-[#FFC107] hover:bg-[#FFB300] text-black font-extrabold rounded-xl px-7 sm:px-10 h-11 sm:h-14 text-sm sm:text-base shadow-lg shadow-amber-500/20 cursor-pointer">
                  {t("landing.hero_btn_1", t("landing.explore_places"))}
                </Button>
              </motion.div>
            </Link>
            <Link href={"/catalog"} className="w-full sm:w-auto">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-900 font-bold rounded-xl px-7 sm:px-10 h-11 sm:h-14 text-sm sm:text-base border border-gray-200 shadow-sm sm:shadow-md cursor-pointer"
                >
                  {t("landing.hero_btn_2", t("landing.browse_catalog"))}
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          <motion.div
            className="flex items-center justify-center lg:justify-start gap-3 sm:gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <div className="flex -space-x-2.5 sm:-space-x-3 shrink-0">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white bg-amber-100 flex items-center justify-center overflow-hidden text-xs sm:text-sm font-bold text-amber-800"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.6 + i * 0.1, type: "spring", stiffness: 200 }}
                >
                  {i === 1 ? "👤" : i === 2 ? "🗺️" : "⭐"}
                </motion.div>
              ))}
            </div>
            <p className="text-xs sm:text-sm font-medium text-gray-500 text-left">
              {t("landing.trust_prefix", t("landing.joined_by"))}{" "}
              <span className="text-black font-bold">
                {t("landing.trust_highlight", t("landing.explorers_this_month"))}
              </span>
            </p>
          </motion.div>
        </motion.div>

        {/* Right Content - Image & Floating Card */}
        <div className="relative mt-4 lg:mt-0">
          <motion.div
            className="relative rounded-2xl sm:rounded-[40px] overflow-hidden shadow-xl sm:shadow-2xl transform lg:translate-x-12"
            initial={{ opacity: 0, scale: 0.95, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Image
              src="/landing/banner.png"
              alt="Puerto Rico"
              width={600}
              height={450}
              className="w-full h-auto object-cover aspect-4/3"
              priority
            />
          </motion.div>

          {/* Floating Card */}
          <motion.div
            className="absolute -bottom-5 left-2 sm:left-4 bg-white/95 backdrop-blur-md font-inter p-3.5 sm:p-4 rounded-xl shadow-xl flex items-center gap-3 sm:gap-4 min-w-56 sm:min-w-64 max-w-xs sm:max-w-sm border border-gray-100 z-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FFC107] rounded-lg flex items-center justify-center text-black shrink-0">
              <Zap size={22} fill="currentColor" />
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-xs sm:text-sm text-gray-900 leading-tight truncate">
                {t("landing.floating_card_title", t("landing.tokyo_guide"))}
              </h4>
              {t("landing.floating_card_desc") ? (
                <p className="text-xs text-[#6B7280] truncate">{t("landing.floating_card_desc")}</p>
              ) : null}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
