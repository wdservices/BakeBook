import { z } from 'zod';
import { geminiConfig } from './config';

// Types for Gemini API
type GeminiMessage = {
  role: 'user' | 'model';
  parts: { text: string }[];
};

type GeminiRequest = {
  contents: GeminiMessage[];
  generationConfig: {
    temperature: number;
    topK: number;
    topP: number;
    maxOutputTokens: number;
    stopSequences: string[];
  };
  safetySettings: {
    category: string;
    threshold: string;
  }[];
};

// Define schemas for structured responses
const RecipeSuggestion = z.object({
  title: z.string(),
  ingredients: z.array(z.string()),
  instructions: z.array(z.string()),
  prepTime: z.number(),
  cookTime: z.number(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
});

const PricingSuggestion = z.object({
  baseCost: z.number(),
  recommendedPrice: z.number(),
  profitMargin: z.number(),
  breakdown: z.object({
    ingredients: z.number(),
    labor: z.number(),
    overhead: z.number(),
  }),
});

export class BakingAssistant {
  private apiKey = geminiConfig.apiKey;
  private apiUrl = `https://generativelanguage.googleapis.com/${geminiConfig.apiVersion}/models/${geminiConfig.modelName}:generateContent`;
  
  private context = `You are a professional baking assistant with expertise in all aspects of baking, 
  from home baking to professional patisserie. You are helpful, encouraging, and provide 
  detailed, accurate information. Your responses should be warm and engaging, like a 
  knowledgeable baking mentor.`;

  private async callGeminiAPI(messages: GeminiMessage[], temperature = 0.7) {
    if (!this.apiKey) {
      throw new Error('Google AI API key is not configured');
    }

    // Ensure we have a valid message format
    const validMessages = messages.map(msg => ({
      role: msg.role,
      parts: msg.parts.map(part => ({
        text: part.text
      }))
    }));

    const request = {
      contents: validMessages,
      generationConfig: {
        temperature,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
        stopSequences: [],
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      ],
    };

    try {
      const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Gemini API error (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      
      // Handle the response format for Gemini 1.5
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      }
      
      // Handle the response format for Gemini 2.0
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      }
      
      // Fallback to raw response if structure is different
      console.warn('Unexpected API response format:', JSON.stringify(data, null, 2));
      return JSON.stringify(data, null, 2);
      
    } catch (error) {
      console.error('API Request Error:', error);
      throw new Error(`Failed to call Gemini API: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async getBakingAdvice(query: string): Promise<string> {
    const prompt = `${this.context}\n\nUser: ${query}\nAssistant:`;
    
    const messages: GeminiMessage[] = [
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ];

    return this.callGeminiAPI(messages);
  }

  async suggestRecipe(ingredients: string[], dietaryRestrictions: string[] = []): Promise<z.infer<typeof RecipeSuggestion>> {
    const prompt = `${this.context}\n\nPlease suggest a detailed recipe using these ingredients: ${ingredients.join(', ')}.\n${
      dietaryRestrictions.length > 0 ? `Dietary restrictions: ${dietaryRestrictions.join(', ')}\n` : ''
    }Return the recipe as a JSON object with the following structure: ${JSON.stringify({
      title: 'string',
      ingredients: ['string'],
      instructions: ['string'],
      prepTime: 'number',
      cookTime: 'number',
      difficulty: 'beginner | intermediate | advanced',
    }, null, 2)}`;

    const messages: GeminiMessage[] = [
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ];

    const response = await this.callGeminiAPI(messages, 0.8);
    
    try {
      // Extract JSON from the response (handling potential markdown code blocks)
      const jsonStr = response.replace(/```json\n?|```/g, '').trim();
      return JSON.parse(jsonStr);
    } catch (error) {
      console.error('Error parsing recipe suggestion:', error);
      throw new Error('Failed to parse recipe suggestion');
    }
  }

  async calculatePricing(ingredients: Array<{name: string, cost: number, quantity: number, unit: string}>, 
                        laborHours: number, 
                        hourlyRate: number,
                        desiredMargin: number): Promise<z.infer<typeof PricingSuggestion>> {
    
    const prompt = `${this.context}\n\nCalculate pricing for a baking product with these ingredients: ${JSON.stringify(ingredients, null, 2)}.\n` +
      `Labor hours: ${laborHours} at $${hourlyRate}/hour.\n` +
      `Desired profit margin: ${desiredMargin}%.\n\n` +
      `Return the pricing details as a JSON object with this structure: ${JSON.stringify({
        baseCost: 'number',
        recommendedPrice: 'number',
        profitMargin: 'number',
        breakdown: {
          ingredients: 'number',
          labor: 'number',
          overhead: 'number',
        },
      }, null, 2)}`;

    const messages: GeminiMessage[] = [
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ];

    const response = await this.callGeminiAPI(messages, 0.3);
    
    try {
      const jsonStr = response.replace(/```json\n?|```/g, '').trim();
      return JSON.parse(jsonStr);
    } catch (error) {
      console.error('Error parsing pricing calculation:', error);
      throw new Error('Failed to parse pricing calculation');
    }
  }

  async scaleRecipe(recipe: any, targetServings: number): Promise<any> {
    const prompt = `${this.context}\n\nPlease scale this recipe to serve ${targetServings} people.\n\n` +
      `Current recipe (serves ${recipe.servings || 'unknown'}):\n` +
      `${JSON.stringify(recipe, null, 2)}\n\n` +
      `Return the scaled recipe in the same format.`;
    
    const messages: GeminiMessage[] = [
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ];

    return this.callGeminiAPI(messages, 0.2);
  }

  async getBakingTip(): Promise<string> {
    const prompt = `${this.context}\n\nProvide a random, useful baking tip or trick.`;
    
    const messages: GeminiMessage[] = [
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ];

    return this.callGeminiAPI(messages, 0.9);
  }
}
