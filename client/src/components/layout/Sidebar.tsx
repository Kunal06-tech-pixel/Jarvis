import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { animate, stagger } from 'animejs';
import { Home, CheckSquare, Bell, Calendar, Settings, Disc3, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Tasks & Directives', href: '/dashboard/tasks', icon: CheckSquare },
  { name: 'Reminders & Alerts', href: '/dashboard/reminders', icon: Bell },
  { name: 'Schedule & Events', href: '/dashboard/calendar', icon: Calendar },
  { name: 'System Settings', href: '/dashboard/settings', icon: Settings },
];

export default function Sidebar() {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (navRef.current) {
      animate(navRef.current.children, {
        translateX: [-20, 0],
        opacity: [0, 1],
        delay: stagger(60, { start: 100 }),
        ease: 'outQuad',
        duration: 500,
      });
    }

    if (logoRef.current) {
      animate(logoRef.current, {
        rotate: '1turn',
        duration: 20000,
        ease: 'linear',
        loop: true,
      });
    }
  }, []);

  return (
    <aside className="flex h-full w-[76px] flex-col items-center justify-between py-6 bg-[#0B0E17] border-r border-white/[0.05] relative z-30 select-none">
      {/* Top Aperture / Radar Brand Icon */}
      <div className="flex flex-col items-center">
        <Link 
          to="/dashboard" 
          className="w-11 h-11 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/[0.06] transition-all group"
          title="Jarvis Home"
        >
          <div ref={logoRef} className="relative flex items-center justify-center">
            <Disc3 className="w-6 h-6 text-white/80 group-hover:text-electric-cyan transition-colors" />
            <div className="absolute inset-0 rounded-full bg-electric-cyan/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </Link>
      </div>

      {/* Middle Navigation Icon Rail */}
      <nav ref={navRef} className="flex flex-col items-center gap-2.5 w-full px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              title={item.name}
              className={cn(
                'relative w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200 group',
                isActive
                  ? 'bg-electric-blue/15 text-electric-cyan shadow-[0_0_20px_rgba(37,99,235,0.3)] border border-electric-blue/30'
                  : 'text-white/40 hover:text-white/90 hover:bg-white/[0.05]'
              )}
            >
              <item.icon className={cn('w-4.5 h-4.5 transition-transform duration-200 group-hover:scale-110', isActive && 'text-electric-cyan')} />
              
              {/* Active indicator bar */}
              {isActive && (
                <span className="absolute -left-2 w-1 h-5 rounded-r-full bg-electric-cyan shadow-[0_0_8px_#38BDF8]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile Avatar */}
      <div className="flex flex-col items-center">
        <Link 
          to="/dashboard/settings" 
          className="relative group p-0.5 rounded-full ring-1 ring-white/10 hover:ring-electric-blue/50 transition-all"
          title={user?.name || 'Account'}
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-800 to-slate-700 flex items-center justify-center text-white font-medium text-xs overflow-hidden shadow-inner">
            {user?.name ? (
              <span className="font-semibold text-white/90 uppercase">{user.name.substring(0, 2)}</span>
            ) : (
              <User className="w-4 h-4 text-white/70" />
            )}
          </div>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#10B981] ring-2 ring-[#0B0E17]" />
        </Link>
      </div>
    </aside>
  );
}
