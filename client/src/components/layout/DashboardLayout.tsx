import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import SpatialConstellationBackground from '@/components/three/SpatialConstellationBackground';

export default function DashboardLayout() {
  return (
    <div className="relative flex h-screen overflow-hidden bg-transparent">
      {/* Ambient 3D GPU Particle Constellation Background */}
      <SpatialConstellationBackground />

      <Sidebar />
      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mx-auto max-w-7xl h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
