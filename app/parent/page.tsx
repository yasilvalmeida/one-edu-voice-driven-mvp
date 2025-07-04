'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/auth-context';
import Header from '@/components/layout/header';

export default function ParentPage() {
  const { user, profile, signOut } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/auth');
      return;
    }

    if (profile && profile.role !== 'parent') {
      router.push('/role');
    }
  }, [user, profile, router]);

  const handleLogout = async () => {
    await signOut();
    router.push('/auth');
  };

  if (!user || !profile || profile.role !== 'parent') {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50'>
      {/* Header */}
      <Header
        subtitle='Parent Dashboard'
        userInfo={{
          name: profile.name || 'Parent',
        }}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className='max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8'>
        <div className='text-center'>
          <div className='w-32 h-32 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-full flex items-center justify-center mx-auto mb-8'>
            <span className='text-6xl'>👨‍👩‍👧‍👦</span>
          </div>

          <h1 className='text-4xl font-bold text-gray-900 mb-4'>
            Parent Dashboard
          </h1>

          <p className='text-xl text-gray-600 mb-8 max-w-2xl mx-auto'>
            Your comprehensive hub for monitoring and supporting your
            child&apos;s educational journey.
          </p>

          <div className='card max-w-2xl mx-auto'>
            <h2 className='text-2xl font-semibold text-gray-900 mb-6'>
              🚧 Coming Soon
            </h2>

            <div className='space-y-4 text-left'>
              <div className='flex items-center space-x-3'>
                <div className='w-2 h-2 bg-secondary-500 rounded-full'></div>
                <span className='text-gray-700'>
                  Real-time progress tracking
                </span>
              </div>
              <div className='flex items-center space-x-3'>
                <div className='w-2 h-2 bg-secondary-500 rounded-full'></div>
                <span className='text-gray-700'>Learning goal management</span>
              </div>
              <div className='flex items-center space-x-3'>
                <div className='w-2 h-2 bg-secondary-500 rounded-full'></div>
                <span className='text-gray-700'>
                  Activity reports and insights
                </span>
              </div>
              <div className='flex items-center space-x-3'>
                <div className='w-2 h-2 bg-secondary-500 rounded-full'></div>
                <span className='text-gray-700'>
                  Parent-child interaction tools
                </span>
              </div>
              <div className='flex items-center space-x-3'>
                <div className='w-2 h-2 bg-secondary-500 rounded-full'></div>
                <span className='text-gray-700'>
                  Customizable learning preferences
                </span>
              </div>
            </div>

            <div className='mt-8 p-4 bg-secondary-50 rounded-lg'>
              <p className='text-secondary-700 text-sm'>
                🔧 We&apos;re working hard to bring you powerful parental tools.
                This dashboard will be your control center for supporting your
                child&apos;s learning journey.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
