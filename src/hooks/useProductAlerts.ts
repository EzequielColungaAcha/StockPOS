import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';

export function useProductAlerts() {
  const lowStockCount = useLiveQuery(
    () => db.products
      .filter(product => product.stock <= product.threshold)
      .count()
  );

  return { lowStockCount };
}