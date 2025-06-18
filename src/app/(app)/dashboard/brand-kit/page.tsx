
'use client'; // This page will remain a client component for now due to its stateful nature with modals and local updates

import AssetViewer from '@/components/dashboard/asset-viewer';
import NewAssetRequestForm from '@/components/dashboard/new-asset-request-form';
import AiSuggestionModal from '@/components/dashboard/ai-suggestion-modal';
import DownloadKitModal from '@/components/dashboard/download-kit-modal';
import { Button } from '@/components/ui/button';
import { FilePlus2, Lightbulb, Archive, ArrowLeft, Loader2 } from 'lucide-react';
import type { Asset, ClientSubmittedRequest } from '@/lib/types';
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';

import { client as sanityClient } from '@/lib/sanity/client';
import { mapSanityAssetToLocal, buildAssetTree, FetchedSanityAsset } from '@/lib/sanity/utils';

async function getClientAssetsForDemo(): Promise<Asset[]> {
  // For demo, fetch assets for the first client found.
  // In a real app, you'd get the logged-in client's ID.
  const firstClient = await sanityClient.fetch<any>(`*[_type == "client"][0]{_id}`);
  if (!firstClient) return [];

  const query = `*[_type == "asset" && client._ref == $clientId]{
    _id,
    _createdAt,
    _updatedAt,
    name,
    slug,
    assetType,
    path,
    status,
    needsAttention,
    "file": file{asset->{..., url}},
    "previewImage": previewImage{asset->{..., url}},
    parentFolder->{_id, _type, "_ref": _id},
    clientRequestDetails,
    dataAiHint,
    versions[]{
      _key, _type, versionNumber, uploadedAt, uploadedBy, notes,
      "file": file{asset->{..., url}},
      "previewImage": previewImage{asset->{..., url}},
      dataAiHint
    }
  }`;
  const sanityAssets = await sanityClient.fetch<FetchedSanityAsset[]>(query, { clientId: firstClient._id });
  const mappedAssets = sanityAssets.map(mapSanityAssetToLocal);
  return buildAssetTree(mappedAssets);
}


export default function BrandKitPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const fetchedAssets = await getClientAssetsForDemo();
        setAssets(fetchedAssets);
      } catch (error) {
        console.error("Failed to fetch client assets:", error);
        toast({
          title: "Error Loading Assets",
          description: "Could not load brand kit assets. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const currentBrandKitContent = assets.map(asset => `${asset.name} (${asset.type})`).join(', ');
  const previousRequestsSummary = "Client previously requested a new logo variant and social media templates for Instagram."; // This remains mock for now

  const handleDownloadConfirm = (selectedAssets: Asset[]) => {
    console.log("Downloading selected assets:", selectedAssets.map(a => a.name));
    toast({
      title: "Download Started (Mock)",
      description: `Preparing a ZIP file with ${selectedAssets.length} selected items.`,
    });
    setIsDownloadModalOpen(false);
  };

  const handleAssetUpdateRequest = (assetId: string, requestData: ClientSubmittedRequest) => {
    // This updates local state for immediate UI feedback.
    // In a real app, this would also involve a mutation to Sanity.
    setAssets(prevAssets =>
      prevAssets.map(asset =>
        asset.id === assetId
          ? {
              ...asset,
              clientLastRequest: requestData,
              clientRequestDetails: requestData.details, // Assuming details are stored here
              needsAttention: true,
              status: 'waiting', // Set status to waiting
              lastModified: new Date().toISOString(),
            }
          : asset
      )
    );
    toast({
        title: "Request Submitted (Locally)",
        description: "Your asset update request has been noted. This change is local for now.",
    });
    // TODO: Add actual Sanity mutation here.
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg text-muted-foreground">Loading Brand Kit...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
       <Button asChild variant="outline" className="mb-2">
        <Link href="/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="font-headline text-3xl font-bold">Your Brand Kit (Demo Client)</h1>
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
