
import type { Recipe, Ingredient, RecipeStep } from '@/types';

export const mockRecipes: Recipe[] = [
  {
    id: '1',
    title: 'Classic Chocolate Cake',
    description: 'A rich and moist chocolate cake, perfect for any occasion.',
    imageUrl: 'https://placehold.co/600x400.png?text=Chocolate+Cake',
    prepTime: '30 mins',
    cookTime: '45 mins', // Bake time
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
    authorId: 'user1', // Example: Corresponds to a mock user ID
    authorName: 'Regular User',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    isPublic: true,
  },
  {
    id: '2',
    title: 'Artisan Sourdough Bread',
    description: 'A crusty artisan sourdough bread with a tangy flavor, perfect for sandwiches or toast.',
    imageUrl: 'https://placehold.co/600x400.png?text=Sourdough+Bread',
    prepTime: '30 mins (plus starter feeding & bulk fermentation)',
    cookTime: '45 mins', // Bake time
    ingredients: [
      { id: 'i2-1', name: 'Active sourdough starter', quantity: '100g' },
      { id: 'i2-2', name: 'Warm water (approx 80°F/27°C)', quantity: '350g' },
      { id: 'i2-3', name: 'Bread flour', quantity: '450g' },
      { id: 'i2-4', name: 'Whole wheat flour', quantity: '50g' },
      { id: 'i2-5', name: 'Salt', quantity: '10g' },
    ],
    steps: [
      { id: 's2-1', description: 'Mix active sourdough starter and warm water in a large bowl.' },
      { id: 's2-2', description: 'Add bread flour and whole wheat flour. Mix until a shaggy dough forms. Let rest (autolyse) for 30 minutes.' },
      { id: 's2-3', description: 'Add salt and mix thoroughly using stretch and fold method or stand mixer with dough hook for 5-7 minutes.' },
      { id: 's2-4', description: 'Bulk ferment for 4-6 hours at room temperature, performing 3-4 sets of stretch and folds in the first 2 hours.' },
      { id: 's2-5', description: 'Pre-shape the dough into a round and let rest for 20-30 minutes. Then, final shape the dough and place in a floured banneton or bowl.' },
      { id: 's2-6', description: 'Proof in the refrigerator for 12-18 hours (cold retard) or at room temperature for 2-3 hours.' },
      { id: 's2-7', description: 'Preheat oven with a Dutch oven inside to 475°F (245°C) for at least 45 minutes.' },
      { id: 's2-8', description: 'Carefully transfer dough to the hot Dutch oven, score the top, cover, and bake for 25 minutes.' },
      { id: 's2-9', description: 'Remove lid and bake for another 15-20 minutes, or until deeply golden brown and internal temperature reaches 205-210°F (96-99°C).' },
      { id: 's2-10', description: 'Let cool on a wire rack for at least 1 hour before slicing.' },
    ],
    authorId: 'admin1', // Example: Corresponds to a mock admin ID
    authorName: 'Admin User',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    isPublic: true,
  },
  {
    id: '3',
    title: 'Fluffy Blueberry Muffins',
    description: 'Deliciously moist and fluffy blueberry muffins, perfect for breakfast or a snack.',
    imageUrl: 'https://placehold.co/600x400.png?text=Blueberry+Muffins',
    prepTime: '20 mins',
    cookTime: '25 mins', // Bake time
    ingredients: [
        { id: 'i3-1', name: 'All-purpose flour', quantity: '2 cups' },
        { id: 'i3-2', name: 'Granulated sugar', quantity: '3/4 cup' },
        { id: 'i3-3', name: 'Baking powder', quantity: '2 tsp' },
        { id: 'i3-4', name: 'Salt', quantity: '1/2 tsp' },
        { id: 'i3-5', name: 'Egg', quantity: '1 large' },
        { id: 'i3-6', name: 'Milk', quantity: '3/4 cup' },
        { id: 'i3-7', name: 'Vegetable oil (or melted butter)', quantity: '1/3 cup' },
        { id: 'i3-8', name: 'Vanilla extract', quantity: '1 tsp' },
        { id: 'i3-9', name: 'Fresh or frozen blueberries', quantity: '1 1/2 cups' },
        { id: 'i3-10', name: 'Optional: Lemon zest', quantity: '1 tsp' },
    ],
    steps: [
        { id: 's3-1', description: 'Preheat oven to 400°F (200°C). Line a 12-cup muffin tin with paper liners or grease well.' },
        { id: 's3-2', description: 'In a large bowl, whisk together flour, sugar, baking powder, and salt.' },
        { id: 's3-3', description: 'In a separate bowl, whisk together egg, milk, oil (or melted butter), and vanilla extract. If using, add lemon zest.' },
        { id: 's3-4', description: 'Pour the wet ingredients into the dry ingredients and mix until just combined. Do not overmix; a few lumps are okay.' },
        { id: 's3-5', description: 'Gently fold in the blueberries. If using frozen blueberries, do not thaw.' },
        { id: 's3-6', description: 'Divide batter evenly among the prepared muffin cups, filling each about two-thirds full.' },
        { id: 's3-7', description: 'Optional: Sprinkle a little extra sugar on top of each muffin for a crunchy top.' },
        { id: 's3-8', description: 'Bake for 20-25 minutes, or until a toothpick inserted into the center of a muffin comes out clean.' },
        { id: 's3-9', description: 'Let muffins cool in the tin for a few minutes before transferring them to a wire rack to cool completely.' },
    ],
    authorId: 'user1',
    authorName: 'Regular User',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    isPublic: false, // This one is private by default
  },
];

export const getRecipeById = (id: string): Recipe | undefined => {
  return mockRecipes.find(recipe => recipe.id === id);
};

export const addRecipe = (recipeData: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>): Recipe => {
  const newRecipe: Recipe = {
    id: `recipe-${Date.now()}-${mockRecipes.length}`,
    title: recipeData.title,
    description: recipeData.description,
    imageUrl: recipeData.imageUrl || undefined,
    prepTime: recipeData.prepTime,
    cookTime: recipeData.cookTime,
    ingredients: recipeData.ingredients.map(ing => ({ ...ing, id: ing.id || `ing-${Date.now()}-${Math.random()}` })),
    steps: recipeData.steps.map(step => ({ ...step, id: step.id || `step-${Date.now()}-${Math.random()}` })),
    authorId: recipeData.authorId,
    authorName: recipeData.authorName || undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isPublic: recipeData.isPublic === undefined ? false : recipeData.isPublic,
  };
  mockRecipes.push(newRecipe);
  return newRecipe;
};

export const updateRecipe = (id: string, updates: Partial<Omit<Recipe, 'id' | 'createdAt' | 'authorId' | 'authorName'>>): Recipe | undefined => {
  const recipeIndex = mockRecipes.findIndex(recipe => recipe.id === id);
  if (recipeIndex === -1) return undefined;

  const existingRecipe = mockRecipes[recipeIndex];

  const updatedIngredients = updates.ingredients
    ? updates.ingredients.map(ing => ({ ...ing, id: ing.id || `ing-${Date.now()}-${Math.random()}` }))
    : existingRecipe.ingredients.map(ing => ({ ...ing }));

  const updatedSteps = updates.steps
    ? updates.steps.map(step => ({ ...step, id: step.id || `step-${Date.now()}-${Math.random()}` }))
    : existingRecipe.steps.map(step => ({ ...step }));

  const updatedRecipe: Recipe = {
    ...existingRecipe,
    title: updates.title !== undefined ? updates.title : existingRecipe.title,
    description: updates.description !== undefined ? updates.description : existingRecipe.description,
    imageUrl: updates.imageUrl !== undefined ? updates.imageUrl : existingRecipe.imageUrl,
    prepTime: updates.prepTime !== undefined ? updates.prepTime : existingRecipe.prepTime,
    cookTime: updates.cookTime !== undefined ? updates.cookTime : existingRecipe.cookTime,
    ingredients: updatedIngredients,
    steps: updatedSteps,
    isPublic: updates.isPublic === undefined ? existingRecipe.isPublic : updates.isPublic,
    updatedAt: new Date().toISOString(),
  };
  
  mockRecipes[recipeIndex] = updatedRecipe;
  return mockRecipes[recipeIndex];
};


export const deleteRecipe = (id: string): boolean => {
  const recipeIndex = mockRecipes.findIndex(recipe => recipe.id === id);
  if (recipeIndex === -1) return false;
  mockRecipes.splice(recipeIndex, 1);
  return true;
};
