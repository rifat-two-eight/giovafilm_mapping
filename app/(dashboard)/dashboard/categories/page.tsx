"use client";

import { AddCategoryDialog } from "@/components/dashboard/categories/AddCategoryDialog";
import { CategoryTable } from "@/components/dashboard/categories/category-table";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function Page() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [isViewMode, setIsViewMode] = useState(false);

  const handleCreate = () => {
    setSelectedCategory(null);
    setIsViewMode(false);
    setIsDialogOpen(true);
  };

  const handleEdit = (category: any) => {
    setSelectedCategory(category);
    setIsViewMode(false);
    setIsDialogOpen(true);
  };

  const handleView = (category: any) => {
    setSelectedCategory(category);
    setIsViewMode(true);
    setIsDialogOpen(true);
  };

  return (
    <div className="">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-primary/80 px-4 py-2 rounded-lg hover:bg-primary transition-colors font-medium"
        >
          <Plus size={20} />
          Add Categories
        </button>
      </div>

      {/* Table */}
      <CategoryTable onEdit={handleEdit} onView={handleView} />

      <AddCategoryDialog 
        open={isDialogOpen} 
        onOpenChange={(isOpen) => {
          setIsDialogOpen(isOpen);
          if (!isOpen) {
            setSelectedCategory(null);
            setIsViewMode(false);
          }
        }} 
        initialData={selectedCategory}
        isView={isViewMode}
      />
    </div>
  );
}
