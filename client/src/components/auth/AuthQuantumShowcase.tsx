import { useEffect, useState } from 'react';
import { Cpu, ShieldCheck, Zap, Radio, Sparkles, Activity } from 'lucide-react';
import QuantumSphereCanvas from './QuantumSphereCanvas';

export default function AuthQuantumShowcase() {
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);

  const capabilities = [
    {
      title: 'Neural Speech Processing',
      desc: 'Sub-second natural language command parsing & voice synthesis',
      icon: Radio,
      tag: 'GROQ LLAMA-3 CORE',
    },
    {
      title: 'Exact-Time Job Queues',
      desc: 'Sub-100ms BullMQ delayed worker execution with zero drift',
      icon: Zap,
      tag: 'REDIS BULLMQ ENGINE',
    },
    {
      title: 'Multi-Channel Alert Stream',
      desc: 'Simultaneous Web Push, Telegram Bot API, and Socket.IO dispatch',
      icon: Activity,
      tag: 'FALLBACK-RESILIENT PIPELINE',
    },
    {
      title: 'Zero-Trust Keystore',
      desc: 'JWT authenticated sessions with salted bcrypt credentials',
      icon: ShieldCheck,
      tag: 'ENTERPRISE ENCRYPTED',
    },
  ];

  // Rotate capabilities
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveFeatureIndex((prev) => (prev + 1) % capabilities.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [capabilities.length]);

  const ActiveIcon = capabilities[activeFeatureIndex].icon;

  return (
    <div className="relative flex flex-col justify-between h-full p-8 lg:p-12 overflow-hidden select-none bg-gradient-to-br from-[#060913] via-[#090E1B] to-[#04060C] border-r border-white/[0.06]">
      {/* 1. Deep Ambient Lighting Blurs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-electric-cyan/[0.08] blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[420px] h-[420px] rounded-full bg-indigo-600/[0.09] blur-[160px] pointer-events-none" />

      {/* 2. Top Header Brand & Status Pill */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-electric-blue/15 border border-electric-blue/30 text-electric-cyan shadow-[0_0_25px_rgba(0,240,255,0.35)] backdrop-blur-md">
            <Cpu className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold tracking-[0.25em] text-white">JARVIS</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-electric-cyan/15 text-electric-cyan border border-electric-cyan/30">
                v2.5 PRO
              </span>
            </div>
            <p className="text-[11px] font-medium tracking-wider text-slate-400 uppercase">
              Autonomous Voice Intelligence
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#121826]/80 border border-white/[0.08] backdrop-blur-xl shadow-lg">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]" />
          </span>
          <span className="text-[11px] font-mono font-medium text-slate-300">CORE ONLINE</span>
        </div>
      </div>

      {/* 3. Center Interactive 3D Quantum Core Display */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center min-h-[340px] my-4">
        <QuantumSphereCanvas className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />
        
        <div className="relative z-20 pointer-events-none text-center max-w-md mx-auto space-y-2 mt-auto pb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md text-[11px] text-electric-cyan font-mono">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI DIRECTIVE & VOICE ORCHESTRATION</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-tight">
            Master your schedule at the speed of thought.
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
            Say <span className="text-white font-semibold">"Hey Jarvis"</span> to schedule reminders, manage tasks, and trigger real-world alerts across all your devices.
          </p>
        </div>
      </div>

      {/* 4. Bottom Live Capability Carousel & Telemetry Specs */}
      <div className="relative z-10 space-y-4">
        {/* Active Rotating Capability Card */}
        <div className="p-4 rounded-2xl bg-[#0E1320]/85 border border-white/[0.09] backdrop-blur-xl shadow-2xl transition-all duration-500 hover:border-electric-cyan/40">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-electric-cyan/15 border border-electric-cyan/30 text-electric-cyan shadow-sm">
                <ActiveIcon className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-electric-cyan/80 font-bold block">
                  {capabilities[activeFeatureIndex].tag}
                </span>
                <h2 className="text-sm font-bold text-white">
                  {capabilities[activeFeatureIndex].title}
                </h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  {capabilities[activeFeatureIndex].desc}
                </p>
              </div>
            </div>

            {/* Step Indicator dots */}
            <div className="flex items-center gap-1.5 pt-1">
              {capabilities.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveFeatureIndex(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === activeFeatureIndex
                      ? 'w-6 bg-electric-cyan shadow-[0_0_8px_rgba(0,240,255,0.8)]'
                      : 'w-1.5 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Telemetry Metrics Bar */}
        <div className="grid grid-cols-3 gap-3 pt-1 text-center">
          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Response Latency</div>
            <div className="text-xs font-bold font-mono text-emerald-400 mt-0.5">~48ms</div>
          </div>
          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
            <div className="text-[10px] font-mono text-slate-400 uppercase">BullMQ Drift</div>
            <div className="text-xs font-bold font-mono text-electric-cyan mt-0.5">&lt; 0.1s</div>
          </div>
          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Cloud Sync</div>
            <div className="text-xs font-bold font-mono text-purple-400 mt-0.5">Real-Time</div>
          </div>
        </div>
      </div>
    </div>
  );
}
