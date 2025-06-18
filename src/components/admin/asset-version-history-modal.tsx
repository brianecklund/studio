
'use client';

import type { Asset, AssetVersion } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Download, Eye, FileText } from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';

interface AssetVersionHistoryModalProps {
  asset: Asset | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AssetVersionHistoryModal({ asset, isOpen, onOpenChange }: AssetVersionHistoryModalProps) {
  if (!asset) return null;

  const versions = asset.versions || [];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Version History: {asset.name}</DialogTitle>
          <DialogDescription>
            Review previous versions of this asset. The most recent version is at the top.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-grow pr-2 -mr-2 my-4">
          {versions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Version</TableHead>
                  <TableHead>File Name</TableHead>
                  <TableHead className="hidden md:table-cell">Uploaded At</TableHead>
                  <TableHead className="hidden sm:table-cell">Uploaded By</TableHead>
                  <TableHead className="hidden lg:table-cell">Size</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {versions.sort((a,b) => b.versionNumber - a.versionNumber).map((version) => (
                  <TableRow key={version.id}>
                    <TableCell className="font-medium">V{version.versionNumber}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {version.previewUrl ? (
                           <Image src={version.previewUrl} alt={`Version ${version.versionNumber} preview`} width={24} height={24} className="rounded object-cover h-6 w-6 border" data-ai-hint={version.dataAiHint || "file preview"}/>
                        ) : (
                          <FileText className="h-5 w-5 text-muted-foreground" />
                        )}
                        {version.fileName}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{format(new Date(version.uploadedAt), 'PPp')}</TableCell>
                    <TableCell className="hidden sm:table-cell text-xs">{version.uploadedBy}</TableCell>
                    <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">{version.fileSize}</TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-xs truncate" title={version.notes}>{version.notes || '-'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        {version.previewUrl && (
                          <Button variant="outline" size="icon" asChild title="View version preview (mock)">
                            <a href={version.previewUrl} target="_blank" rel="noopener noreferrer">
                              <Eye className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                        <Button variant="outline" size="icon" asChild title="Download version (mock)">
                          <a href={version.downloadUrl} download>
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground text-center py-8">No version history available for this asset.</p>
          )}
        </ScrollArea>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
