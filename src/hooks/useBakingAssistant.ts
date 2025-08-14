import { useState } from 'react';

type AssistantAction = 
  | 'getAdvice' 
  | 'suggestRecipe' 
  | 'calculatePricing' 
  | 'scaleRecipe' 
  | 'getBakingTip';

export function useBakingAssistant() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callAssistant = async <T,>(
    action: AssistantAction,
    data: any = {}
  ): Promise<T | null> => {
    setIsLoading(true);
    setError(null);

    console.log(`[Assistant] Sending ${action} request with data:`, data);

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, data }),
      });

      const responseData = await response.json();
      console.log(`[Assistant] ${action} response:`, responseData);

      if (!response.ok) {
        const errorMessage = responseData?.error || response.statusText || 'Unknown error';
        throw new Error(`API Error (${response.status}): ${errorMessage}`);
      }

      return responseData.result || responseData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      console.error('[Assistant] Error:', errorMessage, err);
      setError(errorMessage);
      
      // Return a more detailed error message in development
      if (process.env.NODE_ENV === 'development') {
        return {
          error: errorMessage,
          details: err instanceof Error ? {
            message: err.message,
            stack: err.stack,
            name: err.name
          } : null
        } as any;
      }
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Helper methods for common actions
  const getBakingAdvice = async (query: string) => {
    return callAssistant('getAdvice', { query });
  };

  const suggestRecipe = async (ingredients: string[], dietaryRestrictions: string[] = []) => {
    return callAssistant('suggestRecipe', { ingredients, dietaryRestrictions });
  };

  const getBakingTip = async () => {
    return callAssistant('getBakingTip');
  };

  return {
    callAssistant,
    getBakingAdvice,
    suggestRecipe,
    getBakingTip,
    isLoading,
    error,
  };
}
