import { MaterialDto, ServiceDto, StageDto, UserDto } from "./";

export default interface DealDto {
  _id: string;
  serviceId: string;
  createdAt: string;
  customerId: string;
  stageId: string;
  materialId: string | null;
  unitMeasurement: string;
  quantity: number;
  methodReceiving: string;
  paymentMethod: string;
  shippingAddressId: string | null;
  deliveryAddressId: string | null;
  shippingAddress: string | null;
  deliveryAddress: string | null;
  amountPerUnit: number;
  amountPurchase: number;
  amountDelivery: number;
  companyProfit: number;
  totalAmount: number;
  managerProfit: number;
  deadline: string | null;
  notes: string;
  OSSIG: boolean;
  updated_at: string;
  deleted_at: string | null;
  is_deleted: boolean | null;
  userId: string;
  service: ServiceDto;
  customer: null | {
    _id: string;
    inn: number;
    name: string;
  };
  stage: StageDto;
  material: MaterialDto | null;
  shipping_address: null | any;
  delivery_address: null | any;
  user: UserDto;
  serviceIdName?: string;
}
