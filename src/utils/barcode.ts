import { db } from '../db';

// Generate a random number of specified length
function generateRandomDigits(length: number): string {
  return Array.from(
    { length }, 
    () => Math.floor(Math.random() * 10)
  ).join('');
}

// Calculate EAN-13 check digit
function calculateCheckDigit(barcode: string): number {
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(barcode[i]) * (i % 2 === 0 ? 1 : 3);
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit;
}

// Generate a random EAN-13 barcode
export async function generateUniqueBarcode(): Promise<string> {
  while (true) {
    // Generate 12 digits (EAN-13 without check digit)
    const partial = generateRandomDigits(12);
    // Calculate and append check digit
    const checkDigit = calculateCheckDigit(partial);
    const barcode = partial + checkDigit;
    
    // Check if barcode exists
    const exists = await db.products.where('barcode').equals(barcode).count();
    if (exists === 0) {
      return barcode;
    }
  }
}