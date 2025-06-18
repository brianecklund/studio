
'use client';

import { useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Loader2, UploadCloud } from 'lucide-react';

interface AdminAttentionRequestModalProps {
  asset: Asset | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AdminAttentionRequestModal({ asset, isOpen, onOpenChange }: AdminAttentionRequestModalProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadNotes, setUploadNotes] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !asset) {
      toast({
        title: 'No file selected',
        description: 'Please select a file to upload.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    // Simulate API call for upload
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log('Uploading new version for asset:', asset.name);
    console.log('File:', selectedFile.name, selectedFile.size, selectedFile.type);
    console.log('Upload Notes:', uploadNotes);
    
    toast({
      title: 'Upload Successful (Mock)',
      description: `New version of ${asset.name} (${selectedFile.name}) uploaded. Notes: ${uploadNotes || 'N/A'}`,
    });
    setIsUploading(false);
    setSelectedFile(null);
    setUploadNotes('');
    onOpenChange(false); 
    // In a real app, you would refetch asset data or update local state
  };

  const handleModalClose = () => {
    if (!isUploading) {
      setSelectedFile(null);
      setUploadNotes('');
      onOpenChange(false);
    }
  }

  if (!asset) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleModalClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Review Client Request: {asset.name}</DialogTitle>
          <DialogDescription>
            Client has marked this asset for attention. Review their request and upload a new version if needed.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="clientRequestDetails" className="font-semibold">Client's Request/Issue:</Label>
            <p id="clientRequestDetails" className="mt-1 text-sm text-muted-foreground p-3 bg-muted/50 rounded-md whitespace-pre-wrap">
              {asset.clientRequestDetails || 'No specific details provided by the client.'}
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fileUpload" className="font-semibold">Upload New Version:</Label>
            <Input id="fileUpload" type="file" onChange={handleFileChange} disabled={isUploading} />
            {selectedFile && <p className="text-xs text-muted-foreground">Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="uploadNotes" className="font-semibold">Notes for this version (optional):</Label>
            <Textarea 
              id="uploadNotes" 
              placeholder="e.g., Addressed client feedback, updated statistics..." 
              value={uploadNotes}
              onChange={(e) => setUploadNotes(e.target.value)}
              rows={3}
              disabled={isUploading}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleModalClose} disabled={isUploading}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={isUploading || !selectedFile}>
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <UploadCloud className="mr-2 h-4 w-4" />
                Upload New Version
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
