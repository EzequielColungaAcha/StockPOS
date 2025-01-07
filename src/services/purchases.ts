import { db } from '../db';
import { Purchase } from '../db/schema';

export async function createPurchase(
  purchase: Omit<Purchase, 'id' | 'createdAt' | 'updatedAt'>
) {
  return db.transaction('rw', [db.purchases, db.products], async () => {
    // Create purchase record
    const purchaseId = await db.purchases.add({
      ...purchase,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const createdPurchase = await db.purchases.get(purchaseId);
    if (!createdPurchase) throw new Error('Failed to create purchase');

    // Update product stock and details
    for (const item of purchase.cart) {
      const product = await db.products.get(item.productId);
      if (product) {
        // Update existing product
        await db.products.update(product.id!, {
          stock: product.stock + item.quantity,
          price: item.price,
          providerId: purchase.providerId,
          updatedAt: new Date().toISOString(),
        });
      }
    }

    return purchaseId;
  });
}
