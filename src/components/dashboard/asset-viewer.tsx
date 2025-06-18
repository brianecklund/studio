
'use client';

import type { Asset, AssetStatus, ClientSubmittedRequest } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Folder, FileText, Image as ImageIcon, Video, FileArchive, AlertTriangle, Download, ChevronDown, ChevronRight, History, Send } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useState, useEffect, type FC } from 'react';
import ClientUpdateRequestModal from './client-update-request-modal';
import ViewMyRequestModal from './view-my-request-modal';
import { format } from 'date-fns';
import { cn } from "@/lib/utils";

interface AssetViewerProps {
  assets: Asset[];
  onUpdateRequestSubmit?: (assetId: string, requestData: ClientSubmittedRequest) => void; // Optional for admin view
  onAttentionIconClick?: (asset: Asset) => void; // For admin: opens attention details modal
  onViewVersionsClick?: (asset: Asset) => void;  // For admin: opens versions history modal
}

const ClientSideFormattedDate: FC<{ dateString?: string; formatPattern: string }> = ({ dateString, formatPattern }) => {
  const [formattedDate, setFormattedDate] = useState<string | null>(null);

  useEffect(() => {
    if (dateString) {
      try {
        setFormattedDate(format(new Date(dateString), formatPattern));
      } catch (e) {
        console.error("Error formatting date:", dateString, e);
        setFormattedDate("Invalid Date");
      }
    } else {
      setFormattedDate("N/A");
    }
  }, [dateString, formatPattern]);

  return <>{formattedDate || '...'}</>;
};


const getStatusBadgeVariant = (status?: AssetStatus): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (status) {
    case 'completed':
      return 'default';
    case 'in-progress':
      return 'secondary';
    case 'waiting':
      return 'outline'; // Or destructive if it implies an issue
    default:
      return 'outline';
  }
};

const getStatusBadgeClassName = (status?: AssetStatus): string => {
  if (!status) return 'bg-gray-100 text-gray-800 border-gray-300';
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'in-progress':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'waiting':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
}

const AssetIcon = ({ type, isFolder }: { type: Asset['type'], isFolder?: boolean }) => {
  if (isFolder) return <Folder className="h-5 w-5 text-accent" />;
  switch (type) {
    case 'pdf':
      return <FileText className="h-5 w-5 text-red-600" />;
    case 'image':
      return <ImageIcon className="h-5 w-5 text-purple-600" />;
    case 'video':
      return <Video className="h-5 w-5 text-orange-600" />;
    case 'document':
      return <FileText className="h-5 w-5 text-blue-600" />;
    case 'archive':
      return <FileArchive className="h-5 w-5 text-yellow-600" />;
    default:
      return <FileText className="h-5 w-5 text-gray-500" />;
  }
};

export default function AssetViewer({ assets, onUpdateRequestSubmit, onAttentionIconClick, onViewVersionsClick }: AssetViewerProps) {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
  const [isUpdateRequestModalOpen, setIsUpdateRequestModalOpen] = useState(false);
  const [isViewMyRequestModalOpen, setIsViewMyRequestModalOpen] = useState(false);
  const [selectedAssetForRequest, setSelectedAssetForRequest] = useState<Asset | null>(null);

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => ({ ...prev, [folderId]: !prev[folderId] }));
  };

  const handleOpenUpdateRequestModal = (asset: Asset) => {
    setSelectedAssetForRequest(asset);
    setIsUpdateRequestModalOpen(true);
  };

  const handleOpenViewMyRequestModal = (asset: Asset) => {
    setSelectedAssetForRequest(asset);
    setIsViewMyRequestModalOpen(true);
  };

  const renderAssets = (assetList: Asset[], level = 0) => {
    return assetList.flatMap(asset => {
      if (!asset) return []; // Guard against undefined assets in the list
      const isFolder = asset.type === 'folder';
      const isExpanded = !!expandedFolders[asset.id];
      const clientRequestActive = asset.clientLastRequest && (asset.status === 'waiting' || asset.status === 'in-progress');

      const rows = [(
        <TableRow 
          key={asset.id} 
          className={`
            ${level > 0 ? 'bg-muted/20 hover:bg-muted/40' : ''}
            ${asset.needsAttention ? 'border-l-2 border-l-destructive' : ''}
          `}
        >
          <TableCell style={{ paddingLeft: `${1 + level * 1.5}rem` }} className="w-[30%] sm:w-auto">
            <div className="flex items-center gap-2">
              {isFolder ? (
                <Button variant="ghost" size="sm" onClick={() => toggleFolder(asset.id)} className="p-1 h-auto -ml-1">
                  {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  <AssetIcon type={asset.type} isFolder />
                </Button>
              ) : (
                asset.previewUrl ? (
                  <Image src={asset.previewUrl} alt={asset.name || 'asset preview'} width={32} height={32} className="rounded object-cover h-8 w-8 border" data-ai-hint={asset.dataAiHint || `${asset.type} icon`}/>
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
              {asset.status ? (asset.status.charAt(0).toUpperCase() + asset.status.slice(1).replace('-', ' ')) : 'Unknown'}
            </Badge>
          </TableCell>
          <TableCell className="text-center">
            {asset.needsAttention && (
              onAttentionIconClick ? ( // Admin view
                <Button variant="ghost" size="icon" className="h-auto p-1 text-destructive hover:text-destructive/80" onClick={() => onAttentionIconClick(asset)} title="View Client Request">
                  <AlertTriangle className="h-5 w-5" />
                </Button>
              ) : asset.clientLastRequest ? ( // Client view, request exists
                <Button variant="ghost" size="icon" className="h-auto p-1 text-destructive hover:text-destructive/80" onClick={() => handleOpenViewMyRequestModal(asset)} title="View Your Request Details">
                   <AlertTriangle className="h-5 w-5" />
                </Button>
              ) : asset.needsAttention ? ( // Client view, general attention (not from their request)
                 <AlertTriangle className="h-5 w-5 text-destructive mx-auto" title="Needs Attention (Admin flagged)"/>
              ) : null
            )}
          </TableCell>
          {onViewVersionsClick && (
            <TableCell className="hidden md:table-cell text-xs">
              {!isFolder && asset.versions && asset.versions.length > 0 ? (
                <Button variant="link" size="sm" className="p-0 h-auto text-xs" onClick={() => onViewVersionsClick(asset)}>
                  <History className="mr-1 h-3 w-3" /> {asset.versions.length} Version{asset.versions.length > 1 ? 's' : ''}
                </Button>
              ) : isFolder ? null : (
                <span className="text-muted-foreground">-</span>
              )}
            </TableCell>
          )}
           {/* Request Column - Client View Only */}
           {!onAttentionIconClick && !isFolder && onUpdateRequestSubmit && (
            <TableCell>
              {clientRequestActive ? (
                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white text-xs h-8" disabled>
                  Requested
                </Button>
              ) : (
                <Button variant="outline" size="sm" className="text-xs h-8" onClick={() => handleOpenUpdateRequestModal(asset)}>
                  <Send className="mr-1.5 h-3.5 w-3.5" /> Request
                </Button>
              )}
            </TableCell>
          )}
          {/* Placeholder for Request column in admin view to maintain layout if needed */}
          {onAttentionIconClick && !isFolder && <TableCell></TableCell>}

          <TableCell className="hidden md:table-cell text-muted-foreground text-xs">
            <ClientSideFormattedDate dateString={asset.lastModified} formatPattern="PPp" />
          </TableCell>
          <TableCell className="hidden lg:table-cell text-muted-foreground text-xs">{asset.size || (asset.type === 'folder' ? '-' : 'N/A')}</TableCell>
          <TableCell className="text-right">
            <div className="flex gap-1 justify-end">
              {!isFolder && asset.downloadUrl && (
                <Button variant="outline" size="icon" asChild title="Download asset">
                  <a href={asset.downloadUrl} download target="_blank" rel="noopener noreferrer">
                    <Download className="h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
          </TableCell>
        </TableRow>
      )];
      
      if (isFolder && isExpanded && asset.children && asset.children.length > 0) {
        rows.push(...renderAssets(asset.children, level + 1));
      } else if (isFolder && isExpanded && (!asset.children || asset.children.length === 0)) {
        rows.push(
          <TableRow key={`${asset.id}-empty`} className="bg-muted/20 hover:bg-muted/40">
             <TableCell colSpan={onViewVersionsClick ? 9 : (onAttentionIconClick ? 8 : 8)} style={{ paddingLeft: `${1 + (level + 1) * 1.5}rem` }} className="text-muted-foreground italic">
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
      <Card className="text-center bg-muted">
        <CardHeader>
          <CardTitle>No Assets Found</CardTitle>
          <CardDescription>This brand kit is currently empty or assets are still being processed.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Admins can upload new assets using the button above (via Sanity Studio).</p>
        </CardContent>
      </Card>
    );
  }
  
  // Determine number of columns based on active features/props
  let numColumns = 6; // Base: Name, Type, Status, Attention, Last Modified, Size, Actions
  if (onViewVersionsClick) numColumns++; // Versions column
  if (!onAttentionIconClick && onUpdateRequestSubmit) numColumns++; // Client Request column
  else if (onAttentionIconClick) numColumns++; // Admin view has a placeholder or specific content for this slot

  return (
    <div className="border rounded-lg overflow-hidden bg-muted">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[30%] sm:w-auto">Name</TableHead>
              <TableHead className="hidden sm:table-cell">Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center w-[80px]">Attention</TableHead>
              {onViewVersionsClick && <TableHead className="hidden md:table-cell w-[120px]">Versions</TableHead>}
              {(!onAttentionIconClick && onUpdateRequestSubmit) && <TableHead className="w-[120px]">Request</TableHead>} 
              {(onAttentionIconClick) && <TableHead className="w-[120px] hidden md:table-cell"></TableHead>}
              <TableHead className="hidden md:table-cell w-[180px]">Last Modified</TableHead>
              <TableHead className="hidden lg:table-cell w-[100px]">Size</TableHead>
              <TableHead className="text-right pr-6 w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {renderAssets(assets)}
          </TableBody>
        </Table>
      </div>
      {onUpdateRequestSubmit && <ClientUpdateRequestModal
        asset={selectedAssetForRequest}
        isOpen={isUpdateRequestModalOpen}
        onOpenChange={setIsUpdateRequestModalOpen}
        onUpdateRequestSubmit={onUpdateRequestSubmit}
      />}
      <ViewMyRequestModal
        assetName={selectedAssetForRequest?.name || null}
        request={selectedAssetForRequest?.clientLastRequest || null}
        isOpen={isViewMyRequestModalOpen}
        onOpenChange={setIsViewMyRequestModalOpen}
      />
    </div>
  );
}
