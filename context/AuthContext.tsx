"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { subscribeToAuthChanges } from '@/firebase/auth';
import { db } from '@/firebase/config';
import { doc, getDoc } from 'firebase/firestore';

type Role = 'admin' | 'staff' | null;

interface AuthContextType {
  user: User | null;
  role: Role;
  name: string | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  name: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [name, setName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (authUser) => {
      setUser(authUser);
      if (authUser) {
        console.log("[AuthContext] User authenticated:", authUser.email, authUser.uid);
        try {
          const userRef = doc(db, 'users', authUser.uid);
          const userDoc = await getDoc(userRef);
          
          if (userDoc.exists()) {
            const data = userDoc.data();
            // Strip any surrounding quotes and normalize
            const rawRole = (data.role || 'staff').toString().trim().toLowerCase();
            const fetchedRole = rawRole.replace(/^["'](.+)["']$/, '$1') as Role;
            
            console.log("[AuthContext] Role data found:", data);
            console.log("[AuthContext] Resolved role:", fetchedRole);
            setRole(fetchedRole);
            setName(data.name || null);
          } else {
            console.warn("[AuthContext] No user document found in Firestore for UID:", authUser.uid);
            setRole('staff');
            setName(null);
          }
        } catch (err: any) {
          console.error("[AuthContext] Error fetching user role:", err);
          setRole('staff');
          setName(null);
        }
      } else {
        console.log("[AuthContext] No user session found.");
        setRole(null);
        setName(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, name, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
