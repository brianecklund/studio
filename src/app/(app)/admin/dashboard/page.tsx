
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Briefcase, Eye } from 'lucide-react';

interface AdminBrandKitPreview {
  kitId: string;
  clientName: string;
  assetCount: number;
  logoUrl?: string;
  dataAiHint?: string;
  industry?: string;
}

const mockAdminBrandKits: AdminBrandKitPreview[] = [
  { kitId: 'bk001', clientName: 'Innovatech Corp', assetCount: 15, logoUrl: 'https://placehold.co/80x80.png', dataAiHint: 'tech logo', industry: 'Technology' },
  { kitId: 'bk002', clientName: 'EcoSolutions Ltd.', assetCount: 22, logoUrl: 'https://placehold.co/80x80.png', dataAiHint: 'nature logo', industry: 'Sustainability' },
  { kitId: 'bk003', clientName: 'HealthBridge Inc.', assetCount: 8, logoUrl: 'https://placehold.co/80x80.png', dataAiHint: 'medical logo', industry: 'Healthcare' },
  { kitId: 'bk004', clientName: 'QuantumLeap AI', assetCount: 30, logoUrl: 'https://placehold.co/80x80.png', dataAiHint: 'abstract logo', industry: 'Artificial Intelligence' },
  { kitId: 'bk005', clientName: 'Artisan Foods Co.', assetCount: 12, logoUrl: 'https://placehold.co/80x80.png', dataAiHint: 'food logo', industry: 'Food & Beverage' },
  { kitId: 'bk006', clientName: 'Globetrotter Agency', assetCount: 18, logoUrl: 'https://placehold.co/80x80.png', dataAiHint: 'travel logo', industry: 'Travel' },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="font-headline text-3xl font-bold flex items-center">
          <Users className="mr-3 h-8 w-8 text-primary" />
          Admin Dashboard
        </h1>
        {/* Future admin actions can go here, e.g., "Add New Client" */}
      </div>
      <p className="text-muted-foreground">
        Manage and oversee all client brand kits from this central hub. Click on a kit to view its details.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockAdminBrandKits.map((kit) => (
          <Card key={kit.kitId} className="flex flex-col hover:shadow-lg transition-shadow duration-200">
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
            <CardFooter>
              <Button asChild className="w-full">
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
