
'use client';

import AssetViewer from '@/components/dashboard/asset-viewer';
import NewAssetRequestForm from '@/components/dashboard/new-asset-request-form';
import AiSuggestionModal from '@/components/dashboard/ai-suggestion-modal';
import DownloadKitModal from '@/components/dashboard/download-kit-modal';
import { Button } from '@/components/ui/button';
import { FilePlus2, Lightbulb, Archive } from 'lucide-react';
import type { Asset, ClientSubmittedRequest } from '@/lib/types';
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { mockClientAssets } from '@/lib/mock-data'; // Import to get one client's assets

// Initial mock data - only use the assets from one client for the dashboard
const initialMockAssets: Asset[] = mockClientAssets['bk001']?.assets || [];


export default function DashboardPage() {
  const [assets, setAssets] = useState<Asset[]>(initialMockAssets);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  
  // Effect to ensure client-side state initialization if needed for complex scenarios
  // For now, direct useState initialization is fine.
  // useEffect(() => {
  //   setAssets(initialMockAssets);
  // }, []);


  const currentBrandKitContent = assets.map(asset => `${asset.name} (${asset.type})`).join(', ');
  const previousRequestsSummary = "Client previously requested a new logo variant and social media templates for Instagram.";

  const handleDownloadConfirm = (selectedAssets: Asset[]) => {
    console.log("Downloading selected assets:", selectedAssets.map(a => a.name));
    toast({
      title: "Download Started (Mock)",
      description: `Preparing a ZIP file with ${selectedAssets.length} selected items.`,
    });
    setIsDownloadModalOpen(false);
  };

  const handleAssetUpdateRequest = (assetId: string, requestData: ClientSubmittedRequest) => {
    setAssets(prevAssets =>
      prevAssets.map(asset =>
        asset.id === assetId
          ? {
              ...asset,
              clientLastRequest: requestData,
              clientRequestDetails: requestData.details, // Also store main details here for admin view
              needsAttention: true,
              status: 'waiting',
              lastModified: new Date().toISOString(),
            }
          : asset
      )
    );
    // In a real app, you'd also send this update to the backend.
  };


  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="font-headline text-3xl font-bold">Your Brand Kit</h1>
        <div className="flex gap-2 flex-wrap justify-center sm:justify-end">
          <NewAssetRequestForm triggerButton={
            <Button>
              <FilePlus2 className="mr-2 h-4 w-4" /> New Asset Request
            </Button>
          } />
          <AiSuggestionModal 
            currentBrandKitContent={currentBrandKitContent} 
            previousRequests={previousRequestsSummary}
            triggerButton={
              <Button variant="outline">
                <Lightbulb className="mr-2 h-4 w-4" /> Get AI Suggestions
              </Button>
            }
          />
          <Button variant="outline" onClick={() => setIsDownloadModalOpen(true)}>
            <Archive className="mr-2 h-4 w-4" /> Download Kit
          </Button>
        </div>
      </div>
      <AssetViewer 
        assets={assets} 
        onUpdateRequestSubmit={handleAssetUpdateRequest}
      />
      <DownloadKitModal
        isOpen={isDownloadModalOpen}
        onOpenChange={setIsDownloadModalOpen}
        assets={assets}
        onDownloadConfirm={handleDownloadConfirm}
      />
    </div>
  );
}
