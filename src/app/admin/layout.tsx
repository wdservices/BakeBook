
'use client';

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Spinner from '@/components/ui/Spinner';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Sidebar, SidebarProvider, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { LayoutDashboard, Users, Settings, ChefHat, LogOut, Home } from 'lucide-react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading, logout } = useAuth(); // Removed isAdmin for now
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/login?redirect=/admin/dashboard');
      }
      // Add role-based access control here later if needed, e.g., using Firestore custom claims
    }
  }, [isAuthenticated, loading, router]);

  if (loading || !isAuthenticated) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)]">
        <Spinner size={48} />
        {!loading && !isAuthenticated && <p className="mt-4">Redirecting to login...</p>}
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen bg-background">
        <Sidebar collapsible="icon" className="border-r bg-card">
          <SidebarHeader className="p-4 flex items-center justify-between">
             <Link href="/" className="flex items-center gap-2 text-xl font-headline text-primary hover:text-primary/80 transition-colors group-data-[state=collapsed]:hidden">
                <ChefHat size={28} /> Bakebook
            </Link>
            <SidebarTrigger className="md:hidden" />
          </SidebarHeader>
          <SidebarMenu className="p-2">
            <SidebarMenuItem>
              <Link href="/admin/dashboard" passHref legacyBehavior>
                <SidebarMenuButton tooltip="Dashboard">
                  <LayoutDashboard /> <span className="group-data-[collapsible=icon]:hidden">Dashboard</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/admin/dashboard" passHref legacyBehavior>
                <SidebarMenuButton tooltip="Users">
                  <Users /> <span className="group-data-[collapsible=icon]:hidden">Users</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <Link href="/recipes" passHref legacyBehavior>
                <SidebarMenuButton tooltip="Recipes Admin">
                  <ChefHat /> <span className="group-data-[collapsible=icon]:hidden">Recipes</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/admin/dashboard" passHref legacyBehavior> 
                <SidebarMenuButton tooltip="Settings">
                  <Settings /> <span className="group-data-[collapsible=icon]:hidden">Settings</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
          <div className="mt-auto p-2">
             <SidebarMenuItem>
                <Link href="/" passHref legacyBehavior>
                  <SidebarMenuButton tooltip="Back to Site">
                    <Home /> <span className="group-data-[collapsible=icon]:hidden">Back to Site</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={logout} tooltip="Logout" className="text-destructive hover:bg-destructive/20 hover:text-destructive-foreground focus:bg-destructive/30">
                <LogOut /> <span className="group-data-[collapsible=icon]:hidden">Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </div>
        </Sidebar>
        <SidebarInset className="flex-1 p-0">
          <div className="p-6 bg-background min-h-full">
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
