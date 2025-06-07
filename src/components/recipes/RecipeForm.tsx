'use client';

import { useForm, type SubmitHandler } from 'react-hook-form';
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

const ingredientSchema = z.object({
  name: z.string().min(1, "Ingredient name is required"),
  quantity: z.string().min(1, "Quantity is required"),
});

const stepSchema = z.object({
  description: z.string().min(10, "Step description must be at least 10 characters"),
});

export const recipeFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  prepTime: z.string().min(1, "Prep time is required"),
  cookTime: z.string().min(1, "Cook time is required"),
  servings: z.coerce.number().min(1, "Servings must be at least 1"),
  ingredients: z.array(ingredientSchema).min(1, "At least one ingredient is required"),
  steps: z.array(stepSchema).min(1, "At least one step is required"),
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

  const { control, register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: initialData 
      ? {
          ...initialData,
          ingredients: initialData.ingredients.map(({id: _id, ...rest}) => rest), // remove ID from form values
          steps: initialData.steps.map(({id: _id, ...rest}) => rest), // remove ID from form values
        }
      : {
          title: '',
          description: '',
          imageUrl: '',
          prepTime: '',
          cookTime: '',
          servings: 1,
          ingredients: [{ name: '', quantity: '' }],
          steps: [{ description: '' }],
        },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        ingredients: initialData.ingredients.map(({id: _id, ...rest}) => rest),
        steps: initialData.steps.map(({id: _id, ...rest}) => rest),
      });
    }
  }, [initialData, reset]);


  const onSubmit: SubmitHandler<RecipeFormValues> = async (data) => {
    if (!user) {
      toast({ title: "Authentication Error", description: "You must be logged in to create or edit recipes.", variant: "destructive" });
      return;
    }

    try {
      if (mode === 'create') {
        // For mock data, IDs are auto-generated. Real app would need to handle this differently.
        const newRecipeData = {
          ...data,
          authorId: user.id,
          ingredients: data.ingredients.map((ing, idx) => ({ ...ing, id: `ing-${Date.now()}-${idx}` })),
          steps: data.steps.map((step, idx) => ({ ...step, id: `step-${Date.now()}-${idx}` })),
        };
        const createdRecipe = addRecipe(newRecipeData as Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>);
        toast({ title: "Recipe Created!", description: `"${createdRecipe.title}" has been successfully added.` });
        router.push(`/recipes/${createdRecipe.id}`);
      } else if (mode === 'edit' && initialData) {
        const updatedRecipeData = {
          ...data,
          ingredients: data.ingredients.map((ing, idx) => ({ ...ing, id: initialData.ingredients[idx]?.id || `ing-${Date.now()}-${idx}`})),
          steps: data.steps.map((step, idx) => ({ ...step, id: initialData.steps[idx]?.id || `step-${Date.now()}-${idx}`})),
        }
        const updated = updateRecipeData(initialData.id, updatedRecipeData);
        if (updated) {
          toast({ title: "Recipe Updated!", description: `"${updated.title}" has been successfully updated.` });
          router.push(`/recipes/${updated.id}`);
        } else {
           toast({ title: "Update Failed", description: "Could not update the recipe.", variant: "destructive" });
        }
      }
    } catch (error) {
      console.error("Recipe submission error:", error);
      toast({ title: "Error", description: "An unexpected error occurred. Please try again.", variant: "destructive" });
    }
  };
  
  if (authLoading) return <div className="flex justify-center items-center min-h-[calc(100vh-200px)]"><Spinner size={48}/></div>;

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-xl animate-scale-in">
      <CardHeader>
        <CardTitle className="text-3xl text-primary font-headline">
          {mode === 'create' ? 'Create a New Recipe' : 'Edit Recipe'}
        </CardTitle>
        <CardDescription>
          {mode === 'create' ? 'Share your culinary masterpiece with the world!' : 'Make changes to your delicious recipe.'}
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
            <Textarea id="description" {...register('description')} placeholder="A short summary of your recipe..." />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL (Optional)</Label>
            <Input id="imageUrl" {...register('imageUrl')} placeholder="https://example.com/image.jpg" />
            {errors.imageUrl && <p className="text-sm text-destructive">{errors.imageUrl.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="prepTime">Prep Time</Label>
              <Input id="prepTime" {...register('prepTime')} placeholder="e.g., 30 mins" />
              {errors.prepTime && <p className="text-sm text-destructive">{errors.prepTime.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="cookTime">Cook Time</Label>
              <Input id="cookTime" {...register('cookTime')} placeholder="e.g., 1 hour" />
              {errors.cookTime && <p className="text-sm text-destructive">{errors.cookTime.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="servings">Servings</Label>
              <Input id="servings" type="number" {...register('servings')} placeholder="e.g., 4" />
              {errors.servings && <p className="text-sm text-destructive">{errors.servings.message}</p>}
            </div>
          </div>
          
          <IngredientInput control={control} register={register} errors={errors} />
          <StepInput control={control} register={register} errors={errors} />

          <CardFooter className="p-0 pt-6">
            <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
              {isSubmitting ? <><Spinner size={18} className="mr-2"/> Processing...</> : (mode === 'create' ? 'Create Recipe' : 'Save Changes')}
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
