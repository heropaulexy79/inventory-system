"use client";
import React, { useState } from 'react';
import { Save, User, Clock, ChevronRight, Loader2 } from 'lucide-react';
import { Product } from '../../../../lib/types';
import { db } from '@/firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function OpeningStockForm({ products }: { products: Product[] }) {
  const [staffName, setStaffName] = useState("");
  const [shift, setShift] = useState("morning");
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const [loading, setLoading] = useState(false);

  const handleQuantityChange = (id: string, val: string) => {
    setQuantities({ ...quantities, [id]: Number(val) || 0 });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "stock_entries"), {
        type: "opening",
        staffName,
        shift,
        quantities,
        timestamp: serverTimestamp(),
      });
      alert("Opening Stock Saved Successfully!");
      setQuantities({});
      setStaffName("");
    } catch (error: any) {
      console.error("Error saving opening stock:", error);
      alert("Failed to save: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-slate-900 border-l-4 border-orange-500 pl-3">Shift Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600 flex items-center gap-2">
              <User className="w-4 h-4" /> Staff Name
            </label>
            <input 
              required
              type="text" 
              placeholder="Enter your name"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-orange-500 transition-colors"
              value={staffName}
              onChange={(e) => setStaffName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Shift
            </label>
            <select 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-orange-500 transition-colors appearance-none"
              value={shift}
              onChange={(e) => setShift(e.target.value)}
            >
              <option value="morning">Morning (Shift Start)</option>
              <option value="afternoon">Afternoon</option>
              <option value="night">Night</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-orange-50/30">
          <h2 className="text-xl font-bold text-slate-900">Product Count</h2>
          <span className="text-xs text-orange-600 font-bold bg-orange-100 px-3 py-1 rounded-full uppercase tracking-tighter">
            Total {products.length} Products
          </span>
        </div>
        
        <div className="divide-y divide-slate-100">
          {products.map((product) => (
            <div key={product.id} className="p-5 flex items-center justify-between group hover:bg-slate-50 transition-colors">
              <div className="flex-1">
                <p className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors">{product.name}</p>
                <p className="text-xs text-slate-400 capitalize">{product.category.replace('_', ' ')} • {product.unit}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <input 
                    type="number" 
                    placeholder="0"
                    className="w-24 bg-slate-100 border-none rounded-xl px-4 py-3 text-right font-bold text-slate-900 outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                    value={quantities[product.id] || ""}
                    onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                  />
                  <div className="absolute right-0 top-0 bottom-0 pointer-events-none pr-3 flex items-center opacity-30">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button 
        disabled={loading}
        type="submit"
        className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
        {loading ? "Saving..." : "Save Opening Stock"}
      </button>
    </form>
  );
}
