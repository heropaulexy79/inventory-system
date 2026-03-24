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
        try {
          const userDoc = await getDoc(doc(db, 'users', authUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            const fetchedRole = (data.role || 'staff').toString().trim().toLowerCase() as Role;
            setRole(fetchedRole);
            setName(data.name || null);
          } else {
            setRole('staff');
            setName(null);
          }
        } catch (err: any) {
          setRole('staff');
          setName(null);
        }
      } else {
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
