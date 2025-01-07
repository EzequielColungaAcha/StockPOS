import { Product, PaymentMethod, Installment } from '../db/schema';

export function calculateFinalPrice(basePrice: number, percentage: number): number {
  return basePrice * (1 + percentage / 100);
}

export function calculateSaleTotal(
  cart: Product[],
  paymentMethod?: PaymentMethod,
  installment?: Installment
) {
  // Calculate subtotal (products with their markups)
  const subtotal = cart.reduce(
    (sum, item) => sum + calculateFinalPrice(item.price, item.percentage),
    0
  );

  // Calculate payment method charge
  const charge = paymentMethod?.charge 
    ? (subtotal * paymentMethod.charge) / 100 
    : 0;

  // Calculate installment charge
  const installmentCharge = installment?.charge 
    ? (subtotal * installment.charge) / 100 
    : 0;

  // Calculate discount
  const discount = paymentMethod?.discount 
    ? (subtotal * paymentMethod.discount) / 100 
    : 0;

  // Calculate final total
  return {
    subtotal,
    charge,
    installmentCharge,
    discount,
    total: subtotal + charge + installmentCharge - discount
  };
}