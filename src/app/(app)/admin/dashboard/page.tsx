
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Briefcase, Eye, FolderKanban, FileText, AlertCircle, BellRing } from 'lucide-react';
import { client as sanityClient, urlForImage } from '@/lib/sanity/client';
import type { Client } from '@/lib/types';
// AttentionItemsOverlay and related logic removed for now to simplify Sanity integration.
// It can be added back with optimized queries.

// Fetch clients from Sanity
async function getClients(): Promise<Client[]> {
  const query = `*[_type == "client"]{
    _id,
    _type,
    name,
    slug,
    industry,
    logo,
    clientEmail,
    status,
    "assetCount": count(*[_type == "asset" && references(^._id)])
  }`;
  const clients = await sanityClient.fetch<Client[]>(query);
  return clients;
}

export default async function AdminDashboardPage() {
  const clients = await getClients();

  // Note: AttentionItemsOverlay and its data fetching logic (getAllAttentionItems)
  // have been removed for this iteration to focus on core Sanity client data display.
  // Re-integrating it would require fetching and processing asset attention status across all clients.
  // const attentionCount = 0; // Placeholder

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
        {/* Placeholder for re-adding AttentionItemsOverlay if needed in the future
        {attentionCount > 0 && (
           <Button variant="outline" className="bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive border-destructive/30">
             <BellRing className="mr-2 h-4 w-4" />
             {attentionCount} {attentionCount === 1 ? "Item Needs" : "Items Need"} Attention
           </Button>
        )}
        */}
      </div>
      

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((clientAccount) => (
          <Card key={clientAccount._id} className="flex flex-col hover:shadow-lg transition-shadow duration-200 relative">
            {/* 
              Logic for 'hasAttentionItems' needs to be re-evaluated with Sanity.
              It would require querying assets for this client and checking 'needsAttention'.
              For now, this is removed.
            */}
            {/* {clientAccount.hasAttentionItems && (
              <div className="absolute top-3 right-3 text-destructive z-10" title="Items need attention">
                <AlertCircle className="h-5 w-5" />
                <span className="sr-only">Needs attention</span>
              </div>
            )} */}
            <CardHeader className="flex flex-row items-start gap-4 space-y-0">
              {clientAccount.logo && (
                <Image
                  // @ts-ignore // Temp ignore for SanityImageObject vs string
                  src={urlForImage(clientAccount.logo).width(60).height(60).url()}
                  alt={`${clientAccount.name || 'Client'} logo`}
                  width={60}
                  height={60}
                  className="rounded-md border"
                  data-ai-hint={`${clientAccount.industry || 'company'} logo`}
                />
              )}
              <div className="flex-1">
                <CardTitle className="font-headline text-xl">{clientAccount.name || 'Unnamed Client'}</CardTitle>
                {clientAccount.industry && <CardDescription>{clientAccount.industry}</CardDescription>}
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="flex items-center text-sm text-muted-foreground">
                <Briefcase className="mr-2 h-4 w-4" />
                {clientAccount.assetCount || 0} assets in kit
              </div>
               <p className="text-xs text-muted-foreground mt-1">Status: {clientAccount.status || 'N/A'}</p>
               <p className="text-xs text-muted-foreground mt-1">Email: {clientAccount.clientEmail || 'N/A'}</p>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button asChild className="flex-1" variant="outline" disabled>
                {/* <Link href={`/admin/client/${clientAccount.slug?.current || clientAccount._id}/projects`}> */}
                  <FolderKanban className="mr-2 h-4 w-4" /> Projects (Soon)
                {/* </Link> */}
              </Button>
              <Button asChild className="flex-1" variant="outline" disabled>
                {/* <Link href={`/admin/client/${clientAccount.slug?.current || clientAccount._id}/documents`}> */}
                  <FileText className="mr-2 h-4 w-4" /> Documents (Soon)
                {/* </Link> */}
              </Button>
              <Button asChild className="flex-1">
                <Link href={`/admin/brand-kit/${clientAccount.slug?.current || clientAccount._id}`}>
                  <Eye className="mr-2 h-4 w-4" /> View Kit
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
        {clients.length === 0 && (
          <p className="col-span-full text-center text-muted-foreground py-10">
            No clients found. Add clients in the Sanity Studio.
          </p>
        )}
      </div>
    </div>
  );
}

// Ensure dynamic rendering for server components that fetch data
export const dynamic = 'force-dynamic';
export const revalidate = 0; // Prevent caching, always fetch fresh data
