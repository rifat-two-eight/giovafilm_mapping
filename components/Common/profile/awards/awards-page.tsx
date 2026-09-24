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
import { AwardDetailModal } from "./award-detail-modal";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useGetAwardsQuery } from "@/redux/features/award/awardApi";
import { useGetProfileQuery } from "@/redux/features/user/userApi";
import Link from "next/link";

import unlockImage from "@/public/offers-image/Gourmet Garden.png";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";
import { NoImage } from "@/lib/others/others";
import { useLanguage } from "@/lib/i18n/LanguageContext";

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

const USER_LEVELS = [
  { level: 0, name: "Explorador", points: 0, reviews: 0 },
  { level: 1, name: "Aventurero", points: 100, reviews: 6 },
  { level: 2, name: "Tlacuilo", points: 200, reviews: 13 },
  { level: 3, name: "Expedicionario", points: 400, reviews: 26 },
  { level: 4, name: "Viajero", points: 700, reviews: 46 },
  { level: 5, name: "Chasqui", points: 1300, reviews: 86 },
  { level: 6, name: "Cronista", points: 2200, reviews: 146 },
  { level: 7, name: "Baquiano", points: 3500, reviews: 233 },
  { level: 8, name: "Cartógrafo", points: 5500, reviews: 366 },
  { level: 9, name: "Maestro Ruta", points: 8500, reviews: 566 },
  { level: 10, name: "Leyenda", points: 13000, reviews: 866 },
  { level: 11, name: "Gran Leyenda", points: 20000, reviews: 1333 },
  { level: 12, name: "Mítico", points: 30000, reviews: 2000 },
  { level: 13, name: "Inmortal", points: 45000, reviews: 3000 },
  { level: 14, name: "Supremo", points: 65000, reviews: 4333 },
];

export default function AwardsPage() {
  const { t } = useLanguage();
  const [page, setPage] = useState(1);
  const limit = 10;
  const [activeFilter, setActiveFilter] = useState<"all" | "unlocked" | "locked">("all");
  const [selectedAward, setSelectedAward] = useState<any | null>(null);

  const { data: user, isLoading: isProfileLoading } = useGetProfileQuery({});
  const { data: awardsRes, isLoading } = useGetAwardsQuery({ page, limit });

  const awardsData = awardsRes?.data || [];
  const meta = awardsRes?.meta || { total: 0, page: 1, limit: 10 };
  const totalPages = Math.max(1, Math.ceil((meta.total || 0) / limit));

  const sortedAwards = [...awardsData].sort((a: any, b: any) => (a.target || 0) - (b.target || 0));
  const lockedAwards = sortedAwards.filter((a: any) => !a.isUnlocked);
  const unlockedAwards = sortedAwards.filter((a: any) => a.isUnlocked);

  const hasRedeemed = !!user?.redeemedFreeMap;

  // Accurate Level progression math based on spec
  const points = user?.points || 0;
  const currentLevel = user?.level ?? 0;
  const currentLevelData = USER_LEVELS[currentLevel] || USER_LEVELS[0];
  const nextLevelIndex = currentLevel < 14 ? currentLevel + 1 : 14;
  const nextLevelData = USER_LEVELS[nextLevelIndex];

  const getUserLevelName = (lvlIdx: number) => {
    const keys = [
      "explorador", "aventurero", "tlacuilo", "expedicionario", "viajero",
      "chasqui", "cronista", "baquiano", "cartografo", "maestro_ruta",
      "leyenda", "gran_leyenda", "mitico", "inmortal", "supremo"
    ];
    const key = keys[lvlIdx] || "explorador";
    return t(`levels.${key}`) || USER_LEVELS[lvlIdx]?.name || "Explorer";
  };

  const currentLevelMinPoints = currentLevelData.points;
  const nextLevelMinPoints = nextLevelData.points;
  const pointsNeededForNext = Math.max(0, nextLevelMinPoints - points);
  const pointsSpan = Math.max(1, nextLevelMinPoints - currentLevelMinPoints);
  const percent =
    currentLevel >= 14
      ? 100
      : Math.min(100, Math.max(0, ((points - currentLevelMinPoints) / pointsSpan) * 100));
  const strokeDashoffset = 440 - (440 * percent) / 100;

  return (
    <div className="py-3 md:py-12 bg-white min-h-screen">
      <div className="max-w-360 mx-auto px-3 md:px-6 font-public-sans">
        {/* Page Title */}
        <h1 className="text-lg md:text-2xl font-bold mb-2 md:mb-5 uppercase tracking-wide">Awards & Achievements</h1>

        <div className="bg-amber-500/10 p-2.5 md:p-6 rounded-xl md:rounded-3xl flex flex-row items-center justify-between border border-amber-500/15 mb-4 md:mb-8 shadow-sm">
          {/* LEFT: Progress Circle */}
          <div className="relative w-14 h-14 md:w-36 md:h-36 flex items-center justify-center shrink-0">
            <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 160 160">
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
              {isProfileLoading ? (
                <>
                  <div className="mx-auto h-3 w-10 bg-gray-200 animate-pulse rounded" />
                  <p className="text-[6px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                    XP POINTS
                  </p>
                </>
              ) : (
                <>
                  <p className="text-xs sm:text-base md:text-2xl font-extrabold text-gray-900 leading-none">
                    {points.toLocaleString()}
                  </p>
                  <p className="text-[6px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5 leading-none">
                    XP POINTS
                  </p>
                </>
              )}
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="flex-1 ml-2 md:ml-8 text-left w-full">
            {/* Level badge */}
            <span className="inline-block bg-amber-500/20 text-amber-800 px-2 py-0.5 md:px-4 md:py-1 rounded-full text-[8px] md:text-xs font-bold mb-0.5 md:mb-2 uppercase tracking-wider">
              {isProfileLoading
                ? "Loading..."
                : `🏆 Level ${currentLevel} · ${getUserLevelName(currentLevel)}`}
            </span>

            {/* Name */}
            <h2 className="text-xs sm:text-base md:text-xl font-bold text-gray-900 capitalize leading-tight">
              {isProfileLoading ? (
                <span className="inline-block h-4 w-20 bg-gray-200 animate-pulse rounded" />
              ) : (
                user?.name || "Explorer"
              )}
            </h2>

            {/* Description */}
            <p className="hidden md:block text-gray-500 mt-1.5 text-sm leading-relaxed max-w-xl">
              You're making incredible progress! Earn{" "}
              <span className="font-bold text-gray-900">
                {pointsNeededForNext.toLocaleString()} more XP
              </span>{" "}
              to unlock the next level and access new premium rewards.
            </p>

            {/* Cards */}
            <div className="flex gap-1.5 md:gap-3 mt-1 md:mt-3 w-full">
              <div className="bg-white/80 border border-gray-100 px-2 py-1 md:px-4 md:py-2.5 rounded-lg md:rounded-xl flex-1 md:flex-none md:w-36 shadow-sm">
                <p className="text-[6px] md:text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">{t("common.next_level")}</p>
                <p className="font-extrabold text-gray-800 mt-0.5 text-[9px] md:text-xs leading-none">
                  {currentLevel >= 14 ? "Max Level" : `Level ${nextLevelData.level} · ${getUserLevelName(nextLevelIndex)}`}
                </p>
              </div>

              <div className="bg-white/80 border border-gray-100 px-2 py-1 md:px-4 md:py-2.5 rounded-lg md:rounded-xl flex-1 md:flex-none md:w-36 shadow-sm">
                <p className="text-[6px] md:text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">LEVEL PROGRESS</p>
                <p className="font-extrabold text-amber-600 mt-0.5 text-[9px] md:text-xs leading-none">{Math.round(percent)}%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 md:mt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-3 md:pb-4 mb-4 md:mb-8 gap-3">
            <div>
              <h2 className="text-lg md:text-xl font-bold uppercase tracking-wide">Achievement Vault</h2>
              <p className="text-gray-500 text-[11px] md:text-xs mt-0.5">
                Collect trophies and unlock premium travel perks.
              </p>
            </div>
            
            {/* Filter Tabs */}
            <div className="flex bg-gray-100 p-0.5 md:p-1 rounded-xl self-start md:self-auto">
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-2.5 py-1.5 md:px-4 md:py-2 text-[10px] md:text-xs font-bold uppercase rounded-lg transition-all ${
                  activeFilter === "all"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                All Trophies
              </button>
              <button
                onClick={() => setActiveFilter("unlocked")}
                className={`px-2.5 py-1.5 md:px-4 md:py-2 text-[10px] md:text-xs font-bold uppercase rounded-lg transition-all ${
                  activeFilter === "unlocked"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Unlocked ({unlockedAwards.length})
              </button>
              <button
                onClick={() => setActiveFilter("locked")}
                className={`px-2.5 py-1.5 md:px-4 md:py-2 text-[10px] md:text-xs font-bold uppercase rounded-lg transition-all ${
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
              {/* Unified Symmetrical Awards Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8 items-stretch">
                {sortedAwards
                  .filter((award: any) => {
                    if (activeFilter === "unlocked") return award.isUnlocked;
                    if (activeFilter === "locked") return !award.isUnlocked;
                    return true;
                  })
                  .map((award: any) => {
                    if (award.isUnlocked) {
                      const rewardImage = award.config?.coverPhoto
                        ? getImageUrl(award.config.coverPhoto)
                        : getAwardImage(award.type);
                      return (
                        <UnlockedAwardCard
                          key={award._id}
                          title={award.config?.title || award.type}
                          description={award.config?.description}
                          image={rewardImage}
                          onClick={() => setSelectedAward(award)}
                        >
                          {award.type === "Free Map" ? (
                            <div className="pt-1.5">
                              {isProfileLoading ? (
                                <Button className="w-full bg-gray-200 text-gray-400 font-bold cursor-default text-[11px] sm:text-xs uppercase tracking-wider h-10 sm:h-11 rounded-xl border-none" disabled>
                                  Loading...
                                </Button>
                              ) : hasRedeemed ? (
                                <Button className="w-full bg-gray-300 text-gray-500 font-bold cursor-default text-[11px] sm:text-xs uppercase tracking-wider h-10 sm:h-11 rounded-xl border-none" disabled>
                                  Used
                                </Button>
                              ) : (
                                <Link
                                  href="/catalog?redeemFreeMap=1"
                                  className="block w-full"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-[11px] sm:text-xs uppercase tracking-wider h-10 sm:h-11 rounded-xl border-none shadow-sm shadow-amber-200/50 cursor-pointer">
                                    Redeem Now
                                  </Button>
                                </Link>
                              )}
                            </div>
                          ) : award.config?.fileUrl ? (
                            <div className="pt-1.5">
                              <a
                                href={getImageUrl(award.config.fileUrl)}
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] sm:text-xs uppercase tracking-wider h-10 sm:h-11 rounded-xl border-none shadow-sm shadow-emerald-200/50 cursor-pointer">
                                  Download PDF
                                </Button>
                              </a>
                            </div>
                          ) : award.type?.includes("Discount") || award.type?.includes("10%") || award.config?.discountPercentage ? (
                            <div className="pt-1.5">
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedAward(award);
                                }}
                                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-[11px] sm:text-xs uppercase tracking-wider h-10 sm:h-11 rounded-xl border-none shadow-sm shadow-amber-200/50 cursor-pointer"
                              >
                                Use Discount
                              </Button>
                            </div>
                          ) : null}
                        </UnlockedAwardCard>
                      );
                    } else {
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
                          onClick={() => setSelectedAward(award)}
                        />
                      );
                    }
                  })}
              </div>

              {/* Empty States */}
              {awardsData.length === 0 ? (
                <div className="text-center py-20 text-gray-500 font-medium">
                  No awards found. Check back later!
                </div>
              ) : activeFilter === "unlocked" && unlockedAwards.length === 0 ? (
                <div className="text-center py-20 text-gray-500 font-medium">
                  No unlocked awards yet. Keep exploring to earn rewards!
                </div>
              ) : activeFilter === "locked" && lockedAwards.length === 0 ? (
                <div className="text-center py-20 text-gray-500 font-medium">
                  No awards in progress right now.
                </div>
              ) : null}

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

      {/* Award Detail Modal */}
      <AwardDetailModal
        isOpen={!!selectedAward}
        onClose={() => setSelectedAward(null)}
        award={selectedAward}
        user={user}
      />
    </div>
  );
}
