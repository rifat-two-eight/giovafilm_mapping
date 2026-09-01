"use client";

import { Trash2, Search, Map } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  useGetAllUsersQuery,
  useDeleteUserMutation,
  useUpdateUserRoleMutation,
  useGetProfileQuery,
  useAssignEditorAccessMutation,
} from "@/redux/features/user/userApi";
import { useGetMapsQuery } from "@/redux/features/map/mapApi";
import { useState } from "react";
import { appAlert } from "@/lib/app-alert";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  normalizeId,
  normalizeIdList,
  toggleMapAssignment,
  countriesFromSelectedMaps,
} from "@/lib/editor-access";
import {
  assignableRolesFor,
  canDeleteUser,
  canManageUserRole,
  type AppRole,
} from "@/lib/roles";

const ROLE_LABELS: Record<AppRole, string> = {
  user: "User",
  map_editor: "Map Editor",
  admin: "Admin",
  super_admin: "Super Admin",
};

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

  // Modal State for Map Editor access control
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"change_role" | "edit_access">("change_role");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [tempRole, setTempRole] = useState("");
  const [selectedMaps, setSelectedMaps] = useState<string[]>([]);

  // Search state for Modal
  const [modalMapSearch, setModalMapSearch] = useState("");

  const { data: currentUser } = useGetProfileQuery({});
  const { data: mapsRes } = useGetMapsQuery({ limit: 100 });
  const [assignEditorAccess] = useAssignEditorAccessMutation();

  const maps = mapsRes?.data || [];

  // Filtered list for Modal
  const filteredModalMaps = maps.filter((map: any) =>
    map.name?.toLowerCase().includes(modalMapSearch.toLowerCase()) ||
    (map.country && map.country.toLowerCase().includes(modalMapSearch.toLowerCase()))
  );

  const selectedCountries = countriesFromSelectedMaps(selectedMaps, maps);

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
  const [updateUserRole] = useUpdateUserRoleMutation();

  const users = response?.data || [];
  const meta = response?.meta || { page: 1, limit: 10, total: 0, totalPage: 1 };

  const handleDelete = async (userId: string) => {
    const result = await appAlert.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
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

  const allowedRoles = assignableRolesFor(currentUser?.role);

  const handleRoleChange = async (userId: string, newRole: string) => {
    const userToUpdate = users.find((u: any) => u._id === userId);

    if (!canManageUserRole(currentUser?.role, userToUpdate?.role)) {
      toast.error("You cannot change this user's role.");
      return;
    }
    if (!allowedRoles.includes(newRole as AppRole)) {
      toast.error("You are not allowed to assign this role.");
      return;
    }

    if (newRole === "map_editor") {
      setModalMode("change_role");
      setSelectedUser(userToUpdate);
      setTempRole(newRole);
      setSelectedMaps(normalizeIdList(userToUpdate?.assignedMaps));
      setIsAccessModalOpen(true);
      return;
    }

    const result = await appAlert.fire({
      title: "Are you sure?",
      text: `Are you sure you want to change this user's role to ${newRole}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, change it!",
    });

    if (result.isConfirmed) {
      try {
        await updateUserRole({ userId, role: newRole }).unwrap();
        toast.success("User role updated successfully!");
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to update user role");
      }
    }
  };

  const handleEditAccess = (user: any) => {
    setModalMode("edit_access");
    setSelectedUser(user);
    setTempRole(user.role);
    setSelectedMaps(normalizeIdList(user.assignedMaps));
    setIsAccessModalOpen(true);
  };

  const handleModalMapToggle = (map: any, checked: boolean) => {
    const next = toggleMapAssignment(
      map,
      checked,
      selectedMaps,
      selectedCountries,
      maps,
    );
    setSelectedMaps(next.maps);
  };

  const handleSaveAccess = async () => {
    if (!selectedUser) return;

    if (selectedMaps.length === 0) {
      toast.error("Assign at least one map for the Map Editor.");
      return;
    }

    try {
      if (modalMode === "change_role") {
        await updateUserRole({
          userId: selectedUser._id,
          role: tempRole,
          assignedMaps: selectedMaps,
          assignedCountries: selectedCountries,
        }).unwrap();
        toast.success("User role updated with assignments successfully!");
      } else {
        await assignEditorAccess({
          userId: selectedUser._id,
          assignedMaps: selectedMaps,
          assignedCountries: selectedCountries,
        }).unwrap();
        toast.success("Editor access updated successfully!");
      }
      setIsAccessModalOpen(false);
      setSelectedUser(null);
      setSelectedMaps([]);
      setModalMapSearch("");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save editor access");
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
              <SelectItem value="map_editor">Map Editor</SelectItem>
              <SelectItem value="super_admin">Super Admin</SelectItem>
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full md:w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="deleted">Deleted</SelectItem>
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
                      {currentUser?._id === user._id ||
                        !canManageUserRole(currentUser?.role, user.role) ? (
                        <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded border border-blue-200 inline-block text-[10px] font-bold uppercase tracking-wider">
                          {user.role}
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <Select
                            value={user.role}
                            onValueChange={(newRole) =>
                              handleRoleChange(user._id, newRole)
                            }
                          >
                            <SelectTrigger className="w-[140px] h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {allowedRoles.map((role) => (
                                <SelectItem key={role} value={role}>
                                  {ROLE_LABELS[role]}
                                </SelectItem>
                              ))}
                              {/* Keep current role visible even if actor can't re-assign it */}
                              {!allowedRoles.includes(user.role) && (
                                <SelectItem value={user.role}>
                                  {ROLE_LABELS[user.role as AppRole] || user.role}
                                </SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                          {user.role === "map_editor" && (
                            <div className="text-[10px] text-gray-500 flex flex-col gap-0.5 mt-1 font-semibold bg-gray-50 p-1.5 rounded border border-gray-150">
                              <span>Maps: {user.assignedMaps?.length || 0} assigned</span>
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold inline-block ${user.status === "active"
                            ? "bg-green-100 text-green-700"
                            : user.status === "inactive"
                              ? "bg-yellow-100 text-yellow-700"
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
                        {user.role === "map_editor" &&
                          canManageUserRole(currentUser?.role, user.role) && (
                            <button
                              onClick={() => handleEditAccess(user)}
                              className="text-blue-500 hover:text-blue-700 transition-colors p-2 hover:bg-blue-50 rounded"
                              title="Edit Map Editor Access"
                              aria-label="Edit editor access"
                            >
                              <Map size={18} />
                            </button>
                          )}
                        {canDeleteUser(currentUser?.role, user.role) &&
                          currentUser?._id !== user._id && (
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

        {/* Pagination */}
        {meta && meta.totalPage > 1 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-medium">{users.length > 0 ? (page - 1) * limit + 1 : 0}</span>–
              <span className="font-medium">
                {Math.min(page * limit, meta.total)}
              </span>{" "}
              of <span className="font-medium">{meta.total}</span> results
            </div>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1 border border-gray-300 rounded bg-white text-sm disabled:opacity-50"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: meta.totalPage }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 flex items-center justify-center rounded-md border transition-all font-medium ${page === p
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
                className="px-3 py-1 border border-gray-300 rounded bg-white text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* Editor Access Control Modal */}
      <Dialog open={isAccessModalOpen} onOpenChange={setIsAccessModalOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white border border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-gray-900 font-bold text-lg">
              {modalMode === "change_role" ? "Assign Map Editor Access" : "Edit Map Editor Access"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 my-2">
            <p className="text-sm text-gray-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
              Assign at least one <strong>map</strong>. Access is scoped to the
              selected maps only.
            </p>

            {/* Maps list */}
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-700">
                  Assign Maps ({selectedMaps.length} selected)
                </label>
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMaps(maps.map((m: any) => normalizeId(m._id)));
                    }}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Select All
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    type="button"
                    onClick={() => setSelectedMaps([])}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              <Input
                placeholder="Search maps..."
                value={modalMapSearch}
                onChange={(e) => setModalMapSearch(e.target.value)}
                className="h-9 text-xs"
              />

              <div className="border border-gray-200 rounded-lg p-2 max-h-56 overflow-y-auto space-y-1.5 bg-gray-50/50">
                {filteredModalMaps.length === 0 ? (
                  <p className="text-xs text-gray-500 py-4 text-center">No maps found.</p>
                ) : (
                  filteredModalMaps.map((map: any) => {
                    const mapId = normalizeId(map._id);
                    const isChecked = selectedMaps.includes(mapId);
                    return (
                      <label
                        key={mapId}
                        className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-medium cursor-pointer select-none transition-all ${isChecked
                            ? "bg-blue-50/80 text-blue-700 border border-blue-100"
                            : "text-gray-700 border border-transparent hover:bg-gray-100/70"
                          }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) =>
                            handleModalMapToggle(map, e.target.checked)
                          }
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                        />
                        <span className="truncate">{map.name} {map.country ? `(${map.country})` : ""}</span>
                      </label>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsAccessModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveAccess} className="bg-blue-600 hover:bg-blue-700 text-white font-medium">
              Save Access
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
