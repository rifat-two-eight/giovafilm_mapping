"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useDeletePlaceMutation,
  useGetPlacesQuery,
} from "@/redux/features/place/placeApi";
import { Edit, Eye, MessageSquare, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { ReviewModal } from "../../Common/maps/review-modal";
import { UpdatePlaceModal } from "./UpdatePlaceModal";
import { ViewPlaceModal } from "./view-place-modal";
import { useGetProfileQuery } from "@/redux/features/user/userApi";

interface Place {
  _id: string;
  name: string;
  category: {
    name: string;
  } | null;
  map: {
    _id: string;
    name: string;
  } | null;
  status: string;
  rating: number;
  totalReview: number;
  address: string;
}

export function PlacesTable() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("");

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);

  const { data: user } = useGetProfileQuery({});

  const { data: response, isLoading } = useGetPlacesQuery({
    page,
    limit,
    searchTerm,
    status,
  });
  const [deletePlace] = useDeletePlaceMutation();

  const places: Place[] = response?.data || [];
  const meta = response?.meta;

  const handleDelete = async (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this place deletion!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deletePlace(id).unwrap();
          toast.success("Place deleted successfully");
        } catch (error: any) {
          toast.error(
            error?.data?.message || error?.message || "Failed to delete place",
          );
          console.error("Failed to delete place:", error);
        }
      }
    });
  };

  const getStatusColor = (status: string) => {
    return status === "Active" || status === "Published"
      ? "bg-green-100 text-green-800"
      : "bg-gray-100 text-gray-800";
  };

  const tableHeaders = [
    "Place Name",
    "Category",
    "Map",
    "Status",
    "Rating",
    "Actions",
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4 bg-white">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search places..."
            className="pl-9 h-9"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Filter by Status:</span>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="border border-gray-300 rounded-md h-9 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
            <option value="Active">Active</option>
            <option value="Hidden">Hidden</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              {tableHeaders.map((header) => (
                <th
                  key={header}
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-900"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  Loading places...
                </td>
              </tr>
            ) : places.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No places found.
                </td>
              </tr>
            ) : (
              places.map((place, index) => (
                <tr
                  key={place._id}
                  className={`${
                    index !== places.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  } hover:bg-gray-50 transition-colors`}
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    <div className="flex flex-col">
                      <span>{place.name}</span>
                      <span className="text-xs text-gray-400 truncate max-w-[200px]">
                        {place.address}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {place.category?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {place.map?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        place.status,
                      )}`}
                    >
                      {place.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <span>⭐ {place.rating || 0}</span>
                      <span className="text-gray-400">
                        ({place.totalReview || 0})
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          setSelectedPlaceId(place._id);
                          setIsUpdateModalOpen(true);
                        }}
                        className="text-blue-500 hover:text-blue-700 transition-colors"
                        aria-label="Edit place"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedPlaceId(place._id);
                          setIsViewModalOpen(true);
                        }}
                        className="text-green-500 hover:text-green-700 transition-colors"
                        aria-label="View place"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedPlaceId(place._id);
                          setIsReviewModalOpen(true);
                        }}
                        className="text-yellow-500 hover:text-yellow-700 transition-colors flex items-center gap-2 border rounded-full px-2"
                        aria-label="Add review"
                      >
                        Review
                        <MessageSquare size={18} />
                      </button>

                      {user?.role !== "map_editor" && (
                        <button
                          onClick={() => handleDelete(place._id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          aria-label="Delete place"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
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

      <ViewPlaceModal
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        placeId={selectedPlaceId}
      />

      <UpdatePlaceModal
        open={isUpdateModalOpen}
        onOpenChange={setIsUpdateModalOpen}
        placeId={selectedPlaceId}
      />

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        placeId={selectedPlaceId || undefined}
      />
    </div>
  );
}
