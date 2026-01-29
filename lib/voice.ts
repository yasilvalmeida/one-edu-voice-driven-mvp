'use client';

// Voice Service - Speech Recognition and Text-to-Speech
// Uses Web Speech API with OpenAI as fallback

export interface VoiceRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

export interface VoiceConfig {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
}

// Check if browser supports speech recognition
export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return !!(
    window.SpeechRecognition ||
    (window as any).webkitSpeechRecognition
  );
}

// Check if browser supports speech synthesis
export function isSpeechSynthesisSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'speechSynthesis' in window;
}

// Get SpeechRecognition constructor
function getSpeechRecognition() {
  if (typeof window === 'undefined') return null;
  return window.SpeechRecognition || (window as any).webkitSpeechRecognition;
}

// Create and configure speech recognition instance
export function createSpeechRecognition(
  config: VoiceConfig = {}
): SpeechRecognition | null {
  const SpeechRecognitionClass = getSpeechRecognition();
  if (!SpeechRecognitionClass) return null;

  const recognition = new SpeechRecognitionClass();
  recognition.lang = config.language || 'en-US';
  recognition.continuous = config.continuous ?? false;
  recognition.interimResults = config.interimResults ?? true;

  return recognition;
}

// Voice Recorder Class for managing speech-to-text
export class VoiceRecorder {
  private recognition: SpeechRecognition | null = null;
  private isListening = false;
  private onResult: ((result: VoiceRecognitionResult) => void) | null = null;
  private onError: ((error: Error) => void) | null = null;
  private onEnd: (() => void) | null = null;
  private onStart: (() => void) | null = null;

  constructor(config: VoiceConfig = {}) {
    if (isSpeechRecognitionSupported()) {
      this.recognition = createSpeechRecognition(config);
      this.setupListeners();
    }
  }

  private setupListeners() {
    if (!this.recognition) return;

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[event.results.length - 1];
      if (result && this.onResult) {
        this.onResult({
          transcript: result[0].transcript,
          confidence: result[0].confidence,
          isFinal: result.isFinal,
        });
      }
    };

    this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (this.onError) {
        this.onError(new Error(`Speech recognition error: ${event.error}`));
      }
      this.isListening = false;
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (this.onEnd) {
        this.onEnd();
      }
    };

    this.recognition.onstart = () => {
      this.isListening = true;
      if (this.onStart) {
        this.onStart();
      }
    };
  }

  setOnResult(callback: (result: VoiceRecognitionResult) => void) {
    this.onResult = callback;
  }

  setOnError(callback: (error: Error) => void) {
    this.onError = callback;
  }

  setOnEnd(callback: () => void) {
    this.onEnd = callback;
  }

  setOnStart(callback: () => void) {
    this.onStart = callback;
  }

  start(): boolean {
    if (!this.recognition || this.isListening) return false;

    try {
      this.recognition.start();
      return true;
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      return false;
    }
  }

  stop() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  abort() {
    if (this.recognition) {
      this.recognition.abort();
      this.isListening = false;
    }
  }

  getIsListening(): boolean {
    return this.isListening;
  }

  isSupported(): boolean {
    return this.recognition !== null;
  }
}

// Text-to-Speech Service
export class TextToSpeech {
  private synth: SpeechSynthesis | null = null;
  private voice: SpeechSynthesisVoice | null = null;
  private rate = 1.0;
  private pitch = 1.0;
  private volume = 1.0;

  constructor() {
    if (isSpeechSynthesisSupported()) {
      this.synth = window.speechSynthesis;
      this.loadVoice();
    }
  }

  private loadVoice() {
    if (!this.synth) return;

    const setVoice = () => {
      const voices = this.synth!.getVoices();
      // Prefer a friendly female voice for Astra
      this.voice =
        voices.find(
          (v) =>
            v.name.includes('Samantha') ||
            v.name.includes('Google US English') ||
            v.name.includes('Moira')
        ) ||
        voices.find((v) => v.lang.startsWith('en')) ||
        voices[0] ||
        null;
    };

    if (this.synth.getVoices().length > 0) {
      setVoice();
    } else {
      this.synth.onvoiceschanged = setVoice;
    }
  }

  setRate(rate: number) {
    this.rate = Math.max(0.1, Math.min(10, rate));
  }

  setPitch(pitch: number) {
    this.pitch = Math.max(0, Math.min(2, pitch));
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  speak(text: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synth) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      // Cancel any ongoing speech
      this.synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = this.voice;
      utterance.rate = this.rate;
      utterance.pitch = this.pitch;
      utterance.volume = this.volume;

      utterance.onend = () => resolve();
      utterance.onerror = (event) =>
        reject(new Error(`Speech synthesis error: ${event.error}`));

      this.synth.speak(utterance);
    });
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  pause() {
    if (this.synth) {
      this.synth.pause();
    }
  }

  resume() {
    if (this.synth) {
      this.synth.resume();
    }
  }

  isSpeaking(): boolean {
    return this.synth?.speaking ?? false;
  }

  isSupported(): boolean {
    return this.synth !== null;
  }

  getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.synth?.getVoices() ?? [];
  }
}

// Global instances for easy access
let voiceRecorderInstance: VoiceRecorder | null = null;
let textToSpeechInstance: TextToSpeech | null = null;

export function getVoiceRecorder(): VoiceRecorder {
  if (!voiceRecorderInstance) {
    voiceRecorderInstance = new VoiceRecorder();
  }
  return voiceRecorderInstance;
}

export function getTextToSpeech(): TextToSpeech {
  if (!textToSpeechInstance) {
    textToSpeechInstance = new TextToSpeech();
  }
  return textToSpeechInstance;
}
