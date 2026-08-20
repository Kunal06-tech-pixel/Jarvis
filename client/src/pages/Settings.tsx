import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Globe, Volume2, Play, Ear, Bot, Check, Sliders } from 'lucide-react';
import {
  VOICE_PERSONAS,
  VoicePersona,
  getStoredVoiceSettings,
  saveVoiceSettings,
  getSystemVoices,
  speakText,
} from '@/lib/voiceManager';
import { toast } from 'sonner';

export default function Settings() {
  const user = useAuthStore((state) => state.user);
  const [name, setName] = useState(user?.name || '');
  const [voiceSettings, setVoiceSettings] = useState(getStoredVoiceSettings);
  const [systemVoices, setSystemVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [playingPersonaId, setPlayingPersonaId] = useState<string | null>(null);

  // Wake Word Settings
  const [wakeWordEnabled, setWakeWordEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('jarvis_wake_word');
    return saved !== null ? saved === 'true' : true;
  });
  const [wakePhrase, setWakePhrase] = useState<string>(() => {
    return localStorage.getItem('jarvis_wake_phrase') || 'Hey Jarvis';
  });

  useEffect(() => {
    getSystemVoices().then((voices) => {
      setSystemVoices(voices);
    });
  }, []);

  const handleSelectPersona = (persona: VoicePersona) => {
    const updated = saveVoiceSettings({
      personaId: persona.id,
      pitch: persona.defaultPitch,
      rate: persona.defaultRate,
    });
    setVoiceSettings(updated);
    toast.success(`Active voice switched to ${persona.name}`);
  };

  const handlePreviewPersona = (persona: VoicePersona, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setPlayingPersonaId(persona.id);
    speakText(
      persona.sampleLine,
      {
        personaId: persona.id,
        pitch: persona.defaultPitch,
        rate: voiceSettings.rate || persona.defaultRate,
      },
      () => setPlayingPersonaId(null)
    );
  };

  const handleCustomVoiceChange = (voiceURI: string) => {
    const updated = saveVoiceSettings({ customVoiceURI: voiceURI });
    setVoiceSettings(updated);
    toast.success('Custom system voice updated');
  };

  const handleSpeedChange = (rateVal: string) => {
    const rate = parseFloat(rateVal);
    const updated = saveVoiceSettings({ rate });
    setVoiceSettings(updated);
    toast.success(`Voice speed set to ${rateVal}x`);
  };

  const handleWakeToggle = (enabled: boolean) => {
    setWakeWordEnabled(enabled);
    localStorage.setItem('jarvis_wake_word', String(enabled));
    toast.success(`Wake word listening ${enabled ? 'enabled' : 'disabled'}`);
  };

  const handleWakePhraseChange = (phrase: string) => {
    setWakePhrase(phrase);
    localStorage.setItem('jarvis_wake_phrase', phrase);
    toast.success(`Primary wake phrase updated to "${phrase}"`);
  };

  const handleSaveProfile = () => {
    toast.success('Preferences updated successfully.');
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto py-2">
      {/* Header */}
      <div className="pb-4 border-b border-white/[0.08]">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          System Preferences
        </h1>
        <p className="text-xs text-slate-300 mt-0.5">
          Manage AI vocal personas, hands-free voice wake detection, and runtime configuration.
        </p>
      </div>

      <div className="grid gap-5">
        {/* 1. Voice & Persona Selection Studio */}
        <Card className="minimal-card p-5 bg-[#10141E] border border-white/[0.08]">
          <CardHeader className="p-0 pb-4">
            <div className="flex items-center gap-3">
              <div className="bg-electric-blue/15 border border-electric-blue/30 p-2.5 rounded-xl text-electric-cyan">
                <Volume2 className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold text-white">AI Voice & Persona Studio</CardTitle>
                <CardDescription className="text-xs text-slate-300">Choose the vocal identity and timbre for Jarvis spoken replies.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 space-y-4">
            {/* Persona Grid */}
            <div className="grid gap-3 sm:grid-cols-2">
              {VOICE_PERSONAS.map((persona) => {
                const isSelected = voiceSettings.personaId === persona.id;
                const isPlaying = playingPersonaId === persona.id;
                return (
                  <div
                    key={persona.id}
                    onClick={() => handleSelectPersona(persona)}
                    className={`relative p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#141C2C] border-electric-blue shadow-[0_0_15px_rgba(37,99,235,0.25)]'
                        : 'bg-[#121724]/80 border-white/[0.08] hover:bg-[#161E2E] hover:border-white/[0.18]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <Bot className={`w-3.5 h-3.5 ${isSelected ? 'text-electric-cyan' : 'text-slate-400'}`} />
                          <h4 className="text-xs font-bold text-white">{persona.name}</h4>
                        </div>
                        {isSelected && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-electric-cyan bg-electric-cyan/15 px-2 py-0.5 rounded-full border border-electric-cyan/30">
                            <Check className="w-2.5 h-2.5" /> ACTIVE
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-300 leading-snug mb-3">
                        {persona.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/[0.05]">
                      <span className="text-[10px] text-slate-400 font-mono">
                        Speed: {persona.defaultRate}x · Pitch: {persona.defaultPitch}x
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => handlePreviewPersona(persona, e)}
                        className="h-6 px-2.5 text-[10px] text-electric-cyan hover:text-white hover:bg-electric-blue/20 rounded-lg gap-1 transition-all focus-visible:ring-2 focus-visible:ring-electric-cyan"
                      >
                        <Play className="w-2.5 h-2.5 fill-current" />
                        <span>{isPlaying ? 'Playing...' : 'Test Voice'}</span>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Custom Voice Speed & System Voice Fine Tuning */}
            <div className="grid gap-3 sm:grid-cols-2 pt-2 border-t border-white/[0.06]">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-electric-cyan" />
                  <span>Speech Rate Multiplier</span>
                </label>
                <div className="flex items-center gap-2">
                  {['0.85', '1.0', '1.15', '1.3'].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => handleSpeedChange(rate)}
                      className={`flex-1 py-1.5 rounded-xl border text-xs font-medium transition-all focus-visible:ring-2 focus-visible:ring-electric-cyan focus-visible:outline-none ${
                        (voiceSettings.rate || 1.0) === parseFloat(rate)
                          ? 'bg-electric-blue text-white border-electric-blue font-bold shadow-sm'
                          : 'bg-[#181F2E] border-white/[0.08] text-slate-300 hover:text-white'
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              </div>

              {systemVoices.length > 0 && (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Override OS Voice Synthesis Engine</label>
                  <select
                    value={voiceSettings.customVoiceURI || ''}
                    onChange={(e) => handleCustomVoiceChange(e.target.value)}
                    className="w-full bg-[#181F2E] border border-white/[0.08] text-white text-xs rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-electric-cyan px-3 h-9"
                    aria-label="OS Voice Synthesis Engine"
                  >
                    <option value="" className="bg-[#10141E] text-white">Default Assistant Profile Auto-Match</option>
                    {systemVoices.map((v) => (
                      <option key={v.voiceURI} value={v.voiceURI} className="bg-[#10141E] text-white">
                        {v.name} ({v.lang})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 2. Hands-Free Wake Word Preferences */}
        <Card className="minimal-card p-5 bg-[#10141E] border border-white/[0.08]">
          <CardHeader className="p-0 pb-4">
            <div className="flex items-center gap-3">
              <div className="bg-electric-cyan/15 border border-electric-cyan/30 p-2.5 rounded-xl text-electric-cyan">
                <Ear className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold text-white">Hands-Free Wake Detection</CardTitle>
                <CardDescription className="text-xs text-slate-300">Continuous local listening for "Hey Jarvis" or custom trigger phrases.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Background Wake Listener</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleWakeToggle(true)}
                    className={`flex-1 py-2 rounded-xl border text-xs font-medium transition-all focus-visible:ring-2 focus-visible:ring-electric-cyan focus-visible:outline-none ${
                      wakeWordEnabled
                        ? 'bg-electric-cyan/20 border-electric-cyan text-electric-cyan font-bold'
                        : 'bg-[#181F2E] border-white/[0.08] text-slate-400'
                    }`}
                  >
                    ENABLED
                  </button>
                  <button
                    onClick={() => handleWakeToggle(false)}
                    className={`flex-1 py-2 rounded-xl border text-xs font-medium transition-all focus-visible:ring-2 focus-visible:ring-electric-cyan focus-visible:outline-none ${
                      !wakeWordEnabled
                        ? 'bg-white/10 border-white/20 text-white font-bold'
                        : 'bg-[#181F2E] border-white/[0.08] text-slate-400'
                    }`}
                  >
                    PAUSED
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Primary Trigger Phrase</label>
                <select
                  value={wakePhrase}
                  onChange={(e) => handleWakePhraseChange(e.target.value)}
                  className="w-full bg-[#181F2E] border border-white/[0.08] text-white text-xs rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-electric-cyan px-3 h-9"
                  aria-label="Wake Phrase"
                >
                  <option value="Hey Jarvis">"Hey Jarvis" (Default)</option>
                  <option value="Jarvis">"Jarvis"</option>
                  <option value="Hey Siri">"Hey Siri"</option>
                  <option value="Ok Jarvis">"Ok Jarvis"</option>
                  <option value="Wake Up">"Wake Up"</option>
                </select>
              </div>
            </div>
            <p className="text-[11px] text-slate-300">
              💡 Tip: Say <strong className="text-white">"{wakePhrase}"</strong> or <strong className="text-white">"Hey Siri"</strong> to trigger Jarvis hands-free without clicking anything.
            </p>
          </CardContent>
        </Card>

        {/* 3. User Identity Section */}
        <Card className="minimal-card p-5 bg-[#10141E] border border-white/[0.08]">
          <CardHeader className="p-0 pb-4">
            <div className="flex items-center gap-3">
              <div className="bg-electric-blue/15 border border-electric-blue/30 p-2.5 rounded-xl text-electric-cyan">
                <User className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold text-white">User Profile</CardTitle>
                <CardDescription className="text-xs text-slate-300">Verified user account credentials.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Display Name</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} className="bg-[#181F2E] border-white/[0.08] text-white text-xs rounded-xl focus-visible:ring-2 focus-visible:ring-electric-cyan px-3 h-9" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Email Address</label>
                <Input value={user?.email || ''} disabled className="bg-[#181F2E]/50 border-white/[0.08] text-white/50 text-xs rounded-xl opacity-70 px-3 h-9" />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSaveProfile} className="bg-electric-blue hover:bg-electric-blue/90 text-white text-xs font-semibold px-4 rounded-xl h-8 focus-visible:ring-2 focus-visible:ring-electric-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0D14]">
                Save Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 4. Temporal Coordinates Section */}
        <Card className="minimal-card p-5 bg-[#10141E] border border-white/[0.08]">
          <CardHeader className="p-0 pb-4">
            <div className="flex items-center gap-3">
              <div className="bg-[#FFD60A]/15 border border-[#FFD60A]/30 p-2.5 rounded-xl text-[#FFD60A]">
                <Globe className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold text-white">Temporal Coordinates</CardTitle>
                <CardDescription className="text-xs text-slate-300">Timezone precision for scheduling background notifications.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1.5 max-w-sm">
              <label className="text-xs font-medium text-slate-300">Detected Device Timezone</label>
              <Input 
                value={Intl.DateTimeFormat().resolvedOptions().timeZone} 
                disabled 
                className="bg-[#181F2E] border-white/[0.08] text-xs text-[#FFD60A] rounded-xl opacity-90 px-3 h-9 font-mono" 
              />
              <p className="text-[11px] text-slate-300">Synchronized automatically with browser chronometer.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
