
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChefHat, LogIn, LogOut, UserPlus, UserCircle, LayoutDashboard, PlusCircle, Users2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Spinner from '../ui/Spinner';

const Header = () => {
  const { user, isAuthenticated, logout, loading: authLoading } = useAuth();
  const router = useRouter(); 

  const UserAvatar = () => {
    if (!user) return <UserCircle />;
    // Use photoURL if available (e.g., from Google Sign-In, or future profile uploads)
    // Otherwise, use initials from name or email
    const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase() : 
                     user.email ? user.email.substring(0,2).toUpperCase() : 'U';
    return (
      <Avatar className="h-8 w-8"> {/* Slightly smaller avatar */}
        <AvatarImage src={user.photoURL || undefined} alt={user.name || user.email || 'User'} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
    );
  };

  return (
    <header className="bg-card/80 backdrop-blur-md shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-2xl font-headline group transition-colors">
          <ChefHat size={32} className="text-primary group-hover:text-[hsl(var(--blue))] transition-colors" />
          <span className="bg-gradient-to-r from-primary to-[hsl(var(--blue))] bg-clip-text text-transparent group-hover:from-[hsl(var(--blue))] group-hover:to-primary transition-all">Bakebook</span>
        </Link>
        <nav className="flex items-center gap-2 md:gap-4">
          <Button variant="ghost" asChild>
            <Link href="/recipes">Recipes</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/bakers">Bakers</Link>
          </Button>
          
          {authLoading ? (
            <Spinner size={24} />
          ) : isAuthenticated && user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 p-1 rounded-full">
                    <UserAvatar />
                    <span className="hidden md:inline text-sm">{user.name || user.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/admin/dashboard')}>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Admin (Temp)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                       <LayoutDashboard className="mr-2 h-4 w-4" />
                        My Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/recipes/new')}>
                       <PlusCircle className="mr-2 h-4 w-4" />
                        Create New Recipe
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive-foreground focus:bg-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => router.push('/login')}>
                <LogIn className="mr-2 h-4 w-4" /> Login
              </Button>
              <Button onClick={() => router.push('/signup')}>
                <UserPlus className="mr-2 h-4 w-4" /> Sign Up
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
