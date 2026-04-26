"use client";

import { Switch } from "@/components/ui/switch";
import { useUpdateMapStatusMutation } from "@/redux/features/map/mapApi";
import { toast } from "sonner";

export type PurchasedMap = {
  id: string | number;
  title: string;
  badge: string;
  badgeColor: string;
  info: string;
  image: string;
  status: string;
  isActive: boolean;
  icon: any;
  iconColor: string;
};

export default function PurchasedMapsCard({ map }: { map: PurchasedMap }) {
  const [updateMapStatus, { isLoading }] = useUpdateMapStatusMutation();

  const handleToggle = async (checked: boolean) => {
    try {
      await updateMapStatus({
        id: map.id.toString(),
        data: { isActive: checked },
      }).unwrap();
      toast.success(checked ? "Map activated successfully!" : "Map deactivated successfully!");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update map status");
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 flex items-center gap-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group font-public-sans">
      {/* Map Image */}
      <div className="w-40 h-24 rounded-lg overflow-hidden shrink-0">
        <img
          src={map.image}
          alt={map.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Map Info */}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <map.icon size={16} className={map.iconColor} />
          <h3 className="text-lg font-black text-gray-900 tracking-tight">
            {map.title}
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`text-[10px] font-black px-2 py-0.5 leading-4 rounded-md ${map.badgeColor}`}
          >
            {map.badge}
          </span>

          <span className="text-sm text-gray-400 font-medium">
            • {map.info}
          </span>
        </div>
      </div>

      {/* Offline Status Toggle */}
      <div className="flex items-center gap-6 pr-4">
        <div className="text-right">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">
            Status
          </p>

          <Switch
            checked={map.isActive}
            onCheckedChange={handleToggle}
            disabled={isLoading}
            className="data-[state=checked]:bg-yellow-500 data-[state=unchecked]:bg-gray-200"
          />
        </div>
      </div>
    </div>
  );
}
