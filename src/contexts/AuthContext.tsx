
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
import { addUserProfileToFirestore, getUserProfileFromFirestore, updateUserProfileFields } from '@/lib/firestoreService';
import DonationModal from '@/components/donation/DonationModal';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  signupWithEmailPassword: (data: SignUpFormValues) => Promise<boolean>;
  loginWithEmailPassword: (data: LoginFormValues) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDonationModalOpen, setDonationModalOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  const fetchAndSetUser = useCallback(async (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
      const userProfile = await getUserProfileFromFirestore(firebaseUser.uid);
      const appUser: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName || userProfile?.name,
        photoURL: firebaseUser.photoURL || userProfile?.photoURL,
        role: userProfile?.role || UserRole.USER,
        brandName: userProfile?.brandName,
        phoneNumber: userProfile?.phoneNumber,
        address: userProfile?.address,
        lastDonationDate: userProfile?.lastDonationDate,
        lastPromptedDate: userProfile?.lastPromptedDate,
      };
      setUser(appUser);
    } else {
      setUser(null);
    }
  }, []);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      setLoading(true);
      await fetchAndSetUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [fetchAndSetUser]);

  useEffect(() => {
    if (user && user.id) { // Only run for logged-in users
      const now = new Date();
      const lastDonation = user.lastDonationDate ? new Date(user.lastDonationDate) : null;
      const lastPrompt = user.lastPromptedDate ? new Date(user.lastPromptedDate) : null;

      let shouldShow = false;

      if (lastDonation) {
        const daysSinceDonation = (now.getTime() - lastDonation.getTime()) / (1000 * 3600 * 24);
        if (daysSinceDonation >= 31) {
          shouldShow = true;
        }
      } else { // No donation ever
        if (!lastPrompt) {
          shouldShow = true; // First time ever seeing it
        } else {
          const daysSincePrompt = (now.getTime() - lastPrompt.getTime()) / (1000 * 3600 * 24);
          if (daysSincePrompt >= 1) {
            shouldShow = true;
          }
        }
      }

      if (shouldShow) {
        setDonationModalOpen(true);
        // Update last prompted date in Firestore
        updateUserProfileFields(user.id, { lastPromptedDate: now.toISOString() });
      }
    }
  }, [user]); // This runs whenever the user object changes (i.e., on login)

  const handleConfirmDonation = async () => {
    if (user && user.id) {
      const now = new Date().toISOString();
      await updateUserProfileFields(user.id, { lastDonationDate: now, lastPromptedDate: now });
      await refreshUserProfile(); // To get the new dates into the user object
      setDonationModalOpen(false);
      toast({ title: "Thank you!", description: "Your support means the world to us." });
    }
  };


  const refreshUserProfile = useCallback(async () => {
    setLoading(true);
    const currentFirebaseUser = auth.currentUser;
    if (currentFirebaseUser) {
      await fetchAndSetUser(currentFirebaseUser);
    }
    setLoading(false);
  }, [fetchAndSetUser]);

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
        address: data.address || null,
        role: UserRole.USER,
        photoURL: firebaseUser.photoURL || null,
      };
      await addUserProfileToFirestore(firebaseUser.uid, profileData);

      const appUser: User = {
        id: firebaseUser.uid,
        ...profileData,
        lastDonationDate: null,
        lastPromptedDate: null,
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
      // onAuthStateChanged will handle fetching profile from Firestore
      toast({ title: "Login Successful", description: `Welcome back!` });
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
  if (loading && !user && !authPages.includes(pathname)) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <Spinner size={48} />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signupWithEmailPassword, loginWithEmailPassword, logout, loading, refreshUserProfile }}>
      {children}
      <DonationModal
        open={isDonationModalOpen}
        onOpenChange={setDonationModalOpen}
        onConfirmDonation={handleConfirmDonation}
      />
    </AuthContext.Provider>
  );
};

export default AuthContext;
