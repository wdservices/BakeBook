
'use client';

import { useState, useEffect } from 'react';
import DashboardStatsCard from '@/components/admin/DashboardStatsCard';
import UserManagementTable from '@/components/admin/UserManagementTable';
import RecipeManagementTable from '@/components/admin/RecipeManagementTable';
import { mockUsers } from '@/data/mockUsers';
import type { User, Recipe } from '@/types';
import { UserRole } from '@/types';
import { Users, ChefHat, BarChart3, DollarSign } from 'lucide-react';
import Spinner from '@/components/ui/Spinner';
import { useToast } from '@/hooks/use-toast';
import { getAllRecipesFromFirestore, deleteRecipeFromFirestore } from '@/lib/firestoreService';

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const allRecipes = await getAllRecipesFromFirestore();
        setRecipes(allRecipes);
        setUsers(mockUsers); // Still using mock users for now
      } catch (error) {
        console.error("Failed to fetch admin data:", error);
        toast({
          title: "Error Loading Data",
          description: "Could not fetch recipes for the admin dashboard.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, role: newRole } : user
      )
    );
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex > -1) {
        mockUsers[userIndex].role = newRole;
    }
  };
  
  const handleDeleteRecipe = async (recipeId: string, recipeTitle: string) => {
    try {
        await deleteRecipeFromFirestore(recipeId);
        setRecipes(prevRecipes => prevRecipes.filter(recipe => recipe.id !== recipeId));
        toast({
            title: "Recipe Deleted",
            description: `"${recipeTitle}" has been permanently deleted from the database.`,
        });
    } catch(error) {
        console.error("Error deleting recipe from admin dashboard:", error);
        toast({
            title: "Deletion Failed",
            description: "Could not delete the recipe.",
            variant: "destructive"
        });
    }
  };

  const totalDonations = users.reduce((acc, user) => acc + (user.lastDonationAmount || 0), 0);
  const donatingUsersCount = users.filter(u => u.lastDonationAmount && u.lastDonationAmount > 0).length;

  if (loading) {
    return <div className="flex justify-center items-center min-h-[calc(100vh-300px)]"><Spinner size={48} /></div>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-headline animate-fade-in bg-gradient-to-r from-primary to-[hsl(var(--blue))] bg-clip-text text-transparent hover:from-[hsl(var(--blue))] hover:to-primary transition-all duration-300 ease-in-out">Admin Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <DashboardStatsCard 
          title="Total Users" 
          value={users.length} 
          icon={Users}
          description={`${users.filter(u => u.role === UserRole.ADMIN).length} admins`}
        />
        <DashboardStatsCard 
          title="Total Recipes" 
          value={recipes.length} 
          icon={ChefHat}
          description="Across all users"
        />
        <DashboardStatsCard 
          title="Total Donations" 
          value={`$${totalDonations.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          icon={DollarSign}
          description={`From ${donatingUsersCount} users`}
        />
        <DashboardStatsCard 
          title="Engagement (Mock)" 
          value="75%" 
          icon={BarChart3}
          description="Daily active users"
        />
      </div>
      
      <RecipeManagementTable recipes={recipes} onDeleteRecipe={handleDeleteRecipe} />
      
      <UserManagementTable users={users} onRoleChange={handleRoleChange} />

    </div>
  );
}
