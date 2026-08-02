"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useGetProfileQuery,
  useInviteUserMutation,
} from "@/redux/features/user/userApi";
import {
  useGetMapsQuery,
  useGetAvailableCountriesQuery,
} from "@/redux/features/map/mapApi";
import {
  normalizeId,
  toggleMapAssignment,
} from "@/lib/editor-access";
import { assignableRolesFor, type AppRole } from "@/lib/roles";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const ROLE_LABELS: Record<AppRole, string> = {
  user: "User",
  map_editor: "Map Editor",
  admin: "Admin",
  super_admin: "Super Admin",
};

interface FormData {
  email: string;
  role: string;
}

export function InviteUserForm(): React.ReactElement {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    role: "user",
  });
  const [selectedMaps, setSelectedMaps] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [mapSearch, setMapSearch] = useState("");
  const [countrySearch, setCountrySearch] = useState("");

  const [inviteUser, { isLoading }] = useInviteUserMutation();
  const { data: currentUser } = useGetProfileQuery({});
  const { data: mapsRes, isLoading: isLoadingMaps } = useGetMapsQuery({
    limit: 100,
  });
  const { data: countriesRes, isLoading: isLoadingCountries } =
    useGetAvailableCountriesQuery();

  const maps = mapsRes?.data || [];
  const countries: string[] = Array.isArray(countriesRes) ? countriesRes : [];
  const allowedRoles = assignableRolesFor(currentUser?.role);

  const filteredMaps = maps.filter(
    (map: any) =>
      map.name?.toLowerCase().includes(mapSearch.toLowerCase()) ||
      (map.country &&
        map.country.toLowerCase().includes(mapSearch.toLowerCase())),
  );

  const filteredCountries = countries.filter((country: string) =>
    country.toLowerCase().includes(countrySearch.toLowerCase()),
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear editor assignments when leaving map_editor role
    if (name === "role" && value !== "map_editor") {
      setSelectedMaps([]);
      setSelectedCountries([]);
      setMapSearch("");
      setCountrySearch("");
    }
  };

  const handleMapToggle = (map: any, checked: boolean) => {
    const next = toggleMapAssignment(
      map,
      checked,
      selectedMaps,
      selectedCountries,
      maps,
    );
    setSelectedMaps(next.maps);
    setSelectedCountries(next.countries);
  };

  const handleCountryToggle = (country: string, checked: boolean) => {
    setSelectedCountries((prev) =>
      checked ? [...prev, country] : prev.filter((c) => c !== country),
    );
  };

  const resetForm = () => {
    setFormData({ email: "", role: "user" });
    setSelectedMaps([]);
    setSelectedCountries([]);
    setMapSearch("");
    setCountrySearch("");
  };

  const handleSubmit = async () => {
    const email = formData.email.trim().toLowerCase();
    if (!email) {
      toast.error("Please enter an email address.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!formData.role) {
      toast.error("Please select a role.");
      return;
    }
    if (!allowedRoles.includes(formData.role as AppRole)) {
      toast.error("You are not allowed to invite this role.");
      return;
    }

    if (formData.role === "map_editor") {
      if (selectedMaps.length === 0 && selectedCountries.length === 0) {
        toast.error(
          "Assign at least one map or country for the Map Editor.",
        );
        return;
      }
    }

    const payload: {
      email: string;
      role: string;
      assignedMaps?: string[];
      assignedCountries?: string[];
    } = {
      email,
      role: formData.role,
    };

    if (formData.role === "map_editor") {
      payload.assignedMaps = selectedMaps;
      payload.assignedCountries = selectedCountries;
    }

    try {
      await inviteUser(payload).unwrap();
      toast.success("Invitation sent successfully!", {
        description: "They will receive an email with a code to set their password.",
      });
      resetForm();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to send invitation");
    }
  };

  const isEditor = formData.role === "map_editor";
  const listsLoading = isLoadingMaps || isLoadingCountries;

  return (
    <Card className="p-6 bg-white border border-gray-200">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Invite New User</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address <span className="text-red-500">*</span>
          </label>
          <Input
            type="email"
            name="email"
            placeholder="user@example.com"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Role <span className="text-red-500">*</span>
          </label>
          <select
            name="role"
            value={
              allowedRoles.includes(formData.role as AppRole)
                ? formData.role
                : allowedRoles[0] || "user"
            }
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white"
            disabled={isLoading || allowedRoles.length === 0}
          >
            {allowedRoles.map((role) => (
              <option key={role} value={role}>
                {ROLE_LABELS[role]}
              </option>
            ))}
          </select>
        </div>

        {isEditor && (
          <div className="col-span-1 md:col-span-2 space-y-3">
            <p className="text-sm text-gray-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
              Selecting a <strong>map</strong> also assigns its country.
              Countries grant edit access to every map in that country.
              Assign at least one map or country.
            </p>

            {listsLoading ? (
              <div className="flex items-center justify-center gap-2 py-10 text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading maps and countries...
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Assigned Maps */}
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-gray-700">
                      Assign Maps ({selectedMaps.length} selected)
                    </label>
                    <div className="flex items-center gap-2 text-xs font-semibold">
                      <button
                        type="button"
                        onClick={() => {
                          const allIds = maps.map((m: any) => normalizeId(m._id));
                          const allCountries = Array.from(
                            new Set(
                              maps
                                .map((m: any) => m.country)
                                .filter(Boolean) as string[],
                            ),
                          );
                          setSelectedMaps(allIds);
                          setSelectedCountries((prev) =>
                            Array.from(new Set([...prev, ...allCountries])),
                          );
                        }}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        Select All
                      </button>
                      <span className="text-gray-300">|</span>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedMaps([]);
                          setSelectedCountries([]);
                        }}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>

                  <Input
                    placeholder="Search maps..."
                    value={mapSearch}
                    onChange={(e) => setMapSearch(e.target.value)}
                    className="h-9 text-xs"
                  />

                  <div className="border border-gray-200 rounded-lg p-2 max-h-48 overflow-y-auto space-y-1.5 bg-gray-50/50">
                    {filteredMaps.length === 0 ? (
                      <p className="text-xs text-gray-500 py-4 text-center">
                        No maps found.
                      </p>
                    ) : (
                      filteredMaps.map((map: any) => {
                        const mapId = normalizeId(map._id);
                        const isChecked = selectedMaps.includes(mapId);
                        return (
                          <label
                            key={mapId}
                            className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-medium cursor-pointer select-none transition-all ${
                              isChecked
                                ? "bg-blue-50/80 text-blue-700 border border-blue-100"
                                : "text-gray-700 border border-transparent hover:bg-gray-100/70"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) =>
                                handleMapToggle(map, e.target.checked)
                              }
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                            />
                            <span className="truncate">
                              {map.name}{" "}
                              {map.country ? `(${map.country})` : ""}
                            </span>
                          </label>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Assigned Countries */}
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-gray-700">
                      Assign Countries ({selectedCountries.length} selected)
                    </label>
                    <div className="flex items-center gap-2 text-xs font-semibold">
                      <button
                        type="button"
                        onClick={() => setSelectedCountries(countries)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        Select All
                      </button>
                      <span className="text-gray-300">|</span>
                      <button
                        type="button"
                        onClick={() => setSelectedCountries([])}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>

                  <Input
                    placeholder="Search countries..."
                    value={countrySearch}
                    onChange={(e) => setCountrySearch(e.target.value)}
                    className="h-9 text-xs"
                  />

                  <div className="border border-gray-200 rounded-lg p-2 max-h-48 overflow-y-auto space-y-1.5 bg-gray-50/50">
                    {filteredCountries.length === 0 ? (
                      <p className="text-xs text-gray-500 py-4 text-center">
                        No countries found.
                      </p>
                    ) : (
                      filteredCountries.map((country: string) => {
                        const isChecked = selectedCountries.includes(country);
                        return (
                          <label
                            key={country}
                            className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-medium cursor-pointer select-none transition-all ${
                              isChecked
                                ? "bg-blue-50/80 text-blue-700 border border-blue-100"
                                : "text-gray-700 border border-transparent hover:bg-gray-100/70"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) =>
                                handleCountryToggle(country, e.target.checked)
                              }
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                            />
                            <span className="truncate">{country}</span>
                          </label>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3">
        <Button
          onClick={resetForm}
          variant="outline"
          className="px-6"
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          className="bg-primary hover:bg-primary/95 text-black px-6 min-w-[140px]"
          disabled={isLoading || (isEditor && listsLoading)}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send Invitation"
          )}
        </Button>
      </div>
    </Card>
  );
}
