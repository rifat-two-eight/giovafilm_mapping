"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Edit2, Link, Share2 } from "lucide-react";

interface MilestonesData {
  distanceTraveled: string;
  placesVisited: number;
  tripsPlanned: number;
}

interface ProfileSidebar {
  name: string;
  level: string;
  joinDate: string;
  avatar: string;
  milestones: MilestonesData;
}

interface ProfileProps {
  data: ProfileSidebar;
}

export function ProfileSidebar({ data }: ProfileProps) {
  console.log(data);
  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="bg-white rounded-lg p-6 border border-gray-200/70 text-center">
        {/* Avatar with Achievement Badge */}
        <div className="relative w-32 h-32 mx-auto mb-6">
          <Image
            src={data?.avatar}
            alt={data?.name}
            fill
            className="rounded-lg object-cover"
          />
          <div className="absolute bottom-0 right-0 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold text-lg border-2 border-white">
            ⭐
          </div>
        </div>

        {/* User Name */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{data?.name}</h2>

        {/* Level Badge */}
        <div className="inline-block bg-yellow-50 px-3 py-1 rounded-full mb-2">
          <span className="text-yellow-500 font-semibold text-sm">
            {data?.level}
          </span>
        </div>

        {/* Join Date */}
        <p className="text-gray-500 text-sm flex items-center justify-center gap-1 mb-8">
          📅 Joined {data?.joinDate}
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded flex items-center justify-center gap-2">
            <Edit2 size={18} />
            Edit Profile
          </Button>
          <Button
            variant="outline"
            className="w-full rounded flex items-center justify-center gap-2 border-gray-200"
          >
            <Share2 size={18} />
            Share Profile
          </Button>
          <Link
            href="/profile/awards"
            className="w-full rounded flex items-center justify-center gap-2 border-gray-200"
          >
            <Share2 size={18} />
            Share Profile
          </Link>
        </div>
      </div>

      {/* Milestones Card */}
      <div className="bg-gray-900 rounded-lg p-6 text-white overflow-hidden">
        <h3 className="font-bold text-lg mb-4 tracking-widest text-gray-400">
          MILESTONES
        </h3>

        <div className="space-y-4">
          {/* Distance Traveled */}
          <div className="flex items-center justify-between">
            <p className="text-sm mb-1">Distance Traveled</p>
            <p className="text-yellow-400 font-bold">
              {data?.milestones.distanceTraveled}
            </p>
          </div>

          {/* Places Visited */}
          <div className="flex items-center justify-between">
            <p className="text-sm mb-1">Places Visited</p>
            <p className="text-yellow-400 font-bold">
              {data?.milestones.placesVisited}
            </p>
          </div>

          {/* Trips Planned */}
          <div className="flex items-center justify-between">
            <p className="text-sm mb-1">Trips Planned</p>
            <p className="text-yellow-400 font-bold">
              {data?.milestones.tripsPlanned}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
