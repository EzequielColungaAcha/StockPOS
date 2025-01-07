import { db } from '../db';
import { Purchase } from '../db/schema';

export async function updateProductStock(
  productId: number,
  quantity: number,
  newPrice: number
) {
  const product = await db.products.get(productId);
  if (!product) return;

  await db.products.update(productId, {
    stock: product.stock + quantity,
    price: newPrice,
    updatedAt: new Date().toISOString(),
  });
}

export async function updateProductFromPurchase(
  productId: number,
  purchase: Purchase
) {
  const purchaseItem = purchase.cart.find(
    (item) => item.productId === productId
  );
  if (!purchaseItem) return;

  await db.products.update(productId, {
    price: purchaseItem.price,
    providerId: purchase.providerId,
    updatedAt: new Date().toISOString(),
  });
}
