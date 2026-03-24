"use client";
import React, { useState } from 'react';
import { Save, User, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { Product } from '../../../../lib/types';
import { db } from '@/firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function ClosingStockForm({ products }: { products: Product[] }) {
  const [staffName, setStaffName] = useState("");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [electricityReading, setElectricityReading] = useState("");

  const [loading, setLoading] = useState(false);

  const handleQuantityChange = (id: string, val: string) => {
    setQuantities({ ...quantities, [id]: Number(val) || 0 });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "stock_entries"), {
        type: "closing",
        staffName,
        quantities,
        electricityReading: Number(electricityReading),
        timestamp: serverTimestamp(),
      });
      alert("Closing Stock and Electricity Log Saved!");
      setQuantities({});
      setStaffName("");
      setElectricityReading("");
    } catch (error: any) {
      console.error("Error saving closing stock:", error);
      alert("Failed to save: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-slate-900 border-l-4 border-red-500 pl-3">Shift Close-out</h2>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-600 flex items-center gap-2">
            <User className="w-4 h-4" /> Final Staff Accountability
          </label>
          <input 
            required
            type="text" 
            placeholder="Enter your name"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-red-500 transition-colors"
            value={staffName}
            onChange={(e) => setStaffName(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-red-50/30">
          <h2 className="text-xl font-bold text-slate-900">Final Count</h2>
          <div className="flex items-center gap-2 text-red-600 animate-pulse">
            <AlertCircle className="w-4 h-4" />
            <span className="text-xs font-bold uppercase">Accuracy Required</span>
          </div>
        </div>
        
        <div className="divide-y divide-slate-100">
          {products.map((product) => (
            <div key={product.id} className="p-5 flex items-center justify-between">
              <div className="flex-1">
                <p className="font-bold text-slate-900">{product.name}</p>
                <p className="text-xs text-slate-400 capitalize">{product.unit}</p>
              </div>
              <input 
                type="number" 
                placeholder="0"
                className="w-24 bg-slate-100 border-none rounded-xl px-4 py-3 text-right font-bold text-slate-900 outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                value={quantities[product.id] || ""}
                onChange={(e) => handleQuantityChange(product.id, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 border-t-4 border-t-yellow-400">
        <h2 className="text-xl font-bold text-slate-900">Utilities Tracking</h2>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-600">Electricity Meter Reading (kWh)</label>
          <input 
            required
            type="number" 
            placeholder="0.00"
            step="0.01"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-yellow-500 transition-colors"
            value={electricityReading}
            onChange={(e) => setElectricityReading(e.target.value)}
          />
        </div>
      </div>

      <button 
        disabled={loading}
        type="submit"
        className="w-full bg-gradient-to-r from-red-600 to-red-800 text-white font-bold py-4 rounded-2xl shadow-lg shadow-red-500/20 hover:shadow-red-500/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
        {loading ? "Submitting..." : "Submit Shift Closing"}
      </button>
    </form>
  );
}
