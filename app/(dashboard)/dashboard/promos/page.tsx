"use client";

import React, { useState } from "react";
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
  const [linksCount, setLinksCount] = useState<number>(1);
  const [expiresAt, setExpiresAt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

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

    // Parse emails from text input
    let emailsArray: string[] | undefined = undefined;
    if (emailsText.trim()) {
      emailsArray = emailsText
        .split(/[\n,]+/)
        .map((email) => email.trim())
        .filter((email) => email.length > 0 && email.includes("@"));
    }

    try {
      const payload = {
        mapId: selectedMapId,
        price,
        promoType,
        label: label.trim(),
        emails: emailsArray,
        count: emailsArray ? undefined : linksCount,
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
            await sendBulkEmails({ promoIds }).unwrap();
            toast.success(`Queued ${promoIds.length} invitation emails in the background!`);
          } catch (emailErr) {
            console.error("Auto email sending failed:", emailErr);
            toast.error("Links generated, but automatic email invitations failed to queue.");
          }
        }
      }

      // Reset fields
      setEmailsText("");
      setLinksCount(1);
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

  // Copy claiming link to clipboard
  const handleCopyLink = (code: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const claimUrl = `${origin}/claim-promo?code=${code}`;
    navigator.clipboard.writeText(claimUrl);
    toast.success("Promo Claim Link copied to clipboard!");
  };

  // Copy plain code to clipboard
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Promo Code copied!");
  };

  // Send invitation email
  const handleSendEmail = async (id: string) => {
    try {
      await sendBulkEmails({ promoIds: [id] }).unwrap();
      toast.success("Invitation email sent successfully!");
      refetchPromos();
      refetchStats();
    } catch (error: any) {
      toast.error(
        error?.data?.message || error?.message || "Failed to send email"
      );
    }
  };

  // Delete invitation code
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this promo invitation? This action cannot be undone.")) {
      return;
    }

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
  };

  // Bulk send emails to all visible pending/unused links in the table
  const handleSendAllEmails = async () => {
    const pendingIds = promoLinks
      .filter((promo: any) => !promo.isUsed && promo.recipientEmail)
      .map((promo: any) => promo._id);

    if (pendingIds.length === 0) {
      toast.error("No pending links with recipient emails found to send.");
      return;
    }

    try {
      await sendBulkEmails({ promoIds: pendingIds }).unwrap();
      toast.success(`Started sending ${pendingIds.length} emails in background!`);
      refetchPromos();
      refetchStats();
    } catch (error: any) {
      toast.error(
        error?.data?.message || error?.message || "Failed to trigger bulk emails"
      );
    }
  };

  // Export promo links list as CSV file
  const handleExportCSV = () => {
    if (promoLinks.length === 0) {
      toast.error("No links available to export.");
      return;
    }

    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const headers = [
      "Promo Code",
      "Claim URL",
      "Type",
      "Map Name",
      "Price (USD)",
      "Label",
      "Recipient Email",
      "Used Status",
      "Claimed By",
      "Claimed At",
      "Expiry Date",
    ];

    const rows = promoLinks.map((promo: any) => [
      promo.code,
      `${origin}/claim-promo?code=${promo.code}`,
      promo.promoType || "upgrade",
      promo.mapId?.name || "N/A",
      `$${promo.price.toFixed(2)}`,
      `"${promo.label.replace(/"/g, '""')}"`,
      promo.recipientEmail || "Generic/None",
      promo.isUsed ? "Used" : "Active",
      promo.usedBy?.email || "N/A",
      promo.usedAt ? new Date(promo.usedAt).toLocaleString() : "N/A",
      promo.expiresAt ? new Date(promo.expiresAt).toLocaleDateString() : "Never",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r: any) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Promo_Links_Export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
              className={`py-2 text-[10px] md:text-xs font-bold rounded-xl transition-all ${
                promoType === "upgrade"
                  ? "bg-white text-black shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Customer ($5)
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange("influencer")}
              className={`py-2 text-[10px] md:text-xs font-bold rounded-xl transition-all ${
                promoType === "influencer"
                  ? "bg-white text-black shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Influencer ($0)
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange("custom")}
              className={`py-2 text-[10px] md:text-xs font-bold rounded-xl transition-all ${
                promoType === "custom"
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
                  className={`pl-7 h-10 rounded-xl ${
                    promoType !== "custom" ? "bg-gray-50 text-gray-500 cursor-not-allowed" : ""
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

            {/* Target Emails Textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase">Target Emails (Optional)</label>
              <textarea
                placeholder="Paste emails separated by commas or new lines. E.g.
influencer@domain.com
customer@gmail.com"
                value={emailsText}
                onChange={(e) => setEmailsText(e.target.value)}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm bg-white"
              />
              <p className="text-[10px] text-gray-400 leading-tight">
                Enter emails to automatically send email invites. If left blank, generic links will be generated below.
              </p>
            </div>

            {/* Quantity */}
            {!emailsText.trim() && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase">Quantity of Links</label>
                <Input
                  type="number"
                  min="1"
                  max="5000"
                  value={linksCount}
                  onChange={(e) => setLinksCount(parseInt(e.target.value) || 1)}
                  className="h-10 rounded-xl"
                />
              </div>
            )}

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
            {promoLinks.length > 0 && (
              <Button
                onClick={handleSendAllEmails}
                className="bg-primary/80 hover:bg-primary text-black font-semibold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 h-9 self-end md:self-auto"
              >
                <Send size={12} /> Send Pending Invites
              </Button>
            )}
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

                    return (
                      <tr key={promo._id} className="hover:bg-gray-50/30">
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
                          <div className="flex flex-col gap-0.5">
                            <span className="text-gray-900 font-semibold" title={promo.recipientEmail || "Generic (No email)"}>
                              {promo.recipientEmail || "Generic (No email)"}
                            </span>
                            {promo.isUsed && promo.usedBy?.email && (
                              <span className="text-[10px] text-gray-400 font-medium" title={`Claimed by: ${promo.usedBy.email}`}>
                                ↳ Claimed: {promo.usedBy.email}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          {promo.isUsed ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-green-50 text-green-700">
                              <CheckCircle size={10} /> Claimed
                            </span>
                          ) : isExpired ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-red-50 text-red-700">
                              <XCircle size={10} /> Expired
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-700">
                              Active
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {promo.recipientEmail && !promo.isUsed && !isExpired && (
                              <button
                                onClick={() => handleSendEmail(promo._id)}
                                className="p-1.5 text-gray-500 hover:text-primary transition-colors hover:bg-gray-100 rounded-lg"
                                title="Send Email Invitation"
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
