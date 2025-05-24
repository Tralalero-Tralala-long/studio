
"use client";

import { useState, type FormEvent, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot, User, Send } from 'lucide-react';
import { chat, type ChatInput, type ChatOutput } from '@/ai/flows/chatbotFlow';
import { useAppContext, type PromoExample } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';

// Import initial data from other pages
import { initialPromoExamples as homeTabsPromoExamples } from '@/components/home/HomeTabs';
import { initialBloxFruitsCodes } from '../roblox-codes/blox-fruits/page';
import { initialFortniteCodes } from '../fortnite-codes/page';
import { initialFreeFireCodes } from '../free-fire-codes/page';
import { initialBrawlStarsCodes } from '../brawl-stars-codes/page';
import { initialMyntraCodes } from '../ecommerce-codes/myntra/page';
import { initialFlipkartCodes } from '../ecommerce-codes/flipkart/page';
import { initialAmazonCodes } from '../ecommerce-codes/amazon/page';
import { initialBlinkitCodes } from '../ecommerce-codes/blinkit/page';
import { initialZomatoCodes } from '../delivery-codes/zomato/page';
import { initialSwiggyCodes } from '../delivery-codes/swiggy/page';
import { initialDunzoCodes } from '../delivery-codes/dunzo/page';
import { initialByjusCodes } from '../education-codes/byjus/page';
import { initialTopprCodes } from '../education-codes/toppr/page';
import { initialUdemyCodes } from '../education-codes/udemy/page';


interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}

// Helper function to get initial codes
const getAllPromoCodes = (): PromoExample[] => {
  const allCodes: PromoExample[] = [
    ...homeTabsPromoExamples,
    ...initialBloxFruitsCodes.map(c => ({...c, reward: c.reward || c.description })),
    ...initialFortniteCodes,
    ...initialFreeFireCodes,
    ...initialBrawlStarsCodes,
    ...initialMyntraCodes,
    ...initialFlipkartCodes,
    ...initialAmazonCodes,
    ...initialBlinkitCodes,
    ...initialZomatoCodes,
    ...initialSwiggyCodes,
    ...initialDunzoCodes,
    ...initialByjusCodes,
    ...initialTopprCodes,
    ...initialUdemyCodes,
  ];
  // Remove duplicates by code, just in case
  const uniqueCodes = Array.from(new Map(allCodes.map(code => [code.code, code])).values());
  return uniqueCodes;
};


export default function ChatbotPage() {
  const { mode } = useAppContext();
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [availableCodes, setAvailableCodes] = useState<PromoExample[]>([]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [chatHistory]);

  useEffect(() => {
    setAvailableCodes(getAllPromoCodes());
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
    
    setChatHistory((prev) => [...prev, userMessageToAdd]);

    try {
      const historyForApi = chatHistory.map(msg => ({
        role: msg.role,
        parts: msg.parts,
      }));
      
      const inputPayload: ChatInput = { 
        message: currentInputForApi, 
        history: historyForApi,
        availablePromoCodes: availableCodes 
      };
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
            Your smart assistant for finding the best promo codes! Ask me anything.
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
