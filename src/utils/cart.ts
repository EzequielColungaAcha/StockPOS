import { Product } from '../db/schema';

export interface GroupedCartItem extends Product {
  quantity: number;
}

export function groupCartItems(items: Product[]): GroupedCartItem[] {
  const groupedItems = items.reduce((acc: Record<string, GroupedCartItem>, item) => {
    const key = item.id?.toString() || '';
    if (!acc[key]) {
      acc[key] = { ...item, quantity: 1 };
    } else {
      acc[key].quantity++;
    }
    return acc;
  }, {});

  return Object.values(groupedItems);
}