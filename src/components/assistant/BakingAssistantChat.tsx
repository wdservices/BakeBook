'use client';

import { useState, useRef, useEffect } from 'react';
import { useBakingAssistant } from '@/hooks/useBakingAssistant';
import { Loader2, Send, ChefHat, Sparkles, Scale, Calculator, Lightbulb, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type Message = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
};

type QuickAction = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  prompt: string;
};

export function BakingAssistantChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { callAssistant, isLoading } = useBakingAssistant();

  const quickActions: QuickAction[] = [
    {
      id: 'recipe-suggestion',
      title: 'Recipe Ideas',
      description: 'Get recipe suggestions based on ingredients',
      icon: <ChefHat className="h-5 w-5" />,
      prompt: 'Suggest some recipes using what I have in my pantry.',
    },
    {
      id: 'pricing-help',
      title: 'Pricing Help',
      description: 'Calculate pricing for your baked goods',
      icon: <Calculator className="h-5 w-5" />,
      prompt: 'Help me price my custom cake.',
    },
    {
      id: 'baking-tip',
      title: 'Baking Tip',
      description: 'Get a random baking tip',
      icon: <Lightbulb className="h-5 w-5" />,
      prompt: 'Give me a useful baking tip.',
    },
  ];

  useEffect(() => {
    // Add welcome message
    if (messages.length === 0) {
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: 'Hello! I\'m your BakeBook AI Assistant. How can I help you with your baking today?',
          timestamp: new Date(),
        },
      ]);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Determine the type of query and call the appropriate assistant method
      let response;
      
      if (input.toLowerCase().includes('recipe') || input.toLowerCase().includes('ingredient')) {
        // Extract ingredients from the message (simplified)
        const ingredients = input
          .split(/[,.!?]+/)
          .filter(word => word.trim().length > 0)
          .slice(0, 5); // Limit to first 5 potential ingredients
        
        response = await callAssistant('suggestRecipe' as any, { ingredients });
      } else if (input.toLowerCase().includes('price') || input.toLowerCase().includes('cost')) {
        // Simplified pricing example
        response = await callAssistant('calculatePricing' as any, {
          ingredients: [{ name: 'ingredients', cost: 10, quantity: 1, unit: 'batch' }],
          laborHours: 2,
          hourlyRate: 15,
          desiredMargin: 30
        });
      } else if (input.toLowerCase().includes('tip') || input.toLowerCase().includes('trick')) {
        response = await callAssistant('getBakingTip' as any);
      } else {
        // Default to general advice
        response = await callAssistant('getAdvice' as any, { query: input });
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: typeof response === 'string' ? response : JSON.stringify(response, null, 2),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto h-[600px] flex flex-col">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <ChefHat className="h-6 w-6 text-amber-600" />
          <span>BakeBook AI Assistant</span>
        </CardTitle>
      </CardHeader>
      
      <ScrollArea className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === 'user'
                    ? 'bg-amber-100 text-amber-900 rounded-tr-none'
                    : 'bg-gray-100 text-gray-900 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '0.4s' }} />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {messages.length === 1 && (
        <div className="px-4 pb-4">
          <h3 className="text-sm font-medium text-gray-500 mb-3">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleQuickAction(action.prompt)}
                className="p-3 border rounded-lg text-left hover:bg-amber-50 transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-amber-600">{action.icon}</span>
                  <span className="font-medium">{action.title}</span>
                </div>
                <p className="text-sm text-gray-500">{action.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      <CardFooter className="border-t p-4">
        <form onSubmit={handleSendMessage} className="flex w-full gap-2">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about baking..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
