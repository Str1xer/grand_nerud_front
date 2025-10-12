import { CompanyDto, MaterialDto, ServiceDto, StageDto, UserDto } from "./";

export default interface DealDto {
  _id: string;

  userId: string;
  serviceId: string;
  customerId: string;
  stageId: string;
  materialId: string | null;

  quantity: number;
  amountPerUnit: number;
  amountPurchase: number;
  amountSale: number;

  amountDelivery: number;
  companyProfit: number;
  managerProfit: number;
  totalAmount: number;

  paymentMethod: string;

  shippingAddressId: string | null;
  deliveryAddressId: string | null;
  methodReceiving: string;

  deadline: string | null;
  notes: string;
  OSSIG: boolean;

  unitMeasurement: string;
  shippingAddress: string | null;
  deliveryAddress: string | null;
  shipping_address: null | any;
  delivery_address: null | any;
  serviceIdName?: string;

  // Populated fields
  user: UserDto | null;
  service: ServiceDto | null;
  customer: CompanyDto | null;
  stage: StageDto | null;
  material: MaterialDto | null;

  createdAt: string;
  updated_at: string;
  deleted_at: string | null;
  is_deleted: boolean | null;
}
