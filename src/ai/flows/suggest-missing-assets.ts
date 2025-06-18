'use server';

/**
 * @fileOverview AI-driven suggestions for potential missing brand assets.
 *
 * - suggestMissingAssets - A function that suggests missing brand assets.
 * - SuggestMissingAssetsInput - The input type for the suggestMissingAssets function.
 * - SuggestMissingAssetsOutput - The return type for the suggestMissingAssets function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestMissingAssetsInputSchema = z.object({
  previousRequests: z
    .string()
    .describe('A summary of the client previous requests for assets.'),
  currentBrandKitContent: z
    .string()
    .describe('A description of the current content of the brand kit.'),
});
export type SuggestMissingAssetsInput = z.infer<typeof SuggestMissingAssetsInputSchema>;

const SuggestMissingAssetsOutputSchema = z.object({
  suggestedAssets: z
    .string()
    .describe('A list of suggested brand assets that may be missing.'),
  reasoning: z
    .string()
    .describe('The AI reasoning behind the suggested assets.'),
});
export type SuggestMissingAssetsOutput = z.infer<typeof SuggestMissingAssetsOutputSchema>;

export async function suggestMissingAssets(input: SuggestMissingAssetsInput): Promise<SuggestMissingAssetsOutput> {
  return suggestMissingAssetsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestMissingAssetsPrompt',
  input: {schema: SuggestMissingAssetsInputSchema},
  output: {schema: SuggestMissingAssetsOutputSchema},
  prompt: `You are an AI assistant that specializes in suggesting brand assets that may be missing from a brand kit.

  Analyze the client's previous requests and the current content of their brand kit to identify potential gaps.

  Previous Requests: {{{previousRequests}}}
  Current Brand Kit Content: {{{currentBrandKitContent}}}

  Based on this information, suggest a list of brand assets that may be missing and provide reasoning for each suggestion.

  Format the output as a list of suggested assets with a brief explanation of why each asset is needed.
  `,
});

const suggestMissingAssetsFlow = ai.defineFlow(
  {
    name: 'suggestMissingAssetsFlow',
    inputSchema: SuggestMissingAssetsInputSchema,
    outputSchema: SuggestMissingAssetsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
