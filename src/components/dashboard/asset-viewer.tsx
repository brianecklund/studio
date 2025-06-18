
'use client';

import type { Asset, AssetStatus } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Folder, FileText, Image as ImageIcon, Video, FileArchive, AlertTriangle, Download, Edit3, ChevronDown, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useState } from 'react';
import RequestUpdateForm from './request-update-form';
import { format } from 'date-fns';
import { cn } from "@/lib/utils"; // Added this import

interface AssetViewerProps {
  assets: Asset[];
}

const getStatusBadgeVariant = (status: AssetStatus): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (status) {
    case 'completed':
      return 'default';
    case 'in-progress':
      return 'secondary';
    case 'waiting':
      return 'outline';
    default:
      return 'outline';
  }
};

const getStatusBadgeClassName = (status: AssetStatus): string => {
  // Using Tailwind classes for more direct styling control for badges
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800 border-green-300'; // Lighter bg, darker text for contrast
    case 'in-progress':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'waiting':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300'; // Fallback
  }
}


const AssetIcon = ({ type, isFolder }: { type: Asset['type'], isFolder?: boolean }) => {
  if (isFolder) return <Folder className="h-5 w-5 text-accent" />;
  switch (type) {
    case 'pdf':
      return <FileText className="h-5 w-5 text-red-600" />; // PDF often associated with red (Adobe)
    case 'image':
      return <ImageIcon className="h-5 w-5 text-purple-600" />;
    case 'video':
      return <Video className="h-5 w-5 text-orange-600" />;
    case 'document':
      return <FileText className="h-5 w-5 text-blue-600" />; // Docs (Word, Google Docs) often blue
    case 'archive':
      return <FileArchive className="h-5 w-5 text-yellow-600" />; // Archives often yellow/brown
    default:
      return <FileText className="h-5 w-5 text-gray-500" />;
  }
};

export default function AssetViewer({ assets }: AssetViewerProps) {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => ({ ...prev, [folderId]: !prev[folderId] }));
  };

  const renderAssets = (assetList: Asset[], level = 0) => {
    return assetList.flatMap(asset => {
      const isFolder = asset.type === 'folder';
      const isExpanded = !!expandedFolders[asset.id];

      const rows = [(
        <TableRow 
          key={asset.id} 
          className={`
            ${level > 0 ? 'bg-muted/20 hover:bg-muted/40' : 'hover:bg-muted/50'}
            ${asset.needsAttention ? 'border-l-2 border-l-destructive' : ''}
          `}
        >
          <TableCell style={{ paddingLeft: `${1 + level * 1.5}rem` }} className="w-[40%] sm:w-auto">
            <div className="flex items-center gap-2">
              {isFolder ? (
                <Button variant="ghost" size="sm" onClick={() => toggleFolder(asset.id)} className="p-1 h-auto -ml-1">
                  {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  <AssetIcon type={asset.type} isFolder />
                </Button>
              ) : (
                asset.previewUrl ? (
                  <Image src={asset.previewUrl} alt={asset.name} width={32} height={32} className="rounded object-cover h-8 w-8 border" data-ai-hint={`${asset.type} icon`}/>
                ) : (
                  <span className="inline-block w-8 h-8 flex items-center justify-center">
                    <AssetIcon type={asset.type} />
                  </span>
                )
              )}
              <span className="font-medium truncate" title={asset.name}>{asset.name}</span>
            </div>
          </TableCell>
          <TableCell className="hidden sm:table-cell">{asset.type === 'folder' ? 'Folder' : asset.type.charAt(0).toUpperCase() + asset.type.slice(1)}</TableCell>
          <TableCell>
            <Badge variant={getStatusBadgeVariant(asset.status)} className={cn("font-semibold", getStatusBadgeClassName(asset.status))}>
              {asset.status.charAt(0).toUpperCase() + asset.status.slice(1).replace('-', ' ')}
            </Badge>
          </TableCell>
          <TableCell className="text-center">
            {asset.needsAttention && <AlertTriangle className="h-5 w-5 text-destructive mx-auto" title="Needs Attention"/>}
          </TableCell>
          <TableCell className="hidden md:table-cell text-muted-foreground">{format(new Date(asset.lastModified), 'PPp')}</TableCell>
          <TableCell className="hidden lg:table-cell text-muted-foreground">{asset.size || (asset.type === 'folder' ? '-' : 'N/A')}</TableCell>
          <TableCell className="text-right">
            <div className="flex gap-1 justify-end">
              {!isFolder && asset.downloadUrl && (
                <Button variant="outline" size="icon" asChild title="Download asset">
                  <a href={asset.downloadUrl} download>
                    <Download className="h-4 w-4" />
                  </a>
                </Button>
              )}
              <RequestUpdateForm asset={asset} triggerButton={
                <Button variant="outline" size="icon" title="Request update or provide feedback">
                  <Edit3 className="h-4 w-4" />
                </Button>
              }/>
            </div>
          </TableCell>
        </TableRow>
      )];
      
      if (isFolder && isExpanded && asset.children && asset.children.length > 0) {
        rows.push(...renderAssets(asset.children, level + 1));
      } else if (isFolder && isExpanded && (!asset.children || asset.children.length === 0)) {
        rows.push(
          <TableRow key={`${asset.id}-empty`} className="bg-muted/20 hover:bg-muted/40">
            <TableCell colSpan={7} style={{ paddingLeft: `${1 + (level + 1) * 1.5}rem` }} className="text-muted-foreground italic">
              Folder is empty.
            </TableCell>
          </TableRow>
        );
      }
      return rows;
    });
  };


  if (!assets || assets.length === 0) {
    return (
      <Card className="text-center">
        <CardHeader>
          <CardTitle>No Assets Found</CardTitle>
          <CardDescription>This brand kit is currently empty or assets are still being processed.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Admins can upload new assets using the button above.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[40%] sm:w-auto">Name</TableHead>
              <TableHead className="hidden sm:table-cell">Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Attention</TableHead>
              <TableHead className="hidden md:table-cell">Last Modified</TableHead>
              <TableHead className="hidden lg:table-cell">Size</TableHead>
              <TableHead className="text-right pr-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {renderAssets(assets)}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
