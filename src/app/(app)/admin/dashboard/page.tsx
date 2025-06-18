
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Briefcase, Eye, FolderKanban, FileText, AlertCircle, BellRing } from 'lucide-react';
import { mockClientAssets } from '@/lib/mock-data'; // Import centralized mock data
import type { Asset, AttentionItem } from '@/lib/types';
import AttentionItemsOverlay from '@/components/admin/attention-items-overlay';


interface AdminBrandKitPreview {
  kitId: string;
  clientName: string;
  assetCount: number;
  logoUrl?: string;
  dataAiHint?: string;
  industry?: string;
  hasAttentionItems: boolean;
}

// This mock data could also be moved to mock-data.ts if it grows more complex
// For now, it's fine here as it's specific to this page's preview cards.
const mockAdminBrandKits: AdminBrandKitPreview[] = [
  { kitId: 'bk001', clientName: 'Innovatech Corp', assetCount: mockClientAssets['bk001']?.assets.length || 0, logoUrl: 'https://placehold.co/80x80.png', dataAiHint: 'tech logo', industry: 'Technology', hasAttentionItems: mockClientAssets['bk001']?.assets.some(a => a.needsAttention) || false },
  { kitId: 'bk002', clientName: 'EcoSolutions Ltd.', assetCount: mockClientAssets['bk002']?.assets.length || 0, logoUrl: 'https://placehold.co/80x80.png', dataAiHint: 'nature logo', industry: 'Sustainability', hasAttentionItems: mockClientAssets['bk002']?.assets.some(a => a.needsAttention) || false },
  { kitId: 'bk003', clientName: 'HealthBridge Inc.', assetCount: mockClientAssets['bk003']?.assets.length || 0, logoUrl: 'https://placehold.co/80x80.png', dataAiHint: 'medical logo', industry: 'Healthcare', hasAttentionItems: mockClientAssets['bk003']?.assets.some(a => a.needsAttention) || false },
  { kitId: 'bk004', clientName: 'QuantumLeap AI', assetCount: mockClientAssets['bk004']?.assets.length || 0, logoUrl: 'https://placehold.co/80x80.png', dataAiHint: 'abstract logo', industry: 'Artificial Intelligence', hasAttentionItems: mockClientAssets['bk004']?.assets.some(a => a.needsAttention) || false },
  { kitId: 'bk005', clientName: 'Artisan Foods Co.', assetCount: mockClientAssets['bk005']?.assets.length || 0, logoUrl: 'https://placehold.co/80x80.png', dataAiHint: 'food logo', industry: 'Food & Beverage', hasAttentionItems: mockClientAssets['bk005']?.assets.some(a => a.needsAttention) || false },
  { kitId: 'bk006', clientName: 'Globetrotter Agency', assetCount: mockClientAssets['bk006']?.assets.length || 0, logoUrl: 'https://placehold.co/80x80.png', dataAiHint: 'travel logo', industry: 'Travel', hasAttentionItems: mockClientAssets['bk006']?.assets.some(a => a.needsAttention) || false },
];

function getAllAttentionItems(kits: AdminBrandKitPreview[]): AttentionItem[] {
  const attentionItems: AttentionItem[] = [];

  const collectAttentionItemsFromAssets = (assets: Asset[], clientName: string, clientId: string) => {
    for (const asset of assets) {
      if (asset.needsAttention) {
        attentionItems.push({
          assetId: asset.id,
          assetName: asset.name,
          assetType: asset.type,
          clientName: clientName,
          clientId: clientId,
          lastModified: asset.lastModified,
        });
      }
      if (asset.children && asset.children.length > 0) {
        collectAttentionItemsFromAssets(asset.children, clientName, clientId);
      }
    }
  };

  kits.forEach(kitPreview => {
    const clientData = mockClientAssets[kitPreview.kitId];
    if (clientData && clientData.assets) {
      collectAttentionItemsFromAssets(clientData.assets, clientData.clientName, kitPreview.kitId);
    }
  });
  return attentionItems;
}


export default function AdminDashboardPage() {
  const attentionItems = getAllAttentionItems(mockAdminBrandKits);
  const attentionCount = attentionItems.length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1">
          <h1 className="font-headline text-3xl font-bold flex items-center">
            <Users className="mr-3 h-8 w-8 text-primary" />
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and oversee all client brand kits from this central hub.
          </p>
        </div>
        {attentionCount > 0 && (
           <AttentionItemsOverlay
            items={attentionItems}
            triggerButton={
              <Button variant="outline" className="bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive border-destructive/30">
                <BellRing className="mr-2 h-4 w-4" />
                {attentionCount} {attentionCount === 1 ? "Item Needs" : "Items Need"} Attention
              </Button>
            }
          />
        )}
      </div>
      

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockAdminBrandKits.map((kit) => (
          <Card key={kit.kitId} className="flex flex-col hover:shadow-lg transition-shadow duration-200 relative">
            {kit.hasAttentionItems && (
              <div className="absolute top-3 right-3 text-destructive z-10" title="Items need attention">
                <AlertCircle className="h-5 w-5" />
                <span className="sr-only">Needs attention</span>
              </div>
            )}
            <CardHeader className="flex flex-row items-start gap-4 space-y-0">
              {kit.logoUrl && (
                <Image
                  src={kit.logoUrl}
                  alt={`${kit.clientName} logo`}
                  width={60}
                  height={60}
                  className="rounded-md border"
                  data-ai-hint={kit.dataAiHint || "company logo"}
                />
              )}
              <div className="flex-1">
                <CardTitle className="font-headline text-xl">{kit.clientName}</CardTitle>
                {kit.industry && <CardDescription>{kit.industry}</CardDescription>}
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="flex items-center text-sm text-muted-foreground">
                <Briefcase className="mr-2 h-4 w-4" />
                {kit.assetCount} assets in kit
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button asChild className="flex-1" variant="outline">
                <Link href={`/admin/client/${kit.kitId}/projects`}>
                  <FolderKanban className="mr-2 h-4 w-4" /> Projects
                </Link>
              </Button>
              <Button asChild className="flex-1" variant="outline">
                <Link href={`/admin/client/${kit.kitId}/documents`}>
                  <FileText className="mr-2 h-4 w-4" /> Documents
                </Link>
              </Button>
              <Button asChild className="flex-1">
                <Link href={`/admin/brand-kit/${kit.kitId}`}>
                  <Eye className="mr-2 h-4 w-4" /> View Kit
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
