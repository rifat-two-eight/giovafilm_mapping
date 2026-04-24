"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useDeleteMapMutation,
  useGetMapsQuery,
} from "@/redux/features/map/mapApi";
import { Copy, Edit, Eye, EyeOff, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Swal from "sweetalert2";

interface Map {
  _id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  status: "Published" | "Draft" | string;
  places: string[];
  updatedAt: string;
}

export function MapsTable({ onEditMap }: { onEditMap?: (map: Map) => void }) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: response, isLoading } = useGetMapsQuery({
    page,
    limit,
    searchTerm,
  });
  const [deleteMap] = useDeleteMapMutation();

  const mapsData: Map[] = response?.data || [];
  const meta = response?.meta;

  const handleDelete = async (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this map deletion!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteMap(id).unwrap();
          toast.success("Map deleted successfully");
        } catch (error: any) {
          toast.error(
            error?.data?.message || error?.message || "Failed to delete map",
          );
          console.error("Failed to delete map:", error);
        }
      }
    });
  };

  const getStatusColor = (status: string) => {
    return status === "Published" || status === "Active"
      ? "bg-green-100 text-green-800"
      : "bg-gray-100 text-gray-800";
  };

  const tableHeaders = [
    "Map Name",
    "Description",
    "Status",
    "Price",
    "Last Updated",
    "Actions",
  ];

  return (
    <div className="bg-white rounded-lg border overflow-hidden border-gray-200 flex flex-col">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search maps..."
            className="pl-9 h-9"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1); // reset pagination on search
            }}
          />
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
                  Loading maps...
                </td>
              </tr>
            ) : mapsData.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No maps found.
                </td>
              </tr>
            ) : (
              mapsData.map((map, index) => (
                <tr
                  key={map._id}
                  className={`${
                    index !== mapsData.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  } hover:bg-gray-50 transition-colors`}
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {map.name}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-xs">
                    {map.description || "-"}
                  </td>

                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        map.status,
                      )}`}
                    >
                      {map.status || "Draft"}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    ${map.price}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(map.updatedAt).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onEditMap && onEditMap(map)}
                        className="text-blue-500 hover:text-blue-700 transition-colors"
                        aria-label="Edit map"
                      >
                        <Edit size={18} />
                      </button>

                      {/* <button
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                        aria-label="Duplicate map"
                      >
                        <Copy size={18} />
                      </button> */}

                      {/* <button
                        className="text-orange-500 hover:text-orange-700 transition-colors"
                        aria-label={
                          map.status === "Published" ? "Hide map" : "Show map"
                        }
                      >
                        {map.status === "Published" ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button> */}

                      <button
                        onClick={() => handleDelete(map._id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        aria-label="Delete map"
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
