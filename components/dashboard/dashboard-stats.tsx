'use client';

import { useRouter } from 'next/navigation';

interface DashboardStatsProps {
  totalXP: number;
  level: number;
  badgesEarned: number;
  totalBadges: number;
  streakDays: number;
  childName: string;
}

export default function DashboardStats({
  totalXP,
  level,
  badgesEarned,
  totalBadges,
  streakDays,
  childName,
}: DashboardStatsProps) {
  const router = useRouter();

  const stats = [
    {
      label: 'Total XP',
      value: totalXP.toLocaleString(),
      icon: '⭐',
      color: 'from-yellow-400 to-yellow-600',
    },
    {
      label: 'Current Level',
      value: level.toString(),
      icon: '📈',
      color: 'from-primary-400 to-primary-600',
    },
    {
      label: 'Badges Earned',
      value: `${badgesEarned}/${totalBadges}`,
      icon: '🏆',
      color: 'from-secondary-400 to-secondary-600',
    },
    {
      label: 'Learning Streak',
      value: `${streakDays} days`,
      icon: '🔥',
      color: 'from-orange-400 to-red-500',
    },
  ];

  const handleChatClick = () => {
    router.push('/child/chat');
  };

  const handleProgressClick = () => {
    // Scroll to top since we're already on the dashboard
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className='bg-white rounded-xl p-6 shadow-lg border border-gray-100'>
      {/* Header */}
      <div className='text-center mb-6'>
        <h2 className='text-2xl font-bold text-gray-900 mb-2'>
          Welcome back, {childName}! 🌟
        </h2>
        <p className='text-gray-600'>
          Here&apos;s how you&apos;re doing on your learning journey
        </p>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-2 gap-4 mb-6'>
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className='relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200'
          >
            {/* Background Icon */}
            <div className='absolute top-2 right-2 text-3xl opacity-20'>
              {stat.icon}
            </div>

            {/* Content */}
            <div className='relative z-10'>
              <div
                className={`inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r ${stat.color} text-white text-sm mb-2`}
              >
                {stat.icon}
              </div>
              <div className='text-xl font-bold text-gray-900 mb-1'>
                {stat.value}
              </div>
              <div className='text-sm text-gray-600'>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
        <button
          onClick={handleChatClick}
          className='flex items-center justify-center space-x-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-3 rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-md hover:shadow-lg'
        >
          <span className='text-lg'>💬</span>
          <span className='font-medium'>Chat with Astra</span>
        </button>

        <button
          onClick={handleProgressClick}
          className='flex items-center justify-center space-x-2 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white px-4 py-3 rounded-lg hover:from-secondary-600 hover:to-secondary-700 transition-all duration-200 shadow-md hover:shadow-lg'
        >
          <span className='text-lg'>📚</span>
          <span className='font-medium'>View Progress</span>
        </button>
      </div>

      {/* Achievement Highlight */}
      {badgesEarned > 0 && (
        <div className='mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg'>
          <div className='flex items-center space-x-3'>
            <div className='flex-shrink-0'>
              <div className='w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center'>
                <span className='text-white font-bold'>🏆</span>
              </div>
            </div>
            <div className='flex-1'>
              <h4 className='text-sm font-semibold text-yellow-800'>
                Great job earning {badgesEarned} badge
                {badgesEarned !== 1 ? 's' : ''}!
              </h4>
              <p className='text-xs text-yellow-700'>
                Keep learning to unlock {totalBadges - badgesEarned} more
                achievements.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Streak Motivation */}
      {streakDays > 0 && (
        <div className='mt-4 p-3 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg'>
          <div className='text-center'>
            <span className='text-2xl'>🔥</span>
            <p className='text-sm font-medium text-orange-800 mt-1'>
              {streakDays} day learning streak!
            </p>
            <p className='text-xs text-orange-700'>
              Come back tomorrow to keep it going!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
