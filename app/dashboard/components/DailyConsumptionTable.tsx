"use client";
import { ArrowUpRight, ArrowDownRight, MoreHorizontal } from 'lucide-react';

export default function DailyConsumptionTable({ products }: { products: any[] }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900">Shift Consumption</h3>
        <button className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
            <tr>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Opening</th>
              <th className="px-6 py-4">Closing</th>
              <th className="px-6 py-4">Consumed</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((item, idx) => (
              <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <span className="font-semibold text-slate-900">{item.productName}</span>
                </td>
                <td className="px-6 py-4 text-slate-500 font-medium">{item.opening}</td>
                <td className="px-6 py-4 text-slate-500 font-medium">{item.closing}</td>
                <td className="px-6 py-4 font-bold text-orange-600">{item.usage}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 w-fit px-2 py-1 rounded-full border border-emerald-100">
                    <ArrowDownRight className="w-3 h-3" />
                    <span>In Range</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
