"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { X } from "lucide-react";
import {
  Landmark,
  MountainSnow,
  Trees,
  Umbrella,
  Utensils,
  Waves,
} from "lucide-react";

export const CATEGORIES = [
  {
    id: "beaches",
    label: "Beaches",
    icon: Umbrella,
    color: "#2196F3",
    defaultEnabled: true,
  },
  {
    id: "restaurants",
    label: "Restaurants",
    icon: Utensils,
    color: "#F44336",
    defaultEnabled: true,
  },
  {
    id: "parks",
    label: "Parks",
    icon: Trees,
    color: "#4CAF50",
    defaultEnabled: false,
  },
  {
    id: "rivers",
    label: "Rivers",
    icon: Waves,
    color: "#03A9F4",
    defaultEnabled: true,
  },
  {
    id: "caves",
    label: "Caves",
    icon: MountainSnow,
    color: "#795548",
    defaultEnabled: false,
  },
  {
    id: "landmarks",
    label: "Landmarks",
    icon: Landmark,
    color: "#9C27B0",
    defaultEnabled: true,
  },
];

interface Props {
  onClose: () => void;
  enabledCategories: Record<string, boolean>;
  onToggle: (id: string, value: boolean) => void;
  onShowResults: () => void;
}

export default function MapCategoriesPanel({
  onClose,
  enabledCategories,
  onToggle,
  onShowResults,
}: Props) {
  return (
    <div className="w-[230px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <span className="text-base font-bold text-gray-900">
          Map Categories
        </span>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
        >
          <X size={16} />
        </button>
      </div>

      <div className="px-3 py-2 space-y-1">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const enabled = enabledCategories[cat.id] ?? cat.defaultEnabled;

          return (
            <div
              key={cat.id}
              className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: cat.color }}
              >
                <Icon size={17} color="#fff" strokeWidth={2.2} />
              </div>

              <span className="flex-1 text-sm font-medium text-gray-800">
                {cat.label}
              </span>

              <Switch
                checked={enabled}
                onCheckedChange={(val) => onToggle(cat.id, val)}
                className="data-[state=checked]:bg-amber-400 data-[state=unchecked]:bg-gray-300"
              />
            </div>
          );
        })}
      </div>

      <div className="p-3 border-t border-gray-100">
        <Button
          onClick={onShowResults}
          className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold text-sm rounded-xl py-2.5 h-auto"
        >
          Show results
        </Button>
      </div>
    </div>
  );
}
