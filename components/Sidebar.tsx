"use client";
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  ClipboardList, 
  FileText, 
  Settings, 
  ChevronRight,
  PlusCircle,
  MinusCircle
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '@/context/AuthContext';

const allMenuItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, adminOnly: true },
  { name: 'Opening Stock', href: '/inventory/opening', icon: PlusCircle, adminOnly: false },
  { name: 'Closing Stock', href: '/inventory/closing', icon: MinusCircle, adminOnly: false },
  { name: 'Products', href: '/products', icon: Package, adminOnly: true },
  { name: 'Reports', href: '/reports', icon: FileText, adminOnly: true },
  { name: 'Settings', href: '/settings', icon: Settings, adminOnly: true },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { role, loading } = useAuth();

  // Don't render until we know the role — prevents showing staff menu to admin
  const menuItems = loading
    ? []
    : allMenuItems.filter(item => !item.adminOnly || role === 'admin' || role !== 'staff');

  return (
    <aside className="w-64 bg-slate-900 text-white h-screen fixed left-0 top-0 hidden md:flex flex-col border-r border-slate-800">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
          InventoryPro
        </h1>
        <p className="text-slate-400 text-xs mt-1">Restaurant Management</p>
        {role && (
          <span className={cn(
            "inline-block mt-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
            role === 'admin' ? "bg-orange-500/20 text-orange-400 border border-orange-500/30" : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
          )}>
            {role}
          </span>
        )}
      </div>
      
      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <button
              key={item.name}
              onClick={() => router.push(item.href)}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group text-left",
                isActive 
                  ? "bg-orange-500/10 text-orange-500 border border-orange-500/20" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn("w-5 h-5", isActive ? "text-orange-500" : "text-slate-400 group-hover:text-white")} />
                <span className="font-medium">{item.name}</span>
              </div>
              {isActive && <ChevronRight className="w-4 h-4" />}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/50 p-4 rounded-xl">
          <p className="text-xs text-slate-400 mb-2">Shift Status</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-medium">Morning Shift</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
