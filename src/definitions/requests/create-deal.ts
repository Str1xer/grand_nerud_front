export default interface CreateDealRequest {
  serviceId: string;
  customerId: string;
  stageId: string;
  materialId: string;

  unitMeasurement: "тонна" | "куб.м" | "шт";
  quantity: number;
  methodReceiving: "самовывоз" | "доставка";
  paymentMethod: "наличный расчет" | "безналичный расчет";

  amountPerUnit: number;
  amountPurchase: number;
  amountSale: number;
  amountDelivery: number;
  companyProfit: number;
  totalAmount: number;
  managerProfit: number;

  shippingAddress: string;
  deliveryAddress: string;
  OSSIG: boolean;

  deadline: string | undefined; // ISO date string
  notes: string;
}
