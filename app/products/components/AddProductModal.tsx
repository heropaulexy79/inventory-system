"use client";
import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { db } from '@/firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import { Category } from '@/lib/types';
import toast from 'react-hot-toast';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddProductModal({ isOpen, onClose, onSuccess }: AddProductModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Category>("food");
  const [unit, setUnit] = useState("");
  const [minStock, setMinStock] = useState(0);
  const [currentStock, setCurrentStock] = useState(0);
  const [packSize, setPackSize] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "products"), {
        name,
        category,
        unit,
        minStock: Number(minStock),
        currentStock: Number(currentStock),
        packSize: Number(packSize),
      });
      toast.success("Product added successfully!");
      onSuccess();
      onClose();
      // Reset form
      setName("");
      setUnit("");
      setMinStock(0);
      setCurrentStock(0);
      setPackSize(1);
    } catch (error: any) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product: " + (error.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">Add New Product</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Product Name</label>
            <input 
              required
              type="text" 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-orange-500 transition-all text-slate-900"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Chicken Breast"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-orange-500 transition-all appearance-none text-slate-900"
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
              >
                <option value="food">Food</option>
                <option value="drinks">Drinks</option>
                <option value="ice_cream">Ice Cream</option>
                <option value="packaging">Packaging/Nylon</option>
                <option value="plates">Plates/Spoons</option>
                <option value="pie">Pie</option>
                <option value="burger">Burger</option>
                <option value="pizza">Pizza</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Base Unit</label>
              <input 
                required
                type="text" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-orange-500 transition-all font-medium text-slate-900"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="pcs, kg, liters"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Pack Size (Units/Pack)</label>
              <input 
                required
                type="number" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-orange-500 transition-all font-bold text-orange-600"
                value={packSize}
                onChange={(e) => setPackSize(Number(e.target.value))}
                min={1}
              />
            </div>
            <div className="space-y-1 opacity-50 cursor-not-allowed">
              <label className="text-xs font-bold text-slate-500 uppercase">Inventory ID</label>
              <div className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-400 flex items-center h-[42px]">
                Auto-generated
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Current Stock</label>
              <input 
                required
                type="number" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-orange-500 transition-all text-slate-900"
                value={currentStock}
                onChange={(e) => setCurrentStock(Number(e.target.value))}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Min. Stock Alert</label>
              <input 
                required
                type="number" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-orange-500 transition-all text-slate-900"
                value={minStock}
                onChange={(e) => setMinStock(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="pt-4">
            <button 
              disabled={loading}
              type="submit"
              className="w-full bg-orange-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-orange-500/20 hover:bg-orange-700 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {loading ? "Adding..." : <><Save className="w-5 h-5" /> Save Product</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
