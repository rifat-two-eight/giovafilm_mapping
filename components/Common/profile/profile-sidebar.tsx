"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Edit2, Grid2x2, Heart, Map, Share2, Star, Trophy } from "lucide-react";
import Link from "next/link";
import ProfileUpdateModal from "./profile-update-modal";
import { useState } from "react";
import { formatDate, getImageUrl } from "@/lib/utils";

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
  const [open, setOpen] = useState(false);

  console.log(data);
  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="bg-white rounded-lg p-3 border border-gray-200/70 text-center space-y-3">
        <div className="border p-3 rounded-md ">
          {/* Avatar with Achievement Badge */}
          <div className="relative w-32 h-32 mx-auto mb-4">
            <Image
              src={getImageUrl(data?.profile)}
              alt={"profile"}
              width={500}
              height={500}
              unoptimized
              className="rounded-lg object-cover"
            />
            <div className="absolute bottom-0 right-0 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold text-lg border-2 border-white">
              ⭐
            </div>
          </div>

          {/* User Name */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {data?.name}
          </h2>

          {/* Level Badge */}
          <div className="inline-block bg-yellow-50 px-3 py-1 rounded-full mb-2">
            <span className="text-yellow-500 font-semibold text-sm">
              {data?.role}
            </span>
          </div>

          {/* Join Date */}
          <p className="text-gray-500 text-sm flex items-center justify-center gap-1 mb-6">
            📅 Joined {formatDate(data?.createdAt)}
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={() => setOpen(true)}
              className="w-full bg-yellow-400 hover:bg-primary hover:text-white text-black font-semibold rounded flex items-center justify-center gap-2"
            >
              <Edit2 size={18} />
              Edit Profile
            </Button>

            <Button
              variant="outline"
              className="w-full rounded flex items-center justify-center gap-2 border-gray-200 hover:bg-primary hover:text-white"
            >
              <Share2 size={18} />
              Share Profile
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Link href={"/dashboard"}>
            <Button
              variant="outline"
              className="w-full rounded flex items-center justify-center gap-2 border-gray-200 hover:bg-primary hover:text-white"
            >
              <Grid2x2 size={18} />
              Dashoard
            </Button>
          </Link>

          <Link href={"/profile/favorite-places"}>
            <Button
              variant="outline"
              className="w-full rounded flex items-center justify-center gap-2 border-gray-200 hover:bg-primary hover:text-white"
            >
              <Heart size={18} />
              Favorites
            </Button>
          </Link>

          <Link href={"/profile/purchased-maps"}>
            <Button
              variant="outline"
              className="w-full rounded flex items-center justify-center gap-2 border-gray-200 hover:bg-primary hover:text-white"
            >
              <Map size={18} />
              Purchased Maps
            </Button>
          </Link>

          <Link href={"/profile/contributions-reviews"}>
            <Button
              variant="outline"
              className="w-full rounded flex items-center justify-center gap-2 border-gray-200 hover:bg-primary hover:text-white"
            >
              <Star size={18} />
              Contributions
            </Button>
          </Link>

          <Link href={"/profile/awards"}>
            <Button
              variant="outline"
              className="w-full rounded flex items-center justify-center gap-2 border-gray-200 hover:bg-primary hover:text-white"
            >
              <Trophy size={18} />
              Awards
            </Button>
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
            <p className="text-yellow-400 font-bold">12,450 km</p>
          </div>

          {/* Places Visited */}
          <div className="flex items-center justify-between">
            <p className="text-sm mb-1">Places Visited</p>
            <p className="text-yellow-400 font-bold">48</p>
          </div>

          {/* Trips Planned */}
          <div className="flex items-center justify-between">
            <p className="text-sm mb-1">Trips Planned</p>
            <p className="text-yellow-400 font-bold">12</p>
          </div>
        </div>
      </div>
      <ProfileUpdateModal open={open} onOpenChange={setOpen} data={data} />
    </div>
  );
}
