"use client";
import dynamic from 'next/dynamic';
import Layout from '@/components/Layout';
import DailyConsumptionTable from './components/DailyConsumptionTable';
import LowStockAlerts from './components/LowStockAlerts';
import { SAMPLE_PRODUCTS, DAILY_CONSUMPTION_DATA, INGREDIENT_USAGE } from '@/lib/sampleData';
import { cn } from '@/lib/utils';
import { 
  TrendingUp, 
  ShoppingBag, 
  Zap, 
  Clock, 
  AlertCircle 
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { getProducts } from '@/firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { Product } from '@/lib/types';

const IngredientUsageChart = dynamic(() => import('./components/IngredientUsageChart'), { 
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-slate-100 animate-pulse rounded-2xl" />
});

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProducts();
        setProducts(data.length > 0 ? data : SAMPLE_PRODUCTS);
      } catch (err) {
        setProducts(SAMPLE_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const lowStock = products.filter(p => p.currentStock <= p.minStock);
  
  return (
    <Layout adminOnly>
      <div className="space-y-8">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Total Products" 
            value="124" 
            change="+4%" 
            icon={ShoppingBag} 
            color="bg-blue-500" 
          />
          <StatCard 
            title="Daily Cons." 
            value="432" 
            change="+12%" 
            icon={TrendingUp} 
            color="bg-orange-500" 
          />
          <StatCard 
            title="Elec. Usage" 
            value="24.5 kWh" 
            change="-2%" 
            icon={Zap} 
            color="bg-yellow-500" 
          />
          <StatCard 
            title="Avg. Shift" 
            value="6.2 hrs" 
            change="Normal" 
            icon={Clock} 
            color="bg-indigo-500" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <DailyConsumptionTable 
              products={products.slice(0, 5).map(p => ({
                productName: p.name,
                opening: p.currentStock + 10,
                closing: p.currentStock,
                usage: 10
              }))} 
            />
            <IngredientUsageChart data={INGREDIENT_USAGE} />
          </div>
          <div className="space-y-6">
            <LowStockAlerts items={lowStock} />
            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-6 rounded-2xl text-white shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 text-blue-200" />
                <h3 className="font-bold">Prediction Engine</h3>
              </div>
              <p className="text-sm text-blue-100 mb-6">
                Based on current consumption trends, <span className="font-bold underline">Chicken Breast</span> will run out in 48 hours.
              </p>
              <button className="w-full bg-white/10 hover:bg-white/20 border border-white/20 py-3 rounded-xl font-bold transition-all">
                Generate PO Suggestion
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function StatCard({ title, value, change, icon: Icon, color }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
          <p className={cn(
            "text-xs mt-2 font-bold",
            change.startsWith('+') ? "text-emerald-500" : change.startsWith('-') ? "text-red-500" : "text-slate-400"
          )}>
            {change} <span className="text-slate-400 font-normal ml-1">vs last week</span>
          </p>
        </div>
        <div className={cn("p-3 rounded-xl text-white", color)}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
