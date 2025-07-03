'use client';

interface SkillCardProps {
  name: string;
  level: number;
  maxLevel: number;
  icon: string;
  color: 'primary' | 'secondary' | 'accent';
  description: string;
}

export default function SkillCard({
  name,
  level,
  maxLevel,
  icon,
  color,
  description,
}: SkillCardProps) {
  const progressPercentage = (level / maxLevel) * 100;

  const colorClasses = {
    primary: {
      bg: 'from-primary-400 to-primary-600',
      ring: 'ring-primary-200',
      text: 'text-primary-600',
      progress: 'from-primary-400 to-primary-500',
    },
    secondary: {
      bg: 'from-secondary-400 to-secondary-600',
      ring: 'ring-secondary-200',
      text: 'text-secondary-600',
      progress: 'from-secondary-400 to-secondary-500',
    },
    accent: {
      bg: 'from-accent-400 to-accent-600',
      ring: 'ring-accent-200',
      text: 'text-accent-600',
      progress: 'from-accent-400 to-accent-500',
    },
  };

  const colors = colorClasses[color];

  return (
    <div className='bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300'>
      {/* Skill Header */}
      <div className='flex items-center mb-4'>
        <div
          className={`w-12 h-12 bg-gradient-to-br ${colors.bg} rounded-full flex items-center justify-center mr-4 ring-4 ${colors.ring}`}
        >
          <span className='text-2xl'>{icon}</span>
        </div>
        <div className='flex-1'>
          <h3 className='text-lg font-semibold text-gray-900'>{name}</h3>
          <p className='text-sm text-gray-600'>{description}</p>
        </div>
      </div>

      {/* Level Display */}
      <div className='flex items-center justify-between mb-3'>
        <span className={`text-sm font-medium ${colors.text}`}>
          Level {level}
        </span>
        <span className='text-xs text-gray-500'>
          {level}/{maxLevel}
        </span>
      </div>

      {/* Progress Bar */}
      <div className='relative'>
        <div className='w-full bg-gray-200 rounded-full h-3 overflow-hidden'>
          <div
            className={`h-full bg-gradient-to-r ${colors.progress} rounded-full transition-all duration-1000 ease-out`}
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Level Dots */}
      <div className='flex justify-between mt-3'>
        {Array.from({ length: maxLevel }, (_, index) => {
          const levelNumber = index + 1;
          const isActive = levelNumber <= level;
          const isCurrent = levelNumber === level + 1;

          return (
            <div
              key={levelNumber}
              className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                isActive
                  ? `bg-gradient-to-br ${colors.bg} border-transparent`
                  : isCurrent
                  ? `border-gray-400 bg-white animate-pulse`
                  : 'border-gray-300 bg-gray-100'
              }`}
              title={`Level ${levelNumber}`}
            />
          );
        })}
      </div>

      {/* Next Level Info */}
      {level < maxLevel && (
        <div className='mt-4 p-2 bg-gray-50 rounded-lg'>
          <p className='text-xs text-gray-600 text-center'>
            {level === 0
              ? `Start working on ${name.toLowerCase()} to reach Level 1!`
              : `Keep practicing to reach Level ${level + 1}!`}
          </p>
        </div>
      )}

      {/* Mastered Badge */}
      {level === maxLevel && (
        <div className='mt-4 p-2 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200'>
          <div className='flex items-center justify-center space-x-2'>
            <span className='text-yellow-600'>🏆</span>
            <span className='text-xs font-medium text-yellow-800'>
              Mastered!
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
