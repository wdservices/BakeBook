
'use client';

import { useState, useEffect } from 'react';
import DashboardStatsCard from '@/components/admin/DashboardStatsCard';
import UserManagementTable from '@/components/admin/UserManagementTable';
import { mockUsers } from '@/data/mockUsers';
import { mockRecipes } from '@/data/mockRecipes';
import type { User } from '@/types';
import { UserRole } from '@/types';
import { Users, ChefHat, BarChart3 } from 'lucide-react';
import Spinner from '@/components/ui/Spinner';

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [recipesCount, setRecipesCount] = useState(mockRecipes.length);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching or complex calculations
    setLoading(true);
    setTimeout(() => {
      setUsers(mockUsers); // In real app, fetch users
      setRecipesCount(mockRecipes.length); // In real app, fetch recipe count
      setLoading(false);
    }, 500);
  }, []);

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    // This is a mock update. In a real app, this would be an API call.
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, role: newRole } : user
      )
    );
    // Also update mockUsers array if it's meant to be persistent across mock sessions in this component
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex > -1) {
        mockUsers[userIndex].role = newRole;
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-[calc(100vh-300px)]"><Spinner size={48} /></div>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-headline animate-fade-in bg-gradient-to-r from-primary to-[hsl(var(--blue))] bg-clip-text text-transparent hover:from-[hsl(var(--blue))] hover:to-primary transition-all duration-300 ease-in-out">Admin Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <DashboardStatsCard 
          title="Total Users" 
          value={users.length} 
          icon={Users}
          description={`${users.filter(u => u.role === UserRole.ADMIN).length} admins`}
        />
        <DashboardStatsCard 
          title="Total Recipes" 
          value={recipesCount} 
          icon={ChefHat}
          description="Across all users"
        />
        <DashboardStatsCard 
          title="Engagement (Mock)" 
          value="75%" 
          icon={BarChart3}
          description="Daily active users"
        />
      </div>
      
      <UserManagementTable users={users} onRoleChange={handleRoleChange} />
    </div>
  );
}
