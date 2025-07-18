
'use client';

import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import Spinner from '@/components/ui/Spinner';
import { PlusCircle, User, ChefHat, Edit3, Trash2, Users, Search, Eye, EyeOff, FileText, Save } from 'lucide-react';
import type { Recipe, User as AppUser } from '@/types';
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { getUserRecipesFromFirestore, deleteRecipeFromFirestore, updateRecipeInFirestore, updateUserProfileFields } from '@/lib/firestoreService';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { cn } from '@/lib/utils';
import { mockRecipes } from '@/data/mockRecipes'; // Using mock data for display

const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  brandName: z.string().optional(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
});
type ProfileFormValues = z.infer<typeof profileFormSchema>;


export default function DashboardPage() {
  const { user, isAuthenticated, loading: authLoading, refreshUserProfile } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
  const [loadingRecipes, setLoadingRecipes] = useState(true);
  const [userRecipeSearchTerm, setUserRecipeSearchTerm] = useState('');

  const { register: registerProfile, handleSubmit: handleSubmitProfile, formState: { errors: profileErrors, isSubmitting: isSubmittingProfile }, reset: resetProfileForm } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
     defaultValues: {
      name: '',
      brandName: '',
      phoneNumber: '',
      address: '',
    }
  });

  useEffect(() => {
    if (user) {
      resetProfileForm({
        name: user.name || '',
        brandName: user.brandName || '',
        phoneNumber: user.phoneNumber || '',
        address: user.address || '',
      });
    }
  }, [user, resetProfileForm]);


  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      router.push('/login?redirect=/dashboard');
      return;
    }

    if (user?.id) {
      setLoadingRecipes(true);
      getUserRecipesFromFirestore(user.id)
        .then(recipes => {
          setUserRecipes(recipes);
        })
        .catch(error => {
          console.error("Error fetching user recipes:", error);
          toast({ title: "Error", description: "Could not load your recipes.", variant: "destructive" });
        })
        .finally(() => setLoadingRecipes(false));
    } else if (isAuthenticated && !user?.id) {
      setLoadingRecipes(true); 
    } else {
       setLoadingRecipes(false);
    }
  }, [isAuthenticated, authLoading, user, router, toast]);

  const handleProfileUpdateSubmit: SubmitHandler<ProfileFormValues> = async (data) => {
    if (!user?.id) {
      toast({ title: "Error", description: "User not found.", variant: "destructive" });
      return;
    }
    try {
      const updates: Partial<ProfileFormValues> = {
        name: data.name === undefined ? user.name : data.name,
        brandName: data.brandName === undefined ? user.brandName : data.brandName,
        phoneNumber: data.phoneNumber === undefined ? user.phoneNumber : data.phoneNumber,
        address: data.address === undefined ? user.address : data.address,
      };
      
      await updateUserProfileFields(user.id, updates);
      await refreshUserProfile(); 
      toast({ title: "Profile Updated", description: "Your profile details have been saved." });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({ title: "Update Failed", description: "Could not update your profile.", variant: "destructive" });
    }
  };

  const handleDeleteRecipe = async (recipeId: string, recipeTitle: string) => {
    try {
      await deleteRecipeFromFirestore(recipeId);
      setUserRecipes(prevRecipes => prevRecipes.filter(recipe => recipe.id !== recipeId));
      toast({
        title: "Recipe Deleted",
        description: `"${recipeTitle || 'Untitled Recipe'}" has been successfully deleted.`,
      });
    } catch (error) {
      console.error("Error deleting recipe:", error);
      toast({
        title: "Deletion Failed",
        description: `Could not delete "${recipeTitle || 'Untitled Recipe'}".`,
        variant: "destructive",
      });
    }
  };

  const handleTogglePublic = async (recipeId: string, currentIsPublic: boolean, recipeTitle: string) => {
    try {
      await updateRecipeInFirestore(recipeId, { isPublic: !currentIsPublic });
      setUserRecipes(prevRecipes =>
        prevRecipes.map(r => (r.id === recipeId ? { ...r, isPublic: !currentIsPublic, updatedAt: new Date().toISOString() } : r))
      );
      toast({
        title: "Recipe Visibility Updated",
        description: `"${recipeTitle || 'Untitled Recipe'}" is now ${!currentIsPublic ? "public" : "private"}.`,
      });
    } catch (error) {
      console.error("Error updating recipe visibility:", error);
      toast({
        title: "Update Failed",
        description: "Could not update recipe visibility.",
        variant: "destructive",
      });
    }
  };

  const DashboardCard = ({ title, value, icon: Icon, link, className }: { title: string | null; value: string | number | null; icon: React.ElementType; link?: string, className?: string }) => {
    const cardContent = (
        <Card className={cn("hover:shadow-lg transition-shadow duration-300 animate-scale-in h-full flex flex-col", className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            <Icon className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent className="flex-grow">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground truncate">{String(value)}</div>
        </CardContent>
        </Card>
    );

    if (link) {
        return <Link href={link} className="block h-full">{cardContent}</Link>;
    }
    return cardContent;
  };


  const searchedUserRecipes = useMemo(() => {
    if (!userRecipeSearchTerm) return userRecipes;
    return userRecipes.filter(recipe =>
      recipe.title.toLowerCase().includes(userRecipeSearchTerm.toLowerCase()) ||
      (recipe.description && recipe.description.toLowerCase().includes(userRecipeSearchTerm.toLowerCase()))
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

  const recipesCount = userRecipes.length;
  const displayedRecipesCount = searchedUserRecipes.length;
  const welcomeName = user.brandName || user.name || user.email?.split('@')[0];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-headline bg-gradient-to-r from-primary to-[hsl(var(--blue))] bg-clip-text text-transparent hover:from-[hsl(var(--blue))] hover:to-primary transition-all duration-300 ease-in-out">Welcome, {welcomeName}!</h1>
          {user.brandName && <p className="text-lg text-muted-foreground">Your Bakery: <span className="font-semibold text-accent">{user.brandName}</span></p>}
        </div>
        <Link href="/recipes/new" passHref>
          <Button size="lg">
            <PlusCircle className="mr-2 h-5 w-5" /> Add New Baking Recipe
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <DashboardCard
            title="Your Recipes"
            value={recipesCount}
            icon={ChefHat}
        />
        <DashboardCard
            title="Account Email"
            value={user.email}
            icon={User}
            className="truncate"
        />
         <DashboardCard
            title="Followers (Mock)"
            value={"120"} 
            icon={Users}
        />
        <DashboardCard
            title="Create Invoice"
            value={"New"}
            icon={FileText}
            link="/dashboard/invoices/new"
        />
      </div>

      <Card className="animate-scale-in">
        <CardHeader>
          <CardTitle className="text-2xl font-headline text-primary">Your Profile Details</CardTitle>
          <CardDescription>Update your brand name, contact information, and address. Empty fields will not be changed.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitProfile(handleProfileUpdateSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="profileName">Your Name</Label>
                <Input id="profileName" type="text" {...registerProfile('name')} placeholder="e.g., John Doe"/>
                {profileErrors.name && <p className="text-sm text-destructive">{profileErrors.name.message}</p>}
              </div>
              <div>
                <Label htmlFor="profileBrandName">Brand Name (Optional)</Label>
                <Input id="profileBrandName" type="text" {...registerProfile('brandName')} placeholder="e.g., John's Bakery"/>
                {profileErrors.brandName && <p className="text-sm text-destructive">{profileErrors.brandName.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="profilePhoneNumber">Phone Number (Optional)</Label>
                <Input id="profilePhoneNumber" type="tel" {...registerProfile('phoneNumber')} placeholder="e.g., (555) 123-4567"/>
                {profileErrors.phoneNumber && <p className="text-sm text-destructive">{profileErrors.phoneNumber.message}</p>}
              </div>
               <div>
                <Label htmlFor="profileAddress">Address (Optional - For Invoices)</Label>
                <Textarea id="profileAddress" {...registerProfile('address')} placeholder="123 Main St, Anytown, USA" rows={3}/>
                {profileErrors.address && <p className="text-sm text-destructive">{profileErrors.address.message}</p>}
              </div>
            </div>
            <Button type="submit" disabled={isSubmittingProfile}>
              {isSubmittingProfile ? <Spinner size={20} className="mr-2" /> : <Save className="mr-2 h-5 w-5" />}
              Save Profile Changes
            </Button>
          </form>
        </CardContent>
      </Card>


      <div>
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-3xl font-headline bg-gradient-to-r from-primary to-[hsl(var(--blue))] bg-clip-text text-transparent hover:from-[hsl(var(--blue))] hover:to-primary transition-all duration-300 ease-in-out">Your Baking Recipes</h2>
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
        ) : userRecipes.length === 0 ? (
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
        ) : displayedRecipesCount > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {searchedUserRecipes.map((recipe) => (
              <Card key={recipe.id} className="overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-[1.02] group animate-scale-in bg-card flex flex-col">
                <Link href={`/recipes/${recipe.id}`} className="block flex-grow">
                  <div className="relative aspect-video w-full">
                    <Image
                      src={recipe.imageUrl || `https://placehold.co/600x400.png?text=${encodeURIComponent(recipe.title || 'Baked Good')}`}
                      alt={recipe.title || 'Recipe image'}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      data-ai-hint="baked goods recipe"
                    />
                  </div>
                  <CardHeader className="p-3">
                    <div className="flex justify-between items-start">
                        <CardTitle className="text-lg font-headline group-hover:text-primary transition-colors">{recipe.title || 'Untitled Recipe'}</CardTitle>
                        <Badge variant={recipe.isPublic ? "default" : "outline"} className="text-xs whitespace-nowrap ml-2">
                            {recipe.isPublic ? <Eye size={12} className="mr-1"/> : <EyeOff size={12} className="mr-1"/>}
                            {recipe.isPublic ? "Public" : "Private"}
                        </Badge>
                    </div>
                     <p className="text-sm text-muted-foreground line-clamp-2 h-[2.5rem] pt-1">{recipe.description || 'No description available.'}</p>
                  </CardHeader>
                </Link>
                <CardFooter className="p-3 mt-auto flex justify-between items-center border-t border-border pt-3">
                  <div className="flex items-center space-x-2">
                      <Switch
                          id={`publish-switch-${recipe.id}`}
                          checked={recipe.isPublic ?? false}
                          onCheckedChange={() => handleTogglePublic(recipe.id, recipe.isPublic ?? false, recipe.title || 'Untitled Recipe')}
                          aria-label={`Toggle ${recipe.title || 'Untitled Recipe'} visibility`}
                      />
                      <Label htmlFor={`publish-switch-${recipe.id}`} className="text-xs text-muted-foreground cursor-pointer">
                          {recipe.isPublic ? "Published" : "Private"}
                      </Label>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button asChild variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors" title="Edit Recipe">
                      <Link href={`/recipes/${recipe.id}/edit`}>
                        <Edit3 size={16} />
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive-foreground focus:bg-destructive/20 transition-colors" title="Delete Recipe">
                          <Trash2 size={16} />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your recipe
                            "{recipe.title || 'Untitled Recipe'}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteRecipe(recipe.id, recipe.title || 'Untitled Recipe')}
                            className={buttonVariants({ variant: "destructive" })}
                          >
                            Yes, delete recipe
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
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
