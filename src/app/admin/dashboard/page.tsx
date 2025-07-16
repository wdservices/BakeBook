
'use client';

import { useState, useEffect } from 'react';
import DashboardStatsCard from '@/components/admin/DashboardStatsCard';
import UserManagementTable from '@/components/admin/UserManagementTable';
import RecipeManagementTable from '@/components/admin/RecipeManagementTable'; // New Component
import { mockUsers } from '@/data/mockUsers';
import { mockRecipes } from '@/data/mockRecipes';
import type { User, Recipe } from '@/types';
import { UserRole } from '@/types';
import { Users, ChefHat, BarChart3, DollarSign } from 'lucide-react';
import Spinner from '@/components/ui/Spinner';
import { useToast } from '@/hooks/use-toast';

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [recipes, setRecipes] = useState<Recipe[]>(mockRecipes);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setUsers(mockUsers);
      setRecipes(mockRecipes);
      setLoading(false);
    }, 500);
  }, []);

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
  
  const handleDeleteRecipe = (recipeId: string, recipeTitle: string) => {
    setRecipes(prevRecipes => prevRecipes.filter(recipe => recipe.id !== recipeId));
    toast({
        title: "Recipe Deleted (Mock)",
        description: `"${recipeTitle}" has been removed from the view.`,
    });
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
