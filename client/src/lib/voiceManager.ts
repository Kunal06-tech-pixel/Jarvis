export interface VoicePersona {
  id: string;
  name: string;
  description: string;
  gender: 'male' | 'female' | 'synthetic';
  voiceKeywords: string[];
  defaultPitch: number;
  defaultRate: number;
  sampleLine: string;
}

export const VOICE_PERSONAS: VoicePersona[] = [
  {
    id: 'jarvis-prime',
    name: 'Jarvis Prime',
    description: 'Refined British Tech Butler',
    gender: 'male',
    voiceKeywords: ['uk english', 'british', 'george', 'daniel', 'oliver', 'en-gb', 'male'],
    defaultPitch: 0.95,
    defaultRate: 1.05,
    sampleLine: 'Jarvis online. All systems nominal and ready for your command, sir.',
  },
  {
    id: 'friday-ai',
    name: 'Friday AI',
    description: 'Sophisticated & Crisp Female AI',
    gender: 'female',
    voiceKeywords: ['samantha', 'victoria', 'zira', 'serena', 'karen', 'female', 'en-us'],
    defaultPitch: 1.10,
    defaultRate: 1.05,
    sampleLine: 'Friday protocol initialized. How can I assist your productivity today, boss?',
  },
  {
    id: 'hal-9000',
    name: 'HAL 9000',
    description: 'Deep, Calm & Authoritative Synthetic',
    gender: 'synthetic',
    voiceKeywords: ['david', 'alex', 'mark', 'tom', 'male', 'natural'],
    defaultPitch: 0.80,
    defaultRate: 0.92,
    sampleLine: 'I am completely operational and all my circuits are functioning perfectly.',
  },
  {
    id: 'cyberpunk-neo',
    name: 'Cyberpunk Neo',
    description: 'Fast Dynamic Holographic Operator',
    gender: 'male',
    voiceKeywords: ['google', 'natural', 'enhanced', 'en-us', 'en-gb'],
    defaultPitch: 1.05,
    defaultRate: 1.20,
    sampleLine: 'Neural link established. Ready to execute your directives at lightspeed.',
  },
];

export interface VoiceSettings {
  personaId: string;
  customVoiceURI: string;
  pitch: number;
  rate: number;
}

export const DEFAULT_VOICE_SETTINGS: VoiceSettings = {
  personaId: 'jarvis-prime',
  customVoiceURI: '',
  pitch: 0.95,
  rate: 1.05,
};

export function getStoredVoiceSettings(): VoiceSettings {
  try {
    const stored = localStorage.getItem('jarvis_voice_settings');
    if (stored) {
      return { ...DEFAULT_VOICE_SETTINGS, ...JSON.parse(stored) };
    }
  } catch (e) {
    // fallback
  }
  return DEFAULT_VOICE_SETTINGS;
}

export function saveVoiceSettings(settings: Partial<VoiceSettings>): VoiceSettings {
  const current = getStoredVoiceSettings();
  const updated = { ...current, ...settings };
  localStorage.setItem('jarvis_voice_settings', JSON.stringify(updated));
  return updated;
}

export function getSystemVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      resolve([]);
      return;
    }

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
      return;
    }

    window.speechSynthesis.onvoiceschanged = () => {
      resolve(window.speechSynthesis.getVoices());
    };

    // Timeout fallback after 1 second
    setTimeout(() => {
      resolve(window.speechSynthesis.getVoices());
    }, 1000);
  });
}

export function findMatchingVoice(
  voices: SpeechSynthesisVoice[],
  persona: VoicePersona,
  customURI?: string
): SpeechSynthesisVoice | null {
  if (customURI) {
    const exact = voices.find((v) => v.voiceURI === customURI);
    if (exact) return exact;
  }

  // 1. Try finding by persona keywords
  for (const keyword of persona.voiceKeywords) {
    const match = voices.find(
      (v) =>
        v.name.toLowerCase().includes(keyword.toLowerCase()) ||
        v.lang.toLowerCase().includes(keyword.toLowerCase())
    );
    if (match) return match;
  }

  // 2. English fallback
  const englishVoice = voices.find((v) => v.lang.startsWith('en'));
  if (englishVoice) return englishVoice;

  // 3. Default system voice
  return voices[0] || null;
}

export async function speakText(
  text: string,
  customSettings?: Partial<VoiceSettings>,
  onEnd?: () => void
): Promise<void> {
  if (!('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return;
  }

  window.speechSynthesis.cancel();

  const settings = { ...getStoredVoiceSettings(), ...customSettings };
  const persona =
    VOICE_PERSONAS.find((p) => p.id === settings.personaId) || VOICE_PERSONAS[0];

  const voices = await getSystemVoices();
  const voice = findMatchingVoice(voices, persona, settings.customVoiceURI);

  const utterance = new SpeechSynthesisUtterance(text);
  if (voice) {
    utterance.voice = voice;
  }
  utterance.pitch = settings.pitch || persona.defaultPitch;
  utterance.rate = settings.rate || persona.defaultRate;

  if (onEnd) {
    utterance.onend = () => onEnd();
    utterance.onerror = () => onEnd();
  }

  window.speechSynthesis.speak(utterance);
}
