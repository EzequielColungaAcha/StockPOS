import React, { useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { useBarcodeScanner } from '../hooks/useBarcodeScanner';
import { PurchaseCart } from '../components/buys/PurchaseCart';
import { ProductPurchaseForm } from '../components/buys/ProductPurchaseForm';
import { getProductByBarcode } from '../db/queries';
import { Product, PurchaseItem } from '../db/schema';
import { useToast } from '../context/ToastContext';

export function Buys() {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<PurchaseItem[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useBarcodeScanner({
    onBarcode: async (barcode) => {
      const product = await getProductByBarcode(barcode);
      setSelectedProduct(product || ({ barcode } as Product));
      setSearch('');
    },
  });

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!search) return;

    const product = await getProductByBarcode(search);
    setSelectedProduct(product || ({ barcode: search } as Product));
    setSearch('');
  };

  const handleAddToCart = (item: PurchaseItem) => {
    setCart([...cart, item]);
    setSelectedProduct(null);
    searchInputRef.current?.focus();
  };

  const handleRemoveFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
    searchInputRef.current?.focus();
  };

  const handlePurchaseComplete = () => {
    try {
      showToast('Purchase completed successfully', 'success');
      setCart([]);
      setSelectedProduct(null);
      searchInputRef.current?.focus();
    } catch (error) {
      showToast(`Failed to complete purchase: ${error}`, 'error');
    }
  };

  return (
    <div className='h-full flex gap-4'>
      <div className='flex-1'>
        <h1 className='text-2xl font-bold mb-6'>Stock Purchases</h1>

        <form onSubmit={handleSearchSubmit} className='mb-6'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
            <input
              ref={searchInputRef}
              type='text'
              placeholder='Enter or scan product barcode...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              autoFocus
            />
          </div>
        </form>

        {selectedProduct && (
          <ProductPurchaseForm
            product={selectedProduct}
            onAdd={handleAddToCart}
            onCancel={() => {
              setSelectedProduct(null);
              searchInputRef.current?.focus();
            }}
          />
        )}
      </div>

      <div className='w-96'>
        <PurchaseCart
          items={cart}
          onRemoveItem={handleRemoveFromCart}
          onComplete={handlePurchaseComplete}
        />
      </div>
    </div>
  );
}
