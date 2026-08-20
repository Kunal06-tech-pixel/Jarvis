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
import { Lock, Mail, User, ArrowRight, Disc3 } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
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
      toast.success('Account created successfully');
      navigate('/dashboard');
    } catch (error: any) {
      const errData = error.response?.data?.error;
      const msg = typeof errData === 'string' ? errData : errData?.message;
      toast.error(msg || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
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
              Create Account
            </CardTitle>
            <CardDescription className="text-xs text-slate-300 mt-0.5">
              Initialize your personal AI voice productivity core.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 px-6 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3.5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium text-slate-300">Full Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3.5 top-3 h-4 w-4 text-white/40" />
                        <Input 
                          placeholder="Kunal" 
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
                className="w-full bg-electric-blue hover:bg-electric-blue/90 text-white font-semibold text-xs shadow-md transition-all h-9 rounded-xl active:scale-[0.98] gap-2 mt-2 focus-visible:ring-2 focus-visible:ring-electric-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0D14]" 
                disabled={isLoading}
              >
                <span>{isLoading ? 'Creating Core...' : 'Get Started'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="justify-center border-t border-white/[0.06] pt-4 pb-4">
          <p className="text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-electric-cyan hover:text-white transition-colors focus-visible:outline-none focus-visible:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
