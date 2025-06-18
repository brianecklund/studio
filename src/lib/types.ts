

export type AssetStatus = "waiting" | "in-progress" | "completed";
export type AssetType = "folder" | "pdf" | "image" | "video" | "document" | "archive" | "other";

export interface AssetVersion {
  id: string;
  versionNumber: number;
  uploadedAt: string; // ISO date string
  uploadedBy: string; // User name or ID
  notes?: string;
  fileName: string;
  fileSize: string;
  downloadUrl: string;
  previewUrl?: string; // Optional preview for the specific version
  dataAiHint?: string;
}

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  path: string; // e.g., "/Logos/Primary/"
  status: AssetStatus;
  needsAttention: boolean;
  lastModified: string; // ISO date string
  size?: string; // e.g., "2.5 MB"
  downloadUrl?: string; // only for files
  previewUrl?: string; // only for files, e.g. image preview
  children?: Asset[]; // For folders
  createdAt: string; // ISO date string
  dataAiHint?: string;
  clientRequestDetails?: string; // Details from client for attention items
  versions?: AssetVersion[]; // Version history for the asset
}

export interface Client {
  id: string;
  name: string;
  brandKitId: string;
}

export interface BrandKit {
  id: string;
  clientId: string;
  assets: Asset[];
  // Could include overall brand guidelines, color palettes etc.
  // For now, focuses on assets.
}

export interface ProjectRequest {
  id: string;
  assetId?: string; // For updates to existing assets
  projectName: string;
  description: string;
  type: "update" | "new";
  status: "pending" | "approved" | "in-progress" | "completed" | "rejected";
  requestedBy: string; // Client user ID
  createdAt: string;
  updatedAt: string;
}

// For AI Suggestions
export interface AISuggestionInput {
  previousRequests: string;
  currentBrandKitContent: string;
}

export interface AISuggestion {
  id: string;
  assetName: string;
  reasoning: string;
  category?: string;
}

// For Admin Attention Items Overlay
export interface AttentionItem {
  assetId: string;
  assetName: string;
  assetType: AssetType;
  clientName: string;
  clientId: string; // This is the kitId
  lastModified: string;
  // Potentially add 'requestSummary' or link to specific request if that data exists
}

