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
import { InfoWindow } from "@vis.gl/react-google-maps";
import {
  Baby,
  Car,
  X as CloseIcon,
  Dog,
  MapPin,
  Music,
  Plus,
  Upload,
  Users,
  Utensils,
  Wifi,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface PlaceInfoWindowProps {
  position: { lat: number; lng: number };
  onClose: () => void;
  categories: any[];
  onSave: (data: any) => Promise<void>;
  isSaving: boolean;
  initialData?: {
    name: string;
    description: string;
    category: string;
    isNew: boolean;
  };
}

const TABS = [
  "Basic Info",
  "Access",
  "Accessibility",
  "Recommendations",
  "Services",
  "Reviews",
];

export const PlaceInfoWindow = ({
  position,
  onClose,
  categories,
  onSave,
  isSaving,
  initialData,
}: PlaceInfoWindowProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    category: initialData?.category || "",
    description: initialData?.description || "",
    address: "",
    accessDescription: "",
    accessibility: {
      wheelchair: false,
      children: false,
      pets: false,
      senior: false,
      notes: "",
    },
    recommendations: "",
    services: [] as string[],
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setMediaFiles((prev) => [...prev, ...files]);

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

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const handleSave = async (publish: boolean = false) => {
    await onSave({
      ...formData,
      status: publish ? "Published" : "Draft",
      mediaFiles,
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

  return (
    <InfoWindow position={position} onCloseClick={onClose} headerDisabled>
      <div className="min-w-[500px]! bg-gray-50 rounded-2xl overflow-hidden shadow-2xl border border-gray-200 font-sans flex flex-col animate-in fade-in duration-300">
        {/* Navigation Header */}
        <div className="bg-white border-b border-gray-200 px-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center min-w-max">
            {TABS.map((tab, index) => (
              <button
                key={tab}
                onClick={() => setActiveTab(index)}
                className={`px-4 py-4 text-[11px] font-bold uppercase tracking-widest transition-all relative min-w-[100px] ${
                  activeTab === index
                    ? "text-yellow-600"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab}
                {activeTab === index && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[4px] bg-yellow-400 rounded-t-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto max-h-[450px] p-6 space-y-6">
          {activeTab === 0 && (
            <div className="space-y-5 animate-in slide-in-from-bottom-2 duration-300">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                    Place Name
                  </Label>
                  <Input
                    placeholder="e.g., Golden Gate Park"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="bg-white border-gray-200 rounded-lg h-10 text-sm italic"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                    Category
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(val) =>
                      setFormData({ ...formData, category: val })
                    }
                  >
                    <SelectTrigger className="h-10 bg-white border-gray-200 rounded-lg text-sm italic">
                      <SelectValue placeholder="Choose a category" />
                    </SelectTrigger>
                    <SelectContent className="z-[9999]">
                      {categories.map((cat: any) => (
                        <SelectItem key={cat._id} value={cat._id}>
                          {cat.icon} {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                  Short Description
                </Label>
                <Textarea
                  placeholder="Brief description of this place..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="bg-white border-gray-200 rounded-lg min-h-[80px] text-sm resize-none italic"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                  Media
                </Label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-xl p-6 bg-white flex flex-col items-center justify-center gap-3 group hover:border-blue-400 transition-all cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-blue-500 transition-colors">
                    <Upload size={20} />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold text-gray-700">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-[9px] text-gray-400 uppercase font-bold tracking-tight">
                      (Images, videos up to 10MB)
                    </p>
                  </div>
                </div>

                {previews.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {previews.map((url, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-lg overflow-hidden border border-gray-100 group"
                      >
                        <img
                          src={url}
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

                <input
                  type="file"
                  ref={fileInputRef}
                  multiple
                  className="hidden"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                  Address
                </Label>
                <div className="relative">
                  <MapPin
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <Input
                    placeholder="Full address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="bg-white border-gray-200 rounded-lg h-10 pl-10 text-sm italic"
                  />
                </div>
              </div>
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
                    Write how to get here (public transport, taxi, parking
                    notes). Keep it simple.
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
                  <div className="flex items-center space-x-3">
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
                      <MapPin size={14} /> Wheelchair Access
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
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
                      <Baby size={14} /> Children
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
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
                      <Dog size={14} /> Pets
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
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
                      <Users size={14} /> Senior Access
                    </Label>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-fit text-[10px] font-bold uppercase tracking-widest text-yellow-600 border-yellow-200 bg-yellow-50/50 hover:bg-yellow-50"
                >
                  <Plus size={14} className="mr-2" /> Add more
                </Button>

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Notes (optional)
                  </Label>
                  <Textarea
                    placeholder="Additional accessibility information..."
                    value={formData.accessibility.notes}
                    onChange={(e) =>
                      updateAccessibility("notes", e.target.value)
                    }
                    className="min-h-[100px] border-gray-100 italic text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 3 && activeTab === 3 && (
            <div className="space-y-5 animate-in slide-in-from-bottom-2 duration-300">
              <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-4">
                <div className="space-y-1">
                  <Label className="text-sm font-bold text-gray-800">
                    What to Take / Tips
                  </Label>
                  <p className="text-[11px] text-gray-500">
                    Water, comfortable shoes, sunscreen, light jacket...
                  </p>
                </div>
                <Textarea
                  placeholder="List recommended items to bring..."
                  value={formData.recommendations}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      recommendations: e.target.value,
                    })
                  }
                  className="min-h-[160px] border-gray-100 italic text-sm bg-gray-50 focus:bg-white"
                />
              </div>
            </div>
          )}

          {activeTab === 4 && (
            <div className="space-y-5 animate-in slide-in-from-bottom-2 duration-300">
              <div className="space-y-1 mb-2">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                  Services will appear in a compact grid.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {servicesList.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => toggleService(service.id)}
                    className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                      formData.services.includes(service.id)
                        ? "bg-blue-50 border-blue-200"
                        : "bg-white border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <Checkbox
                      checked={formData.services.includes(service.id)}
                      className="rounded-full"
                    />
                    <div className="space-y-0.5">
                      <div className="text-gray-400">{service.icon}</div>
                      <p className="text-[10px] font-bold text-gray-700 leading-tight">
                        {service.id}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full h-11 bg-yellow-500 hover:bg-yellow-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-yellow-100">
                <Plus size={16} className="mr-2" /> ADD NEW SERVICE
              </Button>
            </div>
          )}

          {activeTab === 5 && (
            <div className="h-[200px] flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-500">
              <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-400">
                <Music size={32} />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-gray-800">
                  Review Management
                </p>
                <p className="text-xs text-gray-400">
                  Placeholder for review management system UI
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between sticky bottom-0">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 font-bold text-xs uppercase tracking-widest px-0"
          >
            Cancel
          </Button>
          <div className="flex gap-3">
            <Button
              onClick={() => handleSave(false)}
              disabled={isSaving}
              className=" font-bold text-xs px-6 h-10 rounded-lg shadow-md transition-transform active:scale-95"
            >
              Save
            </Button>
            <Button
              onClick={() => handleSave(true)}
              disabled={isSaving}
              className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs px-6 h-10 rounded-lg shadow-md transition-transform active:scale-95"
            >
              Save & Publish
            </Button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .gm-style-iw {
          padding: 0 !important;
          max-width: none !important;
          background: transparent !important;
          box-shadow: none !important;
        }
        .gm-style-iw-d {
          overflow: visible !important;
          max-height: none !important;
        }
        .gm-style-iw-c {
          padding: 0 !important;
          border-radius: 20px !important;
          background: white !important;
        }
        .gm-style-iw-tc::after {
          background: white !important;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </InfoWindow>
  );
};
