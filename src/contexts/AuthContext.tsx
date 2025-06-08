
'use client';

import type { ReactNode } from 'react';
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/types';
import { UserRole } from '@/types';
import { mockUsers as initialMockUsers } from '@/data/mockUsers'; // Renamed import
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  signup: (email: string, pass: string, name?:string, brandName?: string) => Promise<boolean>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_STORAGE_KEY = 'bakebookAllUsers';
const CURRENT_USER_STORAGE_KEY = 'bakebookCurrentUser';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [usersList, setUsersList] = useState<User[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
        if (storedUsers) {
          return JSON.parse(storedUsers);
        }
      } catch (error) {
        console.error("Failed to parse all users from localStorage", error);
      }
    }
    // If nothing in localStorage, initialize with initialMockUsers and save it.
    // This part will only run on the client after mount.
    return [...initialMockUsers]; // Return a copy
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Initialize usersList from localStorage or seed if this is the first client-side run
    // This ensures that on first load, localStorage is populated if empty.
    if (typeof window !== 'undefined') {
        try {
            const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
            if (storedUsers) {
                setUsersList(JSON.parse(storedUsers));
            } else {
                // If no users in localStorage, use initial and store them
                localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initialMockUsers));
                setUsersList([...initialMockUsers]); // Set state with a copy
            }
        } catch (error) {
            console.error("Failed to initialize all users from localStorage", error);
            // Fallback to initial mock users if localStorage fails
            setUsersList([...initialMockUsers]);
        }
    }
  }, []);


  useEffect(() => {
    // Persist usersList to localStorage whenever it changes
    if (typeof window !== 'undefined') {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(usersList));
    }
  }, [usersList]);

  useEffect(() => {
    // Load current logged-in user session
    setLoading(true);
    if (typeof window !== 'undefined') {
      try {
        const storedUser = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Failed to parse current user from localStorage", error);
        localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, _pass: string): Promise<boolean> => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    // Login checks against the usersList state, which is persisted in localStorage
    const foundUser = usersList.find(u => u.email === email); 
    if (foundUser) {
      setUser(foundUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(foundUser));
      }
      toast({ title: "Login Successful", description: `Welcome back, ${foundUser.name || foundUser.email}!` });
      setLoading(false);
      if (foundUser.role === UserRole.ADMIN) {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
      return true;
    }
    toast({ title: "Login Failed", description: "Invalid email or password.", variant: "destructive" });
    setLoading(false);
    return false;
  }, [router, toast, usersList]);

  const signup = useCallback(async (email: string, _pass: string, name?: string, brandName?: string): Promise<boolean> => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (usersList.find(u => u.email === email)) {
      toast({ title: "Signup Failed", description: "Email already exists.", variant: "destructive" });
      setLoading(false);
      return false;
    }

    const newUser: User = {
      id: `user-${Date.now()}`, // More unique ID for mock
      email,
      name: name || email.split('@')[0],
      brandName: brandName || `${name || email.split('@')[0]}'s Bakery`,
      role: UserRole.USER,
    };

    setUsersList(prevUsersList => [...prevUsersList, newUser]);
    // No need to directly push to initialMockUsers as usersList state and localStorage are primary now.
    
    setUser(newUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(newUser));
    }
    toast({ title: "Signup Successful", description: `Welcome, ${newUser.name || newUser.email}!` });
    setLoading(false);
    router.push('/dashboard');
    return true;
  }, [router, toast, usersList, setUsersList]);

  const logout = useCallback(() => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    }
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
