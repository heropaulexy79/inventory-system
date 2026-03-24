"use client";
import { Bell, User, LogOut, Menu } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { logout } from '@/firebase/auth';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 fixed top-0 right-0 left-0 md:left-64 z-30 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <button className="md:hidden p-2 hover:bg-slate-100 rounded-lg">
          <Menu className="w-6 h-6 text-slate-600" />
        </button>
        <div className="hidden md:block">
          <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Current Branch</h2>
          <p className="font-semibold text-slate-900">Main Street Restaurant</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={handleLogout}
          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors mr-2"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>

        <button className="p-2 text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded-full transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>

        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-900">{user?.email?.split('@')[0] || "User"}</p>
            <p className="text-xs text-slate-500">{user?.email || "Staff"}</p>
          </div>
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
            <User className="w-6 h-6" />
          </div>
        </div>
      </div>
    </header>
  );
}
