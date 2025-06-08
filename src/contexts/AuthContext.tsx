
'use client';

import type { ReactNode } from 'react';
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile,
  signOut as firebaseSignOut, 
  type User as FirebaseUser 
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import type { User } from '@/types';
import { UserRole } from '@/types';
import { useToast } from "@/hooks/use-toast";
import Spinner from '@/components/ui/Spinner';
import type { SignUpFormValues, LoginFormValues } from '@/components/auth/AuthForm';

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
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      setLoading(true);
      if (firebaseUser) {
        // For existing session, brandName & phoneNumber would ideally come from Firestore.
        // For now, they are only set during the initial signup process for the current session.
        // If a user logs in directly, these fields might be null unless fetched from a DB.
        const existingBrandName = user?.id === firebaseUser.uid ? user.brandName : undefined;
        const existingPhoneNumber = user?.id === firebaseUser.uid ? user.phoneNumber : undefined;

        const appUser: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL, // Can be set later if profile editing is added
          role: UserRole.USER, // Default role
          brandName: existingBrandName, // Persisted from current session if available
          phoneNumber: existingPhoneNumber, // Persisted from current session if available
        };
        setUser(appUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // user dependency removed to avoid re-subscribing on local user state change

  const signupWithEmailPassword = useCallback(async (data: SignUpFormValues): Promise<boolean> => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const firebaseUser = userCredential.user;
      
      await updateProfile(firebaseUser, { displayName: data.name });

      const appUser: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        name: data.name,
        brandName: data.brandName,
        phoneNumber: data.phoneNumber,
        role: UserRole.USER,
      };
      setUser(appUser); // Set user in context with all details from form
      
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
      // onAuthStateChanged will handle setting the user state, including displayName.
      // For brandName and phoneNumber, they are not stored in Firebase Auth.
      // A proper solution would involve fetching these from Firestore upon login.
      // For now, they will be missing if the user logs in directly without a previous session where they were set.
      const firebaseUser = userCredential.user;
      toast({ title: "Login Successful", description: `Welcome back, ${firebaseUser.displayName || firebaseUser.email}!` });
      
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
    } catch (error: any) {
      console.error("Logout error:", error);
      toast({ title: "Logout Failed", description: error.message || "Could not log out.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [router, toast]);

  const isAuthenticated = !!user;

  const authPages = ['/login', '/signup'];
  if (loading && !authPages.includes(pathname)) {
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
