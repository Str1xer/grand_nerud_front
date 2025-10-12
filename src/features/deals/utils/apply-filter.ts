import { DealDto } from "@definitions/dto";

export type DealFilters = {
  stage: string;
  service: string;
  user: string;
  material: string;
};

export function allOrFilter(value: string | null, filter: string) {
  return filter === "all" || value === filter;
}

export function applyDealFilters(deals: DealDto[], filters: DealFilters) {
  return deals.filter(
    (deal) =>
      allOrFilter(deal.serviceId, filters.service) &&
      allOrFilter(deal.stageId, filters.stage) &&
      allOrFilter(deal.userId, filters.user) &&
      allOrFilter(deal.materialId, filters.material)
  );
}
