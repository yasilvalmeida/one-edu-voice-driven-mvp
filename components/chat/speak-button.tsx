'use client';

import { useState, useEffect, useCallback } from 'react';
import { TextToSpeech, isSpeechSynthesisSupported } from '@/lib/voice';

interface SpeakButtonProps {
  text: string;
  onSpeakingChange?: (isSpeaking: boolean) => void;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function SpeakButton({
  text,
  onSpeakingChange,
  disabled = false,
  className = '',
  size = 'sm',
}: SpeakButtonProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [tts, setTts] = useState<TextToSpeech | null>(null);

  useEffect(() => {
    setIsSupported(isSpeechSynthesisSupported());

    if (isSpeechSynthesisSupported()) {
      const textToSpeech = new TextToSpeech();
      textToSpeech.setRate(0.95); // Slightly slower for children
      textToSpeech.setPitch(1.1); // Slightly higher pitch for friendly tone
      setTts(textToSpeech);
    }

    return () => {
      tts?.stop();
    };
  }, []);

  const toggleSpeak = useCallback(async () => {
    if (!tts || disabled) return;

    if (isSpeaking) {
      tts.stop();
      setIsSpeaking(false);
      onSpeakingChange?.(false);
    } else {
      setIsSpeaking(true);
      onSpeakingChange?.(true);
      try {
        await tts.speak(text);
      } catch (error) {
        console.error('TTS error:', error);
      } finally {
        setIsSpeaking(false);
        onSpeakingChange?.(false);
      }
    }
  }, [tts, text, isSpeaking, disabled, onSpeakingChange]);

  if (!isSupported) {
    return null;
  }

  const sizeClasses = {
    sm: 'w-6 h-6 p-1',
    md: 'w-8 h-8 p-1.5',
    lg: 'w-10 h-10 p-2',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <button
      type="button"
      onClick={toggleSpeak}
      disabled={disabled}
      className={`rounded-full flex items-center justify-center transition-all duration-200 ${
        isSpeaking
          ? 'bg-primary-100 text-primary-600'
          : 'bg-transparent hover:bg-gray-100 text-gray-400 hover:text-gray-600'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${sizeClasses[size]} ${className}`}
      title={isSpeaking ? 'Stop speaking' : 'Listen to this message'}
    >
      {isSpeaking ? (
        <svg
          className={`${iconSizes[size]} animate-pulse`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <rect x="6" y="6" width="4" height="12" rx="1" />
          <rect x="14" y="6" width="4" height="12" rx="1" />
        </svg>
      ) : (
        <svg
          className={iconSizes[size]}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
          />
        </svg>
      )}
    </button>
  );
}
