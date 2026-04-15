"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, MoreHorizontal, RotateCcw, Loader2 } from "lucide-react";
import {
  useGetBusinessesQuery,
  useUpdateBusinessStatusMutation,
  useDeleteBusinessMutation,
} from "@/redux/features/business/businessApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import Swal from "sweetalert2";

const businessTableHeaders = [
  "",
  "Business Details",
  "Category",
  "Location",
  "Status",
  "Submitted",
  "Actions",
];

export function BusinessTable() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);

  // Params State
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateBusinessStatusMutation();
  const [deleteBusiness] = useDeleteBusinessMutation();

  // Simple debounce for search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset page on search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const {
    data: response,
    isLoading,
    isFetching,
  } = useGetBusinessesQuery({
    page,
    limit,
    searchTerm: debouncedSearch,
    status: status === "all" ? "" : status,
  });

  const businesses = response?.data || [];
  const meta = response?.meta || { page: 1, limit: 10, total: 0, totalPage: 1 };

  console.log(businesses);

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleBulkStatusUpdate = async (newStatus: string) => {
    if (selected.length === 0) return;

    const promise = Promise.all(
      selected.map((id) => updateStatus({ id, status: newStatus }).unwrap()),
    );

    toast.promise(promise, {
      loading: `Updating ${selected.length} businesses...`,
      success: `Successfully updated to ${newStatus}`,
      error: "Failed to update some businesses.",
    });

    try {
      await promise;
      setSelected([]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await updateStatus({ id, status: newStatus }).unwrap();
      toast.success(`Business ${newStatus} successfully!`);
    } catch (err) {
      toast.error("Failed to update business status.");
      console.error(err);
    }
  };

  const handleDeleteSingle = async (id: string) => {
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
        await deleteBusiness(id).unwrap();
        toast.success("Business deleted successfully!");
      } catch (err: any) {
        toast.error(err?.data?.message || "Failed to delete business");
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg mt-6 overflow-hidden">
      {/* FILTER BAR */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
          <div className="relative w-full lg:w-96">
            <Search size={16} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search business name, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border rounded-md pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <Select
              value={status}
              onValueChange={(val) => {
                setStatus(val);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            {(searchTerm || status !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatus("all");
                  setPage(1);
                }}
                className="text-blue-600 text-sm font-semibold hover:underline"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* BULK ACTION BAR */}
      {selected.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200 animate-in slide-in-from-top-2">
          <p className="text-sm font-medium text-gray-700">
            {selected.length} businesses selected
          </p>
          <div className="flex gap-2">
            <button
              disabled={isUpdating}
              onClick={() => handleBulkStatusUpdate("Approved")}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded text-sm transition-colors disabled:opacity-50"
            >
              Approve
            </button>
            <button
              disabled={isUpdating}
              onClick={() => handleBulkStatusUpdate("Rejected")}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded text-sm transition-colors disabled:opacity-50"
            >
              Reject
            </button>
          </div>
          <button
            onClick={() => setSelected([])}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      )}

      {/* TABLE */}
      <div className="overflow-x-auto relative">
        {(isLoading || isFetching) && (
          <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center backdrop-blur-[1px]">
            <Loader2 size={32} className="text-blue-600 animate-spin" />
          </div>
        )}
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
              {businessTableHeaders.map((header, index) => (
                <th
                  key={index}
                  className={`px-6 py-4 font-semibold ${header ? "text-left" : ""}`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {businesses.length > 0
              ? businesses.map((business: any) => (
                  <tr
                    key={business._id}
                    onClick={() =>
                      router.push(`/dashboard/business/${business._id}`)
                    }
                    className="hover:bg-blue-50/30 cursor-pointer transition-colors group"
                  >
                    <td
                      className="px-6 py-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={selected.includes(business._id)}
                        onChange={() => toggleSelect(business._id)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                        {business.name}
                      </p>
                      <p className="text-sm text-gray-500 line-clamp-1 max-w-[200px]">
                        {business.description}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-xs font-medium lowercase">
                        {business.category?.name || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <p className="truncate max-w-[150px]">
                        {business.location?.address}
                      </p>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">
                        {business.location?.city}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 text-[10px] font-black uppercase rounded-full tracking-wider ${getStatusColor(
                          business.status,
                        )}`}
                      >
                        {business.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                      {business.createdAt
                        ? formatDate(business.createdAt)
                        : "N/A"}
                    </td>
                    <td
                      className="px-6 py-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="text-gray-400 hover:text-gray-900 hover:bg-gray-100 p-1.5 rounded-lg transition-all">
                            <MoreHorizontal size={18} />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusUpdate(business._id, "Approved")
                            }
                            className="text-green-600 font-medium"
                          >
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusUpdate(business._id, "Rejected")
                            }
                            className="text-red-600 font-medium"
                          >
                            Reject
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem
                            onClick={() => handleDeleteSingle(business._id)}
                            className="text-red-600 font-bold focus:bg-red-50"
                          >
                            Delete Business
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              : !isLoading && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2 text-gray-400">
                        <Search size={40} className="text-gray-200" />
                        <p className="font-medium text-gray-500">
                          No businesses found
                        </p>
                        <p className="text-xs">
                          Try adjusting your search or filters.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4 text-sm text-gray-500 border-t border-gray-200 bg-gray-50/50">
        <p>
          Showing {businesses.length > 0 ? (page - 1) * limit + 1 : 0}–
          {Math.min(page * limit, meta.total)} of {meta.total} results
        </p>
        <div className="flex items-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-1.5 border rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
          >
            Prev
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: meta.totalPage }, (_, i) => i + 1).map(
              (p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 flex items-center justify-center rounded-md border transition-all font-medium ${
                    page === p
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  {p}
                </button>
              ),
            )}
          </div>
          <button
            disabled={page === meta.totalPage}
            onClick={() => setPage(page + 1)}
            className="px-4 py-1.5 border rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
