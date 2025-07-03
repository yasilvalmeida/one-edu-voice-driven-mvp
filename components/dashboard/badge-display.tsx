'use client';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

interface BadgeDisplayProps {
  badges: Badge[];
}

export default function BadgeDisplay({ badges }: BadgeDisplayProps) {
  const unlockedBadges = badges.filter((badge) => badge.unlocked);
  const lockedBadges = badges.filter((badge) => !badge.unlocked);

  return (
    <div className='bg-white rounded-xl p-6 shadow-lg border border-gray-100'>
      <div className='flex items-center justify-between mb-6'>
        <h3 className='text-lg font-semibold text-gray-900'>Achievements</h3>
        <div className='text-sm text-gray-500'>
          {unlockedBadges.length} / {badges.length} earned
        </div>
      </div>

      {/* Unlocked Badges */}
      {unlockedBadges.length > 0 && (
        <div className='mb-6'>
          <h4 className='text-sm font-medium text-gray-700 mb-3'>
            Earned Badges
          </h4>
          <div className='grid grid-cols-2 sm:grid-cols-3 gap-4'>
            {unlockedBadges.map((badge) => (
              <div
                key={badge.id}
                className='group relative bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-200 rounded-lg p-4 text-center hover:shadow-lg transition-all duration-300 hover:scale-105'
              >
                {/* Badge Icon */}
                <div
                  className='w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center text-2xl shadow-lg'
                  style={{ backgroundColor: badge.color }}
                >
                  <span>{badge.icon}</span>
                </div>

                {/* Badge Name */}
                <h5 className='text-sm font-semibold text-gray-900 mb-1'>
                  {badge.name}
                </h5>

                {/* Badge Description */}
                <p className='text-xs text-gray-600 line-clamp-2'>
                  {badge.description}
                </p>

                {/* Unlock Date */}
                {badge.unlockedAt && (
                  <p className='text-xs text-yellow-600 mt-2'>
                    Earned {new Date(badge.unlockedAt).toLocaleDateString()}
                  </p>
                )}

                {/* Shine Effect */}
                <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg'></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Locked Badges Preview */}
      {lockedBadges.length > 0 && (
        <div>
          <h4 className='text-sm font-medium text-gray-700 mb-3'>
            Coming Next
          </h4>
          <div className='grid grid-cols-2 sm:grid-cols-3 gap-4'>
            {lockedBadges.slice(0, 3).map((badge) => (
              <div
                key={badge.id}
                className='relative bg-gray-50 border-2 border-gray-200 rounded-lg p-4 text-center opacity-60'
              >
                {/* Locked Badge Icon */}
                <div className='w-12 h-12 mx-auto mb-2 bg-gray-300 rounded-full flex items-center justify-center text-2xl'>
                  <span className='grayscale'>🔒</span>
                </div>

                {/* Badge Name */}
                <h5 className='text-sm font-semibold text-gray-600 mb-1'>
                  ???
                </h5>

                {/* Badge Description */}
                <p className='text-xs text-gray-500'>
                  Keep learning to unlock!
                </p>
              </div>
            ))}
          </div>

          {lockedBadges.length > 3 && (
            <div className='text-center mt-4'>
              <p className='text-xs text-gray-500'>
                + {lockedBadges.length - 3} more badges to discover
              </p>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {badges.length === 0 && (
        <div className='text-center py-8'>
          <div className='w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center'>
            <span className='text-3xl text-gray-400'>🏆</span>
          </div>
          <p className='text-gray-500 text-sm'>
            Start learning to earn your first badge!
          </p>
        </div>
      )}

      {/* Progress Bar for Next Badge */}
      {unlockedBadges.length > 0 && lockedBadges.length > 0 && (
        <div className='mt-6 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg'>
          <div className='flex items-center justify-between mb-2'>
            <span className='text-sm font-medium text-gray-700'>
              Next Badge Progress
            </span>
            <span className='text-xs text-gray-500'>75%</span>
          </div>
          <div className='w-full bg-gray-200 rounded-full h-2'>
            <div
              className='h-full bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full transition-all duration-1000'
              style={{ width: '75%' }}
            ></div>
          </div>
          <p className='text-xs text-gray-600 mt-2'>
            Almost there! Keep chatting with Astra to unlock your next
            achievement.
          </p>
        </div>
      )}
    </div>
  );
}
