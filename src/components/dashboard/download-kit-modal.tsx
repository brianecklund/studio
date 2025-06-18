
'use client';

import { useState, useEffect, useCallback, type FC } from 'react';
import type { Asset } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Folder, FileText, Image as ImageIcon, Video, FileArchive as FileArchiveIcon, Loader2, PackageDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DownloadKitModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  assets: Asset[];
  onDownloadConfirm: (selectedAssets: Asset[]) => void;
}

const parseSizeToKB = (sizeStr?: string): number => {
  if (!sizeStr) return 0;
  const parts = sizeStr.toLowerCase().split(' ');
  if (parts.length < 2) return 0;
  let value = parseFloat(parts[0]);
  const unit = parts[1];
  if (isNaN(value)) return 0;

  // Handle cases like "1,200 KB" or "1.200 KB" by removing thousand separators for parsing
  if (parts[0].includes(',')) {
      value = parseFloat(parts[0].replace(/,/g, ''));
  }


  if (unit === 'mb') return value * 1024;
  if (unit === 'kb') return value;
  if (unit === 'gb') return value * 1024 * 1024;
  if (unit === 'b') return value / 1024;
  return 0;
};

const formatKBToSizeString = (kb: number): string => {
  if (kb === 0) return '0 KB';
  if (kb < 1) return (kb * 1024).toFixed(0) + ' B'; // Show bytes if less than 1KB
  if (kb < 1024) return kb.toFixed(1) + ' KB';
  if (kb < 1024 * 1024) return (kb / 1024).toFixed(2) + ' MB';
  return (kb / (1024 * 1024)).toFixed(2) + ' GB';
};


const AssetIcon: FC<{ type: Asset['type'], className?: string }> = ({ type, className }) => {
  const iconProps = { className: cn("h-4 w-4", className) };
  switch (type) {
    case 'folder': return <Folder {...iconProps} />;
    case 'pdf': return <FileText {...iconProps} />;
    case 'image': return <ImageIcon {...iconProps} />;
    case 'video': return <Video {...iconProps} />;
    case 'document': return <FileText {...iconProps} />;
    case 'archive': return <FileArchiveIcon {...iconProps} />;
    default: return <FileText {...iconProps} />;
  }
};

interface AssetRowProps {
  asset: Asset;
  level: number;
  isSelected: boolean;
  onToggleSelect: (assetId: string, selected: boolean) => void;
  isParentSelected: boolean;
}

const AssetRow: FC<AssetRowProps> = ({ asset, level, isSelected, onToggleSelect, isParentSelected }) => {
  const handleCheckedChange = (checked: boolean | 'indeterminate') => {
    if (typeof checked === 'boolean') {
      onToggleSelect(asset.id, checked);
    }
  };
  
  // An asset is effectively selected if it's explicitly selected or its parent is selected and it hasn't been deselected
  const effectivelySelected = isSelected;


  return (
    <div
      className={cn(
        "flex items-center space-x-2 py-1.5 px-2 rounded-md hover:bg-muted/50",
        !effectivelySelected && "opacity-60"
      )}
      style={{ paddingLeft: `${0.5 + level * 1.25}rem` }}
    >
      <Checkbox
        id={`asset-${asset.id}`}
        checked={isSelected}
        onCheckedChange={handleCheckedChange}
        aria-label={`Select ${asset.name}`}
      />
      <AssetIcon type={asset.type} className="text-muted-foreground" />
      <label htmlFor={`asset-${asset.id}`} className="text-sm truncate cursor-pointer flex-grow" title={asset.name}>
        {asset.name}
      </label>
      {asset.type !== 'folder' && asset.size && (
        <span className="text-xs text-muted-foreground whitespace-nowrap">{asset.size}</span>
      )}
    </div>
  );
};


export default function DownloadKitModal({ isOpen, onOpenChange, assets, onDownloadConfirm }: DownloadKitModalProps) {
  const [selectedAssetIds, setSelectedAssetIds] = useState<Record<string, boolean>>({});
  const [estimatedSizeKB, setEstimatedSizeKB] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const getAllAssetIds = useCallback((assetList: Asset[]): string[] => {
    let ids: string[] = [];
    for (const asset of assetList) {
      ids.push(asset.id);
      if (asset.children) {
        ids = ids.concat(getAllAssetIds(asset.children));
      }
    }
    return ids;
  }, []);

  useEffect(() => {
    if (isOpen) {
      const allIds = getAllAssetIds(assets);
      const initialSelection: Record<string, boolean> = {};
      allIds.forEach(id => initialSelection[id] = true);
      setSelectedAssetIds(initialSelection);
    }
  }, [isOpen, assets, getAllAssetIds]);


  const getAssetAndChildrenIds = useCallback((asset: Asset): string[] => {
    let ids = [asset.id];
    if (asset.children) {
      asset.children.forEach(child => {
        ids = ids.concat(getAssetAndChildrenIds(child));
      });
    }
    return ids;
  }, []);

  const handleToggleSelect = useCallback((assetId: string, selected: boolean) => {
    setSelectedAssetIds(prev => {
      const newSelectedIds = { ...prev };
      const assetToToggle = findAssetById(assets, assetId);
      if (assetToToggle) {
        const idsToUpdate = getAssetAndChildrenIds(assetToToggle);
        idsToUpdate.forEach(id => newSelectedIds[id] = selected);
      }
      return newSelectedIds;
    });
  }, [assets, getAssetAndChildrenIds]);

  const findAssetById = (assetList: Asset[], id: string): Asset | null => {
    for (const asset of assetList) {
      if (asset.id === id) return asset;
      if (asset.children) {
        const foundInChildren = findAssetById(asset.children, id);
        if (foundInChildren) return foundInChildren;
      }
    }
    return null;
  };
  

  useEffect(() => {
    let totalSize = 0;
    const calculateSize = (assetList: Asset[], parentSelected: boolean) => {
      for (const asset of assetList) {
        const isSelected = selectedAssetIds[asset.id] ?? parentSelected;
        if (isSelected && asset.type !== 'folder' && asset.size) {
          totalSize += parseSizeToKB(asset.size);
        }
        if (asset.children) {
          calculateSize(asset.children, isSelected);
        }
      }
    };
    calculateSize(assets, true); // Assume root is "selected" for calculation context
    setEstimatedSizeKB(totalSize);
  }, [selectedAssetIds, assets]);

  const handleDownload = () => {
    setIsProcessing(true);
    const confirmedAssets: Asset[] = [];
    const collectSelected = (assetList: Asset[], parentSelected:boolean) => {
      assetList.forEach(asset => {
        const isSelected = selectedAssetIds[asset.id] ?? parentSelected;
        if (isSelected) {
           if (asset.type !== 'folder') { // Only include files in the final list
            confirmedAssets.push(asset);
           }
          if (asset.children) {
            collectSelected(asset.children, isSelected);
          }
        }
      });
    };
    collectSelected(assets, true);
    
    // Simulate processing time
    setTimeout(() => {
      onDownloadConfirm(confirmedAssets);
      setIsProcessing(false);
      onOpenChange(false); // Close modal after confirming
    }, 1000);
  };

  const renderAssetTree = (assetList: Asset[], level = 0, parentIsSelected = true): JSX.Element[] => {
    return assetList.map(asset => {
      const isSelected = selectedAssetIds[asset.id] ?? parentIsSelected;
      return (
        <div key={asset.id}>
          <AssetRow
            asset={asset}
            level={level}
            isSelected={isSelected}
            onToggleSelect={handleToggleSelect}
            isParentSelected={parentIsSelected}
          />
          {asset.children && isSelected && ( // Only render children if parent is selected
            <div className="ml-4 border-l border-dashed border-border pl-2">
                {renderAssetTree(asset.children, level + 1, isSelected)}
            </div>
          )}
        </div>
      );
    });
  };
  

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <PackageDown className="mr-2 h-5 w-5 text-primary" />
            Prepare Kit Download
          </DialogTitle>
          <DialogDescription>
            Select the files and folders you want to include in your ZIP archive.
            The estimated total size will be updated based on your selection.
          </DialogDescription>
        </DialogHeader>

        <div className="border-t border-b py-2 px-3 my-2 bg-muted/30 rounded-md">
            <p className="text-sm font-medium">
              Estimated Download Size: 
              <span className="ml-2 font-bold text-primary">{formatKBToSizeString(estimatedSizeKB)}</span>
            </p>
        </div>

        <ScrollArea className="flex-grow pr-2 -mr-2 my-2 min-h-[200px]">
          <div className="space-y-1">
            {renderAssetTree(assets)}
          </div>
        </ScrollArea>

        <DialogFooter className="mt-auto pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>
            Cancel
          </Button>
          <Button onClick={handleDownload} disabled={isProcessing || estimatedSizeKB === 0}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Preparing...
              </>
            ) : (
              <>
                <Archive className="mr-2 h-4 w-4" />
                Download ZIP (Mock)
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
