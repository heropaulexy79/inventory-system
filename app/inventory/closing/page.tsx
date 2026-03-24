"use client";
import Layout from '../../../components/Layout';
import ClosingStockForm from './components/ClosingStockForm';
import { SAMPLE_PRODUCTS } from '../../../lib/sampleData';
import { ClipboardX } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getProducts } from '@/firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { Product } from '@/lib/types';

export default function ClosingStockPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProducts();
        setProducts(data.length > 0 ? data : SAMPLE_PRODUCTS);
      } catch (err) {
        setProducts(SAMPLE_PRODUCTS);
      }
    };
    fetchData();
  }, [user]);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-600">
            <ClipboardX className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Shift Closing Entry</h1>
            <p className="text-slate-500 text-sm">Verify remaining stock and log utilities for end of shift.</p>
          </div>
        </div>

        <ClosingStockForm products={products} />
      </div>
    </Layout>
  );
}
