import React, { useState } from 'react';
import { Product, PurchaseItem } from '../../db/schema';
import { NewProductForm } from './NewProductForm';

interface ProductPurchaseFormProps {
  product: Product;
  onAdd: (item: PurchaseItem) => void;
  onCancel: () => void;
}

export function ProductPurchaseForm({
  product,
  onAdd,
  onCancel,
}: ProductPurchaseFormProps) {
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(product.price || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (product.id) {
      onAdd({
        productId: product.id,
        barcode: product.barcode,
        name: product.name,
        quantity,
        price,
      });
    }
  };

  const handleNewProductSave = (
    newProduct: Product,
    purchaseDetails: Omit<PurchaseItem, 'productId'>
  ) => {
    onAdd({
      productId: newProduct.id!,
      ...purchaseDetails,
    });
  };

  if (!product.id) {
    return (
      <NewProductForm
        barcode={product.barcode}
        onSave={handleNewProductSave}
        onCancel={onCancel}
      />
    );
  }

  return (
    <div className='bg-white rounded-lg shadow p-6'>
      <div className='mb-4'>
        <h3 className='font-medium'>{product.name}</h3>
        <p className='text-sm text-gray-500'>Barcode: {product.barcode}</p>
        <p className='text-sm text-gray-500'>Current Stock: {product.stock}</p>
      </div>

      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700'>
            Purchase Quantity
          </label>
          <input
            type='number'
            min='1'
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
            required
            autoFocus
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700'>
            Purchase Price
          </label>
          <input
            type='number'
            step='0.01'
            min='0'
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
            required
          />
        </div>

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
            Add to Cart
          </button>
        </div>
      </form>
    </div>
  );
}
