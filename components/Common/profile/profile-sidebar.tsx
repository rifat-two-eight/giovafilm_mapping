"use client";

import { Button } from "@/components/ui/button";
import { formatDate, getImageUrl } from "@/lib/utils";
import { shareProfile } from "@/lib/share-profile";
import {
  Check,
  Edit2,
  Heart,
  Loader2,
  Map,
  Share2,
  Star,
  Trophy,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ProfileUpdateModal from "./profile-update-modal";
import { NoImage } from "@/lib/others/others";
import { useGetProfileQuery } from "@/redux/features/user/userApi";

const allProfileLinks = [
  {
    href: "/profile/favorite-places",
    label: "Favorites",
    icon: Heart,
    roles: ["all"],
  },
  {
    href: "/profile/purchased-maps",
    label: "Purchased Maps",
    icon: Map,
    roles: ["user"],
  },
  {
    href: "/profile/contributions-reviews",
    label: "Contributions",
    icon: Star,
    roles: ["all"],
  },
  {
    href: "/profile/awards",
    label: "Awards",
    icon: Trophy,
    roles: ["all"],
  },
];

interface ProfileSidebar {
  _id?: string;
  name: string;
  role: string;
  createdAt: string;
  profile: string;
  level?: number;
  points?: number;
  phone?: string;
  website?: string;
  instagram?: string;
}

interface ProfileProps {
  data: ProfileSidebar;
}

export function ProfileSidebar({ data }: ProfileProps) {
  const [open, setOpen] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const { data: profile } = useGetProfileQuery({});
  const isAdminOrEditor = ["admin", "super_admin", "map_editor"].includes(profile?.role || "");

  // Admins/Editors: hide "Purchased Maps" (they don't buy maps)
  const profileLinks = allProfileLinks.filter((link) =>
    link.roles.includes("all") || (!isAdminOrEditor && link.roles.includes("user"))
  );

  const handleShare = async () => {
    setIsSharing(true);
    const result = await shareProfile({
      userId: data?._id,
      name: data?.name,
    });
    setIsSharing(false);
    if (result === "copied" || result === "shared") {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="bg-white rounded-lg p-3 border border-gray-200/70 text-center space-y-3">
        <div className="border p-3 rounded-md ">
          {/* Avatar with Achievement Badge */}
          <div className="relative w-32 h-32 mx-auto mb-4 overflow-hidden rounded-lg">
            {data?.profile ? (
              <Image
                src={getImageUrl(data?.profile)}
                alt={"profile"}
                width={500}
                height={500}
                unoptimized
                className="object-cover h-full"
              />
            ) : (
              <NoImage />
            )}

            <div className="absolute bottom-0 right-0 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-white shadow-sm">
              L{data?.level ?? 0}
            </div>
          </div>

          {/* User Name */}
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {data?.name}
          </h2>

          {/* Level Name Badge */}
          {(() => {
            const USER_LEVELS = [
              "Explorador",
              "Aventurero",
              "Tlacuilo",
              "Expedicionario",
              "Viajero",
              "Chasqui",
              "Cronista",
              "Pochteca",
              "Navegante",
              "Cartógrafo",
              "Gran Explorador",
              "Conquistador",
              "Gran Conquistador",
              "Amauta",
              "Leyenda",
            ];
            const levelName = USER_LEVELS[data?.level ?? 0] || "Explorador";
            return (
              <div className="inline-block bg-yellow-400 text-black px-3.5 py-1 rounded-full mb-3 shadow-xs">
                <span className="font-bold text-xs uppercase tracking-wider">
                  ⭐ {levelName}
                </span>
              </div>
            );
          })()}

          {/* Role Badge */}
          <div className="block mb-2">
            <span className="text-gray-400 font-semibold text-xs uppercase tracking-wider">
              {data?.role}
            </span>
          </div>

          {/* Join Date */}
          <p className="text-gray-500 text-sm flex items-center justify-center gap-1 mb-6">
            📅 Joined {formatDate(data?.createdAt) || 0}
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              type="button"
              onClick={() => setOpen(true)}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded flex items-center justify-center gap-2"
            >
              <Edit2 size={18} />
              Edit Profile
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleShare}
              disabled={isSharing || !data?._id}
              className="w-full rounded flex items-center justify-center gap-2 border-gray-200 hover:bg-yellow-50"
            >
              {isSharing ? (
                <Loader2 size={18} className="animate-spin" />
              ) : shareCopied ? (
                <Check size={18} className="text-green-600" />
              ) : (
                <Share2 size={18} />
              )}
              {shareCopied ? "Link Copied!" : "Share Profile"}
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {profileLinks.map((item, index) => {
            const Icon = item.icon;

            return (
              <Link key={index} href={item.href}>
                <Button
                  variant="outline"
                  className="w-full rounded flex items-center justify-center gap-2 border-gray-200 hover:bg-primary hover:text-white"
                >
                  <Icon size={18} />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Milestones Card */}
      <div className="bg-gray-900 rounded-lg p-6 text-white overflow-hidden">
        <h3 className="font-bold text-lg mb-4 tracking-widest text-gray-400">
          MILESTONES
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm mb-1">Distance Traveled</p>
            <p className="text-yellow-400 font-bold">12,450 km</p>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm mb-1">Places Visited</p>
            <p className="text-yellow-400 font-bold">48</p>
          </div>

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
