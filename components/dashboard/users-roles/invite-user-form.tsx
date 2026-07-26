"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useInviteUserMutation } from "@/redux/features/user/userApi";
import { useGetMapsQuery, useGetAvailableCountriesQuery } from "@/redux/features/map/mapApi";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

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
  
  // Search states for improved UX
  const [mapSearch, setMapSearch] = useState("");
  const [countrySearch, setCountrySearch] = useState("");

  const [inviteUser, { isLoading }] = useInviteUserMutation();
  const { data: mapsRes } = useGetMapsQuery({ limit: 100 });
  const { data: countriesRes } = useGetAvailableCountriesQuery();

  const maps = mapsRes?.data || [];
  const countries = countriesRes || [];

  // Filtered lists based on search
  const filteredMaps = maps.filter((map: any) =>
    map.name?.toLowerCase().includes(mapSearch.toLowerCase()) ||
    (map.country && map.country.toLowerCase().includes(mapSearch.toLowerCase()))
  );

  const filteredCountries = countries.filter((country: string) =>
    country.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.email || !formData.role) {
      toast.error("Please provide both email and role.");
      return;
    }

    const payload: any = {
      email: formData.email,
      role: formData.role,
    };

    if (formData.role === "map_editor") {
      payload.assignedMaps = selectedMaps;
      payload.assignedCountries = selectedCountries;
    }

    try {
      await inviteUser(payload).unwrap();
      toast.success("Invitation sent successfully!");
      setFormData({ email: "", role: "user" });
      setSelectedMaps([]);
      setSelectedCountries([]);
      setMapSearch("");
      setCountrySearch("");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to send invitation");
    }
  };

  const handleCancel = () => {
    setFormData({ email: "", role: "user" });
    setSelectedMaps([]);
    setSelectedCountries([]);
    setMapSearch("");
    setCountrySearch("");
  };

  return (
    <Card className="p-6 bg-white border border-gray-200">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Invite New User</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Email Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
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

        {/* Role Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Role
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white"
            disabled={isLoading}
          >
            <option value="user">User</option>
            <option value="map_editor">Map Editor</option>
            <option value="admin">Admin</option>
            <option value="super_admin">Super Admin</option>
          </select>
        </div>

        {/* Conditional Map Editor Fields */}
        {formData.role === "map_editor" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 col-span-1 md:col-span-2">
            {/* Assigned Maps */}
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-700">
                  Assign Maps ({selectedMaps.length} selected)
                </label>
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setSelectedMaps(maps.map((m: any) => m._id))}
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

              {/* Map Search Input */}
              <Input
                placeholder="Search maps..."
                value={mapSearch}
                onChange={(e) => setMapSearch(e.target.value)}
                className="h-9 text-xs"
              />

              <div className="border border-gray-200 rounded-lg p-2 max-h-48 overflow-y-auto space-y-1.5 bg-gray-50/50">
                {filteredMaps.length === 0 ? (
                  <p className="text-xs text-gray-500 py-4 text-center">No maps found.</p>
                ) : (
                  filteredMaps.map((map: any) => {
                    const isChecked = selectedMaps.includes(map._id);
                    return (
                      <label
                        key={map._id}
                        className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-medium cursor-pointer select-none transition-all ${
                          isChecked 
                            ? "bg-blue-50/80 text-blue-700 border border-blue-100" 
                            : "text-gray-700 border border-transparent hover:bg-gray-100/70"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedMaps((prev) => [...prev, map._id]);
                            } else {
                              setSelectedMaps((prev) => prev.filter((id) => id !== map._id));
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                        />
                        <span className="truncate">{map.name} {map.country ? `(${map.country})` : ""}</span>
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

              {/* Country Search Input */}
              <Input
                placeholder="Search countries..."
                value={countrySearch}
                onChange={(e) => setCountrySearch(e.target.value)}
                className="h-9 text-xs"
              />

              <div className="border border-gray-200 rounded-lg p-2 max-h-48 overflow-y-auto space-y-1.5 bg-gray-50/50">
                {filteredCountries.length === 0 ? (
                  <p className="text-xs text-gray-500 py-4 text-center">No countries found.</p>
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
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCountries((prev) => [...prev, country]);
                            } else {
                              setSelectedCountries((prev) => prev.filter((c) => c !== country));
                            }
                          }}
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

      {/* Buttons */}
      <div className="flex justify-end gap-3">
        <Button
          onClick={handleCancel}
          variant="outline"
          className="px-6"
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          className="bg-primary hover:bg-primary/95 text-black px-6 min-w-[140px]"
          disabled={isLoading}
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
