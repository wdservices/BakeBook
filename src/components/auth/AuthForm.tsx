
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { Chrome } from 'lucide-react'; // Using Chrome icon for Google

interface AuthFormProps {
  mode: 'login' | 'signup'; // This prop might become less relevant
}

const AuthForm = ({ mode }: AuthFormProps) => {
  const { loginWithGoogle, loading } = useAuth();

  return (
    <div className="flex justify-center items-center py-12">
      <Card className="w-full max-w-md shadow-xl animate-scale-in">
        <CardHeader>
          <CardTitle className="text-3xl text-center text-primary">
            {mode === 'login' ? 'Welcome to Bakebook!' : 'Join Bakebook'}
          </CardTitle>
          <CardDescription className="text-center">
            Sign in or create an account with Google to continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button 
            onClick={loginWithGoogle} 
            className="w-full" 
            disabled={loading}
            variant="outline"
            size="lg"
          >
            <Chrome className="mr-2 h-5 w-5" /> 
            {loading ? 'Processing...' : `Sign ${mode === 'login' ? 'in' : 'up'} with Google`}
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
          <p className="text-xs text-muted-foreground text-center px-4">
            By signing in, you agree to Bakebook&apos;s terms of service (not really, this is a demo).
          </p>
          {mode === 'login' && (
             <p className="text-sm text-muted-foreground">
                Need an account? 
                <Link href="/signup" className="ml-1 text-primary hover:underline">
                    Sign Up
                </Link>
             </p>
          )}
          {mode === 'signup' && (
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
