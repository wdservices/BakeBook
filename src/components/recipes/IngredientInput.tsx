
'use client';

import type { UseFieldArrayReturn, Control } from 'react-hook-form';
import { useFieldArray } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Trash2, PlusCircle } from 'lucide-react';
import type { Recipe } from '@/types'; // Assuming RecipeFormValues is similar to Recipe

interface RecipeFormValues extends Omit<Recipe, 'id' | 'createdAt' | 'updatedAt' | 'authorId' | 'ingredients' | 'steps'> {
  ingredients: { name: string; quantity: string }[];
  steps: { description: string }[];
}


interface IngredientInputProps {
  control: Control<RecipeFormValues>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any; // UseFieldArrayRegister is complex, simplify for now
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: any;
}

const IngredientInput = ({ control, register, errors }: IngredientInputProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingredients",
  });

  return (
    <div className="space-y-4 p-4 border border-border rounded-md bg-card/50">
      <Label className="text-lg font-medium text-primary">Ingredients</Label>
      {fields.map((item, index) => (
        <div key={item.id} className="flex flex-col sm:flex-row sm:items-end gap-3 p-3 border border-muted rounded-md animate-fade-in">
          <div className="flex-grow w-full sm:w-auto space-y-1">
            <Label htmlFor={`ingredients.${index}.name`}>Name</Label>
            <Input
              id={`ingredients.${index}.name`}
              placeholder="e.g., Flour, Sugar"
              {...register(`ingredients.${index}.name`)}
              className={errors.ingredients?.[index]?.name ? 'border-destructive' : ''}
            />
            {errors.ingredients?.[index]?.name && (
              <p className="text-sm text-destructive">{errors.ingredients[index].name.message}</p>
            )}
          </div>
          <div className="flex-grow w-full sm:w-auto space-y-1">
            <Label htmlFor={`ingredients.${index}.quantity`}>Quantity</Label>
            <Input
              id={`ingredients.${index}.quantity`}
              placeholder="e.g., 2 cups, 100g"
              {...register(`ingredients.${index}.quantity`)}
              className={errors.ingredients?.[index]?.quantity ? 'border-destructive' : ''}
            />
            {errors.ingredients?.[index]?.quantity && (
              <p className="text-sm text-destructive">{errors.ingredients[index].quantity.message}</p>
            )}
          </div>
          <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)} aria-label="Remove ingredient" className="w-full sm:w-auto mt-2 sm:mt-0">
            <Trash2 size={18} />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={() => append({ name: '', quantity: '' })}
        className="w-full border-dashed border-primary text-primary hover:bg-primary/10"
      >
        <PlusCircle size={18} className="mr-2" /> Add Ingredient
      </Button>
    </div>
  );
};

export default IngredientInput;

