'use client';

import { ChatMessage } from '@/lib/openai';

interface MessageBubbleProps {
  message: ChatMessage;
  isFromAstra: boolean;
}

export default function MessageBubble({
  message,
  isFromAstra,
}: MessageBubbleProps) {
  return (
    <div
      className={`flex ${isFromAstra ? 'justify-start' : 'justify-end'} mb-4`}
    >
      <div
        className={`flex max-w-xs lg:max-w-md ${
          isFromAstra ? 'flex-row' : 'flex-row-reverse'
        }`}
      >
        {/* Avatar */}
        {isFromAstra && (
          <div className='flex-shrink-0 mr-3'>
            <div className='w-8 h-8 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center'>
              <span className='text-white text-sm font-bold'>A</span>
            </div>
          </div>
        )}

        {/* Message Content */}
        <div
          className={`px-4 py-2 rounded-2xl ${
            isFromAstra
              ? 'bg-white border border-gray-200 text-gray-800'
              : 'bg-primary-500 text-white'
          }`}
        >
          <p className='text-sm whitespace-pre-wrap break-words'>
            {message.content}
          </p>

          {/* Timestamp */}
          {message.timestamp && (
            <p
              className={`text-xs mt-1 ${
                isFromAstra ? 'text-gray-500' : 'text-primary-100'
              }`}
            >
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
