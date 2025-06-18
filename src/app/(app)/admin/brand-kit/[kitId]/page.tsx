
// This page is now a Server Component to fetch data
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Edit, UploadCloud, Briefcase, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AssetViewer from '@/components/dashboard/asset-viewer';
import type { Asset, Client } from '@/lib/types';
import AdminAttentionRequestModal from '@/components/admin/admin-attention-request-modal';
import AssetVersionHistoryModal from '@/components/admin/asset-version-history-modal';
import { client as sanityClient, urlForImage } from '@/lib/sanity/client';
import { mapSanityAssetToLocal, buildAssetTree, FetchedSanityAsset } from '@/lib/sanity/utils';
import AdminBrandKitControls from './_components/admin-brand-kit-controls';


interface AdminBrandKitDetailPageProps {
  params: { kitId: string }; // kitId is expected to be the client's slug
}

async function getClientDetails(slug: string): Promise<Client | null> {
  const query = `*[_type == "client" && slug.current == $slug][0]{
    _id,
    name,
    slug,
    industry,
    logo
  }`;
  return sanityClient.fetch<Client | null>(query, { slug });
}

async function getClientAssets(clientId: string): Promise<Asset[]> {
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
    "file": file{asset->{..., url}}, // Expand file asset reference
    "previewImage": previewImage{asset->{..., url}}, // Expand previewImage asset reference
    parentFolder->{_id, _type, "_ref": _id}, // Get parent folder reference
    clientRequestDetails,
    dataAiHint,
    versions[]{ // Fetch versions array
      _key,
      _type,
      versionNumber,
      uploadedAt,
      uploadedBy,
      notes,
      "file": file{asset->{..., url}},
      "previewImage": previewImage{asset->{..., url}},
      dataAiHint
    }
  }`;
  const sanityAssets = await sanityClient.fetch<FetchedSanityAsset[]>(query, { clientId });
  const mappedAssets = sanityAssets.map(mapSanityAssetToLocal);
  return buildAssetTree(mappedAssets); // Build tree structure
}


export default async function AdminBrandKitDetailPage({ params }: AdminBrandKitDetailPageProps) {
  const clientDetails = await getClientDetails(params.kitId);

  if (!clientDetails) {
    return (
      <div className="text-center py-10">
        <h1 className="font-headline text-2xl font-bold">Client Not Found</h1>
        <p className="text-muted-foreground">The requested client could not be found for slug: {params.kitId}.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/admin/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Admin Dashboard
          </Link>
        </Button>
      </div>
    );
  }

  const assets = await getClientAssets(clientDetails._id);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          {clientDetails.logo && (
            <Image
              // @ts-ignore
              src={urlForImage(clientDetails.logo).width(64).height(64).url()}
              alt={`${clientDetails.name || 'Client'} logo`}
              width={64}
              height={64}
              className="rounded-lg border"
              data-ai-hint={`${clientDetails.industry || 'company'} logo`}
            />
          )}
          <div>
            <h1 className="font-headline text-3xl font-bold">{clientDetails.name}</h1>
            <p className="text-muted-foreground flex items-center">
              <Building className="mr-2 h-4 w-4" /> {clientDetails.industry || 'N/A'}
            </p>
          </div>
        </div>
        {/* Moved controls to a client component to handle state for modals */}
        <AdminBrandKitControls initialAssets={assets} clientName={clientDetails.name || 'Client'} />
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
            Manage all assets for {clientDetails.name}. Admins can view client requests and manage asset versions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* AssetViewer is passed initial assets; state for modals handled in AdminBrandKitControls */}
           <AssetViewer 
            assets={assets} 
            // onAttentionIconClick and onViewVersionsClick are now handled by AdminBrandKitControls
            // For AssetViewer, these props will be passed down from AdminBrandKitControls
            // This means AssetViewer itself doesn't need to change its props for this aspect
          />
        </CardContent>
      </Card>
      {/* Modals are now managed within AdminBrandKitControls and triggered from there */}
    </div>
  );
}

// Ensure dynamic rendering for server components that fetch data
export const dynamic = 'force-dynamic';
export const revalidate = 0;
