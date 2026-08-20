import { useState, useRef, useEffect, useCallback } from 'react';
import { animate, stagger } from 'animejs';
import { Mic, Square, Loader2, Search, Terminal, Volume2, Sparkles, Copy, Check, RotateCcw, ArrowRight, CornerDownLeft, Ear, Bot } from 'lucide-react';
import { api } from '@/services/api';
import { useWakeWord } from '@/services/useWakeWord';
import { playSuccessChime } from '@/lib/soundEffects';
import {
  VOICE_PERSONAS,
  getStoredVoiceSettings,
  saveVoiceSettings,
  speakText,
} from '@/lib/voiceManager';
import QuantumVoiceCore3D from '@/components/three/QuantumVoiceCore3D';
import { toast } from 'sonner';

interface ChatMessage {
  id: string;
  sender: 'user' | 'jarvis';
  text: string;
  time: string;
}

export default function VoiceAssistant() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [reply, setReply] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showCommandsModal, setShowCommandsModal] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activePersonaId, setActivePersonaId] = useState<string>(() => getStoredVoiceSettings().personaId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Wake Word & Continuous Conversation States
  const [wakeWordEnabled, setWakeWordEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('jarvis_wake_word');
    return saved !== null ? saved === 'true' : true;
  });
  const [continuousMode, setContinuousMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('jarvis_continuous');
    return saved !== null ? saved === 'true' : true;
  });
  const [selectedWakePhrase] = useState<string>(() => {
    return localStorage.getItem('jarvis_wake_phrase') || 'Hey Jarvis';
  });
  
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const isRecordingRef = useRef(false);
  const continuousModeRef = useRef(continuousMode);

  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  useEffect(() => {
    continuousModeRef.current = continuousMode;
  }, [continuousMode]);

  // Auto-scroll message history
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, reply]);

  const speak = useCallback((text: string, onEnd?: () => void) => {
    speakText(text, undefined, onEnd);
  }, []);

  const cyclePersona = () => {
    const currentIndex = VOICE_PERSONAS.findIndex((p) => p.id === activePersonaId);
    const nextIndex = (currentIndex + 1) % VOICE_PERSONAS.length;
    const nextPersona = VOICE_PERSONAS[nextIndex];
    saveVoiceSettings({
      personaId: nextPersona.id,
      pitch: nextPersona.defaultPitch,
      rate: nextPersona.defaultRate,
    });
    setActivePersonaId(nextPersona.id);
    toast.success(`Voice persona switched to ${nextPersona.name}`);
    speakText(nextPersona.sampleLine, { personaId: nextPersona.id });
  };

  const addMessage = useCallback((sender: 'user' | 'jarvis', text: string) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg: ChatMessage = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      sender,
      text,
      time,
    };
    setMessages((prev) => [...prev.slice(-15), newMsg]);
  }, []);

  // Execute a text directive (shared between search, quick commands, and wake-word trailing text)
  const executeTextDirective = useCallback(async (commandText: string) => {
    if (!commandText.trim()) return;

    setIsProcessing(true);
    setTranscript(commandText);
    addMessage('user', commandText);

    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const res = await api.post('/assistant/command', { command: commandText }, {
        headers: { 'x-timezone': timezone }
      });
      const { reply: aiReply } = res.data.data;
      setReply(aiReply);
      addMessage('jarvis', aiReply);
      playSuccessChime();

      // Check if command is a farewell or closure
      const isClosure = /^(that'?s all|that is all|nothing else|goodbye|bye|stop|thank you|thanks|dismissed|stand down)\b/i.test(commandText.trim());

      if (isClosure) {
        speak(aiReply);
      } else if (continuousModeRef.current) {
        // Continuous mode: automatically resume listening after speaking
        speak(aiReply, () => {
          setTimeout(() => {
            if (!isRecordingRef.current) {
              startRecording();
            }
          }, 350);
        });
      } else {
        speak(aiReply);
      }
    } catch (error) {
      toast.error('Failed to execute command');
    } finally {
      setIsProcessing(false);
    }
  }, [addMessage, speak]);

  // DOM Refs for Anime.js animations
  const haloGlowRef = useRef<HTMLDivElement>(null);
  const micButtonRef = useRef<HTMLButtonElement>(null);
  const transcriptTextRef = useRef<HTMLDivElement>(null);
  const searchModalRef = useRef<HTMLDivElement>(null);
  const commandsModalRef = useRef<HTMLDivElement>(null);
  const actionDockRef = useRef<HTMLDivElement>(null);
  const wakePillRef = useRef<HTMLDivElement>(null);

  // 1. Mount Animation: Stagger in Hero Elements
  useEffect(() => {
    if (actionDockRef.current) {
      animate(actionDockRef.current.children, {
        translateY: [25, 0],
        opacity: [0, 1],
        delay: stagger(100, { start: 300 }),
        ease: 'outCubic',
        duration: 700,
      });
    }
  }, []);

  // 2. State-based Glow & Mic Pulse Animations via Anime.js
  useEffect(() => {
    if (haloGlowRef.current) {
      if (isRecording) {
        animate(haloGlowRef.current, {
          scale: [1, 1.25, 1],
          opacity: [0.3, 0.7, 0.3],
          duration: 1400,
          loop: true,
          ease: 'inOutSine',
        });
      } else if (isProcessing) {
        animate(haloGlowRef.current, {
          scale: [1, 1.15, 1],
          opacity: [0.4, 0.8, 0.4],
          duration: 800,
          loop: true,
          ease: 'inOutQuad',
        });
      } else {
        animate(haloGlowRef.current, {
          scale: 1,
          opacity: 0.2,
          duration: 800,
          ease: 'outQuad',
        });
      }
    }

    if (micButtonRef.current) {
      if (isRecording) {
        animate(micButtonRef.current, {
          scale: [1, 1.08, 1],
          duration: 900,
          loop: true,
          ease: 'inOutSine',
        });
      } else {
        animate(micButtonRef.current, {
          scale: 1,
          duration: 400,
          ease: 'outElastic(1, .6)',
        });
      }
    }
  }, [isRecording, isProcessing]);

  // 6. Typography Text Reveal Animation via Anime.js
  useEffect(() => {
    if (transcriptTextRef.current) {
      animate(transcriptTextRef.current, {
        translateY: [12, 0],
        opacity: [0, 1],
        ease: 'outCubic',
        duration: 500,
      });
    }
  }, [transcript, reply, isRecording, isProcessing]);

  // 7. Modal Entrance Spring Animations via Anime.js
  useEffect(() => {
    if (showSearchModal && searchModalRef.current) {
      animate(searchModalRef.current, {
        scale: [0.92, 1],
        translateY: [20, 0],
        opacity: [0, 1],
        ease: 'outElastic(1, .75)',
        duration: 500,
      });
    }
  }, [showSearchModal]);

  useEffect(() => {
    if (showCommandsModal && commandsModalRef.current) {
      animate(commandsModalRef.current, {
        scale: [0.92, 1],
        translateY: [20, 0],
        opacity: [0, 1],
        ease: 'outElastic(1, .75)',
        duration: 500,
      });
    }
  }, [showCommandsModal]);

  // Global Keyboard shortcuts: Space (mic), / (search), Escape (close modal)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInputFocused = ['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName);

      if (e.key === 'Escape') {
        if (showSearchModal) setShowSearchModal(false);
        if (showCommandsModal) setShowCommandsModal(false);
        return;
      }

      if (e.key === '/' && !isInputFocused && !showSearchModal && !showCommandsModal) {
        e.preventDefault();
        setShowSearchModal(true);
        return;
      }

      if (
        e.code === 'Space' && 
        !isInputFocused &&
        !e.repeat &&
        !isProcessing &&
        !showSearchModal &&
        !showCommandsModal
      ) {
        e.preventDefault();
        if (!isRecording) {
          startRecording();
        } else {
          stopRecording();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRecording, isProcessing, showSearchModal, showCommandsModal]);

  // Wake word activation handler
  const handleWakeWordTrigger = useCallback((trailingCommand?: string) => {
    if (isProcessing) return;

    if (trailingCommand && trailingCommand.trim().length > 1) {
      toast.info(`Wake word recognized: "${trailingCommand}"`);
      executeTextDirective(trailingCommand);
    } else {
      // User simply called "Jarvis" / "Hey Jarvis" -> Jarvis replies verbally and immediately listens!
      const greetings = [
        "Yes? I'm listening.",
        "At your service, sir. How can I help?",
        "Jarvis online. What's on your mind?",
        "Online and ready. Go ahead."
      ];
      const greeting = greetings[Math.floor(Math.random() * greetings.length)];
      setTranscript('Hey Jarvis');
      setReply(greeting);
      addMessage('user', 'Hey Jarvis');
      addMessage('jarvis', greeting);
      toast.info("Jarvis is listening for your command...");

      speak(greeting, () => {
        setTimeout(() => {
          if (!isRecordingRef.current) {
            startRecording();
          }
        }, 250);
      });
    }
  }, [isProcessing, executeTextDirective, addMessage, speak]);

  const { isListeningForWakeWord } = useWakeWord({
    wakeWords: [
      selectedWakePhrase,
      'hey jarvis',
      'jarvis',
      'hey siri',
      'hello jarvis',
      'ok jarvis',
      'wake up'
    ],
    onWakeWord: handleWakeWordTrigger,
    enabled: wakeWordEnabled && !isRecording && !isProcessing,
  });

  const toggleWakeWord = () => {
    const next = !wakeWordEnabled;
    setWakeWordEnabled(next);
    localStorage.setItem('jarvis_wake_word', String(next));
    if (next) {
      toast.success(`Wake word listening enabled ("${selectedWakePhrase}" / "Hey Siri")`);
    } else {
      toast.info('Wake word listening paused');
    }
  };

  const toggleContinuousMode = () => {
    const next = !continuousMode;
    setContinuousMode(next);
    localStorage.setItem('jarvis_continuous', String(next));
    if (next) {
      toast.success('Free-flowing continuous conversation enabled');
    } else {
      toast.info('Single-turn directive mode enabled');
    }
  };

  const vadContextRef = useRef<AudioContext | null>(null);
  const vadAnimationIdRef = useRef<number | null>(null);

  const cleanupVAD = useCallback(() => {
    if (vadAnimationIdRef.current) {
      cancelAnimationFrame(vadAnimationIdRef.current);
      vadAnimationIdRef.current = null;
    }
    if (vadContextRef.current) {
      try {
        vadContextRef.current.close();
      } catch (e) {}
      vadContextRef.current = null;
    }
  }, []);

  const stopRecording = useCallback(() => {
    cleanupVAD();

    if (mediaRecorder.current && isRecordingRef.current) {
      try {
        mediaRecorder.current.stop();
      } catch (e) {}
      setIsRecording(false);
      isRecordingRef.current = false;
      setAudioStream(null);
    }
  }, [cleanupVAD]);

  const startRecording = async () => {
    try {
      cleanupVAD();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.current.onstop = async () => {
        cleanupVAD();
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        stream.getTracks().forEach(track => track.stop());
        setAudioStream(null);

        if (audioBlob.size < 1024) {
          setIsRecording(false);
          isRecordingRef.current = false;
          return;
        }

        await processAudio(audioBlob);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      isRecordingRef.current = true;

      // Initialize Intelligent Audio VAD (Voice Activity Detection)
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        try {
          const audioCtx = new AudioCtx();
          vadContextRef.current = audioCtx;
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 512;
          analyser.smoothingTimeConstant = 0.4;
          const source = audioCtx.createMediaStreamSource(stream);
          source.connect(analyser);

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          let hasDetectedSpeech = false;
          let silenceStartTime: number | null = null;
          const recordingStartTime = Date.now();

          const checkVAD = () => {
            if (!isRecordingRef.current) return;

            analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const averageVolume = sum / dataArray.length;

            const SPEECH_THRESHOLD = 16; // Sensitivity threshold for speech
            const SILENCE_TIMEOUT_MS = 1600; // 1.6s of silence after speech completes command
            const MAX_INITIAL_SILENCE_MS = 8000; // 8s timeout if no speech detected

            const now = Date.now();

            if (averageVolume > SPEECH_THRESHOLD) {
              hasDetectedSpeech = true;
              silenceStartTime = null;
            } else if (hasDetectedSpeech) {
              if (silenceStartTime === null) {
                silenceStartTime = now;
              } else if (now - silenceStartTime >= SILENCE_TIMEOUT_MS) {
                // User has finished speaking! Automatically stop & process command!
                stopRecording();
                return;
              }
            } else if (now - recordingStartTime >= MAX_INITIAL_SILENCE_MS) {
              // User didn't speak after wake up, auto-stop and return to standby
              stopRecording();
              return;
            }

            vadAnimationIdRef.current = requestAnimationFrame(checkVAD);
          };

          // Delay VAD loop slightly to ignore initial mic click/pop
          setTimeout(() => {
            if (isRecordingRef.current) {
              vadAnimationIdRef.current = requestAnimationFrame(checkVAD);
            }
          }, 350);
        } catch (e) {
          console.warn('VAD AudioContext init error:', e);
        }
      }
    } catch (error) {
      toast.error('Microphone access unavailable. Please grant microphone permission in your browser.');
    }
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearConversation = () => {
    setTranscript('');
    setReply('');
    setMessages([]);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    toast.info('Conversation history cleared');
  };

  const processAudio = async (blob: Blob) => {
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('audio', blob, 'recording.webm');
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const res = await api.post('/assistant/command', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-timezone': timezone
        }
      });

      const { transcript: recordedTranscript, reply: aiReply } = res.data.data;
      const userText = recordedTranscript || 'Voice Directive Received';
      setTranscript(userText);
      setReply(aiReply);
      addMessage('user', userText);
      addMessage('jarvis', aiReply);
      playSuccessChime();

      // Check if command is a closure or goodbye
      const isClosure = /^(that'?s all|that is all|nothing else|goodbye|bye|stop|thank you|thanks|dismissed|stand down)\b/i.test(userText.trim());

      if (isClosure) {
        speak(aiReply);
      } else if (continuousModeRef.current) {
        // Continuous mode: automatically resume listening after speaking
        speak(aiReply, () => {
          setTimeout(() => {
            if (!isRecordingRef.current) {
              startRecording();
            }
          }, 350);
        });
      } else {
        speak(aiReply);
      }
    } catch (error: any) {
      const msg = error.response?.data?.error?.message;
      if (msg === 'Empty command' || msg === 'No command or audio provided') {
        // Subtle handling for empty continuous audio
      } else {
        toast.error(msg || 'Failed to process voice command.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    setShowSearchModal(false);
    const commandText = searchInput;
    setSearchInput('');
    await executeTextDirective(commandText);
  };

  const executeQuickCommand = async (cmd: string) => {
    setShowCommandsModal(false);
    await executeTextDirective(cmd);
  };

  const quickCommands = [
    { label: 'Create new urgent task', cmd: 'Create a high priority task to review Q3 roadmap', category: 'Tasks' },
    { label: 'Set a reminder for tomorrow', cmd: 'Remind me tomorrow at 9am to check email', category: 'Reminders' },
    { label: 'Schedule executive sync', cmd: 'Schedule a team sync meeting next Monday at 2pm', category: 'Calendar' },
    { label: 'Summarize today\'s agenda', cmd: 'What are my pending tasks and events for today?', category: 'Intelligence' },
  ];

  return (
    <div className="relative flex flex-col items-center justify-between min-h-[500px] w-full max-w-4xl mx-auto py-4 select-none">
      
      {/* 0. Mode Control Pills */}
      <div ref={wakePillRef} className="flex flex-wrap items-center justify-center gap-2.5 mb-2 px-2">
        {/* Wake Word Status Pill */}
        <button
          onClick={toggleWakeWord}
          className={`group flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border text-xs font-medium transition-all shadow-sm active:scale-95 focus-visible:ring-2 focus-visible:ring-electric-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0D14] focus-visible:outline-none min-h-[36px] ${
            wakeWordEnabled && isListeningForWakeWord
              ? 'bg-[#121927] border-electric-cyan/40 text-white hover:border-electric-cyan'
              : 'bg-[#10141E] border-white/[0.08] text-slate-300 hover:text-white'
          }`}
          title="Toggle hands-free voice wake detection"
          aria-label="Toggle Wake Word Detection"
        >
          <div className="relative flex items-center justify-center">
            {wakeWordEnabled && isListeningForWakeWord ? (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-electric-cyan opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-electric-cyan" />
              </span>
            ) : (
              <span className="w-2 h-2 rounded-full bg-white/20" />
            )}
          </div>
          <span className="flex items-center gap-1.5">
            <Ear className={`w-3.5 h-3.5 ${wakeWordEnabled ? 'text-electric-cyan' : 'text-slate-400'}`} />
            <span>Wake Word: <strong className="text-white font-semibold">"{selectedWakePhrase}"</strong></span>
          </span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            wakeWordEnabled ? 'bg-electric-cyan/15 text-electric-cyan' : 'bg-white/5 text-slate-400'
          }`}>
            {wakeWordEnabled ? 'ACTIVE' : 'MUTED'}
          </span>
        </button>

        {/* Free Flowing Dialogue Mode Pill */}
        <button
          onClick={toggleContinuousMode}
          className={`group flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-medium transition-all shadow-sm active:scale-95 focus-visible:ring-2 focus-visible:ring-electric-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0D14] focus-visible:outline-none min-h-[36px] ${
            continuousMode
              ? 'bg-[#121927] border-electric-blue/50 text-white hover:border-electric-blue shadow-[0_0_12px_rgba(37,99,235,0.25)]'
              : 'bg-[#10141E] border-white/[0.08] text-slate-300 hover:text-white'
          }`}
          title="Toggle continuous free-flowing conversation loop"
          aria-label="Toggle Continuous Dialogue"
        >
          <Bot className={`w-3.5 h-3.5 ${continuousMode ? 'text-electric-cyan' : 'text-slate-400'}`} />
          <span>Continuous Dialogue</span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            continuousMode ? 'bg-electric-blue/20 text-electric-cyan' : 'bg-white/5 text-slate-400'
          }`}>
            {continuousMode ? 'FLOW ON' : 'SINGLE TURN'}
          </span>
        </button>

        {/* Voice Persona Switcher Pill */}
        <button
          onClick={cyclePersona}
          className="group flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/[0.08] bg-[#121724] hover:bg-[#182030] hover:border-electric-cyan/40 text-white transition-all shadow-sm active:scale-95 focus-visible:ring-2 focus-visible:ring-electric-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0D14] focus-visible:outline-none min-h-[36px]"
          title="Click to cycle between Jarvis Prime, Friday AI, HAL 9000, and Cyberpunk Neo"
          aria-label="Switch Voice Persona"
        >
          <Sparkles className="w-3.5 h-3.5 text-electric-cyan" />
          <span className="text-xs font-medium">
            Voice: <strong className="text-white font-semibold">{VOICE_PERSONAS.find((p) => p.id === activePersonaId)?.name || 'Jarvis Prime'}</strong>
          </span>
          <span className="text-[10px] font-mono text-slate-400 group-hover:text-electric-cyan transition-colors">
            ↻
          </span>
        </button>
      </div>

      {/* 1. Center 3D Quantum Neural Voice Core */}
      <div className="relative flex flex-col items-center justify-center w-full my-1">
        {/* Unambiguous State Badge */}
        <div className="mb-2">
          {isRecording ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-[11px] font-bold tracking-wider text-red-400 uppercase animate-pulse">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              LISTENING • SPEAK NOW
            </span>
          ) : isProcessing ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-electric-cyan/15 border border-electric-cyan/30 text-[11px] font-bold tracking-wider text-electric-cyan uppercase">
              <Loader2 className="w-3 h-3 animate-spin text-electric-cyan" />
              SYNTHESIZING DIRECTIVE
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-semibold tracking-wider text-emerald-400 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              STANDBY • READY
            </span>
          )}
        </div>

        {/* Ambient Glow */}
        <div 
          ref={haloGlowRef}
          className={`absolute w-72 h-72 rounded-full blur-3xl pointer-events-none transition-colors duration-500 ${
            isRecording 
              ? 'bg-electric-cyan/40' 
              : isProcessing 
              ? 'bg-electric-blue/40' 
              : 'bg-electric-cyan/15'
          }`} 
        />

        {/* 3D WebGL Holographic Orb */}
        <QuantumVoiceCore3D 
          isRecording={isRecording} 
          isProcessing={isProcessing} 
          audioStream={audioStream} 
        />
      </div>

      {/* 2. Interactive State & Live Conversation Thread */}
      <div ref={transcriptTextRef} className="text-center my-3 px-4 max-w-2xl w-full">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white transition-all">
          {isRecording ? 'Listening...' : isProcessing ? 'Processing Directive...' : 'Jarvis Assistant'}
        </h2>
        
        {/* Conversation Stream History */}
        {messages.length > 0 ? (
          <div className="mt-3 max-h-[180px] overflow-y-auto rounded-2xl bg-[#111622]/90 border border-white/[0.08] p-3 text-left shadow-lg space-y-2.5 backdrop-blur-md">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-1.5 mb-0.5 text-[10px] text-slate-300">
                  <span className="font-semibold text-white/80">{msg.sender === 'user' ? 'You' : 'Jarvis'}</span>
                  <span>•</span>
                  <span>{msg.time}</span>
                </div>
                <div 
                  className={`relative group max-w-[85%] rounded-xl px-3.5 py-2 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-electric-blue/20 text-white border border-electric-blue/30 rounded-tr-none'
                      : 'bg-[#182030] text-white/95 border border-white/[0.06] rounded-tl-none'
                  }`}
                >
                  <p>{msg.text}</p>
                  
                  {/* Message Action Buttons */}
                  {msg.sender === 'jarvis' && (
                    <div className="flex items-center gap-2 mt-1.5 pt-1 border-t border-white/[0.06] text-[10px]">
                      <button
                        onClick={() => speak(msg.text)}
                        className="text-electric-cyan hover:text-white flex items-center gap-1 transition-colors focus-visible:outline-none focus-visible:underline"
                      >
                        <Volume2 className="w-2.5 h-2.5" />
                        <span>Replay</span>
                      </button>
                      <button
                        onClick={() => copyToClipboard(msg.id, msg.text)}
                        className="text-slate-300 hover:text-white flex items-center gap-1 transition-colors focus-visible:outline-none focus-visible:underline"
                      >
                        {copiedId === msg.id ? <Check className="w-2.5 h-2.5 text-[#10B981]" /> : <Copy className="w-2.5 h-2.5" />}
                        <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
            
            <div className="flex justify-between items-center pt-2 border-t border-white/[0.05] text-[10px] text-slate-300">
              <span className="italic">💡 Say "Jarvis" or speak your next command to continue.</span>
              <button 
                onClick={clearConversation}
                className="text-slate-300 hover:text-white flex items-center gap-1 transition-colors focus-visible:outline-none focus-visible:underline"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                <span>Clear History</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-2 min-h-[52px] flex flex-col items-center justify-center">
            {isRecording ? (
              <p className="text-xs text-electric-cyan font-medium animate-pulse">
                Listening for your speech directive...
              </p>
            ) : (
              <p className="text-xs text-slate-300 font-medium">
                Say <strong className="text-white">"Hey Jarvis"</strong> or press <kbd className="font-mono text-[10px] bg-white/10 px-1.5 py-0.5 rounded border border-white/10 text-white">Space</kbd> to begin.
              </p>
            )}
          </div>
        )}
      </div>

      {/* 3. Floating Bottom Control Dock */}
      <div ref={actionDockRef} className="flex items-center justify-center gap-4 mt-4">
        {/* Left Pill: Search */}
        <button
          onClick={() => setShowSearchModal(true)}
          className="h-12 px-5 sm:px-6 rounded-full bg-[#151B27] border border-white/[0.08] hover:bg-[#1D2536] hover:border-white/[0.15] text-white/90 hover:text-white flex items-center gap-2 text-xs font-semibold tracking-wide transition-all shadow-md active:scale-95 focus-visible:ring-2 focus-visible:ring-electric-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0D14] focus-visible:outline-none group"
        >
          <Search className="w-3.5 h-3.5 text-white/60 group-hover:text-electric-cyan transition-colors" />
          <span>Search</span>
          <kbd className="hidden sm:inline text-[9px] text-white/40 bg-white/5 px-1.5 py-0.5 rounded border border-white/10">/</kbd>
        </button>

        {/* Center Button: Electric Blue Circular Mic Button */}
        <button
          ref={micButtonRef}
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
          aria-label="Voice Input (Space)"
          className={`relative w-16 h-16 rounded-full flex items-center justify-center text-white transition-all active:scale-95 shadow-xl focus-visible:ring-2 focus-visible:ring-electric-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0D14] focus-visible:outline-none ${
            isRecording
              ? 'bg-[#EF4444] shadow-[0_0_35px_rgba(239,68,68,0.7)]'
              : 'mic-button-main'
          }`}
        >
          {isProcessing ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : isRecording ? (
            <Square className="w-5 h-5 fill-current" />
          ) : (
            <Mic className="w-6 h-6" />
          )}
        </button>

        {/* Right Pill: Commands */}
        <button
          onClick={() => setShowCommandsModal(true)}
          className="h-12 px-5 sm:px-6 rounded-full bg-[#151B27] border border-white/[0.08] hover:bg-[#1D2536] hover:border-white/[0.15] text-white/90 hover:text-white flex items-center gap-2 text-xs font-semibold tracking-wide transition-all shadow-md active:scale-95 focus-visible:ring-2 focus-visible:ring-electric-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0D14] focus-visible:outline-none group"
        >
          <Terminal className="w-3.5 h-3.5 text-white/60 group-hover:text-electric-cyan transition-colors" />
          <span>Commands</span>
        </button>
      </div>

      {/* Search Directive Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div 
            ref={searchModalRef}
            className="w-full max-w-lg rounded-2xl bg-[#111622] border border-white/[0.1] p-5 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-electric-cyan" />
                <h3 className="text-sm font-semibold text-white">Execute Command Directive</h3>
              </div>
              <button 
                onClick={() => setShowSearchModal(false)}
                className="text-xs text-white/40 hover:text-white p-1"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSearchSubmit} className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-white/40" />
                <input
                  type="text"
                  autoFocus
                  placeholder="e.g., 'Add high priority task', 'Remind me tomorrow at 9am'..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full rounded-xl bg-[#182030] border border-white/[0.1] py-3 pl-10 pr-10 text-xs text-white placeholder:text-white/40 focus:border-electric-blue focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!searchInput.trim()}
                  className="absolute right-2.5 top-2.5 p-1 rounded-lg bg-electric-blue hover:bg-electric-blue/90 text-white disabled:opacity-30 transition-all"
                  aria-label="Submit Directive"
                >
                  <CornerDownLeft className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] text-white/40 pt-1">
                <span>Tip: You can use natural speech or type full sentences.</span>
                <span className="font-mono text-[10px]">Press Enter ↵</span>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Suggested Commands Drawer Modal */}
      {showCommandsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div 
            ref={commandsModalRef}
            className="w-full max-w-lg rounded-2xl bg-[#111622] border border-white/[0.1] p-5 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-electric-cyan" />
                <h3 className="text-sm font-semibold text-white">Suggested Voice Directives</h3>
              </div>
              <button 
                onClick={() => setShowCommandsModal(false)}
                className="text-xs text-white/40 hover:text-white p-1"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-2">
              {quickCommands.map((item, index) => (
                <button
                  key={index}
                  onClick={() => executeQuickCommand(item.cmd)}
                  className="w-full text-left p-3.5 rounded-xl bg-[#161C2A] hover:bg-[#1D2538] border border-white/[0.05] hover:border-electric-blue/30 transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-semibold text-electric-cyan bg-electric-cyan/10 px-2 py-0.5 rounded-full">
                        {item.category}
                      </span>
                      <ArrowRight className="w-3 h-3 text-white/20 group-hover:text-electric-cyan group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <p className="text-xs font-semibold text-white group-hover:text-white transition-colors">
                      {item.label}
                    </p>
                  </div>
                  <p className="text-[11px] text-white/40 mt-1 italic">
                    "{item.cmd}"
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
