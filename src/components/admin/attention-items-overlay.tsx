
'use client';

import Link from 'next/link';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { AttentionItem } from '@/lib/types';
import { FileText, Image as ImageIcon, Video, Folder as FolderIcon, FileArchive, AlertTriangle, ArrowRightCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface AttentionItemsOverlayProps {
  items: AttentionItem[];
  triggerButton: React.ReactNode;
}

const AssetTypeIcon = ({ type }: { type: AttentionItem['assetType'] }) => {
  switch (type) {
    case 'pdf': return <FileText className="h-5 w-5 text-red-500" />;
    case 'image': return <ImageIcon className="h-5 w-5 text-purple-500" />;
    case 'video': return <Video className="h-5 w-5 text-orange-500" />;
    case 'document': return <FileText className="h-5 w-5 text-blue-500" />;
    case 'archive': return <FileArchive className="h-5 w-5 text-yellow-500" />;
    case 'folder': return <FolderIcon className="h-5 w-5 text-accent" />;
    default: return <FileText className="h-5 w-5 text-gray-500" />;
  }
};

export default function AttentionItemsOverlay({ items, triggerButton }: AttentionItemsOverlayProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>{triggerButton}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl flex flex-col">
        <SheetHeader className="mb-4">
          <SheetTitle className="flex items-center">
            <AlertTriangle className="mr-2 h-6 w-6 text-destructive" />
            Items Requiring Attention ({items.length})
          </SheetTitle>
          <SheetDescription>
            Review assets that clients have marked for updates or have issues.
          </SheetDescription>
        </SheetHeader>
        {items.length === 0 ? (
          <div className="flex-grow flex items-center justify-center">
            <p className="text-muted-foreground">No items currently need attention. Great job!</p>
          </div>
        ) : (
          <ScrollArea className="flex-grow pr-2 -mr-2">
            <div className="space-y-3">
              {items.map((item) => (
                <Card key={`${item.clientId}-${item.assetId}`} className="shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base font-semibold flex items-center">
                          <AssetTypeIcon type={item.assetType} />
                          <span className="ml-2">{item.assetName}</span>
                        </CardTitle>
                        <CardDescription className="text-xs">
                          For: <strong>{item.clientName}</strong>
                        </CardDescription>
                      </div>
                       <Button asChild variant="ghost" size="sm" className="text-xs">
                        <Link href={`/admin/brand-kit/${item.clientId}`}>
                          View Kit <ArrowRightCircle className="ml-1.5 h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">
                      Last modified: {formatDistanceToNow(new Date(item.lastModified), { addSuffix: true })}
                    </p>
                    {/* In a real app, you'd show actual request details here */}
                    <p className="text-xs mt-1">
                      Client has requested changes or reported an issue.
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </SheetContent>
    </Sheet>
  );
}
