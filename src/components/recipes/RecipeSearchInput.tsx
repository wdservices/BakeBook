'use client';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import type { ChangeEvent } from 'react';

interface RecipeSearchInputProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const RecipeSearchInput = ({ searchTerm, onSearchChange }: RecipeSearchInputProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
  };

  return (
    <div className="relative w-full max-w-lg mx-auto mb-8">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search recipes (e.g., cake, chicken, pasta...)"
        value={searchTerm}
        onChange={handleChange}
        className="pl-10 py-3 text-base rounded-lg shadow-sm"
      />
    </div>
  );
};

export default RecipeSearchInput;
