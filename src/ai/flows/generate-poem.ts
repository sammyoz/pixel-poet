// src/ai/flows/generate-poem.ts
'use server';

/**
 * @fileOverview Generates a poem inspired by an image, with language selection.
 *
 * - generatePoem - A function that handles the poem generation process.
 * - GeneratePoemInput - The input type for the generatePoem function.
 * - GeneratePoemOutput - The return type for the generatePoem function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePoemInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo to inspire the poem, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  language: z.string().describe('The language in which to generate the poem.'),
});
export type GeneratePoemInput = z.infer<typeof GeneratePoemInputSchema>;

const PoemDetailsSchema = z.object({
  tone: z.string().describe('The tone of the poem (e.g., happy, sad, reflective).'),
  theme: z.string().describe('The theme of the poem (e.g., nature, love, loss).'),
});

const GeneratePoemOutputSchema = z.object({
  poem: z.string().describe('The generated poem.'),
});
export type GeneratePoemOutput = z.infer<typeof GeneratePoemOutputSchema>;


const decidePoemDetails = ai.defineTool({
  name: 'decidePoemDetails',
  description: 'Determine the tone and theme of the poem based on the image.',
  inputSchema: z.object({
    photoDataUri: z
      .string()
      .describe(
        "A photo to inspire the poem, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
      ),
  }),
  outputSchema: PoemDetailsSchema,
},
async (input) => {
  // Mock implementation of tone and theme selection
  // In a real application, this would use an LLM to analyze the image and determine the appropriate tone and theme.
  return {tone: 'reflective', theme: 'nature'};
});

export async function generatePoem(input: GeneratePoemInput): Promise<GeneratePoemOutput> {
  return generatePoemFlow(input);
}

const poemPrompt = ai.definePrompt({
  name: 'poemPrompt',
  input: {schema: GeneratePoemInputSchema},
  output: {schema: GeneratePoemOutputSchema},
  tools: [decidePoemDetails],
  prompt: `You are a poet. Generate a poem inspired by the image in the language specified by the user.

  Consider the following when writing the poem:
  - The language to generate the poem in is: {{{language}}}
  - Use the decidePoemDetails tool to determine the tone and theme of the poem.

  Image: {{media url=photoDataUri}}
  `,
});

const generatePoemFlow = ai.defineFlow(
  {
    name: 'generatePoemFlow',
    inputSchema: GeneratePoemInputSchema,
    outputSchema: GeneratePoemOutputSchema,
  },
  async input => {
    const poemDetails = await decidePoemDetails({photoDataUri: input.photoDataUri});
    const {output} = await poemPrompt(input);
    return output!;
  }
);

