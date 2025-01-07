import React from 'react';
import { Product } from '../../db/schema';
import { Plus } from 'lucide-react';

interface ProductListProps {
  products: Product[];
  cartItems: Product[];
  onAddToCart: (product: Product) => void;
  searchInputRef: React.RefObject<HTMLInputElement>;
}

export function ProductList({ products, cartItems, onAddToCart, searchInputRef }: ProductListProps) {
  const getCartCount = (productId: number | undefined) => {
    if (!productId) return 0;
    return cartItems.filter(item => item.id === productId).length;
  };

  const handleAddToCart = (product: Product) => {
    onAddToCart(product);
    searchInputRef.current?.focus();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => {
        const cartCount = getCartCount(product.id);
        const remainingStock = product.stock - cartCount;

        return (
          <div key={product.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-500">{product.barcode}</p>
                <p className="text-lg font-bold mt-2">
                  ${(product.price * (1 + product.percentage / 100)).toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">
                  Stock: {remainingStock} {cartCount > 0 && `(${cartCount} in cart)`}
                </p>
              </div>
              <button
                onClick={() => handleAddToCart(product)}
                disabled={remainingStock <= 0}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                title={remainingStock <= 0 ? 'No stock available' : 'Add to cart'}
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}