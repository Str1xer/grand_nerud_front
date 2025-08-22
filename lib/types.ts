// /src/lib/types.ts
export interface User {
  _id: string;
  name: string | null;
  lastName: string | null;
  fatherName: string | null;
  email: string;
  admin: boolean | null;
  hashed_password: string;
  deleted_at: string | null;
  is_deleted: boolean | null;
}

export interface Deal {
  _id: string
  serviceId: string
  createdAt: string
  customerId: string
  stageId: string
  materialId: string | null
  unitMeasurement: string
  quantity: number
  methodReceiving: string
  paymentMethod: string
  shippingAddressId: string | null
  deliveryAddressId: string | null
  shippingAddress: string | null
  deliveryAddress: string | null
  amountPerUnit: number
  amountPurchase: number
  amountDelivery: number
  companyProfit: number
  totalAmount: number
  managerProfit: number
  deadline: string | null
  notes: string
  OSSIG: boolean
  updated_at: string
  deleted_at: string | null
  is_deleted: boolean | null
  userId: string
  service: {
    _id: string
    name: string
  }
  customer: null | {
    _id: string
    inn: number
    name: string
  }
  stage: {
    _id: string
    name: string
  }
  material: null | {
    _id: string
    name: string
  }
  shipping_address: null | any
  delivery_address: null | any
  user: {
    _id: string
    email: string
    name: string
    admin: boolean
  }
  serviceIdName?: string;
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
  abbreviatedName: string
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