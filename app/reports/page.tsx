"use client";
import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { FileText, Share2, Download, ExternalLink, Calendar as CalendarIcon, History, User } from 'lucide-react';
import { generateWhatsAppReport } from '../../lib/consumptionCalculator';
import { db } from '@/firebase/config';
import { collection, query, orderBy, limit, onSnapshot, getDocs } from 'firebase/firestore';
import { Product } from '@/lib/types';

export default function ReportsPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [logs, setLogs] = useState<any[]>([]);
  const [products, setProducts] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch products for mapping IDs to names
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "products"));
      const mapping: Record<string, string> = {};
      querySnapshot.forEach((doc) => {
        mapping[doc.id] = doc.data().name;
      });
      setProducts(mapping);
    };

    fetchProducts();

    // Fetch recent stock entries
    const q = query(collection(db, "stock_entries"), orderBy("timestamp", "desc"), limit(20));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const entries = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLogs(entries);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const formatTimestamp = (ts: any) => {
    if (!ts) return "";
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleString();
  };

  const mockReportData = {
    date: selectedDate,
    consumption: [
      { productName: 'Coca Cola 500ml', usage: 15 },
      { productName: 'Fanta Orange 500ml', usage: 8 },
      { productName: 'Chicken Breast', usage: 12 },
      { productName: 'Long Grain Rice', usage: 5 },
    ],
    lowStock: ['Chicken Breast', 'Mineral Water'],
    electricity: 14.5,
  };

  const handleCopyReport = () => {
    const reportText = generateWhatsAppReport(mockReportData);
    navigator.clipboard.writeText(reportText);
    alert("WhatsApp Report copied to clipboard!");
  };

  return (
    <Layout adminOnly>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Shift Reports</h1>
            <p className="text-slate-500 text-sm">Review performance and share daily summaries.</p>
          </div>
          <div className="flex gap-2">
            <input 
              type="date" 
              className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-orange-500 outline-none"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2">
              <Share2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">WhatsApp Report</h2>
            <p className="text-slate-500 text-sm max-w-xs">
              Generate a formatted text report ready to be sent to the management WhatsApp group.
            </p>
            <button 
              onClick={handleCopyReport}
              className="mt-2 bg-green-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-green-700 transition-all flex items-center gap-2 shadow-lg shadow-green-500/20 active:scale-95"
            >
               Copy Text Report
            </button>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-2">
              <Download className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Download PDF</h2>
            <p className="text-slate-500 text-sm max-w-xs">
              Generate a formal PDF report including electricity consumption charts and inventory audit.
            </p>
            <button className="mt-2 bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95">
              Export to PDF
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
                <History className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Recent Inventory Logs</h2>
                <p className="text-xs text-slate-500">Live feed of staff opening and closing entries.</p>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-12 text-center text-slate-400">Loading logs...</div>
            ) : logs.length === 0 ? (
              <div className="p-12 text-center text-slate-400">No logs found.</div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Staff</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-slate-500 font-mono whitespace-nowrap">{formatTimestamp(log.timestamp)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                          log.type === 'opening' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {log.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-700">{log.staffName}</td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {log.type === 'closing' && log.electricityReading && (
                            <p className="text-[10px] text-blue-600 font-bold mb-1">⚡ Electricity: {log.electricityReading} kWh</p>
                          )}
                          <div className="flex flex-wrap gap-1">
                            {Object.entries(log.quantities || {}).map(([pid, qty]: [any, any]) => (
                                qty > 0 && (
                                  <span key={pid} className="inline-block bg-slate-100 px-2 py-0.5 rounded text-[10px] text-slate-600">
                                    {products[pid] || pid}: <span className="font-bold text-slate-900">{qty}</span>
                                  </span>
                                )
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl overflow-hidden relative">
          <div className="absolute right-0 top-0 opacity-10 translate-x-1/4 -translate-y-1/4">
            <FileText className="w-64 h-64" />
          </div>
          <div className="relative z-10">
            <h3 className="text-sm font-bold text-orange-400 uppercase tracking-widest mb-4">Daily Comparison Tool</h3>
            <p className="text-slate-400 text-sm mb-6">Use the logs above to compare opening and closing stock for usage analysis.</p>
            <div className="bg-slate-800/50 rounded-2xl p-6 font-mono text-xs md:text-sm whitespace-pre-wrap text-slate-300 border border-slate-700">
              {/* This will eventually auto-generate based on logs */}
              Select a log entry to generate a detailed consumption report.
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
