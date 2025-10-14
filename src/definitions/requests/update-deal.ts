export default interface UpdateDealRequest {
  stageId: string;
  materialId: string;

  unitMeasurement: "тонна" | "куб.м" | "шт";

  quantity: number;

  amountPurchaseUnit: number;
  amountPurchaseTotal: number;

  amountSalesUnit: number;
  amountSalesTotal: number;

  amountDelivery: number;
  companyProfit: number;

  totalAmount: number;
  managerProfit: number;

  paymentMethod: "наличный расчет" | "безналичный расчет";

  shippingAddress: string;
  methodReceiving: "самовывоз" | "доставка";
  deliveryAddress: string;

  deadline: string | undefined; // ISO date string
  notes: string;
  OSSIG: boolean;
}
