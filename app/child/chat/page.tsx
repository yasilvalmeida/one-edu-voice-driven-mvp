'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/auth-context';
import { useToast } from '@/components/toast';
import ChatInterface from '@/components/chat/chat-interface';

export default function ChildChatPage() {
  const { user, profile, loading, signOut } = useUser();
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push('/auth');
      return;
    }

    if (!profile) {
      router.push('/role');
      return;
    }

    if (profile.role !== 'child') {
      router.push('/role');
      return;
    }
  }, [user, profile, loading, router]);

  const handleLogout = async () => {
    try {
      await signOut();
      showToast({
        type: 'success',
        title: 'Logged out',
        message: 'You have been logged out successfully.',
        duration: 3000,
      });
      router.push('/auth');
    } catch (error) {
      console.error('Error logging out:', error);
      showToast({
        type: 'error',
        title: 'Logout Error',
        message: 'Failed to log out. Please try again.',
        duration: 4000,
      });
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile || profile.role !== 'child') {
    return null;
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50'>
      {/* Header */}
      <header className='bg-white shadow-sm border-b'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <div className='flex items-center space-x-4'>
              <button
                onClick={() => router.back()}
                className='text-gray-500 hover:text-gray-700'
                title='Go back'
              >
                <svg
                  className='w-6 h-6'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M10 19l-7-7m0 0l7-7m-7 7h18'
                  />
                </svg>
              </button>
              <h1 className='text-2xl font-bold text-primary-600'>ONE EDU</h1>
              <span className='text-gray-500'>Chat with Astra</span>
            </div>

            <div className='flex items-center space-x-4'>
              <span className='text-gray-700 text-sm'>
                Hi, {profile.name || 'there'}! 👋
              </span>
              <button
                onClick={() => router.push('/child/dashboard')}
                className='text-sm bg-secondary-100 text-secondary-700 px-3 py-1 rounded-full hover:bg-secondary-200 transition-colors'
              >
                📊 Dashboard
              </button>
              <button
                onClick={handleLogout}
                className='text-sm bg-red-100 text-red-700 px-3 py-1 rounded-full hover:bg-red-200 transition-colors'
                title='Logout'
              >
                👋 Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Interface */}
      <main className='h-[calc(100vh-4rem)] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <ChatInterface childName={profile.name || undefined} />
      </main>
    </div>
  );
}
