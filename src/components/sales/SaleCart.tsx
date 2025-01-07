import React from 'react';
import { Product, PaymentMethod, Installment } from '../../db/schema';
import { Trash2 } from 'lucide-react';
import { calculateFinalPrice } from '../../utils/pricing';
import { groupCartItems } from '../../utils/cart';

interface SaleCartProps {
  items: Product[];
  paymentMethod?: PaymentMethod;
  installment?: Installment;
  onRemoveItem: (index: number) => void;
  onCompleteSale: (status: 'completed' | 'pending') => void;
}

export function SaleCart({
  items,
  paymentMethod,
  installment,
  onRemoveItem,
  onCompleteSale,
}: SaleCartProps) {
  const groupedItems = groupCartItems(items);
  
  const subtotal = items.reduce(
    (sum, item) => sum + calculateFinalPrice(item.price, item.percentage),
    0
  );

  const charge = paymentMethod?.charge
    ? (subtotal * paymentMethod.charge) / 100
    : 0;
  const installmentCharge = installment?.charge
    ? (subtotal * installment.charge) / 100
    : 0;
  const discount = paymentMethod?.discount
    ? (subtotal * paymentMethod.discount) / 100
    : 0;
  const total = subtotal + charge + installmentCharge - discount;

  return (
    <div className='bg-white h-full rounded-lg shadow p-4'>
      <h2 className='text-lg font-semibold mb-4'>Current Sale</h2>

      <div className='flex-1 overflow-auto'>
        {groupedItems.map((item) => (
          <div
            key={item.id}
            className='flex justify-between items-center py-2 border-b'
          >
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-medium">{item.name}</span>
                <span className="text-sm text-gray-500">x{item.quantity}</span>
              </div>
              <div className="text-sm space-y-1">
                <p className="text-gray-500">
                  Unit: ${calculateFinalPrice(item.price, item.percentage).toFixed(2)}
                </p>
                <p className="font-medium">
                  Subtotal: ${(calculateFinalPrice(item.price, item.percentage) * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
            <button
              onClick={() => onRemoveItem(items.findIndex(i => i.id === item.id))}
              className='p-1 text-red-600 hover:bg-red-50 rounded'
            >
              <Trash2 className='w-4 h-4' />
            </button>
          </div>
        ))}
      </div>

      <div className='mt-4 pt-4 border-t space-y-2'>
        <div className='flex justify-between text-sm'>
          <span className='text-gray-600'>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        {charge > 0 && (
          <div className='flex justify-between text-sm'>
            <span className='text-gray-600'>
              Charge ({paymentMethod?.charge}%):
            </span>
            <span className='text-red-600'>+${charge.toFixed(2)}</span>
          </div>
        )}

        {installmentCharge > 0 && (
          <div className='flex justify-between text-sm'>
            <span className='text-gray-600'>
              Installment Charge ({installment?.quantity}x +
              {installment?.charge}%):
            </span>
            <span className='text-red-600'>
              +${installmentCharge.toFixed(2)}
            </span>
          </div>
        )}

        {discount > 0 && (
          <div className='flex justify-between text-sm'>
            <span className='text-gray-600'>
              Discount ({paymentMethod?.discount}%):
            </span>
            <span className='text-green-600'>-${discount.toFixed(2)}</span>
          </div>
        )}

        <div className='flex justify-between items-center pt-2 border-t'>
          <span className='font-semibold'>Total:</span>
          <span className='text-xl font-bold'>${total.toFixed(2)}</span>
          {installment && (
            <span className='text-sm text-gray-600'>
              ({installment.quantity}x of $
              {(total / installment.quantity).toFixed(2)})
            </span>
          )}
        </div>

        <div className='flex gap-2'>
          <button
            onClick={() => onCompleteSale('pending')}
            disabled={
              items.length === 0 ||
              !paymentMethod ||
              (paymentMethod.installments?.length > 0 && !installment)
            }
            className='flex-1 flex items-center justify-center gap-2 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            Save as Pending
          </button>
          <button
            onClick={() => onCompleteSale('completed')}
            disabled={
              items.length === 0 ||
              !paymentMethod ||
              (paymentMethod.installments?.length > 0 && !installment)
            }
            className='flex-1 flex items-center justify-center gap-2 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            Complete Sale
          </button>
        </div>
      </div>
    </div>
  );
}