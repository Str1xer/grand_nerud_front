export function formatCurrency(amount: number): string {
  if (isNaN(amount)) {
    return "0,00 ₽";
  }

  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 2,
  }).format(amount);
}
