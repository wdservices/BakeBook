
'use client';

import { useState, useEffect } from 'react';
import DashboardStatsCard from '@/components/admin/DashboardStatsCard';
import UserManagementTable from '@/components/admin/UserManagementTable';
import RecipeManagementTable from '@/components/admin/RecipeManagementTable';

import type { User, Recipe } from '@/types';
import { UserRole } from '@/types';
import { Users, ChefHat, BarChart3, DollarSign } from 'lucide-react';
import Spinner from '@/components/ui/Spinner';
import { useToast } from '@/hooks/use-toast';
import { getAllRecipesFromFirestore, deleteRecipeFromFirestore, getAllUsersFromFirestore } from '@/lib/firestoreService';

function getCurrentMonthYear() {
  const now = new Date();
  return { month: now.getMonth(), year: now.getFullYear() };
}

function isDonationThisMonth(dateStr: string | null | undefined) {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  const { month, year } = getCurrentMonthYear();
  return date.getMonth() === month && date.getFullYear() === year;
}

function DonorLeaderboard() {
  const [topDonors, setTopDonors] = useState<User[]>([]);

  useEffect(() => {
    async function fetchDonors() {
      const users = await getAllUsersFromFirestore();
      const monthlyDonors = users.filter(u => u.lastDonationAmount && isDonationThisMonth(u.lastDonationDate));
      const sorted = monthlyDonors.sort((a, b) => (b.lastDonationAmount || 0) - (a.lastDonationAmount || 0));
      setTopDonors(sorted.slice(0, 3));
    }
    fetchDonors();
  }, []);

  if (topDonors.length === 0) return null;
  return (
    <div className="bg-gradient-to-r from-yellow-100 to-yellow-300 border border-yellow-400 rounded-lg p-4 mb-8 text-center animate-fade-in">
      <h2 className="text-xl font-bold text-yellow-800 mb-2">Top Donors This Month</h2>
      <ul className="mb-2">
        {topDonors.map((donor, idx) => (
          <li key={donor.id} className="text-yellow-900 font-semibold">
            {idx === 0 && '🥇 '}
            {idx === 1 && '🥈 '}
            {idx === 2 && '🥉 '}
            {donor.brandName || donor.name || donor.email} - ₦{donor.lastDonationAmount?.toLocaleString() || 0}
          </li>
        ))}
      </ul>
      <p className="text-yellow-800">Thank you to all our supporters! Your generosity keeps BakeBook running.</p>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        // Fetch both recipes and users in parallel
        const [allRecipes, allUsers] = await Promise.all([
          getAllRecipesFromFirestore(),
          getAllUsersFromFirestore()
        ]);
        setRecipes(allRecipes);
        setUsers(allUsers);
      } catch (error) {
        console.error("Failed to fetch admin data:", error);
        toast({
          title: "Error Loading Data",
          description: "Could not fetch data for the admin dashboard.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      // In a real implementation, you would update the user's role in the database here
      // For now, we'll just update the local state
      const updatedUsers = users.map(u => 
        u.id === userId ? { ...u, role: newRole } : u
      );
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Failed to update user role:", error);
      toast({
        title: "Update Failed",
        description: "Could not update user role. Please try again.",
        variant: "destructive",
      });
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
          value={users.length.toString()} 
          icon={Users}
          description={`${users.length} registered users`}
        />
        <DashboardStatsCard 
          title="Active Users" 
          value={users.filter(u => u.role === UserRole.USER).length.toString()} 
          icon={Users}
          description="Regular users"
        />
        <DashboardStatsCard 
          title="Admin Users" 
          value={users.filter(u => u.role === UserRole.ADMIN).length.toString()} 
          icon={Users}
          description="Administrators"
        />
        <DashboardStatsCard 
          title="Total Donations" 
          value={`$${totalDonations.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          icon={DollarSign}
          description={`From ${donatingUsersCount} users`}
        />
        <DashboardStatsCard 
          title="Engagement" 
          value={`${Math.round((users.length / 100) * 75)}%`}
          icon={BarChart3}
          description="Monthly active users"
        />
      </div>
      
      <DonorLeaderboard />
      
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">User Management</h2>
          <UserManagementTable 
            users={users} 
            onRoleChange={handleRoleChange} 
            isAdmin={true} 
          />
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-4">Recipe Management</h2>
          <RecipeManagementTable recipes={recipes} onDeleteRecipe={handleDeleteRecipe} />
        </div>
      </div>
    </div>
  );
}
