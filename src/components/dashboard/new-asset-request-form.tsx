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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { AssetType } from '@/lib/types';
import { toast } from '@/hooks/use-toast';
import { useState, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

// Mock server action
async function submitNewAssetRequest(data: NewAssetRequestFormValues): Promise<{ success: boolean; message: string }> {
  console.log('Submitting new asset request:', data);
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
   if (data.projectName.toLowerCase().includes("fail")) {
    return { success: false, message: "Failed to submit request. Please try again." };
  }
  return { success: true, message: `New asset request for "${data.projectName}" submitted successfully!` };
}

const assetTypes: AssetType[] = ['image', 'pdf', 'video', 'document', 'archive', 'folder', 'other'];

const newAssetRequestFormSchema = z.object({
  projectName: z.string().min(3, {
    message: 'Project name must be at least 3 characters.',
  }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }),
  assetType: z.enum(assetTypes as [AssetType, ...AssetType[]], { // z.enum requires at least one value
    required_error: "You need to select an asset type.",
  }),
  // desiredDueDate: z.date().optional(), // Could use shadcn/ui Calendar for this
});

type NewAssetRequestFormValues = z.infer<typeof newAssetRequestFormSchema>;

interface NewAssetRequestFormProps {
  triggerButton: ReactNode;
}

export default function NewAssetRequestForm({ triggerButton }: NewAssetRequestFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<NewAssetRequestFormValues>({
    resolver: zodResolver(newAssetRequestFormSchema),
    defaultValues: {
      projectName: '',
      description: '',
      assetType: undefined,
    },
  });

  async function onSubmit(data: NewAssetRequestFormValues) {
    setIsSubmitting(true);
    try {
      const result = await submitNewAssetRequest(data);
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
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Request New Asset or Project</DialogTitle>
          <DialogDescription>
            Fill in the details below to request a new brand asset or start a new project.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="projectName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project/Asset Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Summer Campaign Logo, New Website Banners" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="assetType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asset Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an asset type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {assetTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description & Requirements</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide details about the asset, specifications, intended use, etc."
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Add Due Date Picker here if needed */}
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
