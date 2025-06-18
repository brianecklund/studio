
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Edit, UploadCloud, Briefcase, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AssetViewer from '@/components/dashboard/asset-viewer';
import { mockClientAssets } from '@/lib/mock-data';
import type { Asset } from '@/lib/types';
import React, { useState } from 'react'; // Import React for React.use
import AdminAttentionRequestModal from '@/components/admin/admin-attention-request-modal';
import AssetVersionHistoryModal from '@/components/admin/asset-version-history-modal';

export default function AdminBrandKitDetailPage({ params: paramsPromise }: { params: Promise<{ kitId: string }> }) {
  const [selectedAssetForAttention, setSelectedAssetForAttention] = useState<Asset | null>(null);
  const [isAttentionModalOpen, setIsAttentionModalOpen] = useState(false);
  const [selectedAssetForVersions, setSelectedAssetForVersions] = useState<Asset | null>(null);
  const [isVersionsModalOpen, setIsVersionsModalOpen] = useState(false);

  // Unwrap the params promise using React.use()
  // This hook must be called inside a Client Component and at the top level.
  const params = React.use(paramsPromise);

  const kitDetails = mockClientAssets[params.kitId];

  if (!kitDetails) {
    return (
      <div className="text-center py-10">
        <h1 className="font-headline text-2xl font-bold">Brand Kit Not Found</h1>
        <p className="text-muted-foreground">The requested brand kit could not be found.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/admin/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Admin Dashboard
          </Link>
        </Button>
      </div>
    );
  }

  const handleAttentionIconClick = (asset: Asset) => {
    setSelectedAssetForAttention(asset);
    setIsAttentionModalOpen(true);
  };

  const handleViewVersionsClick = (asset: Asset) => {
    setSelectedAssetForVersions(asset);
    setIsVersionsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          {kitDetails.logoUrl && (
            <Image
              src={kitDetails.logoUrl}
              alt={`${kitDetails.clientName} logo`}
              width={64}
              height={64}
              className="rounded-lg border"
              data-ai-hint={kitDetails.dataAiHint || "company logo"}
            />
          )}
          <div>
            <h1 className="font-headline text-3xl font-bold">{kitDetails.clientName}</h1>
            <p className="text-muted-foreground flex items-center">
              <Building className="mr-2 h-4 w-4" /> {kitDetails.industry}
            </p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap justify-start sm:justify-end">
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" /> Edit Kit Details
          </Button>
          <Button>
            <UploadCloud className="mr-2 h-4 w-4" /> Upload New Asset
          </Button>
        </div>
      </div>
      
      <Button asChild variant="outline" className="mb-6 w-full sm:w-auto">
        <Link href="/admin/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Admin Dashboard
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Briefcase className="mr-3 h-6 w-6 text-primary" />
            Brand Assets
          </CardTitle>
          <CardDescription>
            Manage all assets for {kitDetails.clientName}. Admins can view client requests and manage asset versions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AssetViewer 
            assets={kitDetails.assets} 
            onAttentionIconClick={handleAttentionIconClick}
            onViewVersionsClick={handleViewVersionsClick}
          />
        </CardContent>
      </Card>

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

    </div>
  );
}
