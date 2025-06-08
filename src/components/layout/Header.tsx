
'use client';

import Link from 'next/link';
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

const Header = () => {
  const { user, isAuthenticated, isAdmin, logout, loading } = useAuth();

  const UserAvatar = () => (
    <Avatar>
      <AvatarImage src={(user?.brandName || user?.name) ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.brandName || user.name)}&background=random&color=fff` : undefined} alt={user?.brandName || user?.name || 'User'} />
      <AvatarFallback>{user?.brandName ? user.brandName.substring(0, 2).toUpperCase() : user?.name ? user.name.substring(0, 2).toUpperCase() : <UserCircle />}</AvatarFallback>
    </Avatar>
  );

  return (
    <header className="bg-card/80 backdrop-blur-md shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-2xl font-headline group transition-colors">
          <ChefHat size={32} className="text-primary group-hover:text-[hsl(var(--blue))] transition-colors" />
          <span className="bg-gradient-to-r from-primary to-[hsl(var(--blue))] bg-clip-text text-transparent group-hover:from-[hsl(var(--blue))] group-hover:to-primary transition-all">Bakebook</span>
        </Link>
        <nav className="flex items-center gap-2 md:gap-4">
          <Link href="/recipes">
            <Button variant="ghost">Recipes</Button>
          </Link>
          <Link href="/bakers">
            <Button variant="ghost">Bakers</Button>
          </Link>
          {loading ? (
            <Button variant="ghost" disabled>Loading...</Button>
          ) : isAuthenticated ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <UserAvatar />
                    <span className="hidden md:inline">{user?.brandName || user?.name || user?.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {isAdmin && (
                    <Link href="/admin/dashboard">
                      <DropdownMenuItem>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Admin Dashboard
                      </DropdownMenuItem>
                    </Link>
                  )}
                  <Link href="/dashboard">
                    <DropdownMenuItem>
                       <LayoutDashboard className="mr-2 h-4 w-4" />
                        My Dashboard
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/recipes/new">
                    <DropdownMenuItem>
                       <PlusCircle className="mr-2 h-4 w-4" />
                        Create New Recipe
                    </DropdownMenuItem>
                  </Link>
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
              <Link href="/login">
                <Button variant="ghost">
                  <LogIn className="mr-2 h-4 w-4" /> Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" /> Sign Up
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
