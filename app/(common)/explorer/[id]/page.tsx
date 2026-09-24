"use client";

import { Button } from "@/components/ui/button";
import { formatDate, getImageUrl, getLocalized } from "@/lib/utils";
import { NoImage } from "@/lib/others/others";
import { shareProfile } from "@/lib/share-profile";
import { useGetPublicProfileQuery } from "@/redux/features/user/userApi";
import { ArrowLeft, Globe, Instagram, Share2, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

import { useLanguage } from "@/lib/i18n/LanguageContext";

const USER_LEVELS = [
  "Explorador",
  "Aventurero",
  "Tlacuilo",
  "Expedicionario",
  "Viajero",
  "Chasqui",
  "Cronista",
  "Baquiano",
  "Cartógrafo",
  "Maestro Ruta",
  "Leyenda",
  "Gran Leyenda",
  "Mítico",
  "Inmortal",
  "Supremo",
];

export default function ExplorerProfilePage() {
  const { t, language } = useLanguage();
  const params = useParams();
  const userId = String(params?.id || "");
  const { data, isLoading, isError, error } = useGetPublicProfileQuery(userId, {
    skip: !userId,
  });
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);
    await shareProfile({
      userId: data?._id || userId,
      name: data?.name,
    });
    setIsSharing(false);
  };

  if (isLoading) {
    return (
      <main className="min-h-[60vh] bg-gray-50 flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
          <p className="text-sm text-gray-500">{t("explorer.loading_profile")}</p>
        </div>
      </main>
    );
  }

  if (isError || !data) {
    const message =
      (error as any)?.data?.message || "This explorer profile is not available.";
    return (
      <main className="min-h-[60vh] bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl p-8 text-center space-y-4">
          <h1 className="text-xl font-bold text-gray-900">{t("explorer.profile_unavailable")}</h1>
          <p className="text-sm text-gray-500">{message}</p>
          <Link href="/maps">
            <Button className="bg-yellow-400 text-black hover:bg-yellow-500">
              Explore maps
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  const USER_LEVEL_KEYS = [
    "explorador", "aventurero", "tlacuilo", "expedicionario", "viajero",
    "chasqui", "cronista", "baquiano", "cartografo", "maestro_ruta",
    "leyenda", "gran_leyenda", "mitico", "inmortal", "supremo"
  ];
  const levelKey = USER_LEVEL_KEYS[data.level ?? 0] || "explorador";
  const levelName = t(`levels.${levelKey}`) || USER_LEVELS[data.level ?? 0] || "Explorer";

  return (
    <main className="min-h-[70vh] bg-gray-50 py-10 px-4">
      <div className="max-w-lg mx-auto">
        <Link
          href="/maps"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6"
        >
          <ArrowLeft size={16} />
          Back to maps
        </Link>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 text-center shadow-sm">
          <div className="relative w-28 h-28 mx-auto mb-4 overflow-hidden rounded-xl border">
            {data.profile ? (
              <Image
                src={getImageUrl(data.profile)}
                alt={data.name || "Explorer"}
                width={200}
                height={200}
                unoptimized
                className="object-cover w-full h-full"
              />
            ) : (
              <NoImage />
            )}
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-xs border-2 border-white">
              L{data.level ?? 0}
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {data.name || "Explorer"}
          </h1>

          <div className="inline-block bg-yellow-400 text-black px-3.5 py-1 rounded-full mb-3">
            <span className="font-bold text-xs uppercase tracking-wider">
              ⭐ {levelName}
            </span>
          </div>

          <p className="text-sm text-gray-500 mb-1">
            {(data.points || 0).toLocaleString()} points
          </p>
          <p className="text-xs text-gray-400 mb-6">
            Joined {formatDate(data.createdAt) || "—"}
          </p>

          {data.description && (
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              {data.description}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            {data.website && (
              <a
                href={
                  data.website.startsWith("http")
                    ? data.website
                    : `https://${data.website}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:underline"
              >
                <Globe size={16} />
                Website
              </a>
            )}
            {data.instagram && (
              <a
                href={
                  data.instagram.startsWith("http")
                    ? data.instagram
                    : `https://instagram.com/${String(data.instagram).replace(/^@/, "")}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-pink-600 hover:underline"
              >
                <Instagram size={16} />
                Instagram
              </a>
            )}
          </div>

          <Button
            onClick={handleShare}
            disabled={isSharing}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-lg flex items-center justify-center gap-2 h-11"
          >
            <Share2 size={18} />
            {isSharing ? "Sharing..." : "Share this profile"}
          </Button>
        </div>

        {/* Public User Reviews & Experiences Section */}
        {Array.isArray(data.reviews) && data.reviews.length > 0 && (
          <div className="mt-6 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm font-public-sans text-left space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-extrabold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                <Star className="text-amber-500 fill-amber-500" size={18} />
                {language === "es" ? "Reseñas y Experiencias" : "Reviews & Experiences"}
              </h3>
              <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full">
                {data.reviews.length}
              </span>
            </div>

            <div className="space-y-3">
              {data.reviews.map((rev: any) => {
                const targetName = getLocalized(
                  rev.place?.name || rev.business?.name || rev.targetName || rev.placeName,
                  language
                ) || (language === "es" ? "Lugar Explorado" : "Explored Location");

                return (
                  <div key={rev._id || rev.id} className="bg-gray-50/80 border border-gray-100 p-4 rounded-xl space-y-2">
                    <div className="flex justify-between items-center gap-2">
                      <span className="font-bold text-sm text-gray-900 truncate">{targetName}</span>
                      <div className="flex items-center gap-1 bg-white border border-gray-200 px-2 py-0.5 rounded-lg text-amber-600 font-extrabold text-xs shrink-0">
                        <Star size={13} className="fill-amber-400 text-amber-400" />
                        {rev.rating || 5}
                      </div>
                    </div>

                    {rev.review && (
                      <p className="text-xs text-gray-600 leading-relaxed font-medium">
                        "{getLocalized(rev.review, language)}"
                      </p>
                    )}

                    {rev.createdAt && (
                      <p className="text-[10px] text-gray-400">
                        {formatDate(rev.createdAt)}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
