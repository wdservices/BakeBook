'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './Chatbot.module.css';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

export default function Chatbot() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hey there, baker! I'm Bella, your friendly baking assistant. How can I help you whip up something wonderful today?",
      sender: 'bot'
    },
    {
      text: "ℹ️ Please note: The information and advice provided by this chatbot are for general informational purposes only and should not be considered as professional baking, nutritional, or health advice. Always consult with a qualified professional for specific guidance. BakeBook is not liable for any outcomes resulting from the use of this information.",
      sender: 'bot'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userMessage = input.trim();
    if (!userMessage) return;

    // Add user message
    const newMessages = [...messages, { text: userMessage, sender: 'user' as const }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    // Simulate bot response after a delay
    setTimeout(() => {
      const botResponse = generateBotResponse(userMessage);
      setMessages([...newMessages, { text: botResponse, sender: 'bot' }]);
      setIsTyping(false);
    }, 1000);
  };

  const handleBakingTip = () => {
    const tips = [
      "Always preheat your oven for at least 15-20 minutes before baking for consistent results.",
      "Use room temperature ingredients (like eggs and butter) for better emulsion in your batters.",
      "When measuring flour, spoon it into the measuring cup and level it off for accuracy.",
      "Rotate your pans halfway through baking for even browning.",
      "Let your baked goods cool completely before slicing to prevent them from falling apart.",
      "Invest in an oven thermometer to ensure your oven temperature is accurate.",
      "When making meringue, make sure your bowl and beaters are completely grease-free.",
      "For flakier pie crust, keep your butter and water very cold before mixing.",
      "Don't overmix your batter to avoid tough baked goods - mix just until combined.",
      "Let your dough rest in the refrigerator to relax the gluten and prevent shrinking."
    ];
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    
    // Add the tip as a bot message
    setMessages(prev => [...prev, { 
      text: `💡 Baking Tip: ${randomTip}`, 
      sender: 'bot' 
    }]);
  };

  const generateBotResponse = (userMessage: string): string => {
    const lowerInput = userMessage.toLowerCase();

    if (lowerInput.includes('scale') || lowerInput.includes('servings')) {
      return "Easy peasy, banana squeezy 🍌! I can definitely help with that. Just tell me the recipe name and the number of servings you want to scale to. I'll get the measurements just right for you.";
    } else if (lowerInput.includes('price') || lowerInput.includes('charge')) {
      return "Let's bake up the perfect price! Tell me your ingredient costs, time spent, and desired profit margin, and I'll crunch the numbers. We'll find a price that's sweet for both you and your customers!";
    } else if (lowerInput.includes('sinking') || lowerInput.includes('collapse')) {
      return "Oh no, a cake collapse! That's a classic baker's woe. It usually happens when the oven door gets opened too soon, or if there's too much raising agent. A little patience is the key to a perfectly level cake. Want me to give you a quick checklist to avoid it next time?";
    } else if (lowerInput.includes('substitute')) {
      return "Looking for a substitute? No problem! Tell me what ingredient you're missing, and I'll find a great replacement that won't mess with your bake's deliciousness.";
    } else if (lowerInput.includes('challenge')) {
      return "A baking challenge, you say? I love it! Your challenge is to create a no-oven dessert using only pantry staples. Think of it as a creative way to stay cool in the kitchen. Ready to get started?";
    } else if (lowerInput.includes('christmas')) {
      return "Christmas baking is the best! How about a spiced gingerbread cake with orange glaze? It's festive, aromatic, and perfect for December orders. I can give you the full recipe or even create a cost breakdown.";
    } else {
      // General mock responses
      const mockResponses = [
        "That's a great question! Let's get to the bottom of it. What have you tried so far?",
        "Hmm, I'll need a little more information. What ingredients are you working with?",
        "That's a classic! I have a few tricks up my sleeve for that. Tell me more about what you're seeing.",
        "Ooh, that sounds delicious! Your customers are going to love this. What step are you on?",
        "You've got this! Remember, every baker has a few flops. The important thing is to learn from them. What's the recipe you're working on?"
      ];
      return mockResponses[Math.floor(Math.random() * mockResponses.length)];
    }
  };

  return (
    <div className={styles.chatbotContainer}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={styles.chefHatIcon}
          >
            <path d="M11.474 2.166A5.996 5.996 0 0 0 8.014 2.5c-1.606 0-3.155.334-4.57.994a5.996 5.996 0 0 0-.231 9.423l.196.223 6.96 7.95a.75.75 0 0 0 1.062 0l6.96-7.95.196-.223a5.996 5.996 0 0 0-.23-9.423A5.996 5.996 0 0 0 11.474 2.166ZM12.723 18.917-.354 8.78c.074-.085.158-.16.248-.225a4.496 4.496 0 0 1 3.551-1.465 4.496 4.496 0 0 1 3.551 1.465c.09.065.174.14.248.225l11.411 10.137c.074.085.158-.16.248-.225a4.496 4.496 0 0 1 3.551-1.465 4.496 4.496 0 0 1 3.551 1.465c.09.065.174.14.248.225Z" />
          </svg>
          <div className={styles.headerText}>
            <h1>BakeBook AI</h1>
            <p>Chatting with Bella the Baker</p>
          </div>
        </div>
        <div className="flex space-x-2 relative group">
          <button 
            className={`${styles.iconButton} relative`} 
            aria-label="Baking tips"
            onClick={() => handleBakingTip()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M12 .75a8.25 8.25 0 0 0-4.135 15.39c.686.398 1.115 1.008 1.134 1.623a.75.75 0 0 0 .577.706c.352.083.71.148 1.074.195.323.041.6-.218.6-.544v-4.661a6.75 6.75 0 0 1 5.962-6.69 7.5 7.5 0 0 0-5.21-12.985z" />
              <path fillRule="evenodd" d="M9.013 19.9a.75.75 0 0 1 .877-.597 11.319 11.319 0 0 0 4.22 0 .75.75 0 1 1 .28 1.473 12.818 12.818 0 0 1-4.78 0 .75.75 0 0 1-.597-.876zM9.754 22.344a.75.75 0 0 1 .824.668 7.93 7.93 0 0 0 2.85 0 .75.75 0 1 1 .148 1.49 9.17 9.17 0 0 1-3.146 0 .75.75 0 0 1 .668-.824z" clipRule="evenodd" />
            </svg>
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Baking Tips
            </span>
          </button>
          <button className={styles.iconButton} aria-label="Settings">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.987.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.346-.165.675-.356.987-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.23-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.987-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843zM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </header>

      {/* Messages */}
      <div className={styles.chatContainer}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`${styles.messageContainer} ${
              message.sender === 'user' ? styles.user : ''
            }`}
          >
            <div
              className={`${styles.messageBubble} ${
                message.sender === 'user' ? styles.user : styles.bot
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className={styles.messageContainer}>
            <div className={`${styles.messageBubble} ${styles.bot}`}>
              <div className={styles.dotPulse} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className={styles.disclaimer}>
        By using this chat, you agree that advice is for informational purposes only. Not professional advice.
      </div>
      <footer className={styles.inputContainer}>
        <form onSubmit={handleSubmit} className={styles.inputForm}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={styles.inputField}
            placeholder="Ask Bella about baking, recipes, or business tips..."
            disabled={isTyping}
          />
          <button
            type="submit"
            className={styles.sendButton}
            disabled={isTyping || !input.trim()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={styles.sendIcon}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12L3.269 3.125A59.769 59.769 0 0121.485 12 59.768 59.768 0 013.27 20.875L5.999 12zm0 0h7.5"
              />
            </svg>
          </button>
        </form>
      </footer>
    </div>
  );
}
