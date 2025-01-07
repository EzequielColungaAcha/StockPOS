import React from 'react';
import { Sale } from '../../db/schema';
import { formatPrice } from '../../utils/format';
import { groupCartItems } from '../../utils/sales';

interface SaleDetailsProps {
  sale: Sale;
}

export function SaleDetails({ sale }: SaleDetailsProps) {
  const groupedItems = groupCartItems(sale.cart);

  return (
    <div className='space-y-4'>
      <div className='space-y-2'>
        <h4 className='font-medium'>Items</h4>
        <div className='grid grid-cols-3 gap-4'>
          {groupedItems.map((item) => (
            <div key={item.id} className='text-sm'>
              <div className='font-medium'>
                {<span className='text-gray-500'>{item.quantity}x</span>}{' '}
                {item.name}
              </div>
              <div className='text-gray-500'>
                Base: {formatPrice(item.price)} (+{item.percentage}%)
              </div>
              <div className='font-medium'>
                Final: {formatPrice(item.price * (1 + item.percentage / 100))}
              </div>
              {item.quantity > 1 && (
                <div className='text-gray-500'>
                  Subtotal:{' '}
                  {formatPrice(
                    item.price * (1 + item.percentage / 100) * item.quantity
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className='border-t pt-2'>
        <h4 className='font-medium mb-2'>Price Breakdown</h4>
        <div className='space-y-1 text-sm'>
          <div className='flex justify-between'>
            <span>Subtotal:</span>
            <span>{formatPrice(sale.subtotal)}</span>
          </div>
          {sale.paymentDetails && sale.paymentDetails?.charge > 0 && (
            <div className='flex justify-between text-red-600'>
              <span>
                {sale.paymentDetails.methodName} Charge (
                {sale.paymentDetails.charge}%):
              </span>
              <span>
                +
                {formatPrice(
                  (sale.subtotal * sale.paymentDetails.charge) / 100
                )}
              </span>
            </div>
          )}
          {sale.paymentDetails?.installment && (
            <div className='flex justify-between text-red-600'>
              <span>
                Installment Charge ({sale.paymentDetails.installment.quantity}x
                +{sale.paymentDetails.installment.charge}%):
              </span>
              <span>
                +
                {formatPrice(
                  (sale.subtotal * sale.paymentDetails.installment.charge) / 100
                )}
              </span>
            </div>
          )}
          {sale.paymentDetails && sale.paymentDetails?.discount > 0 && (
            <div className='flex justify-between text-green-600'>
              <span>Discount ({sale.paymentDetails.discount}%):</span>
              <span>
                -
                {formatPrice(
                  (sale.subtotal * sale.paymentDetails.discount) / 100
                )}
              </span>
            </div>
          )}
          <div className='flex justify-between font-medium pt-1 border-t'>
            <span>Total:</span>
            <div className='flex gap-2 items-center'>
              <span>{formatPrice(sale.total)}</span>
              {sale.paymentDetails?.installment && (
                <span className='text-gray-500 text-xs'>
                  ({sale.paymentDetails.installment.quantity}x of{' '}
                  {formatPrice(
                    sale.paymentDetails.installment.amountPerInstallment
                  )}
                  )
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
