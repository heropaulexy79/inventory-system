import { Product, Category } from './types';

export const SAMPLE_PRODUCTS: Product[] = [
  { id: 'coke', name: 'Coca Cola 500ml', category: 'drinks', unit: 'bottles', minStock: 20, currentStock: 44 },
  { id: 'fanta', name: 'Fanta Orange 500ml', category: 'drinks', unit: 'bottles', minStock: 20, currentStock: 71 },
  { id: 'water', name: 'Mineral Water 500ml', category: 'drinks', unit: 'bottles', minStock: 50, currentStock: 120 },
  { id: 'rice', name: 'Long Grain Rice', category: 'ingredients', unit: 'kg', minStock: 10, currentStock: 25 },
  { id: 'flour', name: 'All-Purpose Flour', category: 'ingredients', unit: 'kg', minStock: 5, currentStock: 12 },
  { id: 'chicken', name: 'Chicken Breast', category: 'ingredients', unit: 'kg', minStock: 5, currentStock: 8 },
  { id: 'oil', name: 'Vegetable Oil', category: 'ingredients', unit: 'liters', minStock: 10, currentStock: 15 },
  { id: 'burger_bun', name: 'Burger Buns', category: 'ingredients', unit: 'packs', minStock: 10, currentStock: 24 },
  { id: 'ice_cream_vanilla', name: 'Vanilla Ice Cream', category: 'ice_cream', unit: 'liters', minStock: 2, currentStock: 5 },
  { id: 'box_small', name: 'Small Packaging Box', category: 'packaging', unit: 'pieces', minStock: 100, currentStock: 250 },
];

export const DAILY_CONSUMPTION_DATA = [
  { day: 'Mon', consumption: 45 },
  { day: 'Tue', consumption: 52 },
  { day: 'Wed', consumption: 38 },
  { day: 'Thu', consumption: 65 },
  { day: 'Fri', consumption: 80 },
  { day: 'Sat', consumption: 95 },
  { day: 'Sun', consumption: 70 },
];

export const INGREDIENT_USAGE = [
  { name: 'Rice', usage: 12 },
  { name: 'Flour', usage: 8 },
  { name: 'Chicken', usage: 22 },
  { name: 'Oil', usage: 5 },
];
