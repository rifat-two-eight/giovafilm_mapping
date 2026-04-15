"use client";

import { Phone } from "lucide-react";

export default function PublicContactLinks({ contact }: any) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Phone size={20} className="text-blue-600" />
        <h2 className="text-xl font-bold text-gray-900">
          Public Contact & Links
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Public Phone
          </p>
          <p className="text-gray-900 font-medium mt-2">
            {contact.publicPhone}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Public Email
          </p>
          <p className="text-gray-900 font-medium mt-2">{contact.contactEmail}</p>
        </div>

        <div className="col-span-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Social Profiles
          </p>

          {/* <div className="flex gap-3">
            {contact.socialProfiles.map((profile: string) => (
              <span
                key={profile}
                className="bg-gray-100 px-3 py-1 rounded text-sm text-gray-700"
              >
                {profile}
              </span>
            ))}
          </div> */}
        </div>
      </div>
    </div>
  );
}
