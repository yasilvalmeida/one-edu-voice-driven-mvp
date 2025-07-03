'use client';

import { useEffect, useState } from 'react';

interface XPProgressBarProps {
  currentXP: number;
  targetXP: number;
  level: number;
  animated?: boolean;
}

export default function XPProgressBar({
  currentXP,
  targetXP,
  level,
  animated = true,
}: XPProgressBarProps) {
  const [displayXP, setDisplayXP] = useState(0);
  const progressPercentage = Math.min((currentXP / targetXP) * 100, 100);

  // Animate XP counter on mount
  useEffect(() => {
    if (!animated) {
      setDisplayXP(currentXP);
      return;
    }

    let start = 0;
    const duration = 2000; // 2 seconds
    const startTime = Date.now();

    const animateCounter = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out animation
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setDisplayXP(Math.floor(currentXP * easeOut));

      if (progress < 1) {
        requestAnimationFrame(animateCounter);
      }
    };

    requestAnimationFrame(animateCounter);
  }, [currentXP, animated]);

  return (
    <div className='bg-white rounded-xl p-6 shadow-lg border border-gray-100'>
      <div className='flex items-center justify-between mb-4'>
        <div>
          <h3 className='text-lg font-semibold text-gray-900'>
            Experience Points
          </h3>
          <p className='text-sm text-gray-600'>Level {level}</p>
        </div>
        <div className='text-right'>
          <div className='text-2xl font-bold text-primary-600'>
            {displayXP.toLocaleString()}
          </div>
          <div className='text-sm text-gray-500'>
            / {targetXP.toLocaleString()} XP
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className='relative'>
        <div className='w-full bg-gray-200 rounded-full h-4 overflow-hidden'>
          <div
            className='h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-1000 ease-out relative'
            style={{ width: `${progressPercentage}%` }}
          >
            {/* Shimmer effect */}
            <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse'></div>
          </div>
        </div>

        {/* Progress text */}
        <div className='flex justify-between text-xs text-gray-600 mt-2'>
          <span>0 XP</span>
          <span className='font-medium'>
            {Math.round(progressPercentage)}% complete
          </span>
          <span>{targetXP.toLocaleString()} XP</span>
        </div>
      </div>

      {/* Next level preview */}
      <div className='mt-4 p-3 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg'>
        <div className='flex items-center justify-between'>
          <span className='text-sm text-gray-700'>
            {targetXP - currentXP > 0
              ? `${(targetXP - currentXP).toLocaleString()} XP to Level ${
                  level + 1
                }`
              : `Ready for Level ${level + 1}! 🎉`}
          </span>
          {targetXP - currentXP <= 0 && <span className='text-lg'>⭐</span>}
        </div>
      </div>
    </div>
  );
}
