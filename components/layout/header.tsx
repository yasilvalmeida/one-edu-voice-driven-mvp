import { useRouter } from 'next/navigation';

interface ActionButton {
  label: string;
  icon?: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  hideTextOnMobile?: boolean;
}

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  userInfo?: {
    name?: string;
    level?: number;
    xp?: number;
  };
  actionButtons?: ActionButton[];
  onLogout?: () => void;
}

export default function Header({
  title = 'ONE EDU',
  subtitle,
  showBackButton = false,
  userInfo,
  actionButtons = [],
  onLogout,
}: HeaderProps) {
  const router = useRouter();

  const getButtonClasses = (variant: ActionButton['variant'] = 'primary') => {
    switch (variant) {
      case 'primary':
        return 'text-sm bg-primary-100 text-primary-700 px-3 py-1 rounded-full hover:bg-primary-200 transition-colors';
      case 'secondary':
        return 'text-sm bg-secondary-100 text-secondary-700 px-3 py-1 rounded-full hover:bg-secondary-200 transition-colors';
      case 'danger':
        return 'text-sm bg-red-100 text-red-700 px-3 py-1 rounded-full hover:bg-red-200 transition-colors';
      default:
        return 'text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-200 transition-colors';
    }
  };

  return (
    <header className='bg-white shadow-sm border-b'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Left side */}
          <div className='flex items-center space-x-4'>
            {showBackButton && (
              <button
                onClick={() => router.back()}
                className='text-gray-500 hover:text-gray-700'
                title='Go back'
              >
                <svg
                  className='w-6 h-6'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M10 19l-7-7m0 0l7-7m-7 7h18'
                  />
                </svg>
              </button>
            )}
            <h1 className='md:text-2xl text-lg font-bold text-primary-600'>
              {title}
            </h1>
            {subtitle && (
              <span className='text-gray-500 hidden md:block'>{subtitle}</span>
            )}
          </div>

          {/* Right side */}
          <div className='flex items-center space-x-4'>
            {/* User info */}
            {userInfo && (
              <div className='flex items-center space-x-4'>
                {userInfo.level && userInfo.xp && (
                  <span className='text-gray-700 text-sm hidden md:block'>
                    Level {userInfo.level} • {userInfo.xp.toLocaleString()} XP
                  </span>
                )}
                {userInfo.name && (
                  <span className='text-gray-700 text-sm'>
                    Hi, {userInfo.name}! 👋
                  </span>
                )}
              </div>
            )}

            {/* Action buttons */}
            {actionButtons.map((button, index) => (
              <button
                key={index}
                onClick={button.onClick}
                className={getButtonClasses(button.variant)}
                title={button.label}
              >
                {button.icon && <span>{button.icon}</span>}
                {button.hideTextOnMobile ? (
                  <span className='hidden md:inline'>{button.label}</span>
                ) : (
                  <span>{button.label}</span>
                )}
              </button>
            ))}

            {/* Logout button */}
            {onLogout && (
              <button
                onClick={onLogout}
                className='text-sm bg-red-100 text-red-700 px-3 py-1 rounded-full hover:bg-red-200 transition-colors cursor-pointer'
                title='Logout'
                type='button'
              >
                👋<span className='hidden md:inline ml-1'>Logout</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
