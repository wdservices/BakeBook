'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import UserManagementTable from '@/components/admin/UserManagementTable';
import { getAllUsersFromFirestore, updateUserProfileFields } from '@/lib/firestoreService';
import { User, UserRole } from '@/types';
import { useToast } from '@/hooks/use-toast';
import Spinner from '@/components/ui/Spinner';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log("Starting to fetch users...");
        const allUsers = await getAllUsersFromFirestore();
        console.log("Fetched users:", allUsers);
        setUsers(allUsers);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        toast({
          title: "Error Loading Users",
          description: "Could not fetch users. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [toast]);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      // Update the user's role in the database
      await updateUserProfileFields(userId, { role: newRole });
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      
      toast({
        title: "Role Updated",
        description: `User's role has been updated to ${newRole}`,
      });
    } catch (error) {
      console.error("Failed to update user role:", error);
      toast({
        title: "Update Failed",
        description: "Could not update user role. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Spinner size={48} />
      </div>
    );
  }

  // Ensure users have all required fields with defaults
  const usersWithDefaults = users.map(user => ({
    ...user,
    email: user.email || 'No email',
    name: user.name || 'Unnamed User',
    role: user.role || UserRole.USER
  }));

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">User Management</h1>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size={48} />
        </div>
      ) : (
        <div className="rounded-md border">
          <UserManagementTable 
            users={usersWithDefaults} 
            onRoleChange={handleRoleChange} 
            isAdmin={isAdmin} 
          />
        </div>
      )}
    </div>
  );
}
