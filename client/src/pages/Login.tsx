import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuthStore } from '../stores/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { Lock, Mail, ArrowRight, Disc3, Eye, EyeOff, Sparkles, ShieldCheck, KeyRound } from 'lucide-react';
import AuthQuantumShowcase from '@/components/auth/AuthQuantumShowcase';
import QuantumSphereCanvas from '@/components/auth/QuantumSphereCanvas';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isDemoSigningIn, setIsDemoSigningIn] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsLoading(true);
      const response = await api.post('/auth/login', data);
      const { user, token } = response.data;
      
      login(user, token);
      toast.success(`Welcome back, ${user.name || 'Commander'}!`);
      navigate('/dashboard');
    } catch (error: any) {
      const errData = error.response?.data?.error;
      const msg = typeof errData === 'string' ? errData : errData?.message;
      toast.error(msg || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInstantDemoLogin = async () => {
    form.setValue('email', 'demo@jarvis.app');
    form.setValue('password', 'demo1234');
    
    setIsDemoSigningIn(true);
    try {
      const response = await api.post('/auth/login', {
        email: 'demo@jarvis.app',
        password: 'demo1234',
      });
      const { user, token } = response.data;
      login(user, token);
      toast.success('Instant Demo Access granted!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error('Could not authenticate demo user. Please try standard sign-in.');
    } finally {
      setIsDemoSigningIn(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#060810] text-slate-100 flex flex-col lg:grid lg:grid-cols-12 relative overflow-hidden select-none">
      {/* MOBILE / TABLET 3D QUANTUM SPHERE BACKDROP (Visible on < lg screens) */}
      <div className="lg:hidden fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Ambient Center Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-electric-cyan/[0.12] blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full bg-indigo-600/[0.14] blur-[130px]" />
        {/* Full Viewport 3D Quantum Sphere */}
        <QuantumSphereCanvas className="w-full h-full opacity-85" cameraDistance={13.5} />
      </div>

      {/* DESKTOP LEFT PANE: Full Interactive 3D Showcase */}
      <div className="hidden lg:block lg:col-span-7 h-full relative z-10">
        <AuthQuantumShowcase />
      </div>

      {/* RIGHT PANE: Ultra-Refined Glassmorphic Auth Form Surface */}
      <div className="flex-1 lg:col-span-5 flex flex-col justify-between p-4 sm:p-8 lg:p-14 relative z-10 overflow-y-auto min-h-screen">
        {/* Top Mini Header on Right Pane */}
        <div className="flex items-center justify-between pb-4 sm:pb-6">
          <div className="flex items-center gap-2.5 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-electric-blue/20 border border-electric-blue/40 text-electric-cyan shadow-[0_0_20px_rgba(0,240,255,0.4)] backdrop-blur-md">
              <Disc3 className="h-5 w-5 animate-spin-slow" />
            </div>
            <span className="text-sm font-extrabold tracking-[0.2em] text-white">JARVIS</span>
          </div>

          <div className="ml-auto">
            <span className="text-xs text-slate-300">Need an account? </span>
            <Link
              to="/register"
              className="text-xs font-semibold text-electric-cyan hover:text-white transition-colors underline-offset-4 hover:underline"
            >
              Sign up
            </Link>
          </div>
        </div>

        {/* Form Container Card - Frosted Glass on Mobile, Clean Split on Desktop */}
        <div className="my-auto max-w-md w-full mx-auto space-y-6 p-6 sm:p-8 rounded-3xl bg-[#090D18]/75 lg:bg-transparent backdrop-blur-2xl lg:backdrop-blur-none border border-white/[0.12] lg:border-none shadow-[0_20px_70px_rgba(0,0,0,0.85)] lg:shadow-none transition-all">
          {/* Header Title */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.06] border border-white/[0.1] text-[11px] font-mono text-slate-300 backdrop-blur-md">
              <KeyRound className="h-3 w-3 text-electric-cyan" />
              <span>SECURE ACCESS PORTAL</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">
              Welcome back
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Enter your credentials to link into your JARVIS intelligence core.
            </p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-semibold text-slate-200">Email Address</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 group-focus-within:text-electric-cyan transition-colors" />
                        <Input
                          placeholder="kunal@jarvis.app"
                          autoComplete="email"
                          {...field}
                          className="pl-10 h-10 bg-[#0F1422]/90 border-white/[0.12] text-white placeholder:text-slate-500 text-xs rounded-xl focus-visible:ring-2 focus-visible:ring-electric-cyan focus-visible:border-electric-cyan/80 transition-all backdrop-blur-md"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-[11px] text-[#FF453A]" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-xs font-semibold text-slate-200">Password</FormLabel>
                    </div>
                    <FormControl>
                      <div className="relative group">
                        <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 group-focus-within:text-electric-cyan transition-colors" />
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          autoComplete="current-password"
                          {...field}
                          className="pl-10 pr-10 h-10 bg-[#0F1422]/90 border-white/[0.12] text-white placeholder:text-slate-500 text-xs rounded-xl focus-visible:ring-2 focus-visible:ring-electric-cyan focus-visible:border-electric-cyan/80 transition-all backdrop-blur-md"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-slate-400 hover:text-white transition-colors focus:outline-none"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-[11px] text-[#FF453A]" />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading || isDemoSigningIn}
                className="w-full h-10 bg-gradient-to-r from-electric-blue via-[#2563EB] to-cyan-500 hover:from-electric-blue/90 hover:to-cyan-400 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-2 focus-visible:ring-2 focus-visible:ring-electric-cyan"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Authorizing Keystore...</span>
                  </span>
                ) : (
                  <>
                    <span>Sign In to Core</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </Form>

          {/* Divider */}
          <div className="relative flex items-center justify-center py-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.08]" />
            </div>
            <div className="relative px-3 bg-[#090D18]/90 lg:bg-[#060810] text-[10px] uppercase font-mono tracking-widest text-slate-400 rounded-full">
              OR EXPLORE INSTANTLY
            </div>
          </div>

          {/* 1-Click Instant Demo Access Button */}
          <button
            type="button"
            onClick={handleInstantDemoLogin}
            disabled={isDemoSigningIn || isLoading}
            className="w-full p-3 rounded-xl bg-[#0F1424]/90 hover:bg-[#151C30] border border-white/[0.1] hover:border-electric-cyan/40 transition-all flex items-center justify-between text-left group shadow-sm focus:outline-none focus:ring-2 focus:ring-electric-cyan backdrop-blur-md"
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-electric-cyan/15 border border-electric-cyan/30 flex items-center justify-center text-electric-cyan group-hover:scale-105 transition-transform">
                <Sparkles className="h-4 w-4 animate-pulse" />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-electric-cyan transition-colors flex items-center gap-1.5">
                  1-Click Instant Demo
                  <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/10 text-slate-300">
                    No Setup
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Preloads <code>demo@jarvis.app</code> with active reminders
                </div>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-electric-cyan group-hover:translate-x-0.5 transition-all" />
          </button>
        </div>

        {/* Footer Security Badge */}
        <div className="pt-4 sm:pt-6 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>256-BIT SSL ENCRYPTED</span>
          </div>
          <span>JARVIS PROTOCOL</span>
        </div>
      </div>
    </div>
  );
}
