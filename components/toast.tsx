'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, 'id'>) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { ...toast, id };

    setToasts((prev) => [...prev, newToast]);

    // Auto dismiss after duration (default 5 seconds)
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, toast.duration || 5000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast Container */}
      <div className='fixed top-4 right-4 z-50 space-y-2'>
        {toasts.map((toast) => (
          <ToastMessage
            key={toast.id}
            toast={toast}
            onDismiss={() => dismissToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastMessage({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: () => void;
}) {
  const bgColor = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
    warning: 'bg-yellow-50 border-yellow-200',
  }[toast.type];

  const textColor = {
    success: 'text-green-800',
    error: 'text-red-800',
    info: 'text-blue-800',
    warning: 'text-yellow-800',
  }[toast.type];

  const icon = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️',
  }[toast.type];

  return (
    <div
      className={`${bgColor} border rounded-lg p-4 shadow-lg max-w-sm min-w-80 transform transition-all duration-300 ease-in-out`}
    >
      <div className='flex items-start'>
        <div className='flex-shrink-0'>
          <span className='text-lg'>{icon}</span>
        </div>
        <div className='ml-3 flex-grow'>
          <h3 className={`text-sm font-medium ${textColor}`}>{toast.title}</h3>
          <p className={`mt-1 text-sm ${textColor} opacity-90`}>
            {toast.message}
          </p>
        </div>
        <div className='ml-4 flex-shrink-0'>
          <button
            onClick={onDismiss}
            className={`inline-flex rounded-md text-sm ${textColor} hover:opacity-75 focus:outline-none`}
          >
            <span className='sr-only'>Dismiss</span>×
          </button>
        </div>
      </div>
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
