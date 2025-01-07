import React, { useState } from 'react';
import { db } from '../../db';
import { Product, PurchaseItem } from '../../db/schema';
import { useLiveQuery } from 'dexie-react-hooks';
import { PaymentSimulator } from '../products/PaymentSimulator';
import { calculateFinalPrice } from '../../utils/pricing';

interface NewProductFormProps {
  barcode: string;
  onSave: (
    product: Product,
    purchaseDetails: Omit<PurchaseItem, 'productId'>
  ) => void;
  onCancel: () => void;
}

export function NewProductForm({
  barcode,
  onSave,
  onCancel,
}: NewProductFormProps) {
  const [formData, setFormData] = useState({
    // Product details
    barcode,
    name: '',
    description: '',
    percentage: 0,
    threshold: 0,
    // Purchase details
    quantity: 1,
    price: 0,
  });
  const paymentMethods = useLiveQuery(() => db.paymentMethods.toArray());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { quantity, price, ...productData } = formData;

    const product = await db.products.add({
      ...productData,
      price: 0, // Initial price will be 0 until purchase is completed
      stock: 0, // Initial stock will be 0 until purchase is completed
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Product);

    const newProduct = await db.products.get(product);
    if (newProduct) {
      onSave(newProduct, {
        barcode,
        name: formData.name,
        quantity,
        price,
      });
    }
  };

  const finalPrice = calculateFinalPrice(formData.price, formData.percentage);

  return (
    <div className='bg-white rounded-lg shadow p-6'>
      <h3 className='font-medium mb-4'>New Product</h3>

      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Barcode
            </label>
            <input
              type='text'
              value={formData.barcode}
              disabled
              className='mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Name
            </label>
            <input
              type='text'
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
              required
              autoFocus
            />
          </div>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700'>
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={2}
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
          />
        </div>

        <div>
          <h4 className='font-medium mb-4'>Purchase Details</h4>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Purchase Quantity
              </label>
              <input
                type='number'
                min='1'
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: Number(e.target.value) })
                }
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                required
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Stock Threshold
              </label>
              <input
                type='number'
                value={formData.threshold}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    threshold: Number(e.target.value),
                  })
                }
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                required
              />
            </div>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Purchase Price
            </label>
            <input
              type='number'
              step='0.01'
              min='0'
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: Number(e.target.value) })
              }
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Percentage
            </label>
            <input
              type='number'
              value={formData.percentage}
              onChange={(e) =>
                setFormData({ ...formData, percentage: Number(e.target.value) })
              }
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
              required
            />
          </div>
        </div>

        <PaymentSimulator
          finalPrice={finalPrice}
          paymentMethods={paymentMethods}
        />

        <div className='flex justify-end gap-2'>
          <button
            type='button'
            onClick={onCancel}
            className='px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md'
          >
            Cancel
          </button>
          <button
            type='submit'
            className='px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md'
          >
            Create & Add to Cart
          </button>
        </div>
      </form>
    </div>
  );
}
