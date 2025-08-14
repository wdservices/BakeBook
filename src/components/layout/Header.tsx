
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChefHat, LogIn, LogOut, UserPlus, UserCircle, LayoutDashboard, PlusCircle, Menu, FileText, Sparkles, MessageSquare } from 'lucide-react';
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

        <nav className="flex items-center gap-1">
          {/* Auth Buttons - Next to menu */}
          {!isAuthenticated && !authLoading && (
            <div className="flex items-center gap-1 border-r border-border pr-2 mr-1">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => router.push('/login')}
                className="h-8 px-3 text-sm"
              >
                Login
              </Button>
              <Button 
                variant="default"
                size="sm" 
                onClick={() => router.push('/signup')}
                className="h-8 px-3 text-sm"
              >
                Register
              </Button>
            </div>
          )}
          
          {/* Navigation - Hamburger Menu */}
          <div className="flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Link href="/recipes" className="flex items-center space-x-2">
                  <ChefHat className="h-6 w-6" />
                  <span className="text-lg font-semibold">BakeBook</span>
                </Link>
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
                        <nav className="hidden md:flex items-center space-x-6">
                          <Link href="/recipes" className="text-sm font-medium hover:text-primary transition-colors">
                            Recipes
                          </Link>
                          <Link href="/ingredients" className="text-sm font-medium hover:text-primary transition-colors">
                            My Pantry
                          </Link>
                          <Link href="/receipts" className="text-sm font-medium hover:text-primary transition-colors">
                            Receipts
                          </Link>
                          <Link href="/assistant" className="text-sm font-medium hover:text-primary transition-colors flex items-center">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            AI Assistant
                          </Link>
                          {isAuthenticated && (
                            <Link href="/recipes/new" className="text-sm font-medium hover:text-primary transition-colors flex items-center">
                              <PlusCircle className="h-4 w-4 mr-1" />
                              New Recipe
                            </Link>
                          )}
                        </nav>
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
                    <Button variant="ghost" asChild className="w-full justify-start text-base">
                      <Link href="/assistant" className="text-amber-600 hover:text-amber-700">
                        <Sparkles className="mr-2 h-4 w-4" />
                        AI Assistant
                      </Link>
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button variant="outline" className="w-full justify-start text-base text-primary font-semibold" onClick={onOpenDonationModal}>
                      Donate
                    </Button>
                  </SheetClose>
                  
                  {/* Auth Links for non-authenticated users - Mobile menu only */}
                  {!isAuthenticated && (
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

          {/* User Profile/Avatar */}
          {!authLoading && isAuthenticated && user && (
            <div className="hidden md:flex items-center gap-2 ml-2">
              <UserAvatar />
              <span className="text-sm font-medium">{user.brandName || user.name || user.email || 'User'}</span>
            </div>
          )}

        </nav>
      </div>
    </header>
  );
};

export default Header;
