"use client";

import AdminReviewTasks from "@/components/dashboard/business/AdminReviewTasks";
import BusinessOverview from "@/components/dashboard/business/business-overview";
import HoursOfOperation from "@/components/dashboard/business/hours-of-operation";
import LocationVerification from "@/components/dashboard/business/LocationVerification";
import OwnerInformation from "@/components/dashboard/business/owner-information";
import PublicContactLinks from "@/components/dashboard/business/public-contact-links";
import { useRouter, useParams } from "next/navigation";
import {
  useGetSingleBusinessQuery,
  useUpdateBusinessStatusMutation,
  useDeleteBusinessMutation,
} from "@/redux/features/business/businessApi";
import { Loader2, ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import Swal from "sweetalert2";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";
import { NoImage } from "@/lib/others/others";

export default function BusinessDetailPage() {
  const router = useRouter();
  const { id } = useParams();

  const {
    data: response,
    isLoading,
    isError,
  } = useGetSingleBusinessQuery(id as string);
  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateBusinessStatusMutation();
  const [deleteBusiness] = useDeleteBusinessMutation();

  const business = response?.data;
  console.log("business----", business);

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      await updateStatus({ id: id as string, status: newStatus }).unwrap();
      toast.success(`Business ${newStatus} successfully!`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update status");
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      background: "#fff",
      color: "#1a1a1a",
    });

    if (result.isConfirmed) {
      try {
        await deleteBusiness(id as string).unwrap();
        toast.success("Business deleted successfully!");
        router.push("/dashboard/business");
      } catch (err: any) {
        toast.error(err?.data?.message || "Failed to delete business");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (isError || !business) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center p-6">
        <p className="text-xl font-semibold text-gray-500">
          Business not found or error loading data.
        </p>
        <Link
          href="/dashboard/business"
          className="text-blue-600 hover:underline flex items-center gap-2 font-medium"
        >
          <ArrowLeft size={16} /> Back to dashboard
        </Link>
      </div>
    );
  }

  // Adapter for existing components
  const businessData = {
    ...business,
    category: business.category?.name || "N/A",
    website: business.contact?.website || "N/A",
  };

  // Adapter for hours
  const mappedHours: any = {};
  if (business.hours?.schedule) {
    business.hours.schedule.forEach((item: any) => {
      const key = item.days.substring(0, 3).toUpperCase();
      mappedHours[key] = { start: item.openTime, end: item.closeTime };
    });
  }

  const reviewTasks = [
    { task: "Phone number verified", completed: !!business.contact?.phone },
    {
      task: "Website links functional",
      completed: !!business.contact?.website,
    },
    { task: "Media content clean", completed: true },
  ];

  return (
    <div className="pb-12">
      {/* breadcrumbs */}
      <div className="mb-6 flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <Link
          href="/dashboard/business"
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-all font-medium"
        >
          <ArrowLeft size={16} />
          Back to Businesses
        </Link>

        <div className="flex items-center gap-4">
          <span
            className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
              business.status === "Approved"
                ? "bg-green-50 text-green-700 border-green-200"
                : business.status === "Pending"
                  ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                  : "bg-red-50 text-red-700 border-red-200"
            }`}
          >
            {business.status}
          </span>
          <button
            onClick={handleDelete}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all border border-transparent hover:border-red-100"
            title="Delete Business"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <BusinessOverview businessData={businessData} />

          {/* Public Contact & Links */}
          <PublicContactLinks contact={business.user} />

          {/* Hours of Operation */}
          <HoursOfOperation hours={mappedHours} />

          {/* Photos & Media Review */}
          <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-gray-900">
                Photos & Media Gallery
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
              {business.media?.photos?.map((photo: string, idx: number) => (
                <div
                  key={idx}
                  className="rounded-xl aspect-square overflow-hidden group relative"
                >
                  {photo ? (
                    <Image
                      src={getImageUrl(photo)}
                      alt=""
                      width={100}
                      height={100}
                      unoptimized
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <NoImage />
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-gray-100 gap-6">
              <div className="text-center sm:text-left">
                <p className="font-bold text-gray-900 text-lg">
                  Final Review Action
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Assign the final status to this business listing
                </p>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  disabled={isUpdating}
                  onClick={() => handleStatusUpdate("Rejected")}
                  className="flex-1 sm:flex-none px-8 py-3 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 font-bold text-sm transition-all disabled:opacity-50"
                >
                  Reject
                </button>
                <button
                  disabled={isUpdating}
                  onClick={() => handleStatusUpdate("Approved")}
                  className="flex-1 sm:flex-none px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold text-sm shadow-lg shadow-blue-200 transition-all disabled:opacity-50"
                >
                  Approve & Publish
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-8">
          <OwnerInformation user={business?.user} />
          <LocationVerification
            businessId={id as string}
            location={business.location}
            isAccuracyVerified={business?.isAccuracyVerified}
          />
          <AdminReviewTasks reviewTasks={reviewTasks} />
        </div>
      </div>
    </div>
  );
}
