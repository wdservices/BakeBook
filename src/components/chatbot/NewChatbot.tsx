'use client';

import { useState, useRef, useEffect } from 'react';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';

interface Message {
  text: string;
  role: 'user' | 'assistant';
  timestamp?: any;
}

export default function NewChatbot() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Set up real-time message listener
  useEffect(() => {
    // Use a default user ID for unauthenticated users
    const defaultUserId = 'anonymous-user';
    setUserId(defaultUserId);
    
    // Set up real-time listener for messages without requiring authentication
    const messagesQuery = query(
      collection(db, `users/${defaultUserId}/messages`),
      orderBy('timestamp')
    );
    
    const unsubscribeMessages = onSnapshot(messagesQuery, (snapshot) => {
      const messagesList: Message[] = [];
      snapshot.forEach((doc) => {
        messagesList.push(doc.data() as Message);
      });
      setMessages(messagesList);
    });

    return () => unsubscribeMessages();
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userMessage = input.trim();
    if (!userMessage || !userId) return;

    // Disable input and button
    setInput('');
    setIsTyping(true);

    // Add user message to state
    const newUserMessage: Message = {
      text: userMessage,
      role: 'user',
      timestamp: serverTimestamp()
    };
    
    setMessages(prev => [...prev, newUserMessage]);

    // Save user message to Firestore
    try {
      await addDoc(collection(db, `users/${userId}/messages`), newUserMessage);
    } catch (error) {
      console.error('Error saving user message:', error);
    }

    // Generate bot response
    setTimeout(() => {
      const botResponse = getBellaResponse(userMessage);
      const botMessage: Message = {
        text: botResponse,
        role: 'assistant',
        timestamp: serverTimestamp()
      };

      // Add bot response to state
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);

      // Save bot response to Firestore
      addDoc(collection(db, `users/${userId}/messages`), botMessage)
        .catch(error => console.error('Error saving bot message:', error));
    }, 1000);
  };

  const getBellaResponse = (userMessage: string): string => {
    const lowerCaseMessage = userMessage.toLowerCase();

    if (lowerCaseMessage.includes('cake sinking')) {
      return "Oh no, a cake collapse! That usually happens when the oven door gets opened too soon, or if there's too much raising agent. Next time, try keeping the oven closed until at least ¾ of the baking time is done. Want me to give you a quick checklist to avoid it?";
    }
    if (lowerCaseMessage.includes('pricing') || lowerCaseMessage.includes('charge')) {
      return "Let's bake up the perfect price! Give me your ingredient costs, time spent, and profit margin, and I'll crunch the numbers. And hey, I can save this formula so you can price cakes in seconds next time.";
    }
    if (lowerCaseMessage.includes('scale') || lowerCaseMessage.includes('servings') || lowerCaseMessage.includes('recipe for')) {
      return "Easy peasy, banana squeezy 🍌 — I'll scale it up for you and adjust the baking time so it still comes out perfectly moist. Want me to send it as a printable recipe card?";
    }
    if (lowerCaseMessage.includes('christmas') || lowerCaseMessage.includes('seasonal')) {
      return "How about a spiced gingerbread cake with orange glaze? It's festive, aromatic, and perfect for December orders. I can give you the full recipe or even create a cost breakdown.";
    }
    if (lowerCaseMessage.includes('substitutions')) {
      return "Ingredient substitutions can be a little tricky, but I can help with that! What ingredient are you looking to swap out? Let's figure out a delicious alternative together.";
    }
    if (lowerCaseMessage.includes('tips')) {
      return "Here's a quick Baker Business Boost tip: Use high-quality photos of your bakes on social media. Visuals are key to attracting new customers! ✨";
    }
    if (lowerCaseMessage.includes('challenge')) {
      return "Ready for a challenge? Your mission this week is to create a stunning dessert using only pantry staples. Think: a creative cookie or a no-bake treat!";
    }
    
    return "Hi there! I'm Bella, your friendly baking assistant. How can I help you whip up some magic in the kitchen today?";
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <header className="bg-white p-4 border-b border-gray-200 flex items-center justify-center">
        <span className="text-4xl">🎂</span>
        <h1 className="text-2xl font-bold ml-2 text-gray-800">BakeBook AI</h1>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p>Hi there! I'm Bella, your baking assistant. How can I help you today?</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] p-3 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-amber-300 text-gray-900 rounded-br-none'
                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
                }`}
              >
                {message.text}
              </div>
            </div>
          ))
        )}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 p-3 rounded-2xl rounded-bl-none">
              <span className="animate-pulse">...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Disclaimer */}
      <div className="text-xs text-center text-gray-500 p-2 bg-amber-50 border-t border-amber-100">
        By using this chat, you agree that advice is for informational purposes only. Not professional advice.
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-colors"
            placeholder="Ask Bella a baking question..."
            disabled={isTyping}
          />
          <button
            type="submit"
            className="bg-amber-500 text-white p-3 rounded-full shadow-md hover:bg-amber-600 transition-colors disabled:opacity-50"
            disabled={isTyping || !input.trim()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12L3.269 3.125A59.769 59.769 0 0121.485 12 59.768 59.768 0 013.27 20.875L5.999 12zm0 0h7.5"
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
