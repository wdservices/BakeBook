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
const DonationDisplay = ({ user }: { user: User }) => {
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
  users: User[];
  onRoleChange: (userId: string, newRole: UserRole) => void; // Mocked action
}

const UserManagementTable = ({ users, onRoleChange }: UserManagementTableProps) => {
  const { toast } = useToast();

  const handleRoleToggle = (user: User) => {
    // In a real app, this would be an API call.
    // For mock, we just toggle between admin and user.
    const newRole = user.role === UserRole.ADMIN ? UserRole.USER : UserRole.ADMIN;
    onRoleChange(user.id, newRole);
    toast({
      title: "Role Updated",
      description: `${user.name || user.email}'s role changed to ${newRole}.`,
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
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DonationDisplay user={user} />
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" onClick={() => handleRoleToggle(user)}>
                    <Edit size={14} className="mr-1" /> Toggle Role
                  </Button>
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
