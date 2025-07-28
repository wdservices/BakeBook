
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChefHat, LogIn, LogOut, UserPlus, UserCircle, LayoutDashboard, PlusCircle, Menu, FileText } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Spinner from '../ui/Spinner';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface HeaderProps {
  onOpenDonationModal?: () => void;
}

const Header = ({ onOpenDonationModal }: HeaderProps) => {
  const { user, isAuthenticated, logout, loading: authLoading } = useAuth();
  const router = useRouter();

  const UserAvatar = () => {
    if (!user) return <UserCircle />;

    let avatarSrc: string | undefined = user.photoURL || undefined;
    const avatarAlt = user.name || user.email || 'User';
    
    // Safely generate initials
    const getInitials = (name: string | null | undefined, email: string | null | undefined): string => {
        if (name) {
            return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        }
        if (email) {
            return email.substring(0, 2).toUpperCase();
        }
        return 'U'; // Default fallback
    };
    const initials = getInitials(user.name, user.email);

    if (!avatarSrc) {
      // Generate avatar from ui-avatars.com if no photoURL
      const nameForAvatar = user.brandName || user.name || user.email || 'User';
      if (nameForAvatar) {
        avatarSrc = `https://ui-avatars.com/api/?name=${encodeURIComponent(nameForAvatar)}&color=fff&size=64`;
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
          {/* Navigation - Hamburger Menu */}
          <div>
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
                  {/* User Information at the top */}
                  {isAuthenticated && user && (
                    <>
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg mb-2">
                        <UserAvatar />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{user.brandName || user.name || user.email || 'User'}</p>
                          {user.email && <p className="text-xs text-muted-foreground truncate">{user.email}</p>}
                        </div>
                      </div>
                      
                      {/* User Menu Items */}
                      <SheetClose asChild>
                        <Button variant="ghost" className="w-full justify-start text-base" onClick={() => router.push('/dashboard')}>
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          My Dashboard
                        </Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button variant="ghost" className="w-full justify-start text-base" onClick={() => router.push('/recipes/new')}>
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Create New Recipe
                        </Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button variant="ghost" className="w-full justify-start text-base" onClick={() => router.push('/dashboard/invoices/new')}>
                          <FileText className="mr-2 h-4 w-4" />
                          Create Invoice
                        </Button>
                      </SheetClose>
                      
                      <div className="border-t pt-3 mt-2" />
                    </>
                  )}
                  
                  {/* Navigation Links */}
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
                  <SheetClose asChild>
                    <Button variant="outline" className="w-full justify-start text-base text-primary font-semibold" onClick={onOpenDonationModal}>
                      Donate
                    </Button>
                  </SheetClose>
                  
                  {/* Auth Links for non-authenticated users - Mobile only */}
                  {!isAuthenticated && (
                    <>
                      <div className="border-t pt-3 mt-2 md:hidden" />
                      <div className="md:hidden">
                        <SheetClose asChild>
                          <Button variant="ghost" className="w-full justify-start text-base" onClick={() => router.push('/login')}>
                            <LogIn className="mr-2 h-4 w-4" />
                            Login
                          </Button>
                        </SheetClose>
                        <SheetClose asChild>
                          <Button className="w-full justify-start text-base" onClick={() => router.push('/signup')}>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Sign Up
                          </Button>
                        </SheetClose>
                      </div>
                    </>
                  )}
                  
                  {/* Logout for authenticated users */}
                  {isAuthenticated && user && (
                    <>
                      <div className="border-t pt-3 mt-2" />
                      <SheetClose asChild>
                        <Button variant="ghost" className="w-full justify-start text-base text-destructive hover:text-destructive-foreground hover:bg-destructive" onClick={logout}>
                          <LogOut className="mr-2 h-4 w-4" />
                          Logout
                        </Button>
                      </SheetClose>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Authentication Section */}
          <div className="hidden md:flex items-center gap-2 ml-2">
            {authLoading ? (
              <Spinner size={24} />
            ) : isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                <UserAvatar />
                <span className="text-sm font-medium">{user.brandName || user.name || user.email || 'User'}</span>
              </div>
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
