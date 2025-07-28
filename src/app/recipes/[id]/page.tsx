
'use client';

import { useState, useEffect, useMemo, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Recipe } from '@/types';
import { Clock, ChefHat, Edit3, ListChecks, CheckSquare, Square, ArrowLeft, UserCircle } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Spinner from '@/components/ui/Spinner';
import { useAuth } from '@/hooks/useAuth';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { getRecipeByIdFromFirestore } from '@/lib/firestoreService';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function RecipePage({ params }: { params: Promise<{ id: string }> }) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const resolvedParams = use(params);

  useEffect(() => {
    const recipeId = resolvedParams.id;
    setLoading(true);
    getRecipeByIdFromFirestore(recipeId)
      .then(fetchedRecipe => {
        if (fetchedRecipe) {
          setRecipe(fetchedRecipe);

          const storedCheckedIngredients = localStorage.getItem(`checkedIngredients_${recipeId}`);
          if (storedCheckedIngredients) {
            setCheckedIngredients(JSON.parse(storedCheckedIngredients));
          } else {
            const initialChecked: Record<string, boolean> = {};
            fetchedRecipe.ingredients.forEach(ing => initialChecked[ing.id] = false);
            setCheckedIngredients(initialChecked);
          }

          const storedCompletedSteps = localStorage.getItem(`completedSteps_${recipeId}`);
          if (storedCompletedSteps) {
            setCompletedSteps(JSON.parse(storedCompletedSteps));
          } else {
            const initialCompleted: Record<string, boolean> = {};
            fetchedRecipe.steps.forEach(step => initialCompleted[step.id] = false);
            setCompletedSteps(initialCompleted);
          }
        } else {
          toast({ title: "Not Found", description: "This baking recipe could not be found.", variant: "destructive" });
        }
      })
      .catch(error => {
        console.error("Error fetching recipe:", error);
        toast({ title: "Error", description: "Could not load the baking recipe.", variant: "destructive" });
      })
      .finally(() => setLoading(false));
  }, [resolvedParams.id, toast]);

  const handleIngredientToggle = (ingredientId: string) => {
    const newCheckedState = {
      ...checkedIngredients,
      [ingredientId]: !checkedIngredients[ingredientId],
    };
    setCheckedIngredients(newCheckedState);
    localStorage.setItem(`checkedIngredients_${resolvedParams.id}`, JSON.stringify(newCheckedState));
  };

  const handleStepToggle = (stepId: string) => {
    const newCompletedState = {
      ...completedSteps,
      [stepId]: !completedSteps[stepId],
    };
    setCompletedSteps(newCompletedState);
    localStorage.setItem(`completedSteps_${resolvedParams.id}`, JSON.stringify(newCompletedState));
  };

  const stepsProgress = useMemo(() => {
    if (!recipe || !recipe.steps) return 0;
    const totalSteps = recipe.steps.length;
    if (totalSteps === 0) return 0;
    const doneSteps = Object.values(completedSteps).filter(Boolean).length;
    return (doneSteps / totalSteps) * 100;
  }, [recipe, completedSteps]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-[calc(100vh-200px)]"><Spinner size={48} /></div>;
  }

  if (!recipe) {
    return <div className="text-center py-10 text-xl text-destructive">Baking recipe not found.</div>;
  }

  const canEdit = user && recipe && (user.id === recipe.authorId);

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <Card className="overflow-hidden shadow-xl">
        {recipe.imageUrl && (
          <div className="relative w-full h-72 md:h-96">
            <Image
              src={recipe.imageUrl}
              alt={recipe.title}
              fill={true}
              className="object-cover"
              data-ai-hint="baking recipe"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority // Prioritize loading for LCP
            />
          </div>
        )}
        <CardHeader className="pt-6">
          <div className="mb-4">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
            </Button>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <CardTitle className="text-4xl font-headline mb-2 md:mb-0 bg-gradient-to-r from-primary to-[hsl(var(--blue))] bg-clip-text text-transparent hover:from-[hsl(var(--blue))] hover:to-primary transition-all duration-300 ease-in-out">{recipe.title}</CardTitle>
            {canEdit && (
              <Link href={`/recipes/${recipe.id}/edit`} className={cn(buttonVariants({ variant: 'outline' }))}>
                <Edit3 className="mr-2 h-4 w-4" /> Edit Recipe
              </Link>
            )}
          </div>
          <CardDescription className="text-lg text-muted-foreground">{recipe.description}</CardDescription>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground pt-3">
            <div className="flex items-center gap-1"><Clock size={16} /> Prep: {recipe.prepTime}</div>
            <div className="flex items-center gap-1"><Clock size={16} /> Bake: {recipe.cookTime}</div>
            <div className="flex items-center gap-1">
                {recipe.authorName ? <ChefHat size={16} /> : <UserCircle size={16} />}
                By: {recipe.authorName || `User...`}
            </div>
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
            {recipe.steps?.length > 0 && (
              <div className="mb-4">
                <Label htmlFor="stepsProgress" className="text-sm text-muted-foreground">Baking Progress</Label>
                <Progress value={stepsProgress} id="stepsProgress" className="w-full h-3 mt-1" />
                <p className="text-xs text-right mt-1 text-muted-foreground">{Math.round(stepsProgress)}% complete</p>
              </div>
            )}
            <ol className="space-y-4 list-decimal list-inside">
              {recipe.steps?.map((step, index) => (
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
