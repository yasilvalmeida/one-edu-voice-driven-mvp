'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  VoiceRecorder,
  isSpeechRecognitionSupported,
  VoiceRecognitionResult,
} from '@/lib/voice';

interface VoiceButtonProps {
  onTranscript: (transcript: string) => void;
  onListeningChange?: (isListening: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export default function VoiceButton({
  onTranscript,
  onListeningChange,
  disabled = false,
  className = '',
}: VoiceButtonProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [recorder, setRecorder] = useState<VoiceRecorder | null>(null);
  const [interimTranscript, setInterimTranscript] = useState('');

  useEffect(() => {
    setIsSupported(isSpeechRecognitionSupported());

    if (isSpeechRecognitionSupported()) {
      const voiceRecorder = new VoiceRecorder({
        continuous: false,
        interimResults: true,
        language: 'en-US',
      });

      voiceRecorder.setOnResult((result: VoiceRecognitionResult) => {
        if (result.isFinal) {
          onTranscript(result.transcript);
          setInterimTranscript('');
        } else {
          setInterimTranscript(result.transcript);
        }
      });

      voiceRecorder.setOnStart(() => {
        setIsListening(true);
        onListeningChange?.(true);
      });

      voiceRecorder.setOnEnd(() => {
        setIsListening(false);
        onListeningChange?.(false);
        setInterimTranscript('');
      });

      voiceRecorder.setOnError((error) => {
        console.error('Voice recognition error:', error);
        setIsListening(false);
        onListeningChange?.(false);
        setInterimTranscript('');
      });

      setRecorder(voiceRecorder);
    }

    return () => {
      recorder?.abort();
    };
  }, []);

  const toggleListening = useCallback(() => {
    if (!recorder || disabled) return;

    if (isListening) {
      recorder.stop();
    } else {
      recorder.start();
    }
  }, [recorder, isListening, disabled]);

  if (!isSupported) {
    return null;
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggleListening}
        disabled={disabled}
        className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
          isListening
            ? 'bg-red-500 hover:bg-red-600 animate-pulse'
            : 'bg-gray-200 hover:bg-gray-300'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        title={isListening ? 'Stop listening' : 'Start voice input'}
      >
        {isListening ? (
          <svg
            className="w-6 h-6 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <rect x="6" y="6" width="12" height="12" rx="2" />
          </svg>
        ) : (
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          </svg>
        )}
      </button>

      {isListening && interimTranscript && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-sm px-3 py-1 rounded-lg whitespace-nowrap max-w-[200px] truncate">
          {interimTranscript}
        </div>
      )}

      {isListening && (
        <div className="absolute -inset-1 bg-red-400 rounded-full animate-ping opacity-25" />
      )}
    </div>
  );
}
