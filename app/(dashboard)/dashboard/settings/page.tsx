import { BillingSettings } from "@/components/dashboard/settings/billing-settings";
import { GeneralSettings } from "@/components/dashboard/settings/general-settings";
import { NotificationSettings } from "@/components/dashboard/settings/notifications-settings";

export default function page() {
  return (
    <div className="min-h-screen ">
      {/* Header */}

      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Settings</h1>

      <div className="space-y-6">
        {/* <GeneralSettings /> */}

        <NotificationSettings />

        {/* <SecuritySettings /> */}

        {/* <BillingSettings /> */}
      </div>
    </div>
  );
}
