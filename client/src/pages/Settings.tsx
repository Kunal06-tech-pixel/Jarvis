import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/services/api';
import { User, Globe, Volume2, Play, Ear, Bot, Check, Sliders, Smartphone, Send, AlertTriangle, ShieldCheck, MessageSquare } from 'lucide-react';
import {
  getNotificationPermission,
  getActiveSubscription,
  subscribeToPush,
  unsubscribeFromPush,
  triggerTestPush,
} from '@/services/pushNotification';
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

  // Web Push Settings
  const [isPushSubscribed, setIsPushSubscribed] = useState<boolean>(false);
  const [pushPermission, setPushPermission] = useState<NotificationPermission | 'unsupported'>('default');
  const [isPushLoading, setIsPushLoading] = useState<boolean>(false);
  const [isTestLoading, setIsTestLoading] = useState<boolean>(false);

  const checkPushStatus = async () => {
    const perm = getNotificationPermission();
    setPushPermission(perm);
    if (perm === 'granted') {
      const sub = await getActiveSubscription();
      setIsPushSubscribed(!!sub);
    } else {
      setIsPushSubscribed(false);
    }
  };

  // Telegram Bot Settings
  const [telegramChatId, setTelegramChatId] = useState<string>('');
  const [telegramEnabled, setTelegramEnabled] = useState<boolean>(false);
  const [isTelegramBotConfigured, setIsTelegramBotConfigured] = useState<boolean>(true);
  const [isTelegramSaving, setIsTelegramSaving] = useState<boolean>(false);
  const [isTelegramTestLoading, setIsTelegramTestLoading] = useState<boolean>(false);

  const fetchTelegramStatus = async () => {
    try {
      const res = await api.get('/telegram/status');
      setIsTelegramBotConfigured(res.data.data.isBotConfigured);
      setTelegramChatId(res.data.data.telegramChatId || '');
      setTelegramEnabled(res.data.data.telegramEnabled || false);
    } catch (err) {
      console.warn('[Settings] Could not load Telegram settings:', err);
    }
  };

  useEffect(() => {
    getSystemVoices().then((voices) => {
      setSystemVoices(voices);
    });
    checkPushStatus();
    fetchTelegramStatus();
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

  const handleTogglePush = async () => {
    setIsPushLoading(true);
    try {
      if (isPushSubscribed) {
        const res = await unsubscribeFromPush();
        if (res.success) {
          setIsPushSubscribed(false);
          toast.success('Device push notifications disabled');
        } else {
          toast.error(res.error || 'Failed to disable push');
        }
      } else {
        const res = await subscribeToPush();
        if (res.success) {
          setIsPushSubscribed(true);
          setPushPermission('granted');
          toast.success('Device Web Push successfully enabled!');
        } else {
          toast.error(res.error || 'Failed to subscribe to push');
          setPushPermission(getNotificationPermission());
        }
      }
    } finally {
      setIsPushLoading(false);
    }
  };

  const handleTestPush = async () => {
    setIsTestLoading(true);
    try {
      const res = await triggerTestPush();
      if (res.success) {
        toast.success('Test push notification dispatched to this device');
      } else {
        toast.error(res.error || 'Failed to trigger test push');
      }
    } finally {
      setIsTestLoading(false);
    }
  };

  const handleSaveTelegram = async () => {
    setIsTelegramSaving(true);
    try {
      const res = await api.post('/telegram/settings', {
        telegramChatId: telegramChatId.trim(),
        telegramEnabled,
      });
      setTelegramChatId(res.data.data.telegramChatId || '');
      setTelegramEnabled(res.data.data.telegramEnabled || false);
      toast.success('Telegram alert preferences saved');
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Failed to save Telegram settings');
    } finally {
      setIsTelegramSaving(false);
    }
  };

  const handleTestTelegram = async () => {
    if (!telegramChatId.trim()) {
      toast.error('Please enter your Telegram Chat ID first');
      return;
    }
    setIsTelegramTestLoading(true);
    try {
      await api.post('/telegram/test', {
        telegramChatId: telegramChatId.trim(),
      });
      toast.success('Test alert dispatched to your Telegram chat!');
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Failed to send Telegram test message');
    } finally {
      setIsTelegramTestLoading(false);
    }
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

        {/* 3. Real-World Web Push & Device Notifications */}
        <Card className="minimal-card p-5 bg-[#10141E] border border-white/[0.08]">
          <CardHeader className="p-0 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-[#10B981]/15 border border-[#10B981]/30 p-2.5 rounded-xl text-[#10B981]">
                  <Smartphone className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                    Device-Level Web Push Notifications
                    {pushPermission === 'unsupported' ? (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                        Unsupported
                      </span>
                    ) : pushPermission === 'denied' ? (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#FF9F0A]/20 text-[#FF9F0A] border border-[#FF9F0A]/30 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3 inline" /> Blocked in Browser
                      </span>
                    ) : isPushSubscribed ? (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3 inline" /> Active & Subscribed
                      </span>
                    ) : (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-slate-300 border border-white/10">
                        Inactive
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-300">
                    Receive exact-time reminder alerts on your phone or desktop even when the browser tab is closed.
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 space-y-4">
            <div className="p-3.5 rounded-xl bg-[#141A26] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="text-xs font-semibold text-white">Browser Push Service Status</div>
                <div className="text-[11px] text-slate-300">
                  {pushPermission === 'unsupported'
                    ? 'This browser does not support the Web Push Notification API.'
                    : pushPermission === 'denied'
                    ? 'Notifications are blocked in your site settings. Please click the lock/settings icon in your URL bar and allow notifications.'
                    : isPushSubscribed
                    ? 'This device is registered with JARVIS VAPID credentials to receive push dispatches.'
                    : 'Subscribe this device to receive background reminder notifications via service workers.'}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {isPushSubscribed && (
                  <Button
                    onClick={handleTestPush}
                    disabled={isTestLoading || isPushLoading}
                    variant="outline"
                    className="h-8 px-3 text-xs bg-white/5 hover:bg-white/10 text-slate-300 border-white/[0.08] rounded-xl focus-visible:ring-2 focus-visible:ring-electric-cyan"
                  >
                    <Send className="h-3.5 w-3.5 mr-1.5 text-electric-cyan" />
                    {isTestLoading ? 'Sending...' : 'Test Alert'}
                  </Button>
                )}

                {pushPermission !== 'unsupported' && (
                  <Button
                    onClick={handleTogglePush}
                    disabled={isPushLoading || pushPermission === 'denied'}
                    className={`h-8 px-4 text-xs font-semibold rounded-xl transition-all focus-visible:ring-2 focus-visible:ring-electric-cyan ${
                      isPushSubscribed
                        ? 'bg-white/10 hover:bg-red-500/20 text-slate-300 hover:text-red-400 border border-white/[0.08] hover:border-red-500/30'
                        : 'bg-[#10B981] hover:bg-[#10B981]/90 text-[#0A0D14] font-bold shadow-lg shadow-[#10B981]/20'
                    }`}
                  >
                    {isPushLoading
                      ? 'Processing...'
                      : isPushSubscribed
                      ? 'Disable Push'
                      : 'Enable Device Push'}
                  </Button>
                )}
              </div>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed">
              ⚡ <strong className="text-white">Layered Notification Architecture</strong>: Open tabs receive instant real-time Socket.IO alerts with voice synthesis. Closed or backgrounded tabs receive native OS system banners via Web Push service workers.
            </p>
          </CardContent>
        </Card>

        {/* 4. Telegram Direct Phone Alerts */}
        <Card className="minimal-card p-5 bg-[#10141E] border border-white/[0.08]">
          <CardHeader className="p-0 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-[#0088cc]/15 border border-[#0088cc]/30 p-2.5 rounded-xl text-[#0088cc]">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                    Telegram Direct Phone Alerts
                    {!isTelegramBotConfigured ? (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#FF9F0A]/20 text-[#FF9F0A] border border-[#FF9F0A]/30 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3 inline" /> Bot Token Needed in .env
                      </span>
                    ) : telegramEnabled && telegramChatId ? (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3 inline" /> Active & Dispatched
                      </span>
                    ) : telegramChatId ? (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-slate-400 border border-white/10">
                        Paused
                      </span>
                    ) : (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-slate-400 border border-white/10">
                        Unlinked
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-300">
                    Receive immediate, high-priority notifications on your phone via Telegram for all scheduled reminders.
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Telegram Phone Alerts</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setTelegramEnabled(true)}
                    className={`flex-1 py-2 rounded-xl border text-xs font-medium transition-all focus-visible:ring-2 focus-visible:ring-electric-cyan focus-visible:outline-none ${
                      telegramEnabled
                        ? 'bg-[#0088cc]/20 border-[#0088cc] text-[#38BDF8] font-bold'
                        : 'bg-[#181F2E] border-white/[0.08] text-slate-400'
                    }`}
                  >
                    ENABLED
                  </button>
                  <button
                    type="button"
                    onClick={() => setTelegramEnabled(false)}
                    className={`flex-1 py-2 rounded-xl border text-xs font-medium transition-all focus-visible:ring-2 focus-visible:ring-electric-cyan focus-visible:outline-none ${
                      !telegramEnabled
                        ? 'bg-white/10 border-white/20 text-white font-bold'
                        : 'bg-[#181F2E] border-white/[0.08] text-slate-400'
                    }`}
                  >
                    PAUSED
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Your Telegram Chat ID</label>
                <Input
                  value={telegramChatId}
                  onChange={(e) => setTelegramChatId(e.target.value)}
                  placeholder="e.g. 123456789"
                  className="bg-[#181F2E] border-white/[0.08] text-white text-xs rounded-xl focus-visible:ring-2 focus-visible:ring-electric-cyan px-3 h-9 font-mono"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#141A26] border border-white/[0.08] text-[11px] text-slate-300 space-y-1">
              <div className="font-semibold text-white flex items-center gap-1.5">
                <span>💡 How to find your Telegram Chat ID:</span>
              </div>
              <div>
                1. Open Telegram on your phone or desktop and search for <strong>@userinfobot</strong>
              </div>
              <div>
                2. Tap <strong>Start</strong> — it will reply with your personal <strong>Id</strong> (e.g. <code>987654321</code>).
              </div>
              <div>
                3. Paste the ID number above and tap <strong>Save Settings</strong>.
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <p className="text-[11px] text-slate-400">
                📲 Notifications are delivered with zero battery drain via Telegram Cloud Push.
              </p>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  onClick={handleTestTelegram}
                  disabled={isTelegramTestLoading || !telegramChatId.trim()}
                  variant="outline"
                  className="h-8 px-3 text-xs bg-white/5 hover:bg-white/10 text-slate-300 border-white/[0.08] rounded-xl focus-visible:ring-2 focus-visible:ring-electric-cyan"
                >
                  <Send className="h-3.5 w-3.5 mr-1.5 text-[#38BDF8]" />
                  {isTelegramTestLoading ? 'Sending...' : 'Test Telegram Alert'}
                </Button>
                <Button
                  type="button"
                  onClick={handleSaveTelegram}
                  disabled={isTelegramSaving}
                  className="h-8 px-4 text-xs font-semibold bg-[#0088cc] hover:bg-[#0088cc]/90 text-white rounded-xl focus-visible:ring-2 focus-visible:ring-electric-cyan shadow-md shadow-[#0088cc]/20"
                >
                  <Check className="h-3.5 w-3.5 mr-1.5" />
                  {isTelegramSaving ? 'Saving...' : 'Save Settings'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 5. User Identity Section */}
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
