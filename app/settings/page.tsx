"use client";
import Layout from '../../components/Layout';
import { useAuth } from '@/context/AuthContext';
import { Settings, Users, PlusCircle, Trash2, Mail, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { db } from '@/firebase/config';
import { doc, setDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import toast from 'react-hot-toast';

// Secondary Firebase app for admin tasks (to prevent session logout)
const firebaseConfig = {
  apiKey: "AIzaSyDMSGG7Rui_01qaJO3If2cZmvPECPZvsOs",
  authDomain: "inventory-system-d912e.firebaseapp.com",
  projectId: "inventory-system-d912e",
  storageBucket: "inventory-system-d912e.firebasestorage.app",
  messagingSenderId: "800058118309",
  appId: "1:800058118309:web:f33bdf21f7c4430ba6bd4c",
  measurementId: "G-WPQ9NV102E"
};

const secondaryApp = getApps().find(app => app.name === 'admin_registration') 
  || initializeApp(firebaseConfig, 'admin_registration');
const secondaryAuth = getAuth(secondaryApp);

interface StaffMember {
  id: string;
  email: string;
  role: string;
  name?: string;
}

export default function SettingsPage() {
  const { role } = useAuth();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [staffList, setStaffList] = useState<StaffMember[]>([]);

  // Fetch staff list
  useEffect(() => {
    const q = query(collection(db, 'users'), where('role', '==', 'staff'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const staff: StaffMember[] = [];
      snapshot.forEach((doc) => {
        staff.push({ id: doc.id, ...doc.data() } as StaffMember);
      });
      setStaffList(staff);
    });
    return () => unsubscribe();
  }, []);

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Use secondaryAuth so it doesn't log the current admin out
      const cred = await createUserWithEmailAndPassword(secondaryAuth, email, password);
      await setDoc(doc(db, 'users', cred.user.uid), {
        email: cred.user.email,
        name: name,
        role: 'staff',
      });
      toast.success(`Staff account created for ${name}!`);
      setEmail('');
      setName('');
      setPassword('');
      // Sign out of the secondary instance immediately to keep it clean
      await secondaryAuth.signOut();
    } catch (error: any) {
      toast.error('Error creating staff account: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout adminOnly>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Settings</h1>
          <p className="text-slate-500 text-sm">Manage users and system preferences.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Staff List */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="flex items-center gap-3 p-6 border-b border-slate-100 bg-slate-50/50">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900">Manage Staff</h2>
                <p className="text-xs text-slate-500">{staffList.length} active staff accounts</p>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto max-h-[400px]">
              {staffList.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-slate-400 text-sm italic">No staff accounts created yet.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50/50 sticky top-0">
                    <tr>
                      <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Staff Email</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {staffList.map((staff) => (
                      <tr key={staff.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                              <User className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900">{staff.name || 'Unnamed Staff'}</p>
                              <p className="text-[10px] text-slate-400 font-mono">{staff.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Reset password (TBC)">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Staff Account Creation */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 p-6 border-b border-slate-100 bg-slate-50/50">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900">Create Staff Account</h2>
                <p className="text-xs text-slate-500">Add a new member to the staff role.</p>
              </div>
            </div>
            <form onSubmit={handleCreateStaff} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                <input
                  required
                  type="text"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-orange-500 transition-all text-sm text-slate-900"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                <input
                  required
                  type="email"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-orange-500 transition-all text-sm text-slate-900"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="staff@restaurant.com"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Password</label>
                <input
                  required
                  type="password"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-orange-500 transition-all text-sm text-slate-900"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  minLength={6}
                />
              </div>
              <button
                disabled={loading}
                type="submit"
                className="w-full bg-orange-600 text-white font-bold py-3 rounded-xl hover:bg-orange-700 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 shadow-lg shadow-orange-500/20"
              >
                <PlusCircle className="w-5 h-5" />
                {loading ? 'Registering...' : 'Register Staff Account'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
