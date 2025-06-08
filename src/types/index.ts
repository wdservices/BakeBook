
export type Ingredient = {
  id: string;
  name: string;
  quantity: string; // e.g., "2 cups", "100g", "1 tsp"
};

export type RecipeStep = {
  id: string;
  description: string;
  // Optional: imageUrl for visual aid in step
};

export type Recipe = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  prepTime: string; // e.g., "30 mins"
  cookTime: string; // e.g., "1 hour"
  servings: number;
  ingredients: Ingredient[];
  steps: RecipeStep[];
  authorId: string; // ID of the user who created it (Firebase UID)
  authorName?: string; // Display name of the author
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  isPublic?: boolean; // True if public, false/undefined if private
  // Optional: difficulty, tags, nutritionInfo
};

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export type User = {
  id: string; // Firebase UID
  email: string | null;
  name?: string | null; // Firebase displayName
  brandName?: string | null; 
  phoneNumber?: string | null;
  role: UserRole; 
  photoURL?: string | null; // Firebase photoURL (less relevant now, but can be kept for future)
};
