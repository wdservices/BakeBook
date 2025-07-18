
'use client';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import Spinner from '../ui/Spinner';
import { LogIn, UserPlus, MailQuestion, Eye, EyeOff } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
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
import { useState } from 'react';


const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  brandName: z.string().optional(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(), // New address field
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignUpFormValues = z.infer<typeof signupSchema>;

interface AuthFormProps {
  mode: 'login' | 'signup';
}

const AuthForm = ({ mode }: AuthFormProps) => {
  const {
    loginWithEmailPassword,
    signupWithEmailPassword,
    sendPasswordReset,
    loading
  } = useAuth();
  const [resetEmail, setResetEmail] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const currentSchema = mode === 'login' ? loginSchema : signupSchema;
  type CurrentFormValues = typeof mode extends 'login' ? LoginFormValues : SignUpFormValues;

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CurrentFormValues>({
    resolver: zodResolver(currentSchema),
    defaultValues: mode === 'signup' ? {
      name: '',
      email: '',
      brandName: '',
      phoneNumber: '',
      address: '', // Default for address
      password: '',
      confirmPassword: '',
    } : {
      email: '',
      password: '',
    }
  });

  const onSubmit: SubmitHandler<CurrentFormValues> = async (data) => {
    if (mode === 'login') {
      await loginWithEmailPassword(data as LoginFormValues);
    } else {
      await signupWithEmailPassword(data as SignUpFormValues);
    }
  };

  const handlePasswordReset = async () => {
    if (!resetEmail) return;
    setIsResetting(true);
    await sendPasswordReset(resetEmail);
    setIsResetting(false);
  };

  return (
    <div className="flex justify-center items-center py-12">
      <Card className="w-full max-w-md shadow-xl animate-scale-in">
        <CardHeader>
          <CardTitle className="text-3xl text-center text-primary">
            {mode === 'login' ? 'Welcome Back!' : 'Create Your Bakebook Account'}
          </CardTitle>
          <CardDescription className="text-center">
            {mode === 'login' ? 'Sign in to continue your baking journey.' : 'Join our community of bakers!'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {mode === 'signup' && (
              <>
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" type="text" {...register('name')} placeholder="John Doe" />
                  {errors.name && <p className="text-sm text-destructive">{(errors.name as any).message}</p>}
                </div>
                <div>
                  <Label htmlFor="brandName">Brand Name (Optional)</Label>
                  <Input id="brandName" type="text" {...register('brandName')} placeholder="John's Bakery"/>
                  {errors.brandName && <p className="text-sm text-destructive">{(errors.brandName as any).message}</p>}
                </div>
                 <div>
                  <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
                  <Input id="phoneNumber" type="tel" {...register('phoneNumber')} placeholder="e.g. (555) 123-4567"/>
                  {errors.phoneNumber && <p className="text-sm text-destructive">{(errors.phoneNumber as any).message}</p>}
                </div>
                <div>
                  <Label htmlFor="address">Address (Optional - for Invoices)</Label>
                  <Textarea id="address" {...register('address')} placeholder="123 Main St, Anytown, USA" rows={3} />
                  {errors.address && <p className="text-sm text-destructive">{(errors.address as any).message}</p>}
                </div>
              </>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register('email')} placeholder="you@example.com" />
              {errors.email && <p className="text-sm text-destructive">{(errors.email as any).message}</p>}
            </div>
            <div>
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                {mode === 'login' && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                       <Button type="button" variant="link" className="text-xs p-0 h-auto">Forgot Password?</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2"><MailQuestion/> Reset Your Password</AlertDialogTitle>
                        <AlertDialogDescription>
                          Enter the email address associated with your account, and we'll send you a link to reset your password.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <div className="py-2">
                        <Label htmlFor="reset-email" className="sr-only">Email</Label>
                        <Input
                          id="reset-email"
                          type="email"
                          placeholder="you@example.com"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                        />
                      </div>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handlePasswordReset} disabled={isResetting || !resetEmail}>
                           {isResetting ? <Spinner size={20} className="mr-2"/> : null}
                          Send Reset Link
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  placeholder="••••••••"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute inset-y-0 right-0 h-full w-10 text-muted-foreground hover:bg-transparent"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </Button>
              </div>
              {errors.password && <p className="text-sm text-destructive">{(errors.password as any).message}</p>}
            </div>
            {mode === 'signup' && (
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                 <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      {...register('confirmPassword')}
                      placeholder="••••••••"
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute inset-y-0 right-0 h-full w-10 text-muted-foreground hover:bg-transparent"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </Button>
                </div>
                {errors.confirmPassword && <p className="text-sm text-destructive">{(errors.confirmPassword as any).message}</p>}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={isSubmitting || loading}>
              {isSubmitting || loading ? <Spinner size={20} className="mr-2" /> : (mode === 'login' ? <LogIn className="mr-2 h-5 w-5" /> : <UserPlus className="mr-2 h-5 w-5" />)}
              {isSubmitting || loading ? 'Processing...' : (mode === 'login' ? 'Login' : 'Sign Up')}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2 pt-4">
          <p className="text-xs text-muted-foreground text-center px-4">
            By {mode === 'login' ? 'signing in' : 'signing up'}, you agree to Bakebook&apos;s terms (demo only).
          </p>
          {mode === 'login' ? (
             <p className="text-sm text-muted-foreground">
                Need an account?
                <Link href="/signup" className="ml-1 text-primary hover:underline">
                    Sign Up
                </Link>
             </p>
          ) : (
             <p className="text-sm text-muted-foreground">
                Already have an account?
                <Link href="/login" className="ml-1 text-primary hover:underline">
                    Login
                </Link>
             </p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthForm;
