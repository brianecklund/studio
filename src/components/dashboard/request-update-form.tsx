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
  DialogTrigger,
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
import type { Asset } from '@/lib/types';
import { toast } from '@/hooks/use-toast';
import { useState, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

// Mock server action
async function submitUpdateRequest(data: UpdateRequestFormValues): Promise<{ success: boolean; message: string }> {
  console.log('Submitting update request:', data);
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  // Simulate success/failure
  if (data.details.toLowerCase().includes("fail")) {
    return { success: false, message: "Failed to submit request. Please try again." };
  }
  return { success: true, message: `Update request for "${data.assetName}" submitted successfully!` };
}


const updateRequestFormSchema = z.object({
  assetId: z.string(),
  assetName: z.string(),
  details: z.string().min(10, {
    message: 'Please provide at least 10 characters for the update details.',
  }),
  // Add other fields like priority, attachments if needed
});

type UpdateRequestFormValues = z.infer<typeof updateRequestFormSchema>;

interface RequestUpdateFormProps {
  asset: Asset;
  triggerButton: ReactNode;
}

export default function RequestUpdateForm({ asset, triggerButton }: RequestUpdateFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UpdateRequestFormValues>({
    resolver: zodResolver(updateRequestFormSchema),
    defaultValues: {
      assetId: asset.id,
      assetName: asset.name,
      details: '',
    },
  });

  async function onSubmit(data: UpdateRequestFormValues) {
    setIsSubmitting(true);
    try {
      const result = await submitUpdateRequest(data);
      if (result.success) {
        toast({
          title: 'Success!',
          description: result.message,
        });
        setIsOpen(false);
        form.reset();
      } else {
        toast({
          title: 'Error',
          description: result.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Request Update for: {asset.name}</DialogTitle>
          <DialogDescription>
            Describe the changes you need for this asset. Please be as specific as possible.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="assetName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asset Name</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly disabled className="bg-muted/50" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Update Details</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Change the background color to blue, update the text to..."
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Request'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
