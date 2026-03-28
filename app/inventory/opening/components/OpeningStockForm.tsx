"use client";
import React, { useState, useMemo } from 'react';
import { Save, User, Clock, ChevronRight, Loader2, Package, Layers } from 'lucide-react';
import { Product, Category } from '../../../../lib/types';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface StockCount {
  packs: number;
  pieces: number;
}

export default function OpeningStockForm({ products }: { products: Product[] }) {
  const { name } = useAuth();
  const [shift, setShift] = useState("morning");
  const [counts, setCounts] = useState<Record<string, StockCount>>({});
  const [loading, setLoading] = useState(false);

  // Group products by category
  const groupedProducts = useMemo(() => {
    const groups: Record<Category, Product[]> = {} as any;
    products.forEach(p => {
      if (!groups[p.category]) groups[p.category] = [];
      groups[p.category].push(p);
    });
    return groups;
  }, [products]);

  const handleCountChange = (productId: string, field: 'packs' | 'pieces', val: string) => {
    const numVal = parseFloat(val) || 0;
    setCounts(prev => ({
      ...prev,
      [productId]: {
        ...(prev[productId] || { packs: 0, pieces: 0 }),
        [field]: numVal
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Calculate total units and store breakdown
      const detailedQuantities: Record<string, any> = {};
      Object.entries(counts).forEach(([pid, count]) => {
        const product = products.find(p => p.id === pid);
        const packs = count.packs || 0;
        const pieces = count.pieces || 0;
        const packSize = product?.packSize || 1;
        
        detailedQuantities[pid] = {
          packs,
          pieces,
          total: (packs * packSize) + pieces
        };
      });

      await addDoc(collection(db, "stock_entries"), {
        quantities: detailedQuantities,
        staffName: name || "Unknown Staff",
        shift,
        timestamp: serverTimestamp(),
      });
      
      alert("Opening Stock Saved Successfully!");
      setCounts({});
    } catch (error: any) {
      console.error("Error saving opening stock:", error);
      alert("Failed to save: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const categoryLabels: Record<Category, string> = {
    drinks: "Drinks & Beverages",
    food: "Food & Ingredients",
    ingredients: "Ingredients",
    ice_cream: "Ice Cream",
    packaging: "Packaging & Nylon",
    plates: "Plates & Cutlery",
    pie: "Pie Production",
    burger: "Burger Production",
    pizza: "Pizza Production",
    other: "Other Items"
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header Info */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-slate-900 border-l-4 border-orange-500 pl-3">Shift Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600 flex items-center gap-2">
              <User className="w-4 h-4 text-orange-500" /> Staff Accountant
            </label>
            <div className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-slate-500 font-bold">
              {name || "Loading name..." }
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600 flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" /> Current Shift
            </label>
            <select 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-orange-500 transition-colors appearance-none"
              value={shift}
              onChange={(e) => setShift(e.target.value)}
            >
              <option value="morning">Morning Shift (Opening)</option>
              <option value="afternoon">Afternoon Shift</option>
              <option value="night">Night Shift</option>
            </select>
          </div>
        </div>
      </div>

      {/* Categorized Product Lists */}
      {Object.entries(groupedProducts).map(([category, catProducts]) => (
        <div key={category} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 uppercase tracking-wider text-xs flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-500" />
              {categoryLabels[category as Category]}
            </h3>
            <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-200">
              {catProducts.length} Items
            </span>
          </div>
          
          <div className="divide-y divide-slate-50">
            {catProducts.map((product) => (
              <div key={product.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:bg-orange-50/10 transition-colors">
                <div className="flex-1">
                  <p className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors">{product.name}</p>
                  <p className="text-[10px] text-slate-400 font-medium">Base Unit: {product.unit} {product.packSize && product.packSize > 1 ? `• ${product.packSize} per pack` : ''}</p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Pack Input (only if packSize > 1) */}
                  {(product.packSize && product.packSize > 1) && (
                    <div className="flex items-center gap-1">
                      <div className="relative">
                        <input 
                          type="number" 
                          placeholder="0"
                          title="Packs"
                          className="w-16 bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-center font-bold text-orange-600 outline-none focus:ring-2 focus:ring-orange-500/20"
                          value={counts[product.id]?.packs || ""}
                          onChange={(e) => handleCountChange(product.id, 'packs', e.target.value)}
                        />
                        <span className="absolute -top-2 left-1 bg-white px-1 text-[8px] font-bold text-slate-400">PACKS</span>
                      </div>
                      <span className="text-slate-300 font-bold">+</span>
                    </div>
                  )}

                  {/* Piece/Unit Input */}
                  <div className="relative">
                    <input 
                      type="number" 
                      step="any"
                      placeholder="0"
                      title="Units/Pieces"
                      className="w-24 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-right font-bold text-slate-900 outline-none focus:ring-2 focus:ring-orange-500/20"
                      value={counts[product.id]?.pieces || ""}
                      onChange={(e) => handleCountChange(product.id, 'pieces', e.target.value)}
                    />
                    <span className="absolute -top-2 left-1 bg-white px-1 text-[8px] font-bold text-slate-400 uppercase">{product.unit}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Submit Button */}
      <div className="sticky bottom-6 pt-4 pb-2 bg-slate-50/80 backdrop-blur-sm -mx-6 px-6">
        <button 
          disabled={loading}
          type="submit"
          className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {loading ? "Saving Records..." : "Save Opening Stock Records"}
        </button>
      </div>
    </form>
  );
}
