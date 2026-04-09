const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

function getToken() {
  try {
    return (
      localStorage.getItem("token") ||
      JSON.parse(localStorage.getItem("sajilo-auth") || "{}")?.state?.token ||
      ""
    );
  } catch {
    return "";
  }
}

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    let message = "Request failed";
    try {
      const data = await response.json();
      message = data.message || data.error || JSON.stringify(data);
    } catch {
      try {
        message = await response.text();
      } catch {
        message = "Request failed";
      }
    }
    throw new Error(message);
  }

  if (response.status === 204) return {} as T;
  try {
    return await response.json();
  } catch {
    return {} as T;
  }
}

// ── Types ─────────────────────────────────────────────────────────────────────

export type VerificationStatus = "LISTED" | "REQ_FOR_VERIFICATION" | "VERIFIED" | "REJECTED";

export type DocumentType =
  | "BUSINESS_LICENSE"
  | "TAX_CERTIFICATE"
  | "OWNERSHIP_PROOF"
  | "IDENTITY_PROOF"
  | "OTHER";

export interface VerificationDocument {
  id: number;
  shopId: number;
  documentType: DocumentType;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
}

// ── IMPORTANT: Map backend response to frontend interface ──────────────────

export interface VerificationStatusResponse {
  shopId: number;
  status: VerificationStatus;
  requestedAt: string | null;
  reviewedAt: string | null;
  reviewNotes: string | null;
  rejectionReason: string | null;
  documents: VerificationDocument[];
}

// Backend response structure
interface BackendVerificationResponse {
  shopId: number;
  verificationStatus: VerificationStatus;
  verificationRequestedAt: string | null;
  verifiedAt: string | null;
  verificationNotes: string | null;
  rejectionReason: string | null;
  documents: VerificationDocument[];
}

// Mapper function to convert backend response to frontend interface
function mapBackendResponse(data: any): VerificationStatusResponse {
  return {
    shopId: data.shopId,
    status: data.verificationStatus || "LISTED",
    requestedAt: data.verificationRequestedAt,
    reviewedAt: data.verifiedAt,
    reviewNotes: data.verificationNotes,
    rejectionReason: data.rejectionReason,
    documents: data.documents || [],
  };
}

// ── Service ───────────────────────────────────────────────────────────────────

export const verificationService = {
  /** Upload a document for a shop (multipart/form-data) */
  async uploadDocument(shopId: number, file: File, documentType: DocumentType): Promise<VerificationDocument> {
    const token = getToken();
    const form = new FormData();
    form.append("file", file);
    form.append("documentType", documentType);

    const response = await fetch(`${API_BASE}/api/shop/verification/${shopId}/documents`, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: form,
    });

    if (!response.ok) {
      let message = "Upload failed";
      try {
        const data = await response.json();
        message = data.message || data.error || JSON.stringify(data);
      } catch {
        try {
          message = await response.text();
        } catch {
          message = "Upload failed";
        }
      }
      throw new Error(message);
    }

    return response.json();
  },

  /** Get all uploaded documents for a shop */
  getDocuments(shopId: number): Promise<VerificationDocument[]> {
    return apiFetch<VerificationDocument[]>(`/api/shop/verification/${shopId}/documents`);
  },

  /** Request verification for a shop */
  async requestVerification(shopId: number): Promise<VerificationStatusResponse> {
    const response = await apiFetch<BackendVerificationResponse>(`/api/shop/verification/${shopId}/request`, {
      method: "POST",
    });
    return mapBackendResponse(response);
  },

  /** Get verification status for a shop */
  async getVerificationStatus(shopId: number): Promise<VerificationStatusResponse> {
    const response = await apiFetch<BackendVerificationResponse>(`/api/shop/verification/${shopId}/status`);
    return mapBackendResponse(response);
  },

  /** [Admin] Get all pending verifications */
  getPendingVerifications(): Promise<PendingVerification[]> {
    return apiFetch<PendingVerification[]>("/api/superadmin/verification/pending");
  },

  /** [Admin] Approve a shop verification */
  async approveVerification(shopId: number, notes?: string): Promise<VerificationStatusResponse> {
    const response = await apiFetch<BackendVerificationResponse>(`/api/superadmin/verification/${shopId}/approve`, {
      method: "POST",
      body: JSON.stringify({ notes: notes || "" }),
    });
    return mapBackendResponse(response);
  },

  /** [Admin] Reject a shop verification */
  async rejectVerification(shopId: number, reason: string): Promise<VerificationStatusResponse> {
    const response = await apiFetch<BackendVerificationResponse>(`/api/superadmin/verification/${shopId}/reject`, {
      method: "POST",
      body: JSON.stringify({ notes: reason }),
    });
    return mapBackendResponse(response);
  },
};

export interface PendingVerification {
  shopId: number;
  shopName: string;
  city: string | null;
  phone: string | null;
  ownerName: string | null;
  requestedAt: string;
  documentCount: number;
  status: VerificationStatus;
}

export default verificationService;