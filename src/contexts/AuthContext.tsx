'use client';

import type { ReactNode } from 'react';
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/types';
import { UserRole } from '@/types';
import { mockUsers } from '@/data/mockUsers';
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, pass: string) => Promise<boolean>; // pass is unused for mock
  logout: () => void;
  signup: (email: string, pass: string, name?:string) => Promise<boolean>; // pass is unused for mock
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setLoading(true);
    try {
      const storedUser = localStorage.getItem('bakebookUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('bakebookUser');
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, _pass: string): Promise<boolean> => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('bakebookUser', JSON.stringify(foundUser));
      toast({ title: "Login Successful", description: `Welcome back, ${foundUser.name || foundUser.email}!` });
      setLoading(false);
      router.push(foundUser.role === UserRole.ADMIN ? '/admin/dashboard' : '/recipes');
      return true;
    }
    toast({ title: "Login Failed", description: "Invalid email or password.", variant: "destructive" });
    setLoading(false);
    return false;
  }, [router, toast]);

  const signup = useCallback(async (email: string, _pass: string, name?: string): Promise<boolean> => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    if (mockUsers.find(u => u.email === email)) {
      toast({ title: "Signup Failed", description: "Email already exists.", variant: "destructive" });
      setLoading(false);
      return false;
    }
    const newUser: User = {
      id: `user${mockUsers.length + 1}`,
      email,
      name: name || email.split('@')[0],
      role: UserRole.USER, // Default role
    };
    mockUsers.push(newUser); // Add to mock data (in real app, this would be DB)
    setUser(newUser);
    localStorage.setItem('bakebookUser', JSON.stringify(newUser));
    toast({ title: "Signup Successful", description: `Welcome, ${newUser.name || newUser.email}!` });
    setLoading(false);
    router.push('/recipes');
    return true;
  }, [router, toast]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('bakebookUser');
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
    router.push('/login');
  }, [router, toast]);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === UserRole.ADMIN;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isAdmin, login, logout, signup, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
