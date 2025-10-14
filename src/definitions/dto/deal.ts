import { CompanyDto, MaterialDto, ServiceDto, StageDto, UserDto } from "./";

export default interface DealDto {
  _id: string;

  userId: string;
  serviceId: string;
  customerId: string;
  stageId: string;
  materialId: string | null;

  unitMeasurement: string;

  quantity: number;

  amountPurchaseUnit: number;
  amountPurchaseTotal: number;

  amountSalesUnit: number;
  amountSalesTotal: number;

  amountDelivery: number;
  companyProfit: number;

  totalAmount: number;
  managerProfit: number;

  paymentMethod: string;

  shippingAddress: string | null;
  methodReceiving: string;
  deliveryAddress: string | null;

  deadline: string | null;
  notes: string;
  OSSIG: boolean;

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
