"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useDeletePlaceMutation,
  useGetPlacesQuery,
} from "@/redux/features/place/placeApi";
import { Edit, Eye, MessageSquare, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { appAlert } from "@/lib/app-alert";
import { ReviewModal } from "../../Common/maps/review-modal";
import { UpdatePlaceModal } from "./UpdatePlaceModal";
import { ViewPlaceModal } from "./view-place-modal";
import { useGetProfileQuery } from "@/redux/features/user/userApi";
import { editorCanAccessMap } from "@/lib/editor-access";
import { useGetCategoriesQuery } from "@/redux/features/category/categoryApi";
import { useGetAvailableCountriesQuery } from "@/redux/features/map/mapApi";

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
  const { t } = useLanguage();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");
  const [type, setType] = useState("");

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);

  const { data: user } = useGetProfileQuery({});
  const { data: categoriesResponse } = useGetCategoriesQuery({ limit: 100 });
  const { data: countries } = useGetAvailableCountriesQuery(undefined);

  const { data: response, isLoading } = useGetPlacesQuery({
    page,
    limit,
    searchTerm,
    status,
    category,
    country,
    type,
  });
  const [deletePlace] = useDeletePlaceMutation();

  const places: Place[] = response?.data || [];
  const meta = response?.meta;

  const displayedPlaces =
    user?.role === "map_editor"
      ? places.filter((place: any) =>
          editorCanAccessMap(
            user,
            place.map?._id || place.map,
            place.country || place.map?.country,
          ),
        )
      : places;

  const handleDelete = async (id: string) => {
    appAlert.fire({
      title: t("common.are_you_sure"),
      text: t("places_admin.delete_confirm") || "You won't be able to revert this place deletion!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: t("common.yes_delete_it") || "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deletePlace(id).unwrap();
          toast.success(t("places_admin.deleted_successfully") || "Place deleted successfully");
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
    t("places_admin.place_name"),
    t("common.categories"),
    t("nav.map"),
    t("promos_admin.status"),
    t("place.reviews"),
    t("rewards_admin.actions"),
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4 bg-white">
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder={t("search.search_places")}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="pl-10 h-10 w-full"
            />
          </div>

          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm bg-white min-w-[140px]"
          >
            <option value="">{t("places_admin.all_status")}</option>
            <option value="Published">{t("places_admin.published")}</option>
            <option value="Draft">{t("places_admin.draft")}</option>
          </select>

          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm bg-white min-w-[140px]"
          >
            <option value="">{t("places_admin.all_categories")}</option>
            {categoriesResponse?.data?.map((cat: any) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            value={country}
            onChange={(e) => {
              setCountry(e.target.value);
              setPage(1);
            }}
            className="h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm bg-white min-w-[140px]"
          >
            <option value="">{t("places_admin.all_countries")}</option>
            {countries?.map((c: string) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setPage(1);
            }}
            className="h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm bg-white min-w-[140px]"
          >
            <option value="">{t("places_admin.all_types")}</option>
            <option value="Regular">{t("places_admin.regular_admin")}</option>
            <option value="Business">{t("places_admin.business_user")}</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {tableHeaders.map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  {t("places_admin.loading_places")}
                </td>
              </tr>
            ) : displayedPlaces.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  {t("places_admin.no_places")}
                </td>
              </tr>
            ) : (
              displayedPlaces.map((place, index) => (
                <tr
                  key={place._id}
                  className={`${index !== displayedPlaces.length - 1
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
                        aria-label={t("place.reviews")}
                      >
                        {t("place.reviews")}
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
            <span className="text-sm text-gray-600">{t("dashboard.table.rows_per_page")}</span>
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
              {t("common.page")} {meta.page} / {meta.totalPage || 1}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                {t("common.previous")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= (meta.totalPage || 1)}
              >
                {t("common.next")}
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
