export interface Product {
  id: string;
  name: string;
  type: 'glasses' | 'sunglasses' | 'lenses';
  quantity: number;
  createdAt: Date;
}

export interface Sale {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  createdAt: Date;
}

export interface Appointment {
  id: string;
  clientName: string;
  date: string;
  time: string;
  observations?: string;
  createdAt: Date;
}

export type AppSection = 'welcome' | 'products' | 'sales' | 'appointments' | 'reports';