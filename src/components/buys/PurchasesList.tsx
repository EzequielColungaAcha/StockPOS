import React from 'react';
import { Purchase } from '../../db/schema';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { formatPrice } from '../../utils/format';
import { format } from 'date-fns';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db';
import { TruncatedText } from '../shared/TruncatedText';

interface PurchasesListProps {
  purchases: Purchase[];
}

export function PurchasesList({ purchases }: PurchasesListProps) {
  const [expandedPurchase, setExpandedPurchase] = React.useState<number | null>(
    null
  );
  const providers = useLiveQuery(() => db.providers.toArray());

  const providerMap = React.useMemo(() => {
    return (
      providers?.reduce((acc, provider) => {
        if (provider.id) acc[provider.id] = provider;
        return acc;
      }, {} as Record<number, (typeof providers)[0]>) || {}
    );
  }, [providers]);

  return (
    <div className='bg-white rounded-lg shadow overflow-hidden'>
      <table className='min-w-full divide-y divide-gray-200'>
        <thead className='bg-gray-50'>
          <tr>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
              Date
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
              Provider
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
              Items
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
              Total
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
              Notes
            </th>
          </tr>
        </thead>
        <tbody className='divide-y divide-gray-200'>
          {purchases.map((purchase) => (
            <React.Fragment key={purchase.id}>
              <tr className='hover:bg-gray-50'>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                  {format(new Date(purchase.createdAt), 'dd/MM/yyyy HH:mm')}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                  {purchase.providerId
                    ? providerMap[purchase.providerId]?.name
                    : '-'}
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <button
                    onClick={() =>
                      setExpandedPurchase(
                        expandedPurchase === purchase.id ? null : purchase.id!
                      )
                    }
                    className='flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800'
                  >
                    {purchase.cart.length} items
                    {expandedPurchase === purchase.id ? (
                      <ChevronUp className='w-4 h-4' />
                    ) : (
                      <ChevronDown className='w-4 h-4' />
                    )}
                  </button>
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                  {formatPrice(purchase.total)}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                  {<TruncatedText text={purchase.notes} maxLength={35} />}
                </td>
              </tr>
              {expandedPurchase === purchase.id && (
                <tr className='bg-gray-50'>
                  <td colSpan={5} className='px-6 py-4'>
                    <div className='grid grid-cols-3 gap-4'>
                      {purchase.cart.map((item, index) => (
                        <div key={index} className='text-sm'>
                          <div className='font-medium'>
                            {item.quantity}x {item.name}
                          </div>
                          <div className='text-gray-500'>
                            Barcode: {item.barcode}
                          </div>
                          <div className='text-gray-500'>
                            Price: {formatPrice(item.price)}
                          </div>
                          <div className='font-medium'>
                            Total: {formatPrice(item.price * item.quantity)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
