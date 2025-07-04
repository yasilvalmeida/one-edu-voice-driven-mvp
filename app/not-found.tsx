'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/auth-context';

export default function NotFound() {
  const { user, profile, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // Wait for auth state to load

    // Redirect based on authentication status
    if (!user) {
      // Not authenticated - redirect to auth page
      router.replace('/auth');
    } else if (!profile?.role) {
      // Authenticated but no role - redirect to role selection
      router.replace('/role');
    } else if (profile.role === 'parent') {
      // Parent - redirect to parent dashboard
      router.replace('/parent');
    } else if (profile.role === 'child') {
      // Child - check if profile is complete
      if (profile.name && profile.age) {
        // Complete profile - redirect to dashboard
        router.replace('/child/dashboard');
      } else {
        // Incomplete profile - redirect to onboarding
        router.replace('/child/onboarding');
      }
    }
  }, [user, profile, loading, router]);

  // Show loading while redirecting
  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50'>
      <div className='text-center'>
        <div className='w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-6'>
          <span className='text-3xl'>🚀</span>
        </div>
        <h1 className='text-2xl font-bold text-gray-900 mb-4'>
          Redirecting you...
        </h1>
        <p className='text-gray-600 mb-8'>
          Taking you to the right place in just a moment!
        </p>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto'></div>
      </div>
    </div>
  );
}
