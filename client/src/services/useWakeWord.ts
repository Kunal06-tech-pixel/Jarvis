import { useState, useEffect, useRef, useCallback } from 'react';
import { playWakeChime } from '@/lib/soundEffects';

export interface WakeWordOptions {
  wakeWords?: string[];
  onWakeWord: (commandAfterWakeWord?: string) => void;
  enabled?: boolean;
}

// Phonetic and phonetic misrecognition aliases for common voice recognition engines
const DEFAULT_WAKE_ALIASES = [
  'hey jarvis',
  'jarvis',
  'hi jarvis',
  'hello jarvis',
  'ok jarvis',
  'okay jarvis',
  'wake up jarvis',
  'wake up',
  'hey siri',
  'siri',
  // Common Whisper / WebSpeech phonetic homophones for "Jarvis"
  'hey service',
  'service',
  'hey travis',
  'travis',
  'javis',
  'hey javis',
  'jarves',
  'jar visual',
  'hey harvest',
];

export function useWakeWord({
  wakeWords = DEFAULT_WAKE_ALIASES,
  onWakeWord,
  enabled = true,
}: WakeWordOptions) {
  const [isListeningForWakeWord, setIsListeningForWakeWord] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [lastDetectedPhrase, setLastDetectedPhrase] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const shouldListenRef = useRef(enabled);
  const onWakeWordRef = useRef(onWakeWord);
  const wakeWordsRef = useRef(wakeWords);
  const restartTimeoutRef = useRef<any>(null);
  const isStartingRef = useRef(false);

  useEffect(() => {
    onWakeWordRef.current = onWakeWord;
  }, [onWakeWord]);

  useEffect(() => {
    // Merge user wakeWords with phonetic aliases
    const combined = Array.from(new Set([...wakeWords, ...DEFAULT_WAKE_ALIASES]));
    wakeWordsRef.current = combined;
  }, [wakeWords]);

  const stopListening = useCallback(() => {
    shouldListenRef.current = false;
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {
        // ignore
      }
      recognitionRef.current = null;
    }
    setIsListeningForWakeWord(false);
    isStartingRef.current = false;
  }, []);

  const startListening = useCallback(() => {
    const SpeechRecognitionClass =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setIsSupported(false);
      return;
    }

    shouldListenRef.current = true;

    // Clean up existing recognition instance
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {
        // ignore
      }
      recognitionRef.current = null;
    }

    if (isStartingRef.current) return;
    isStartingRef.current = true;

    try {
      // CRITICAL: Always construct a FRESH SpeechRecognition instance
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 3;

      recognition.onstart = () => {
        isStartingRef.current = false;
        setIsListeningForWakeWord(true);
      };

      recognition.onresult = (event: any) => {
        let fullTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          fullTranscript += ' ' + event.results[i][0].transcript;
        }

        const lower = fullTranscript.trim().toLowerCase();

        for (const wakeWord of wakeWordsRef.current) {
          const lowerWake = wakeWord.toLowerCase();
          const matchIndex = lower.indexOf(lowerWake);

          if (matchIndex !== -1) {
            // Wake word matched!
            setLastDetectedPhrase(wakeWord);
            playWakeChime();

            // Extract any command spoken right after the wake word
            const afterWakeWord = lower.substring(matchIndex + lowerWake.length).trim();
            const cleanedCommand = afterWakeWord.replace(/^[,\s.:;?!]+/, '').trim();

            onWakeWordRef.current(cleanedCommand.length > 0 ? cleanedCommand : undefined);

            // Abort current session to reset state and clear audio buffers
            try {
              recognition.abort();
            } catch (e) {}
            break;
          }
        }
      };

      recognition.onerror = (event: any) => {
        isStartingRef.current = false;
        if (event.error === 'not-allowed') {
          setIsListeningForWakeWord(false);
          shouldListenRef.current = false;
          console.warn('[Jarvis WakeWord] Microphone access not allowed.');
        } else if (event.error !== 'no-speech' && event.error !== 'aborted') {
          console.debug('[Jarvis WakeWord] SpeechRecognition error:', event.error);
        }
      };

      recognition.onend = () => {
        isStartingRef.current = false;
        setIsListeningForWakeWord(false);
        recognitionRef.current = null;

        // Auto-recreate instance on silence timeout or browser cycle
        if (shouldListenRef.current) {
          if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);
          restartTimeoutRef.current = setTimeout(() => {
            if (shouldListenRef.current) {
              startListening();
            }
          }, 200);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      isStartingRef.current = false;
      setIsListeningForWakeWord(false);
      console.warn('[Jarvis WakeWord] SpeechRecognition start failed:', err);

      if (shouldListenRef.current) {
        if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);
        restartTimeoutRef.current = setTimeout(() => {
          if (shouldListenRef.current) {
            startListening();
          }
        }, 500);
      }
    }
  }, []);

  useEffect(() => {
    shouldListenRef.current = enabled;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (recognitionRef.current) {
          try {
            recognitionRef.current.abort();
          } catch (e) {}
        }
        if (restartTimeoutRef.current) {
          clearTimeout(restartTimeoutRef.current);
          restartTimeoutRef.current = null;
        }
      } else {
        if (shouldListenRef.current && !recognitionRef.current && !isStartingRef.current) {
          startListening();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    if (enabled) {
      startListening();
    } else {
      stopListening();
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      stopListening();
    };
  }, [enabled, startListening, stopListening]);

  return {
    isListeningForWakeWord,
    isSupported,
    lastDetectedPhrase,
    startListening,
    stopListening,
  };
}


