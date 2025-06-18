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
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { useState, type ReactNode } from 'react';
import { Loader2, Lightbulb, Sparkles } from 'lucide-react';
import { suggestMissingAssets, SuggestMissingAssetsInput, SuggestMissingAssetsOutput } from '@/ai/flows/suggest-missing-assets';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';

const aiSuggestionFormSchema = z.object({
  previousRequests: z.string().min(10, {
    message: 'Please provide some details about previous requests (min 10 characters).',
  }),
  currentBrandKitContent: z.string().min(10, {
    message: 'Please provide some details about current brand kit content (min 10 characters).',
  }),
});

type AiSuggestionFormValues = z.infer<typeof aiSuggestionFormSchema>;

interface AiSuggestionModalProps {
  triggerButton: ReactNode;
  currentBrandKitContent: string;
  previousRequests: string;
}

export default function AiSuggestionModal({ triggerButton, currentBrandKitContent, previousRequests }: AiSuggestionModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestMissingAssetsOutput | null>(null);

  const form = useForm<AiSuggestionFormValues>({
    resolver: zodResolver(aiSuggestionFormSchema),
    defaultValues: {
      previousRequests: previousRequests,
      currentBrandKitContent: currentBrandKitContent,
    },
  });

  async function onSubmit(data: AiSuggestionFormValues) {
    setIsSubmitting(true);
    setSuggestions(null); 
    try {
      const input: SuggestMissingAssetsInput = {
        previousRequests: data.previousRequests,
        currentBrandKitContent: data.currentBrandKitContent,
      };
      const result = await suggestMissingAssets(input);
      setSuggestions(result);
      toast({
        title: 'Suggestions Generated!',
        description: 'AI has provided some asset suggestions for your brand kit.',
      });
    } catch (error) {
      console.error("AI Suggestion Error:", error);
      toast({
        title: 'Error Generating Suggestions',
        description: 'An unexpected error occurred while fetching AI suggestions. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset suggestions and form when closing
      setSuggestions(null);
      form.reset({
        previousRequests: previousRequests,
        currentBrandKitContent: currentBrandKitContent,
      });
    }
  }


  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Lightbulb className="mr-2 h-5 w-5 text-accent" />
            AI Asset Suggestions
          </DialogTitle>
          <DialogDescription>
            Let our AI analyze your current brand kit and past requests to suggest potentially missing assets.
          </DialogDescription>
        </DialogHeader>
        
        {!suggestions ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 overflow-y-auto px-1">
              <FormField
                control={form.control}
                name="currentBrandKitContent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Brand Kit Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the main assets currently in your brand kit (e.g., Primary Logo, Color Palette, Typography Guidelines, Business Card Template)."
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="previousRequests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Summary of Previous Requests</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Briefly summarize any past requests for new assets or significant updates (e.g., Requested social media templates, an icon set, email signatures)."
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Get Suggestions
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <ScrollArea className="flex-grow pr-6 max-h-[calc(90vh-200px)]">
            <div className="space-y-4 my-4">
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline text-lg">Suggested Assets</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line">{suggestions.suggestedAssets}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline text-lg">Reasoning</CardTitle>
                </CardHeader>
                <CardContent>
                   <p className="whitespace-pre-line">{suggestions.reasoning}</p>
                </CardContent>
              </Card>
            </div>
            <DialogFooter className="pt-4">
              <Button variant="outline" onClick={() => setSuggestions(null)}>
                Refine Inputs
              </Button>
              <Button onClick={() => handleOpenChange(false)}>
                Close
              </Button>
            </DialogFooter>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}
