'use server';
/**
 * @fileOverview A simple chatbot flow.
 *
 * - chat - A function that handles a user's chat message.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit'; // Genkit v1.x uses 'genkit' for z

export const ChatInputSchema = z.object({
  message: z.string().describe('The user message to the chatbot.'),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

export const ChatOutputSchema = z.object({
  reply: z.string().describe('The chatbot\'s reply.'),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

// Wrapper function to be called by the UI
export async function chat(input: ChatInput): Promise<ChatOutput> {
  return simpleChatFlow(input);
}

const chatPrompt = ai.definePrompt({
  name: 'chatbotPrompt',
  input: {schema: ChatInputSchema},
  output: {schema: ChatOutputSchema},
  prompt: `You are a helpful assistant for PromoPulse, an app that helps users find promo codes for shopping and gaming. Be friendly and concise.

User: {{{message}}}
Assistant:`,
});

const simpleChatFlow = ai.defineFlow(
  {
    name: 'simpleChatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (input: ChatInput) => {
    const {output} = await chatPrompt(input);
    if (!output) {
      // This case should ideally be rare if the model and prompt are well-defined.
      // Consider more specific error handling or a default reply if needed.
      return { reply: "I'm sorry, I couldn't generate a response at this moment." };
    }
    return output;
  }
);
