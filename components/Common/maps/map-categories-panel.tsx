import { X } from "lucide-react";
import { getCategoryColor, getCategoryIcon } from "./map";
import { Switch } from "@/components/ui/switch";

// ─── Map Categories Panel ─────────────────────────────────────────────────────
interface MapCategoriesPanelProps {
  onClose: () => void;
  categories: any[];
  enabledCategories: Record<string, boolean>;
  onToggle: (id: string, value: boolean) => void;
}

export function MapCategoriesPanel({
  onClose,
  categories,
  enabledCategories,
  onToggle,
}: MapCategoriesPanelProps) {
  return (
    <div className="w-[230px] bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[60vh]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-shrink-0">
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

      {/* Category list */}
      <div className="px-3 py-2 space-y-1 overflow-y-auto">
        {categories.map((cat) => {
          const Icon = getCategoryIcon(cat.name);
          const color = getCategoryColor(cat.name);
          const enabled = enabledCategories[cat._id] ?? true;
          return (
            <div
              key={cat._id}
              className={`flex items-center gap-3 px-2 py-2.5 rounded-xl transition-colors ${
                enabled ? "" : "hover:bg-gray-50 text-gray-800"
              }`}
            >
              {/* Colored icon circle */}
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: color }}
              >
                <Icon size={17} color="#fff" strokeWidth={2.2} />
              </div>

              {/* Label */}
              <span className="flex-1 text-sm font-medium capitalize truncate">
                {cat.name}
              </span>

              {/* Toggle — yellow when on, gray when off */}
              <Switch
                checked={enabled}
                onCheckedChange={(val) => onToggle(cat._id, val)}
                className={`${enabled ? "bg-primary" : "bg-gray-300"} data-[state=checked]:bg-amber-400 data-[state=unchecked]:bg-gray-300`}
              />
            </div>
          );
        })}
        {categories.length === 0 && (
          <div className="text-sm text-gray-500 text-center py-4">
            No categories found.
          </div>
        )}
      </div>
    </div>
  );
}
