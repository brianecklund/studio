export type AssetStatus = "waiting" | "in-progress" | "completed";
export type AssetType = "folder" | "pdf" | "image" | "video" | "document" | "archive" | "other";

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
