"use client";

import { Circle, Shield, Map } from "lucide-react";
import { StepCard } from "./step-card";
import browseMap from "@/public/how-it-works/browse-maps.png";
import purchaseYourMap from "@/public/how-it-works/purchase-your-map.png";
import exploreCity from "@/public/how-it-works/explore-the-city.png";
import Image from "next/image";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function HowItWorks() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Page container with max width and padding */}
      <div className="max-w-360 mx-auto px-4 md:px-6 py-12 md:py-20">
        {/* Header section */}
        <div className="text-center space-y-6 mb-16">
          {/* Yellow badge with uppercase text */}
          <div>
            <span className="inline-block bg-primary/20 text-gray-900 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
              {t("how_it_works_page.badge")}
            </span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 text-balance">
            {t("how_it_works_page.title")}
          </h1>

          {/* Description text */}
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            {t("how_it_works_page.description")}
          </p>
        </div>

        {/* Steps section */}
        <div className="space-y-20 pt-10">
          {/* Step 1: Browse Maps */}
          <StepCard
            stepNumber={1}
            title={t("how_it_works_page.step1_title")}
            description={t("how_it_works_page.step1_desc")}
            features={[
              {
                icon: <Circle className="w-5 h-5" />,
                text: t("how_it_works_page.step1_f1"),
              },
              {
                icon: <Circle className="w-5 h-5" />,
                text: t("how_it_works_page.step1_f2"),
              },
            ]}
            image={
              <Image
                src={browseMap.src}
                alt="Browse maps interface showing location markers"
                width={600}
                height={500}
              />
            }
            imagePosition="right"
          />

          {/* Step 2: Purchase Your Map */}
          <StepCard
            stepNumber={2}
            title={t("how_it_works_page.step2_title")}
            description={t("how_it_works_page.step2_desc")}
            features={[
              {
                icon: <Shield className="w-5 h-5" />,
                text: t("how_it_works_page.step2_f1"),
              },
            ]}
            image={
              <Image
                src={purchaseYourMap.src}
                alt="Browse maps interface showing location markers"
                width={600}
                height={500}
              />
            }
            imagePosition="left"
          />

          {/* Step 3: Explore the City */}
          <StepCard
            stepNumber={3}
            title={t("how_it_works_page.step3_title")}
            description={t("how_it_works_page.step3_desc")}
            features={[
              {
                icon: <Map className="w-5 h-5" />,
                text: t("how_it_works_page.eat_drink"),
              },
              {
                icon: <Map className="w-5 h-5" />,
                text: t("how_it_works_page.sightseeing"),
              },
              {
                icon: <Map className="w-5 h-5" />,
                text: t("how_it_works_page.shopping"),
              },
              {
                icon: <Map className="w-5 h-5" />,
                text: t("how_it_works_page.nature"),
              },
            ]}
            image={
              <Image
                src={exploreCity.src}
                alt="Browse maps interface showing location markers"
                width={600}
                height={500}
              />
            }
            imagePosition="right"
          />
        </div>

        {/* Call to action section */}
        <div className="mt-20">{/* <CTASection /> */}</div>
      </div>
    </main>
  );
}
