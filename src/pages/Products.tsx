import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { Product } from '../db/schema';
import { Plus, Search } from 'lucide-react';
import { ProductForm } from '../components/products/ProductForm';
import { ProductList } from '../components/products/ProductList';
import { useToast } from '../context/ToastContext';

export function Products() {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();

  const products = useLiveQuery(async () => {
    if (!search) return db.products.toArray();
    const searchLower = search.toLowerCase();
    return db.products
      .filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          product.barcode.includes(search)
      )
      .toArray();
  }, [search]);

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await db.products.delete(id);
      showToast('Product deleted successfully', 'success');
    } catch (error) {
      showToast(`Failed to delete product: ${error}`, 'error');
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedProduct(undefined);
  };

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Products</h1>
        <button
          onClick={() => setShowForm(true)}
          className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
        >
          <Plus className='w-4 h-4' />
          Add Product
        </button>
      </div>

      <div className='mb-6'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
          <input
            type='text'
            placeholder='Search products...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
            className='w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>
      </div>

      <ProductList
        products={products || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {showForm && (
        <ProductForm product={selectedProduct} onClose={handleCloseForm} />
      )}
    </div>
  );
}
