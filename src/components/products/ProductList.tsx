import React from 'react';
import { Product } from '../../db/schema';
import { Edit2 } from 'lucide-react';
import { DeleteButton } from '../shared/DeleteButton';
import { formatPrice } from '../../utils/format';
import { TruncatedText } from '../shared/TruncatedText';

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

export function ProductList({ products, onEdit, onDelete }: ProductListProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Barcode</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Base Price</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Percentage</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Final Price</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product.id}>
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                {product.description && (
                  <div className="text-sm text-gray-500">
                    <TruncatedText text={product.description} maxLength={35} />
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {product.barcode}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatPrice(product.price)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {product.percentage}%
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {formatPrice(product.price * (1 + product.percentage / 100))}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className={`text-sm ${product.stock <= product.threshold ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                  {product.stock}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(product)}
                    className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  {product.id && (
                    <DeleteButton
                      onDelete={() => onDelete(product.id!)}
                      type="product"
                      data={product}
                    />
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}