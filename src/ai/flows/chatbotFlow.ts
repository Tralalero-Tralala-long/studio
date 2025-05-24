
'use server';
/**
 * @fileOverview A conversational AI chatbot for finding promo codes.
 *
 * - chat - A function that handles a user's chat message and conversation history.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit'; // Genkit v1.x uses 'genkit' for z

// Schema for the public 'chat' function and 'promoChatFlow' input
const ChatInputSchema = z.object({
  message: z.string().describe('The user message to the chatbot.'),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'model']),
        parts: z.array(z.object({text: z.string()})),
      })
    )
    .optional()
    .describe(
      'The history of the conversation. Model messages are from the assistant, user messages are from the user.'
    ),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

// Schema for the output of the 'chat' function and 'promoChatFlow'
const ChatOutputSchema = z.object({
  reply: z.string().describe("The chatbot's reply."),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

// Internal schema for the chatPrompt, including boolean flags for Handlebars
const InternalChatPromptInputSchema = z.object({
  message: z.string().describe('The user message to the chatbot.'),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'model']), // Keep original role
        parts: z.array(z.object({text: z.string()})),
        isUser: z.boolean(), // True if role is 'user'
        isModel: z.boolean(), // True if role is 'model'
      })
    )
    .optional(),
});


// Wrapper function to be called by the UI
export async function chat(input: ChatInput): Promise<ChatOutput> {
  return promoChatFlow(input);
}

const chatPrompt = ai.definePrompt({
  name: 'promoChatbotPrompt',
  input: {schema: InternalChatPromptInputSchema}, // Use internal schema with boolean flags
  output: {schema: ChatOutputSchema},
  prompt: `You are PromoBot, a friendly and highly efficient assistant for the PromoPulse website. Your primary goal is to help users find the most relevant promo codes for their online shopping and gaming needs.

Always maintain a helpful, natural, and slightly enthusiastic tone. Be concise but clear.

Conversation Flow:
1. If the conversation history is empty or the user's first message is a simple greeting, start by asking the user what they are trying to buy or which site/game they are interested in. For example: "Hi there! I'm PromoBot. What are you looking to buy today, or which website/game are you shopping for?"
2. Based on their response, intelligently ask one or two follow-up questions to gather key context. Examples of questions you can ask if relevant:
    - "Got it! What specific site or platform are you planning to use (e.g., Amazon, Steam, Uber Eats)?"
    - "Okay, and roughly how much is your purchase going to be?"
    - "Are you planning to use a specific credit/debit card? Some cards have special offers!"
    - "Is this your first time using this site/service, or are you an existing customer?"
    - "Are you a student, or do you have any premium memberships we should know about?"
   Do NOT ask all these questions at once. Pick the most relevant ones based on the conversation.
3. Once you have a good understanding of the user's needs (usually after 2-3 questions from you, or if the user provides a lot of detail), try to suggest promo codes.
4. When suggesting codes, act as if you have searched a comprehensive database. Provide the code itself, a brief description of the discount, any known requirements (like minimum purchase, card eligibility, new user only), and an expiry date if applicable. If you don't have a specific code for a very niche request, you can suggest general saving tips or guide them to check relevant categories on the PromoPulse app (e.g., "You might find great deals on our Roblox codes page!").

Important: You don't have direct access to a live database of promo codes for this conversation. Base your suggestions on the information the user provides and your general knowledge of how promo codes work. If the user asks for a code for "X," and you think a common type of code for "X" is "SAVE20 for 20% off," you can suggest that, and mention common conditions. Try to make the codes and conditions sound plausible.

Let's look at the conversation so far to understand the context.

Chat History:
{{#if history}}
  {{#each history}}
    {{#if isUser}}User: {{parts.0.text}}{{/if}}
    {{#if isModel}}Assistant: {{parts.0.text}}{{/if}}
  {{/each}}
{{else}}
(No previous messages in this session)
{{/if}}

Current User Message: {{{message}}}
Assistant:`,
});

const promoChatFlow = ai.defineFlow(
  {
    name: 'promoChatFlow',
    inputSchema: ChatInputSchema, // Public flow uses ChatInputSchema
    outputSchema: ChatOutputSchema,
  },
  async (input: ChatInput) => {
    // Transform history for the prompt
    const transformedHistory = input.history?.map(msg => ({
      ...msg,
      isUser: msg.role === 'user',
      isModel: msg.role === 'model',
    }));

    const promptPayload = {
      message: input.message,
      history: transformedHistory,
    };

    const {output} = await chatPrompt(promptPayload); // Call prompt with transformed data
    if (!output) {
      return { reply: "I'm sorry, I couldn't generate a response at this moment. Please try again." };
    }
    return output;
  }
);
