import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db';
import { PurchaseItem } from '../../db/schema';
import { Trash2 } from 'lucide-react';
import { createPurchase } from '../../services/purchases';
import { formatPrice } from '../../utils/format';

interface PurchaseCartProps {
  items: PurchaseItem[];
  onRemoveItem: (index: number) => void;
  onComplete: () => void;
}

export function PurchaseCart({ items, onRemoveItem, onComplete }: PurchaseCartProps) {
  const [providerId, setProviderId] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const providers = useLiveQuery(() => db.providers.toArray());

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    try {
      await createPurchase({
        cart: items,
        providerId: providerId || undefined,
        total,
        notes: notes || undefined,
      });
      setProviderId(0);
      setNotes('');
      onComplete();
    } catch (error) {
      console.error('Failed to create purchase:', error);
      alert('Failed to create purchase. Please try again.');
    }
  };

  return (
    <div className="bg-white h-full rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Purchase Cart</h2>

      <div className="flex-1 overflow-auto mb-4">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between items-center py-2 border-b">
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-500">
                {item.quantity}x @ {formatPrice(item.price)}
              </p>
              <p className="text-sm font-medium">
                Total: {formatPrice(item.price * item.quantity)}
              </p>
            </div>
            <button
              onClick={() => onRemoveItem(index)}
              className="p-1 text-red-600 hover:bg-red-50 rounded"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Provider</label>
          <select
            value={providerId}
            onChange={(e) => setProviderId(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
          <label className="block text-sm font-medium text-gray-700">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="pt-4 border-t">
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold">Total:</span>
            <span className="text-xl font-bold">{formatPrice(total)}</span>
          </div>

          <button
            type="submit"
            disabled={items.length === 0}
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Complete Purchase
          </button>
        </div>
      </form>
    </div>
  );
}