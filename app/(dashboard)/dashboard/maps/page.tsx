"use client";

import CreateMapModal from "@/components/dashboard/maps/create-map-modal";
import { MapsTable } from "@/components/dashboard/maps/maps-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function Page() {
  const [open, setOpen] = useState(false);
  const [selectedMap, setSelectedMap] = useState<any>(null);

  const handleEditMap = (mapData: any) => {
    setSelectedMap(mapData);
    setOpen(true);
  };

  const handleOpenCreate = () => {
    setSelectedMap(null);
    setOpen(true);
  };

  return (
    <div className="bg-gray-100 min-h-screen ">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Maps</h1>

        <Button
          onClick={handleOpenCreate}
          className="bg-primary/80 hover:bg-primary text-black flex items-center gap-2"
        >
          <Plus size={16} />
          Create New Map
        </Button>
      </div>

      {/* Table */}
      <MapsTable onEditMap={handleEditMap} />

      <CreateMapModal 
        open={open} 
        setOpen={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) setSelectedMap(null);
        }} 
        initialData={selectedMap} 
      />
    </div>
  );
}
