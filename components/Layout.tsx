"use client";
import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface LayoutProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export default function Layout({ children, adminOnly = false }: LayoutProps) {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push('/auth/login');
      return;
    }
    // Staff who try to access an admin-only page get redirected
    if (adminOnly && role === 'staff') {
      router.push('/inventory/opening');
    }
  }, [user, role, loading, router, adminOnly]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!user) return null;
  if (adminOnly && role === 'staff') return null; // Prevent flicker before redirect

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <Navbar />
      <main className="md:pl-64 pt-16 min-h-screen transition-all duration-300">
        <div className="p-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
