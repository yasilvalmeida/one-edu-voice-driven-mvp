'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/auth-context';

export default function HomePage() {
  const { user, profile, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push('/auth');
      return;
    }

    // If user is authenticated, redirect based on their profile
    if (profile?.role === 'parent') {
      router.push('/parent');
    } else if (profile?.role === 'child') {
      router.push('/child/onboarding');
    } else {
      // No role set, go to role selection
      router.push('/role');
    }
  }, [user, profile, loading, router]);

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='text-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto'></div>
        <p className='mt-4 text-gray-600'>Loading...</p>
      </div>
    </div>
  );
}
