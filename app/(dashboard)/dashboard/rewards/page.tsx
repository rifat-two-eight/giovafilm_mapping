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
import { getImageUrl, getLocalized } from "@/lib/utils";
import { Edit, Image as ImageIcon, Plus, Upload, X, MapPin, FileText, Trash2, Award, Percent, FileCode, Gift } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { appAlert } from "@/lib/app-alert";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function RewardsAdminPage() {
  const { t, language } = useLanguage();
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
  const [discountPercentage, setDiscountPercentage] = useState("");

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
    setTarget("500");
    setMapId("");
    setType("PDF Itinerary");
    setDiscountPercentage("");
    setCoverPreview(null);
    setCoverFile(null);
    setPdfFile(null);
    setIsCreateMode(true);
    setOpen(true);
  };

  const handleOpenEdit = (reward: any) => {
    setSelectedReward(reward);
    setTitle(getLocalized(reward.title, language) || "");
    setDescription(getLocalized(reward.description, language) || "");
    setTarget(reward.target?.toString() || "0");
    setMapId(reward.mapId?._id || reward.mapId || "");
    setType(reward.type || "PDF Itinerary");
    setDiscountPercentage(reward.discountPercentage?.toString() || "");
    setCoverPreview(getImageUrl(reward.coverPhoto));
    setCoverFile(null);
    setPdfFile(null);
    setIsCreateMode(false);
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    appAlert.fire({
      title: t("common.are_you_sure"),
      text: t("rewards_admin.delete_confirm") || "You won't be able to revert this reward deletion!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: t("common.yes_delete_it") || "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteAwardConfig(id).unwrap();
          toast.success(t("rewards_admin.deleted_successfully") || "Reward deleted successfully");
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
      const rewardData: any = {
        type,
        title,
        description,
        target: Number(target) || 0,
        mapId: (type === "Free Map" || mapId) ? (mapId || null) : null,
        discountPercentage: (type === "Exclusive Discount" || type === "Permanent Discount")
          ? (Number(discountPercentage) || 0)
          : undefined,
      };

      if (!isCreateMode && selectedReward) {
        rewardData.fileUrl = selectedReward.fileUrl || "";
      }

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
        toast.success(t("rewards_admin.created_success") || "Reward created successfully");
      } else {
        if (!selectedReward) return;
        await updateAwardConfig({ id: selectedReward._id, data: formData }).unwrap();
        toast.success(t("rewards_admin.updated_success") || "Reward updated successfully");
      }
      setOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || t("rewards_admin.failed_save") || "Failed to save reward");
      console.error(error);
    }
  };

  const getTypeBadge = (rewardType: string) => {
    if (rewardType === "PDF Itinerary" || rewardType === "Gourmet Guide") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
          <FileText size={12} />
          {rewardType}
        </span>
      );
    }
    if (rewardType === "Free Map") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200/60">
          <MapPin size={12} />
          {rewardType}
        </span>
      );
    }
    if (rewardType === "Exclusive Discount" || rewardType === "Permanent Discount") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200/60">
          <Percent size={12} />
          {rewardType}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200/60">
        <Award size={12} />
        {rewardType}
      </span>
    );
  };

  const isPdfType = type === "PDF Itinerary" || type === "Gourmet Guide";
  const isDiscountType = type === "Exclusive Discount" || type === "Permanent Discount";
  const isMapType = type === "Free Map";

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">{t("rewards_admin.title") || "Rewards & Badges Management"}</h1>
          <p className="text-xs text-gray-500 mt-1">{t("rewards_admin.subtitle") || "Configure XP targets, downloadable itineraries, free map unlocks, and achievement badges"}</p>
        </div>
        <Button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl px-5 py-2.5 shadow-sm transition-all"
        >
          <Plus size={16} />
          {t("rewards_admin.add_reward") || "Add New Reward"}
        </Button>
      </div>

      {/* Grid List Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/80 text-[11px] uppercase font-bold text-gray-500 tracking-wider">
                <th className="px-6 py-4 text-left">{t("rewards_admin.cover") || "Icon"}</th>
                <th className="px-6 py-4 text-left">{t("rewards_admin.reward_name") || "Reward & Description"}</th>
                <th className="px-6 py-4 text-left">{t("rewards_admin.reward_type") || "Category / Type"}</th>
                <th className="px-6 py-4 text-left">{t("rewards_admin.points_target") || "XP Target"}</th>
                <th className="px-6 py-4 text-left">{t("rewards_admin.attached_map_file") || "Attachments & Details"}</th>
                <th className="px-6 py-4 text-right">{t("rewards_admin.actions") || "Actions"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoadingConfigs ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      {t("rewards_admin.loading_configs") || "Loading reward configurations..."}
                    </div>
                  </td>
                </tr>
              ) : configs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 font-medium text-sm">
                    {t("rewards_admin.no_rewards") || "No rewards found. Click 'Add New Reward' to create one."}
                  </td>
                </tr>
              ) : (
                configs.map((reward: any) => (
                  <tr key={reward._id} className="hover:bg-gray-50/60 transition-colors">
                    {/* Cover photo */}
                    <td className="px-6 py-4">
                      {reward.coverPhoto ? (
                        <img
                          src={getImageUrl(reward.coverPhoto)}
                          alt={getLocalized(reward.title, language)}
                          className="w-12 h-12 object-cover rounded-xl border border-gray-200 shadow-2xs"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 flex items-center justify-center rounded-xl text-gray-400 border border-gray-200">
                          <ImageIcon size={20} />
                        </div>
                      )}
                    </td>

                    {/* Title & Description */}
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900 text-sm">{getLocalized(reward.title, language)}</div>
                      <div className="text-xs text-gray-500 line-clamp-2 max-w-md mt-0.5 font-normal leading-relaxed">
                        {getLocalized(reward.description, language)}
                      </div>
                    </td>

                    {/* Type Badge */}
                    <td className="px-6 py-4">
                      {getTypeBadge(reward.type)}
                    </td>

                    {/* Points target */}
                    <td className="px-6 py-4">
                      <div className="text-sm font-extrabold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/50 inline-block">
                        {reward.target?.toLocaleString()} XP
                      </div>
                      {reward.discountPercentage !== undefined && (
                        <div className="text-xs text-purple-700 font-bold mt-1">
                          Discount: {reward.discountPercentage}%
                        </div>
                      )}
                    </td>

                    {/* Attached elements */}
                    <td className="px-6 py-4 text-xs space-y-1">
                      {reward.mapId && (
                        <div className="flex items-center gap-1.5 text-blue-600 font-semibold">
                          <MapPin size={13} />
                          <span>Map: {reward.mapId?.name || reward.mapId?.title}</span>
                        </div>
                      )}
                      {reward.fileUrl && (
                        <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                          <FileText size={13} />
                          <span className="truncate max-w-[160px]">PDF: {reward.fileUrl.split("/").pop()}</span>
                        </div>
                      )}
                      {!reward.mapId && !reward.fileUrl && (
                        <span className="text-gray-400 italic">No attachments required</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(reward)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors flex items-center gap-1 text-xs font-bold uppercase tracking-wider cursor-pointer"
                        >
                          <Edit size={14} /> {t("common.edit") || "Edit"}
                        </button>
                        <button
                          onClick={() => handleDelete(reward._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-1 text-xs font-bold uppercase tracking-wider cursor-pointer"
                        >
                          <Trash2 size={14} /> {t("common.delete") || "Delete"}
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
        <DialogContent className="max-w-xl rounded-3xl p-6 border-gray-100 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-gray-900">
              {isCreateMode ? (t("rewards_admin.add_new_reward") || "Add New Reward") : `${t("rewards_admin.edit_reward") || "Edit Reward"}: ${selectedReward?.type}`}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-3">
            {/* Reward Type */}
            <div className="space-y-1">
              <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">{t("rewards_admin.reward_type") || "Reward Type / Category"}</Label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full h-11 px-3 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                required
              >
                <optgroup label="Digital Downloads & Itineraries">
                  <option value="PDF Itinerary">PDF Travel Itinerary</option>
                  <option value="Gourmet Guide">Gourmet Guide (PDF)</option>
                </optgroup>
                <optgroup label="Map Unlocks & Discounts">
                  <option value="Free Map">Free Map Unlock</option>
                  <option value="Exclusive Discount">Exclusive Discount (%)</option>
                  <option value="Permanent Discount">Permanent Discount (%)</option>
                </optgroup>
                <optgroup label="Achievement Badges">
                  <option value="Top Reviewer">Top Reviewer Badge</option>
                  <option value="Trail Master">Trail Master Badge</option>
                  <option value="History Buff">History Buff Badge</option>
                  <option value="Legendary Explorer">Legendary Explorer Badge</option>
                </optgroup>
              </select>
            </div>

            {/* Discount Percentage field (Shown ONLY for Discount Types) */}
            {isDiscountType && (
              <div className="space-y-1 animate-in fade-in duration-200">
                <Label className="text-xs font-bold uppercase tracking-wider text-purple-700">{t("rewards_admin.discount_percentage") || "Discount Percentage (%)"}</Label>
                <Input
                  type="number"
                  placeholder="e.g. 15"
                  value={discountPercentage}
                  onChange={(e) => setDiscountPercentage(e.target.value)}
                  min="1"
                  max="100"
                  className="rounded-xl h-11 font-bold text-purple-900 bg-purple-50/30 border-purple-200"
                  required
                />
              </div>
            )}

            {/* Title */}
            <div className="space-y-1">
              <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">{t("rewards_admin.reward_title") || "Reward Title"}</Label>
              <Input
                placeholder="e.g. San Juan Heritage Tour PDF Itinerary"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="rounded-xl h-11"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-1">
              <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">{t("rewards_admin.description") || "Description"}</Label>
              <textarea
                rows={3}
                placeholder="Describe what the user gets when unlocking this reward..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-sm p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Target XP threshold */}
              <div className="space-y-1">
                <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">{t("rewards_admin.points_target") || "XP Points Required"}</Label>
                <Input
                  type="number"
                  placeholder="500"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  className="rounded-xl h-11 font-bold text-amber-900 bg-amber-50/20"
                  required
                />
              </div>

              {/* Map reference (Shown for Free Map or as optional) */}
              <div className="space-y-1">
                <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">{t("rewards_admin.attach_map_optional") || "Attach Specific Map (Optional)"}</Label>
                <select
                  value={mapId}
                  onChange={(e) => setMapId(e.target.value)}
                  className="w-full h-11 px-3 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="" className="text-gray-900 bg-white">
                    {isMapType ? "User Chooses Any Map" : "No Specific Map Attached"}
                  </option>
                  {maps.map((map: any) => (
                    <option key={map._id} value={map._id} className="text-gray-900 bg-white">
                      {map.name || map.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* File uploads section */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              {/* Cover Image / Badge Icon Upload */}
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">{t("rewards_admin.cover_photo") || "Icon / Badge Image"}</Label>
                <div
                  onClick={() => coverInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-blue-400 transition-colors bg-gray-50/50"
                >
                  {coverPreview ? (
                    <img
                      src={coverPreview}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded-xl border border-gray-200 shadow-2xs"
                    />
                  ) : (
                    <>
                      <ImageIcon size={22} className="text-gray-400" />
                      <span className="text-[11px] font-bold text-gray-500">{t("rewards_admin.click_to_upload") || "Click to upload image"}</span>
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

              {/* PDF Document Upload (Shown for PDF Types or when a document is attached) */}
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">{t("rewards_admin.downloadable_pdf") || "Downloadable PDF (Optional)"}</Label>
                <div
                  onClick={() => pdfInputRef.current?.click()}
                  className="relative border-2 border-dashed border-gray-200 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-blue-400 transition-colors bg-gray-50/50 h-[102px]"
                >
                  {(pdfFile || selectedReward?.fileUrl) && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPdfFile(null);
                        if (pdfInputRef.current) pdfInputRef.current.value = "";
                        if (selectedReward) setSelectedReward({ ...selectedReward, fileUrl: "" });
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-full transition-colors cursor-pointer z-10"
                      title="Remove PDF"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                  {pdfFile || selectedReward?.fileUrl ? (
                    <div className="text-center">
                      <FileText size={22} className="text-emerald-600 mx-auto" />
                      <span className="text-[10px] font-bold text-gray-700 block truncate max-w-[130px] mt-1">
                        {pdfFile ? pdfFile.name : selectedReward.fileUrl.split("/").pop()}
                      </span>
                    </div>
                  ) : (
                    <>
                      <Upload size={22} className="text-gray-400" />
                      <span className="text-[11px] font-bold text-gray-500">{t("rewards_admin.click_to_upload_pdf") || "Upload PDF File"}</span>
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
                className="h-11 px-5 text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer"
              >
                {t("common.cancel") || "Cancel"}
              </Button>
              <Button
                type="submit"
                disabled={isCreating || isUpdating}
                className="h-11 px-6 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm cursor-pointer"
              >
                {isCreating || isUpdating ? (t("profile.saving") || "Saving...") : (t("profile.save_changes") || "Save Reward")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
