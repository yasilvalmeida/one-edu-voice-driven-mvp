'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/auth-context';
import { useToast } from '@/components/toast';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signIn, signUp } = useUser();
  const { showToast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = isLogin
        ? await signIn(email, password)
        : await signUp(email, password);

      if (result.error) {
        setError(result.error);
        showToast({
          type: 'error',
          title: isLogin ? 'Sign In Failed' : 'Sign Up Failed',
          message: result.error,
          duration: 6000,
        });
      } else {
        if (isLogin) {
          // Show success toast and redirect for existing users
          showToast({
            type: 'success',
            title: 'Welcome Back!',
            message: 'Successfully signed in to your account.',
            duration: 3000,
          });
          router.push('/role');
        } else {
          // Show success toast for new signup
          showToast({
            type: 'success',
            title: 'Account Created Successfully!',
            message:
              'Please check your email to confirm your account before signing in.',
            duration: 8000,
          });
          // Switch to login mode
          setIsLogin(true);
          setPassword('');
          setError('');
        }
      }
    } catch (err) {
      const errorMessage = 'An unexpected error occurred';
      setError(errorMessage);
      showToast({
        type: 'error',
        title: 'System Error',
        message: errorMessage,
        duration: 6000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div className='text-center'>
          <h1 className='text-4xl font-bold text-primary-600 mb-2'>ONE EDU</h1>
          <h2 className='text-2xl font-semibold text-gray-900'>
            {isLogin ? 'Welcome back!' : 'Join us today!'}
          </h2>
          <p className='mt-2 text-gray-600'>
            {isLogin
              ? 'Sign in to continue your learning journey'
              : 'Start your educational adventure'}
          </p>
        </div>

        <div className='card'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-gray-700'
              >
                Email address
              </label>
              <input
                id='email'
                type='email'
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='input-field mt-1'
                placeholder='Enter your email'
              />
            </div>

            <div>
              <label
                htmlFor='password'
                className='block text-sm font-medium text-gray-700'
              >
                Password
              </label>
              <input
                id='password'
                type='password'
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='input-field mt-1'
                placeholder='Enter your password'
                minLength={6}
              />
            </div>

            {error && (
              <div className='text-red-600 text-sm bg-red-50 p-3 rounded-lg'>
                {error}
              </div>
            )}

            <button
              type='submit'
              disabled={loading}
              className='w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          <div className='mt-6 text-center'>
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className='text-primary-600 hover:text-primary-500 font-medium'
            >
              {isLogin
                ? 'Don\'t have an account? Sign up'
                : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>

        <div className='text-center text-sm text-gray-500'>
          <p>Safe and secure learning environment for children</p>
        </div>
      </div>
    </div>
  );
}
