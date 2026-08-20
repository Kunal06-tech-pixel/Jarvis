import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useAuthStore } from './stores/authStore';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Tasks from './pages/Tasks';
import Reminders from './pages/Reminders';
import Calendar from './pages/Calendar';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import DashboardLayout from './components/layout/DashboardLayout';

import { useEffect } from 'react';
import { initSocket, disconnectSocket } from './services/socket';
import { toast } from 'sonner';
import { BellRing } from 'lucide-react';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const token = useAuthStore((state) => state.token);
  
  useEffect(() => {
    if (isAuthenticated && token) {
      const socket = initSocket(token);

      socket.on('reminder:due', (data: { id: string, title: string, remindAt: string }) => {
        toast.info(`Reminder: ${data.title}`, {
          duration: Infinity,
          icon: <BellRing className="h-5 w-5 text-blue-500 animate-bounce" />,
          action: {
            label: 'Dismiss',
            onClick: () => console.log('Dismissed reminder', data.id)
          }
        });
        
        // Try to play a gentle sound
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(`Reminder: ${data.title}`);
          window.speechSynthesis.speak(utterance);
        }
      });

      return () => {
        disconnectSocket();
      };
    }
  }, [isAuthenticated, token]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0A0D14] font-sans antialiased text-foreground relative overflow-hidden">
        {/* Minimal Dark Ambient Subtle Center Glow */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
          <div className="absolute top-[35%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-electric-blue/[0.07] blur-[150px]" />
          <div className="absolute top-[35%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-electric-cyan/[0.05] blur-[100px]" />
        </div>
        
        <div className="relative z-10 min-h-screen flex flex-col">
          <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="reminders" element={<Reminders />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
        </div>
        <Toaster 
          theme="dark" 
          position="top-center" 
          toastOptions={{
            className: 'minimal-pill text-white font-sans text-xs shadow-2xl',
            descriptionClassName: 'text-white/60 font-sans text-[11px]',
          }}
        />
      </div>
    </Router>
  );
}

export default App;
