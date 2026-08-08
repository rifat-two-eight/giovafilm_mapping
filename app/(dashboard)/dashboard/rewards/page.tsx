"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGetMapsQuery } from "@/redux/features/map/mapApi";
import {
  useGetAwardConfigsQuery,
  useUpdateAwardConfigMutation,
  useCreateAwardConfigMutation,
  useDeleteAwardConfigMutation,
} from "@/redux/features/award/awardApi";
import { getImageUrl } from "@/lib/utils";
import { Edit, Image as ImageIcon, Plus, Upload, X, MapPin, FileText, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import Swal from "sweetalert2";

export default function RewardsAdminPage() {
  const { data: configsRes, isLoading: isLoadingConfigs } = useGetAwardConfigsQuery();
  const { data: mapsRes } = useGetMapsQuery({ limit: 100 });
  const [updateAwardConfig, { isLoading: isUpdating }] = useUpdateAwardConfigMutation();
  const [createAwardConfig, { isLoading: isCreating }] = useCreateAwardConfigMutation();
  const [deleteAwardConfig] = useDeleteAwardConfigMutation();

  const configs = configsRes?.data || [];
  const maps = mapsRes?.data || [];

  const [open, setOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState<any>(null);
  const [isCreateMode, setIsCreateMode] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [target, setTarget] = useState("");
  const [mapId, setMapId] = useState("");
  const [type, setType] = useState("PDF Itinerary");

  // File upload states
  const coverInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const handleOpenCreate = () => {
    setSelectedReward(null);
    setTitle("");
    setDescription("");
    setTarget("0");
    setMapId("");
    setType("PDF Itinerary");
    setCoverPreview(null);
    setCoverFile(null);
    setPdfFile(null);
    setIsCreateMode(true);
    setOpen(true);
  };

  const handleOpenEdit = (reward: any) => {
    setSelectedReward(reward);
    setTitle(reward.title || "");
    setDescription(reward.description || "");
    setTarget(reward.target?.toString() || "0");
    setMapId(reward.mapId?._id || reward.mapId || "");
    setType(reward.type || "PDF Itinerary");
    setCoverPreview(getImageUrl(reward.coverPhoto));
    setCoverFile(null);
    setPdfFile(null);
    setIsCreateMode(false);
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this reward deletion!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteAwardConfig(id).unwrap();
          toast.success("Reward deleted successfully");
        } catch (error: any) {
          toast.error(
            error?.data?.message || error?.message || "Failed to delete reward",
          );
          console.error("Failed to delete reward:", error);
        }
      }
    });
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPdfFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const rewardData = {
        type,
        title,
        description,
        target: Number(target) || 0,
        mapId: mapId || null,
      };

      const formData = new FormData();
      formData.append("data", JSON.stringify(rewardData));

      if (coverFile) {
        formData.append("icon", coverFile);
      }
      if (pdfFile) {
        formData.append("documents", pdfFile);
      }

      if (isCreateMode) {
        await createAwardConfig(formData).unwrap();
        toast.success("Reward configuration created successfully!");
      } else {
        if (!selectedReward) return;
        await updateAwardConfig({ id: selectedReward._id, data: formData }).unwrap();
        toast.success("Reward configuration updated successfully!");
      }
      setOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save reward configuration");
      console.error(error);
    }
  };
  return (
    <div className="bg-gray-100 min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Rewards Management</h1>
          <p className="text-xs text-gray-500">Configure cover photos, files, points, and descriptions for user rewards.</p>
        </div>
        <Button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg px-4 py-2"
        >
          <Plus size={16} />
          Add Reward
        </Button>
      </div>

      {/* Grid List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-xs uppercase font-bold text-gray-500 tracking-wider">
                <th className="px-6 py-4 text-left">Cover</th>
                <th className="px-6 py-4 text-left">Reward Name</th>
                <th className="px-6 py-4 text-left">Points Target</th>
                <th className="px-6 py-4 text-left">Attached Map / File</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingConfigs ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-400">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      Loading configurations...
                    </div>
                  </td>
                </tr>
              ) : configs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                    No reward configurations found.
                  </td>
                </tr>
              ) : (
                configs.map((reward: any) => (
                  <tr key={reward._id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                    {/* Cover photo */}
                    <td className="px-6 py-4">
                      {reward.coverPhoto ? (
                        <img
                          src={getImageUrl(reward.coverPhoto)}
                          alt={reward.title}
                          className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 flex items-center justify-center rounded-lg text-gray-400 border border-gray-200">
                          <ImageIcon size={18} />
                        </div>
                      )}
                    </td>

                    {/* Title & Description */}
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900 text-sm">{reward.title}</div>
                      <div className="text-xs text-gray-500 line-clamp-1 max-w-sm mt-0.5">{reward.description}</div>
                    </td>

                    {/* Points target */}
                    <td className="px-6 py-4 text-sm font-bold text-gray-700">
                      {reward.target?.toLocaleString()} XP
                    </td>

                    {/* Attached elements */}
                    <td className="px-6 py-4 text-xs space-y-1">
                      {reward.mapId && (
                        <div className="flex items-center gap-1 text-blue-600 font-semibold">
                          <MapPin size={12} />
                          <span>Map: {reward.mapId?.title || reward.mapId?.name}</span>
                        </div>
                      )}
                      {reward.fileUrl && (
                        <div className="flex items-center gap-1 text-green-600 font-semibold">
                          <FileText size={12} />
                          <span>File: {reward.fileUrl.split("/").pop()}</span>
                        </div>
                      )}
                      {!reward.mapId && !reward.fileUrl && (
                        <span className="text-gray-400 italic">None attached</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(reward)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider"
                        >
                          <Edit size={14} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(reward._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider"
                        >
                          <Trash2 size={14} /> Delete
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

      {/* Edit/Create Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              {isCreateMode ? "Add New Reward" : `Edit Reward: ${selectedReward?.type}`}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            {/* Reward Type */}
            <div className="space-y-1">
              <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Reward Type</Label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full h-10 px-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                required
              >
                <option value="PDF Itinerary">PDF Itinerary</option>
                <option value="Free Map">Free Map</option>
                <option value="Gourmet Guide">Gourmet Guide</option>
                <option value="Top Reviewer">Top Reviewer</option>
                <option value="Trail Master">Trail Master</option>
                <option value="History Buff">History Buff</option>
                <option value="Legendary Explorer">Legendary Explorer</option>
                <option value="Exclusive Discount">Exclusive Discount</option>
                <option value="Permanent Discount">Permanent Discount</option>
              </select>
            </div>

            {/* Title */}
            <div className="space-y-1">
              <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Reward Title</Label>
              <Input
                placeholder="e.g. PDF Travel Itinerary"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-1">
              <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Description</Label>
              <textarea
                rows={3}
                placeholder="Describe what the user gets when unlocking this reward..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-sm p-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Target threshold */}
              <div className="space-y-1">
                <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Target Points (XP)</Label>
                <Input
                  type="number"
                  placeholder="e.g. 500"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  required
                />
              </div>

              {/* Map reference */}
              <div className="space-y-1">
                <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Attach Map (Optional)</Label>
                <select
                  value={mapId}
                  onChange={(e) => setMapId(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="" className="text-gray-900 bg-white">No map attached</option>
                  {maps.map((map: any) => (
                    <option key={map._id} value={map._id} className="text-gray-900 bg-white">
                      {map.name || map.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* File attachments */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              {/* Cover Image Upload */}
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Cover Photo</Label>
                <div
                  onClick={() => coverInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-blue-400 transition-colors bg-gray-50/50"
                >
                  {coverPreview ? (
                    <img
                      src={coverPreview}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                    />
                  ) : (
                    <>
                      <ImageIcon size={20} className="text-gray-400" />
                      <span className="text-[10px] font-bold text-gray-500">Click to Upload</span>
                    </>
                  )}
                  <input
                    type="file"
                    ref={coverInputRef}
                    accept="image/*"
                    onChange={handleCoverChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* PDF Document Upload */}
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Downloadable PDF</Label>
                <div
                  onClick={() => pdfInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-blue-400 transition-colors bg-gray-50/50 h-[102px]"
                >
                  {pdfFile || selectedReward?.fileUrl ? (
                    <div className="text-center">
                      <FileText size={20} className="text-green-500 mx-auto" />
                      <span className="text-[10px] font-bold text-gray-600 block truncate max-w-[120px] mt-1">
                        {pdfFile ? pdfFile.name : selectedReward.fileUrl.split("/").pop()}
                      </span>
                    </div>
                  ) : (
                    <>
                      <Upload size={20} className="text-gray-400" />
                      <span className="text-[10px] font-bold text-gray-500">Click to Upload PDF</span>
                    </>
                  )}
                  <input
                    type="file"
                    ref={pdfInputRef}
                    accept="application/pdf"
                    onChange={handlePdfChange}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {/* Dialog Footer Actions */}
            <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="h-10 px-4 text-xs font-bold uppercase tracking-widest rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isCreating || isUpdating}
                className="h-10 px-5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-widest rounded-xl"
              >
                {isCreating || isUpdating ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
