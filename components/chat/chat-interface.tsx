'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '@/lib/openai';
import { useToast } from '@/components/toast';
import MessageBubble from './message-bubble';
import ChatInput from './chat-input';
import AstraAvatar from './astra-avatar';

interface ChatInterfaceProps {
  childName?: string;
}

export default function ChatInterface({ childName }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      role: 'assistant',
      content: `Hi${
        childName ? ` ${childName}` : ' there'
      }! 👋 I'm Astra, your AI mentor. I'm here to chat with you about anything you'd like to learn or talk about. What's on your mind today?`,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, [childName]);

  const sendMessage = async (content: string) => {
    if (isLoading) return;

    // Add user message
    const userMessage: ChatMessage = {
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setIsTyping(true);

    try {
      // Call chat API
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          childName,
        }),
      });

      const data = await response.json();

      if (data.fallback) {
        // Show toast for setup issues
        showToast({
          type: 'warning',
          title: 'Setup Required',
          message:
            'OpenAI API key needs to be configured for full chat functionality.',
          duration: 6000,
        });
      }

      // Add Astra's response
      const astraMessage: ChatMessage = {
        role: 'assistant',
        content: data.message,
        timestamp: new Date(data.timestamp || new Date()),
      };

      setMessages((prev) => [...prev, astraMessage]);
    } catch (error) {
      console.error('Error sending message:', error);

      // Add error message
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content:
          "I'm sorry, I'm having trouble connecting right now. Can you try again in a moment?",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);

      showToast({
        type: 'error',
        title: 'Connection Error',
        message: 'Failed to send message. Please try again.',
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    // Re-add welcome message
    const welcomeMessage: ChatMessage = {
      role: 'assistant',
      content: `Hi${
        childName ? ` ${childName}` : ' there'
      }! 👋 I'm Astra, your AI mentor. Ready for a fresh conversation? What would you like to talk about?`,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  };

  return (
    <div className='flex flex-col h-full bg-gradient-to-b from-primary-50 to-secondary-50'>
      {/* Chat Header */}
      <div className='flex-shrink-0 bg-white border-b border-gray-200 p-4'>
        <div className='flex items-center justify-between'>
          <AstraAvatar showName isTyping={isTyping} />

          <button
            onClick={clearChat}
            className='text-sm text-gray-500 hover:text-gray-700 px-3 py-1 rounded-md hover:bg-gray-100'
          >
            Clear Chat
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className='flex-1 overflow-y-auto p-4 space-y-4'>
        {messages.length === 0 ? (
          <div className='text-center text-gray-500 mt-8'>
            <AstraAvatar size='lg' />
            <p className='mt-4'>Start a conversation with Astra!</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <MessageBubble
              key={index}
              message={message}
              isFromAstra={message.role === 'assistant'}
            />
          ))
        )}

        {/* Typing indicator */}
        {isTyping && (
          <div className='flex justify-start mb-4'>
            <div className='flex max-w-xs lg:max-w-md'>
              <div className='flex-shrink-0 mr-3'>
                <AstraAvatar size='sm' />
              </div>
              <div className='px-4 py-2 bg-white border border-gray-200 rounded-2xl'>
                <div className='flex space-x-1'>
                  <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'></div>
                  <div
                    className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
                    style={{ animationDelay: '0.1s' }}
                  ></div>
                  <div
                    className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
                    style={{ animationDelay: '0.2s' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className='flex-shrink-0'>
        <ChatInput
          onSendMessage={sendMessage}
          disabled={isLoading}
          placeholder={`Chat with Astra${childName ? `, ${childName}` : ''}...`}
        />
      </div>
    </div>
  );
}
