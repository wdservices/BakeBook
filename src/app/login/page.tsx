
'use client';

import AuthForm from '@/components/auth/AuthForm';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import Spinner from '@/components/ui/Spinner';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-[calc(100vh-200px)]"><Spinner size={48} /></div>}>
      <LoginPageContent />
    </Suspense>
  );
}

function LoginPageContent() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      const redirect = searchParams.get('redirect');
      router.push(redirect || '/dashboard');
    }
  }, [isAuthenticated, authLoading, router, searchParams]);

  if (authLoading || (!authLoading && isAuthenticated)) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Spinner size={48} />
      </div>
    );
  }
  
  return <AuthForm mode="login" />;
}
