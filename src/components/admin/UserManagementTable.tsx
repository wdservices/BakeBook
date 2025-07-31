'use client';
import type { User } from '@/types';
import { UserRole } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, UserCircle, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';

// New sub-component to safely render client-side specific formats
const DonationDisplay = ({ user }: { user: Partial<User> }) => {
  const [displayText, setDisplayText] = useState<string | null>(null);

  useEffect(() => {
    if (user.lastDonationAmount != null) {
      const amount = `$${user.lastDonationAmount.toLocaleString()}`;
      const date = user.lastDonationDate ? ` on ${format(new Date(user.lastDonationDate), 'PP')}` : '';
      setDisplayText(`${amount}${date}`);
    } else {
      setDisplayText("None");
    }
  }, [user]);

  if (displayText === "None") {
    return <span className="text-muted-foreground">None</span>;
  }
  
  // Render a placeholder or nothing during SSR and initial client render
  return <>{displayText || '...'}</>;
};

interface UserManagementTableProps {
  users: Array<Partial<User> & { id: string }>;
  onRoleChange: (userId: string, newRole: UserRole) => Promise<void>;
  isAdmin: boolean;
}

const UserManagementTable = ({ users, onRoleChange, isAdmin }: UserManagementTableProps) => {
  const { toast } = useToast();

  const handleRoleToggle = (user: Partial<User> & { id: string }) => {
    const currentRole = user.role || UserRole.USER;
    const newRole = currentRole === UserRole.ADMIN ? UserRole.USER : UserRole.ADMIN;
    onRoleChange(user.id, newRole);
    toast({
      title: "Role Updated",
      description: `${user.name || user.email || 'User'}'s role changed to ${newRole}.`,
    });
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl font-headline text-primary">User Management</CardTitle>
        <CardDescription>View and manage user roles and donations.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Last Donation</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name || 'N/A'}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.role === UserRole.ADMIN ? 'default' : 'secondary'} className="flex items-center gap-1 w-fit">
                    {user.role === UserRole.ADMIN ? <ShieldCheck size={14} /> : <UserCircle size={14} />}
                    {(user.role || UserRole.USER).charAt(0).toUpperCase() + (user.role || UserRole.USER).slice(1).toLowerCase()}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRoleToggle(user)}
                      className="h-8 w-8 p-0"
                      disabled={!isAdmin}
                      title={isAdmin ? "Change role" : "Admin privileges required"}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Badge>
                </TableCell>
                <TableCell>
                  <DonationDisplay user={user} />
                </TableCell>
                <TableCell className="text-right">
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default UserManagementTable;
