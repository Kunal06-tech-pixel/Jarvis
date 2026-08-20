import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuthStore } from '../stores/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { Lock, Mail, ArrowRight, Disc3 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
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
      toast.success('Signed in successfully');
      navigate('/dashboard');
    } catch (error: any) {
      const errData = error.response?.data?.error;
      const msg = typeof errData === 'string' ? errData : errData?.message;
      toast.error(msg || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    form.setValue('email', 'demo@jarvis.app');
    form.setValue('password', 'demo1234');
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-4 bg-[#0A0D14] relative select-none">
      {/* Ambient subtle center glow */}
      <div className="absolute w-96 h-96 rounded-full bg-electric-blue/[0.08] blur-[120px] pointer-events-none" />

      <Card className="w-full max-w-md minimal-card relative z-10 p-2 bg-[#10141E]/95 border border-white/[0.08] backdrop-blur-xl">
        <CardHeader className="space-y-3 text-center pb-4 pt-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-electric-blue/15 border border-electric-blue/30 text-electric-cyan shadow-[0_0_20px_rgba(37,99,235,0.4)]">
            <Disc3 className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xs font-bold tracking-[0.2em] text-white/50 uppercase">JARVIS AI</h2>
            <CardTitle className="text-xl font-bold tracking-tight text-white mt-1">
              Sign In to Workspace
            </CardTitle>
            <CardDescription className="text-xs text-slate-300 mt-0.5">
              Enter your credentials to access your voice intelligence core.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 px-6 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3.5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium text-slate-300">Email Address</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3 h-4 w-4 text-white/40" />
                        <Input 
                          placeholder="kunal@jarvis.app" 
                          {...field} 
                          className="pl-10 bg-[#181F2E] border-white/[0.08] text-white text-xs rounded-xl focus-visible:ring-2 focus-visible:ring-electric-cyan h-9" 
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
                  <FormItem>
                    <FormLabel className="text-xs font-medium text-slate-300">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-3 h-4 w-4 text-white/40" />
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          {...field} 
                          className="pl-10 bg-[#181F2E] border-white/[0.08] text-white text-xs rounded-xl focus-visible:ring-2 focus-visible:ring-electric-cyan h-9" 
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-[11px] text-[#FF453A]" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-electric-blue hover:bg-electric-blue/90 text-white font-semibold text-xs py-2 rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 h-9 mt-2 focus-visible:ring-2 focus-visible:ring-electric-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0D14]"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Authenticating...
                  </span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </Button>
            </form>
          </Form>

          {/* Quick Demo Login Preset Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full text-center text-xs text-electric-cyan hover:text-white transition-colors py-1 focus-visible:outline-none focus-visible:underline"
            >
              Fill Demo Credentials
            </button>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center border-t border-white/[0.06] pt-4 pb-4">
          <p className="text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-electric-cyan font-semibold hover:text-white transition-colors focus-visible:outline-none focus-visible:underline">
              Create one
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
