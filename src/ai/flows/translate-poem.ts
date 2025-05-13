'use server';

/**
 * @fileOverview Poem translation flow.
 *
 * This file defines a Genkit flow to translate a given poem to a specified language.
 * It includes the necessary input and output schemas, and the flow definition.
 *
 * @fileOverview Defines the poem translation flow.
 * @fileExport {function} translatePoem - The function to translate the poem.
 * @fileExport {interface} TranslatePoemInput - The input type for the translatePoem function.
 * @fileExport {interface} TranslatePoemOutput - The output type for the translatePoem function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslatePoemInputSchema = z.object({
  poem: z.string().describe('The poem to translate.'),
  language: z.string().describe('The target language for the translation.'),
});

export type TranslatePoemInput = z.infer<typeof TranslatePoemInputSchema>;

const TranslatePoemOutputSchema = z.object({
  translatedPoem: z.string().describe('The translated poem.'),
});

export type TranslatePoemOutput = z.infer<typeof TranslatePoemOutputSchema>;

export async function translatePoem(input: TranslatePoemInput): Promise<TranslatePoemOutput> {
  return translatePoemFlow(input);
}

const translatePoemPrompt = ai.definePrompt({
  name: 'translatePoemPrompt',
  input: {schema: TranslatePoemInputSchema},
  output: {schema: TranslatePoemOutputSchema},
  prompt: `Translate the following poem to {{language}}:\n\n{{{poem}}}`,
});

const translatePoemFlow = ai.defineFlow(
  {
    name: 'translatePoemFlow',
    inputSchema: TranslatePoemInputSchema,
    outputSchema: TranslatePoemOutputSchema,
  },
  async input => {
    const {output} = await translatePoemPrompt(input);
    return output!;
  }
);
