'use client';

import RecipeForm from '@/components/recipes/RecipeForm';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Spinner from '@/components/ui/Spinner';
import { getRecipeById } from '@/data/mockRecipes';
import type { Recipe } from '@/types';
import { UserRole } from '@/types';

export default function EditRecipePage({ params }: { params: { id: string } }) {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loadingRecipe, setLoadingRecipe] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      router.push(`/login?redirect=/recipes/${params.id}/edit`);
      return;
    }

    const fetchedRecipe = getRecipeById(params.id);
    if (fetchedRecipe) {
      if (user && (fetchedRecipe.authorId === user.id || user.role === UserRole.ADMIN)) {
        setRecipe(fetchedRecipe);
      } else {
        setAccessDenied(true);
      }
    } else {
      // Recipe not found
      setAccessDenied(true); // Or redirect to a 404 page
    }
    setLoadingRecipe(false);
  }, [params.id, isAuthenticated, authLoading, user, router]);

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
        <h1 className="text-3xl font-bold text-destructive mb-4">Access Denied</h1>
        <p className="text-muted-foreground">You do not have permission to edit this recipe, or the recipe does not exist.</p>
        <Button onClick={() => router.push('/recipes')} className="mt-6">Go to Recipes</Button>
      </div>
    );
  }

  return <RecipeForm mode="edit" initialData={recipe} />;
}
