"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function RootPage() {
  const router = useRouter();
  const { user, role, loading } = useAuth();

  useEffect(() => {
    console.log("[RootPage] Auth state changed:", { loading, user: user?.email, role });
    if (loading) return;
    if (!user) {
      console.log("[RootPage] No user, redirecting to login.");
      router.push('/auth/login');
      return;
    }
    // Wait until role is resolved from Firestore before redirecting
    if (role === null) {
      console.log("[RootPage] User authenticated but role still null, waiting...");
      return;
    }

    if (role === 'admin') {
      console.log("[RootPage] Role is admin, redirecting to dashboard.");
      router.push('/dashboard');
    } else {
      console.log("[RootPage] Role is not admin (" + role + "), redirecting to opening stock.");
      router.push('/inventory/opening');
    }
  }, [user, role, loading, router]);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
