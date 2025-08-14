import { NextResponse } from 'next/server';
import { BakingAssistant } from '@/lib/ai/bakingAssistant';

export const runtime = 'edge'; // Use edge runtime for better performance

type AssistantAction = 
  | 'getAdvice' 
  | 'suggestRecipe' 
  | 'calculatePricing' 
  | 'scaleRecipe' 
  | 'getBakingTip';

// Initialize assistant outside the request handler
const assistant = new BakingAssistant();

// Helper function to validate request body
function validateRequest(body: any): { action: AssistantAction; data: any } | { error: string; status: number } {
  if (!body) {
    return { error: 'Request body is required', status: 400 };
  }

  const { action, data } = body;
  
  if (!action) {
    return { error: 'Action is required', status: 400 };
  }

  const validActions: AssistantAction[] = [
    'getAdvice',
    'suggestRecipe',
    'calculatePricing',
    'scaleRecipe',
    'getBakingTip',
  ];

  if (!validActions.includes(action as AssistantAction)) {
    return { 
      error: `Invalid action. Must be one of: ${validActions.join(', ')}`, 
      status: 400 
    };
  }

  return { action: action as AssistantAction, data: data || {} };
}

export async function POST(req: Request) {
  try {
    // Parse and validate request body
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (error) {
      console.error('Error parsing request body:', error);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const validation = validateRequest(requestBody);
    if ('error' in validation) {
      return NextResponse.json(
        { error: validation.error },
        { status: validation.status || 400 }
      );
    }

    const { action, data } = validation;

    let result;

    try {
      switch (action as AssistantAction) {
        case 'getAdvice':
          if (!data?.query) {
            throw new Error('Query is required for getAdvice');
          }
          result = await assistant.getBakingAdvice(data.query);
          break;
        
        case 'suggestRecipe':
          if (!data?.ingredients || !Array.isArray(data.ingredients)) {
            throw new Error('Ingredients array is required for suggestRecipe');
          }
          result = await assistant.suggestRecipe(
            data.ingredients, 
            data.dietaryRestrictions || []
          );
          break;
        
        case 'calculatePricing':
          if (!data?.ingredients || !Array.isArray(data.ingredients) || 
              typeof data.laborHours !== 'number' || 
              typeof data.hourlyRate !== 'number' || 
              typeof data.desiredMargin !== 'number') {
            throw new Error('Invalid parameters for calculatePricing');
          }
          result = await assistant.calculatePricing(
            data.ingredients,
            data.laborHours,
            data.hourlyRate,
            data.desiredMargin
          );
          break;
        
        case 'scaleRecipe':
          if (!data?.recipe || typeof data.targetServings !== 'number') {
            throw new Error('Recipe and targetServings are required for scaleRecipe');
          }
          result = await assistant.scaleRecipe(data.recipe, data.targetServings);
          break;
        
        case 'getBakingTip':
          result = await assistant.getBakingTip();
          break;
        
        default:
          return NextResponse.json(
            { error: 'Invalid action' },
            { status: 400 }
          );
      }

      return NextResponse.json({ success: true, data: result });
    } catch (error) {
      console.error(`Error in assistant action ${action}:`, error);
      return NextResponse.json(
        { 
          success: false, 
          error: error instanceof Error ? error.message : 'An unknown error occurred'
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Assistant API error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to process request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
