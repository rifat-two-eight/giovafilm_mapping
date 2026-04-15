"use client";

import { useRef, useState } from "react";
import { Camera, Utensils, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BusinessFormStep2Props {
  businessPhotos?: File[];
  menuFile?: File | null;
  onPhotosChange?: (files: File[]) => void;
  onMenuChange?: (file: File | null) => void;
}

export function BusinessFormStep3({
  businessPhotos = [],
  menuFile = null,
  onPhotosChange,
  onMenuChange,
}: BusinessFormStep2Props) {
  const photosInputRef = useRef<HTMLInputElement>(null);
  const menuInputRef = useRef<HTMLInputElement>(null);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>(() =>
    businessPhotos.map((f) => URL.createObjectURL(f))
  );
  const [menuPreview, setMenuPreview] = useState<string | null>(() =>
    menuFile ? URL.createObjectURL(menuFile) : null
  );
  const [menuFileName, setMenuFileName] = useState<string>(
    menuFile ? menuFile.name : ""
  );

  const handlePhotosSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      console.log("[v0] Photos selected:", files.length);
      const newFiles = [...businessPhotos, ...files];
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setPhotoPreviews([...photoPreviews, ...newPreviews]);
      onPhotosChange?.(newFiles);
    }
  };

  const handleMenuSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("[v0] Menu file selected:", file.name);
      const preview = URL.createObjectURL(file);
      setMenuPreview(preview);
      setMenuFileName(file.name);
      onMenuChange?.(file);
    }
  };

  const removePhoto = (index: number) => {
    const updatedPreviews = photoPreviews.filter((_, i) => i !== index);
    setPhotoPreviews(updatedPreviews);
    
    const updatedFiles = businessPhotos.filter((_, i) => i !== index);
    onPhotosChange?.(updatedFiles);
    
    if (photosInputRef.current) {
      photosInputRef.current.value = "";
    }
  };

  const removeMenu = () => {
    setMenuPreview(null);
    setMenuFileName("");
    onMenuChange?.(null);
    if (menuInputRef.current) {
      menuInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">MEDIA</h2>
        <p className="text-gray-600">
          Showcase your business with high-quality photos and your menu or price
          list to attract more customers.
        </p>
      </div>

      {/* Upload Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Business Photos */}
        <div className="space-y-4">
          {photoPreviews.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {photoPreviews.map((preview, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={preview}
                    alt={`Photo ${idx + 1}`}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removePhoto(idx)}
                    className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="bg-gray-100 rounded-lg aspect-square flex items-center justify-center cursor-pointer hover:bg-gray-150 transition-colors"
              onClick={() => photosInputRef.current?.click()}
            >
              <div className="text-center">
                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">TAP TO PREVIEW</p>
              </div>
            </div>
          )}
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900">Business Photos</h3>
            <p className="text-sm text-gray-600">
              Upload high-quality images of your establishment, products, or
              services. Recommended size: 1200x800px.
            </p>
            <Button
              onClick={() => photosInputRef.current?.click()}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
            >
              <Camera className="w-4 h-4 mr-2" />
              Upload Photos
            </Button>
          </div>
          <input
            ref={photosInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handlePhotosSelect}
            className="hidden"
          />
        </div>

        {/* Menu / Price List */}
        <div className="space-y-4">
          {menuPreview ? (
            <div className="relative group">
              <div className="bg-gray-100 rounded-lg aspect-square flex items-center justify-center p-4">
                {menuFileName.toLowerCase().endsWith(".pdf") ? (
                  <div className="text-center">
                    <div className="bg-red-100 text-red-600 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-2 font-bold text-xl">
                      PDF
                    </div>
                    <p className="text-sm text-gray-600 wrap-break-word">
                      {menuFileName}
                    </p>
                  </div>
                ) : (
                  <img
                    src={menuPreview}
                    alt="Menu preview"
                    className="w-full h-full object-cover rounded"
                  />
                )}
              </div>
              <button
                onClick={removeMenu}
                className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              className="relative"
              onClick={() => menuInputRef.current?.click()}
            >
              <div className="bg-gray-100 rounded-lg aspect-square flex items-center justify-center cursor-pointer hover:bg-gray-150 transition-colors">
                <div className="text-center">
                  <Utensils className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">TAP TO PREVIEW</p>
                </div>
              </div>
              <span className="absolute top-3 right-3 bg-gray-800 text-white text-xs font-semibold px-2 py-1 rounded">
                OPTIONAL
              </span>
            </div>
          )}
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900">Menu / Price List</h3>
            <p className="text-sm text-gray-600">
              Help customers understand your pricing and offerings. PDF or JPG
              formats accepted.
            </p>
            <Button
              onClick={() => menuInputRef.current?.click()}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold"
            >
              <Utensils className="w-4 h-4 mr-2" />
              Upload Menu
            </Button>
          </div>
          <input
            ref={menuInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleMenuSelect}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
}
