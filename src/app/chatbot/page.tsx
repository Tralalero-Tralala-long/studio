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

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

export default function ChatbotPage() {
  const { mode } = useAppContext();
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString() + '-user',
      text: userInput,
      sender: 'user',
    };
    setChatHistory((prev) => [...prev, userMessage]);
    const currentInput = userInput;
    setUserInput('');
    setIsLoading(true);

    try {
      const input: ChatInput = { message: currentInput };
      const response: ChatOutput = await chat(input);

      const botMessage: Message = {
        id: Date.now().toString() + '-bot',
        text: response.reply,
        sender: 'bot',
      };
      setChatHistory((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error getting chat response:", error);
      const errorMessage: Message = {
        id: Date.now().toString() + '-error',
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
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
            Ask me anything about promo codes or our services!
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
                    msg.sender === 'user' 
                      ? 'ml-auto bg-primary text-primary-foreground self-end' 
                      : 'mr-auto bg-muted text-muted-foreground self-start',
                    mode === 'gaming' && msg.sender === 'user' ? 'bg-accent text-accent-foreground' : '',
                    mode === 'gaming' && msg.sender === 'bot' ? 'bg-card-foreground/10 text-foreground' : ''
                  )}
                >
                  <Avatar className="h-8 w-8 border">
                    <AvatarImage src={msg.sender === 'bot' ? "https://placehold.co/40x40.png" : undefined} alt={msg.sender} data-ai-hint={msg.sender === 'user' ? 'user avatar' : 'robot mascot'} />
                    <AvatarFallback className={cn(msg.sender === 'user' ? 'bg-primary/20' : 'bg-muted-foreground/20')}>
                      {msg.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 whitespace-pre-wrap py-1">{msg.text}</div>
                </div>
              ))}
              {isLoading && (
                <div className={cn("flex items-start gap-3 p-3 rounded-lg shadow-sm max-w-[85%] mr-auto bg-muted text-muted-foreground self-start", mode === 'gaming' ? 'bg-card-foreground/10 text-foreground' : '' )}>
                   <Avatar className="h-8 w-8 border">
                    <AvatarImage src="https://placehold.co/40x40.png" alt="bot typing" data-ai-hint="robot mascot"/>
                    <AvatarFallback className={cn('bg-muted-foreground/20')}><Bot className="h-4 w-4" /></AvatarFallback>
                  </Avatar>
                  <div className="animate-pulse py-1">Typing...</div>
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
                placeholder="Type your message..."
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
