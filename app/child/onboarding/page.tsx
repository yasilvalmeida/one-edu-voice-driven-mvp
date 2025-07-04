'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/auth-context';
import { useToast } from '@/components/toast';
import Header from '@/components/layout/header';

export default function ChildOnboardingPage() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [interests, setInterests] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const { user, profile, updateProfile, signOut } = useUser();
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    if (!user) {
      router.push('/auth');
      return;
    }

    if (profile && profile.role !== 'child') {
      router.push('/role');
      return;
    }

    // If child already has complete profile, redirect to dashboard
    if (profile && profile.role === 'child' && profile.name && profile.age) {
      router.push('/child/dashboard');
      return;
    }

    // Pre-fill form if profile data exists
    if (profile) {
      setName(profile.name || '');
      setAge(profile.age?.toString() || '');
      setInterests(profile.interests || '');
    }
  }, [user, profile, router]);

  const handleLogout = async () => {
    try {
      await signOut();
      showToast({
        type: 'success',
        title: 'Logged out',
        message: 'You have been logged out successfully.',
        duration: 3000,
      });
      // Use replace instead of push to prevent back navigation
      router.replace('/auth');
    } catch (error) {
      console.error('Error logging out:', error);
      showToast({
        type: 'error',
        title: 'Logout Error',
        message: 'Failed to log out. Please try again.',
        duration: 4000,
      });
      // Even if there's an error, redirect to auth page
      router.replace('/auth');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await updateProfile({
        name,
        age: age ? parseInt(age) : undefined,
        interests,
        role: 'child',
      });

      if (result?.error) {
        console.error('Error updating profile:', result.error);
        return;
      }

      // Show completion message with navigation options
      setStep(4);
    } catch (error) {
      console.error('Error saving profile:', error);
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

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className='text-center'>
            <div className='w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-6'>
              <span className='text-4xl'>👋</span>
            </div>
            <h2 className='text-3xl font-bold text-gray-900 mb-4'>
              Hi there! Welcome to ONE EDU!
            </h2>
            <p className='text-lg text-gray-600 mb-8'>
              Let&apos;s get to know you better so we can make learning super
              fun!
            </p>
            <button onClick={() => setStep(2)} className='btn-primary'>
              Let&apos;s Get Started! 🚀
            </button>
          </div>
        );

      case 2:
        return (
          <div>
            <div className='text-center mb-8'>
              <div className='w-20 h-20 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center mx-auto mb-4'>
                <span className='text-3xl'>🎯</span>
              </div>
              <h2 className='text-2xl font-bold text-gray-900 mb-2'>
                What&apos;s your name?
              </h2>
              <p className='text-gray-600'>
                We&apos;d love to know what to call you!
              </p>
            </div>

            <div className='max-w-md mx-auto'>
              <input
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='input-field text-center text-lg'
                placeholder='Type your name here...'
                autoFocus
              />

              <div className='flex justify-between mt-8'>
                <button
                  onClick={() => setStep(1)}
                  className='px-6 py-2 text-gray-600 hover:text-gray-800'
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!name.trim()}
                  className='btn-primary disabled:opacity-50'
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <form onSubmit={handleSubmit}>
            <div className='text-center mb-8'>
              <div className='w-20 h-20 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-full flex items-center justify-center mx-auto mb-4'>
                <span className='text-3xl'>✨</span>
              </div>
              <h2 className='text-2xl font-bold text-gray-900 mb-2'>
                Tell us more about you, {name}!
              </h2>
              <p className='text-gray-600'>
                This helps us create the perfect learning experience for you
              </p>
            </div>

            <div className='max-w-md mx-auto space-y-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  How old are you?
                </label>
                <select
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className='input-field'
                  aria-label='Select your age'
                  required
                >
                  <option value=''>Select your age</option>
                  {Array.from({ length: 12 }, (_, i) => i + 5).map(
                    (ageOption) => (
                      <option key={ageOption} value={ageOption}>
                        {ageOption} years old
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  What do you love to learn about?
                </label>
                <textarea
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                  className='input-field h-24 resize-none'
                  placeholder="Tell us about your favorite subjects, hobbies, or things you're curious about..."
                  rows={3}
                />
                <p className='text-xs text-gray-500 mt-1'>
                  For example: animals, space, drawing, music, science...
                </p>
              </div>

              <div className='flex justify-between pt-4'>
                <button
                  type='button'
                  onClick={() => setStep(2)}
                  className='px-6 py-2 text-gray-600 hover:text-gray-800'
                >
                  ← Back
                </button>
                <button
                  type='submit'
                  disabled={!age || loading}
                  className='btn-primary disabled:opacity-50'
                >
                  {loading ? 'Saving...' : 'All Done! 🎉'}
                </button>
              </div>
            </div>
          </form>
        );

      case 4:
        return (
          <div className='text-center'>
            <div className='w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-6'>
              <span className='text-4xl'>🎉</span>
            </div>
            <h2 className='text-3xl font-bold text-gray-900 mb-4'>
              Awesome, {name}!
            </h2>
            <p className='text-lg text-gray-600 mb-8'>
              Your profile is all set up! We&apos;re excited to start this
              learning adventure with you.
            </p>

            <div className='card max-w-md mx-auto mb-8'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                Your Profile
              </h3>
              <div className='space-y-2 text-left'>
                <p>
                  <strong>Name:</strong> {name}
                </p>
                <p>
                  <strong>Age:</strong> {age} years old
                </p>
                {interests && (
                  <p>
                    <strong>Interests:</strong> {interests}
                  </p>
                )}
              </div>
            </div>

            <div className='space-y-4'>
              <p className='text-gray-600 mb-6'>
                Ready to start your learning journey? Choose what you&apos;d
                like to do first:
              </p>
              <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                <button
                  onClick={() => router.push('/child/chat')}
                  className='bg-primary-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors flex items-center justify-center space-x-2'
                >
                  <span>💬</span>
                  <span>Chat with Astra</span>
                </button>
                <button
                  onClick={() => router.push('/child/dashboard')}
                  className='bg-secondary-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-secondary-600 transition-colors flex items-center justify-center space-x-2'
                >
                  <span>📊</span>
                  <span>View Dashboard</span>
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-primary-50 to-accent-50'>
      {/* Header with Logout */}
      <Header
        subtitle='Profile Setup'
        userInfo={{
          name: name || 'there',
        }}
        onLogout={handleLogout}
      />

      <div className='py-12 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-2xl mx-auto'>
          {/* Progress Bar */}
          {step <= 3 && (
            <div className='mb-12'>
              <div className='flex justify-center mb-4'>
                <div className='text-sm text-gray-500'>Step {step} of 3</div>
              </div>
              <div className='w-full bg-gray-200 rounded-full h-2'>
                <div
                  className='bg-primary-500 h-2 rounded-full transition-all duration-300'
                  style={{ width: `${(step / 3) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          <div className='card'>{renderStep()}</div>

          {/* Footer */}
          <div className='text-center mt-8'>
            <p className='text-sm text-gray-500'>
              Safe, fun, and personalized learning for every child
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
