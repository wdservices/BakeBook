
import type { Recipe } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Users, Eye } from 'lucide-react';

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard = ({ recipe }: RecipeCardProps) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-[1.02] group animate-scale-in bg-card">
      <Link href={`/recipes/${recipe.id}`} className="block">
        <CardHeader className="p-0">
          <div className="relative aspect-video w-full">
            <Image
              src={recipe.imageUrl || 'https://placehold.co/600x400.png?text=Recipe+Image'}
              alt={recipe.title}
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-300 group-hover:scale-105"
              data-ai-hint="baked goods"
            />
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-2">
          <CardTitle className="text-xl font-headline group-hover:text-primary transition-colors">{recipe.title}</CardTitle>
          <CardDescription className="text-muted-foreground line-clamp-3 h-[3.75rem]">{recipe.description}</CardDescription>
          <div className="flex items-center justify-between text-sm text-muted-foreground pt-2">
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>Prep: {recipe.prepTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>Bake: {recipe.cookTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users size={16} />
              <span>{recipe.servings} servings</span>
            </div>
          </div>
        </CardContent>
      </Link>
      <CardFooter className="p-4">
        <Link href={`/recipes/${recipe.id}`} className="w-full" legacyBehavior passHref>
          <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            <Eye size={18} className="mr-2" /> View Recipe
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default RecipeCard;

