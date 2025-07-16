
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
  {
    id: '4',
    title: 'Chewy Chocolate Chip Cookies',
    description: 'The ultimate chewy chocolate chip cookies with golden edges and a soft, gooey center.',
    imageUrl: 'https://placehold.co/600x400.png?text=Chocolate+Chip+Cookies',
    prepTime: '20 mins',
    cookTime: '12 mins',
    ingredients: [
      { id: 'i4-1', name: 'All-purpose flour', quantity: '2 1/4 cups' },
      { id: 'i4-2', name: 'Baking soda', quantity: '1 tsp' },
      { id: 'i4-3', name: 'Salt', quantity: '1 tsp' },
      { id: 'i4-4', name: 'Unsalted butter, melted', quantity: '1 cup (2 sticks)' },
      { id: 'i4-5', name: 'Brown sugar, packed', quantity: '1 cup' },
      { id: 'i4-6', name: 'Granulated sugar', quantity: '1/2 cup' },
      { id: 'i4-7', name: 'Vanilla extract', quantity: '2 tsp' },
      { id: 'i4-8', name: 'Large eggs', quantity: '2' },
      { id: 'i4-9', name: 'Semi-sweet chocolate chips', quantity: '2 cups' },
    ],
    steps: [
      { id: 's4-1', description: 'Preheat oven to 375°F (190°C). Line baking sheets with parchment paper.' },
      { id: 's4-2', description: 'In a medium bowl, whisk together the flour, baking soda, and salt.' },
      { id: 's4-3', description: 'In a large bowl, whisk together the melted butter, brown sugar, and granulated sugar until well combined.' },
      { id: 's4-4', description: 'Whisk in the vanilla and eggs one at a time, beating well after each addition.' },
      { id: 's4-5', description: 'Gradually add the dry ingredients to the wet ingredients and mix until just combined. Stir in the chocolate chips.' },
      { id: 's4-6', description: 'Drop rounded tablespoons of dough onto the prepared baking sheets, about 2 inches apart.' },
      { id: 's4-7', description: 'Bake for 10-12 minutes, or until the edges are golden brown and the centers are still soft.' },
      { id: 's4-8', description: 'Let cool on the baking sheets for a few minutes before transferring to wire racks to cool completely.' },
    ],
    authorId: 'user1',
    authorName: 'Regular User',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    isPublic: true,
  },
  {
    id: '5',
    title: 'Classic New York Cheesecake',
    description: 'A rich, dense, and creamy New York-style cheesecake with a classic graham cracker crust.',
    imageUrl: 'https://placehold.co/600x400.png?text=Cheesecake',
    prepTime: '30 mins',
    cookTime: '1 hr 30 mins',
    ingredients: [
      { id: 'i5-1', name: 'Graham cracker crumbs', quantity: '1 1/2 cups' },
      { id: 'i5-2', name: 'Granulated sugar (for crust)', quantity: '2 tbsp' },
      { id: 'i5-3', name: 'Unsalted butter, melted', quantity: '6 tbsp' },
      { id: 'i5-4', name: 'Cream cheese, softened', quantity: '32 oz (4 blocks)' },
      { id: 'i5-5', name: 'Granulated sugar (for filling)', quantity: '1 cup' },
      { id: 'i5-6', name: 'Sour cream', quantity: '1 cup' },
      { id: 'i5-7', name: 'Vanilla extract', quantity: '1 tsp' },
      { id: 'i5-8', name: 'Lemon zest', quantity: '1 tsp' },
      { id: 'i5-9', name: 'Large eggs', quantity: '4' },
    ],
    steps: [
      { id: 's5-1', description: 'Preheat oven to 350°F (175°C). Wrap the outside of a 9-inch springform pan in heavy-duty aluminum foil.' },
      { id: 's5-2', description: 'For the crust, combine graham cracker crumbs, 2 tbsp sugar, and melted butter. Press firmly into the bottom and slightly up the sides of the prepared pan.' },
      { id: 's5-3', description: 'Bake crust for 10 minutes. Let cool on a wire rack.' },
      { id: 's5-4', description: 'For the filling, in a large bowl, beat the cream cheese and 1 cup sugar until smooth. Mix in sour cream, vanilla, and lemon zest.' },
      { id: 's5-5', description: 'Beat in eggs one at a time on low speed, just until combined. Do not overmix.' },
      { id: 's5-6', description: 'Pour filling over the cooled crust. Place the springform pan in a large roasting pan and fill the roasting pan with about 1 inch of hot water to create a water bath.' },
      { id: 's5-7', description: 'Bake for 60-70 minutes, or until the center is almost set (it should still have a slight jiggle).'},
      { id: 's5-8', description: 'Turn off the oven and let the cheesecake cool in the oven with the door slightly ajar for 1 hour. This prevents cracking.' },
      { id: 's5-9', description: 'Remove from the water bath and run a knife around the edge of the pan. Cool completely at room temperature, then refrigerate for at least 6 hours or overnight.' },
    ],
    authorId: 'admin1',
    authorName: 'Admin User',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    isPublic: true,
  },
  {
    id: '6',
    title: 'Easy No-Knead Focaccia',
    description: 'A fluffy, chewy focaccia bread with a crispy, golden crust, topped with rosemary and sea salt. Incredibly easy to make!',
    imageUrl: 'https://placehold.co/600x400.png?text=Focaccia',
    prepTime: '15 mins (plus overnight rise)',
    cookTime: '25 mins',
    ingredients: [
      { id: 'i6-1', name: 'All-purpose flour', quantity: '4 cups' },
      { id: 'i6-2', name: 'Instant yeast', quantity: '2 tsp' },
      { id: 'i6-3', name: 'Kosher salt', quantity: '2 tsp' },
      { id: 'i6-4', name: 'Lukewarm water', quantity: '2 cups' },
      { id: 'i6-5', name: 'Olive oil, divided', quantity: '4 tbsp' },
      { id: 'i6-6', name: 'Fresh rosemary, chopped', quantity: '2 tbsp' },
      { id: 'i6-7', name: 'Flaky sea salt', quantity: '1 tbsp' },
    ],
    steps: [
      { id: 's6-1', description: 'In a large bowl, whisk together flour, instant yeast, and kosher salt.' },
      { id: 's6-2', description: 'Pour in the lukewarm water and mix with a spatula until a sticky dough forms. No kneading required.' },
      { id: 's6-3', description: 'Drizzle 2 tbsp of olive oil over the dough. Cover the bowl and let it rise in the refrigerator for at least 12 hours, or up to 3 days.' },
      { id: 's6-4', description: 'Grease a 9x13 inch baking pan with 1 tbsp of olive oil. Gently transfer the dough to the pan, stretching it to fit.' },
      { id: 's6-5', description: 'Let the dough rise in a warm spot for 2-4 hours, until it becomes puffy and bubbly.' },
      { id: 's6-6', description: 'Preheat oven to 425°F (220°C). Drizzle the remaining 1 tbsp of olive oil over the dough.' },
      { id: 's6-7', description: 'Dimple the dough all over with your oiled fingertips. Sprinkle with fresh rosemary and flaky sea salt.' },
      { id: 's6-8', description: 'Bake for 20-25 minutes, until the top is golden brown and crispy.' },
      { id: 's6-9', description: 'Let cool for a few minutes before slicing and serving warm.' },
    ],
    authorId: 'user1',
    authorName: 'Regular User',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    isPublic: true,
  }
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
