
'use client';

import type { Asset, ClientSubmittedRequest } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, CalendarClock, Paperclip } from 'lucide-react';
import { format } from 'date-fns';

interface ViewMyRequestModalProps {
  assetName: string | null;
  request: ClientSubmittedRequest | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ViewMyRequestModal({ assetName, request, isOpen, onOpenChange }: ViewMyRequestModalProps) {
  if (!request || !assetName) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Your Request for: {assetName}</DialogTitle>
          <DialogDescription>
            Details of the update request you submitted on {format(new Date(request.submittedAt), 'PPp')}.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] my-4 pr-3">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-sm mb-1 flex items-center">
                <FileText className="mr-2 h-4 w-4 text-primary" />
                Request Details:
              </h4>
              <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md whitespace-pre-wrap">
                {request.details}
              </p>
            </div>

            {request.requestedDelivery && (
              <div>
                <h4 className="font-semibold text-sm mb-1 flex items-center">
                  <CalendarClock className="mr-2 h-4 w-4 text-primary" />
                  Requested Delivery:
                </h4>
                <p className="text-sm text-muted-foreground">{request.requestedDelivery}</p>
              </div>
            )}

            {request.referenceFileNames && request.referenceFileNames.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm mb-1 flex items-center">
                  <Paperclip className="mr-2 h-4 w-4 text-primary" />
                  Reference Files Submitted:
                </h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-0.5">
                  {request.referenceFileNames.map((fileName, index) => (
                    <li key={index}>{fileName}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
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
