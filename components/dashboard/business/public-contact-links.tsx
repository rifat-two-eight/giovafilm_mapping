"use client";

import { Phone } from "lucide-react";
import { toExternalUrl, toInstagramUrl } from "./business-links";

import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function PublicContactLinks({
  contact,
  email,
}: {
  contact?: {
    phone?: string;
    website?: string;
    instagram?: string;
    email?: string;
  } | null;
  email?: string;
}) {
  const { t } = useLanguage();
  const websiteUrl = toExternalUrl(contact?.website);
  const instagramUrl = toInstagramUrl(contact?.instagram);
  const publicEmail = email || contact?.email;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Phone size={20} className="text-blue-600" />
        <h2 className="text-xl font-bold text-gray-900">
          {t("place.contact_and_links")}
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            {t("business_admin.public_phone")}
          </p>
          <p className="text-gray-900 font-medium mt-2">
            {contact?.phone || "N/A"}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            {t("business_admin.contact_email")}
          </p>
          <p className="text-gray-900 font-medium mt-2">
            {publicEmail || "N/A"}
          </p>
        </div>

        <div className="overflow-hidden min-w-0">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            {t("business_admin.website")}
          </p>
          {websiteUrl ? (
            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline font-medium mt-2 block truncate max-w-full"
            >
              {contact?.website} ↗
            </a>
          ) : (
            <p className="text-gray-500 font-medium mt-2">N/A</p>
          )}
        </div>

        <div className="overflow-hidden min-w-0">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            {t("place.instagram")}
          </p>
          {instagramUrl ? (
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline font-medium mt-2 block truncate max-w-full"
            >
              {contact?.instagram} ↗
            </a>
          ) : (
            <p className="text-gray-500 font-medium mt-2">N/A</p>
          )}
        </div>
      </div>
    </div>
  );
}
