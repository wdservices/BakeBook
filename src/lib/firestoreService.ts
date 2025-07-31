

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
import type { Recipe, Ingredient, RecipeStep, User, Invoice } from '@/types';
import { UserRole } from '@/types';

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
  console.log("Attempting to add recipe to Firestore:", recipeData);
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
  console.log("Recipe added successfully with ID:", docRef.id);
  return {
    ...recipeData,
    id: docRef.id,
    authorId,
    authorName: newRecipeData.authorName,
    isPublic: newRecipeData.isPublic,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export const getUserRecipesFromFirestore = async (userId: string): Promise<Recipe[]> => {
  console.log(`Fetching recipes for user ID: ${userId} from Firestore...`);
  const recipesCollectionRef = collection(db, 'recipes');
  const q = query(recipesCollectionRef, where('authorId', '==', userId), orderBy('updatedAt', 'desc'));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    console.log(`No recipes found in Firestore for user ID: ${userId}.`);
    return [];
  }
  console.log(`Found ${querySnapshot.docs.length} recipes for user ${userId}.`);
  return querySnapshot.docs.map(docSnap => {
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
  });
};

export const getPublicRecipesFromFirestore = async (count?: number): Promise<Recipe[]> => {
  console.log("Fetching public recipes from Firestore...");
  const recipesCollectionRef = collection(db, 'recipes');
  const q = count
    ? query(recipesCollectionRef, where('isPublic', '==', true), orderBy('updatedAt', 'desc'), limit(count))
    : query(recipesCollectionRef, where('isPublic', '==', true), orderBy('updatedAt', 'desc'));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    console.log("No public recipes found in Firestore.");
    return [];
  }
  console.log(`Found ${querySnapshot.docs.length} public recipes.`);
  return querySnapshot.docs.map(docSnap => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: formatTimestamp(data.createdAt as Timestamp | string | undefined),
      updatedAt: formatTimestamp(data.updatedAt as Timestamp | string | undefined),
      ingredients: (data.ingredients || []).map((ing: Ingredient, idx: number) => ({...ing, id: ing.id || `ing-${docSnap.id}-${idx}`})),
      steps: (data.steps || []).map((step: RecipeStep, idx: number) => ({...step, id: step.id || `step-${docSnap.id}-${idx}`})),
      isPublic: data.isPublic ?? true,
    } as Recipe;
  });
};

export const getAllRecipesFromFirestore = async (): Promise<Recipe[]> => {
  console.log("Fetching all recipes from Firestore for admin...");
  const recipesCollectionRef = collection(db, 'recipes');
  const q = query(recipesCollectionRef, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    console.log("No recipes found in Firestore at all.");
    return [];
  }
  console.log(`Found ${querySnapshot.docs.length} total recipes for admin.`);
  return querySnapshot.docs.map(docSnap => {
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
  });
};

export const getRecipeByIdFromFirestore = async (recipeId: string): Promise<Recipe | null> => {
  console.log(`Fetching recipe by ID: ${recipeId} from Firestore...`);
  const recipeDocRef = doc(db, 'recipes', recipeId);
  const docSnap = await getDoc(recipeDocRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    console.log(`Found recipe ${recipeId}.`);
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
    console.log(`Recipe with ID: ${recipeId} not found in Firestore.`);
    return null;
  }
};

export const updateRecipeInFirestore = async (
  recipeId: string,
  updates: Partial<Omit<Recipe, 'id' | 'createdAt' | 'authorId' | 'authorName'>>
): Promise<void> => {
  console.log(`Updating recipe ${recipeId} in Firestore with:`, updates);
  const recipeDocRef = doc(db, 'recipes', recipeId);
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
  console.log(`Recipe ${recipeId} updated successfully.`);
};

export const deleteRecipeFromFirestore = async (recipeId: string): Promise<void> => {
  console.log(`Deleting recipe ${recipeId} from Firestore.`);
  const recipeDocRef = doc(db, 'recipes', recipeId);
  await deleteDoc(recipeDocRef);
  console.log(`Recipe ${recipeId} deleted successfully.`);
};


// --- User Profile Functions ---

export const addUserProfileToFirestore = async (
  userId: string,
  profileData: Pick<User, 'email' | 'name' | 'brandName' | 'phoneNumber' | 'address' | 'role' | 'photoURL'>
): Promise<void> => {
  const userDocRef = doc(db, 'users', userId);
  const dataToSet = {
    email: profileData.email || null,
    name: profileData.name || null,
    brandName: profileData.brandName || null,
    phoneNumber: profileData.phoneNumber || null,
    address: profileData.address || null,
    role: profileData.role,
    photoURL: profileData.photoURL || null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    lastDonationAmount: null,
    lastDonationDate: null,
    lastPromptedDate: null,
  };
  await setDoc(userDocRef, dataToSet, { merge: true });
};

export const getUserProfileFromFirestore = async (userId: string): Promise<Partial<User> | null> => {
  console.log(`Fetching user profile for ID: ${userId} from Firestore...`);
  const userDocRef = doc(db, 'users', userId);
  const docSnap = await getDoc(userDocRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    console.log(`Found user profile ${userId}.`);
    return {
      id: userId,
      email: data.email,
      name: data.name,
      brandName: data.brandName,
      phoneNumber: data.phoneNumber,
      address: data.address,
      role: data.role,
      photoURL: data.photoURL,
      lastDonationAmount: data.lastDonationAmount,
      lastDonationDate: data.lastDonationDate ? formatTimestamp(data.lastDonationDate) : null,
      lastPromptedDate: data.lastPromptedDate ? formatTimestamp(data.lastPromptedDate) : null,
    } as Partial<User>;
  } else {
    console.log(`User profile with ID: ${userId} not found in Firestore.`);
    return null;
  }
};

export const updateUserProfileFields = async (
  userId: string,
  data: Partial<Pick<User, 'name' | 'brandName' | 'phoneNumber' | 'address' | 'role' | 'lastDonationDate' | 'lastPromptedDate' | 'lastDonationAmount'>>
): Promise<void> => {
  console.log(`Updating user profile fields for ID: ${userId} in Firestore with:`, data);
  const userDocRef = doc(db, 'users', userId);
  // Filter out undefined values to avoid overwriting fields with undefined
  const updates = Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined));
  if (Object.keys(updates).length === 0) {
    console.log("No fields to update.");
    return;
  }
  // Use setDoc with merge:true to create the document if it doesn't exist, or update it if it does.
  // This prevents race conditions during sign-up.
  await setDoc(userDocRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  }, { merge: true });
  console.log(`User profile fields for ${userId} updated successfully.`);
};

export const getAllUsersFromFirestore = async (): Promise<User[]> => {
  try {
    console.log("Fetching all users from Firestore...");
    const usersCollectionRef = collection(db, 'users');
    console.log("Collection reference created");
    
    const querySnapshot = await getDocs(usersCollectionRef);
    console.log("Query snapshot received, size:", querySnapshot.size);
    
    if (querySnapshot.empty) {
      console.log("No users found in Firestore collection 'users'");
      return [];
    }
    
    console.log(`Found ${querySnapshot.docs.length} user documents`);
    
    const users = querySnapshot.docs.map(docSnap => {
      const data = docSnap.data();
      console.log("User document data:", { id: docSnap.id, ...data });
      
      return {
        id: docSnap.id,
        email: data.email || null,
        name: data.name || null,
        brandName: data.brandName || null,
        phoneNumber: data.phoneNumber || null,
        address: data.address || null,
        role: data.role || UserRole.USER,
        photoURL: data.photoURL || null,
        lastDonationAmount: data.lastDonationAmount || null,
        lastDonationDate: data.lastDonationDate ? formatTimestamp(data.lastDonationDate) : null,
        lastPromptedDate: data.lastPromptedDate ? formatTimestamp(data.lastPromptedDate) : null,
      } as User;
    });
    
    console.log("Processed users:", users);
    return users;
  } catch (error) {
    console.error("Error in getAllUsersFromFirestore:", error);
    throw error;
  }
};


// --- Invoice Functions (Placeholders for now) ---

export const addInvoiceToFirestore = async (
  invoiceData: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>,
  authorId: string
): Promise<Invoice> => {
  console.log("Attempting to add invoice to Firestore for author:", authorId, invoiceData);
  const invoiceCollectionRef = collection(db, 'invoices');
  const newInvoiceData = {
    ...invoiceData,
    authorId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const docRef = await addDoc(invoiceCollectionRef, newInvoiceData);
  console.log("Invoice added successfully with ID:", docRef.id);
  return {
    ...invoiceData,
    id: docRef.id,
    authorId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export const getUserInvoicesFromFirestore = async (userId: string): Promise<Invoice[]> => {
  console.log(`Fetching invoices for user ID: ${userId} from Firestore...`);
  const invoicesCollectionRef = collection(db, 'invoices');
  const q = query(invoicesCollectionRef, where('authorId', '==', userId), orderBy('invoiceDate', 'desc'));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    console.log(`No invoices found in Firestore for user ID: ${userId}.`);
    return [];
  }
  console.log(`Found ${querySnapshot.docs.length} invoices for user ${userId}.`);
  return querySnapshot.docs.map(docSnap => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      invoiceDate: formatTimestamp(data.invoiceDate as Timestamp | string | undefined),
      dueDate: data.dueDate ? formatTimestamp(data.dueDate as Timestamp | string | undefined) : null,
      createdAt: formatTimestamp(data.createdAt as Timestamp | string | undefined),
      updatedAt: formatTimestamp(data.updatedAt as Timestamp | string | undefined),
    } as Invoice;
  });
};
