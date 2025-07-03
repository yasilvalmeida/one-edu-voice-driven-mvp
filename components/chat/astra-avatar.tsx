'use client';

interface AstraAvatarProps {
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  isTyping?: boolean;
}

export default function AstraAvatar({
  size = 'md',
  showName = false,
  isTyping = false,
}: AstraAvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-2xl',
  };

  return (
    <div className='flex items-center space-x-3'>
      <div
        className={`${sizeClasses[size]} bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center shadow-lg`}
      >
        <span className='text-white font-bold'>✨</span>
      </div>

      {showName && (
        <div>
          <h3 className='font-semibold text-gray-900'>Astra</h3>
          <p className='text-sm text-gray-500'>
            {isTyping ? 'Typing...' : 'Your AI Mentor'}
          </p>
        </div>
      )}
    </div>
  );
}
