import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { animate } from 'animejs';
import { MoreHorizontal, LogOut, Settings as SettingsIcon, Keyboard, Volume2, VolumeX, ShieldCheck } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export default function Header() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const shortcutsModalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isMenuOpen && menuRef.current) {
      animate(menuRef.current, {
        scale: [0.94, 1],
        translateY: [-6, 0],
        opacity: [0, 1],
        ease: 'outQuad',
        duration: 220,
      });
    }
  }, [isMenuOpen]);

  useEffect(() => {
    if (showShortcutsModal && shortcutsModalRef.current) {
      animate(shortcutsModalRef.current, {
        scale: [0.92, 1],
        translateY: [15, 0],
        opacity: [0, 1],
        ease: 'outElastic(1, .75)',
        duration: 450,
      });
    }
  }, [showShortcutsModal]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  return (
    <header className="flex h-20 flex-shrink-0 items-center justify-between px-6 sm:px-8 bg-transparent relative z-20 select-none">
      {/* Left Title: JARVIS AI VOICE ASSISTANT */}
      <div className="flex items-center gap-4">
        <Link to="/dashboard" className="group">
          <h1 className="text-xl font-bold tracking-[0.2em] text-white group-hover:text-electric-cyan transition-colors">
            JARVIS
          </h1>
          <p className="text-[10px] font-semibold tracking-[0.14em] text-[#7E8B9F] uppercase mt-0.5">
            AI VOICE ASSISTANT
          </p>
        </Link>
      </div>

      {/* Center Live Engine Telemetry Pill */}
      <div className="hidden md:flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-[#111622]/80 border border-white/[0.06] backdrop-blur-md shadow-inner">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]" />
        </span>
        <span className="text-[11px] font-medium text-white/70">
          Core Online: <strong className="text-electric-cyan font-semibold">Groq LPU (120B)</strong>
        </span>
      </div>

      {/* Right Actions: Voice Mute Toggle + Options Pill Button */}
      <div className="flex items-center gap-2.5 relative">
        <button
          onClick={toggleMute}
          className={`h-9 px-3 rounded-full border text-xs font-medium flex items-center gap-1.5 transition-all active:scale-95 ${
            isMuted 
              ? 'bg-[#FF453A]/10 border-[#FF453A]/30 text-[#FF453A]' 
              : 'bg-[#151B27] border-white/[0.08] text-white/70 hover:text-white hover:bg-[#1D2536]'
          }`}
          title={isMuted ? 'Voice output muted' : 'Voice output active'}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-electric-cyan" />}
          <span className="hidden sm:inline">{isMuted ? 'Muted' : 'Voice On'}</span>
        </button>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="w-11 h-9 rounded-full bg-[#151B27] border border-white/[0.08] hover:bg-[#1D2536] hover:border-white/[0.15] text-white/70 hover:text-white flex items-center justify-center transition-all active:scale-95 shadow-sm"
          title="System Options"
          aria-label="System Options"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>

        {/* Dropdown Menu with High-Craft Styling */}
        {isMenuOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)} />
            <div 
              ref={menuRef}
              className="absolute right-0 top-11 w-64 rounded-2xl bg-[#121723] border border-white/[0.08] shadow-2xl p-2 z-50 origin-top-right"
            >
              <div className="px-3 py-2.5 border-b border-white/[0.06] mb-1">
                <p className="text-xs font-semibold text-white truncate">{user?.name || 'Workspace User'}</p>
                <p className="text-[11px] text-[#7E8B9F] truncate">{user?.email || 'kunal@jarvis.app'}</p>
              </div>

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  setShowShortcutsModal(true);
                }}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-white/70 hover:text-white hover:bg-white/[0.06] rounded-xl transition-colors text-left"
              >
                <div className="flex items-center gap-2.5">
                  <Keyboard className="w-4 h-4 text-electric-cyan" />
                  <span>Keyboard Shortcuts</span>
                </div>
                <kbd className="text-[10px] text-white/40 bg-white/5 px-1.5 py-0.5 rounded border border-white/10">?</kbd>
              </button>

              <Link
                to="/dashboard/settings"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-white/70 hover:text-white hover:bg-white/[0.06] rounded-xl transition-colors"
              >
                <SettingsIcon className="w-4 h-4 text-electric-cyan" />
                <span>System Preferences</span>
              </Link>

              <div className="flex items-center justify-between px-3 py-2 text-xs font-medium text-white/60">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                  <span>Engine Security</span>
                </div>
                <span className="text-[10px] font-bold text-[#10B981] bg-[#10B981]/15 px-2 py-0.5 rounded-full">TLS v1.3</span>
              </div>

              <div className="my-1 border-t border-white/[0.06]" />

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#FF453A] hover:bg-[#FF453A]/10 rounded-xl transition-colors text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Keyboard Shortcuts Dialog */}
      {showShortcutsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div 
            ref={shortcutsModalRef}
            className="w-full max-w-sm rounded-2xl bg-[#111622] border border-white/[0.1] p-5 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center gap-2">
                <Keyboard className="w-4 h-4 text-electric-cyan" />
                <h3 className="text-sm font-semibold text-white">System Hotkeys</h3>
              </div>
              <button 
                onClick={() => setShowShortcutsModal(false)}
                className="text-xs text-white/40 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <span className="text-xs text-white/80">Toggle Voice Mic Recording</span>
                <kbd className="text-xs font-mono font-semibold bg-[#182030] text-electric-cyan px-2.5 py-1 rounded-lg border border-white/10">Space</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <span className="text-xs text-white/80">Search & Directives</span>
                <kbd className="text-xs font-mono font-semibold bg-[#182030] text-electric-cyan px-2.5 py-1 rounded-lg border border-white/10">/</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <span className="text-xs text-white/80">Close Modal / Cancel</span>
                <kbd className="text-xs font-mono font-semibold bg-[#182030] text-electric-cyan px-2.5 py-1 rounded-lg border border-white/10">Esc</kbd>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
