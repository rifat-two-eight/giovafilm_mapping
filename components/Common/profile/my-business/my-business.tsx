"use client";

import { useGetMyBusinessesQuery } from "@/redux/features/business/businessApi";
import { getImageUrl } from "@/lib/utils";
import {
  Building2,
  MapPin,
  Eye,
  Clock,
  Plus,
  MoreVertical,
  ExternalLink,
  Settings,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { NoImage } from "@/lib/others/others";
import { useCreateCheckoutSessionMutation } from "@/redux/features/subscription/subscriptionApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function MyBusinessPage() {
  const router = useRouter();
  const { data: response, isLoading } = useGetMyBusinessesQuery();
  const businesses = response?.data || [];
  console.log("Approved", businesses);

  const [createPayment, { isLoading: isPaymentLoading }] =
    useCreateCheckoutSessionMutation();

  // ['Pending', 'Approved', 'Rejected']

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "Approved":
        return "bg-emerald-500 text-emerald-600 border-emerald-500/20";
      case "Pending":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "Rejected":
        return "bg-rose-500/10 text-rose-600 border-rose-500/20";
      default:
        return "bg-slate-500/10 text-slate-600 border-slate-500/20";
    }
  };

  const handlePayNow = async (id: string) => {
    const data = {
      planId: id,
      successUrl: `${window.location.origin}/success`,
      cancelUrl: `${window.location.origin}/cancel`,
    };
    try {
      const res = await createPayment(data).unwrap();
      console.log(res);
      if (res?.data?.url || res?.url) {
        window.location.href = res.data?.url || res.url;
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[400px] w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              My <span className="text-primary">Businesses</span>
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              Manage and track your business performance across the platform.
            </p>
          </div>

          <Link href="/for-business">
            <Button className="rounded-xl px-6 h-12 bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 gap-2">
              <Plus size={20} strokeWidth={3} />
              Add New Business
            </Button>
          </Link>
        </div>

        {businesses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 px-6 bg-white rounded-3xl border border-slate-200 shadow-sm text-center"
          >
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <Building2 size={40} className="text-slate-300" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              No Businesses Yet
            </h2>
            <p className="text-slate-500 max-w-sm mb-8">
              Register your first business to start reaching thousands of
              travelers and local explorers.
            </p>
            <Link href="/for-business">
              <Button
                variant="outline"
                className="rounded-xl border-slate-200 hover:bg-slate-50 font-bold px-8"
              >
                Get Started
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {businesses.map((business: any, index: number) => (
              <motion.div
                key={business._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300"
              >
                {/* Image Section */}
                <Link
                  href={`/profile/my-business/${business._id}`}
                  className="relative h-56 w-full block overflow-hidden"
                >
                  {business.media?.photos.length > 0 ? (
                    <Image
                      src={getImageUrl(business.media?.photos?.[0])}
                      alt={business.name}
                      width={200}
                      height={200}
                      unoptimized
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <NoImage />
                  )}

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1   rounded-full flex items-center gap-2 shadow-sm border border-white/20">
                    <span className="text-base">
                      {business.category?.icon || "🏢"}
                    </span>
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      {business.category?.name || "General"}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <Badge
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(business.status)}`}
                    >
                      {business.status}
                    </Badge>
                  </div>
                </Link>

                {/* Content Section */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <Link href={`/profile/my-business/${business._id}`}>
                      <h3 className="text-xl font-black text-slate-900 group-hover:text-primary transition-colors line-clamp-1">
                        {business.name}
                      </h3>
                    </Link>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 hover:bg-slate-100 rounded-lg transition-colors text-slate-400">
                          <MoreVertical size={20} />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="rounded-xl border-slate-200 shadow-xl p-2 w-48"
                      >
                        <DropdownMenuItem
                          asChild
                          className="rounded-lg gap-2 font-medium focus:bg-slate-50 cursor-pointer"
                        >
                          <Link href={`/profile/my-business/${business._id}`}>
                            <Eye size={16} /> View Details
                          </Link>
                        </DropdownMenuItem>
                        {/* <DropdownMenuItem className="rounded-lg gap-2 font-medium focus:bg-slate-50 cursor-pointer">
                            <Settings size={16} /> Edit Details
                          </DropdownMenuItem>  */}
                        <DropdownMenuItem
                          onClick={() => {
                            const coords =
                              business.location?.mapLocation?.coordinates ||
                              business.location?.coordinates;
                            const lat = coords?.[1];
                            const lng = coords?.[0];
                            if (lat && lng) {
                              router.push(
                                `/view-location?lat=${lat}&lng=${lng}`,
                              );
                            } else {
                              toast.error("Invalid coordinates");
                            }
                          }}
                          className="rounded-lg gap-2 font-medium focus:bg-slate-50 cursor-pointer"
                        >
                          <ExternalLink size={16} /> View on Map
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-500 mb-4">
                    <MapPin size={16} />
                    <span className="text-xs font-medium truncate">
                      {business.location?.city}, {business.location?.country}
                    </span>
                  </div>

                  <p className="text-sm text-slate-600 line-clamp-2 mb-6 font-medium leading-relaxed">
                    {business.description}
                  </p>

                  {/* Stats Bar */}
                  <div className="flex items-center justify-between border-t pt-5 border-slate-100">
                    <div className="flex items-center gap-1.5 text-slate-400 mt-4">
                      <Clock size={16} />
                      <span className="text-sm font-bold text-slate-600">
                        {new Date(business.createdAt).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric" },
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-4">
                      {business.status === "Pending" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-amber-600 border-amber-300"
                        >
                          Approval Needed
                        </Button>
                      )}

                      {business?.hasActiveSubscription === false &&
                        business?.status === "Approved" && (
                          <Button
                            onClick={() => handlePayNow(business.plan)}
                            size="sm"
                            className="bg-primary text-white hover:bg-primary/90"
                            disabled={isPaymentLoading}
                          >
                            {isPaymentLoading ? "Processing..." : "Pay Now"}
                          </Button>
                        )}

                      {business?.hasActiveSubscription === true &&
                        business.status === "Approved" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-emerald-600 border-emerald-300"
                          >
                            Approved
                          </Button>
                        )}

                      {business.status === "Rejected" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-rose-600 border-rose-300"
                          disabled
                        >
                          Rejected
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
