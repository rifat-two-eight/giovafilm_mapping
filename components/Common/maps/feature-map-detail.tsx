"use client";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { getImageUrl } from "@/lib/utils";
import { useGetMapByIdQuery } from "@/redux/features/map/mapApi";
import { trackUsage } from "@/lib/record-visit";
import { useCreateMapCheckoutSessionMutation } from "@/redux/features/payment/paymentApi";
import { useGetProfileQuery } from "@/redux/features/user/userApi";
import {
  useGetAwardsQuery,
  useRedeemFreeMapMutation,
} from "@/redux/features/award/awardApi";
import { useAppSelector } from "@/redux/hook";
import { selectAccessToken } from "@/redux/features/auth/authSlice";
import { Star } from "lucide-react";
import Link from "next/link";
import { useLoginRequired } from "@/components/shared/login-required-modal";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function FeatureMapDetailPage() {
  const { t } = useLanguage();
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { openLoginRequired } = useLoginRequired();
  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const redeemFreeIntent = searchParams.get("redeemFreeMap") === "1";

  const {
    data: response,
    isLoading,
    isError,
  } = useGetMapByIdQuery(id as string, { skip: !id });
  const mapData = response?.data;
  useEffect(() => {
    if (!id) return;
    trackUsage("map", String(id));
  }, [id]);

  const accessToken = useAppSelector(selectAccessToken);
  const { data: userProfile, isLoading: isProfileLoading } = useGetProfileQuery({}, { skip: !accessToken });
  const { data: awardsRes } = useGetAwardsQuery(
    { page: 1, limit: 50 },
    { skip: !accessToken },
  );
  const purchasedMaps = userProfile?.purchasedMaps || [];

  const isPurchased = purchasedMaps.some((m: any) => {
    const mapId = typeof m === "object" ? m._id || m.id : m;
    return String(mapId) === String(id);
  });

  const hasAccess = mapData?.isPaid === false || isPurchased;

  const canClaimFreeMap = useMemo(() => {
    if (!accessToken || isProfileLoading || !userProfile || userProfile?.redeemedFreeMap || !mapData?.isPaid) {
      return false;
    }
    const awards = awardsRes?.data || [];
    return awards.some(
      (a: any) => a.type === "Free Map" && a.isUnlocked,
    );
  }, [accessToken, isProfileLoading, userProfile, mapData?.isPaid, awardsRes?.data]);

  const handleViewMap = () => {
    if (mapData?.name) {
      localStorage.setItem("selectedCountryFilter", mapData.name);
    }
    router.push("/maps");
  };

  const [createCheckout, { isLoading: isCheckingOut }] =
    useCreateMapCheckoutSessionMutation();
  const [redeemFreeMap, { isLoading: isRedeemingFree }] =
    useRedeemFreeMapMutation();
  const [mainImage, setMainImage] = useState<string | null>(null);

  const handleClaimFreeMap = async () => {
    if (!accessToken) {
      openLoginRequired(window.location.pathname + window.location.search);
      return;
    }
    try {
      await redeemFreeMap({ mapId: String(id) }).unwrap();
      toast.success("Free map claimed! Opening your map...");
      if (mapData?.name) {
        localStorage.setItem("selectedCountryFilter", mapData.name);
      }
      router.push("/maps");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to claim free map.");
    }
  };

  const handleBuyNow = async () => {
    if (!accessToken) {
      openLoginRequired(window.location.pathname + window.location.search);
      return;
    }

    // Prefer free redeem when Free Map award is unlocked
    if (canClaimFreeMap) {
      await handleClaimFreeMap();
      return;
    }

    if (redeemFreeIntent) {
      if (userProfile?.redeemedFreeMap) {
        toast.error("You have already redeemed your free map.");
      } else {
        toast.error("Unlock the Free Map award first, then claim a map.");
      }
      return;
    }

    try {
      // Amount is resolved server-side from Map.price
      const res = await createCheckout({
        mapId: id,
        successUrl: `${window.location.origin}?session_id={CHECKOUT_SESSION_ID}&success=true`,
        cancelUrl: `${window.location.origin}/payment-failed?success=false`,
      }).unwrap();

      if (res?.data?.url) {
        window.location.href = res.data.url;
      } else {
        toast.error("Failed to retrieve checkout URL.");
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Something went wrong during checkout.",
      );
    }
  };

  useEffect(() => {
    if (mapData?.images?.length > 0) {
      setMainImage(getImageUrl(mapData.images[0]));
    }
  }, [mapData]);

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-360 mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Skeleton className="h-96 w-full rounded-2xl" />
            <div className="space-y-6">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !mapData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {t("map.map_not_found")}
          </h2>
          <Button asChild>
            <Link href="/maps">{t("place.back_to_maps")}</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-360 mx-auto px-4 md:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="text-blue-600 hover:underline">
            {t("map.home")}
          </Link>
          <span>/</span>
          <Link href="/maps" className="text-blue-600 hover:underline">
            {t("map.regional_maps")}
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold">{mapData.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Side - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="bg-gray-200 rounded-2xl overflow-hidden aspect-square flex items-center justify-center">
              {mainImage ? (
                <img
                  src={mainImage}
                  alt={mapData.name}
                  className="w-full h-full object-cover transition-opacity duration-300"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="text-gray-400">{t("map.no_image_available")}</div>
              )}
            </div>

            {/* Carousel Thumbnails */}
            {mapData.images?.length > 1 && (
              <div className="w-full px-0">
                <Carousel className="w-full">
                  <CarouselContent>
                    {mapData.images.map((img: string, idx: number) => {
                      const thumbUrl = getImageUrl(img);
                      return (
                        <CarouselItem key={idx} className="basis-1/4">
                          <div
                            onClick={() => setMainImage(thumbUrl)}
                            className={`h-24 rounded-lg overflow-hidden cursor-pointer border-2 transition-all hover:border-yellow-400 ${
                              mainImage === thumbUrl
                                ? "border-yellow-400"
                                : "border-gray-200"
                            }`}
                          >
                            <img
                              src={thumbUrl}
                              alt={`Thumbnail ${idx + 1}`}
                              className="w-full h-full object-cover hover:scale-105 transition-transform"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        </CarouselItem>
                      );
                    })}
                  </CarouselContent>
                </Carousel>
              </div>
            )}
          </div>

          {/* Right Side - Details */}
          <div className="space-y-6">
            {/* Collection Label */}
            <div>
              <span className="inline-block text-yellow-500 font-bold text-sm tracking-wide mb-2 uppercase">
                {t("map.most_popular_collection")}
              </span>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {mapData.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-yellow-500">
                  ${mapData.price}
                </span>
                {mapData.totalReview > 0 ? (
                  <div className="flex items-center gap-1">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={18}
                          className={
                            i < Math.floor(mapData.rating || 0)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">
                      {mapData.rating} (
                      {(mapData.totalReview || 0).toLocaleString()} {t("map.reviews_count")})
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-sm text-gray-500">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} className="text-gray-300" />
                      ))}
                    </div>
                    <span>{t("map.no_reviews_yet")}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Buy / View Button */}
            {hasAccess ? (
              <Button
                onClick={handleViewMap}
                className="w-full text-black py-6 px-13.5 text-lg bg-yellow-400 hover:bg-yellow-500 font-bold rounded-lg transition-colors shadow-sm cursor-pointer border-none"
              >
                {t("map.already_purchased_view")}
              </Button>
            ) : (
              <Button
                onClick={canClaimFreeMap ? handleClaimFreeMap : handleBuyNow}
                disabled={isCheckingOut || isRedeemingFree}
                className="w-full text-black py-6 px-13.5 text-lg bg-primary/80 hover:bg-primary font-bold rounded-lg transition-colors shadow-sm cursor-pointer border-none disabled:opacity-70"
              >
                {isCheckingOut || isRedeemingFree
                  ? t("common.loading")
                  : canClaimFreeMap
                    ? t("map.claim_free_map")
                    : t("map.buy_now")}
              </Button>
            )}

            {/* Description Section */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-gray-900 underline">
                {t("map.map_description")}
              </h3>
              <p className="text-gray-700 leading-relaxed" style={{ whiteSpace: "pre-line" }}>
                {mapData.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
