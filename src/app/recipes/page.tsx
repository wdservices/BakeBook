
'use client';

import { useState, useEffect, useMemo } from 'react';
import RecipeGrid from '@/components/recipes/RecipeGrid';
import RecipeSearchInput from '@/components/recipes/RecipeSearchInput';
import { mockRecipes } from '@/data/mockRecipes'; // Using mock data for now
import type { Recipe } from '@/types';
import Spinner from '@/components/ui/Spinner';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, Search } from 'lucide-react';

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    setLoading(true);
    setTimeout(() => {
      // Only show public recipes on this page
      setRecipes(mockRecipes.filter(recipe => recipe.isPublic));
      setLoading(false);
    }, 500);
  }, []);

  const filteredRecipes = useMemo(() => {
    if (!searchTerm) return recipes;
    // Ensure recipes are already filtered for public visibility before applying search
    return recipes.filter(recipe =>
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
        <h1 className="text-4xl font-headline text-primary">Explore Public Baking Recipes</h1>
        {/* "Create New Recipe" button removed from here, now on user dashboard */}
      </div>
      
      <RecipeSearchInput searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      
      {filteredRecipes.length > 0 ? (
         <RecipeGrid recipes={filteredRecipes} />
      ) : (
        <div className="text-center py-10">
            <Search size={64} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-xl text-muted-foreground mb-2">No public baking recipes found.</p>
            <p className="text-sm text-muted-foreground">Try a different keyword or check back later for new public recipes.</p>
        </div>
      )}
    </div>
  );
}
