// /src/lib/types.ts
export interface User {
  _id: string;
  email: string;
}

export interface Deal {
  _id: string;
  serviceId: string;
  createdAt: string;
  customerId: string;
  stageId: string;
  materialId: string;
  unitMeasurement: string;
  quantity: number;
  methodReceiving: string;
  paymentMethod: string;
  shippingAddressId: string;
  deliveryAddresslId: string;
  amountPurchase: number;
  amountDelivery: number;
  companyProfit: number;
  totalAmount: number;
  managerProfit: number;
  deadline: string;
  notes: string;
  OSSIG: boolean;
  updated_at: string;
  deleted_at: string;
  is_deleted: boolean;
  userId: string;
}

export interface Material {
  _id: string;
  name: string;
  deleted_at: string;
  is_deleted: boolean;
}

export interface Service {
  _id: string;
  name: string;
  deleted_at: string;
  is_deleted: boolean;
}

export interface Stage {
  _id: string;
  name: string;
  deleted_at: string;
  is_deleted: boolean;
}

export interface Company {
  _id: string;
  name: string;
  inn: number;
  contacts: Record<string, any>;
  deleted_at: string;
  is_deleted: boolean;
}

export interface Vehicle {
  _id: string;
  companyId: string;
  number: string;
  region: number;
  mark: string;
  model: string;
  year: number;
  color: string;
  deleted_at: string;
  is_deleted: boolean;
}