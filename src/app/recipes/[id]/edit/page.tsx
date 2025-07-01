
'use client';

import RecipeForm from '@/components/recipes/RecipeForm';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Spinner from '@/components/ui/Spinner';
import type { Recipe } from '@/types';
import { getRecipeByIdFromFirestore } from '@/lib/firestoreService';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { getRecipeById as getMockRecipeById } from '@/data/mockRecipes'; // Use mock data

export default function EditRecipePage({ params }: { params: { id: string } }) {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loadingRecipe, setLoadingRecipe] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      router.push(`/login?redirect=/recipes/${params.id}/edit`);
      return;
    }
    
    setLoadingRecipe(true);
    // DISABLED FIRESTORE
    console.log("Firestore is disabled. Using mock data for recipe editing.");
    const mockRecipe = getMockRecipeById(params.id);
    if (mockRecipe && user && mockRecipe.authorId === user.id) {
        setRecipe(mockRecipe);
    } else {
        setAccessDenied(true);
        const reason = !mockRecipe ? "Recipe not found in mock data." : "You do not have permission to edit this mock recipe.";
        toast({ title: "Access Denied", description: reason, variant: "destructive" });
    }
    setLoadingRecipe(false);
    /*
    getRecipeByIdFromFirestore(params.id)
      .then(fetchedRecipe => {
        if (fetchedRecipe) {
          if (user && (fetchedRecipe.authorId === user.id)) {
            setRecipe(fetchedRecipe);
          } else {
            setAccessDenied(true);
            toast({ title: "Access Denied", description: "You do not have permission to edit this recipe.", variant: "destructive" });
          }
        } else {
          setAccessDenied(true);
          toast({ title: "Not Found", description: "This baking recipe could not be found.", variant: "destructive" });
        }
      })
      .catch(error => {
        console.error("Error fetching recipe for edit:", error);
        toast({ title: "Error", description: "Could not load the recipe for editing.", variant: "destructive" });
        setAccessDenied(true); // Deny access on error as well
      })
      .finally(() => setLoadingRecipe(false));
    */
  }, [params.id, isAuthenticated, authLoading, user, router, toast]);

  if (authLoading || loadingRecipe) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Spinner size={48} />
      </div>
    );
  }

  if (accessDenied || !recipe) {
    return (
      <div className="text-center py-10">
        <h1 className="text-3xl font-bold text-destructive mb-4">Access Denied or Recipe Not Found</h1>
        <p className="text-muted-foreground">You do not have permission to edit this recipe, or the recipe does not exist. (Firestore is disabled)</p>
        <Button onClick={() => router.push('/recipes')} className="mt-6">Go to Recipes</Button>
      </div>
    );
  }

  return <RecipeForm mode="edit" initialData={recipe} />;
}
