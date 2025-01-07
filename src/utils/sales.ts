import { Product } from '../db/schema';

export interface SaleItem extends Product {
  quantity: number;
}

export function groupCartItems(items: Product[]): SaleItem[] {
  return items.reduce((acc: SaleItem[], item) => {
    const existingItem = acc.find(i => i.id === item.id);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      acc.push({ ...item, quantity: 1 });
    }
    return acc;
  }, []);
}