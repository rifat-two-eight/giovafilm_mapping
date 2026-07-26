"use client";

import {
  Utensils,
  MessageSquare,
  Mountain,
  Feather,
  Trophy,
  FileText,
  Map as MapIcon,
  Compass,
} from "lucide-react";
import { AwardCard } from "./award-card";
import { UnlockedAwardCard } from "./unlocked-award-card";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useGetAwardsQuery } from "@/redux/features/award/awardApi";
import { useGetProfileQuery } from "@/redux/features/user/userApi";
import Link from "next/link";

import unlockImage from "@/public/offers-image/Gourmet Garden.png";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";
import { NoImage } from "@/lib/others/others";

const getAwardIcon = (type: string) => {
  switch (type) {
    case "Gourmet Guide":
      return Utensils;
    case "Top Reviewer":
      return MessageSquare;
    case "Trail Master":
      return Mountain;
    case "History Buff":
      return Feather;
    case "PDF Itinerary":
      return FileText;
    case "Free Map":
      return MapIcon;
    case "Legendary Explorer":
      return Compass;
    default:
      return Trophy;
  }
};

const getAwardImage = (type: string) => {
  return unlockImage;
};

export default function AwardsPage() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const [activeFilter, setActiveFilter] = useState<"all" | "unlocked" | "locked">("all");

  const { data: user } = useGetProfileQuery({});
  const { data: awardsRes, isLoading } = useGetAwardsQuery({ page, limit });

  const awardsData = awardsRes?.data || [];
  const meta = awardsRes?.meta || { total: 0, page: 1, limit: 10 };
  const totalPages = Math.max(1, Math.ceil((meta.total || 0) / limit));

  const lockedAwards = awardsData.filter((a: any) => !a.isUnlocked);
  const unlockedAwards = awardsData.filter((a: any) => a.isUnlocked);

  const hasRedeemed = !!user?.redeemedFreeMap;

  // Dynamic Level progress circle math
  const points = user?.points || 0;
  const currentLevel = Math.floor(points / 1000) + 1;
  const currentLevelMinPoints = (currentLevel - 1) * 1000;
  const nextLevelMinPoints = currentLevel * 1000;
  const levelProgressPoints = points - currentLevelMinPoints;
  const pointsNeededForNext = nextLevelMinPoints - points;
  const percent = Math.min((levelProgressPoints / 1000) * 100, 100);
  const strokeDashoffset = 440 - (440 * percent) / 100;

  return (
    <div className="py-16 bg-white min-h-screen">
      <div className="max-w-360 mx-auto px-4 md:px-6 font-public-sans">
        {/* Page Title */}
        <h1 className="text-2xl font-bold mb-5 uppercase tracking-wide">Awards & Achievements</h1>

        <div className="bg-amber-500/10 p-8 rounded-3xl flex flex-col md:flex-row gap-8 items-center justify-between border border-amber-500/15 mb-10 shadow-sm">
          {/* LEFT: Progress Circle */}
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="absolute w-full h-full -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="#f3f4f6"
                strokeWidth="10"
                fill="none"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="#f59e0b"
                strokeWidth="10"
                fill="none"
                strokeDasharray="440"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            <div className="text-center">
              <p className="text-3xl font-extrabold text-gray-900">
                {points.toLocaleString()}
              </p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">XP POINTS</p>
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="flex-1 md:ml-10 text-center md:text-left">
            {/* Level badge */}
            <span className="inline-block bg-amber-500/20 text-amber-800 px-4 py-1.5 rounded-full text-xs font-bold mb-3 uppercase tracking-wider">
              🏆 Level {currentLevel} Explorer
            </span>

            {/* Name */}
            <h2 className="text-2xl font-bold text-gray-900 capitalize">
              {user?.name || "Explorer"}
            </h2>

            {/* Description */}
            <p className="text-gray-500 mt-2 text-sm leading-relaxed max-w-xl">
              You're making incredible progress! Earn{" "}
              <span className="font-bold text-gray-900">
                {pointsNeededForNext.toLocaleString()} more XP
              </span>{" "}
              to unlock the next level and access new premium rewards.
            </p>

            {/* Cards */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-6">
              <div className="bg-white/80 border border-gray-100 px-6 py-4 rounded-2xl w-44 shadow-sm">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">NEXT LEVEL</p>
                <p className="font-extrabold text-gray-800 mt-1 text-sm">Level {currentLevel + 1}</p>
              </div>

              <div className="bg-white/80 border border-gray-100 px-6 py-4 rounded-2xl w-44 shadow-sm">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">LEVEL PROGRESS</p>
                <p className="font-extrabold text-amber-600 mt-1 text-sm">{Math.round(percent)}% Complete</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 mb-8 gap-4">
            <div>
              <h2 className="text-xl font-bold uppercase tracking-wide">Achievement Vault</h2>
              <p className="text-gray-500 text-xs mt-0.5">
                Collect trophies and unlock premium travel perks.
              </p>
            </div>
            
            {/* Filter Tabs */}
            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-4 py-2 text-xs font-bold uppercase rounded-lg transition-all ${
                  activeFilter === "all"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                All Trophies
              </button>
              <button
                onClick={() => setActiveFilter("unlocked")}
                className={`px-4 py-2 text-xs font-bold uppercase rounded-lg transition-all ${
                  activeFilter === "unlocked"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Unlocked ({unlockedAwards.length})
              </button>
              <button
                onClick={() => setActiveFilter("locked")}
                className={`px-4 py-2 text-xs font-bold uppercase rounded-lg transition-all ${
                  activeFilter === "locked"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                In Progress ({lockedAwards.length})
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Awards Grid (Locked/In Progress) */}
              {(activeFilter === "all" || activeFilter === "locked") && lockedAwards.length > 0 && (
                <div className="space-y-6">
                  {activeFilter === "all" && lockedAwards.length > 0 && (
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Locked / In Progress</h3>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {lockedAwards.map((award: any) => {
                      const percent = Math.min(
                        Math.round((award.progress / award.target) * 100),
                        100,
                      );
                      const coverPhoto = award.config?.coverPhoto
                        ? getImageUrl(award.config.coverPhoto)
                        : undefined;
                      return (
                        <AwardCard
                          key={award._id}
                          title={award.config?.title || award.type}
                          description={award.config?.description}
                          progress={percent}
                          current={award.progress}
                          total={award.target}
                          coverPhoto={coverPhoto}
                          Icon={getAwardIcon(award.type)}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Unlocked Section */}
              {(activeFilter === "all" || activeFilter === "unlocked") && unlockedAwards.length > 0 && (
                <div className={activeFilter === "all" ? "mt-16 pt-10 border-t border-gray-100" : "space-y-6"}>
                  {activeFilter === "all" && (
                    <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Unlocked Awards</h2>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {unlockedAwards.map((award: any) => {
                      const rewardImage = award.config?.coverPhoto
                        ? getImageUrl(award.config.coverPhoto)
                        : getAwardImage(award.type);
                      return (
                        <UnlockedAwardCard
                          key={award._id}
                          title={award.config?.title || award.type}
                          description={award.config?.description}
                          image={rewardImage}
                        >
                          {award.type === "Free Map" ? (
                            <div className="pt-2">
                              {hasRedeemed ? (
                                <Button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold cursor-default text-xs uppercase tracking-wider py-5.5 rounded-xl">
                                  Redeemed
                                </Button>
                              ) : (
                                <Link href="/catalog" className="block w-full">
                                  <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider py-5.5 rounded-xl">
                                    Redeem Now
                                  </Button>
                                </Link>
                              )}
                            </div>
                          ) : award.config?.fileUrl ? (
                            <div className="pt-2">
                              <a
                                href={getImageUrl(award.config.fileUrl)}
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full"
                              >
                                <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-xs uppercase tracking-wider py-5.5 rounded-xl">
                                  Download PDF
                                </Button>
                              </a>
                            </div>
                          ) : null}
                        </UnlockedAwardCard>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {awardsData.length === 0 && (
                <div className="text-center py-20 text-gray-500 font-medium">
                  No awards found. Check back later!
                </div>
              )}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-12 bg-gray-50 p-4 rounded-xl border">
                  <Button
                    variant="outline"
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                    className="bg-white"
                  >
                    Previous
                  </Button>
                  <span className="text-gray-600 font-bold px-4">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() =>
                      setPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={page === totalPages}
                    className="bg-white"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
