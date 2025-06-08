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
  authorId: string; // ID of the user who created it
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  // Optional: difficulty, tags, nutritionInfo
};

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export type User = {
  id: string;
  email: string;
  name?: string;
  brandName?: string;
  role: UserRole;
  // Optional: avatarUrl, bio
};
