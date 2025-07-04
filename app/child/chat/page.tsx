'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/auth-context';
import { useToast } from '@/components/toast';
import Header from '@/components/layout/header';
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
      router.replace('/auth');
    } catch (error) {
      console.error('Error logging out:', error);
      showToast({
        type: 'error',
        title: 'Logout Error',
        message: 'Failed to log out. Please try again.',
        duration: 4000,
      });
      router.replace('/auth');
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
      <Header
        subtitle='Chat with Astra'
        showBackButton={true}
        userInfo={{
          name: profile.name || 'there',
        }}
        actionButtons={[
          {
            label: 'Dashboard',
            icon: '📊',
            onClick: () => router.push('/child/dashboard'),
            variant: 'secondary',
            hideTextOnMobile: true,
          },
        ]}
        onLogout={handleLogout}
      />

      {/* Chat Interface */}
      <main className='h-[calc(100vh-4rem)] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <ChatInterface childName={profile.name || undefined} />
      </main>
    </div>
  );
}
