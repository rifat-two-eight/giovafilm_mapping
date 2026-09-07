"use client";

import { useState } from "react";
import {
  useDeleteOfferMutation,
  useGetOffersQuery,
} from "@/redux/features/offer/offerApi";
import { useGetProfileQuery } from "@/redux/features/user/userApi";
import {
  useGetAvailableCountriesQuery,
  useGetMapsQuery,
} from "@/redux/features/map/mapApi";
import {
  editorCanAccessBusiness,
  editorCanAccessMap,
} from "@/lib/editor-access";
import { formatOfferDiscountLabel } from "@/lib/offer-label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Play, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { appAlert } from "@/lib/app-alert";

export function OffersTable({ onEdit }: { onEdit?: (offer: any) => void }) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [country, setCountry] = useState("");
  const [status, setStatus] = useState("");

  const { data: user } = useGetProfileQuery({});
  const { data: mapsRes } = useGetMapsQuery({ limit: 100 });
  const { data: countries } = useGetAvailableCountriesQuery(undefined);
  const { data: offersRes, isLoading } = useGetOffersQuery({
    page,
    limit,
    searchTerm,
    country,
    status,
  });
  const [deleteOffer] = useDeleteOfferMutation();

  const offersData = offersRes?.data || [];
  const meta = offersRes?.meta;
  const allMaps = mapsRes?.data || [];
  
  const displayedOffers =
    user?.role === "map_editor"
      ? offersData.filter((offer: any) => {
          if (offer.place) {
            const place = offer.place;
            return editorCanAccessMap(
              user,
              place?.map?._id || place?.map,
              place?.country || place?.map?.country,
            );
          }
          const business = offer.business;
          return editorCanAccessBusiness(
            user,
            business?.location?.country || business?.country,
            allMaps,
          );
        })
      : offersData;

  const handleDelete = (id: string, title?: string) => {
    appAlert.fire({
      title: "Delete this offer?",
      text: title
        ? `Delete “${title}”? You won't be able to revert this.`
        : "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteOffer(id).unwrap();
          appAlert.fire({
            title: "Deleted!",
            text: "The offer has been deleted.",
            icon: "success",
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
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4 bg-white">
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search offers, places, municipalities..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="pl-10 h-10 w-full"
            />
          </div>

          <select
            value={country}
            onChange={(e) => {
              setCountry(e.target.value);
              setPage(1);
            }}
            className="h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm bg-white min-w-[150px]"
          >
            <option value="">All Countries</option>
            {countries?.map((c: string) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm bg-white min-w-[140px]"
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Paused">Paused</option>
            <option value="Expired">Expired</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Header */}
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Offer Title
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Place / Business
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
            ) : displayedOffers.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-10 text-center text-gray-500"
                >
                  No offers found.
                </td>
              </tr>
            ) : (
              displayedOffers.map((offer: any, index: number) => {
                const locationSubtitle =
                  offer.place?.address ||
                  offer.business?.location?.address ||
                  offer.place?.country ||
                  offer.business?.location?.country ||
                  "";

                return (
                  <tr
                    key={offer._id}
                    className={`${
                      index !== displayedOffers.length - 1
                        ? "border-b border-gray-100"
                        : ""
                    } hover:bg-gray-50 transition-colors`}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {offer.title}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">
                          {offer.business?.name || offer.place?.name || "N/A"}
                        </span>
                        {locationSubtitle && (
                          <span
                            className="text-xs text-gray-400 truncate max-w-[220px]"
                            title={locationSubtitle}
                          >
                            {locationSubtitle}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatOfferDiscountLabel(offer)}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {offer.validUntil
                        ? new Date(offer.validUntil).toLocaleDateString()
                        : "No Expiration"}
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

                        {offer.status === "Paused" && (
                          <button
                            className="text-green-600 hover:text-green-700"
                            aria-label="Resume offer"
                          >
                            <Play size={18} />
                          </button>
                        )}

                        {/* Delete */}
                        {user?.role !== "map_editor" && (
                          <button
                            onClick={() => handleDelete(offer._id, offer.title)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                            aria-label="Delete offer"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!isLoading && meta && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-white mt-auto">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Rows per page:</span>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="border border-gray-300 rounded p-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 border-none">
              Page {meta.page} of {meta.totalPage || 1}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= (meta.totalPage || 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
