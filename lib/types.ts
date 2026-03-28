export interface Organization {
  id: string;
  name: string;
  createdAt: any;
}

export interface Restaurant {
  id: string;
  orgId: string;
  name: string;
  address: string;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'staff';
  restaurantId: string;
  orgId: string;
}

export type Category = 'drinks' | 'food' | 'ice_cream' | 'packaging' | 'plates' | 'pie' | 'burger' | 'pizza' | 'other' | 'ingredients';

export interface Product {
  id: string;
  name: string;
  category: Category;
  unit: string; // e.g., 'bottles', 'kg', 'liters'
  minStock: number;
  currentStock: number;
  packSize?: number; // How many units per pack (optional)
  ingredients?: { ingredientId: string; quantity: number }[]; // For dishes
}

export type Shift = 'morning' | 'afternoon' | 'night';

export interface InventoryEntry {
  id: string;
  date: string; // YYYY-MM-DD
  shift: Shift;
  type: 'opening' | 'closing';
  staff: string;
  items: {
    productId: string;
    quantity: number;
  }[];
  timestamp: any;
}

export interface ElectricityLog {
  id: string;
  date: string;
  reading: number;
  unitsConsumed: number;
  timestamp: any;
}

export interface DailyReport {
  id: string;
  date: string;
  consumption: {
    productId: string;
    opening: number;
    closing: number;
    usage: number;
    expectedUsage?: number;
    mismatch?: number;
  }[];
  lowStockItems: string[];
  electricityUsage: number;
  totalSales?: number;
  timestamp: any;
}
