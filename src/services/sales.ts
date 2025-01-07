import { db } from '../db';
import { Sale, Product, PaymentMethod, Installment, Client } from '../db/schema';
import { calculateSaleTotal } from '../utils/pricing';

// Helper to update product stock
async function updateProductStock(productId: number, quantity: number) {
  const product = await db.products.get(productId);
  if (product) {
    await db.products.update(product.id!, {
      stock: product.stock + quantity,
      updatedAt: new Date().toISOString(),
    });
  }
}

// Helper to process stock changes for a cart
async function processStockChanges(cart: Product[], operation: 'add' | 'subtract') {
  const productUpdates = cart.reduce((acc, item) => {
    if (!item.id) return acc;
    acc[item.id] = (acc[item.id] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  for (const [productId, count] of Object.entries(productUpdates)) {
    await updateProductStock(
      parseInt(productId),
      operation === 'add' ? count : -count
    );
  }
}

export async function updateSaleStatus(sale: Sale, newStatus: Sale['status']) {
  if (!sale.id) return;

  await db.transaction('rw', [db.sales, db.products], async () => {
    const oldStatus = sale.status;

    // Update sale status
    await db.sales.update(sale.id!, {
      status: newStatus,
      completed: newStatus === 'completed',
      updatedAt: new Date().toISOString(),
    });

    // Handle stock changes based on status transition
    if (oldStatus === 'pending' && newStatus === 'canceled') {
      await processStockChanges(sale.cart, 'add');
    } else if (oldStatus === 'canceled' && newStatus === 'pending') {
      await processStockChanges(sale.cart, 'subtract');
    } else if (oldStatus === 'completed' && newStatus === 'canceled') {
      await processStockChanges(sale.cart, 'add');
    } else if (oldStatus === 'canceled' && newStatus === 'completed') {
      await processStockChanges(sale.cart, 'subtract');
    }
  });
}

export async function createSale(
  cart: Product[],
  paymentMethod: PaymentMethod,
  installment: Installment | undefined,
  status: 'completed' | 'pending',
  client?: Client
): Promise<Sale> {
  return await db.transaction('rw', [db.sales, db.products], async () => {
    const { subtotal, total } = calculateSaleTotal(cart, paymentMethod, installment);

    // Create the sale with all payment details
    const saleData = {
      cart,
      cost: cart.reduce((sum, item) => sum + item.price, 0),
      subtotal,
      total,
      clientId: client?.id,
      paymentMethodId: paymentMethod.id,
      installmentId: installment?.id,
      paymentDetails: {
        methodName: paymentMethod.name,
        charge: paymentMethod.charge,
        discount: paymentMethod.discount,
        installment: installment ? {
          quantity: installment.quantity,
          charge: installment.charge,
          amountPerInstallment: total / installment.quantity
        } : undefined
      },
      status,
      completed: status === 'completed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const saleId = await db.sales.add(saleData);
    const createdSale = await db.sales.get(saleId);
    
    if (!createdSale) throw new Error('Failed to create sale');

    // Update stock if the sale is completed or pending
    if (status === 'completed' || status === 'pending') {
      await processStockChanges(cart, 'subtract');
    }

    return createdSale;
  });
}