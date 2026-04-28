"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { NoImage } from "@/lib/others/others";
import { getImageUrl } from "@/lib/utils";
import { useGetSingleBusinessQuery } from "@/redux/features/business/businessApi";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Eye,
  Globe,
  Info,
  Instagram,
  MapPin,
  Phone,
  Shield,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

export default function BusinessDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { data: response, isLoading } = useGetSingleBusinessQuery(id as string);
  const business = response?.data;

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return <CheckCircle2 size={16} />;
      case "pending":
        return <Clock size={16} />;
      case "rejected":
        return <XCircle size={16} />;
      default:
        return <AlertCircle size={16} />;
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "pending":
        return "bg-amber-50 text-amber-600 border-amber-100";
      case "rejected":
        return "bg-rose-50 text-rose-600 border-rose-100";
      default:
        return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-8">
        <Skeleton className="h-10 w-32 rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-[400px] w-full rounded-3xl" />
            <Skeleton className="h-24 w-full rounded-2xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-64 w-full rounded-3xl" />
            <Skeleton className="h-64 w-full rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <AlertCircle size={40} className="text-slate-300" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Business Not Found
        </h2>
        <p className="text-slate-500 mb-8">
          The business you are looking for does not exist or you don't have
          access.
        </p>
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="rounded-xl px-8 font-bold"
        >
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/30 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-colors group"
          >
            <div className="p-2 rounded-xl bg-white border border-slate-200 group-hover:bg-slate-100 transition-all">
              <ArrowLeft size={20} />
            </div>
            Back to List
          </button>

          <div className="flex items-center gap-3">
            <Badge
              className={`px-4 py-2 rounded-xl border flex items-center gap-2 text-xs font-black uppercase tracking-wider ${getStatusStyles(business.status)}`}
            >
              {getStatusIcon(business.status)}
              {business.status}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content (Left) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2rem] overflow-hidden border border-slate-200 shadow-sm"
            >
              <div className="relative h-[350px] md:h-[450px] w-full">
                {business.media?.photos?.length > 0 ? (
                  <Image
                    src={getImageUrl(business.media.photos[0])}
                    alt={business.name}
                    width={1920}
                    height={1080}
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                    <NoImage />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                <div className="absolute bottom-8 left-8 right-8">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <div className="bg-primary px-4 py-1.5 rounded-full flex items-center gap-2 text-white shadow-lg shadow-primary/20">
                      <span className="text-lg">
                        {business.category?.icon || "🏢"}
                      </span>
                      <span className="text-xs font-black uppercase tracking-widest">
                        {business.category?.name}
                      </span>
                    </div>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                    {business.name}
                  </h1>
                </div>
              </div>

              <div className="p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Info className="text-primary" size={20} />
                  About Business
                </h3>
                <p className="text-slate-600 leading-relaxed text-lg font-medium whitespace-pre-wrap">
                  {business.description}
                </p>
              </div>
            </motion.div>

            {/* Exclusive Offer Section */}
            {business.offer && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-yellow-400 rounded-[2rem] p-8 md:p-10 border-4 border-yellow-300 shadow-xl shadow-yellow-100 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-10 opacity-10 transform translate-x-1/4 -translate-y-1/4 group-hover:scale-110 transition-transform duration-500">
                  <Shield size={250} />
                </div>

                <div className="relative z-10">
                  <div className="flex items-center gap-2 text-black/80 font-black tracking-tighter mb-6 uppercase text-sm">
                    <Shield size={20} strokeWidth={3} className="text-black" />
                    Exclusive Offer for Members
                  </div>

                  <h2 className="text-3xl md:text-4xl font-black text-black mb-6 leading-tight">
                    {business.offer.title}
                  </h2>

                  <p className="text-black/80 font-bold mb-8 text-lg max-w-xl">
                    {business.offer.description}
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-black/5 rounded-2xl p-4 border border-black/5 backdrop-blur-sm">
                      <p className="text-[10px] font-black text-black/60 uppercase tracking-widest mb-1">
                        Benefit
                      </p>
                      <p className="text-lg font-black text-black">
                        {business.offer.discountType === "Percentage"
                          ? `${business.offer.discount}% OFF`
                          : business.offer.discountType === "Flat"
                            ? `$${business.offer.discount} OFF`
                            : business.offer.discountType === "BOGO"
                              ? "Buy 1 Get 1"
                              : "Free Item"}
                      </p>
                    </div>
                    <div className="bg-black/5 rounded-2xl p-4 border border-black/5 backdrop-blur-sm">
                      <p className="text-[10px] font-black text-black/60 uppercase tracking-widest mb-1">
                        Validity
                      </p>
                      <p className="text-lg font-black text-black">
                        {business.offer.noExpiration
                          ? "Indefinite"
                          : business.offer.validUntil
                            ? new Date(
                                business.offer.validUntil,
                              ).toLocaleDateString()
                            : "Limited"}
                      </p>
                    </div>
                    <div className="bg-black/5 rounded-2xl p-4 border border-black/5 backdrop-blur-sm">
                      <p className="text-[10px] font-black text-black/60 uppercase tracking-widest mb-1">
                        Usage
                      </p>
                      <p className="text-lg font-black text-black">
                        {business.offer.maxRedemptions} claims
                      </p>
                    </div>
                    <div className="bg-black/5 rounded-2xl p-4 border border-black/5 backdrop-blur-sm">
                      <p className="text-[10px] font-black text-black/60 uppercase tracking-widest mb-1">
                        Duration
                      </p>
                      <p className="text-lg font-black text-black">
                        {business.offer.redemptionDuration} mins
                      </p>
                    </div>
                  </div>

                  {business.offer.redemptionRules?.length > 0 && (
                    <div className="mt-8 pt-8 border-t border-black/10">
                      <h4 className="text-sm font-black text-black uppercase tracking-widest mb-4">
                        Redemption Rules
                      </h4>
                      <ul className="space-y-3">
                        {business.offer.redemptionRules.map(
                          (rule: string, i: number) => (
                            <li
                              key={i}
                              className="flex items-start gap-3 text-black font-bold"
                            >
                              <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center text-[10px] text-yellow-400 shrink-0 mt-0.5">
                                {i + 1}
                              </div>
                              {rule}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Photo Gallery */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-slate-900 px-2 flex items-center gap-2">
                Photo Gallery
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {business.media?.photos?.map((photo: string, index: number) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className="relative aspect-square rounded-[2rem] overflow-hidden border border-slate-200 group"
                  >
                    <Image
                      src={getImageUrl(photo)}
                      alt={`Gallery ${index}`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Eye className="text-white" size={32} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar (Right) */}
          <div className="space-y-8">
            {/* Quick Stats Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm"
            >
              <h3 className="text-lg font-black text-slate-900 mb-6 uppercase tracking-widest">
                Analytics
              </h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-slate-500 font-bold">
                    <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                      <Eye size={20} />
                    </div>
                    Total Views
                  </div>
                  <span className="text-2xl font-black text-slate-900">
                    {business.viewCount || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-slate-500 font-bold">
                    <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                      <Calendar size={20} />
                    </div>
                    Joined Date
                  </div>
                  <span className="text-lg font-black text-slate-900">
                    {new Date(business.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm"
            >
              <h3 className="text-lg font-black text-slate-900 mb-6 uppercase tracking-widest">
                Contact Info
              </h3>
              <div className="space-y-5">
                {business.location?.address && (
                  <div className="flex items-start gap-4 group">
                    <div className="p-3 rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Address
                      </p>
                      <p className="text-sm font-bold text-slate-700">
                        {business.location.address}, {business.location.city}
                      </p>
                    </div>
                  </div>
                )}
                {business.contact?.phone && (
                  <div className="flex items-start gap-4 group">
                    <div className="p-3 rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all">
                      <Phone size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Phone
                      </p>
                      <p className="text-sm font-bold text-slate-700">
                        {business.contact.phone}
                      </p>
                    </div>
                  </div>
                )}
                {business.contact?.website && (
                  <div className="flex items-start gap-4 group">
                    <div className="p-3 rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                      <Globe size={20} />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Website
                      </p>
                      <a
                        href={business.contact.website}
                        target="_blank"
                        className="text-sm font-bold text-blue-600 hover:underline truncate block"
                      >
                        {business.contact.website}
                      </a>
                    </div>
                  </div>
                )}
                {business.contact?.instagram && (
                  <div className="flex items-start gap-4 group">
                    <div className="p-3 rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-rose-50 group-hover:text-rose-600 transition-all">
                      <Instagram size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Instagram
                      </p>
                      <p className="text-sm font-bold text-slate-700">
                        @{business.contact.instagram}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Hours Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm"
            >
              <h3 className="text-lg font-black text-slate-900 mb-6 uppercase tracking-widest">
                Business Hours
              </h3>
              <div className="space-y-4">
                {business.hours?.schedule?.length > 0 ? (
                  business.hours.schedule.map((h: any, i: number) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0"
                    >
                      <span className="font-black text-slate-900 text-sm uppercase tracking-wide">
                        {h.days}
                      </span>
                      <span className="text-sm font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
                        {h.openTime} - {h.closeTime}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 italic text-sm">
                    No specific hours listed.
                  </p>
                )}
              </div>
            </motion.div>

            {/* Call to Action */}
            <Button className="w-full h-16 rounded-2xl bg-slate-900 hover:bg-black text-white font-black text-lg gap-3 shadow-xl shadow-slate-200">
              <ExternalLink size={24} />
              View Public Page
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
