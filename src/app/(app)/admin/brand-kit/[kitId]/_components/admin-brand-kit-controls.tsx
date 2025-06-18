
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Edit, UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AssetViewer from '@/components/dashboard/asset-viewer'; // Re-import if needed, or remove if AssetViewer is direct child of page
import AdminAttentionRequestModal from '@/components/admin/admin-attention-request-modal';
import AssetVersionHistoryModal from '@/components/admin/asset-version-history-modal';
import type { Asset } from '@/lib/types';

interface AdminBrandKitControlsProps {
  initialAssets: Asset[]; // Passed from server component
  clientName: string;
}

export default function AdminBrandKitControls({ initialAssets, clientName }: AdminBrandKitControlsProps) {
  // State for assets if they need to be modified on client (e.g. after an upload)
  // For now, we assume assets are primarily managed via Sanity and refetched.
  // const [assets, setAssets] = useState<Asset[]>(initialAssets);

  const [selectedAssetForAttention, setSelectedAssetForAttention] = useState<Asset | null>(null);
  const [isAttentionModalOpen, setIsAttentionModalOpen] = useState(false);
  const [selectedAssetForVersions, setSelectedAssetForVersions] = useState<Asset | null>(null);
  const [isVersionsModalOpen, setIsVersionsModalOpen] = useState(false);

  const handleAttentionIconClick = (asset: Asset) => {
    setSelectedAssetForAttention(asset);
    setIsAttentionModalOpen(true);
  };

  const handleViewVersionsClick = (asset: Asset) => {
    setSelectedAssetForVersions(asset);
    setIsVersionsModalOpen(true);
  };
  
  // Dummy submit function to satisfy AssetViewer prop if needed by client-side logic
  // In a real Sanity-backed app, updates often trigger re-fetches or use Sanity's real-time updates.
  const handleDummyUpdateRequestSubmit = (assetId: string, requestData: any) => {
    console.log("Update request submitted (client-side mock handler for admin view):", assetId, requestData);
    // Potentially update local state or show a toast
  };


  return (
    <>
      <div className="flex gap-2 flex-wrap justify-start sm:justify-end">
        <Button variant="outline" disabled> {/* Edit Kit Details functionality to be implemented */}
          <Edit className="mr-2 h-4 w-4" /> Edit Kit Details
        </Button>
        <Button disabled> {/* Upload New Asset functionality to be implemented, likely via Sanity Studio or custom form */}
          <UploadCloud className="mr-2 h-4 w-4" /> Upload New Asset
        </Button>
      </div>
      
      {/* 
        The AssetViewer component is now directly in the page.tsx.
        If AssetViewer were here, it would look like:
        <AssetViewer 
          assets={initialAssets} // or `assets` if state managed here
          onAttentionIconClick={handleAttentionIconClick}
          onViewVersionsClick={handleViewVersionsClick}
          onUpdateRequestSubmit={handleDummyUpdateRequestSubmit} // Provide a dummy or no-op for admin view
        /> 
      */}


      <AdminAttentionRequestModal 
        asset={selectedAssetForAttention}
        isOpen={isAttentionModalOpen}
        onOpenChange={setIsAttentionModalOpen}
      />

      <AssetVersionHistoryModal
        asset={selectedAssetForVersions}
        isOpen={isVersionsModalOpen}
        onOpenChange={setIsVersionsModalOpen}
      />
    </>
  );
}
