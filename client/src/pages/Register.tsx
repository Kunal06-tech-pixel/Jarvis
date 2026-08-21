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
import { Lock, Mail, User, ArrowRight, Disc3, Eye, EyeOff, ShieldCheck, Sparkles, UserPlus } from 'lucide-react';
import AuthQuantumShowcase from '@/components/auth/AuthQuantumShowcase';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setIsLoading(true);
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const response = await api.post('/auth/register', { ...data, timezone });
      const { user, token } = response.data;
      
      login(user, token);
      toast.success(`Account initialized! Welcome to JARVIS, ${user.name}.`);
      navigate('/dashboard');
    } catch (error: any) {
      const errData = error.response?.data?.error;
      const msg = typeof errData === 'string' ? errData : errData?.message;
      toast.error(msg || 'Registration failed. Please check your information.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#060810] text-slate-100 flex flex-col lg:grid lg:grid-cols-12 relative overflow-hidden select-none">
      {/* LEFT PANE: 3D Interactive Quantum Neural Showcase (Hidden on small mobile, visible on lg) */}
      <div className="hidden lg:block lg:col-span-7 h-full relative">
        <AuthQuantumShowcase />
      </div>

      {/* RIGHT PANE: Ultra-Refined Glassmorphic Registration Form Surface */}
      <div className="flex-1 lg:col-span-5 flex flex-col justify-between p-6 sm:p-10 lg:p-14 relative z-10 overflow-y-auto">
        {/* Ambient Top Glow for Mobile */}
        <div className="lg:hidden absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-electric-cyan/[0.08] blur-[120px] pointer-events-none" />

        {/* Top Mini Header on Right Pane */}
        <div className="flex items-center justify-between pb-6">
          <div className="flex items-center gap-2.5 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-electric-blue/15 border border-electric-blue/30 text-electric-cyan shadow-[0_0_20px_rgba(0,240,255,0.3)]">
              <Disc3 className="h-5 w-5 animate-spin-slow" />
            </div>
            <span className="text-sm font-extrabold tracking-[0.2em] text-white">JARVIS</span>
          </div>

          <div className="ml-auto">
            <span className="text-xs text-slate-400">Already registered? </span>
            <Link
              to="/login"
              className="text-xs font-semibold text-electric-cyan hover:text-white transition-colors underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>

        {/* Form Container Card */}
        <div className="my-auto max-w-md w-full mx-auto space-y-6">
          {/* Header Title */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono text-slate-300">
              <UserPlus className="h-3 w-3 text-electric-cyan" />
              <span>NEW PROTOCOL INITIALIZATION</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Create your account
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Provision a personal AI voice assistant with multi-channel background sync.
            </p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-semibold text-slate-200">Full Name</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 group-focus-within:text-electric-cyan transition-colors" />
                        <Input
                          placeholder="Kunal Das"
                          autoComplete="name"
                          {...field}
                          className="pl-10 h-10 bg-[#0F1422] border-white/[0.1] text-white placeholder:text-slate-500 text-xs rounded-xl focus-visible:ring-2 focus-visible:ring-electric-cyan focus-visible:border-electric-cyan/80 transition-all"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-[11px] text-[#FF453A]" />
                  </FormItem>
                )}
              />

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
                          className="pl-10 h-10 bg-[#0F1422] border-white/[0.1] text-white placeholder:text-slate-500 text-xs rounded-xl focus-visible:ring-2 focus-visible:ring-electric-cyan focus-visible:border-electric-cyan/80 transition-all"
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
                    <FormLabel className="text-xs font-semibold text-slate-200">Password</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 group-focus-within:text-electric-cyan transition-colors" />
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="At least 6 characters"
                          autoComplete="new-password"
                          {...field}
                          className="pl-10 pr-10 h-10 bg-[#0F1422] border-white/[0.1] text-white placeholder:text-slate-500 text-xs rounded-xl focus-visible:ring-2 focus-visible:ring-electric-cyan focus-visible:border-electric-cyan/80 transition-all"
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
                disabled={isLoading}
                className="w-full h-10 bg-gradient-to-r from-electric-blue via-[#2563EB] to-cyan-500 hover:from-electric-blue/90 hover:to-cyan-400 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-2 focus-visible:ring-2 focus-visible:ring-electric-cyan"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Deploying User Keystore...</span>
                  </span>
                ) : (
                  <>
                    <span>Initialize Intelligence Core</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </Form>

          {/* Feature Highlights Grid */}
          <div className="pt-2 grid grid-cols-2 gap-2 text-[11px] text-slate-400">
            <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.05] flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-electric-cyan shrink-0" />
              <span>Voice AI Synthesis</span>
            </div>
            <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.05] flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span>Zero Drift Jobs</span>
            </div>
          </div>
        </div>

        {/* Footer Security Badge */}
        <div className="pt-6 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>ENCRYPTED PROTOCOL</span>
          </div>
          <span>JARVIS AI v2.5</span>
        </div>
      </div>
    </div>
  );
}
