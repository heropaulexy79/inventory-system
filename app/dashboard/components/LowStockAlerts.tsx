"use client";
import { AlertTriangle, ChevronRight } from 'lucide-react';
import { Product } from '../../../lib/types';

export default function LowStockAlerts({ items }: { items: Product[] }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-red-50/30">
        <div className="flex items-center gap-2 text-red-600">
          <AlertTriangle className="w-5 h-5" />
          <h3 className="font-bold">Low Stock Alerts</h3>
        </div>
        <span className="bg-red-100 text-red-600 text-xs font-bold px-2.5 py-1 rounded-full">
          {items.length} Items
        </span>
      </div>
      
      <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
        {items.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            All stock levels are healthy
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                  {item.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 group-hover:text-red-600 transition-colors">{item.name}</p>
                  <p className="text-xs text-slate-500">{item.currentStock} {item.unit} remaining</p>
                </div>
              </div>
              <div className="text-right flex items-center gap-3">
                <div>
                  <p className="text-xs text-slate-400">Min: {item.minStock}</p>
                  <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                    <div 
                      className="bg-red-500 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${(item.currentStock / item.minStock) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500" />
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="p-4 bg-slate-50 text-center">
        <button className="text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors underline decoration-2 underline-offset-4">
          View full inventory report
        </button>
      </div>
    </div>
  );
}
