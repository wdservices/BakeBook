
'use server'; // Indirection if used by server components, but primarily client-side for now

import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  Timestamp,
  setDoc,
  orderBy,
  limit
} from 'firebase/firestore';
import type { Recipe, Ingredient, RecipeStep, User } from '@/types';

// Helper to convert Firestore timestamp to ISO string or return existing string
const formatTimestamp = (timestamp: Timestamp | string | undefined): string => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate().toISOString();
  }
  return timestamp || new Date().toISOString(); // Fallback for undefined
};

// --- Recipe Functions ---

export const addRecipeToFirestore = async (
  recipeData: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt' | 'authorId' | 'authorName'>,
  authorId: string,
  authorName?: string | null
): Promise<Recipe> => {
  const recipeCollectionRef = collection(db, 'recipes');
  const newRecipeData = {
    ...recipeData,
    authorId,
    authorName: authorName || 'Anonymous',
    isPublic: recipeData.isPublic ?? false,
    ingredients: recipeData.ingredients.map(ing => ({ ...ing, id: ing.id || doc(collection(db, '_')).id })), // Ensure IDs
    steps: recipeData.steps.map(step => ({ ...step, id: step.id || doc(collection(db, '_')).id })), // Ensure IDs
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const docRef = await addDoc(recipeCollectionRef, newRecipeData);
  return { 
    ...recipeData,
    id: docRef.id,
    authorId,
    authorName: newRecipeData.authorName,
    isPublic: newRecipeData.isPublic,
    // These will be server timestamps, client representation will be strings
    createdAt: new Date().toISOString(), 
    updatedAt: new Date().toISOString(),
  };
};

export const getUserRecipesFromFirestore = async (userId: string): Promise<Recipe[]> => {
  const recipesCollectionRef = collection(db, 'recipes');
  const q = query(recipesCollectionRef, where('authorId', '==', userId), orderBy('updatedAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(docSnap => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: formatTimestamp(data.createdAt as Timestamp | string | undefined),
      updatedAt: formatTimestamp(data.updatedAt as Timestamp | string | undefined),
      // Ensure ingredients and steps have IDs, even if Firestore data is missing them (legacy or direct adds)
      ingredients: (data.ingredients || []).map((ing: Ingredient, idx: number) => ({...ing, id: ing.id || `ing-${docSnap.id}-${idx}`})),
      steps: (data.steps || []).map((step: RecipeStep, idx: number) => ({...step, id: step.id || `step-${docSnap.id}-${idx}`})),
      isPublic: data.isPublic ?? false,
    } as Recipe;
  });
};

export const getPublicRecipesFromFirestore = async (count?: number): Promise<Recipe[]> => {
  const recipesCollectionRef = collection(db, 'recipes');
  const q = count 
    ? query(recipesCollectionRef, where('isPublic', '==', true), orderBy('updatedAt', 'desc'), limit(count))
    : query(recipesCollectionRef, where('isPublic', '==', true), orderBy('updatedAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(docSnap => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: formatTimestamp(data.createdAt as Timestamp | string | undefined),
      updatedAt: formatTimestamp(data.updatedAt as Timestamp | string | undefined),
      ingredients: (data.ingredients || []).map((ing: Ingredient, idx: number) => ({...ing, id: ing.id || `ing-${docSnap.id}-${idx}`})),
      steps: (data.steps || []).map((step: RecipeStep, idx: number) => ({...step, id: step.id || `step-${docSnap.id}-${idx}`})),
      isPublic: data.isPublic ?? true, // Should be true if queried this way
    } as Recipe;
  });
};

export const getRecipeByIdFromFirestore = async (recipeId: string): Promise<Recipe | null> => {
  const recipeDocRef = doc(db, 'recipes', recipeId);
  const docSnap = await getDoc(recipeDocRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: formatTimestamp(data.createdAt as Timestamp | string | undefined),
      updatedAt: formatTimestamp(data.updatedAt as Timestamp | string | undefined),
      ingredients: (data.ingredients || []).map((ing: Ingredient, idx: number) => ({...ing, id: ing.id || `ing-${docSnap.id}-${idx}`})),
      steps: (data.steps || []).map((step: RecipeStep, idx: number) => ({...step, id: step.id || `step-${docSnap.id}-${idx}`})),
      isPublic: data.isPublic ?? false,
    } as Recipe;
  } else {
    return null;
  }
};

export const updateRecipeInFirestore = async (
  recipeId: string,
  updates: Partial<Omit<Recipe, 'id' | 'createdAt' | 'authorId' | 'authorName'>>
): Promise<void> => {
  const recipeDocRef = doc(db, 'recipes', recipeId);
  // Ensure ingredients and steps have IDs
  const validatedUpdates = { ...updates };
  if (validatedUpdates.ingredients) {
    validatedUpdates.ingredients = validatedUpdates.ingredients.map(ing => ({ ...ing, id: ing.id || doc(collection(db, '_')).id }));
  }
  if (validatedUpdates.steps) {
    validatedUpdates.steps = validatedUpdates.steps.map(step => ({ ...step, id: step.id || doc(collection(db, '_')).id }));
  }
  
  await updateDoc(recipeDocRef, {
    ...validatedUpdates,
    updatedAt: serverTimestamp(),
  });
};

export const deleteRecipeFromFirestore = async (recipeId: string): Promise<void> => {
  const recipeDocRef = doc(db, 'recipes', recipeId);
  await deleteDoc(recipeDocRef);
};


// --- User Profile Functions ---

// Using User type from '@/types' which includes UserRole
export const addUserProfileToFirestore = async (
  userId: string,
  profileData: Pick<User, 'email' | 'name' | 'brandName' | 'phoneNumber' | 'role' | 'photoURL'>
): Promise<void> => {
  const userDocRef = doc(db, 'users', userId);
  const dataToSet = {
    email: profileData.email || null,
    name: profileData.name || null,
    brandName: profileData.brandName || null,
    phoneNumber: profileData.phoneNumber || null,
    role: profileData.role, // Should always be defined
    photoURL: profileData.photoURL || null,
    createdAt: serverTimestamp(), // Add a created timestamp for user profiles
    updatedAt: serverTimestamp(),
  };
  await setDoc(userDocRef, dataToSet, { merge: true }); // Use setDoc with merge true to create or update
};

export const getUserProfileFromFirestore = async (userId: string): Promise<Partial<User> | null> => {
  const userDocRef = doc(db, 'users', userId);
  const docSnap = await getDoc(userDocRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      id: userId, // Add id to the returned object
      email: data.email,
      name: data.name,
      brandName: data.brandName,
      phoneNumber: data.phoneNumber,
      role: data.role,
      photoURL: data.photoURL,
      // Timestamps can be added if needed for display, but often not directly on User object
    } as Partial<User>;
  } else {
    return null;
  }
};
