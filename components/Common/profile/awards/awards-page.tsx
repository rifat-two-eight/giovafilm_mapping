"use client";

import {
  Utensils,
  MessageSquare,
  Mountain,
  Feather,
  Trophy,
} from "lucide-react";
import { AwardCard } from "./award-card";
import { UnlockedAwardCard } from "./unlocked-award-card";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useGetAwardsQuery } from "@/redux/features/award/awardApi";

import unlockImage from "@/public/offers-image/Gourmet Garden.png";

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

  const { data: awardsRes, isLoading } = useGetAwardsQuery({ page, limit });

  const awardsData = awardsRes?.data || [];
  const meta = awardsRes?.meta || { total: 0, page: 1, limit: 10 };
  const totalPages = Math.max(1, Math.ceil((meta.total || 0) / limit));

  const lockedAwards = awardsData.filter((a: any) => !a.isUnlocked);
  const unlockedAwards = awardsData.filter((a: any) => a.isUnlocked);

  console.log(awardsData);

  return (
    <div className="py-16 bg-white min-h-screen">
      <div className="max-w-360 mx-auto px-4 md:px-6">
        {/* Page Title */}
        <h1 className="text-4xl font-bold text-center mb-10">AWARDS</h1>

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
                    />
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
  );
}
