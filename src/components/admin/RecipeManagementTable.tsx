
'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Recipe } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit3, Trash2, Eye, EyeOff } from 'lucide-react';
import { buttonVariants } from '../ui/button';

interface RecipeManagementTableProps {
  recipes: Recipe[];
  onDeleteRecipe: (recipeId: string, recipeTitle: string) => void;
}

const RecipeManagementTable = ({ recipes, onDeleteRecipe }: RecipeManagementTableProps) => {

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl font-headline text-primary">Recipe Management</CardTitle>
        <CardDescription>View, edit, and delete all recipes on the platform.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recipes.map((recipe) => (
                <TableRow key={recipe.id}>
                  <TableCell>
                    <Image
                      src={recipe.imageUrl || `https://placehold.co/100x75.png`}
                      alt={recipe.title || 'Recipe Image'}
                      width={64}
                      height={48}
                      className="rounded-md object-cover"
                      data-ai-hint="baked goods recipe"
                    />
                  </TableCell>
                  <TableCell className="font-medium max-w-xs truncate">
                    <Link href={`/recipes/${recipe.id}`} className="hover:underline hover:text-primary">
                        {recipe.title || 'Untitled Recipe'}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{recipe.authorName || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant={recipe.isPublic ? 'default' : 'outline'}>
                      {recipe.isPublic ? <Eye size={14} className="mr-1" /> : <EyeOff size={14} className="mr-1" />}
                      {recipe.isPublic ? 'Public' : 'Private'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                        <Button asChild variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors" title="Edit Recipe">
                            <Link href={`/recipes/${recipe.id}/edit`}>
                                <Edit3 size={16} />
                            </Link>
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive-foreground focus:bg-destructive/20 transition-colors" title="Delete Recipe">
                                <Trash2 size={16} />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the recipe
                                    "{recipe.title || 'Untitled Recipe'}".
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => onDeleteRecipe(recipe.id, recipe.title || 'Untitled Recipe')}
                                    className={buttonVariants({ variant: "destructive" })}
                                >
                                    Yes, delete recipe
                                </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecipeManagementTable;
