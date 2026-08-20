import { useState, useEffect, useRef, useMemo } from 'react';
import { animate, stagger } from 'animejs';
import { api } from '../services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle2, Circle, Trash2, Plus, Clock, Loader2, ListTodo } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate: string | null;
  tags: string[];
  createdAt: string;
}

type FilterTab = 'ALL' | 'ACTIVE' | 'COMPLETED' | 'URGENT';

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newPriority, setNewPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('MEDIUM');
  const [activeTab, setActiveTab] = useState<FilterTab>('ALL');
  const taskListRef = useRef<HTMLDivElement>(null);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/tasks');
      setTasks(res.data.data);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (activeTab === 'ACTIVE') return task.status !== 'COMPLETED';
      if (activeTab === 'COMPLETED') return task.status === 'COMPLETED';
      if (activeTab === 'URGENT') return task.priority === 'URGENT' || task.priority === 'HIGH';
      return true;
    });
  }, [tasks, activeTab]);

  useEffect(() => {
    if (!isLoading && taskListRef.current && filteredTasks.length > 0) {
      animate(taskListRef.current.children, {
        translateY: [15, 0],
        opacity: [0, 1],
        delay: stagger(40),
        ease: 'outQuad',
        duration: 350,
      });
    }
  }, [isLoading, filteredTasks.length, activeTab]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const res = await api.post('/tasks', { 
        title: newTaskTitle, 
        status: 'TODO', 
        priority: newPriority 
      });
      setTasks([res.data.data, ...tasks]);
      setNewTaskTitle('');
      toast.success('Task directive created');
    } catch (error) {
      toast.error('Failed to create task');
    }
  };

  const handleToggleStatus = async (task: Task) => {
    const newStatus = task.status === 'COMPLETED' ? 'TODO' : 'COMPLETED';
    setTasks(tasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t));

    try {
      await api.patch(`/tasks/${task.id}`, { status: newStatus });
      toast.success(newStatus === 'COMPLETED' ? 'Task completed' : 'Task restored');
    } catch (error) {
      toast.error('Failed to update task');
      fetchTasks();
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(t => t.id !== id));
      toast.success('Task removed');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-[#FF453A]/15 text-[#FF453A] border-[#FF453A]/30';
      case 'HIGH':
        return 'bg-[#FFD60A]/15 text-[#FFD60A] border-[#FFD60A]/30';
      case 'MEDIUM':
        return 'bg-electric-blue/15 text-electric-cyan border-electric-blue/30';
      default:
        return 'bg-white/5 text-white/50 border-white/10';
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Directives & Tasks
          </h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Organize, prioritize, and track all voice and written tasks.
          </p>
        </div>

        {/* Task Counter Metrics */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#141A26] border border-white/[0.08] text-xs text-slate-300 shadow-sm">
          <span>Total: <strong className="text-white">{tasks.length}</strong></span>
          <span className="text-white/20">•</span>
          <span>Pending: <strong className="text-electric-cyan font-semibold">{tasks.filter(t => t.status !== 'COMPLETED').length}</strong></span>
        </div>
      </div>

      {/* Add Task Bar */}
      <form onSubmit={handleCreateTask} className="flex flex-col sm:flex-row gap-2.5 p-2 rounded-2xl bg-[#10141E] border border-white/[0.08] shadow-md focus-within:border-electric-blue/50 transition-colors">
        <Input
          placeholder="Add a new directive (e.g. 'Review quarterly roadmap')..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          className="flex-1 bg-transparent border-0 text-white placeholder:text-white/40 focus-visible:ring-0 text-xs px-3"
        />

        <select
          value={newPriority}
          onChange={(e) => setNewPriority(e.target.value as any)}
          aria-label="Task Priority"
          className="bg-[#181F2E] border border-white/[0.08] rounded-xl px-3 py-1.5 text-xs text-white/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-electric-cyan"
        >
          <option value="LOW" className="bg-[#10141E] text-white">Low Priority</option>
          <option value="MEDIUM" className="bg-[#10141E] text-white">Medium Priority</option>
          <option value="HIGH" className="bg-[#10141E] text-white">High Priority</option>
          <option value="URGENT" className="bg-[#10141E] text-white">Urgent</option>
        </select>

        <Button
          type="submit"
          className="bg-electric-blue hover:bg-electric-blue/90 text-white text-xs font-semibold px-4 rounded-xl gap-1.5 shadow-md transition-all active:scale-95 h-9 focus-visible:ring-2 focus-visible:ring-electric-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0D14]"
        >
          <Plus className="h-4 w-4" />
          <span>Add</span>
        </Button>
      </form>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {(['ALL', 'ACTIVE', 'COMPLETED', 'URGENT'] as FilterTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-3.5 py-1.5 rounded-full text-xs font-medium transition-all focus-visible:ring-2 focus-visible:ring-electric-cyan focus-visible:outline-none",
              activeTab === tab
                ? "bg-white text-black font-semibold shadow-sm"
                : "bg-[#141A26] text-slate-300 hover:text-white hover:bg-[#1A2234] border border-white/[0.06]"
            )}
          >
            {tab === 'ALL' && 'All Directives'}
            {tab === 'ACTIVE' && `Active (${tasks.filter(t => t.status !== 'COMPLETED').length})`}
            {tab === 'COMPLETED' && `Completed (${tasks.filter(t => t.status === 'COMPLETED').length})`}
            {tab === 'URGENT' && `Priority Focus (${tasks.filter(t => t.priority === 'URGENT' || t.priority === 'HIGH').length})`}
          </button>
        ))}
      </div>

      {/* Task List */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-7 w-7 animate-spin text-electric-cyan" />
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border border-dashed border-white/[0.08] bg-[#10141E]/50 p-8 space-y-2">
          <ListTodo className="mx-auto h-10 w-10 text-white/20 mb-2" />
          <h3 className="text-sm font-semibold text-white">
            {activeTab === 'ALL' ? 'No Active Directives' : 'No tasks matching filter'}
          </h3>
          <p className="text-xs text-slate-300 max-w-sm mx-auto">
            {activeTab === 'ALL' 
              ? 'Say "Hey Jarvis, add task: Review Q3 roadmap" or use the input above to create your first directive.' 
              : 'Try selecting another tab to view other tasks.'}
          </p>
        </div>
      ) : (
        <div ref={taskListRef} className="space-y-2">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className={cn(
                "group flex items-center justify-between p-3.5 rounded-xl transition-all duration-200 border",
                task.status === 'COMPLETED'
                  ? "bg-[#10141E]/40 border-white/[0.04] opacity-60"
                  : "bg-[#10141E] border-white/[0.08] hover:border-white/[0.18] hover:bg-[#141A28]"
              )}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0 pr-4">
                <button
                  onClick={() => handleToggleStatus(task)}
                  aria-label={task.status === 'COMPLETED' ? 'Mark Incomplete' : 'Mark Complete'}
                  className={cn(
                    "flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-all focus-visible:ring-2 focus-visible:ring-electric-cyan focus-visible:outline-none",
                    task.status === 'COMPLETED'
                      ? "bg-electric-blue text-white shadow-[0_0_8px_rgba(37,99,235,0.6)]"
                      : "border border-white/20 hover:border-electric-cyan bg-[#171D2C]"
                  )}
                >
                  {task.status === 'COMPLETED' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 fill-current" />
                  ) : (
                    <Circle className="w-3.5 h-3.5 text-transparent" />
                  )}
                </button>

                <div className="min-w-0 flex-1">
                  <p className={cn(
                    "text-xs font-medium transition-all truncate",
                    task.status === 'COMPLETED' ? "line-through text-white/40" : "text-white/95"
                  )}>
                    {task.title}
                  </p>
                  
                  {task.dueDate && (
                    <div className="flex items-center gap-1 text-[10px] text-slate-300 mt-0.5">
                      <Clock className="w-3 h-3 text-electric-cyan" />
                      <span>Due: {format(new Date(task.dueDate), 'MMM d, h:mm a')}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full border", getPriorityBadge(task.priority))}>
                  {task.priority}
                </span>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteTask(task.id)}
                  aria-label="Delete task"
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
