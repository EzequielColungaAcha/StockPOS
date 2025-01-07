import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';

export function useSalesAlerts() {
  const pendingSalesCount = useLiveQuery(
    () => db.sales.where('status').equals('pending').count()
  );

  return { pendingSalesCount };
}