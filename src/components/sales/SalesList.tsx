import React, { useState } from 'react';
import { Sale } from '../../db/schema';
import { SaleStatusBadge } from './SaleStatusBadge';
import { SaleDetails } from './SaleDetails';
import { formatPrice } from '../../utils/format';
import { format } from 'date-fns';
import { ChevronDown, ChevronUp, ReceiptText } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db';
import { PrintTicketModal } from './PrintTicketModal';

interface SalesListProps {
  sales: Sale[];
  onUpdateStatus: (
    sale: Sale,
    status: 'completed' | 'pending' | 'canceled'
  ) => void;
}

export function SalesList({ sales, onUpdateStatus }: SalesListProps) {
  const [expandedSale, setExpandedSale] = React.useState<number | null>(null);
  const [ticketSale, setTicketSale] = useState<Sale>();

  // Get clients for displaying client names
  const clients = useLiveQuery(() => db.clients.toArray());
  const clientMap = React.useMemo(() => {
    return (
      clients?.reduce((acc, client) => {
        if (client.id) acc[client.id] = client;
        return acc;
      }, {} as Record<number, (typeof clients)[0]>) || {}
    );
  }, [clients]);

  return (
    <div className='bg-white rounded-lg shadow overflow-hidden'>
      <table className='min-w-full divide-y divide-gray-200'>
        <thead className='bg-gray-50'>
          <tr>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
              Date
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
              Client
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
              Items
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
              Payment
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
              Total
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
              Status
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
              Actions
            </th>
          </tr>
        </thead>
        <tbody className='divide-y divide-gray-200'>
          {sales.map((sale) => (
            <React.Fragment key={sale.id}>
              <tr className='hover:bg-gray-50'>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                  {format(new Date(sale.createdAt), 'dd/MM/yyyy HH:mm')}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                  {sale.clientId ? clientMap[sale.clientId]?.name : '-'}
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <button
                    onClick={() =>
                      setExpandedSale(
                        expandedSale === sale.id ? null : sale.id!
                      )
                    }
                    className='flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800'
                  >
                    {sale.cart.length} items
                    {expandedSale === sale.id ? (
                      <ChevronUp className='w-4 h-4' />
                    ) : (
                      <ChevronDown className='w-4 h-4' />
                    )}
                  </button>
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                  <div>
                    <span className='font-medium'>
                      {sale.paymentDetails?.methodName}
                    </span>
                    {sale.paymentDetails?.installment && (
                      <span className='text-gray-500'>
                        {' '}
                        ({sale.paymentDetails.installment.quantity}x of{' '}
                        {formatPrice(
                          sale.paymentDetails.installment.amountPerInstallment
                        )}
                        )
                      </span>
                    )}
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                  {formatPrice(sale.total)}
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <SaleStatusBadge status={sale.status} />
                </td>
                <td className='flex gap-2 px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                  <select
                    value={sale.status}
                    onChange={(e) =>
                      onUpdateStatus(sale, e.target.value as Sale['status'])
                    }
                    className='rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                  >
                    <option value='completed'>Complete</option>
                    <option value='pending'>Pending</option>
                    <option value='canceled'>Cancel</option>
                  </select>
                  <button
                    onClick={() => setTicketSale(sale)}
                    className='text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50'
                  >
                    <ReceiptText className='w-5 h-5' />
                  </button>
                </td>
              </tr>
              {expandedSale === sale.id && (
                <tr className='bg-gray-50'>
                  <td colSpan={7} className='px-6 py-4'>
                    <SaleDetails sale={sale} />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      {ticketSale && (
        <PrintTicketModal
          sale={ticketSale}
          onClose={() => setTicketSale(undefined)}
        />
      )}
    </div>
  );
}
