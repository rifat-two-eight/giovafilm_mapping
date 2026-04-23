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

  const { data: user } = useGetProfileQuery({});
  const { data: awardsRes, isLoading } = useGetAwardsQuery({ page, limit });

  const awardsData = awardsRes?.data || [];
  const meta = awardsRes?.meta || { total: 0, page: 1, limit: 10 };
  const totalPages = Math.max(1, Math.ceil((meta.total || 0) / limit));

  const lockedAwards = awardsData.filter((a: any) => !a.isUnlocked);
  const unlockedAwards = awardsData.filter((a: any) => a.isUnlocked);

  const hasRedeemed = !!user?.redeemedFreeMap;

  console.log(user);

  // ✅ NEW: Progress logic (no UI style change, just text)
  const currentPoints = 1250;
  const nextLevelPoints = 2000;

  return (
    <div className="py-16 bg-white min-h-screen">
      <div className="max-w-360 mx-auto px-4 md:px-6">
        {/* Page Title */}
        <h1 className="text-2xl font-bold mb-5">AWARDS</h1>

        {/* <div className="flex flex-col items-center py-12 bg-white rounded-2xl mb-8">
          <div className="w-32 h-32 mb-6 relative">
            {user?.profile ? (
              <Image
                src={getImageUrl(user?.profile)}
                alt="John Doe"
                unoptimized
                width={500}
                height={500}
                className="w-full h-full rounded-full object-cover border-4 border-gray-200"
              />
            ) : (
              <NoImage />
            )}
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">John Doe</h1>

          <div className="flex items-center gap-3 text-sm">
            <span className="bg-yellow-100 text-yellow-700 font-semibold px-4 py-1 rounded-full">
              Level {user?.level || 0} EXPLORER
            </span>
            •
            <span className="bg-yellow-100 text-yellow-700 font-semibold px-4 py-1 rounded-full">
              {user?.points.toLocaleString() || 0} POINTS
            </span>
            <span className="text-gray-600">• Joined Oct 2023</span>
          </div>

          <p className="text-gray-500 text-sm mt-2">
            {currentPoints.toLocaleString()} /{" "}
            {nextLevelPoints.toLocaleString()} points to next level
          </p>
        </div> */}

        <div className="bg-primary/10 p-8 rounded-3xl flex gap-8 items-center justify-between">
          {/* LEFT: Progress Circle */}
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="absolute w-full h-full">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="#e5e7eb"
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
                strokeDashoffset="110" // adjust based on progress
                strokeLinecap="round"
              />
            </svg>

            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">
                {user?.points?.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">XP POINTS</p>
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="flex-1 ml-10">
            {/* Level badge */}
            <span className="inline-block bg-yellow-100 text-yellow-700 px-4 py-1 rounded-full text-sm font-semibold mb-2">
              🏆 Level {user?.level || 1} Explorer
            </span>

            {/* Name */}
            <h2 className="text-xl font-semibold text-gray-900">
              {user?.name}
            </h2>

            {/* Description */}
            <p className="text-gray-500 mt-1">
              You're making incredible progress! Earn{" "}
              <span className="font-semibold text-gray-700">
                {nextLevelPoints - currentPoints} more XP
              </span>{" "}
              to unlock the <span className="font-semibold">Pathfinder</span>{" "}
              rank.
            </p>

            {/* Cards */}
            <div className="flex gap-4 mt-6">
              <div className="bg-gray-200 px-6 py-4 rounded-xl w-48">
                <p className="text-xs text-gray-500">NEXT REWARD</p>
                <p className="font-semibold text-gray-800">Pro Filter Pack</p>
              </div>

              <div className="bg-gray-200 px-6 py-4 rounded-xl w-48">
                <p className="text-xs text-gray-500">WORLD RANK</p>
                <p className="font-semibold text-gray-800">#2,482</p>
              </div>

              <div className="bg-gray-200 px-6 py-4 rounded-xl w-48">
                <p className="text-xs text-gray-500">STREAK</p>
                <p className="font-semibold text-gray-800">12 Days</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold ">Achievement Vault</h2>
            <p className="text-gray-500 text-sm">
              Collect trophies and unlock premium travel perks.
            </p>
          </div>
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-12 h-12 border-4 border-yellow-400 rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Awards Grid (Locked/In Progress) */}
              {lockedAwards.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {lockedAwards.map((award: any) => {
                    const percent = Math.min(
                      Math.round((award.progress / award.target) * 100),
                      100,
                    );
                    return (
                      <AwardCard
                        key={award._id}
                        title={award.type}
                        progress={percent}
                        current={award.progress}
                        total={award.target}
                        Icon={getAwardIcon(award.type)}
                      />
                    );
                  })}
                </div>
              )}

              {/* Unlocked Section */}
              {unlockedAwards.length > 0 && (
                <div className="mt-16 pt-10">
                  <h2 className="text-2xl font-bold mb-6">Unlocked Awards</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {unlockedAwards.map((award: any) => (
                      <UnlockedAwardCard
                        key={award._id}
                        title={award.type}
                        image={getAwardImage(award.type)}
                      >
                        {award.type === "Free Map" && (
                          <div className="pt-2">
                            {hasRedeemed ? (
                              <Button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold cursor-default">
                                Redeemed
                              </Button>
                            ) : (
                              <Link href="/catalog" className="block w-full">
                                <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold">
                                  Redeem Now
                                </Button>
                              </Link>
                            )}
                          </div>
                        )}
                      </UnlockedAwardCard>
                    ))}
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
