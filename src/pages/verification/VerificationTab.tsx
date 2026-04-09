import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "../../global/utils/toast.utils";
import {
  type DocumentType,
  type PendingVerification,
  type VerificationDocument,
  type VerificationStatus,
  type VerificationStatusResponse,
  verificationService,
} from "./verificationService";

// ── Helpers ───────────────────────────────────────────────────────────────────

const BYTES_PER_MB = 1024 * 1024;

const STATUS_CONFIG: Record<
  VerificationStatus,
  { label: string; badgeCls: string; dotCls: string; description: string }
> = {
  LISTED: {
    label: "Listed",
    badgeCls: "bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-white/50",
    dotCls: "bg-gray-400",
    description:
      "Your shop is listed but not yet verified. Upload documents and request verification.",
  },
  REQ_FOR_VERIFICATION: {
    label: "Pending Review",
    badgeCls:
      "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
    dotCls: "bg-amber-500",
    description:
      "Your verification request is under review. We'll notify you once it's processed.",
  },
  VERIFIED: {
    label: "Verified",
    badgeCls:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
    dotCls: "bg-emerald-500",
    description:
      "Your shop is verified! A verified badge is now shown to customers.",
  },
  REJECTED: {
    label: "Rejected",
    badgeCls: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",
    dotCls: "bg-red-500",
    description:
      "Your verification request was rejected. Review the reason below and resubmit.",
  },
};

const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  BUSINESS_LICENSE: "Business License",
  TAX_CERTIFICATE: "Tax Certificate",
  OWNERSHIP_PROOF: "Ownership Proof",
  IDENTITY_PROOF: "Identity Proof",
  OTHER: "Other Document",
};

const ACCEPTED_FILE_TYPES = ".pdf,.jpg,.jpeg,.png";
const MAX_FILE_SIZE_MB = 5;

// ── Sub-components ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: VerificationStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${cfg.badgeCls}`}
    >
      <span className={`h-2 w-2 rounded-full ${cfg.dotCls}`} />
      {cfg.label}
    </span>
  );
}

// ── Main VerificationTab ──────────────────────────────────────────────────────

export default function VerificationTab({ shopId }: { shopId: number }) {
  const [statusData, setStatusData] =
    useState<VerificationStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [selectedDocType, setSelectedDocType] =
    useState<DocumentType>("BUSINESS_LICENSE");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await verificationService.getVerificationStatus(shopId);
      setStatusData(data);
    } catch {
      // No verification record yet — default to LISTED
      setStatusData({
        shopId,
        status: "LISTED",
        requestedAt: null,
        reviewedAt: null,
        reviewNotes: null,
        rejectionReason: null,
        documents: [],
      });
    } finally {
      setLoading(false);
    }
  }, [shopId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleFileSelect = (file: File) => {
    if (file.size > MAX_FILE_SIZE_MB * BYTES_PER_MB) {
      toast.error(`File must be smaller than ${MAX_FILE_SIZE_MB} MB`);
      return;
    }
    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    try {
      setUploading(true);
      await verificationService.uploadDocument(
        shopId,
        selectedFile,
        selectedDocType,
      );
      toast.success("Document uploaded successfully");
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      await load();
    } catch (err: any) {
      toast.error(err?.message || "Failed to upload document");
    } finally {
      setUploading(false);
    }
  };

  const handleRequestVerification = async () => {
    if (!statusData || (statusData.documents ?? []).length === 0) {
      toast.error(
        "Please upload at least one document before requesting verification",
      );
      return;
    }
    try {
      setRequesting(true);
      const updated = await verificationService.requestVerification(shopId);
      setStatusData(updated);
      toast.success("Verification request submitted successfully");
    } catch (err: any) {
      toast.error(err?.message || "Failed to submit verification request");
    } finally {
      setRequesting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
        <span className="ml-3 text-sm text-gray-500 dark:text-white/40">
          Loading verification status…
        </span>
      </div>
    );
  }

  const status = statusData?.status ?? "LISTED";
  const cfg = STATUS_CONFIG[status];
  const docs: VerificationDocument[] = statusData?.documents ?? [];
  const canRequestVerification = status === "LISTED" || status === "REJECTED";
  const canUpload = status !== "VERIFIED" && status !== "REQ_FOR_VERIFICATION";

  return (
    <div className="space-y-6">
      <div className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-white/30">
        Shop Verification
      </div>

      {/* Status Card */}
      <div className="rounded-xl border border-gray-100 dark:border-white/[0.06] bg-gray-50 dark:bg-white/[0.03] p-5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <StatusBadge status={status} />
            </div>
            <p className="text-sm text-gray-500 dark:text-white/40 max-w-md">
              {cfg.description}
            </p>

            {statusData?.requestedAt && (
              <p className="text-xs text-gray-400 dark:text-white/30">
                Requested:{" "}
                {new Date(statusData.requestedAt).toLocaleDateString()}
              </p>
            )}
            {statusData?.reviewedAt && (
              <p className="text-xs text-gray-400 dark:text-white/30">
                Reviewed: {new Date(statusData.reviewedAt).toLocaleDateString()}
              </p>
            )}
          </div>

  {/* Refresh button */}
      <button
        onClick={load}
        disabled={loading}
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 transition"
        title="Refresh verification status"
      >
        {loading ? (
          <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          <span>🔄</span>
        )}
      </button>
          {canRequestVerification && (
            <button
              onClick={handleRequestVerification}
              disabled={requesting || docs.length === 0}
              className="flex-shrink-0 flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:opacity-60 text-white text-sm font-semibold px-5 py-2.5 border-none cursor-pointer transition shadow-sm"
            >
              {requesting ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : null}
              {requesting ? "Submitting…" : "Request Verification"}
            </button>
          )}

          {/* Show success message when verified */}
          {status === "VERIFIED" && (
            <div className="flex-shrink-0 flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-semibold px-5 py-2.5">
              ✓ Verification Complete
            </div>
          )}
        </div>

        {/* Rejection reason */}
        {status === "REJECTED" && statusData?.rejectionReason && (
          <div className="mt-4 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 p-3">
            <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-1">
              Rejection Reason
            </p>
            <p className="text-sm text-red-700 dark:text-red-300">
              {statusData.rejectionReason}
            </p>
          </div>
        )}

        {/* Review notes */}
        {statusData?.reviewNotes && status === "VERIFIED" && (
          <div className="mt-4 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 p-3">
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
              Review Notes
            </p>
            <p className="text-sm text-emerald-700 dark:text-emerald-300">
              {statusData.reviewNotes}
            </p>
          </div>
        )}
      </div>

      {/* Document Upload */}
      {canUpload && (
        <div className="space-y-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-white/30">
            Upload Documents
          </div>

          {/* Document type selector */}
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={selectedDocType}
              onChange={(e) =>
                setSelectedDocType(e.target.value as DocumentType)
              }
              className="rounded-xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.04] text-gray-900 dark:text-white text-sm px-3.5 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
            >
              {(Object.keys(DOCUMENT_TYPE_LABELS) as DocumentType[]).map(
                (type) => (
                  <option key={type} value={type}>
                    {DOCUMENT_TYPE_LABELS[type]}
                  </option>
                ),
              )}
            </select>
          </div>

          {/* Drop zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              if (!dragOver) setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition ${
              dragOver
                ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10"
                : "border-gray-200 dark:border-white/[0.08] hover:border-blue-400 hover:bg-blue-50/50 dark:hover:border-blue-500/40 dark:hover:bg-blue-500/5"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_FILE_TYPES}
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelect(file);
              }}
            />
            <div className="text-3xl mb-2">📄</div>
            {selectedFile ? (
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-400 dark:text-white/30 mt-1">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-white/70">
                  Drop a file here or click to browse
                </p>
                <p className="text-xs text-gray-400 dark:text-white/30 mt-1">
                  PDF, JPG, PNG up to {MAX_FILE_SIZE_MB} MB
                </p>
              </div>
            )}
          </div>

          {selectedFile && (
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setSelectedFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="rounded-xl border border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.04] text-gray-600 dark:text-white/50 text-sm font-semibold px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/[0.08] transition"
              >
                Clear
              </button>
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:opacity-60 text-white text-sm font-semibold px-5 py-2 border-none cursor-pointer transition shadow-sm"
              >
                {uploading ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : null}
                {uploading ? "Uploading…" : "Upload Document"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Uploaded Documents List */}
      {docs.length > 0 && (
        <div className="space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-white/30">
            Uploaded Documents ({docs.length})
          </div>
          <div className="space-y-2">
            {docs.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between rounded-xl border border-gray-100 dark:border-white/[0.05] bg-gray-50 dark:bg-white/[0.03] px-4 py-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-lg flex-shrink-0">📎</span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {doc.fileName}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-white/30">
                      {DOCUMENT_TYPE_LABELS[doc.documentType]} ·{" "}
                      {new Date(doc.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {doc.fileUrl && (
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 ml-3 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {docs.length === 0 && !canUpload && (
        <p className="text-sm text-gray-400 dark:text-white/30 text-center py-4">
          No documents uploaded.
        </p>
      )}
    </div>
  );
}

// ── Admin: Pending Verifications Tab ─────────────────────────────────────────

export function PendingVerificationsTab() {
  const [pending, setPending] = useState<PendingVerification[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<PendingVerification | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [notes, setNotes] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [action, setAction] = useState<"approve" | "reject" | null>(null);
  const [statusDetail, setStatusDetail] =
    useState<VerificationStatusResponse | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await verificationService.getPendingVerifications();
      setPending(data);
    } catch (err: any) {
      toast.error(err?.message || "Failed to load pending verifications");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openModal = async (item: PendingVerification) => {
    setSelected(item);
    setNotes("");
    setRejectReason("");
    setAction(null);
    setStatusDetail(null);
    try {
      const detail = await verificationService.getVerificationStatus(
        item.shopId,
      );
      setStatusDetail(detail);
    } catch {
      // optional
    }
  };

  const closeModal = () => {
    setSelected(null);
    setStatusDetail(null);
    setAction(null);
  };

  const handleApprove = async () => {
    if (!selected) return;
    try {
      setModalLoading(true);
      await verificationService.approveVerification(selected.shopId, notes);
      toast.success(`${selected.shopName} has been verified`);
      closeModal();
      await load();
    } catch (err: any) {
      toast.error(err?.message || "Failed to approve verification");
    } finally {
      setModalLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selected || !rejectReason.trim()) {
      toast.error("Please enter a rejection reason");
      return;
    }
    try {
      setModalLoading(true);
      await verificationService.rejectVerification(
        selected.shopId,
        rejectReason.trim(),
      );
      toast.success(`Verification for ${selected.shopName} rejected`);
      closeModal();
      await load();
    } catch (err: any) {
      toast.error(err?.message || "Failed to reject verification");
    } finally {
      setModalLoading(false);
    }
  };

  const filtered = pending.filter(
    (p) =>
      p.shopName.toLowerCase().includes(search.toLowerCase()) ||
      (p.city ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Pending Verifications
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Review and approve shop verification requests
          </p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? "Loading…" : "Refresh"}
        </button>
      </div>

      <input
        className="mb-6 w-full max-w-sm rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:focus:border-blue-400 dark:focus:ring-blue-900"
        placeholder="Search by name or city…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          <span className="ml-3 text-sm text-slate-500">Loading…</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 py-12 text-center">
          <div className="text-4xl mb-3">✅</div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No pending verifications
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            All verification requests have been reviewed
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Shop
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  City
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Owner
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Docs
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Requested
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filtered.map((item) => (
                <tr
                  key={item.shopId}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <td className="px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white">
                    {item.shopName}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                    {item.city || "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                    {item.ownerName || "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                    {item.documentCount}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                    {new Date(item.requestedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                      Pending
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => openModal(item)}
                      className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800 transition-colors"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Review Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Review: {selected.shopName}
              </h3>
              <button
                onClick={closeModal}
                className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                ✕
              </button>
            </div>

            <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Shop info */}
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-4 space-y-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block">
                      City
                    </span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {selected.city || "—"}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block">
                      Owner
                    </span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {selected.ownerName || "—"}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block">
                      Phone
                    </span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {selected.phone || "—"}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block">
                      Documents
                    </span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {selected.documentCount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Documents list */}
              {statusDetail && (statusDetail.documents ?? []).length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Documents
                  </p>
                  {statusDetail.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {doc.fileName}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                          {DOCUMENT_TYPE_LABELS[doc.documentType] ??
                            doc.documentType.replace(/_/g, " ")}
                        </p>
                      </div>
                      {doc.fileUrl && (
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          View
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Action selection */}
              {!action && (
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setAction("approve")}
                    className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-2.5 border-none cursor-pointer transition"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => setAction("reject")}
                    className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-2.5 border-none cursor-pointer transition"
                  >
                    Reject
                  </button>
                </div>
              )}

              {/* Approve form */}
              {action === "approve" && (
                <div className="space-y-3">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Review Notes (optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Add notes for the shop owner…"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm px-3.5 py-2.5 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition resize-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => setAction(null)}
                      className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-semibold py-2.5 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleApprove}
                      disabled={modalLoading}
                      className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-sm font-semibold py-2.5 border-none cursor-pointer transition"
                    >
                      {modalLoading ? (
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      ) : null}
                      {modalLoading ? "Approving…" : "Confirm Approve"}
                    </button>
                  </div>
                </div>
              )}

              {/* Reject form */}
              {action === "reject" && (
                <div className="space-y-3">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Rejection Reason <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Explain why this verification is being rejected…"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm px-3.5 py-2.5 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition resize-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => setAction(null)}
                      className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-semibold py-2.5 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleReject}
                      disabled={modalLoading || !rejectReason.trim()}
                      className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-sm font-semibold py-2.5 border-none cursor-pointer transition"
                    >
                      {modalLoading ? (
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      ) : null}
                      {modalLoading ? "Rejecting…" : "Confirm Reject"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
