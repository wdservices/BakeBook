
'use client';

import type { UseFieldArrayReturn, Control } from 'react-hook-form';
import { useFieldArray } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Trash2, PlusCircle } from 'lucide-react';
import type { Recipe } from '@/types';

interface RecipeFormValues extends Omit<Recipe, 'id' | 'createdAt' | 'updatedAt' | 'authorId' | 'ingredients' | 'steps'> {
  ingredients: { name: string; quantity: string }[];
  steps: { description: string }[];
}

interface StepInputProps {
  control: Control<RecipeFormValues>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: any;
}

const StepInput = ({ control, register, errors }: StepInputProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "steps",
  });

  return (
    <div className="space-y-4 p-4 border border-border rounded-md bg-card/50">
      <Label className="text-lg font-medium text-primary">Steps</Label>
      {fields.map((item, index) => (
        <div key={item.id} className="flex flex-col sm:flex-row sm:items-start gap-3 p-3 border border-muted rounded-md animate-fade-in">
          <div className="flex-grow w-full space-y-1">
            <Label htmlFor={`steps.${index}.description`}>Step {index + 1}</Label>
            <Textarea
              id={`steps.${index}.description`}
              placeholder={`Describe step ${index + 1}`}
              {...register(`steps.${index}.description`)}
              className={errors.steps?.[index]?.description ? 'border-destructive' : ''}
              rows={3}
            />
            {errors.steps?.[index]?.description && (
              <p className="text-sm text-destructive">{errors.steps[index].description.message}</p>
            )}
          </div>
          <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)} aria-label="Remove step" className="w-full sm:w-auto mt-2 sm:mt-7">
            <Trash2 size={18} />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={() => append({ description: '' })}
        className="w-full border-dashed border-primary text-primary hover:bg-primary/10"
      >
        <PlusCircle size={18} className="mr-2" /> Add Step
      </Button>
    </div>
  );
};

export default StepInput;

