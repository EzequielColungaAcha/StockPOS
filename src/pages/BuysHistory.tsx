import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { Search } from 'lucide-react';
import { PurchasesList } from '../components/buys/PurchasesList';
import { normalizeString } from '../utils/string';

export function BuysHistory() {
  const [search, setSearch] = useState('');
  const providers = useLiveQuery(() => db.providers.toArray());

  const purchases = useLiveQuery(async () => {
    const query = db.purchases.orderBy('createdAt').reverse();
    const results = await query.toArray();

    if (search) {
      const normalizedSearch = normalizeString(search);
      return results.filter((purchase) => {
        // Search by provider name
        const provider = providers?.find((p) => p.id === purchase.providerId);
        if (
          provider &&
          normalizeString(provider.name).includes(normalizedSearch)
        ) {
          return true;
        }

        // Search by items
        return purchase.cart.some(
          (item) =>
            normalizeString(item.name).includes(normalizedSearch) ||
            item.barcode.includes(search)
        );
      });
    }

    return results;
  }, [search, providers]);

  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold'>Purchase History</h1>

      <div className='relative'>
        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
        <input
          type='text'
          placeholder='Search purchases...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoFocus
          className='w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
      </div>

      <PurchasesList purchases={purchases || []} />
    </div>
  );
}
