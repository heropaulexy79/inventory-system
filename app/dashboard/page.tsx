"use client";
import dynamic from 'next/dynamic';
import Layout from '@/components/Layout';
import DailyConsumptionTable from './components/DailyConsumptionTable';
import LowStockAlerts from './components/LowStockAlerts';
import { SAMPLE_PRODUCTS, DAILY_CONSUMPTION_DATA } from '@/lib/sampleData';
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
import { db } from '@/firebase/config';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';

const IngredientUsageChart = dynamic(() => import('./components/IngredientUsageChart'), { 
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-slate-100 animate-pulse rounded-2xl" />
});

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    // Real-time products listener
    const unsubscribeProducts = onSnapshot(collection(db, "products"), (snapshot) => {
      const prodData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(prodData);
    });

    // Real-time entries listener (latest 100)
    const qEntries = query(collection(db, "stock_entries"), orderBy("timestamp", "desc"), limit(100));
    const unsubscribeEntries = onSnapshot(qEntries, (snapshot) => {
      const entryData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEntries(entryData);
      setLoading(false);
    });

    return () => {
      unsubscribeProducts();
      unsubscribeEntries();
    };
  }, [user]);

  // CALCULATION LOGIC
  // 1. Total Products
  const totalProducts = products.length;

  // 2. Consumption and latest electricity
  const consumptionData = products.map(product => {
    // Find latest opening for this product
    const latestOpening = entries.find(e => e.type === 'opening' && e.quantities?.[product.id]);
    // Find latest closing for this product
    const latestClosing = entries.find(e => e.type === 'closing' && e.quantities?.[product.id]);

    const openingVal = latestOpening?.quantities?.[product.id]?.total || latestOpening?.quantities?.[product.id] || 0;
    const closingVal = latestClosing?.quantities?.[product.id]?.total || latestClosing?.quantities?.[product.id] || 0;
    const usage = openingVal - closingVal;

    return {
      productName: product.name,
      opening: openingVal,
      closing: closingVal,
      usage: usage > 0 ? usage : 0
    };
  });

  const totalDailyConsumption = consumptionData.reduce((acc, curr) => acc + curr.usage, 0);

  // 3. Latest Electricity
  const latestClosingWithElec = entries.find(e => e.type === 'closing' && e.electricityReading);
  const latestElec = latestClosingWithElec?.electricityReading || 0;

  const lowStock = products.filter(p => p.currentStock <= p.minStock);
  
  if (loading) {
    return (
      <Layout adminOnly>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout adminOnly>
      <div className="space-y-8">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Total Products" 
            value={totalProducts.toString()} 
            change="Live" 
            icon={ShoppingBag} 
            color="bg-blue-500" 
          />
          <StatCard 
            title="Daily Cons." 
            value={totalDailyConsumption.toFixed(1)} 
            change="Today" 
            icon={TrendingUp} 
            color="bg-orange-500" 
          />
          <StatCard 
            title="Elec. Reading" 
            value={`${latestElec} kWh`} 
            change="Latest" 
            icon={Zap} 
            color="bg-yellow-500" 
          />
          <StatCard 
            title="Active Alerts" 
            value={lowStock.length.toString()} 
            change={lowStock.length > 0 ? "Urgent" : "Stable"} 
            icon={AlertCircle} 
            color={lowStock.length > 0 ? "bg-red-500" : "bg-indigo-500"} 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <DailyConsumptionTable 
              products={consumptionData.filter(d => d.usage > 0).slice(0, 10)} 
            />
            <IngredientUsageChart 
              data={consumptionData
                .filter(d => d.usage > 0)
                .sort((a, b) => b.usage - a.usage)
                .slice(0, 5)
                .map(d => ({ name: d.productName, usage: d.usage }))
              } 
            />
          </div>
          <div className="space-y-6">
            <LowStockAlerts items={lowStock} />
            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-6 rounded-2xl text-white shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 text-blue-200" />
                <h3 className="font-bold">Prediction Engine</h3>
              </div>
              <p className="text-sm text-blue-100 mb-6">
                {lowStock.length > 0 ? (
                  <>Based on current trends, <span className="font-bold underline">{lowStock[0].name}</span> is critically low.</>
                ) : (
                  <>Inventory levels are currently within safe operational ranges based on recent logs.</>
                )}
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
