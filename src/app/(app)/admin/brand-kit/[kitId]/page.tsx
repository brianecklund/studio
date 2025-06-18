
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Edit, UploadCloud, Briefcase, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AssetViewer from '@/components/dashboard/asset-viewer';
import { mockClientAssets } from '@/lib/mock-data'; // Import centralized mock data

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
