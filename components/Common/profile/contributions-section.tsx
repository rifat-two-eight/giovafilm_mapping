"use client";

interface ContributionsSection {
  totalPoints: number;
  reviews: number;
  photos: number;
  progressToNextLevel: number;
  pointsUntilNextLevel: number;
}

export function ContributionsSection() {
  const currentPoints = 1250;
  const nextLevelPoints = 2000;
  const pointsUntilNextLevel = nextLevelPoints - currentPoints;
  const progressToNextLevel = (currentPoints / nextLevelPoints) * 100;
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
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* Total Points */}
        <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-100">
          <p className="text-gray-500 text-xs font-semibold tracking-wide mb-2">
            TOTAL POINTS
          </p>
          <p className="text-4xl font-bold text-yellow-500">2450</p>
        </div>

        {/* Reviews */}
        <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-100">
          <p className="text-gray-500 text-xs font-semibold tracking-wide mb-2">
            REVIEWS
          </p>
          <p className="text-4xl font-bold text-yellow-500">24</p>
        </div>

        {/* Photos */}
        <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-100">
          <p className="text-gray-500 text-xs font-semibold tracking-wide mb-2">
            PHOTOS
          </p>
          <p className="text-4xl font-bold text-yellow-500">112</p>
        </div>
      </div>

      {/* Progress Section */}
      <div className="space-y-3 pt-4 border-t border-gray-200">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            Progress to Level 5
          </h3>
          <p className="text-xs text-gray-500 mb-3">
            {pointsUntilNextLevel} pts until next rank
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
