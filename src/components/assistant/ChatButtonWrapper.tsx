'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { MessageSquare, X } from 'lucide-react';

const NewChatbot = dynamic(
  () => import('@/components/chatbot/NewChatbot'),
  { ssr: false, loading: () => <div className="w-full h-full bg-white flex items-center justify-center">Loading chat...</div> }
);

export default function ChatButtonWrapper() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isOpen ? (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-3" style={{ maxHeight: 'calc(100vh - 2rem)' }}>
          <Button
            onClick={() => setIsOpen(false)}
            className="rounded-full h-14 w-14 p-0 flex items-center justify-center bg-amber-500 hover:bg-amber-600 text-white shadow-lg transition-all hover:scale-105"
            aria-label="Close chat"
          >
            <X className="h-6 w-6" />
          </Button>
          <div 
            className="w-[90vw] sm:w-[400px] h-[70vh] max-h-[600px] rounded-2xl overflow-hidden shadow-2xl bg-white border border-gray-200 flex flex-col"
            style={{ minHeight: '500px' }}
          >
            <NewChatbot />
          </div>
        </div>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 rounded-full h-14 w-14 p-0 flex items-center justify-center bg-amber-500 hover:bg-amber-600 text-white shadow-lg transition-all hover:scale-110"
          aria-label="Chat with BakeBook AI"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}
    </>
  );
}
