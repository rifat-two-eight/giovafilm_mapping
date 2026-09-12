"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const Toggle = ({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (value: boolean) => void;
}) => (
  <button
    onClick={() => onChange(!enabled)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
      enabled ? "bg-yellow-400" : "bg-gray-300"
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
        enabled ? "translate-x-6" : "translate-x-1"
      }`}
    />
  </button>
);

export function NotificationSettings() {
  const { t } = useLanguage();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        {t("notifications_page.notification_settings")}
      </h3>

      <div className="space-y-4">
        {/* Email Notifications */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <span className="text-gray-700">{t("notifications_page.email_notifications")}</span>
          <Toggle
            enabled={emailNotifications}
            onChange={setEmailNotifications}
          />
        </div>

        {/* Push Notifications */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <span className="text-gray-700">{t("notifications_page.push_notifications")}</span>
          <Toggle enabled={pushNotifications} onChange={setPushNotifications} />
        </div>

        {/* Customize Link */}
        <div className="pt-2">
          <a
            href="#"
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            {t("notifications_page.customize_alerts")}
          </a>
        </div>
      </div>
    </div>
  );
}
