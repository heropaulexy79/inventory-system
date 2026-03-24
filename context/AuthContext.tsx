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
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (authUser) => {
      setUser(authUser);
      if (authUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', authUser.uid));
          console.log('[AuthContext] User UID:', authUser.uid);
          console.log('[AuthContext] Document exists:', userDoc.exists());
          if (userDoc.exists()) {
            const data = userDoc.data();
            const fetchedRole = (data.role || 'staff').toString().trim() as Role;
            setRole(fetchedRole);
          } else {
            setRole('staff');
          }
        } catch (err: any) {
          setRole('staff');
        }
      } else {
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
