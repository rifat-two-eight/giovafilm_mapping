"use client";

interface ContributionsSection {
  totalPoints: number;
  reviews: number;
  photos: number;
  progressToNextLevel: number;
  pointsUntilNextLevel: number;
}

import { useGetProfileQuery } from "@/redux/features/user/userApi";

export function ContributionsSection() {
  const { data: user, isLoading } = useGetProfileQuery({});
  
  const currentPoints = user?.points || 0;
  const currentLevel = user?.level || 0;

  // Levels thresholds mapping
  const USER_LEVELS = [
    { level: 0, name: "Explorador", points: 0, reviews: 0 },
    { level: 1, name: "Aventurero", points: 100, reviews: 6 },
    { level: 2, name: "Tlacuilo", points: 200, reviews: 13 },
    { level: 3, name: "Expedicionario", points: 400, reviews: 26 },
    { level: 4, name: "Viajero", points: 700, reviews: 46 },
    { level: 5, name: "Chasqui", points: 1300, reviews: 86 },
    { level: 6, name: "Cronista", points: 2300, reviews: 153 },
    { level: 7, name: "Pochteca", points: 4000, reviews: 266 },
    { level: 8, name: "Navegante", points: 6500, reviews: 433 },
    { level: 9, name: "Cartógrafo", points: 10000, reviews: 665 },
    { level: 10, name: "Gran Explorador", points: 15000, reviews: 1000 },
    { level: 11, name: "Conquistador", points: 22500, reviews: 1500 },
    { level: 12, name: "Gran Conquistador", points: 33000, reviews: 2200 },
    { level: 13, name: "Amauta", points: 48000, reviews: 3200 },
    { level: 14, name: "Leyenda", points: 67500, reviews: 4500 }
  ];

  const nextLevelIndex = currentLevel < 14 ? currentLevel + 1 : 14;
  const nextLevel = USER_LEVELS[nextLevelIndex];
  const nextLevelPoints = nextLevel.points;

  const pointsUntilNextLevel = Math.max(0, nextLevelPoints - currentPoints);
  const progressToNextLevel = nextLevelPoints > 0 ? Math.min(100, Math.round((currentPoints / nextLevelPoints) * 100)) : 100;

  return (
    <div className="bg-white rounded-2xl p-8 border border-gray-200 space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          Your Contributions
        </h2>
        <p className="text-gray-500 text-sm">
          Track your impact in the community
        </p>
      </div>

      {/* Statistics Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-gray-50 rounded-xl p-6 border border-gray-100 h-28 animate-pulse"
            />
          ))}
        </div>
      ) : (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* Total Points */}
        <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-100">
          <p className="text-gray-500 text-xs font-semibold tracking-wide mb-2">
            TOTAL POINTS
          </p>
          <p className="text-4xl font-bold text-yellow-500">{currentPoints}</p>
        </div>

        {/* Reviews */}
        <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-100">
          <p className="text-gray-500 text-xs font-semibold tracking-wide mb-2">
            APPROVED REVIEWS
          </p>
          <p className="text-4xl font-bold text-yellow-500">{user?.totalReviewsApproved || 0}</p>
        </div>

        {/* Level */}
        <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-100">
          <p className="text-gray-500 text-xs font-semibold tracking-wide mb-2">
            CURRENT LEVEL
          </p>
          <p className="text-4xl font-bold text-yellow-500">Lv {currentLevel}</p>
        </div>
      </div>
      )}

      {/* Progress Section */}
      <div className="space-y-3 pt-4 border-t border-gray-200">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            Progress to Level {nextLevelIndex}: <span className="text-yellow-600 font-bold">{nextLevel.name}</span>
          </h3>
          <p className="text-xs text-gray-500 mb-3">
            {pointsUntilNextLevel} pts and {Math.max(0, nextLevel.reviews - (user?.totalReviewsApproved || 0))} reviews until next rank
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-green-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressToNextLevel}%` }}
          />
        </div>

        {/* Progress Percentage */}
        <p className="text-xs text-right text-gray-600 font-medium">
          {progressToNextLevel}%
        </p>

        {/* Help Text */}
        <p className="text-xs text-gray-400 pt-2">
          💡 Earn points by adding reviews, uploading photos, and exploring new
          places.
        </p>
      </div>
    </div>
  );
}
