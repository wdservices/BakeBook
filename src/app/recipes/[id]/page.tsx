'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { getRecipeById } from '@/data/mockRecipes';
import type { Recipe, Ingredient, RecipeStep } from '@/types';
import { Clock, Users, ChefHat, Edit3, ListChecks, CheckSquare, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Spinner from '@/components/ui/Spinner';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Separator } from '@/components/ui/separator';

export default function RecipePage({ params }: { params: { id: string } }) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    const fetchedRecipe = getRecipeById(params.id);
    if (fetchedRecipe) {
      setRecipe(fetchedRecipe);
      // Initialize tracking states from localStorage if available, or default to false
      const storedCheckedIngredients = localStorage.getItem(`checkedIngredients_${params.id}`);
      if (storedCheckedIngredients) setCheckedIngredients(JSON.parse(storedCheckedIngredients));
      else setCheckedIngredients(fetchedRecipe.ingredients.reduce((acc, ing) => ({...acc, [ing.id]: false}), {}));
      
      const storedCompletedSteps = localStorage.getItem(`completedSteps_${params.id}`);
      if (storedCompletedSteps) setCompletedSteps(JSON.parse(storedCompletedSteps));
      else setCompletedSteps(fetchedRecipe.steps.reduce((acc, step) => ({...acc, [step.id]: false}), {}));

    }
    setLoading(false);
  }, [params.id]);

  const handleIngredientToggle = (ingredientId: string) => {
    const newCheckedState = {
      ...checkedIngredients,
      [ingredientId]: !checkedIngredients[ingredientId],
    };
    setCheckedIngredients(newCheckedState);
    localStorage.setItem(`checkedIngredients_${params.id}`, JSON.stringify(newCheckedState));
  };

  const handleStepToggle = (stepId: string) => {
     const newCompletedState = {
      ...completedSteps,
      [stepId]: !completedSteps[stepId],
    };
    setCompletedSteps(newCompletedState);
    localStorage.setItem(`completedSteps_${params.id}`, JSON.stringify(newCompletedState));
  };

  const stepsProgress = useMemo(() => {
    if (!recipe) return 0;
    const totalSteps = recipe.steps.length;
    if (totalSteps === 0) return 0;
    const doneSteps = Object.values(completedSteps).filter(Boolean).length;
    return (doneSteps / totalSteps) * 100;
  }, [recipe, completedSteps]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-[calc(100vh-200px)]"><Spinner size={48} /></div>;
  }

  if (!recipe) {
    return <div className="text-center py-10 text-xl text-destructive">Recipe not found.</div>;
  }

  const canEdit = user && (user.id === recipe.authorId || user.role === 'admin');

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <Card className="overflow-hidden shadow-xl">
        {recipe.imageUrl && (
          <div className="relative w-full h-72 md:h-96">
            <Image
              src={recipe.imageUrl}
              alt={recipe.title}
              layout="fill"
              objectFit="cover"
              data-ai-hint="food recipe"
            />
          </div>
        )}
        <CardHeader className="pt-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <CardTitle className="text-4xl font-headline text-primary mb-2 md:mb-0">{recipe.title}</CardTitle>
            {canEdit && (
              <Link href={`/recipes/${recipe.id}/edit`} passHref legacyBehavior>
                <Button variant="outline"><Edit3 className="mr-2 h-4 w-4" /> Edit Recipe</Button>
              </Link>
            )}
          </div>
          <CardDescription className="text-lg text-muted-foreground">{recipe.description}</CardDescription>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground pt-3">
            <div className="flex items-center gap-1"><Clock size={16} /> Prep: {recipe.prepTime}</div>
            <div className="flex items-center gap-1"><Clock size={16} /> Cook: {recipe.cookTime}</div>
            <div className="flex items-center gap-1"><Users size={16} /> Servings: {recipe.servings}</div>
            <div className="flex items-center gap-1"><ChefHat size={16} /> By: User {recipe.authorId.slice(-4)}</div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-8 py-6">
          <Separator />
          
          <div>
            <h2 className="text-2xl font-headline text-accent mb-4 flex items-center"><ListChecks className="mr-2"/>Ingredients</h2>
            <ul className="space-y-2 columns-1 md:columns-2">
              {recipe.ingredients.map((ingredient) => (
                <li key={ingredient.id} className="flex items-center gap-2 p-2 rounded hover:bg-muted transition-colors cursor-pointer break-inside-avoid" onClick={() => handleIngredientToggle(ingredient.id)}>
                  {checkedIngredients[ingredient.id] ? <CheckSquare size={20} className="text-primary flex-shrink-0" /> : <Square size={20} className="text-muted-foreground flex-shrink-0" />}
                  <span className={`flex-grow ${checkedIngredients[ingredient.id] ? 'line-through text-muted-foreground' : ''}`}>
                    <span className="font-semibold">{ingredient.name}</span>: {ingredient.quantity}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          <div>
            <h2 className="text-2xl font-headline text-accent mb-2">Instructions</h2>
            {recipe.steps.length > 0 && (
              <div className="mb-4">
                <Label htmlFor="stepsProgress" className="text-sm text-muted-foreground">Cooking Progress</Label>
                <Progress value={stepsProgress} id="stepsProgress" className="w-full h-3 mt-1" />
                <p className="text-xs text-right mt-1 text-muted-foreground">{Math.round(stepsProgress)}% complete</p>
              </div>
            )}
            <ol className="space-y-4 list-decimal list-inside">
              {recipe.steps.map((step, index) => (
                <li key={step.id} className="flex items-start gap-3 p-3 rounded hover:bg-muted transition-colors">
                   <button onClick={() => handleStepToggle(step.id)} className="mt-1 focus:outline-none">
                     {completedSteps[step.id] ? <CheckSquare size={20} className="text-primary flex-shrink-0" /> : <Square size={20} className="text-muted-foreground flex-shrink-0" />}
                   </button>
                  <div className="flex-grow">
                    <span className={`font-semibold block ${completedSteps[step.id] ? 'line-through text-muted-foreground' : ''}`}>Step {index + 1}</span>
                    <p className={`text-foreground/90 ${completedSteps[step.id] ? 'line-through text-muted-foreground' : ''}`}>{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
