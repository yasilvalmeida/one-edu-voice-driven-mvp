'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/auth-context';

export default function RolePage() {
  const [loading, setLoading] = useState(false);
  const { user, profile, updateProfile } = useUser();
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/auth');
      return;
    }

    // If user already has a role, redirect to appropriate page
    if (profile?.role) {
      if (profile.role === 'parent') {
        router.push('/parent');
      } else {
        router.push('/child/onboarding');
      }
    }
  }, [user, profile, router]);

  const handleRoleSelection = async (role: 'child' | 'parent') => {
    setLoading(true);

    try {
      const result = await updateProfile({ role });

      if (result?.error) {
        console.error('Error updating profile:', result.error);
        return;
      }

      // Redirect based on role
      if (role === 'parent') {
        router.push('/parent');
      } else {
        router.push('/child/onboarding');
      }
    } catch (error) {
      console.error('Error selecting role:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
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
    <div className='min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-4xl w-full'>
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold text-primary-600 mb-4'>
            Welcome to ONE EDU!
          </h1>
          <p className='text-xl text-gray-600'>
            Let&apos;s get started by selecting your role
          </p>
        </div>

        <div className='grid md:grid-cols-2 gap-8 max-w-3xl mx-auto'>
          {/* Child Option */}
          <div className='card hover:shadow-xl transition-shadow duration-300 flex flex-col h-full'>
            <div className='text-center flex flex-col h-full'>
              {/* Header Section - Fixed Height */}
              <div className='flex-shrink-0'>
                <div className='w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-6'>
                  <span className='text-4xl'>🧒</span>
                </div>
                <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                  I&apos;m a Child
                </h2>
                <div className='h-16 flex items-center justify-center mb-6'>
                  <p className='text-gray-600'>
                    Start your learning adventure with fun, interactive lessons
                    and voice-guided activities!
                  </p>
                </div>
              </div>

              {/* List Section - Flexible Height */}
              <div className='flex-grow flex flex-col'>
                <ul className='text-sm text-gray-500 mb-8 space-y-2 flex-grow'>
                  <li>• Interactive voice lessons</li>
                  <li>• Fun learning activities</li>
                  <li>• Progress tracking</li>
                  <li>• Safe environment</li>
                </ul>
              </div>

              {/* Button Section - Fixed at Bottom */}
              <div className='flex-shrink-0'>
                <button
                  onClick={() => handleRoleSelection('child')}
                  disabled={loading}
                  className='w-full btn-primary disabled:opacity-50'
                >
                  {loading ? 'Setting up...' : 'Start Learning!'}
                </button>
              </div>
            </div>
          </div>

          {/* Parent Option */}
          <div className='card hover:shadow-xl transition-shadow duration-300 flex flex-col h-full'>
            <div className='text-center flex flex-col h-full'>
              {/* Header Section - Fixed Height */}
              <div className='flex-shrink-0'>
                <div className='w-24 h-24 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-full flex items-center justify-center mx-auto mb-6'>
                  <span className='text-4xl'>👨‍👩‍👧‍👦</span>
                </div>
                <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                  I&apos;m a Parent
                </h2>
                <div className='h-16 flex items-center justify-center mb-6'>
                  <p className='text-gray-600'>
                    Monitor your child&apos;s progress and help guide their
                    educational journey.
                  </p>
                </div>
              </div>

              {/* List Section - Flexible Height */}
              <div className='flex-grow flex flex-col'>
                <ul className='text-sm text-gray-500 mb-8 space-y-2 flex-grow'>
                  <li>• Monitor child&apos;s progress</li>
                  <li>• Set learning goals</li>
                  <li>• Receive updates</li>
                  <li>• Parent dashboard</li>
                </ul>
              </div>

              {/* Button Section - Fixed at Bottom */}
              <div className='flex-shrink-0'>
                <button
                  onClick={() => handleRoleSelection('parent')}
                  disabled={loading}
                  className='w-full btn-secondary disabled:opacity-50'
                >
                  {loading ? 'Setting up...' : 'Access Dashboard'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className='text-center mt-8'>
          <p className='text-sm text-gray-500'>
            You can change your role later in settings
          </p>
        </div>
      </div>
    </div>
  );
}
