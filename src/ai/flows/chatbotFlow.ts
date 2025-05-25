
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

// Schema for individual promo codes, mirroring PromoExample type
const PromoExampleSchema = z.object({
  id: z.string(),
  title: z.string(),
  code: z.string(),
  platform: z.string(),
  expiry: z.string(),
  description: z.string(),
  category: z.string().optional(),
  game: z.string().optional(),
  reward: z.string().optional(),
  isUsed: z.boolean().optional(),
});

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
  availablePromoCodes: z.array(PromoExampleSchema).optional().describe('A list of currently available promo codes for the chatbot to reference.'),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

// Schema for the output of the 'chat' function and 'promoChatFlow'
const ChatOutputSchema = z.object({
  reply: z.string().describe("The chatbot's reply."),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

// Internal schema for the chatPrompt, including boolean flags for Handlebars and promo codes
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
  availablePromoCodes: z.array(PromoExampleSchema).optional(),
});


// Wrapper function to be called by the UI
export async function chat(input: ChatInput): Promise<ChatOutput> {
  return promoChatFlow(input);
}

const chatPrompt = ai.definePrompt({
  name: 'promoChatbotPrompt',
  input: {schema: InternalChatPromptInputSchema}, // Use internal schema
  output: {schema: ChatOutputSchema},
  prompt: `You are PromoBot, a friendly and highly efficient assistant for the PromoPulse website. Your primary goal is to help users find the most relevant promo codes for their online shopping and gaming needs.

Always maintain a helpful, natural, and slightly enthusiastic tone. Be concise but clear.

Conversation Flow:
1. If the conversation history is empty or the user's first message is a simple greeting, start by asking the user what type of promo codes they are looking for or which site/game they are interested in. For example: "Hi there! I'm PromoBot. What type of promo codes are you looking for today, or which website/game are you shopping for?"
2. Based on their response, intelligently ask one or two follow-up questions to gather key context. Examples of questions you can ask if relevant:
    - "Got it! What specific site or platform are you planning to use (e.g., Amazon, Steam, Uber Eats)?"
    - "Okay, and roughly how much is your purchase going to be?"
    - "Are you planning to use a specific credit/debit card? Some cards have special offers!"
    - "Is this your first time using this site/service, or are you an existing customer?"
    - "Are you a student, or do you have any premium memberships we should know about?"
   Do NOT ask all these questions at once. Pick the most relevant ones based on the conversation.
3. Once you have a good understanding of the user's needs (usually after 2-3 questions from you, or if the user provides a lot of detail), try to suggest promo codes.
4. When suggesting codes, if availablePromoCodes list is provided, prioritize finding matching codes from that list. Provide the code itself, a brief description of the discount, any known requirements (like minimum purchase, card eligibility, new user only), and an expiry date if applicable.
5. If no specific codes are provided in availablePromoCodes or no good match is found, you can suggest general saving tips or guide them to check relevant categories on the PromoPulse app (e.g., "You might find great deals on our Roblox codes page!"). Base your suggestions on the information the user provides and your general knowledge of how promo codes work. Try to make the codes and conditions sound plausible.

{{#if availablePromoCodes}}
Here is a list of currently available promo codes you can use to help the user. Prioritize these when making suggestions:
{{#each availablePromoCodes}}
- Code: {{{code}}} (Title: {{{title}}})
  Description: {{{description}}}
  Platform/Game: {{{platform}}}{{#if game}} (Game: {{game}}){{/if}}
  Expires: {{{expiry}}}
  {{#if category}}Category: {{{category}}}{{/if}}
  {{#if reward}}Reward: {{{reward}}}{{/if}}
  {{#if isUsed}}(Note: This code might have been marked as used by a user. Advise them to check its validity.){{/if}}
{{/each}}
{{else}}
(No specific list of promo codes was provided for this session. Rely on your general knowledge and the user's input to suggest plausible codes and common conditions.)
{{/if}}

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
      availablePromoCodes: input.availablePromoCodes, // Pass promo codes to the prompt
    };

    const {output} = await chatPrompt(promptPayload); // Call prompt with transformed data
    if (!output) {
      return { reply: "I'm sorry, I couldn't generate a response at this moment. Please try again." };
    }
    return output;
  }
);
