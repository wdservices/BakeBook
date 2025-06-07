import type { Recipe } from '@/types';
import RecipeCard from './RecipeCard';

interface RecipeGridProps {
  recipes: Recipe[];
}

const RecipeGrid = ({ recipes }: RecipeGridProps) => {
  if (recipes.length === 0) {
    return <p className="text-center text-muted-foreground text-xl py-10">No recipes found. Try a different search!</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
};

export default RecipeGrid;
