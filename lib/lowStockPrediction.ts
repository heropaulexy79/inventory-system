import { Product } from './types';

export const predictLowStock = (products: Product[], dailyAverage: Record<string, number>) => {
  return products.filter((product) => {
    const avg = dailyAverage[product.id] || 1;
    const daysLeft = product.currentStock / avg;
    return daysLeft <= 3; // Predict if stock will last less than 3 days
  });
};

export const getDaysRemaining = (currentStock: number, avgConsumption: number) => {
  if (avgConsumption <= 0) return Infinity;
  return Math.floor(currentStock / avgConsumption);
};
