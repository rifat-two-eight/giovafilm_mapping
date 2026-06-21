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
import { useCreateMapCheckoutSessionMutation } from "@/redux/features/payment/paymentApi";
import { Star } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import SimilarMaps from "./similar-maps";

interface MapDetail {
  id: number;
  title: string;
  collection: string;
  price: string;
  rating: number;
  reviews: number;
  description: string;
  mainImage: string;
  thumbnails: string[];
  features: Array<{ icon: string; text: string }>;
}

export default function FeatureMapDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const {
    data: response,
    isLoading,
    isError,
  } = useGetMapByIdQuery(id as string);
  const mapData = response?.data;

  console.log("mapData", mapData);

  const [createCheckout, { isLoading: isCheckingOut }] =
    useCreateMapCheckoutSessionMutation();
  const [mainImage, setMainImage] = useState<string | null>(null);

  const handleBuyNow = async () => {
    // Validate authentication
    const hasToken = document.cookie.includes("accessToken=");
    if (!hasToken) {
      toast.error("Please log in to purchase this map.");
      router.push("/login");
      return;
    }

    try {
      const res = await createCheckout({
        mapId: id,
        amount: mapData?.price,
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
            Map not found
          </h2>
          <Button asChild>
            <Link href="/maps">Back to Maps</Link>
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
            Home
          </Link>
          <span>/</span>
          <Link href="/maps" className="text-blue-600 hover:underline">
            Regional Maps
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
                <div className="text-gray-400">No Image Available</div>
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
                Most Popular Collection
              </span>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {mapData.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-yellow-500">
                  ${mapData.price}
                </span>
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
                    {(mapData.totalReview || 0).toLocaleString()} reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* Buy Button */}
            <Button
              onClick={handleBuyNow}
              disabled={isCheckingOut}
              className="w-full text-black py-6 px-13.5 text-lg bg-primary/80 hover:bg-primary font-bold rounded-lg transition-colors shadow-sm cursor-pointer border-none disabled:opacity-70"
            >
              {isCheckingOut ? "PROCESSING..." : "BUY NOW"}
            </Button>

            {/* Features Icons */}
            {/* <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <Download size={24} className="mx-auto mb-2 text-yellow-500" />
                <p className="text-xs font-semibold text-gray-700">
                  INSTANT DOWNLOAD
                </p>
              </div>
              <div className="text-center">
                <RotateCcw size={24} className="mx-auto mb-2 text-yellow-500" />
                <p className="text-xs font-semibold text-gray-700">
                  FREE UPDATES
                </p>
              </div>
              <div className="text-center">
                <Shield size={24} className="mx-auto mb-2 text-yellow-500" />
                <p className="text-xs font-semibold text-gray-700">
                  VERIFIED DATA
                </p>
              </div>
            </div> */}

            {/* Description Section */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-gray-900 underline">
                MAP DESCRIPTION
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {mapData.description}
              </p>
            </div>

            {/* Key Features */}
            {/* <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 underline">
                KEY FEATURES
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {features.map((feature: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="text-xl">{feature.icon}</span>
                    <span className="text-gray-700">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
