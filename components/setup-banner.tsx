'use client';

import { useState } from 'react';

export default function SetupBanner() {
  const [dismissed, setDismissed] = useState(false);

  // Check if we're in development and missing environment variables
  const isDevelopment = process.env.NODE_ENV === 'development';
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const missingEnvVars =
    !supabaseUrl || supabaseUrl.includes('your-project-id');

  if (!isDevelopment || !missingEnvVars || dismissed) {
    return null;
  }

  return (
    <div className='bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4'>
      <div className='flex'>
        <div className='flex-shrink-0'>
          <span className='text-2xl'>⚠️</span>
        </div>
        <div className='ml-3 flex-grow'>
          <p className='text-sm text-yellow-800'>
            <strong>Development Setup Required:</strong> Environment variables
            are not configured.
          </p>
          <div className='mt-2 text-sm text-yellow-700'>
            <p>To get started:</p>
            <ol className='list-decimal list-inside mt-1 space-y-1'>
              <li>
                Create a{' '}
                <code className='bg-yellow-100 px-1 rounded'>.env.local</code>{' '}
                file in your project root
              </li>
              <li>
                Add your Supabase credentials:
                <div className='bg-yellow-100 p-2 rounded mt-1 font-mono text-xs'>
                  NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
                  <br />
                  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
                  <br />
                  OPENAI_API_KEY=your-openai-api-key-here
                </div>
              </li>
              <li>
                Get your credentials from{' '}
                <a
                  href='https://supabase.com/dashboard'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-yellow-800 underline'
                >
                  Supabase Dashboard
                </a>
              </li>
            </ol>
          </div>
        </div>
        <div className='flex-shrink-0'>
          <button
            onClick={() => setDismissed(true)}
            className='text-yellow-400 hover:text-yellow-600 text-xl'
            title='Dismiss'
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
