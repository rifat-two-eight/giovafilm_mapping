"use client";

import React, { useState, useEffect } from "react";
import { getSocket } from "@/lib/socket";
import { useGetProfileQuery } from "@/redux/features/user/userApi";
import { useGetMapsQuery } from "@/redux/features/map/mapApi";
import {
  useGetPromoLinksQuery,
  useBulkGeneratePromosMutation,
  useSendBulkEmailsMutation,
  useGetPromoStatsQuery,
  useDeletePromoLinkMutation,
} from "@/redux/features/promo/promoApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { appAlert } from "@/lib/app-alert";
import { env } from "@/lib/config";
import {
  Ticket,
  Search,
  Copy,
  Send,
  Calendar,
  Plus,
  CheckCircle,
  XCircle,
  FileSpreadsheet,
  RefreshCw,
  UserCheck,
  ArrowUpCircle,
  Settings,
  HelpCircle,
  Trash2,
  TrendingUp,
  Users,
} from "lucide-react";

type PromoType = "upgrade" | "influencer" | "custom";

export default function PromosPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [isUsedFilter, setIsUsedFilter] = useState("");
  const [mapFilter, setMapFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  // Generation form states
  const [promoType, setPromoType] = useState<PromoType>("upgrade");
  const [selectedMapId, setSelectedMapId] = useState("");
  const [price, setPrice] = useState<number>(5.0);
  const [label, setLabel] = useState("");
  const [emailsText, setEmailsText] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSendingEmails, setIsSendingEmails] = useState(false);

  // API Queries & Mutations
  const { data: user } = useGetProfileQuery({});
  const { data: mapsRes } = useGetMapsQuery({ limit: 100 });
  const maps = mapsRes?.data || [];

  const { data: statsRes, refetch: refetchStats } = useGetPromoStatsQuery();
  const [deletePromoLink] = useDeletePromoLinkMutation();

  const {
    data: promoRes,
    isLoading: isLoadingPromos,
    isFetching: isFetchingPromos,
    refetch: refetchPromos,
  } = useGetPromoLinksQuery({
    page,
    limit,
    searchTerm,
    isUsed: isUsedFilter,
    mapId: mapFilter,
    promoType: typeFilter,
  });

  const [bulkGeneratePromos] = useBulkGeneratePromosMutation();
  const [sendBulkEmails] = useSendBulkEmailsMutation();

  const promoLinks = promoRes?.data || [];
  const meta = promoRes?.meta;

  // Real-time socket listener for automated email status updates
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handlePromoEmailSent = () => {
      refetchPromos();
      refetchStats();
    };

    const handlePromoBulkComplete = () => {
      refetchPromos();
      refetchStats();
      setIsSendingEmails(false);
    };

    socket.on("promo_email_sent", handlePromoEmailSent);
    socket.on("promo_bulk_sent_complete", handlePromoBulkComplete);

    return () => {
      socket.off("promo_email_sent", handlePromoEmailSent);
      socket.off("promo_bulk_sent_complete", handlePromoBulkComplete);
    };
  }, [refetchPromos, refetchStats]);

  // Handle link type tab changes
  const handleTypeChange = (type: PromoType) => {
    setPromoType(type);
    if (type === "upgrade") {
      setPrice(5.0);
      setLabel("Existing Customer Map Upgrade");
    } else if (type === "influencer") {
      setPrice(0.0);
      setLabel("Influencer Campaign");
    } else {
      setPrice(10.0); // Default custom price
      setLabel("Special Map Offer");
    }
  };

  // Handle generation submission
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedMapId) {
      toast.error("Please select a target Map.");
      return;
    }

    if (!label.trim()) {
      toast.error("Please enter a campaign label.");
      return;
    }

    if (price < 0) {
      toast.error("Price must be 0 or positive.");
      return;
    }

    setIsGenerating(true);

    // Parse emails from text input — now required
    if (!emailsText.trim()) {
      toast.error("Please enter at least one recipient email.");
      setIsGenerating(false);
      return;
    }

    const emailsArray: string[] = emailsText
      .split(/[\n,]+/)
      .map((email) => email.trim())
      .filter((email) => email.length > 0 && email.includes("@"));

    if (emailsArray.length === 0) {
      toast.error("No valid emails found. Please check the format.");
      setIsGenerating(false);
      return;
    }

    try {
      const payload = {
        mapId: selectedMapId,
        price,
        promoType,
        label: label.trim(),
        emails: emailsArray,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
      };

      const result = await bulkGeneratePromos(payload).unwrap();
      toast.success(
        `Successfully generated ${result?.data?.length || "promo"} invitation link(s)!`
      );

      // Automatically trigger sending emails if target emails were provided
      if (emailsArray && emailsArray.length > 0 && result?.data && result.data.length > 0) {
        const promoIds = result.data.map((promo: any) => promo._id || promo.id);
        if (promoIds.length > 0) {
          try {
            setIsSendingEmails(true);
            await sendBulkEmails({ promoIds }).unwrap();
            toast.success(`Queued ${promoIds.length} invitation email(s) in the background!`);
            
            // Poll periodically to update table status automatically while background process executes
            let count = 0;
            const interval = setInterval(() => {
              count++;
              refetchPromos();
              refetchStats();
              if (count >= 6) {
                clearInterval(interval);
                setIsSendingEmails(false);
              }
            }, 2000);
          } catch (emailErr) {
            console.error("Auto email sending failed:", emailErr);
            toast.error("Links generated, but automatic email invitations failed to queue.");
            setIsSendingEmails(false);
          }
        }
      }

      // Reset fields
      setEmailsText("");
      setExpiresAt("");
      refetchPromos();
      refetchStats();
    } catch (error: any) {
      toast.error(
        error?.data?.message || error?.message || "Failed to generate promo links"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // Robust clipboard copy — works on HTTP+IP (no HTTPS required)
  // navigator.clipboard is blocked on non-secure origins (HTTP + non-localhost IP)
  const copyToClipboard = (text: string): boolean => {
    // Modern API — works on HTTPS or localhost
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch(() => {});
      return true;
    }
    // Fallback — works everywhere including HTTP + IP
    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.cssText = "position:fixed;top:0;left:0;opacity:0;pointer-events:none;";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const success = document.execCommand("copy");
      document.body.removeChild(textarea);
      return success;
    } catch {
      return false;
    }
  };

  // Copy claiming link to clipboard
  const handleCopyLink = (code: string) => {
    // Use NEXT_PUBLIC_CLIENT_URL so link is always correct regardless of what port dashboard runs on
    const origin = env.NEXT_PUBLIC_CLIENT_URL || (typeof window !== "undefined" ? window.location.origin : "");
    const claimUrl = `${origin}/claim-promo?code=${code}`;
    const ok = copyToClipboard(claimUrl);
    if (ok) {
      toast.success("Promo Claim Link copied to clipboard!");
    } else {
      toast.error("Copy failed — please copy manually: " + claimUrl);
    }
  };

  // Copy plain code to clipboard
  const handleCopyCode = (code: string) => {
    const ok = copyToClipboard(code);
    if (ok) {
      toast.success("Promo Code copied!");
    } else {
      toast.error("Copy failed — code: " + code);
    }
  };

  // Send invitation email
  const handleSendEmail = async (id: string) => {
    try {
      await sendBulkEmails({ promoIds: [id] }).unwrap();
      toast.success("Invitation email sent successfully!");
      refetchPromos();
      refetchStats();

      // Poll periodically to update table status automatically while email sends
      let count = 0;
      const interval = setInterval(() => {
        count++;
        refetchPromos();
        refetchStats();
        if (count >= 5) clearInterval(interval);
      }, 1500);
    } catch (error: any) {
      toast.error(
        error?.data?.message || error?.message || "Failed to send email"
      );
    }
  };

  // Delete invitation code
  const handleDelete = async (id: string) => {
    const result = await appAlert.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this promo invitation deletion!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deletePromoLink(id).unwrap();
        toast.success("Promo invitation link deleted successfully!");
        refetchPromos();
        refetchStats();
      } catch (error: any) {
        toast.error(
          error?.data?.message || error?.message || "Failed to delete promo link"
        );
      }
    }
  };

  // Bulk send emails to all visible pending/unused links in the table
  const handleSendAllEmails = async () => {
    const pendingIds = promoLinks
      .filter((promo: any) => !promo.isUsed && promo.recipientEmail && !promo.isEmailSent)
      .map((promo: any) => promo._id);

    if (pendingIds.length === 0) {
      toast.error("No pending links with unsent recipient emails found.");
      return;
    }

    try {
      setIsSendingEmails(true);
      await sendBulkEmails({ promoIds: pendingIds }).unwrap();
      toast.success(`Started sending ${pendingIds.length} emails in background!`);
      refetchPromos();
      refetchStats();

      // Poll periodically to update status badges automatically while background process executes
      let count = 0;
      const interval = setInterval(() => {
        count++;
        refetchPromos();
        refetchStats();
        if (count >= 8) {
          clearInterval(interval);
          setIsSendingEmails(false);
        }
      }, 2000);
    } catch (error: any) {
      setIsSendingEmails(false);
      toast.error(
        error?.data?.message || error?.message || "Failed to trigger bulk emails"
      );
    }
  };

  // Export promo links list as CSV file (Blob + UTF-8 BOM for perfect Excel/Sheets support)
  const handleExportCSV = () => {
    if (promoLinks.length === 0) {
      toast.error("No links available to export.");
      return;
    }

    // Use NEXT_PUBLIC_CLIENT_URL so exported claim URLs are always correct
    const origin = env.NEXT_PUBLIC_CLIENT_URL || (typeof window !== "undefined" ? window.location.origin : "");
    const headers = [
      "Promo Code",
      "Claim URL",
      "Type",
      "Map Name",
      "Price (USD)",
      "Label",
      "Recipient Email",
      "Email Status",
      "Claim Status",
      "Claimed By",
      "Claimed At",
      "Expiry Date",
    ];

    const escapeCsv = (val: any) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = promoLinks.map((promo: any) => {
      const isExpired = promo.expiresAt && new Date(promo.expiresAt) < new Date();
      const emailStatus = !promo.recipientEmail
        ? "N/A (Generic)"
        : promo.isEmailSent
        ? "Email Sent"
        : "Pending Send";

      const claimStatus = promo.isUsed
        ? "Claimed"
        : isExpired
        ? "Expired"
        : "Active / Unclaimed";

      return [
        escapeCsv(promo.code),
        escapeCsv(`${origin}/claim-promo?code=${promo.code}`),
        escapeCsv(promo.promoType || "upgrade"),
        escapeCsv(promo.mapId?.name || "N/A"),
        escapeCsv(`$${promo.price.toFixed(2)}`),
        escapeCsv(promo.label),
        escapeCsv(promo.recipientEmail || "Generic/None"),
        escapeCsv(emailStatus),
        escapeCsv(claimStatus),
        escapeCsv(promo.usedBy?.email || "N/A"),
        escapeCsv(promo.usedAt ? new Date(promo.usedAt).toLocaleString() : "N/A"),
        escapeCsv(promo.expiresAt ? new Date(promo.expiresAt).toLocaleDateString() : "Never"),
      ];
    });

    const csvString = [headers.map(escapeCsv).join(","), ...rows.map((r: any) => r.join(","))].join("\n");
    
    // Add UTF-8 BOM for Excel compatibility
    const blob = new Blob(["\uFEFF" + csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Promo_Links_Export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Promo links exported to CSV successfully!");
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
            <Ticket className="w-8 h-8 text-primary" /> Promo & Invitation Links
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Differentiate and manage unique invitation codes for influencers and customer upgrades.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleExportCSV}
            variant="outline"
            className="flex items-center gap-2 border-gray-300 hover:bg-gray-50 rounded-xl"
          >
            <FileSpreadsheet size={16} /> Export CSV
          </Button>
          <Button
            onClick={() => {
              refetchPromos();
              refetchStats();
            }}
            variant="outline"
            className="flex items-center gap-2 border-gray-300 hover:bg-gray-50 rounded-xl"
          >
            <RefreshCw size={16} className={isFetchingPromos ? "animate-spin" : ""} /> Refresh
          </Button>
        </div>
      </div>

      {/* Promo Stats Cards */}
      {statsRes?.data && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Promo Invites */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-gray-400">Total Generated</span>
              <h3 className="text-2xl font-black text-gray-900">{statsRes.data.total}</h3>
              <p className="text-[10px] text-gray-500">invitation codes in system</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
              <Ticket size={24} />
            </div>
          </div>

          {/* Card 2: Old Customer Upgrades ($5) */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-gray-400">Customer Upgrades</span>
              <h3 className="text-2xl font-black text-gray-900">{statsRes.data.upgrade}</h3>
              <p className="text-[10px] text-gray-500">upgrade links generated</p>
            </div>
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
              <ArrowUpCircle size={24} />
            </div>
          </div>

          {/* Card 3: Influencer Invites ($0) */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-gray-400">Influencer Invites</span>
              <h3 className="text-2xl font-black text-gray-900">{statsRes.data.influencer}</h3>
              <p className="text-[10px] text-gray-500">free guest passes in system</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
              <UserCheck size={24} />
            </div>
          </div>

          {/* Card 4: Conversion Rate / Claims */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-gray-400">Claimed & Redeemed</span>
              <h3 className="text-2xl font-black text-emerald-600">
                {statsRes.data.used} <span className="text-xs font-bold text-gray-400">({Math.round((statsRes.data.used / (statsRes.data.total || 1)) * 100)}%)</span>
              </h3>
              <p className="text-[10px] text-gray-500">{statsRes.data.unused} codes active/unused</p>
            </div>
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
              <TrendingUp size={24} />
            </div>
          </div>
        </div>
      )}

      {/* Guide/Helper Info Box */}
      <div className="bg-blue-50/50 rounded-2xl border border-blue-100 p-5 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-blue-900">
        <div className="space-y-1">
          <h4 className="font-bold flex items-center gap-1.5 text-blue-950">
            <HelpCircle size={14} className="text-blue-600" /> 1. Distinguish Invites
          </h4>
          <p className="text-blue-800 leading-relaxed">
            Use the <strong>Link Type Tabs</strong> to choose between Influencers (locked to $0) and Customers (locked to $5). The campaign label helps you filter them later in the list.
          </p>
        </div>
        <div className="space-y-1">
          <h4 className="font-bold flex items-center gap-1.5 text-blue-950">
            <Send size={14} className="text-blue-600" /> 2. Bulk Invitation Flow
          </h4>
          <p className="text-blue-800 leading-relaxed">
            Paste your list of emails into the recipient emails textarea. Click <strong>Generate Links</strong> to create one unique secure link for each email.
          </p>
        </div>
        <div className="space-y-1">
          <h4 className="font-bold flex items-center gap-1.5 text-blue-950">
            <CheckCircle size={14} className="text-blue-600" /> 3. Sending and Tracking
          </h4>
          <p className="text-blue-800 leading-relaxed">
            Click <strong>Send Pending Invites</strong> to trigger automatic background emails. In the list, you can see both the sent recipient email and who claimed it.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Bulk Generator Card Form */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 lg:col-span-1 h-fit space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Plus size={20} className="text-primary" /> Generate Invitation
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Select invitation type to automatically pre-configure rules.
            </p>
          </div>

          {/* Link Type Tab Switchers */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-gray-100 rounded-2xl">
            <button
              type="button"
              onClick={() => handleTypeChange("upgrade")}
              className={`py-2 text-[10px] md:text-xs font-bold rounded-xl transition-all ${promoType === "upgrade"
                  ? "bg-white text-black shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
                }`}
            >
              Customer ($5)
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange("influencer")}
              className={`py-2 text-[10px] md:text-xs font-bold rounded-xl transition-all ${promoType === "influencer"
                  ? "bg-white text-black shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
                }`}
            >
              Influencer ($0)
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange("custom")}
              className={`py-2 text-[10px] md:text-xs font-bold rounded-xl transition-all ${promoType === "custom"
                  ? "bg-white text-black shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
                }`}
            >
              Custom Offer
            </button>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4 pt-2">
            {/* Target Map Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase">Target Map *</label>
              <select
                required
                value={selectedMapId}
                onChange={(e) => setSelectedMapId(e.target.value)}
                className="w-full h-10 px-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm bg-white"
              >
                <option value="">-- Select Road Trip Map --</option>
                {maps.map((map: any) => (
                  <option key={map._id} value={map._id}>
                    {map.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price (Enabled only for custom) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase">Price (USD) *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                <Input
                  required
                  type="number"
                  step="0.01"
                  min="0"
                  disabled={promoType !== "custom"}
                  placeholder="e.g. 5.00"
                  value={price}
                  onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                  className={`pl-7 h-10 rounded-xl ${promoType !== "custom" ? "bg-gray-50 text-gray-500 cursor-not-allowed" : ""
                    }`}
                />
              </div>
              <p className="text-[10px] text-gray-400 leading-tight">
                {promoType === "upgrade" && "Price locked to $5.00 for standard customer upgrades."}
                {promoType === "influencer" && "Price locked to $0.00 for free influencer invites."}
                {promoType === "custom" && "Modify target price for custom marketing bundles."}
              </p>
            </div>

            {/* Label */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase">Label / Campaign *</label>
              <Input
                required
                type="text"
                placeholder="e.g. Sarah VLOG Campaign, Batch 1 Upgrades"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="h-10 rounded-xl"
              />
            </div>

            {/* Target Emails Textarea — Live UX */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-700 uppercase">Target Emails *</label>
                {/* Live email counter badge */}
                {emailsText.trim() && (() => {
                  const parsed = emailsText
                    .split(/[\n,]+/)
                    .map(e => e.trim())
                    .filter(e => e.length > 0);
                  const valid = parsed.filter(e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
                  const invalid = parsed.length - valid.length;
                  return (
                    <div className="flex items-center gap-1.5">
                      {valid.length > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                          ✓ {valid.length} valid
                        </span>
                      )}
                      {invalid > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-red-50 text-red-600 border border-red-100">
                          ✗ {invalid} invalid
                        </span>
                      )}
                    </div>
                  );
                })()}
              </div>
              <textarea
                required
                placeholder={`Paste emails separated by commas or new lines. E.g.\ninfluencer@domain.com\ncustomer@gmail.com`}
                value={emailsText}
                onChange={(e) => setEmailsText(e.target.value)}
                rows={4}
                className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 text-sm bg-white transition-colors duration-200 ${
                  !emailsText.trim()
                    ? "border-gray-300 focus:ring-primary/50"
                    : (() => {
                        const valid = emailsText.split(/[\n,]+/).map(e => e.trim()).filter(e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
                        return valid.length > 0
                          ? "border-emerald-400 focus:ring-emerald-400/40 bg-emerald-50/30"
                          : "border-red-400 focus:ring-red-400/40 bg-red-50/30";
                      })()
                }`}
              />
              <p className={`text-[10px] leading-tight transition-colors ${
                !emailsText.trim()
                  ? "text-gray-400"
                  : (() => {
                      const valid = emailsText.split(/[\n,]+/).map(e => e.trim()).filter(e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
                      return valid.length > 0 ? "text-emerald-600 font-medium" : "text-red-500 font-medium";
                    })()
              }`}>
                {!emailsText.trim()
                  ? "Enter at least one recipient email to generate invitation links."
                  : (() => {
                      const parsed = emailsText.split(/[\n,]+/).map(e => e.trim()).filter(e => e.length > 0);
                      const valid = parsed.filter(e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
                      if (valid.length === 0) return "No valid emails detected. Check format: name@domain.com";
                      if (valid.length === parsed.length) return `✓ ${valid.length} invitation${valid.length > 1 ? "s" : ""} ready to generate.`;
                      return `✓ ${valid.length} valid — ${parsed.length - valid.length} will be skipped (invalid format).`;
                    })()
                }
              </p>
            </div>



            {/* Expiry Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase flex items-center gap-1">
                <Calendar size={12} /> Expiration Date (Optional)
              </label>
              <Input
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="h-10 rounded-xl"
              />
            </div>

            <Button
              type="submit"
              disabled={isGenerating}
              className="w-full h-10 bg-primary hover:bg-primary/90 text-black font-extrabold rounded-xl transition-all shadow-sm mt-4"
            >
              {isGenerating ? "Processing..." : "Generate Links"}
            </Button>
          </form>
        </div>

        {/* Tracking Table list */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 lg:col-span-2 flex flex-col space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Track Invitations</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Distinguish influencer passes from customer upgrades in real-time.
              </p>
            </div>
            {(() => {
              const pendingCount = isSendingEmails
                ? 0
                : promoLinks.filter(
                    (promo: any) => !promo.isUsed && promo.recipientEmail && !promo.isEmailSent
                  ).length;

              const isDisabled = pendingCount === 0 || isSendingEmails;

              return (
                <Button
                  onClick={handleSendAllEmails}
                  disabled={isDisabled}
                  className={`text-xs px-4 py-2 rounded-xl flex items-center gap-2 h-9 self-end md:self-auto font-bold transition-all ${
                    !isDisabled
                      ? "bg-amber-400 hover:bg-amber-500 text-black shadow-sm"
                      : "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed opacity-60"
                  }`}
                  title={
                    isSendingEmails
                      ? "Sending invitation emails in background..."
                      : pendingCount > 0
                      ? `Send background email to ${pendingCount} pending recipient(s)`
                      : "No pending emails to send in current list"
                  }
                >
                  <Send size={13} className={isSendingEmails ? "animate-spin text-gray-400" : pendingCount > 0 ? "animate-pulse" : ""} />
                  <span>{isSendingEmails ? "Sending Invites..." : "Send Pending Invites"}</span>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-black rounded-full ${
                      !isDisabled
                        ? "bg-black/10 text-black"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {isSendingEmails ? "..." : pendingCount}
                  </span>
                </Button>
              );
            })()}
          </div>

          {/* Table Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-2xl">
            {/* Search */}
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search code, email, label..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="pl-10 h-10 rounded-xl bg-white border-gray-200"
              />
            </div>

            {/* Filter by Type */}
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setPage(1);
              }}
              className="h-10 px-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-xs bg-white"
            >
              <option value="">All invitation types</option>
              <option value="upgrade">Customer Upgrade ($5)</option>
              <option value="influencer">Influencer Pass ($0)</option>
              <option value="custom">Custom Offer</option>
            </select>

            {/* Filter by Used status */}
            <select
              value={isUsedFilter}
              onChange={(e) => {
                setIsUsedFilter(e.target.value);
                setPage(1);
              }}
              className="h-10 px-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-xs bg-white"
            >
              <option value="">All statuses</option>
              <option value="false">Active / Unused</option>
              <option value="true">Used / Claimed</option>
            </select>
          </div>

          {/* Table Grid */}
          <div className="overflow-x-auto border border-gray-100 rounded-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">
                  <th className="p-4">Link / Code</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Target Map</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Label</th>
                  <th className="p-4">Recipient & Claimant</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Invite</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                {isLoadingPromos ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-gray-400">
                      Loading details...
                    </td>
                  </tr>
                ) : promoLinks.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-gray-400">
                      No matching records found.
                    </td>
                  </tr>
                ) : (
                  promoLinks.map((promo: any) => {
                    const isExpired =
                      promo.expiresAt && new Date(promo.expiresAt) < new Date();
                    const isPendingEmail = !promo.isUsed && promo.recipientEmail && !promo.isEmailSent && !isExpired;
                    const isEmailSent = !promo.isUsed && promo.recipientEmail && promo.isEmailSent && !isExpired;

                    return (
                      <tr
                        key={promo._id}
                        className={`transition-colors ${
                          isPendingEmail
                            ? "bg-amber-50/30 hover:bg-amber-50/50"
                            : isEmailSent
                            ? "bg-blue-50/10 hover:bg-blue-50/30"
                            : "hover:bg-gray-50/30"
                        }`}
                      >
                        <td className="p-4 font-mono font-bold text-xs">
                          <div className="flex flex-col gap-1">
                            <span className="text-gray-900">{promo.code}</span>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleCopyLink(promo.code)}
                                className="text-[10px] text-primary hover:underline flex items-center gap-0.5"
                                title="Copy full claim URL"
                              >
                                <Copy size={10} /> URL
                              </button>
                              <span className="text-gray-300">|</span>
                              <button
                                onClick={() => handleCopyCode(promo.code)}
                                className="text-[10px] text-gray-400 hover:text-gray-600 flex items-center gap-0.5"
                                title="Copy code"
                              >
                                <Copy size={10} /> Code
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          {promo.promoType === "influencer" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-extrabold rounded-xl bg-purple-50 text-purple-700 border border-purple-100">
                              <UserCheck size={10} /> Influencer
                            </span>
                          ) : promo.promoType === "upgrade" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-extrabold rounded-xl bg-blue-50 text-blue-700 border border-blue-100">
                              <ArrowUpCircle size={10} /> Customer ($5)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-extrabold rounded-xl bg-gray-50 text-gray-700 border border-gray-200">
                              <Settings size={10} /> Custom Offer
                            </span>
                          )}
                        </td>
                        <td className="p-4 font-bold text-gray-900">
                          {promo.mapId?.name || "N/A"}
                        </td>
                        <td className="p-4 font-bold text-gray-900">
                          ${promo.price.toFixed(2)}
                        </td>
                        <td className="p-4 max-w-[100px] truncate" title={promo.label}>
                          {promo.label}
                        </td>
                        <td className="p-4 max-w-[200px] truncate">
                          <div className="flex flex-col gap-1 items-start">
                            <span className="text-gray-900 font-semibold" title={promo.recipientEmail || "Generic (No email)"}>
                              {promo.recipientEmail || "Generic (No email)"}
                            </span>
                            {isPendingEmail && (
                              <span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded-full border border-amber-200">
                                <Send size={9} /> Pending Email Send
                              </span>
                            )}
                            {isEmailSent && (
                              <span className="inline-flex items-center gap-1 text-[9px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                                <CheckCircle size={9} /> Email Sent
                              </span>
                            )}
                            {promo.isUsed && promo.usedBy?.email && (
                              <span className="text-[10px] text-gray-400 font-medium" title={`Claimed by: ${promo.usedBy.email}`}>
                                ↳ Claimed: {promo.usedBy.email}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          {promo.isUsed ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-extrabold rounded-full bg-green-50 text-green-700 border border-green-200">
                              <CheckCircle size={10} /> Claimed
                            </span>
                          ) : isExpired ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-extrabold rounded-full bg-red-50 text-red-700 border border-red-200">
                              <XCircle size={10} /> Expired
                            </span>
                          ) : isPendingEmail ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-extrabold rounded-full bg-amber-100/80 text-amber-800 border border-amber-300">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> Pending Send
                            </span>
                          ) : isEmailSent ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-extrabold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                              <Send size={10} className="text-blue-600" /> Email Sent
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Active
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {promo.recipientEmail && !promo.isUsed && !isExpired && (
                              <button
                                onClick={() => handleSendEmail(promo._id)}
                                className={`p-1.5 transition-colors rounded-lg ${
                                  isPendingEmail
                                    ? "text-amber-600 hover:text-amber-700 hover:bg-amber-100"
                                    : "text-gray-400 hover:text-primary hover:bg-gray-100"
                                }`}
                                title={isEmailSent ? "Resend Email Invitation" : "Send Email Invitation"}
                              >
                                <Send size={14} />
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(promo._id)}
                              className="p-1.5 text-gray-500 hover:text-red-600 transition-colors hover:bg-red-50 rounded-lg"
                              title="Delete Invitation Link"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <span className="text-[10px] md:text-xs text-gray-500">
                Page {page} of {meta.totalPages} ({meta.total} total)
              </span>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-gray-300 text-xs px-3"
                >
                  Previous
                </Button>
                <Button
                  onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                  disabled={page === meta.totalPages}
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-gray-300 text-xs px-3"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
