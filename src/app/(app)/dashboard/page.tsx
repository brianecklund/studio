
'use client';

import AssetViewer from '@/components/dashboard/asset-viewer';
import NewAssetRequestForm from '@/components/dashboard/new-asset-request-form';
import AiSuggestionModal from '@/components/dashboard/ai-suggestion-modal';
import DownloadKitModal from '@/components/dashboard/download-kit-modal'; // New import
import { Button } from '@/components/ui/button';
import { FilePlus2, Lightbulb, Archive } from 'lucide-react'; // Added Archive icon
import type { Asset } from '@/lib/types';
import { useState } from 'react'; // Added useState
import { toast } from '@/hooks/use-toast'; // Added useToast

// Mock data - in a real app, this would come from a database or API
const mockAssets: Asset[] = [
  { id: '1', name: 'Primary Logo', type: 'image', path: '/Logos/', status: 'completed', needsAttention: false, lastModified: '2023-10-26T10:00:00Z', size: '1.2 MB', previewUrl: 'https://placehold.co/100x100.png', dataAiHint: "company logo", downloadUrl: '#', createdAt: '2023-01-15T00:00:00Z' },
  { id: '2', name: 'Brand Guidelines', type: 'pdf', path: '/', status: 'completed', needsAttention: false, lastModified: '2023-11-15T14:30:00Z', size: '5.5 MB', downloadUrl: '#', createdAt: '2023-01-20T00:00:00Z' },
  { id: '3', name: 'Marketing Brochure Q4', type: 'document', path: '/Marketing Materials/', status: 'in-progress', needsAttention: true, lastModified: '2023-12-01T09:15:00Z', size: '2.1 MB', downloadUrl: '#', createdAt: '2023-10-01T00:00:00Z', clientRequestDetails: "Please update the statistics on page 2." },
  { id: '4', name: 'Website Assets', type: 'folder', path: '/Website Assets/', status: 'completed', needsAttention: false, lastModified: '2023-11-20T11:00:00Z', createdAt: '2023-09-01T00:00:00Z', children: [
    { id: '4a', name: 'Homepage Banner.jpg', type: 'image', path: '/Website Assets/Website Banners/', status: 'completed', needsAttention: false, lastModified: '2023-11-20T11:00:00Z', size: '800 KB', previewUrl: 'https://placehold.co/150x50.png', dataAiHint: "website banner", downloadUrl: '#', createdAt: '2023-09-01T00:00:00Z'},
    { id: '4b', name: 'Product Page Banner.png', type: 'image', path: '/Website Assets/Website Banners/', status: 'waiting', needsAttention: false, lastModified: '2023-11-20T11:00:00Z', size: '950 KB', previewUrl: 'https://placehold.co/150x50.png', dataAiHint: "product banner", downloadUrl: '#', createdAt: '2023-09-01T00:00:00Z' },
    { id: '4c', name: 'Empty Subfolder', type: 'folder', path: '/Website Assets/Empty Subfolder/', status: 'completed', needsAttention: false, lastModified: '2023-11-20T11:00:00Z', createdAt: '2023-09-01T00:00:00Z', children: []},
  ]},
  { id: '5', name: 'Social Media Kit', type: 'folder', path: '/', status: 'waiting', needsAttention: false, lastModified: '2023-12-05T16:00:00Z', createdAt: '2023-11-10T00:00:00Z', children: [
     { id: '5a', name: 'Instagram Post Template.psd', type: 'document', path: '/Social Media Kit/', status: 'waiting', needsAttention: false, lastModified: '2023-12-05T16:00:00Z', size: '15 MB', downloadUrl: '#', createdAt: '2023-11-10T00:00:00Z'},
  ]},
  { id: '6', name: 'Product Launch Video', type: 'video', path: '/Videos/', status: 'in-progress', needsAttention: false, lastModified: '2023-12-10T10:00:00Z', size: '150 MB', downloadUrl: '#', createdAt: '2023-11-01T00:00:00Z' },
  { id: '7', name: 'Archived Items', type: 'folder', path: '/Archived/', status: 'completed', needsAttention: false, lastModified: '2023-01-01T10:00:00Z', createdAt: '2022-12-01T00:00:00Z', children: [] },

];


export default function DashboardPage() {
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  // In a real app, fetch assets for the logged-in client
  const assets = mockAssets;

  const currentBrandKitContent = assets.map(asset => `${asset.name} (${asset.type})`).join(', ');
  const previousRequestsSummary = "Client previously requested a new logo variant and social media templates for Instagram.";

  const handleDownloadConfirm = (selectedAssets: Asset[]) => {
    // Mock download logic
    console.log("Downloading selected assets:", selectedAssets.map(a => a.name));
    toast({
      title: "Download Started (Mock)",
      description: `Preparing a ZIP file with ${selectedAssets.length} selected items.`,
    });
    setIsDownloadModalOpen(false);
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
      <AssetViewer assets={assets} />
      <DownloadKitModal
        isOpen={isDownloadModalOpen}
        onOpenChange={setIsDownloadModalOpen}
        assets={assets}
        onDownloadConfirm={handleDownloadConfirm}
      />
    </div>
  );
}
