
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Asset, ClientSubmittedRequest } from '@/lib/types';
import { toast } from '@/hooks/use-toast';
import { useState, type ChangeEvent } from 'react';
import { Loader2, CalendarClock, Paperclip, Send } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const requestSchema = z.object({
  details: z.string().min(10, { message: 'Request details must be at least 10 characters.' }),
  requestedDeliveryDate: z.date().optional(),
  requestedDeliveryTime: z.string().optional().refine(value => !value || /^([01]\d|2[0-3]):([0-5]\d)$/.test(value), {
    message: "Invalid time format. Please use HH:MM (24-hour).",
  }),
  // File uploads are handled separately, not part of Zod schema for direct form data
});

type ClientUpdateRequestFormValues = z.infer<typeof requestSchema>;

interface ClientUpdateRequestModalProps {
  asset: Asset | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateRequestSubmit: (assetId: string, requestData: ClientSubmittedRequest) => void;
}

export default function ClientUpdateRequestModal({ asset, isOpen, onOpenChange, onUpdateRequestSubmit }: ClientUpdateRequestModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referenceFiles, setReferenceFiles] = useState<File[]>([]);

  const form = useForm<ClientUpdateRequestFormValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      details: '',
      requestedDeliveryDate: undefined,
      requestedDeliveryTime: '',
    },
  });

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setReferenceFiles(Array.from(event.target.files));
    }
  };

  async function onSubmit(data: ClientUpdateRequestFormValues) {
    if (!asset) return;
    setIsSubmitting(true);

    let requestedDeliveryString = '';
    if (data.requestedDeliveryDate) {
      requestedDeliveryString = format(data.requestedDeliveryDate, 'PPP');
      if (data.requestedDeliveryTime) {
        requestedDeliveryString += ` at ${data.requestedDeliveryTime}`;
      }
    } else if (data.requestedDeliveryTime) {
      // Handle time only if date is not set (might be less common but good to consider)
       requestedDeliveryString = `Time: ${data.requestedDeliveryTime}`;
    }


    const requestData: ClientSubmittedRequest = {
      details: data.details,
      referenceFileNames: referenceFiles.map(file => file.name),
      requestedDelivery: requestedDeliveryString || undefined, // Store formatted string or undefined
      submittedAt: new Date().toISOString(),
    };

    // Simulate API call for file upload if needed, then call prop
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

    onUpdateRequestSubmit(asset.id, requestData);

    toast({
      title: 'Request Submitted!',
      description: `Your update request for "${asset.name}" has been sent.`,
    });

    setIsSubmitting(false);
    form.reset();
    setReferenceFiles([]);
    onOpenChange(false);
  }

  const handleModalOpenChange = (open: boolean) => {
    if (!isSubmitting) {
      onOpenChange(open);
      if (!open) {
        form.reset();
        setReferenceFiles([]);
      }
    }
  };

  if (!asset) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleModalOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Request Update for: {asset.name}</DialogTitle>
          <DialogDescription>
            Describe your desired changes, upload reference files, and set a requested delivery date/time.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Update Details & Instructions</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Please change the background color to dark blue. Add our new tagline..."
                      rows={5}
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel htmlFor="referenceFiles">Reference Files (Optional)</FormLabel>
              <FormControl>
                <Input
                  id="referenceFiles"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  disabled={isSubmitting}
                  className="h-auto py-2"
                />
              </FormControl>
              {referenceFiles.length > 0 && (
                <div className="mt-1.5 text-xs text-muted-foreground space-y-0.5">
                  {referenceFiles.map(file => (
                    <p key={file.name} className="truncate">Selected: {file.name}</p>
                  ))}
                </div>
              )}
              <FormMessage />
            </FormItem>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="requestedDeliveryDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Requested Delivery Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal h-10",
                              !field.value && "text-muted-foreground"
                            )}
                            disabled={isSubmitting}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarClock className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date(new Date().setHours(0,0,0,0)) || isSubmitting }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="requestedDeliveryTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Requested Time (HH:MM)</FormLabel>
                    <FormControl>
                      <Input 
                        type="time" 
                        {...field} 
                        className="h-10"
                        disabled={isSubmitting}
                       />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => handleModalOpenChange(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" /> 
                )}
                Submit Request
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
