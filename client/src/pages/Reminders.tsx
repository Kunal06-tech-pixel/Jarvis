import { useState, useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';
import { api } from '../services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Plus, Clock, Loader2, Repeat, BellRing } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Reminder {
  id: string;
  title: string;
  remindAt: string;
  recurrence: string | null;
}

export default function Reminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('');
  const gridRef = useRef<HTMLDivElement>(null);

  const fetchReminders = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/reminders');
      setReminders(res.data.data);
    } catch (error) {
      toast.error('Failed to load reminders');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  useEffect(() => {
    if (!isLoading && gridRef.current && reminders.length > 0) {
      animate(gridRef.current.children, {
        translateY: [15, 0],
        opacity: [0, 1],
        delay: stagger(60),
        ease: 'outQuad',
        duration: 400,
      });
    }
  }, [isLoading, reminders.length]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newTime) return;

    try {
      const res = await api.post('/reminders', { 
        title: newTitle, 
        remindAt: new Date(newTime).toISOString() 
      });
      setReminders([...reminders, res.data.data].sort((a, b) => new Date(a.remindAt).getTime() - new Date(b.remindAt).getTime()));
      setNewTitle('');
      setNewTime('');
      toast.success('Reminder scheduled');
    } catch (error) {
      toast.error('Failed to set reminder');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/reminders/${id}`);
      setReminders(reminders.filter(r => r.id !== id));
      toast.success('Reminder deleted');
    } catch (error) {
      toast.error('Failed to delete reminder');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Reminders & Alerts
          </h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Real-time background notifications delivered via WebSockets and voice synthesis.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#141A26] border border-white/[0.08] text-xs text-slate-300 shadow-sm">
          <span>Scheduled: <strong className="text-white font-semibold">{reminders.length}</strong></span>
        </div>
      </div>

      {/* Create Reminder Form */}
      <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-2.5 p-2 rounded-2xl bg-[#10141E] border border-white/[0.08] shadow-md focus-within:border-electric-blue/50 transition-colors">
        <Input
          placeholder="Reminder title (e.g. 'Team standup and sprint review')..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="flex-1 bg-transparent border-0 text-white placeholder:text-white/40 focus-visible:ring-0 text-xs px-3"
        />

        <Input
          type="datetime-local"
          value={newTime}
          onChange={(e) => setNewTime(e.target.value)}
          className="w-full sm:w-60 bg-[#181F2E] border border-white/[0.08] rounded-xl text-xs text-white focus-visible:ring-2 focus-visible:ring-electric-cyan px-3 h-9"
        />

        <Button
          type="submit"
          className="bg-electric-blue hover:bg-electric-blue/90 text-white text-xs font-semibold px-4 rounded-xl gap-1.5 shadow-md transition-all active:scale-95 h-9 focus-visible:ring-2 focus-visible:ring-electric-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0D14]"
        >
          <Plus className="h-4 w-4" />
          <span>Set Alert</span>
        </Button>
      </form>

      {/* Reminders Grid */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-7 w-7 animate-spin text-electric-cyan" />
        </div>
      ) : reminders.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border border-dashed border-white/[0.08] bg-[#10141E]/50 p-8 space-y-2">
          <BellRing className="mx-auto h-10 w-10 text-white/20 mb-2" />
          <h3 className="text-sm font-semibold text-white">No Active Reminders</h3>
          <p className="text-xs text-slate-300 max-w-sm mx-auto">
            Say "Hey Jarvis, remind me tomorrow at 9 AM to review roadmap" or use the form above to schedule an alert.
          </p>
        </div>
      ) : (
        <div ref={gridRef} className="grid gap-3 sm:grid-cols-2">
          {reminders.map((reminder) => {
            const isPast = new Date(reminder.remindAt) < new Date();
            return (
              <div
                key={reminder.id}
                className="group flex items-center justify-between p-4 rounded-xl bg-[#10141E] border border-white/[0.08] hover:border-white/[0.18] hover:bg-[#141A28] transition-all shadow-sm"
              >
                <div className="space-y-1.5 min-w-0 flex-1 pr-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isPast ? 'bg-white/30' : 'bg-[#FF453A]'}`} />
                    <p className="text-xs font-semibold text-white truncate">
                      {reminder.title}
                    </p>
                  </div>
                  
                  <div className="flex items-center flex-wrap gap-2 text-[11px] text-slate-300 pl-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#FFD60A]" />
                      <span>{format(new Date(reminder.remindAt), 'MMM d, yyyy · h:mm a')}</span>
                    </div>
                    {reminder.recurrence && (
                      <span className="flex items-center gap-1 text-electric-cyan text-[10px] bg-electric-cyan/10 px-2 py-0.5 rounded-full border border-electric-cyan/20">
                        <Repeat className="w-2.5 h-2.5" />
                        {reminder.recurrence}
                      </span>
                    )}
                    {isPast && (
                      <span className="text-[10px] text-white/40 bg-white/5 px-2 py-0.5 rounded-full">
                        Past Due
                      </span>
                    )}
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(reminder.id)}
                  aria-label="Delete reminder"
                  className="h-7 w-7 text-white/40 hover:text-[#FF453A] hover:bg-[#FF453A]/10 rounded-full opacity-0 group-hover:opacity-100 transition-all active:scale-90 focus-visible:opacity-100"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
