
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Edit, UploadCloud, Briefcase, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AssetViewer from '@/components/dashboard/asset-viewer';
import type { Asset } from '@/lib/types';

// Mock data - in a real app, this would come from a database or API
const mockClientAssets: Record<string, { clientName: string; industry: string; logoUrl?: string; dataAiHint?: string; assets: Asset[] }> = {
  'bk001': {
    clientName: 'Innovatech Corp',
    industry: 'Technology',
    logoUrl: 'https://placehold.co/80x80.png',
    dataAiHint: 'tech logo',
    assets: [
      { id: 'inno-1', name: 'Innovatech Primary Logo', type: 'image', path: '/Logos/', status: 'completed', needsAttention: false, lastModified: '2023-10-26T10:00:00Z', size: '1.2 MB', previewUrl: 'https://placehold.co/100x100.png', dataAiHint: 'abstract tech', downloadUrl: '#', createdAt: '2023-01-15T00:00:00Z' },
      { id: 'inno-2', name: 'Innovatech Brand Guidelines', type: 'pdf', path: '/', status: 'completed', needsAttention: false, lastModified: '2023-11-15T14:30:00Z', size: '5.5 MB', downloadUrl: '#', createdAt: '2023-01-20T00:00:00Z' },
      { id: 'inno-3', name: 'Innovatech Product One-Pager', type: 'document', path: '/Marketing Materials/', status: 'in-progress', needsAttention: true, lastModified: '2023-12-01T09:15:00Z', size: '2.1 MB', downloadUrl: '#', createdAt: '2023-10-01T00:00:00Z' },
    ],
  },
  'bk002': {
    clientName: 'EcoSolutions Ltd.',
    industry: 'Sustainability',
    logoUrl: 'https://placehold.co/80x80.png',
    dataAiHint: 'nature logo',
    assets: [
      { id: 'eco-1', name: 'EcoSolutions Leaf Logo', type: 'image', path: '/Logos/', status: 'completed', needsAttention: false, lastModified: '2023-11-05T10:00:00Z', size: '900 KB', previewUrl: 'https://placehold.co/100x100.png', dataAiHint: 'leaf environment', downloadUrl: '#', createdAt: '2023-02-15T00:00:00Z' },
      { id: 'eco-2', name: 'Sustainability Report 2023', type: 'pdf', path: '/Reports/', status: 'completed', needsAttention: false, lastModified: '2023-11-20T14:30:00Z', size: '10.2 MB', downloadUrl: '#', createdAt: '2023-02-20T00:00:00Z' },
    ],
  },
  // Add more mock clients as needed, copying the structure from AdminDashboardPage
  'bk003': { clientName: 'HealthBridge Inc.', industry: 'Healthcare', logoUrl: 'https://placehold.co/80x80.png', dataAiHint: 'medical cross', assets: [] },
  'bk004': { clientName: 'QuantumLeap AI', industry: 'Artificial Intelligence', logoUrl: 'https://placehold.co/80x80.png', dataAiHint: 'abstract brain', assets: [] },
  'bk005': { clientName: 'Artisan Foods Co.', industry: 'Food & Beverage', logoUrl: 'https://placehold.co/80x80.png', dataAiHint: 'wheat grain', assets: [] },
  'bk006': { clientName: 'Globetrotter Agency', industry: 'Travel', logoUrl: 'https://placehold.co/80x80.png', dataAiHint: 'globe compass', assets: [] },
};


export default function AdminBrandKitDetailPage({ params }: { params: { kitId: string } }) {
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
            Manage all assets for {kitDetails.clientName}. Admins can upload, edit, or remove assets.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AssetViewer assets={kitDetails.assets} />
        </CardContent>
      </Card>

      {/* Placeholder for other admin sections, e.g., Client Users, Kit Settings */}
      {/* 
      <Card>
        <CardHeader><CardTitle>Client Users</CardTitle></CardHeader>
        <CardContent><p>Manage users associated with this brand kit.</p></CardContent>
      </Card>
      */}
    </div>
  );
}
