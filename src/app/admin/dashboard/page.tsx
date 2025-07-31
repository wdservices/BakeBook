'use client';

import { useState, useEffect } from 'react';
import { Users, ChefHat, BarChart3, DollarSign, Shield, RefreshCw, ImageOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getAllRecipesFromFirestore, deleteRecipeFromFirestore, getAllUsersFromFirestore } from '@/lib/firestoreService';
import type { User, Recipe } from '@/types';
import { UserRole } from '@/types';
import DashboardStatsCard from '@/components/admin/DashboardStatsCard';
import UserManagementTable from '@/components/admin/UserManagementTable';
import RecipeManagementTable from '@/components/admin/RecipeManagementTable';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/button';

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
    <div className="w-full max-w-full">
      <div className="flex flex-col space-y-6 w-full">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex space-x-2">
            <Button onClick={() => window.location.reload()} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 w-full">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 text-white shadow-lg">
            <div className="text-sm font-medium mb-1 text-blue-100">Total Users</div>
            <div className="text-3xl font-bold mb-2">{users.length}</div>
            <div className="text-sm text-blue-100">{users.length} registered users</div>
            <Users className="h-8 w-8 mt-2 text-blue-200" />
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-6 text-white shadow-lg">
            <div className="text-sm font-medium mb-1 text-green-100">Active Users</div>
            <div className="text-3xl font-bold mb-2">
              {users.filter(u => u.role === UserRole.USER).length}
            </div>
            <div className="text-sm text-green-100">Regular users</div>
            <Users className="h-8 w-8 mt-2 text-green-200" />
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6 text-white shadow-lg">
            <div className="text-sm font-medium mb-1 text-purple-100">Admin Users</div>
            <div className="text-3xl font-bold mb-2">
              {users.filter(u => u.role === UserRole.ADMIN).length}
            </div>
            <div className="text-sm text-purple-100">Administrators</div>
            <Shield className="h-8 w-8 mt-2 text-purple-200" />
          </div>

          <div className="bg-gradient-to-br from-amber-600 to-amber-800 rounded-xl p-6 text-white shadow-lg">
            <div className="text-sm font-medium mb-1 text-amber-100">Total Donations</div>
            <div className="text-3xl font-bold mb-2">
              ₦{totalDonations.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-sm text-amber-100">From {donatingUsersCount} users</div>
            <DollarSign className="h-8 w-8 mt-2 text-amber-200" />
          </div>

          <div className="bg-gradient-to-br from-rose-600 to-rose-800 rounded-xl p-6 text-white shadow-lg">
            <div className="text-sm font-medium mb-1 text-rose-100">Engagement</div>
            <div className="text-3xl font-bold mb-2">
              {Math.round((users.length / 100) * 75)}%
            </div>
            <div className="text-sm text-rose-100">Monthly active users</div>
            <BarChart3 className="h-8 w-8 mt-2 text-rose-200" />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 w-full">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">Recent Users</h2>
            <div className="space-y-4">
              {users.slice(0, 5).map(user => (
                <div key={user.id} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <span className="text-blue-600 dark:text-blue-300 font-medium">
                        {user.name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{user.name || 'Anonymous User'}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    user.role === UserRole.ADMIN 
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' 
                      : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  }`}>
                    {user.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">Recent Recipes</h2>
            <div className="space-y-4">
              {recipes.slice(0, 5).map(recipe => (
                <div key={recipe.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <div className="h-16 w-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700">
                    {recipe.imageUrl ? (
                      <img
                        src={recipe.imageUrl}
                        alt={recipe.title}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder-recipe.jpg';
                        }}
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-400">
                        <ImageOff className="h-6 w-6" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{recipe.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {recipe.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

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
    </div>
  );
}
