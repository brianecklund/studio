'use client';

import type { Asset, AssetStatus } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Folder, FileText, Image as ImageIcon, Video, FileArchive, AlertTriangle, Download, Edit3 } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import RequestUpdateForm from './request-update-form';
import { format } from 'date-fns';

interface AssetViewerProps {
  assets: Asset[];
}

const getStatusBadgeVariant = (status: AssetStatus): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (status) {
    case 'completed':
      return 'default'; // Using primary color for completed
    case 'in-progress':
      return 'secondary'; // A neutral/yellowish tone might be better, using secondary for now
    case 'waiting':
      return 'outline';
    default:
      return 'outline';
  }
};

const getStatusBadgeClassName = (status: AssetStatus): string => {
  switch (status) {
    case 'completed':
      return 'bg-green-500 hover:bg-green-600 text-white';
    case 'in-progress':
      return 'bg-yellow-500 hover:bg-yellow-600 text-black';
    case 'waiting':
      return 'bg-blue-500 hover:bg-blue-600 text-white';
    default:
      return '';
  }
}


const AssetIcon = ({ type, isFolder }: { type: Asset['type'], isFolder?: boolean }) => {
  if (isFolder) return <Folder className="h-5 w-5 text-accent" />;
  switch (type) {
    case 'pdf':
      return <FileText className="h-5 w-5 text-blue-500" />;
    case 'image':
      return <ImageIcon className="h-5 w-5 text-purple-500" />;
    case 'video':
      return <Video className="h-5 w-5 text-red-500" />;
    case 'document':
      return <FileText className="h-5 w-5 text-green-500" />;
    case 'archive':
      return <FileArchive className="h-5 w-5 text-orange-500" />;
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
        <TableRow key={asset.id} className={level > 0 ? 'bg-muted/30 hover:bg-muted/50' : ''}>
          <TableCell style={{ paddingLeft: `${1 + level * 1.5}rem` }}>
            <div className="flex items-center gap-2">
              {isFolder ? (
                <Button variant="ghost" size="sm" onClick={() => toggleFolder(asset.id)} className="p-1 h-auto">
                  <AssetIcon type={asset.type} isFolder />
                </Button>
              ) : (
                asset.previewUrl ? (
                  <Image src={asset.previewUrl} alt={asset.name} width={32} height={32} className="rounded object-cover h-8 w-8" data-ai-hint={`${asset.type} icon`}/>
                ) : (
                  <AssetIcon type={asset.type} />
                )
              )}
              <span className="font-medium truncate" title={asset.name}>{asset.name}</span>
            </div>
          </TableCell>
          <TableCell className="hidden sm:table-cell">{asset.type === 'folder' ? 'Folder' : asset.type.charAt(0).toUpperCase() + asset.type.slice(1)}</TableCell>
          <TableCell>
            <Badge variant={getStatusBadgeVariant(asset.status)} className={getStatusBadgeClassName(asset.status)}>
              {asset.status.charAt(0).toUpperCase() + asset.status.slice(1).replace('-', ' ')}
            </Badge>
          </TableCell>
          <TableCell className="text-center">
            {asset.needsAttention && <AlertTriangle className="h-5 w-5 text-red-500 mx-auto" />}
          </TableCell>
          <TableCell className="hidden md:table-cell">{format(new Date(asset.lastModified), 'MMM dd, yyyy')}</TableCell>
          <TableCell className="hidden lg:table-cell">{asset.size || 'N/A'}</TableCell>
          <TableCell className="text-right">
            <div className="flex gap-1 justify-end">
              {!isFolder && asset.downloadUrl && (
                <Button variant="outline" size="icon" asChild title="Download">
                  <a href={asset.downloadUrl} download>
                    <Download className="h-4 w-4" />
                  </a>
                </Button>
              )}
              <RequestUpdateForm asset={asset} triggerButton={
                <Button variant="outline" size="icon" title="Request Update">
                  <Edit3 className="h-4 w-4" />
                </Button>
              }/>
            </div>
          </TableCell>
        </TableRow>
      )];
      
      if (isFolder && isExpanded && asset.children && asset.children.length > 0) {
        rows.push(...renderAssets(asset.children, level + 1));
      }
      return rows;
    });
  };


  if (!assets || assets.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Assets Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Your brand kit is currently empty. Start by requesting a new asset.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden sm:table-cell">Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Needs Attention</TableHead>
                <TableHead className="hidden md:table-cell">Last Modified</TableHead>
                <TableHead className="hidden lg:table-cell">Size</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {renderAssets(assets)}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
