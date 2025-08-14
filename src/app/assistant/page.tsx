import { Metadata } from 'next';
import { BakingAssistantChat } from '@/components/assistant/BakingAssistantChat';

export const metadata: Metadata = {
  title: 'Baking Assistant | BakeBook',
  description: 'Your AI-powered baking assistant for recipes, tips, and more',
};

export default function AssistantPage() {
  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-amber-900 mb-2">BakeBook AI Assistant</h1>
          <p className="text-gray-600">
            Get expert baking advice, recipe suggestions, pricing help, and more!
          </p>
        </div>
        
        <BakingAssistantChat />
        
        <div className="mt-8 p-6 bg-amber-50 rounded-lg border border-amber-100">
          <h2 className="text-xl font-semibold text-amber-800 mb-3">What can I help you with?</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• Recipe ideas based on ingredients you have</li>
            <li>• Baking tips and techniques</li>
            <li>• Pricing calculations for your baked goods</li>
            <li>• Recipe scaling for different serving sizes</li>
            <li>• Troubleshooting baking problems</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
