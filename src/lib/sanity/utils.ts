
import type { Asset as LocalAsset, AssetVersion as LocalAssetVersion, ClientSubmittedRequest, SanityImageObject, SanityFileObject } from '@/lib/types';
import { urlForImage } from './client';

// Define a more specific type for Sanity asset documents from fetch
export interface FetchedSanityAsset {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  name?: string;
  slug?: { current: string };
  assetType?: LocalAsset['type'];
  path?: string;
  status?: LocalAsset['status'];
  needsAttention?: boolean;
  file?: SanityFileObject;
  previewImage?: SanityImageObject; // Sanity image object
  parentFolder?: { _ref: string; _type: 'reference' };
  clientRequestDetails?: string;
  versions?: FetchedSanityAssetVersion[];
  dataAiHint?: string;
}

export interface FetchedSanityAssetVersion {
  _key: string; // Sanity array item key
  _type: 'assetVersion';
  versionNumber?: number;
  uploadedAt?: string;
  uploadedBy?: string;
  notes?: string;
  file?: SanityFileObject;
  previewImage?: SanityImageObject; // if a version can have its own specific preview
  dataAiHint?: string;
}


export function mapSanityAssetToLocal(sa: FetchedSanityAsset): LocalAsset {
  const sizeInBytes = sa.file?.asset?.size;
  let formattedSize = 'N/A';
  if (typeof sizeInBytes === 'number') {
    if (sizeInBytes < 1024) formattedSize = `${sizeInBytes} B`;
    else if (sizeInBytes < 1024 * 1024) formattedSize = `${(sizeInBytes / 1024).toFixed(1)} KB`;
    else formattedSize = `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  let localPreviewUrl: string | undefined = undefined;
  if (sa.assetType === 'image' && sa.file?.asset?.url) {
    localPreviewUrl = urlForImage(sa.file as SanityImageObject).width(100).height(100).fit('crop').url();
  } else if (sa.previewImage) {
    localPreviewUrl = urlForImage(sa.previewImage).width(100).height(100).fit('crop').url();
  } else if (sa.assetType !== 'folder' && sa.assetType) {
    localPreviewUrl = `https://placehold.co/100x100.png?text=${sa.assetType}`;
  }


  let clientLastRequestMock: ClientSubmittedRequest | null = null;
  if (sa.needsAttention && sa.clientRequestDetails) {
    clientLastRequestMock = {
      details: sa.clientRequestDetails,
      submittedAt: sa.status === 'waiting' ? new Date().toISOString() : new Date(Date.now() - 86400000).toISOString(),
    };
  }

  return {
    id: sa._id,
    _id: sa._id,
    _createdAt: sa._createdAt,
    name: sa.name || sa.file?.asset?.originalFilename || 'Untitled Asset',
    slug: sa.slug ? { _type: 'slug', current: sa.slug.current } : undefined,
    type: sa.assetType || 'other',
    path: sa.path || '/',
    status: sa.status || 'waiting',
    needsAttention: sa.needsAttention || false,
    lastModified: sa._updatedAt || sa._createdAt,
    size: formattedSize,
    downloadUrl: sa.file?.asset?.url,
    previewUrl: localPreviewUrl,
    parentFolder: sa.parentFolder ? { _ref: sa.parentFolder._ref, _type: 'reference' } : undefined,
    createdAt: sa._createdAt,
    clientRequestDetails: sa.clientRequestDetails,
    clientLastRequest: clientLastRequestMock, // This is still mock, real data would need to be structured in Sanity
    versions: sa.versions?.map(v => mapSanityVersionToLocal(v, sa.assetType)) || [],
    dataAiHint: sa.dataAiHint || sa.assetType || 'asset',
    rawFile: sa.file,
    rawPreviewImage: sa.previewImage,
  };
}

function mapSanityVersionToLocal(sv: FetchedSanityAssetVersion, assetType?: LocalAsset['type']): LocalAssetVersion {
  const sizeInBytes = sv.file?.asset?.size;
  let formattedSize = 'N/A';
  if (typeof sizeInBytes === 'number') {
    if (sizeInBytes < 1024) formattedSize = `${sizeInBytes} B`;
    else if (sizeInBytes < 1024 * 1024) formattedSize = `${(sizeInBytes / 1024).toFixed(1)} KB`;
    else formattedSize = `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  let versionPreviewUrl: string | undefined = undefined;
  if (assetType === 'image' && sv.file?.asset?.url) {
    versionPreviewUrl = urlForImage(sv.file as SanityImageObject).width(100).height(100).fit('crop').url();
  } else if (sv.previewImage) {
     versionPreviewUrl = urlForImage(sv.previewImage).width(100).height(100).fit('crop').url();
  } else if (assetType !== 'folder' && assetType){
     versionPreviewUrl = `https://placehold.co/32x32.png?text=v${sv.versionNumber || ''}`;
  }


  return {
    id: sv._key, // Use Sanity's array key as a unique ID for the version object
    versionNumber: sv.versionNumber || 0,
    uploadedAt: sv.uploadedAt || new Date().toISOString(),
    uploadedBy: sv.uploadedBy || 'N/A',
    notes: sv.notes,
    fileName: sv.file?.asset?.originalFilename || 'version_file',
    fileSize: formattedSize,
    downloadUrl: sv.file?.asset?.url || '#',
    previewUrl: versionPreviewUrl,
    dataAiHint: sv.dataAiHint || assetType || 'version',
    _id: sv._key, // For internal use if needed
    file: sv.file,
    previewImage: sv.previewImage,
  };
}

export function buildAssetTree(assets: LocalAsset[]): LocalAsset[] {
  const assetMap: { [id: string]: LocalAsset } = {};
  const roots: LocalAsset[] = [];

  for (const asset of assets) {
    assetMap[asset.id] = { ...asset, children: [] };
  }

  for (const assetId in assetMap) {
    const asset = assetMap[assetId];
    if (asset.parentFolder?._ref && assetMap[asset.parentFolder._ref]) {
      const parent = assetMap[asset.parentFolder._ref];
      if (parent.type === 'folder') { // Ensure parent is a folder
         if (!parent.children) {
            parent.children = [];
         }
         parent.children.push(asset);
      } else {
        // Parent isn't a folder, so this asset becomes a root (or handle error)
        roots.push(asset);
      }
    } else {
      roots.push(asset);
    }
  }
  return roots;
}
