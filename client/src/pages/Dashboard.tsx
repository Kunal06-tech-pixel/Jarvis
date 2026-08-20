import { useState, useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';
import { api } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Calendar as CalendarIcon, Bell, Activity, Loader2, ChevronDown, ChevronUp, TrendingUp } from 'lucide-react';
import VoiceAssistant from '@/components/VoiceAssistant';
import ProductivityConstellation3D from '@/components/three/ProductivityConstellation3D';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [showTelemetry, setShowTelemetry] = useState(false);
  const telemetryContainerRef = useRef<HTMLDivElement>(null);
  const [stats, setStats] = useState({
    pendingTasks: 0,
    upcomingEvents: 0,
    activeReminders: 0,
    activityChart: [],
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/analytics');
        setStats(res.data.data);
      } catch (error) {
        console.error('Failed to load analytics', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAnalytics();
  }, []);

  useEffect(() => {
    if (showTelemetry && telemetryContainerRef.current) {
      const cards = telemetryContainerRef.current.querySelectorAll('.minimal-card');
      if (cards.length > 0) {
        animate(cards, {
          translateY: [20, 0],
          opacity: [0, 1],
          delay: stagger(80),
          ease: 'outCubic',
          duration: 500,
        });
      }
    }
  }, [showTelemetry, isLoading]);

  return (
    <div className="flex flex-col items-center justify-between min-h-[calc(100vh-8rem)] select-none">
      {/* 1. Main Hero Voice Interface */}
      <div className="w-full flex-1 flex flex-col items-center justify-center">
        <VoiceAssistant />
      </div>

      {/* 2. Collapsible Telemetry & Analytics Footer Pill */}
      <div className="w-full max-w-4xl mt-6 pt-4 border-t border-white/[0.08]">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setShowTelemetry(!showTelemetry)}
            className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-electric-cyan focus-visible:outline-none rounded-lg px-2 py-1"
          >
            <span>System Analytics & 3D Constellation</span>
            {showTelemetry ? <ChevronUp className="w-3.5 h-3.5 text-electric-cyan" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
          </button>

          <div className="flex items-center gap-4 text-xs text-slate-300">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-electric-cyan" />
              {stats.pendingTasks} Pending
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-electric-blue" />
              {stats.upcomingEvents} Events
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              {stats.activeReminders} Reminders
            </span>
          </div>
        </div>

        {/* Expanded Telemetry Cards & Charts */}
        {showTelemetry && (
          <div ref={telemetryContainerRef} className="space-y-6 pb-8">
            {isLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-electric-cyan" />
              </div>
            ) : (
              <>
                {/* Metric Summary Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <Card className="minimal-card p-4 bg-[#10141E] border border-white/[0.08]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-300">Pending Tasks</span>
                      <CheckCircle2 className="w-4 h-4 text-electric-cyan" />
                    </div>
                    <div className="text-2xl font-bold text-white mt-2">
                      {stats.pendingTasks.toString().padStart(2, '0')}
                    </div>
                  </Card>

                  <Card className="minimal-card p-4 bg-[#10141E] border border-white/[0.08]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-300">Scheduled Events</span>
                      <CalendarIcon className="w-4 h-4 text-electric-blue" />
                    </div>
                    <div className="text-2xl font-bold text-white mt-2">
                      {stats.upcomingEvents.toString().padStart(2, '0')}
                    </div>
                  </Card>

                  <Card className="minimal-card p-4 bg-[#10141E] border border-white/[0.08]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-300">Active Reminders</span>
                      <Bell className="w-4 h-4 text-[#FF453A]" />
                    </div>
                    <div className="text-2xl font-bold text-white mt-2">
                      {stats.activeReminders.toString().padStart(2, '0')}
                    </div>
                  </Card>

                  <Card className="minimal-card p-4 bg-[#10141E] border border-white/[0.08]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-300">Neural Engine</span>
                      <Activity className="w-4 h-4 text-[#10B981]" />
                    </div>
                    <div className="text-2xl font-bold text-white mt-2">
                      Groq LPU
                    </div>
                  </Card>
                </div>

                {/* 3D Dynamic Constellation Matrix */}
                <ProductivityConstellation3D 
                  pendingTasks={stats.pendingTasks}
                  upcomingEvents={stats.upcomingEvents}
                  activeReminders={stats.activeReminders}
                />

                {/* 7-Day Velocity Chart */}
                <Card className="minimal-card p-6 bg-[#10141E] border border-white/[0.08]">
                  <CardHeader className="p-0 pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-electric-cyan" />
                        <CardTitle className="text-sm font-semibold text-white">7-Day Task Velocity</CardTitle>
                      </div>
                      <span className="text-xs text-slate-300">Completed directives over the past 7 days</span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 pt-2">
                    <div className="h-[220px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={stats.activityChart}
                          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="minimalDarkBlueGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4}/>
                              <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.0}/>
                            </linearGradient>
                          </defs>
                          <XAxis 
                            dataKey="name" 
                            stroke="rgba(255,255,255,0.4)" 
                            fontSize={11} 
                            tickLine={false} 
                            axisLine={false} 
                          />
                          <YAxis
                            stroke="rgba(255,255,255,0.4)" 
                            fontSize={11} 
                            tickLine={false} 
                            axisLine={false} 
                            allowDecimals={false}
                          />
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#10141E',
                              border: '1px solid rgba(255, 255, 255, 0.1)', 
                              borderRadius: '12px',
                              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.8)',
                              fontSize: '12px',
                              color: '#FFFFFF'
                            }}
                            itemStyle={{ color: '#38BDF8' }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="completed" 
                            stroke="#38BDF8" 
                            strokeWidth={2.5}
                            fillOpacity={1} 
                            fill="url(#minimalDarkBlueGradient)" 
                            name="Tasks Completed"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
