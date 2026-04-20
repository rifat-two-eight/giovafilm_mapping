"use client";

import { Zap } from "lucide-react";
import { Button } from "../../ui/button";
import Image from "next/image";
import Link from "next/link";

export default function HeroBanner() {
  return (
    <section className="relative min-h-[80vh] py-16 flex items-center overflow-hidden font-inter">
      {/* Background Split */}
      <div className="absolute inset-0 flex">
        <div className="w-1/2 bg-[#F9FAFB] relative">
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
        <div className="w-1/2 bg-[#FFFDF5]"></div>
      </div>

      <div className="relative z-10 max-w-360 mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
        {/* Left Content */}
        <div className="max-w-xl">
          <p className="text-primary font-bold font-inter text-sm tracking-[0.2em] mb-4 leading-4 uppercase">
            Local Insight, Digital Ease
          </p>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-gray-900 leading-14 md:leading-20 mb-4">
            Discover Cities <br className="hidden xl:block" />
            <span className="text-[#FFC107]">Like a Local</span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-10 max-w-lg">
            Buy curated digital maps packed with local places, hidden gems, and
            exclusive offers — all in one interactive experience.
          </p>

          <div className="flex flex-wrap gap-4 mb-12">
            <Link href={"/places"}>
              <Button className="bg-[#FFC107] hover:bg-[#FFB300] text-black font-bold rounded-lg px-10 h-14 text-base shadow-lg shadow-yellow-500/20">
                Explore Maps
              </Button>
            </Link>
            <Link href={"/catalog"}>
              <Button
                variant="outline"
                className="bg-white hover:bg-gray-50 text-black font-bold rounded-lg px-10 h-14 text-base border-none shadow-xl shadow-black/5"
              >
                Browse Catalog
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden"
                >
                  <Image
                    src={`https://picsum.photos/seed/user${i}/100/100`}
                    alt="User"
                    width={500}
                    height={500}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ))}
            </div>
            <p className="text-sm font-medium text-gray-500">
              Joined by{" "}
              <span className="text-black font-bold">10k+ explorers</span> this
              month
            </p>
          </div>
        </div>

        {/* Right Content - Image & Floating Card */}
        <div className="relative">
          <div className="relative rounded-[40px] overflow-hidden shadow-2xl transform lg:translate-x-12">
            <Image
              src={require("@/public/hero-banner.png")}
              alt="Tokyo Street"
              width={500}
              height={400}
              className="w-full h-auto object-cover aspect-4/3"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Floating Card */}
          <div className="absolute -bottom-6 left-4 bg-white font-inter p-4 rounded-xl shadow-2xl flex items-center gap-4 min-w-70 animate-bounce-slow">
            <div className="w-12 h-12 bg-[#FFC107] rounded-lg flex items-center justify-center text-black">
              <Zap size={24} fill="currentColor" />
            </div>
            <div>
              <h4 className="font-black  text-gray-900 leading-tight">
                New: Tokyo Guide
              </h4>
              <p className="text-sm  text-[#6B7280]">50+ Hidden Gems added</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
