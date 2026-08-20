import { useState, useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';
import { api } from '../services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar as CalendarIcon, Trash2, Plus, Clock, MapPin, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Event {
  id: string;
  title: string;
  description: string | null;
  startTime: string;
  endTime: string;
  location: string | null;
}

export default function Calendar() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [newStartTime, setNewStartTime] = useState('');
  const [newEndTime, setNewEndTime] = useState('');
  const eventListRef = useRef<HTMLDivElement>(null);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/events');
      setEvents(res.data.data);
    } catch (error) {
      toast.error('Failed to load calendar events');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (!isLoading && eventListRef.current && events.length > 0) {
      animate(eventListRef.current.children, {
        translateY: [15, 0],
        opacity: [0, 1],
        delay: stagger(60),
        ease: 'outQuad',
        duration: 400,
      });
    }
  }, [isLoading, events.length]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newStartTime || !newEndTime) return;

    try {
      const res = await api.post('/events', { 
        title: newTitle, 
        startTime: new Date(newStartTime).toISOString(),
        endTime: new Date(newEndTime).toISOString()
      });
      setEvents([...events, res.data.data].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()));
      setNewTitle('');
      setNewStartTime('');
      setNewEndTime('');
      toast.success('Event scheduled');
    } catch (error) {
      toast.error('Failed to schedule event');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/events/${id}`);
      setEvents(events.filter(ev => ev.id !== id));
      toast.success('Event removed');
    } catch (error) {
      toast.error('Failed to delete event');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Schedule & Events
          </h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Synchronized meetings, appointments, and timeline events.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#141A26] border border-white/[0.08] text-xs text-slate-300 shadow-sm">
          <span>Scheduled: <strong className="text-electric-cyan font-semibold">{events.length}</strong></span>
        </div>
      </div>

      {/* Schedule Form */}
      <form onSubmit={handleCreate} className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2.5 p-2 rounded-2xl bg-[#10141E] border border-white/[0.08] shadow-md focus-within:border-electric-blue/50 transition-colors">
        <Input 
          placeholder="Event title (e.g. 'Executive Planning Sync')..." 
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="flex-1 bg-transparent border-0 text-white placeholder:text-white/40 focus-visible:ring-0 text-xs px-3"
        />
        <div className="flex items-center gap-2">
          <Input 
            type="datetime-local" 
            value={newStartTime}
            onChange={(e) => setNewStartTime(e.target.value)}
            className="w-full sm:w-44 bg-[#181F2E] border border-white/[0.08] rounded-xl text-xs text-white focus-visible:ring-2 focus-visible:ring-electric-cyan px-3 h-9"
          />
          <span className="text-xs text-white/30">→</span>
          <Input 
            type="datetime-local" 
            value={newEndTime}
            onChange={(e) => setNewEndTime(e.target.value)}
            className="w-full sm:w-44 bg-[#181F2E] border border-white/[0.08] rounded-xl text-xs text-white focus-visible:ring-2 focus-visible:ring-electric-cyan px-3 h-9"
          />
        </div>
        <Button 
          type="submit" 
          disabled={!newTitle.trim() || !newStartTime || !newEndTime}
          className="bg-electric-blue hover:bg-electric-blue/90 text-white font-semibold text-xs px-4 rounded-xl gap-1.5 shadow-md transition-all active:scale-95 h-9 focus-visible:ring-2 focus-visible:ring-electric-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0D14]"
        >
          <Plus className="h-4 w-4" />
          <span>Add</span>
        </Button>
      </form>

      {/* Events Stream */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-7 w-7 animate-spin text-electric-cyan" />
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border border-dashed border-white/[0.08] bg-[#10141E]/50 p-8 space-y-2">
          <CalendarIcon className="mx-auto h-10 w-10 text-white/20 mb-2" />
          <h3 className="text-sm font-semibold text-white">Timeline Clear</h3>
          <p className="text-xs text-slate-300 max-w-sm mx-auto">
            Say "Hey Jarvis, schedule design sync next Monday at 2 PM" or use the form above to add an event.
          </p>
        </div>
      ) : (
        <div ref={eventListRef} className="space-y-2.5">
          {events.map(ev => (
            <div 
              key={ev.id} 
              className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-[#10141E] border border-white/[0.08] hover:border-white/[0.18] hover:bg-[#141A28] transition-all shadow-sm"
            >
              <div className="space-y-1.5 min-w-0 flex-1 pr-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-electric-cyan" />
                  <span className="font-semibold text-xs text-white tracking-tight truncate">
                    {ev.title}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-300 pl-4">
                  <span className="flex items-center gap-1.5 text-electric-cyan font-medium">
                    <Clock className="h-3 w-3" />
                    {format(new Date(ev.startTime), 'MMM d, yyyy · h:mm a')} – {format(new Date(ev.endTime), 'h:mm a')}
                  </span>
                  {ev.location && (
                    <span className="flex items-center gap-1 text-slate-300">
                      <MapPin className="h-3 w-3 text-white/40" />
                      {ev.location}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="mt-3 sm:mt-0 flex justify-end">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleDelete(ev.id)}
                  aria-label="Delete event"
                  className="h-7 w-7 text-white/40 hover:text-[#FF453A] hover:bg-[#FF453A]/10 rounded-full opacity-0 group-hover:opacity-100 transition-all active:scale-90 focus-visible:opacity-100"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
