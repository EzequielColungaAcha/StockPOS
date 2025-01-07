import React, { useState, useEffect, useRef } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db';
import { Product } from '../../db/schema';
import { X, Barcode } from 'lucide-react';
import { ImageUpload } from '../shared/ImageUpload';
import { generateUniqueBarcode } from '../../utils/barcode';
import { useToast } from '../../context/ToastContext';
import { calculateFinalPrice } from '../../utils/pricing';
import { PaymentSimulator } from './PaymentSimulator';

interface ProductFormProps {
  product?: Product;
  onClose: () => void;
}

export function ProductForm({ product, onClose }: ProductFormProps) {
  const { showToast } = useToast();
  const providers = useLiveQuery(() => db.providers.toArray());
  const paymentMethods = useLiveQuery(() => db.paymentMethods.toArray());
  const barcodeInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    barcode: '',
    name: '',
    description: '',
    price: 0,
    percentage: 0,
    providerId: 0,
    stock: 0,
    threshold: 0,
    image: '',
  });

  const [finalPriceInput, setFinalPriceInput] = useState<number>(0);
  const [isEditingFinalPrice, setIsEditingFinalPrice] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        barcode: product.barcode,
        name: product.name,
        description: product.description || '',
        price: product.price,
        percentage: product.percentage,
        providerId: product.providerId || 0,
        stock: product.stock,
        threshold: product.threshold,
        image: product.image || '',
      });
      setFinalPriceInput(
        calculateFinalPrice(product.price, product.percentage)
      );
    }
  }, [product]);

  const basePrice = formData.price;
  const percentage = formData.percentage;
  const finalPrice = calculateFinalPrice(basePrice, percentage);

  const handleFinalPriceChange = (value: number) => {
    setFinalPriceInput(value);
    setIsEditingFinalPrice(true);

    if (formData.price > 0) {
      // Calculate new percentage based on desired final price
      const newPercentage = (value / formData.price - 1) * 100;
      setFormData((prev) => ({
        ...prev,
        percentage: Math.round(newPercentage * 100) / 100,
      }));
    }
  };

  const handlePriceChange = (value: number) => {
    setFormData((prev) => ({
      ...prev,
      price: value,
    }));
    setIsEditingFinalPrice(false);
  };

  const handlePercentageChange = (value: number) => {
    setFormData((prev) => ({
      ...prev,
      percentage: value,
    }));
    setIsEditingFinalPrice(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = {
        ...formData,
        updatedAt: new Date().toISOString(),
      };

      if (product?.id) {
        await db.products.update(product.id, data);
        showToast('Product updated successfully', 'success');
      } else {
        await db.products.add({
          ...data,
          createdAt: new Date().toISOString(),
        } as Product);
        showToast('Product created successfully', 'success');
      }

      onClose();
    } catch (error) {
      showToast(`Failed to save product: ${error}`, 'error');
    }
  };

  // Handle barcode scanner input
  useEffect(() => {
    let barcodeBuffer = '';
    let lastKeyTime = Date.now();
    const SCANNER_TIMEOUT = 50; // Reduced timeout for better scanner detection

    const handleKeyPress = (e: KeyboardEvent) => {
      const currentTime = Date.now();
      const timeDiff = currentTime - lastKeyTime;

      // If time between keystrokes is too long, reset buffer (manual typing)
      if (timeDiff > SCANNER_TIMEOUT) {
        barcodeBuffer = '';
      }

      lastKeyTime = currentTime;

      // Only process if barcode input is focused
      if (document.activeElement === barcodeInputRef.current) {
        if (/[\d]/.test(e.key)) {
          barcodeBuffer += e.key;
        } else if (e.key === 'Enter' && barcodeBuffer.length > 0) {
          e.preventDefault(); // Prevent form submission
          const finalBarcode = barcodeBuffer;
          barcodeBuffer = '';
          // Use setTimeout to ensure the state update happens after the buffer is cleared
          setTimeout(() => {
            setFormData((prev) => ({ ...prev, barcode: finalBarcode }));
          }, 0);
        }
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, []);

  const handleGenerateBarcode = async () => {
    const barcode = await generateUniqueBarcode();
    setFormData((prev) => ({ ...prev, barcode }));
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
      <div className='bg-white rounded-lg p-6 w-full max-w-2xl'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-xl font-semibold'>
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* First row - Barcode and Name */}
          <div className='grid grid-cols-2 gap-4'>
            <div className='relative'>
              <label className='block text-sm font-medium text-gray-700'>
                Barcode
                <span className='text-xs text-gray-500 ml-1'>
                  (Scanner enabled)
                </span>
              </label>
              <div className='flex gap-2'>
                <input
                  ref={barcodeInputRef}
                  type='text'
                  value={formData.barcode}
                  onChange={(e) =>
                    setFormData({ ...formData, barcode: e.target.value })
                  }
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                  required
                  autoFocus
                />
                <button
                  type='button'
                  onClick={handleGenerateBarcode}
                  className='mt-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center gap-2'
                  title='Generate random barcode'
                >
                  <Barcode className='w-4 h-4' />
                </button>
              </div>
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
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
              rows={2}
            />
          </div>

          {/* Pricing Section */}
          <div className='border rounded-lg p-4 space-y-4'>
            <h3 className='font-medium'>Pricing</h3>

            <div className='grid grid-cols-3 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Base Price
                </label>
                <input
                  type='number'
                  step='0.01'
                  value={formData.price}
                  onChange={(e) =>
                    handlePriceChange(parseFloat(e.target.value))
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
                    handlePercentageChange(parseFloat(e.target.value))
                  }
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Final Price
                </label>
                <input
                  type='number'
                  step='0.01'
                  value={isEditingFinalPrice ? finalPriceInput : finalPrice}
                  onChange={(e) =>
                    handleFinalPriceChange(parseFloat(e.target.value))
                  }
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                />
              </div>
            </div>

            <PaymentSimulator
              finalPrice={finalPrice}
              paymentMethods={paymentMethods}
            />
          </div>

          {/* Stock and Provider Section */}
          <div className='grid grid-cols-3 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Provider
              </label>
              <select
                value={formData.providerId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    providerId: parseInt(e.target.value),
                  })
                }
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
              >
                <option value={0}>Select Provider</option>
                {providers?.map((provider) => (
                  <option key={provider.id} value={provider.id}>
                    {provider.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Stock
              </label>
              <input
                type='number'
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: parseInt(e.target.value) })
                }
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                required
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Threshold
              </label>
              <input
                type='number'
                value={formData.threshold}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    threshold: parseInt(e.target.value),
                  })
                }
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                required
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Product Image
            </label>
            <ImageUpload
              image={formData.image}
              onChange={(image) => setFormData((prev) => ({ ...prev, image }))}
              onRemove={() => setFormData((prev) => ({ ...prev, image: '' }))}
            />
          </div>

          {/* Form Actions */}
          <div className='flex justify-end gap-2'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md'
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
