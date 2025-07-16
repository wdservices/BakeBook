
'use client';

import { useState, useEffect, useMemo } from 'react';
import RecipeGrid from '@/components/recipes/RecipeGrid';
import RecipeSearchInput from '@/components/recipes/RecipeSearchInput';
import type { Recipe } from '@/types';
import Spinner from '@/components/ui/Spinner';
import { Search } from 'lucide-react';
import { mockRecipes } from '@/data/mockRecipes'; // Use mock data
import { useToast } from '@/hooks/use-toast';

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setLoading(true);
    // Simulate fetching by using mock data
    try {
      const publicRecipes = mockRecipes.filter(r => r.isPublic);
      setRecipes(publicRecipes);
    } catch (error) {
       console.error("Error loading mock recipes:", error);
       toast({ title: "Error", description: "Could not load recipes.", variant: "destructive" });
    } finally {
        setTimeout(() => setLoading(false), 300); // Simulate network delay
    }
  }, [toast]);

  const filteredRecipes = useMemo(() => {
    if (!searchTerm) return recipes;
    return recipes.filter(recipe =>
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (recipe.description && recipe.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      recipe.ingredients.some(ing => ing.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [recipes, searchTerm]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Spinner size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-4xl font-headline bg-gradient-to-r from-primary to-[hsl(var(--blue))] bg-clip-text text-transparent hover:from-[hsl(var(--blue))] hover:to-primary transition-all duration-300 ease-in-out">Explore Public Baking Recipes</h1>
      </div>
      
      <RecipeSearchInput searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      
      {filteredRecipes.length > 0 ? (
         <RecipeGrid recipes={filteredRecipes} />
      ) : (
        <div className="text-center py-10">
            <Search size={64} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-xl text-muted-foreground mb-2">No public baking recipes found.</p>
            {searchTerm && <p className="text-sm text-muted-foreground">Try a different keyword or clear your search.</p>}
            {!searchTerm && <p className="text-sm text-muted-foreground">Check back later for new public recipes.</p>}
        </div>
      )}
    </div>
  );
}
