
export type AssetStatus = "waiting" | "in-progress" | "completed";
export type AssetType = "folder" | "pdf" | "image" | "video" | "document" | "archive" | "other";

export interface SanitySlug {
  _type: 'slug';
  current: string;
}

export interface SanityReference {
  _ref: string;
  _type: 'reference';
}

export interface SanityImageObject {
  _type: 'image';
  asset: SanityReference;
  hotspot?: any;
  crop?: any;
}

export interface SanityFileObject {
  _type: 'file';
  asset: SanityReference & {
    url: string;
    originalFilename?: string;
    size?: number;
    mimeType?: string;
  };
}


export interface AssetVersion {
  id: string; // Sanity _id or unique generated ID for the version object
  versionNumber: number;
  uploadedAt: string; // ISO date string
  uploadedBy: string; // User name or ID
  notes?: string;
  fileName: string;
  fileSize: string;
  downloadUrl: string;
  previewUrl?: string; // Optional preview for the specific version
  dataAiHint?: string;
  // Sanity specific fields if needed for mapping
  _id?: string;
  file?: SanityFileObject;
  previewImage?: SanityImageObject;
}

export interface ClientSubmittedRequest {
  details: string;
  referenceFileNames?: string[]; // Store names of uploaded files
  requestedDelivery?: string; // Store as ISO string or formatted string
  submittedAt: string; // ISO date string
}

export interface Asset {
  id: string; // Sanity _id
  _id: string; // Sanity _id
  _createdAt: string; // Sanity _createdAt
  name: string;
  slug?: SanitySlug;
  type: AssetType;
  path: string; // e.g., "/Logos/Primary/"
  status: AssetStatus;
  needsAttention: boolean;
  lastModified: string; // ISO date string (Sanity _updatedAt or derived)
  size?: string; // e.g., "2.5 MB"
  downloadUrl?: string; // only for files
  previewUrl?: string; // only for files, e.g. image preview
  children?: Asset[]; // For folders
  createdAt: string; // ISO date string (Sanity _createdAt)
  dataAiHint?: string;
  clientRequestDetails?: string; // General details, or admin notes regarding client request
  versions?: AssetVersion[]; // Version history for the asset
  clientLastRequest?: ClientSubmittedRequest | null; // Stores the latest client request
  parentFolder?: SanityReference; // Reference to parent asset document if it's a folder

  // Raw Sanity source objects if needed for direct use or re-mapping
  rawFile?: SanityFileObject;
  rawPreviewImage?: SanityImageObject;
}

export interface Client {
  _id: string;
  _type: 'client';
  name?: string;
  slug?: SanitySlug;
  clientEmail?: string;
  status?: 'active' | 'inactive' | 'pending';
  industry?: string;
  logo?: SanityImageObject;
  adminNotes?: string;
  assetCount?: number; // For dashboard display
}


export interface BrandKit {
  _id: string;
  _type: 'brandKit';
  client?: SanityReference;
  kitName?: string;
  // Assets are typically queried based on client or kit reference, not stored directly as an array of full asset docs here.
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
  clientId: string; // This is the kitId or client _id
  lastModified: string;
}
