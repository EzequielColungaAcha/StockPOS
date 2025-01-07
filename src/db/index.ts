import { POSDatabase } from './schema';

// Create database instance
export const db = new POSDatabase();

// Database export function
export async function exportDatabase(): Promise<string> {
  const data = {
    products: await db.products.toArray(),
    providers: await db.providers.toArray(),
    companies: await db.companies.toArray(),
    sales: await db.sales.toArray(),
    clients: await db.clients.toArray(),
    paymentMethods: await db.paymentMethods.toArray(),
    installments: await db.installments.toArray(),
    cash: await db.cash.toArray(),
    movements: await db.movements.toArray(),
    returns: await db.returns.toArray(),
  };

  return JSON.stringify(data, null, 2);
}

// Database import function
export async function importDatabase(jsonData: string): Promise<void> {
  const data = JSON.parse(jsonData);
  await clearDatabase();

  await db.transaction(
    'rw',
    [
      db.products,
      db.providers,
      db.companies,
      db.sales,
      db.clients,
      db.paymentMethods,
      db.installments,
      db.cash,
      db.movements,
      db.returns,
    ],
    async () => {
      // Import new data
      await Promise.all([
        db.products.bulkAdd(data.products),
        db.providers.bulkAdd(data.providers),
        db.companies.bulkAdd(data.companies),
        db.sales.bulkAdd(data.sales),
        db.clients.bulkAdd(data.clients),
        db.paymentMethods.bulkAdd(data.paymentMethods),
        db.installments.bulkAdd(data.installments),
        db.cash.bulkAdd(data.cash),
        db.movements.bulkAdd(data.movements),
        db.returns.bulkAdd(data.returns),
      ]);
    }
  );
}

// Clear database function
export async function clearDatabase(): Promise<void> {
  await db.transaction(
    'rw',
    [
      db.products,
      db.providers,
      db.companies,
      db.sales,
      db.clients,
      db.paymentMethods,
      db.installments,
      db.cash,
      db.movements,
      db.returns,
    ],
    async () => {
      await Promise.all([
        db.products.clear(),
        db.providers.clear(),
        db.companies.clear(),
        db.sales.clear(),
        db.clients.clear(),
        db.paymentMethods.clear(),
        db.installments.clear(),
        db.cash.clear(),
        db.movements.clear(),
        db.returns.clear(),
      ]);
    }
  );
}
