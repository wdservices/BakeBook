'use client';

import AuthForm from '@/components/auth/AuthForm';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Spinner from '@/components/ui/Spinner';
import { UserRole } from '@/types';

export default function LoginPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      if (user?.role === UserRole.ADMIN) {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, loading, router, user]);

  if (loading || (!loading && isAuthenticated)) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Spinner size={48} />
      </div>
    );
  }
  
  return <AuthForm mode="login" />;
}
