"use client";
import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { SAMPLE_PRODUCTS } from '../../lib/sampleData';
import { Package, Plus, Search, Filter } from 'lucide-react';
import { getProducts } from '@/firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { Product } from '@/lib/types';
import { useEffect } from 'react';
import AddProductModal from './components/AddProductModal';

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProducts();
        setProducts(data.length > 0 ? data : SAMPLE_PRODUCTS);
      } catch (err) {
        console.error("Error loading products:", err);
        setProducts(SAMPLE_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, refreshKey]);

  return (
    <Layout adminOnly>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Product Inventory</h1>
            <p className="text-slate-500 text-sm">Manage your restaurant items and stock levels.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-orange-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-orange-700 transition-all shadow-lg shadow-orange-500/20 active:scale-95"
          >
            <Plus className="w-5 h-5" /> Add New Product
          </button>
        </div>

        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search products..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-orange-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="bg-white border border-slate-200 p-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-all">
            <Filter className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Product Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Stock Level</th>
                  <th className="px-6 py-4">Unit</th>
                  <th className="px-6 py-4">Stock Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5 text-slate-400" />
                        </div>
                        <span className="font-semibold text-slate-900">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold px-2 py-1 rounded bg-slate-100 text-slate-600 uppercase">
                        {product.category.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-slate-700">{product.currentStock}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm italic">
                      {product.unit} 
                      {product.packSize && product.packSize > 1 && (
                        <span className="ml-1 text-[10px] text-orange-500 font-bold not-italic">
                          ({product.packSize}/pck)
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {product.currentStock <= product.minStock ? (
                        <div className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-1 rounded-full border border-red-100 w-fit">
                          LOW STOCK
                        </div>
                      ) : (
                        <div className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-1 rounded-full border border-emerald-100 w-fit">
                          HEALTHY
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <AddProductModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => setRefreshKey(prev => prev + 1)}
        />
      </div>
    </Layout>
  );
}
