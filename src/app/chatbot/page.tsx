
"use client";

import { useState, type FormEvent, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot, User, Send } from 'lucide-react';
import { chat, type ChatInput, type ChatOutput } from '@/ai/flows/chatbotFlow';
import { useAppContext } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}

export default function ChatbotPage() {
  const { mode } = useAppContext();
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when chatHistory changes
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [chatHistory]);

  // Optional: Send an initial greeting from the bot
  useEffect(() => {
    // This can be a predefined message or a call to the flow with an initial empty prompt
    // For simplicity, let's start with an empty history and let the prompt handle the first message.
    /*
    const fetchInitialBotMessage = async () => {
      setIsLoading(true);
      try {
        const response = await chat({ message: "__INITIAL_GREETING__", history: [] }); // Or an empty message
        setChatHistory([{
          id: Date.now().toString() + '-bot-init',
          role: 'model',
          parts: [{ text: response.reply }]
        }]);
      } catch (error) {
        console.error("Error getting initial bot greeting:", error);
        setChatHistory([{
          id: Date.now().toString() + '-error-init',
          role: 'model',
          parts: [{ text: 'Hi there! How can I help you find promo codes today?' }] // Fallback
        }]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialBotMessage();
    */
  }, []);


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const userMessageToAdd: ChatMessage = {
      id: Date.now().toString() + '-user',
      role: 'user',
      parts: [{ text: userInput }],
    };
    
    const currentInputForApi = userInput;
    setUserInput('');
    setIsLoading(true);
    
    // Add user message to history immediately for responsiveness
    setChatHistory((prev) => [...prev, userMessageToAdd]);

    try {
      // Prepare history for the API call
      // This uses the chatHistory state *before* the current userMessageToAdd was added by the setChatHistory call above.
      // This is correct: we want the history up to the point *before* this new message for the API.
      const historyForApi = chatHistory.map(msg => ({
        role: msg.role,
        parts: msg.parts,
      }));
      
      const inputPayload: ChatInput = { message: currentInputForApi, history: historyForApi };
      const response: ChatOutput = await chat(inputPayload);

      const botMessage: ChatMessage = {
        id: Date.now().toString() + '-bot',
        role: 'model',
        parts: [{ text: response.reply }],
      };
      setChatHistory((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error getting chat response:", error);
      const errorMessage: ChatMessage = {
        id: Date.now().toString() + '-error',
        role: 'model',
        parts: [{ text: 'Sorry, I encountered an error. Please try again.' }],
      };
      setChatHistory((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 h-full">
      <Card className={cn(`flex-1 flex flex-col overflow-hidden shadow-xl`, mode === 'gaming' ? 'border-primary' : '')}>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Bot className={`w-8 h-8 ${mode === 'gaming' ? 'text-primary' : 'text-primary'}`} />
            <CardTitle className={`text-3xl font-bold ${mode === 'gaming' ? 'font-orbitron' : ''}`}>
              PromoPulse Chatbot
            </CardTitle>
          </div>
          <CardDescription className={cn(`pt-2`, mode === 'gaming' ? 'text-muted-foreground font-rajdhani' : 'text-muted-foreground')}>
            Your smart assistant for finding the best promo codes!
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
          <ScrollArea className="flex-1 p-4 sm:p-6" ref={scrollAreaRef}>
            <div className="space-y-4">
              {chatHistory.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg shadow-sm max-w-[85%]",
                    msg.role === 'user' 
                      ? 'ml-auto bg-primary text-primary-foreground self-end' 
                      : 'mr-auto bg-muted text-muted-foreground self-start',
                    mode === 'gaming' && msg.role === 'user' ? 'bg-accent text-accent-foreground' : '',
                    mode === 'gaming' && msg.role === 'model' ? 'bg-card-foreground/10 text-foreground' : ''
                  )}
                >
                  <Avatar className="h-8 w-8 border">
                    <AvatarImage src={msg.role === 'model' ? "https://placehold.co/40x40.png" : undefined} alt={msg.role} data-ai-hint={msg.role === 'user' ? 'user avatar' : 'robot mascot'} />
                    <AvatarFallback className={cn(msg.role === 'user' ? 'bg-primary/20' : 'bg-muted-foreground/20')}>
                      {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 whitespace-pre-wrap py-1">{msg.parts[0].text}</div>
                </div>
              ))}
              {isLoading && (
                <div className={cn("flex items-start gap-3 p-3 rounded-lg shadow-sm max-w-[85%] mr-auto bg-muted text-muted-foreground self-start", mode === 'gaming' ? 'bg-card-foreground/10 text-foreground' : '' )}>
                   <Avatar className="h-8 w-8 border">
                    <AvatarImage src="https://placehold.co/40x40.png" alt="bot typing" data-ai-hint="robot mascot"/>
                    <AvatarFallback className={cn('bg-muted-foreground/20')}><Bot className="h-4 w-4" /></AvatarFallback>
                  </Avatar>
                  <div className="animate-pulse py-1">PromoBot is thinking...</div>
                </div>
              )}
            </div>
          </ScrollArea>
          <div className="p-4 border-t bg-background/80 backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <Input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Ask for promo codes, e.g., 'Nike shoes' or 'Steam game discount'"
                className="flex-1 text-base"
                disabled={isLoading}
                aria-label="Chat message input"
              />
              <Button type="submit" disabled={isLoading} className={cn(mode === 'gaming' ? 'button-glow-gaming' : 'button-glow-normal', 'px-4 py-2')}>
                <Send className="h-5 w-5" />
                <span className="sr-only">Send message</span>
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

    