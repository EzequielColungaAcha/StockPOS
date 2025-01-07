import Dexie, { Table } from 'dexie';

// Interfaces
export interface PaymentDetails {
  methodName: string;
  charge: number;
  discount: number;
  installment?: {
    quantity: number;
    charge: number;
    amountPerInstallment: number;
  };
}

export interface Sale {
  id?: number;
  cart: Product[];
  cost: number;
  subtotal: number;
  total: number;
  clientId?: number;
  paymentMethodId?: number;
  installmentId?: number;
  paymentDetails?: PaymentDetails;
  status: 'completed' | 'pending' | 'canceled';
  completed: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id?: number;
  barcode: string;
  name: string;
  description?: string;
  price: number;
  percentage: number;
  providerId?: number;
  stock: number;
  threshold: number;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Provider {
  id?: number;
  name: string;
  address?: string;
  phone?: string;
  mail?: string;
  cuit?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id?: number;
  name?: string;
  image?: string;
  cuit?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id?: number;
  name: string;
  dni?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentMethod {
  id?: number;
  name: string;
  charge: number;
  discount: number;
  installments: Installment[];
  createdAt: string;
  updatedAt: string;
}

export interface Installment {
  id?: number;
  quantity: number;
  charge: number;
  createdAt: string;
  updatedAt: string;
}

export interface Cash {
  id?: number;
  status: boolean;
  content: number;
  movements: Movement[];
  createdAt: string;
  updatedAt: string;
}

export interface Movement {
  id?: number;
  quantity: number;
  saleId?: number;
  returnId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Return {
  id?: number;
  returns: Product[];
  saleId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Purchase {
  id?: number;
  cart: PurchaseItem[];
  providerId?: number;
  total: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseItem {
  productId: number;
  barcode: string;
  name: string;
  quantity: number;
  price: number;
}

// Database class
export class POSDatabase extends Dexie {
  products!: Table<Product>;
  providers!: Table<Provider>;
  companies!: Table<Company>;
  sales!: Table<Sale>;
  clients!: Table<Client>;
  paymentMethods!: Table<PaymentMethod>;
  installments!: Table<Installment>;
  cash!: Table<Cash>;
  movements!: Table<Movement>;
  returns!: Table<Return>;
  purchases!: Table<Purchase>;

  constructor() {
    super('pos_db');

    this.version(1).stores({
      products: '++id, barcode, name, providerId, stock', // Added stock index
      providers: '++id, name, cuit',
      companies: '++id',
      sales: '++id, clientId, completed, status, createdAt',
      clients: '++id, name, dni',
      paymentMethods: '++id, name',
      installments: '++id',
      cash: '++id',
      movements: '++id, saleId, returnId',
      returns: '++id, saleId',
      purchases: '++id, providerId, createdAt',
    });
  }
}
