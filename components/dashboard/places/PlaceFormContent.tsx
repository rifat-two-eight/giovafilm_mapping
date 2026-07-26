"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { TimeRangePicker } from "@/components/ui/time-range-picker";
import { getImageUrl } from "@/lib/utils";
import {
  Baby,
  Car,
  X as CloseIcon,
  Dog,
  MapPin,
  Upload,
  Users,
  Utensils,
  Wifi,
  FileText,
  Compass,
  Accessibility,
  Heart,
  Grid,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { CategoryIcon } from "@/components/shared/categories/category-icon";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface PlaceFormContentProps {
  categories: any[];
  onSave: (data: any) => Promise<void>;
  isSaving: boolean;
  isFetchingAddress?: boolean;
  onClose: () => void;
  initialData?: {
    name: string;
    description: string;
    category: string;
    type?: string;
    address?: string;
    accessDescription?: string;
    tips?: string;
    services?: string[];
    accessibility?: any;
    images?: string[];
    isNew: boolean;
    phone?: string;
    website?: string;
    instagram?: string;
    schedules?: string;
    entryCost?: number;
    hikeTime?: string | number;
    atmosphere?: string;
    difficulty?: string;
    operatingHours?: Record<string, { open: string; close: string; closed: boolean }>;
  };
}

const TABS = [
  { label: "Basic Info", icon: FileText },
  { label: "Access", icon: Compass },
  { label: "Accessibility", icon: Accessibility },
  { label: "Recommendations", icon: Heart },
  { label: "Services", icon: Grid },
];

export const PlaceFormContent = ({
  categories,
  onSave,
  isSaving,
  isFetchingAddress,
  onClose,
  initialData,
}: PlaceFormContentProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(
    initialData?.images || [],
  );
  const [previews, setPreviews] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    category: initialData?.category || "",
    type: initialData?.type || "Regular",
    description: initialData?.description || "",
    address: initialData?.address || "",
    accessDescription: initialData?.accessDescription || "",
    accessibility: {
      wheelchair: initialData?.accessibility?.wheelchair || false,
      children: initialData?.accessibility?.children || false,
      pets: initialData?.accessibility?.pets || false,
      senior: initialData?.accessibility?.senior || false,
      notes: initialData?.accessibility?.notes || "",
    },
    tips: initialData?.tips || "",
    services: initialData?.services || ([] as string[]),
    schedules: initialData?.schedules || "",
    entryCost: initialData?.entryCost || "",
    hikeTime: initialData?.hikeTime || "",
    atmosphere: initialData?.atmosphere || "",
    difficulty: initialData?.difficulty || "",
    phone: initialData?.phone || "",
    website: initialData?.website || "",
    instagram: initialData?.instagram || "",
    operatingHours: (initialData?.operatingHours && Object.keys(initialData.operatingHours).length > 0
      ? (initialData.operatingHours as Record<string, { open: string; close: string; closed: boolean }>)
      : null) || {
      Monday:    { open: "09:00", close: "18:00", closed: false },
      Tuesday:   { open: "09:00", close: "18:00", closed: false },
      Wednesday: { open: "09:00", close: "18:00", closed: false },
      Thursday:  { open: "09:00", close: "18:00", closed: false },
      Friday:    { open: "09:00", close: "18:00", closed: false },
      Saturday:  { open: "10:00", close: "16:00", closed: false },
      Sunday:    { open: "10:00", close: "16:00", closed: true },
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setMediaFiles((prev) => [...prev, ...files]);
    if (errors.media) setErrors((prev) => ({ ...prev, media: "" }));

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeMedia = (index: number) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  useEffect(() => {
    if (initialData?.address !== undefined) {
      setFormData((prev) => ({ ...prev, address: initialData.address || "" }));
    }
  }, [initialData?.address]);

  const handleSave = async (publish: boolean = false) => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = "Place name is required";
    }
    if (!formData.category) {
      newErrors.category = "Category is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }
    if (mediaFiles.length === 0 && existingImages.length === 0) {
      newErrors.media = "At least one media file (image/video) is required";
    }
    if (!formData.type) {
      newErrors.type = "Location type is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setActiveTab(0); // Switch to Basic Info tab
      toast.error("Please fill in all required fields.");
      return;
    }

    setErrors({});
    await onSave({
      ...formData,
      status: publish ? "Published" : "Draft",
      mediaFiles,
      existingImages,
    });
  };

  const toggleService = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));
  };

  const updateOperatingHours = (
    day: string,
    patch: Partial<{ open: string; close: string; closed: boolean }>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      operatingHours: {
        ...prev.operatingHours,
        [day]: { ...prev.operatingHours[day], ...patch },
      },
    }));
  };

  const updateAccessibility = (
    key: keyof typeof formData.accessibility,
    value: any,
  ) => {
    setFormData((prev) => ({
      ...prev,
      accessibility: { ...prev.accessibility, [key]: value },
    }));
  };

  const servicesList = [
    { id: "Parking", icon: <Car size={14} /> },
    { id: "Restrooms", icon: <Users size={14} /> },
    { id: "Food Nearby", icon: <Utensils size={14} /> },
    { id: "Guided Tour", icon: <MapPin size={14} /> },
    { id: "Family Friendly", icon: <Baby size={14} /> },
    { id: "Wifi", icon: <Wifi size={14} /> },
    { id: "Pet Friendly", icon: <Dog size={14} /> },
  ];

  const isBasicInfoValid = formData.name.trim() !== "" && formData.category !== "" && formData.description.trim() !== "" && formData.address.trim() !== "";
  const hasBasicInfoErrors = !!(errors.name || errors.category || errors.description || errors.address);

  return (
    <div className="w-full bg-white flex flex-col font-arial">
      {/* Navigation Header */}
      <div className="bg-white border-b border-gray-200 px-4 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1 min-w-max">
          {TABS.map((tab, index) => {
            const TabIcon = tab.icon;
            const isSelected = activeTab === index;
            
            // Validation indicator logic
            let indicator = null;
            if (index === 0) {
              if (hasBasicInfoErrors) {
                indicator = <AlertCircle size={12} className="text-red-500 animate-pulse flex-shrink-0" />;
              } else if (isBasicInfoValid) {
                indicator = <CheckCircle2 size={12} className="text-green-500 flex-shrink-0" />;
              }
            }

            return (
              <button
                key={tab.label}
                type="button"
                onClick={() => {
                  if (index > 0) {
                    const newErrors: Record<string, string> = {};
                    if (!formData.name.trim()) newErrors.name = "Place name is required";
                    if (!formData.category) newErrors.category = "Category is required";
                    if (!formData.description.trim()) newErrors.description = "Description is required";
                    if (!formData.address.trim()) newErrors.address = "Address is required";
                    if (mediaFiles.length === 0 && existingImages.length === 0) newErrors.media = "At least one media file (image/video) is required";
                    if (!formData.type) newErrors.type = "Location type is required";

                    if (Object.keys(newErrors).length > 0) {
                      setErrors(newErrors);
                      toast.error("Please fill in all required fields first.");
                      return;
                    }
                  }
                  setActiveTab(index);
                }}
                className={`flex items-center gap-2 px-4 py-4 text-xs font-semibold uppercase tracking-wider transition-all relative ${
                  isSelected
                    ? "text-blue-600 font-bold border-b-2 border-blue-500"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                <TabIcon size={14} className="flex-shrink-0" />
                <span>{tab.label}</span>
                {indicator}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Body */}
      <div className="flex-1 overflow-y-auto max-h-[450px] p-6 space-y-6">
        {activeTab === 0 && (
          <div className="space-y-5 animate-in slide-in-from-bottom-2 duration-300">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Place Name <span className="text-red-500">*</span></Label>
                <Input
                  placeholder="e.g., Golden Gate Park"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                  }}
                  className={`w-full bg-white rounded-lg h-9 text-sm italic ${errors.name ? "border-red-500 focus:ring-red-500" : "border-gray-200"}`}
                />
                {errors.name && <p className="text-[11px] text-red-500 font-semibold">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Category <span className="text-red-500">*</span>
                  {formData.type === "Business" && (
                    <span className="ml-2 text-[10px] bg-blue-50 text-blue-600 font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">Business</span>
                  )}
                </Label>
                <Select
                  value={formData.category || undefined}
                  onValueChange={(val) => {
                    setFormData({ ...formData, category: val });
                    if (errors.category) setErrors((prev) => ({ ...prev, category: "" }));
                  }}
                >
                  <SelectTrigger className={`w-full h-10 bg-white rounded-lg text-sm italic ${errors.category ? "border-red-500 focus:ring-red-500" : "border-gray-200"}`}>
                    <div className="flex items-center gap-2">
                      {formData.category && (
                        <CategoryIcon
                          icon={
                            categories.find(
                              (c: any) => c._id === formData.category,
                            )?.icon
                          }
                          size={18}
                          color={
                            categories.find(
                              (c: any) => c._id === formData.category,
                            )?.color
                          }
                        />
                      )}
                      <SelectValue placeholder={formData.type === "Business" ? "Choose a business category" : "Choose a category"} />
                    </div>
                  </SelectTrigger>
                  <SelectContent position="popper" style={{ zIndex: 99999 }}>
                    {categories.map((cat: any) => (
                      <SelectItem key={cat._id} value={cat._id}>
                        <div className="flex items-center gap-2">
                          <CategoryIcon
                            icon={cat.icon}
                            size={20}
                            color={cat.color}
                          />
                          <span>{cat.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Location Type <span className="text-red-500">*</span></Label>
                <Select
                  value={formData.type}
                  onValueChange={(val) => {
                    // Reset category when switching type to avoid stale selection
                    setFormData({ ...formData, type: val, category: "" });
                    if (errors.type) setErrors((prev) => ({ ...prev, type: "" }));
                  }}
                >
                  <SelectTrigger className={`w-full h-10 bg-white rounded-lg text-sm italic ${errors.type ? "border-red-500 focus:ring-red-500" : "border-gray-200"}`}>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent position="popper" style={{ zIndex: 99999 }}>
                    <SelectItem value="Regular">Regular Location</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && <p className="text-[11px] text-red-500 font-semibold">{errors.type}</p>}
              </div>
            </div>

             {/* Business Contact Info */}
            {formData.type === "Business" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-gray-100 p-4 rounded-xl bg-gray-50/30">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Phone Number</Label>
                  <Input
                    placeholder="e.g. +1 787-123-4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="bg-white border-gray-200 text-xs h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Website URL</Label>
                  <Input
                    placeholder="e.g. https://mybusiness.com"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="bg-white border-gray-200 text-xs h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Instagram username</Label>
                  <Input
                    placeholder="e.g. my_business"
                    value={formData.instagram}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    className="bg-white border-gray-200 text-xs h-9"
                  />
                </div>
              </div>
            )}

            {/* Operating Hours — shown only for Business type */}
            {formData.type === "Business" && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium">Operating Hours</Label>
                  <span className="text-[10px] bg-blue-50 text-blue-600 font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">Business</span>
                </div>
                <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-100">
                  {Object.entries(formData.operatingHours).map(([day, hours]) => (
                    <div key={day} className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${hours.closed ? "bg-gray-50" : "bg-white"}`}>
                      <span className={`w-24 text-xs font-semibold shrink-0 ${hours.closed ? "text-gray-400" : "text-gray-700"}`}>
                        {day}
                      </span>
                      <label className="flex items-center gap-1.5 cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          checked={hours.closed}
                          onChange={(e) => updateOperatingHours(day, { closed: e.target.checked })}
                          className="w-3.5 h-3.5 accent-red-500 cursor-pointer"
                        />
                        <span className="text-[11px] text-gray-500 select-none">Closed</span>
                      </label>
                      {!hours.closed ? (
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="time"
                            value={hours.open}
                            onChange={(e) => updateOperatingHours(day, { open: e.target.value })}
                            className="h-8 px-2 rounded-lg border border-gray-200 bg-white text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400/40 transition-all cursor-pointer"
                          />
                          <span className="text-gray-400 text-xs font-bold">—</span>
                          <input
                            type="time"
                            value={hours.close}
                            onChange={(e) => updateOperatingHours(day, { close: e.target.value })}
                            className="h-8 px-2 rounded-lg border border-gray-200 bg-white text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400/40 transition-all cursor-pointer"
                          />
                        </div>
                      ) : (
                        <span className="text-[11px] text-red-400 font-semibold italic flex-1">Closed all day</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-sm font-medium">Short Description <span className="text-red-500">*</span></Label>
              <Textarea
                placeholder="Brief description of this place..."
                value={formData.description}
                onChange={(e) => {
                  setFormData({ ...formData, description: e.target.value });
                  if (errors.description) setErrors((prev) => ({ ...prev, description: "" }));
                }}
                className={`w-full bg-white rounded-lg min-h-[120px]! text-sm resize-none italic ${errors.description ? "border-red-500 focus:ring-red-500" : "border-gray-200"}`}
              />
              {errors.description && <p className="text-[11px] text-red-500 font-semibold">{errors.description}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Media <span className="text-red-500">*</span></Label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 bg-white flex flex-col items-center justify-center gap-3 group transition-all cursor-pointer ${errors.media ? "border-red-500 hover:border-red-600 bg-red-50/10" : "border-gray-200 hover:border-blue-400"}`}
              >
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-blue-500 transition-colors">
                  <Upload size={20} />
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-gray-700">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-[9px] text-gray-400 tracking-tight">
                    (Images, videos up to 10MB)
                  </p>
                </div>
              </div>
              {errors.media && <p className="text-[11px] text-red-500 font-semibold">{errors.media}</p>}

              {/* Existing Images (from Server) */}
              {existingImages.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {existingImages.map((url, index) => (
                    <div
                      key={`existing-${index}`}
                      className="relative aspect-square rounded-lg overflow-hidden border border-gray-100 group"
                    >
                      <img
                        src={getImageUrl(url)}
                        alt={`existing-${index}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeExistingImage(index);
                        }}
                        className="absolute top-1 right-1 bg-white/90 p-1 rounded-full shadow-sm text-red-500 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                      >
                        <CloseIcon size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* New Upload Previews (Blob URLs) */}
              {previews.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {previews.map((url, index) => (
                    <div
                      key={`new-${index}`}
                      className="relative aspect-square rounded-lg overflow-hidden border border-gray-100 group"
                    >
                      <img
                        src={url} // Raw blob URL
                        alt={`preview-${index}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeMedia(index);
                        }}
                        className="absolute top-1 right-1 bg-white/90 p-1 rounded-full shadow-sm text-red-500 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                      >
                        <CloseIcon size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <Input
                type="file"
                ref={fileInputRef}
                multiple
                className="hidden"
                accept="image/*,video/*"
                onChange={handleFileChange}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Address <span className="text-red-500">*</span></Label>
              <div className="relative">
                <MapPin
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <Input
                  placeholder={
                    isFetchingAddress ? "Fetching address..." : "Full address"
                  }
                  value={formData.address}
                  onChange={(e) => {
                    setFormData({ ...formData, address: e.target.value });
                    if (errors.address) setErrors((prev) => ({ ...prev, address: "" }));
                  }}
                  className={`bg-white rounded-lg h-10 pl-10 text-sm italic ${isFetchingAddress ? "animate-pulse text-gray-400" : ""} ${errors.address ? "border-red-500 focus:ring-red-500" : "border-gray-200"}`}
                  disabled={isFetchingAddress}
                />
                {isFetchingAddress && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
              {errors.address && <p className="text-[11px] text-red-500 font-semibold">{errors.address}</p>}
            </div>

            {/* Conditionally Rendered New Fields */}
            {formData.category && (
              <div className="grid grid-cols-2 gap-4">
                {/* Schedules — hidden for Business type (uses Operating Hours instead) */}
                {formData.type !== "Business" && (
                <div className="space-y-2 col-span-2">
                  <Label className="text-sm font-medium">Schedules</Label>
                  <div className="flex items-center gap-2 mb-2">
                    <Checkbox
                      id="always-open"
                      checked={formData.schedules === "Always open"}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          schedules: checked ? "Always open" : "",
                        })
                      }
                    />
                    <Label
                      htmlFor="always-open"
                      className="text-sm cursor-pointer"
                    >
                      Always open
                    </Label>
                  </div>
                  {formData.schedules !== "Always open" && (
                    <TimeRangePicker
                      value={formData.schedules}
                      onChange={(val) =>
                        setFormData({ ...formData, schedules: val })
                      }
                    />
                  )}
                </div>
                )}

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Atmosphere</Label>
                  <Input
                    placeholder='e.g., "Relaxing"'
                    value={formData.atmosphere}
                    onChange={(e) =>
                      setFormData({ ...formData, atmosphere: e.target.value })
                    }
                    className="w-full bg-white border-gray-200 rounded-lg h-9 text-sm italic"
                  />
                </div>

                {categories
                  .find((c: any) => c._id === formData.category)
                  ?.name?.toLowerCase() !== "restaurant" && (
                    <>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Entry Cost</Label>
                        <Input
                          placeholder='e.g., "$15.00 / vehicle"'
                          type="number"
                          min={0}
                          value={formData.entryCost}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              entryCost: e.target.value,
                            })
                          }
                          className="w-full bg-white border-gray-200 rounded-lg h-9 text-sm italic"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Difficulty</Label>
                        <Select
                          value={formData.difficulty || undefined}
                          onValueChange={(val) =>
                            setFormData({ ...formData, difficulty: val })
                          }
                        >
                          <SelectTrigger className="w-full h-9 bg-white border-gray-200 rounded-lg text-sm italic">
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                          <SelectContent
                            position="popper"
                            style={{ zIndex: 99999 }}
                          >
                            <SelectItem value="Easy">Easy</SelectItem>
                            <SelectItem value="Moderate">Moderate</SelectItem>
                            <SelectItem value="Hard">Hard</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Walking Time</Label>
                        <Input
                          placeholder='e.g., "30 minutes" or "~ 3.5 Hours"'
                          value={formData.hikeTime}
                          type="text"
                          onChange={(e) =>
                            setFormData({ ...formData, hikeTime: e.target.value })
                          }
                          className="w-full bg-white border-gray-200 rounded-lg h-9 text-sm italic"
                        />
                      </div>
                    </>
                  )}
              </div>
            )}
          </div>
        )}

        {activeTab === 1 && (
          <div className="space-y-5 animate-in slide-in-from-bottom-2 duration-300">
            <div className="bg-white p-5 rounded-xl border border-gray-200 space-y-4">
              <div className="space-y-1">
                <Label className="text-sm font-bold text-gray-800">
                  Access Description
                </Label>
                <p className="text-[11px] text-gray-500">
                  Write how to get here (public transport, taxi, parking notes).
                  Keep it simple.
                </p>
              </div>
              <Textarea
                placeholder="e.g., Take Metro Line 2 to Central Station. Exit B. Taxi cost approx $5 from downtown."
                value={formData.accessDescription}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    accessDescription: e.target.value,
                  })
                }
                className="min-h-[140px] border-gray-100 italic text-sm bg-gray-50 focus:bg-white transition-colors"
              />
            </div>
          </div>
        )}

        {activeTab === 2 && (
          <div className="space-y-5 animate-in slide-in-from-bottom-2 duration-300">
            <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="wheelchair"
                    checked={formData.accessibility.wheelchair}
                    onCheckedChange={(val) =>
                      updateAccessibility("wheelchair", !!val)
                    }
                  />
                  <Label
                    htmlFor="wheelchair"
                    className="text-sm font-medium text-gray-700 flex items-center gap-2"
                  >
                    Wheelchair Access
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="children"
                    checked={formData.accessibility.children}
                    onCheckedChange={(val) =>
                      updateAccessibility("children", !!val)
                    }
                  />
                  <Label
                    htmlFor="children"
                    className="text-sm font-medium text-gray-700 flex items-center gap-2"
                  >
                    Children
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="pets"
                    checked={formData.accessibility.pets}
                    onCheckedChange={(val) =>
                      updateAccessibility("pets", !!val)
                    }
                  />
                  <Label
                    htmlFor="pets"
                    className="text-sm font-medium text-gray-700 flex items-center gap-2"
                  >
                    Pets
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="senior"
                    checked={formData.accessibility.senior}
                    onCheckedChange={(val) =>
                      updateAccessibility("senior", !!val)
                    }
                  />
                  <Label
                    htmlFor="senior"
                    className="text-sm font-medium text-gray-700 flex items-center gap-2"
                  >
                    Senior Access
                  </Label>
                </div>
              </div>

              {/* <Button
                variant="outline"
                size="sm"
                className="w-fit text-[10px] font-bold uppercase tracking-widest text-yellow-600 border-yellow-200 bg-yellow-50/50 hover:bg-yellow-50"
              >
                <Plus size={14} className="mr-2" /> Add more
              </Button> */}

              <div className="space-y-2">
                <Label className="text-sm font-medium">Notes (optional)</Label>
                <Textarea
                  placeholder="Additional accessibility information..."
                  value={formData.accessibility.notes}
                  onChange={(e) => updateAccessibility("notes", e.target.value)}
                  className="min-h-[100px] border-gray-100 italic text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 3 && (
          <div className="space-y-5 animate-in slide-in-from-bottom-2 duration-300">
            <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-4">
              <div className="space-y-1">
                <Label className="text-sm font-bold text-gray-800">
                  What to Take / Tips
                </Label>
                <p className="text-sm font-medium">
                  Water, comfortable shoes, sunscreen, light jacket...
                </p>
              </div>
              <Textarea
                placeholder="List recommended items to bring..."
                value={formData.tips}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tips: e.target.value,
                  })
                }
                className="min-h-[160px] border-gray-100 italic text-sm bg-gray-50 focus:bg-white"
              />
            </div>
          </div>
        )}

        {activeTab === 4 && (
          <div className="space-y-5 animate-in slide-in-from-bottom-2 duration-300">
            <div className="space-y-1 mb-3">
              <p className="text-sm font-semibold">
                Services will appear in a compact grid.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {servicesList.map((service) => (
                <div
                  key={service.id}
                  onClick={() => toggleService(service.id)}
                  className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${formData.services.includes(service.id)
                    ? "bg-blue-50 border-blue-200"
                    : "bg-white border-gray-100 hover:border-gray-200"
                    }`}
                >
                  <Checkbox
                    checked={formData.services.includes(service.id)}
                    className="rounded-full"
                  />
                  <div className="space-y-1">
                    <div className="">{service.icon}</div>
                    <p className="text-xs  leading-tight">{service.id}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* <Button className="w-full h-11 bg-yellow-500 hover:bg-yellow-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-yellow-100">
              <Plus size={16} className="mr-2" /> ADD NEW SERVICE
            </Button> */}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between sticky bottom-0">
        <Button
          variant="destructive"
          type="button"
          onClick={onClose}
          className="px-5 h-10 bg-red-500 hover:bg-red-600 font-bold text-xs uppercase tracking-widest rounded-xl transition-all"
        >
          Cancel
        </Button>
        <div className="flex gap-2">
          {activeTab > 0 && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setActiveTab(activeTab - 1)}
              className="px-5 h-10 border-gray-200 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-gray-50 transition-all flex items-center gap-1.5"
            >
              <ArrowLeft size={14} /> Back
            </Button>
          )}
          {activeTab < 4 ? (
            <Button
              type="button"
              onClick={() => {
                if (activeTab === 0) {
                  const newErrors: Record<string, string> = {};
                  if (!formData.name.trim()) newErrors.name = "Place name is required";
                  if (!formData.category) newErrors.category = "Category is required";
                  if (!formData.description.trim()) newErrors.description = "Description is required";
                  if (!formData.address.trim()) newErrors.address = "Address is required";
                  if (mediaFiles.length === 0 && existingImages.length === 0) newErrors.media = "At least one media file (image/video) is required";
                  if (!formData.type) newErrors.type = "Location type is required";

                  if (Object.keys(newErrors).length > 0) {
                    setErrors(newErrors);
                    toast.error("Please fill in all required fields first.");
                    return;
                  }
                }
                setActiveTab(activeTab + 1);
              }}
              className="px-5 h-10 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center gap-1.5"
            >
              Next <ArrowRight size={14} />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={() => handleSave(true)}
              disabled={isSaving}
              className="px-5 h-10 bg-green-600 hover:bg-green-700 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md shadow-green-100 flex items-center gap-1.5"
            >
              Save & Publish
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
