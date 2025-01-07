import { db } from './index';

export async function getProductsWithStock() {
  return db.products.where('stock').above(0).toArray();
}

export async function searchProducts(search: string) {
  const searchLower = search.toLowerCase();
  return db.products
    .filter(
      (product) =>
        product.name.toLowerCase().includes(searchLower) ||
        product.barcode.includes(search)
    )
    .toArray();
}

export async function searchProductsWithStock(search: string) {
  const products = await getProductsWithStock();
  const searchLower = search.toLowerCase();
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchLower) ||
      product.barcode.includes(search)
  );
}

export async function getProductByBarcode(barcode: string) {
  return db.products.where('barcode').equals(barcode).first();
}
