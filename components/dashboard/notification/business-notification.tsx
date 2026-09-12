import {
  Gift,
  AlertCircle,
  CheckCircle,
  Wallet,
  Briefcase,
} from "lucide-react";
import { ReviewNotificationCard } from "./review-notification-card";
import { BusinessNotificationCard } from "./business-notification-card";

import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function BusinessNotification() {
  const { t } = useLanguage();
  const businessNotifications = [
    {
      icon: Gift,
      title: "New Offer Request",
      description: "Cafe Mocha wants to publish a 20% discount.",
      timestamp: "10 minutes ago",
      iconBgColor: "bg-purple-500",
    },
    {
      icon: AlertCircle,
      title: "Low Inventory Warning",
      description: "Tickets for 'SF Food Tour' are below threshold.",
      timestamp: "45 minutes ago",
      iconBgColor: "bg-red-500",
    },
    {
      icon: CheckCircle,
      title: "Verification Request",
      description: "'Wild West Tours' submitted documents.",
      timestamp: "3 hours ago",
      iconBgColor: "bg-green-500",
    },
    {
      icon: Wallet,
      title: "Payout Completed",
      description: "$1,250.00 transferred to Road Trip Co.",
      timestamp: "5 hours ago",
      iconBgColor: "bg-blue-500",
    },
  ];
  return (
    <div className="">
      <div className="mb-6 flex items-center gap-2">
        <Briefcase size={24} className="text-[#3B82F6]" />
        <h1 className="text-xl font-bold text-black font-inter">
          {t("notifications_page.business_notifications")}
        </h1>
      </div>
      <div className="space-y-4">
        {businessNotifications.map((notification, index) => {
          const Icon = notification.icon;

          return (
            <BusinessNotificationCard
              key={index}
              icon={<Icon size={20} className="text-white" />}
              title={notification.title}
              description={notification.description}
              timestamp={notification.timestamp}
              iconBgColor={notification.iconBgColor}
            />
          );
        })}
      </div>
    </div>
  );
}
