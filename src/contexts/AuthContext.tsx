
'use client';

import type { ReactNode } from 'react';
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile as firebaseUpdateProfile, // Renamed to avoid conflict
  signOut as firebaseSignOut, 
  type User as FirebaseUser 
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import type { User } from '@/types';
import { UserRole } from '@/types';
import { useToast } from "@/hooks/use-toast";
import Spinner from '@/components/ui/Spinner';
import type { SignUpFormValues, LoginFormValues } from '@/components/auth/AuthForm';
import { addUserProfileToFirestore, getUserProfileFromFirestore } from '@/lib/firestoreService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  signupWithEmailPassword: (data: SignUpFormValues) => Promise<boolean>;
  loginWithEmailPassword: (data: LoginFormValues) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      setLoading(true);
      if (firebaseUser) {
        const userProfile = await getUserProfileFromFirestore(firebaseUser.uid);
        const appUser: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || userProfile?.name,
          photoURL: firebaseUser.photoURL || userProfile?.photoURL,
          role: userProfile?.role || UserRole.USER, // Default role if not in Firestore
          brandName: userProfile?.brandName,
          phoneNumber: userProfile?.phoneNumber,
        };
        setUser(appUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signupWithEmailPassword = useCallback(async (data: SignUpFormValues): Promise<boolean> => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const firebaseUser = userCredential.user;
      
      await firebaseUpdateProfile(firebaseUser, { displayName: data.name });

      const profileData = {
        email: data.email,
        name: data.name,
        brandName: data.brandName || null,
        phoneNumber: data.phoneNumber || null,
        role: UserRole.USER,
        photoURL: firebaseUser.photoURL || null,
      };
      await addUserProfileToFirestore(firebaseUser.uid, profileData);
      
      const appUser: User = {
        id: firebaseUser.uid,
        ...profileData,
      };
      setUser(appUser);
      
      toast({ title: "Account Created!", description: `Welcome, ${data.name}!` });
      const redirectPath = new URLSearchParams(window.location.search).get('redirect');
      router.push(redirectPath || '/dashboard');
      return true;
    } catch (error: any) {
      console.error("Sign-up error:", error);
      toast({ title: "Sign-up Failed", description: error.message || "Could not create account.", variant: "destructive" });
      return false;
    } finally {
      setLoading(false);
    }
  }, [router, toast]);

  const loginWithEmailPassword = useCallback(async (data: LoginFormValues): Promise<boolean> => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      const firebaseUser = userCredential.user;
      
      // User profile data will be fetched by onAuthStateChanged, including brandName, phoneNumber from Firestore
      const userProfile = await getUserProfileFromFirestore(firebaseUser.uid);
      const appUser: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName || userProfile?.name,
        photoURL: firebaseUser.photoURL || userProfile?.photoURL,
        role: userProfile?.role || UserRole.USER,
        brandName: userProfile?.brandName,
        phoneNumber: userProfile?.phoneNumber,
      };
      setUser(appUser);

      toast({ title: "Login Successful", description: `Welcome back, ${appUser.name || appUser.email}!` });
      
      const redirectPath = new URLSearchParams(window.location.search).get('redirect');
      router.push(redirectPath || '/dashboard');
      return true;
    } catch (error: any) {
      console.error("Login error:", error);
      toast({ title: "Login Failed", description: error.message || "Could not sign in.", variant: "destructive" });
      return false;
    } finally {
      setLoading(false);
    }
  }, [router, toast]);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      setUser(null);
      toast({ title: "Logged Out", description: "You have been successfully logged out." });
      router.push('/login');
    } catch (error: any) { // Added opening curly brace
      console.error("Logout error:", error);
      toast({ title: "Logout Failed", description: error.message || "Could not log out.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [router, toast]);

  const isAuthenticated = !!user;

  const authPages = ['/login', '/signup'];
  if (loading && !user && !authPages.includes(pathname)) { // Adjusted loading condition
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <Spinner size={48} />
      </div>
    );
  }
  
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signupWithEmailPassword, loginWithEmailPassword, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
