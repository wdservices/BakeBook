
'use client';

import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Spinner from '@/components/ui/Spinner';
import { PlusCircle, User, Building, ChefHat, BarChart3, Edit3, Trash2, Users, Search } from 'lucide-react';
import type { Recipe } from '@/types';
import { mockRecipes, deleteRecipe as deleteRecipeData } from '@/data/mockRecipes';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';


export default function DashboardPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
  const [loadingRecipes, setLoadingRecipes] = useState(true);
  const [userRecipeSearchTerm, setUserRecipeSearchTerm] = useState('');

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      router.push('/login?redirect=/dashboard');
      return;
    }

    if (user) {
      setLoadingRecipes(true);
      // Simulate fetching user-specific recipes
      setTimeout(() => {
        const filteredRecipes = mockRecipes.filter(recipe => recipe.authorId === user.id);
        setUserRecipes(filteredRecipes);
        setLoadingRecipes(false);
      }, 300);
    }
  }, [isAuthenticated, authLoading, user, router]);

  const handleDeleteRecipe = (recipeId: string, recipeTitle: string) => {
    const success = deleteRecipeData(recipeId);
    if (success) {
      setUserRecipes(prevRecipes => prevRecipes.filter(recipe => recipe.id !== recipeId));
      toast({
        title: "Recipe Deleted",
        description: `"${recipeTitle}" has been successfully deleted.`,
      });
    } else {
      toast({
        title: "Deletion Failed",
        description: `Could not delete "${recipeTitle}".`,
        variant: "destructive",
      });
    }
  };
  
  const DashboardCard = ({ title, value, icon: Icon, actionButton }: { title: string; value: string | number; icon: React.ElementType; actionButton?: React.ReactNode }) => (
    <Card className="hover:shadow-lg transition-shadow duration-300 animate-scale-in">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-5 w-5 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground">{value}</div>
         {actionButton && <div className="mt-4">{actionButton}</div>}
      </CardContent>
    </Card>
  );

  const searchedUserRecipes = useMemo(() => {
    if (!userRecipeSearchTerm) return userRecipes;
    return userRecipes.filter(recipe =>
      recipe.title.toLowerCase().includes(userRecipeSearchTerm.toLowerCase()) ||
      recipe.description.toLowerCase().includes(userRecipeSearchTerm.toLowerCase())
    );
  }, [userRecipes, userRecipeSearchTerm]);


  if (authLoading || (!isAuthenticated && !authLoading)) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Spinner size={48} />
        {!authLoading && !isAuthenticated && <p className="mt-4">Redirecting to login...</p>}
      </div>
    );
  }

  if (!user) {
    return <div className="text-center py-10">Please log in to view your dashboard.</div>;
  }
  
  const recipesCount = userRecipes.length; // This will be the total count before search
  const displayedRecipesCount = searchedUserRecipes.length;


  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-headline text-primary">Welcome, {user.brandName || user.name || user.email?.split('@')[0]}!</h1>
          {user.brandName && <p className="text-lg text-muted-foreground">Your Bakery: <span className="font-semibold text-accent">{user.brandName}</span></p>}
        </div>
        <Link href="/recipes/new" passHref>
          <Button size="lg">
            <PlusCircle className="mr-2 h-5 w-5" /> Add New Baking Recipe
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <DashboardCard 
            title="Your Recipes" 
            value={recipesCount} 
            icon={ChefHat}
        />
        <DashboardCard 
            title="Account Email" 
            value={user.email} 
            icon={User}
        />
         <DashboardCard 
            title="Followers (Mock)" 
            value={"120"} 
            icon={Users}
        />
      </div>
      
      <div>
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-3xl font-headline text-primary">Your Baking Recipes</h2>
          {userRecipes.length > 0 && (
            <div className="relative w-full md:w-auto md:max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search your recipes..."
                    value={userRecipeSearchTerm}
                    onChange={(e) => setUserRecipeSearchTerm(e.target.value)}
                    className="pl-10 py-2 text-sm rounded-md"
                />
            </div>
          )}
        </div>

        {loadingRecipes ? (
           <div className="flex justify-center items-center min-h-[200px]"><Spinner size={36} /></div>
        ) : userRecipes.length === 0 ? ( // No recipes at all
          <Card className="text-center p-10 animate-scale-in">
            <ChefHat size={64} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-2xl font-headline mb-2">No Recipes Yet!</h3>
            <p className="text-muted-foreground mb-6">Start your baking journey by adding your first recipe.</p>
            <Link href="/recipes/new" passHref>
              <Button size="lg">
                <PlusCircle className="mr-2 h-5 w-5" /> Add Your First Baking Recipe
              </Button>
            </Link>
          </Card>
        ) : displayedRecipesCount > 0 ? ( // Has recipes and search yields results
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchedUserRecipes.map((recipe) => (
              <Card key={recipe.id} className="overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-[1.02] group animate-scale-in bg-card flex flex-col">
                <Link href={`/recipes/${recipe.id}`} className="block">
                  {recipe.imageUrl && (
                    <div className="relative aspect-video w-full">
                      <img
                        src={recipe.imageUrl}
                        alt={recipe.title}
                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint="baked goods"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-xl font-headline group-hover:text-primary transition-colors">{recipe.title}</CardTitle>
                    <CardDescription className="text-muted-foreground line-clamp-2 h-[2.5rem]">{recipe.description}</CardDescription>
                  </CardHeader>
                </Link>
                <CardFooter className="p-4 mt-auto flex gap-2">
                  <Link href={`/recipes/${recipe.id}/edit`} className="flex-1" legacyBehavior passHref>
                    <Button variant="outline" className="w-full group-hover:bg-primary/10 group-hover:border-primary group-hover:text-primary transition-colors">
                      <Edit3 size={18} className="mr-2" /> Edit
                    </Button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-auto group-hover:bg-destructive/90 transition-colors">
                        <Trash2 size={18} />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your recipe
                          "{recipe.title}".
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteRecipe(recipe.id, recipe.title)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : ( // Has recipes but search yields no results
          <Card className="text-center p-10 animate-scale-in">
            <Search size={64} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-2xl font-headline mb-2">No Recipes Found</h3>
            <p className="text-muted-foreground">No recipes match your search term "{userRecipeSearchTerm}".</p>
             <Button variant="link" onClick={() => setUserRecipeSearchTerm('')} className="mt-2">Clear Search</Button>
          </Card>
        )}
      </div>
    </div>
  );
}
