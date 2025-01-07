import React from 'react';
import { Sale } from '../../db/schema';
import { formatPrice } from '../../utils/format';
import { format } from 'date-fns';
import { groupCartItems } from '../../utils/sales';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db';

interface SaleTicketProps {
  sale: Sale;
}

export function SaleTicket({ sale }: SaleTicketProps) {
  const company = useLiveQuery(() =>
    db.companies.toArray().then((companies) => companies[0])
  );
  const client = useLiveQuery(() =>
    sale.clientId ? db.clients.get(sale.clientId) : undefined
  );
  const groupedItems = groupCartItems(sale.cart);

  return (
    <div className='p-8 bg-white text-black' style={{ width: '80mm' }}>
      {/* Company Header */}
      <div className='text-center mb-4'>
        {company?.image && (
          <img
            src={company.image}
            alt='Company logo'
            className='h-16 mx-auto mb-2'
          />
        )}
        <h2 className='font-bold text-lg'>{company?.name || 'Company Name'}</h2>
        {company?.cuit && <p className='text-sm'>CUIT: {company.cuit}</p>}
        {company?.address && <p className='text-sm'>{company.address}</p>}
      </div>

      {/* Sale Info */}
      <div className='text-sm mb-4 border-t border-b border-gray-300 py-2'>
        <p>Date: {format(new Date(sale.createdAt), 'dd/MM/yyyy HH:mm')}</p>
        {client && (
          <>
            <p>Client: {client.name}</p>
            {client.dni && <p>DNI: {client.dni}</p>}
          </>
        )}
      </div>

      {/* Payment Method Info */}
      <div className='text-sm mb-4 border-b border-gray-300 pb-2'>
        <p>Payment Method: {sale.paymentDetails?.methodName}</p>
        {sale.paymentDetails?.installment && (
          <p>
            Installments: {sale.paymentDetails.installment.quantity}x of{' '}
            {formatPrice(sale.paymentDetails.installment.amountPerInstallment)}
          </p>
        )}
      </div>

      {/* Items */}
      <div className='mb-4'>
        <table className='w-full text-sm'>
          <thead>
            <tr className='border-b border-gray-300'>
              <th className='text-left py-1'>Item</th>
              <th className='text-right py-1'>Price</th>
            </tr>
          </thead>
          <tbody>
            {groupedItems.map((item, index) => (
              <tr key={index}>
                <td className='py-1'>
                  {item.quantity}x {item.name}
                  <br />
                  <span className='text-xs text-gray-600'>
                    {formatPrice(item.price * (1 + item.percentage / 100))} each
                  </span>
                </td>
                <td className='text-right py-1'>
                  {formatPrice(
                    item.price * (1 + item.percentage / 100) * item.quantity
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Payment Details */}
      <div className='text-sm border-t border-gray-300 pt-2'>
        <div className='flex justify-between'>
          <span>Subtotal:</span>
          <span>{formatPrice(sale.subtotal)}</span>
        </div>
        {sale.paymentDetails && sale.paymentDetails?.charge > 0 && (
          <div className='flex justify-between'>
            <span>
              {sale.paymentDetails.methodName} (+{sale.paymentDetails.charge}%):
            </span>
            <span>
              {formatPrice((sale.subtotal * sale.paymentDetails.charge) / 100)}
            </span>
          </div>
        )}
        {sale.paymentDetails?.installment &&
          sale.paymentDetails?.installment?.charge > 0 && (
            <div className='flex justify-between'>
              <span>
                Installment Charge (+{sale.paymentDetails.installment.charge}%):
              </span>
              <span>
                {formatPrice(
                  (sale.subtotal * sale.paymentDetails.installment.charge) / 100
                )}
              </span>
            </div>
          )}
        {sale.paymentDetails && sale.paymentDetails?.discount > 0 && (
          <div className='flex justify-between'>
            <span>Discount (-{sale.paymentDetails.discount}%):</span>
            <span>
              -
              {formatPrice(
                (sale.subtotal * sale.paymentDetails.discount) / 100
              )}
            </span>
          </div>
        )}
        <div className='flex justify-between font-bold mt-2 pt-2 border-t border-gray-300'>
          <span>Total:</span>
          <span>{formatPrice(sale.total)}</span>
        </div>
      </div>

      {/* Footer */}
      <div className='text-center text-xs mt-6 pt-4 border-t border-gray-300'>
        <p>Thank you for your purchase!</p>
      </div>
    </div>
  );
}
