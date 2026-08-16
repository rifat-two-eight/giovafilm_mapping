"use client";

import { useEffect, useRef, useState } from "react";
import { useUpdateBusinessMutation } from "@/redux/features/business/businessApi";
import { toast } from "sonner";
import { CheckCircle2, Loader2 } from "lucide-react";

type AdminReview = {
  phoneVerified?: boolean;
  websiteFunctional?: boolean;
  locationPinVerified?: boolean;
  mediaUploaded?: boolean;
  internalNotes?: string;
};

type ReviewCheckKey = "phoneVerified" | "websiteFunctional" | "mediaUploaded";

const TASKS: { key: ReviewCheckKey; label: string }[] = [
  { key: "phoneVerified", label: "Phone number verified" },
  { key: "websiteFunctional", label: "Website links functional" },
  { key: "mediaUploaded", label: "Media content uploaded" },
];

export default function AdminReviewTasks({
  businessId,
  review,
}: {
  businessId: string;
  review?: AdminReview | null;
}) {
  const [updateBusiness] = useUpdateBusinessMutation();
  const [checks, setChecks] = useState<AdminReview>({
    phoneVerified: !!review?.phoneVerified,
    websiteFunctional: !!review?.websiteFunctional,
    locationPinVerified: !!review?.locationPinVerified,
    mediaUploaded: !!review?.mediaUploaded,
    internalNotes: review?.internalNotes || "",
  });
  const [notes, setNotes] = useState(review?.internalNotes || "");
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [notesStatus, setNotesStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [notesDirty, setNotesDirty] = useState(false);
  const notesDirtyRef = useRef(false);

  useEffect(() => {
    setChecks((prev) => ({
      ...prev,
      phoneVerified: !!review?.phoneVerified,
      websiteFunctional: !!review?.websiteFunctional,
      locationPinVerified: !!review?.locationPinVerified,
      mediaUploaded: !!review?.mediaUploaded,
    }));
    if (!notesDirtyRef.current) {
      setNotes(review?.internalNotes || "");
      setNotesDirty(false);
    }
  }, [review]);

  const persist = async (next: AdminReview) => {
    const formData = new FormData();
    formData.append("data", JSON.stringify({ adminReview: next }));
    await updateBusiness({ id: businessId, data: formData }).unwrap();
  };

  const handleCheck = async (key: ReviewCheckKey, checked: boolean) => {
    const previous = checks;
    const next = { ...checks, [key]: checked, internalNotes: notes };
    setChecks(next);
    setSavingKey(key);
    try {
      await persist(next);
    } catch (error) {
      setChecks(previous);
      const message =
        error && typeof error === "object" && "data" in error
          ? (error as { data?: { message?: string } }).data?.message
          : undefined;
      toast.error(message || "Could not update this task");
    } finally {
      setSavingKey(null);
    }
  };

  const saveNotes = async (value: string) => {
    if (!businessId) return;
    const next = { ...checks, internalNotes: value };
    setNotesStatus("saving");
    try {
      await persist(next);
      setChecks(next);
      notesDirtyRef.current = false;
      setNotesDirty(false);
      setNotesStatus("saved");
      setTimeout(() => setNotesStatus("idle"), 1600);
    } catch (error) {
      setNotesStatus("idle");
      const message =
        error && typeof error === "object" && "data" in error
          ? (error as { data?: { message?: string } }).data?.message
          : undefined;
      toast.error(message || "Could not save notes");
    }
  };

  const handleNotesChange = (value: string) => {
    notesDirtyRef.current = true;
    setNotesDirty(true);
    setNotes(value);
    setNotesStatus("idle");
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-1">
        Admin Review Tasks
      </h2>
      <p className="text-xs text-gray-500 mb-6">
        Changes save automatically
      </p>

      <div className="space-y-3">
        <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2.5">
          <span className="text-sm text-gray-700">Location pin verified</span>
          <span
            className={`text-xs font-semibold ${
              checks.locationPinVerified ? "text-green-600" : "text-gray-400"
            }`}
          >
            {checks.locationPinVerified ? "Verified" : "Use the switch above"}
          </span>
        </div>

        {TASKS.map((task) => (
          <label
            key={task.key}
            className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 hover:bg-gray-50 cursor-pointer"
          >
            <span className="text-sm text-gray-700">{task.label}</span>
            <span className="flex items-center gap-2">
              {savingKey === task.key && (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-gray-400" />
              )}
              <input
                type="checkbox"
                checked={Boolean(checks[task.key])}
                disabled={savingKey === task.key}
                onChange={(e) => handleCheck(task.key, e.target.checked)}
                className="h-4 w-4 accent-blue-600"
              />
            </span>
          </label>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-sm font-semibold text-gray-900">Internal notes</p>
        <p className="text-xs text-gray-500 mt-0.5 mb-3">
          Private. The business owner cannot see this.
        </p>

        <div className="rounded-xl border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
          <textarea
            value={notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            placeholder="Write a note for your team..."
            spellCheck={false}
            autoComplete="off"
            data-gramm="false"
            data-gramm_editor="false"
            data-enable-grammarly="false"
            className="w-full min-h-[96px] resize-none border-0 p-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
            rows={3}
          />
          <div className="flex items-center justify-between gap-3 px-3 py-2 bg-gray-50 border-t border-gray-200">
            <span className="text-xs text-gray-500">
              {notesStatus === "saving" && "Saving..."}
              {notesStatus === "saved" && (
                <span className="inline-flex items-center gap-1 text-green-600">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Saved
                </span>
              )}
              {notesStatus === "idle" && notesDirty && "Unsaved changes"}
              {notesStatus === "idle" && !notesDirty && " "}
            </span>
            <button
              type="button"
              disabled={!notesDirty || notesStatus === "saving"}
              onClick={() => void saveNotes(notes)}
              className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Save note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
