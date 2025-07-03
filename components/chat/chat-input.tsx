'use client';

import { useState } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function ChatInput({
  onSendMessage,
  disabled = false,
  placeholder = 'Type your message to Astra...',
}: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className='border-t border-gray-200 p-4 bg-white'>
      <form onSubmit={handleSubmit} className='flex space-x-3'>
        <div className='flex-1'>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className='w-full px-4 py-3 border border-gray-300 rounded-full resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed'
            style={{
              minHeight: '48px',
              maxHeight: '120px',
              overflowY: message.length > 50 ? 'auto' : 'hidden',
            }}
          />
        </div>

        <button
          type='submit'
          disabled={!message.trim() || disabled}
          className='flex-shrink-0 w-12 h-12 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center transition-colors duration-200'
        >
          {disabled ? (
            <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
          ) : (
            <svg
              className='w-5 h-5'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8'
              />
            </svg>
          )}
        </button>
      </form>

      <p className='text-xs text-gray-500 mt-2 text-center'>
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  );
}
