
'use client';

import { useForm, type SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Recipe } from '@/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import IngredientInput from './IngredientInput';
import StepInput from './StepInput';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import Spinner from '../ui/Spinner';
import { addRecipe, updateRecipe as updateRecipeData } from '@/data/mockRecipes'; // Using mock data
import { useEffect } from 'react';
import { Switch } from '@/components/ui/switch';

const ingredientSchema = z.object({
  id: z.string().optional(), // Keep ID for existing items during edit
  name: z.string().min(1, "Ingredient name is required"),
  quantity: z.string().min(1, "Quantity is required"),
});

const stepSchema = z.object({
  id: z.string().optional(), // Keep ID for existing items during edit
  description: z.string().min(10, "Step description must be at least 10 characters"),
});

export const recipeFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  prepTime: z.string().min(1, "Prep time is required"),
  cookTime: z.string().min(1, "Cook time is required"),
  ingredients: z.array(ingredientSchema).min(1, "At least one ingredient is required"),
  steps: z.array(stepSchema).min(1, "At least one step is required"),
  isPublic: z.boolean().optional(),
});

type RecipeFormValues = z.infer<typeof recipeFormSchema>;

interface RecipeFormProps {
  initialData?: Recipe;
  mode: 'create' | 'edit';
}

const RecipeForm = ({ initialData, mode }: RecipeFormProps) => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const { control, register, handleSubmit, formState: { errors, isSubmitting }, reset, watch } = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          // Ensure ingredients and steps retain their IDs for editing
          ingredients: initialData.ingredients.map(ing => ({ id: ing.id, name: ing.name, quantity: ing.quantity })),
          steps: initialData.steps.map(step => ({ id: step.id, description: step.description })),
          isPublic: initialData.isPublic ?? false,
        }
      : {
          title: '',
          description: '',
          imageUrl: '',
          prepTime: '',
          cookTime: '',
          ingredients: [{ name: '', quantity: '' }],
          steps: [{ description: '' }],
          isPublic: false, // Default new recipes to private
        },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        ingredients: initialData.ingredients.map(ing => ({ id: ing.id, name: ing.name, quantity: ing.quantity })),
        steps: initialData.steps.map(step => ({ id: step.id, description: step.description })),
        isPublic: initialData.isPublic ?? false,
      });
    }
  }, [initialData, reset]);


  const onSubmit: SubmitHandler<RecipeFormValues> = async (data) => {
    if (!user) {
      toast({ title: "Authentication Error", description: "You must be logged in to create or edit recipes.", variant: "destructive" });
      router.push('/login?redirect=' + (mode === 'create' ? '/recipes/new' : `/recipes/${initialData?.id}/edit`));
      return;
    }

    try {
      if (mode === 'create') {
        const newRecipeData = {
          ...data,
          authorId: user.id,
          authorName: user.name || user.email,
          // Ensure ingredients and steps get new IDs if not provided (should happen for new items)
          ingredients: data.ingredients.map((ing, idx) => ({ ...ing, id: `ing-${Date.now()}-${idx}` })),
          steps: data.steps.map((step, idx) => ({ ...step, id: `step-${Date.now()}-${idx}` })),
          isPublic: data.isPublic ?? false,
        };
        // Cast to Omit Recipe 'id', 'createdAt', 'updatedAt'
        const createdRecipe = addRecipe(newRecipeData as Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>);
        toast({ title: "Recipe Saved!", description: `"${createdRecipe.title}" has been successfully saved.` });
        router.push('/dashboard');
      } else if (mode === 'edit' && initialData) {
        const updatedRecipeData = {
          ...data,
          // IDs for ingredients/steps are handled by map in defaultValues/reset or should be part of 'data' if already existing
          ingredients: data.ingredients.map((ing, idx) => ({ ...ing, id: ing.id || initialData.ingredients[idx]?.id || `ing-new-${Date.now()}-${idx}`})),
          steps: data.steps.map((step, idx) => ({ ...step, id: step.id || initialData.steps[idx]?.id || `step-new-${Date.now()}-${idx}`})),
          isPublic: data.isPublic ?? false,
        }
        // Cast to Partial<Omit<Recipe, 'id' | 'createdAt' | 'authorId' | 'authorName'>>
        const updated = updateRecipeData(initialData.id, updatedRecipeData as Partial<Omit<Recipe, 'id' | 'createdAt' | 'authorId' | 'authorName'>>);
        if (updated) {
          toast({ title: "Recipe Updated!", description: `"${updated.title}" has been successfully updated.` });
          router.push('/dashboard');
        } else {
           toast({ title: "Update Failed", description: "Could not update the baking recipe.", variant: "destructive" });
        }
      }
    } catch (error) {
      console.error("Recipe submission error:", error);
      toast({ title: "Error", description: "An unexpected error occurred. Please try again.", variant: "destructive" });
    }
  };

  if (authLoading && !user) return <div className="flex justify-center items-center min-h-[calc(100vh-200px)]"><Spinner size={48}/> <p className="ml-4">Loading user...</p></div>;


  return (
    <Card className="w-full max-w-3xl mx-auto shadow-xl animate-scale-in">
      <CardHeader>
        <CardTitle className="text-3xl font-headline bg-gradient-to-r from-primary to-[hsl(var(--blue))] bg-clip-text text-transparent hover:from-[hsl(var(--blue))] hover:to-primary transition-all duration-300 ease-in-out">
          {mode === 'create' ? 'Add Your Baking Recipe' : 'Edit Your Baking Recipe'}
        </CardTitle>
        <CardDescription>
          {mode === 'create' ? 'Share your baking masterpiece with the world!' : 'Make changes to your delicious baking recipe.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register('title')} placeholder="e.g., Grandma's Apple Pie" />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register('description')} placeholder="A short summary of your baking recipe..." />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL (Optional)</Label>
            <Input id="imageUrl" {...register('imageUrl')} placeholder="https://example.com/image.jpg" />
            {errors.imageUrl && <p className="text-sm text-destructive">{errors.imageUrl.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="prepTime">Prep Time</Label>
              <Input id="prepTime" {...register('prepTime')} placeholder="e.g., 30 mins" />
              {errors.prepTime && <p className="text-sm text-destructive">{errors.prepTime.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="cookTime">Bake Time</Label>
              <Input id="cookTime" {...register('cookTime')} placeholder="e.g., 1 hour" />
              {errors.cookTime && <p className="text-sm text-destructive">{errors.cookTime.message}</p>}
            </div>
          </div>

          <IngredientInput control={control} register={register} errors={errors} />
          <StepInput control={control} register={register} errors={errors} />

          <div className="space-y-2">
            <Label className="text-lg font-medium">Recipe Visibility</Label>
            <div className="flex items-center space-x-3 p-3 border border-muted rounded-md bg-card/50">
              <Controller
                name="isPublic"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="isPublic"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    aria-labelledby="isPublicLabel"
                  />
                )}
              />
              <Label htmlFor="isPublic" id="isPublicLabel" className="cursor-pointer flex-grow">
                Make this recipe public?
                <p className="text-xs text-muted-foreground">
                  Public recipes are visible to everyone. Private recipes are only visible to you on your dashboard.
                </p>
              </Label>
            </div>
            {errors.isPublic && <p className="text-sm text-destructive">{errors.isPublic.message}</p>}
          </div>


          <CardFooter className="p-0 pt-6">
            <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
              {isSubmitting ? <><Spinner size={18} className="mr-2"/> Processing...</> : (mode === 'create' ? 'Save Recipe' : 'Save Changes')}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()} className="ml-4">
              Cancel
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default RecipeForm;
