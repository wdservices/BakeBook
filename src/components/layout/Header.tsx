
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChefHat, LogIn, LogOut, UserPlus, UserCircle, LayoutDashboard, PlusCircle, Menu, FileText } from 'lucide-react';
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
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const Header = () => {
  const { user, isAuthenticated, logout, loading: authLoading } = useAuth();
  const router = useRouter();

  const UserAvatar = () => {
    if (!user) return <UserCircle />;

    let avatarSrc: string | undefined = user.photoURL || undefined;
    const avatarAlt = user.name || user.email || 'User';
    const initials = user.name
      ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
      : user.email?.substring(0, 2).toUpperCase() || 'U';

    if (!avatarSrc) {
      // Generate avatar from ui-avatars.com if no photoURL
      const nameForAvatar = user.name || user.email || 'User';
      if (nameForAvatar) {
        avatarSrc = `https://ui-avatars.com/api/?name=${encodeURIComponent(nameForAvatar)}&background=random&color=fff&size=64`;
      }
    }

    return (
      <Avatar className="h-8 w-8">
        <AvatarImage src={avatarSrc} alt={avatarAlt} />
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

        <nav className="flex items-center gap-2">
          {/* Mobile Navigation - Hamburger Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[240px] sm:w-[300px] p-0">
                <SheetHeader className="p-4 border-b">
                  <SheetTitle asChild>
                    <Link href="/" className="flex items-center gap-2 text-xl font-headline group transition-colors">
                      <ChefHat size={28} className="text-primary group-hover:text-[hsl(var(--blue))] transition-colors" />
                      <span className="bg-gradient-to-r from-primary to-[hsl(var(--blue))] bg-clip-text text-transparent group-hover:from-[hsl(var(--blue))] group-hover:to-primary transition-all">Bakebook</span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <div className="p-4 grid gap-3">
                  <SheetClose asChild>
                    <Button variant="ghost" asChild className="w-full justify-start text-base">
                      <Link href="/recipes">Recipes</Link>
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button variant="ghost" asChild className="w-full justify-start text-base">
                      <Link href="/bakers">Bakers</Link>
                    </Button>
                  </SheetClose>
                  {/* Optional: Add auth links here too for mobile if needed */}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            <Button variant="ghost" asChild>
              <Link href="/recipes">Recipes</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/bakers">Bakers</Link>
            </Button>
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-2 ml-2">
            {authLoading ? (
              <Spinner size={24} />
            ) : isAuthenticated && user ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 p-1 rounded-full">
                      <UserAvatar />
                      <span className="hidden md:inline text-sm">{user.brandName || user.name || user.email}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                         <LayoutDashboard className="mr-2 h-4 w-4" />
                          My Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/recipes/new')}>
                         <PlusCircle className="mr-2 h-4 w-4" />
                          Create New Recipe
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/dashboard/invoices/new')}>
                         <FileText className="mr-2 h-4 w-4" />
                          Create Invoice
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
              <div className="flex items-center gap-1 md:gap-2">
                <Button variant="ghost" onClick={() => router.push('/login')} className="px-2 sm:px-3">
                  <LogIn className="mr-1 sm:mr-2 h-4 w-4" />
                  <span className="text-sm">Login</span>
                </Button>
                <Button onClick={() => router.push('/signup')} size="sm" className="px-2 sm:px-3">
                  <UserPlus className="mr-1 sm:mr-2 h-4 w-4" />
                  <span className="text-sm">Sign Up</span>
                </Button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
