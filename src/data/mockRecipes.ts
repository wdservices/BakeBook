import type { Recipe } from '@/types';

export const mockRecipes: Recipe[] = [
  {
    id: '1',
    title: 'Classic Chocolate Cake',
    description: 'A rich and moist chocolate cake, perfect for any occasion.',
    imageUrl: 'https://placehold.co/600x400.png?text=Chocolate+Cake',
    prepTime: '30 mins',
    cookTime: '45 mins',
    servings: 8,
    ingredients: [
      { id: 'i1-1', name: 'All-purpose flour', quantity: '1 1/2 cups' },
      { id: 'i1-2', name: 'Granulated sugar', quantity: '1 cup' },
      { id: 'i1-3', name: 'Unsweetened cocoa powder', quantity: '1/2 cup' },
      { id: 'i1-4', name: 'Baking soda', quantity: '1 tsp' },
      { id: 'i1-5', name: 'Salt', quantity: '1/2 tsp' },
      { id: 'i1-6', name: 'Egg', quantity: '1 large' },
      { id: 'i1-7', name: 'Buttermilk', quantity: '1/2 cup' },
      { id: 'i1-8', name: 'Vegetable oil', quantity: '1/4 cup' },
      { id: 'i1-9', name: 'Vanilla extract', quantity: '1 tsp' },
      { id: 'i1-10', name: 'Hot water or coffee', quantity: '1/2 cup' },
    ],
    steps: [
      { id: 's1-1', description: 'Preheat oven to 350°F (175°C). Grease and flour a 9-inch round cake pan.' },
      { id: 's1-2', description: 'In a large bowl, whisk together flour, sugar, cocoa powder, baking soda, and salt.' },
      { id: 's1-3', description: 'Add egg, buttermilk, oil, and vanilla extract. Beat on medium speed for 2 minutes.' },
      { id: 's1-4', description: 'Stir in hot water or coffee (batter will be thin). Pour batter into prepared pan.' },
      { id: 's1-5', description: 'Bake for 30-35 minutes, or until a wooden skewer inserted into the center comes out clean.' },
      { id: 's1-6', description: 'Let cool in pan for 10 minutes before inverting onto a wire rack to cool completely.' },
    ],
    authorId: 'user1',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
  },
  {
    id: '2',
    title: 'Lemon Herb Roasted Chicken',
    description: 'A flavorful and juicy roasted chicken with lemon and herbs.',
    imageUrl: 'https://placehold.co/600x400.png?text=Roasted+Chicken',
    prepTime: '20 mins',
    cookTime: '1 hr 15 mins',
    servings: 4,
    ingredients: [
      { id: 'i2-1', name: 'Whole chicken', quantity: '1 (3-4 lbs)' },
      { id: 'i2-2', name: 'Lemon', quantity: '1, halved' },
      { id: 'i2-3', name: 'Fresh rosemary', quantity: '2 sprigs' },
      { id: 'i2-4', name: 'Fresh thyme', quantity: '3 sprigs' },
      { id: 'i2-5', name: 'Garlic cloves', quantity: '4, smashed' },
      { id: 'i2-6', name: 'Olive oil', quantity: '2 tbsp' },
      { id: 'i2-7', name: 'Salt', quantity: '1 tsp' },
      { id: 'i2-8', name: 'Black pepper', quantity: '1/2 tsp' },
    ],
    steps: [
      { id: 's2-1', description: 'Preheat oven to 425°F (220°C).' },
      { id: 's2-2', description: 'Rinse chicken and pat dry. Season generously with salt and pepper inside and out.' },
      { id: 's2-3', description: 'Stuff chicken cavity with lemon halves, rosemary, thyme, and garlic.' },
      { id: 's2-4', description: 'Drizzle with olive oil. Truss the chicken if desired.' },
      { id: 's2-5', description: 'Place chicken in a roasting pan and roast for 1 hour and 15 minutes, or until juices run clear and internal temperature reaches 165°F (74°C).' },
      { id: 's2-6', description: 'Let rest for 10-15 minutes before carving.' },
    ],
    authorId: 'admin1',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(), // 10 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(), // 10 days ago
  },
  {
    id: '3',
    title: 'Simple Pasta Primavera',
    description: 'A light and fresh pasta dish packed with spring vegetables.',
    imageUrl: 'https://placehold.co/600x400.png?text=Pasta+Primavera',
    prepTime: '15 mins',
    cookTime: '20 mins',
    servings: 4,
    ingredients: [
        { id: 'i3-1', name: 'Pasta (e.g., penne, fusilli)', quantity: '12 oz' },
        { id: 'i3-2', name: 'Asparagus', quantity: '1 bunch, trimmed and cut' },
        { id: 'i3-3', name: 'Peas (fresh or frozen)', quantity: '1 cup' },
        { id: 'i3-4', name: 'Cherry tomatoes', quantity: '1 pint, halved' },
        { id: 'i3-5', name: 'Garlic', quantity: '2 cloves, minced' },
        { id: 'i3-6', name: 'Olive oil', quantity: '3 tbsp' },
        { id: 'i3-7', name: 'Parmesan cheese', quantity: '1/2 cup, grated' },
        { id: 'i3-8', name: 'Fresh basil', quantity: '1/4 cup, chopped' },
        { id: 'i3-9', name: 'Salt and pepper', quantity: 'to taste' },
    ],
    steps: [
        { id: 's3-1', description: 'Cook pasta according to package directions. Reserve 1 cup of pasta water before draining.' },
        { id: 's3-2', description: 'While pasta cooks, heat olive oil in a large skillet over medium heat. Add garlic and cook until fragrant (about 1 minute).' },
        { id: 's3-3', description: 'Add asparagus and peas to the skillet. Cook for 3-5 minutes until tender-crisp.' },
        { id: 's3-4', description: 'Add cherry tomatoes and cook for another 2-3 minutes until they begin to soften.' },
        { id: 's3-5', description: 'Add drained pasta to the skillet with the vegetables. Toss to combine.' },
        { id: 's3-6', description: 'Stir in Parmesan cheese and basil. Add reserved pasta water, a little at a time, if needed to create a light sauce.' },
        { id: 's3-7', description: 'Season with salt and pepper to taste. Serve immediately.' },
    ],
    authorId: 'user1',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
  },
];

export const getRecipeById = (id: string): Recipe | undefined => {
  return mockRecipes.find(recipe => recipe.id === id);
};

export const addRecipe = (recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>): Recipe => {
  const newRecipe: Recipe = {
    ...recipe,
    id: (mockRecipes.length + 1).toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockRecipes.push(newRecipe);
  return newRecipe;
};

export const updateRecipe = (id: string, updates: Partial<Omit<Recipe, 'id' | 'createdAt' | 'authorId'>>): Recipe | undefined => {
  const recipeIndex = mockRecipes.findIndex(recipe => recipe.id === id);
  if (recipeIndex === -1) return undefined;

  mockRecipes[recipeIndex] = {
    ...mockRecipes[recipeIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  return mockRecipes[recipeIndex];
};

export const deleteRecipe = (id: string): boolean => {
  const recipeIndex = mockRecipes.findIndex(recipe => recipe.id === id);
  if (recipeIndex === -1) return false;
  mockRecipes.splice(recipeIndex, 1);
  return true;
};
