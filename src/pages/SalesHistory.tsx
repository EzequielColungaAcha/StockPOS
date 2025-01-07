import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { Sale } from '../db/schema';
import { SalesList } from '../components/sales/SalesList';
import { updateSaleStatus } from '../services/sales';
import { SalesSearch } from '../components/sales/SalesSearch';
import { normalizeString } from '../utils/string';
import { useToast } from '../context/ToastContext';

export function SalesHistory() {
  const { showToast } = useToast();
  const [statusFilter, setStatusFilter] = useState<Sale['status'] | 'all'>(
    'all'
  );
  const [search, setSearch] = useState('');

  // Get clients for displaying client names
  const clients = useLiveQuery(() => db.clients.toArray());

  const sales = useLiveQuery(async () => {
    let query = db.sales.orderBy('createdAt').reverse();

    if (statusFilter !== 'all') {
      query = query.filter((sale) => sale.status === statusFilter);
    }

    const results = await query.toArray();

    if (search) {
      const normalizedSearch = normalizeString(search);
      const isNumericSearch = /^\d+$/.test(search);

      return results.filter((sale) => {
        if (isNumericSearch) {
          const client = clients?.find((c) => c.id === sale.clientId);
          if (client?.dni?.includes(search)) return true;
        }

        const clientName = sale.clientId
          ? clients?.find((c) => c.id === sale.clientId)?.name
          : '';
        if (
          clientName &&
          normalizeString(clientName).includes(normalizedSearch)
        )
          return true;

        return sale.cart.some(
          (product) =>
            normalizeString(product.name).includes(normalizedSearch) ||
            product.barcode.includes(search)
        );
      });
    }

    return results;
  }, [statusFilter, search, clients]);

  const handleUpdateStatus = async (sale: Sale, newStatus: Sale['status']) => {
    try {
      await updateSaleStatus(sale, newStatus);
      showToast(`Sale marked as ${newStatus}`, 'success');
    } catch (error) {
      showToast(`Failed to update sale status: ${error}`, 'error');
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Sales History</h1>
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as Sale['status'] | 'all')
          }
          className='rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
        >
          <option value='all'>All Sales</option>
          <option value='completed'>Completed</option>
          <option value='pending'>Pending</option>
          <option value='canceled'>Canceled</option>
        </select>
      </div>

      <SalesSearch search={search} onSearchChange={setSearch} />

      <SalesList sales={sales || []} onUpdateStatus={handleUpdateStatus} />
    </div>
  );
}
