"use client";

import { Edit, Pause, Play, Trash2 } from "lucide-react";
import {
  useDeleteOfferMutation,
  useGetOffersQuery,
} from "@/redux/features/offer/offerApi";
import Swal from "sweetalert2";
import { toast } from "sonner";

export function OffersTable({ onEdit }: { onEdit?: (offer: any) => void }) {
  const { data: offersRes, isLoading } = useGetOffersQuery({});
  const [deleteOffer] = useDeleteOfferMutation();

  const offersData = offersRes?.data || [];

  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteOffer(id).unwrap();
          Swal.fire({
            title: "Deleted!",
            text: "The offer has been deleted.",
            icon: "success",
            confirmButtonColor: "#A855F7",
          });
        } catch (error: any) {
          toast.error(error?.data?.message || "Failed to delete offer");
        }
      }
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Paused":
        return "bg-yellow-100 text-yellow-800";
      case "Expired":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Header */}
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Offer Title
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Place
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Discount
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Valid Until
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Redemptions
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Actions
              </th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-10 text-center text-gray-400"
                >
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    Loading offers...
                  </div>
                </td>
              </tr>
            ) : offersData.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-10 text-center text-gray-500"
                >
                  No offers found. Create one to get started!
                </td>
              </tr>
            ) : (
              offersData.map((offer: any, index: number) => (
                <tr
                  key={offer._id}
                  className={`${
                    index !== offersData.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  } hover:bg-gray-50 transition-colors`}
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {offer.title}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {offer.place?.name || "N/A"}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {offer.discountValue}
                    {offer.discountType === "Percentage" ? "%" : ""}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(offer.validUntil).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        offer.status,
                      )}`}
                    >
                      {offer.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {offer.redemptionsCount || 0}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-3">
                      {/* Edit */}
                      <button
                        onClick={() => onEdit?.(offer)}
                        className="text-blue-500 hover:text-blue-700 transition-colors"
                        aria-label="Edit offer"
                      >
                        <Edit size={18} />
                      </button>

                      {/* Pause / Resume */}
                      {/* {offer.status === "Active" && (
                        <button
                          className="text-orange-500 hover:text-orange-700"
                          aria-label="Pause offer"
                        >
                          <Pause size={18} />
                        </button>
                      )} */}

                      {offer.status === "Paused" && (
                        <button
                          className="text-green-600 hover:text-green-700"
                          aria-label="Resume offer"
                        >
                          <Play size={18} />
                        </button>
                      )}

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(offer._id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        aria-label="Delete offer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
