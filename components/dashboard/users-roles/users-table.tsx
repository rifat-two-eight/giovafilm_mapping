"use client";

import { Trash2, Search, Filter } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  useGetAllUsersQuery,
  useDeleteUserMutation,
} from "@/redux/features/user/userApi";
import { useState } from "react";
import Swal from "sweetalert2";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const userTableHeaders = [
  "Name",
  "Email",
  "Role",
  "Status",
  "Joined",
  "Actions",
];

export function UsersTable(): React.ReactElement {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [role, setRole] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const queryParams: any = {
    page,
    limit,
  };

  if (role !== "all") queryParams.role = role;
  if (status !== "all") queryParams.status = status;
  if (searchTerm) queryParams.searchTerm = searchTerm;

  const {
    data: response,
    isLoading,
    isError,
  } = useGetAllUsersQuery(queryParams);
  const [deleteUser] = useDeleteUserMutation();

  const users = response?.data || [];
  const meta = response?.meta;

  const handleDelete = async (userId: string) => {
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
        await deleteUser(userId).unwrap();
        toast.success("User deleted successfully!");
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to delete user");
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger className="w-full md:w-[140px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full md:w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="overflow-hidden border border-gray-200 py-0 shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {userTableHeaders.map((header) => (
                  <th
                    key={header}
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-900"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    Loading users...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-red-500"
                  >
                    Failed to load users.
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user: any) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      <div className="flex flex-col">
                        <span>{user.name || "Unknown User"}</span>
                        {/* {user.profile && <img src={user.profile} alt="" className="w-8 h-8 rounded-full" />} */}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded border border-blue-200 inline-block text-[10px] font-bold uppercase tracking-wider">
                        {user.role}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold inline-block ${
                          user.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.status}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-3">
                        {user.role !== "admin" &&
                          user.role !== "super_admin" && (
                            <button
                              onClick={() => handleDelete(user._id)}
                              className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded"
                              aria-label="Delete user"
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

        {/* Pagination placeholder */}
        {meta && meta.totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-medium">{(page - 1) * limit + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(page * limit, meta.total)}
              </span>{" "}
              of <span className="font-medium">{meta.total}</span> results
            </div>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1 border border-gray-300 rounded bg-white text-sm disabled:opacity-50"
              >
                Previous
              </button>
              <button
                disabled={page === meta.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 border border-gray-300 rounded bg-white text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
