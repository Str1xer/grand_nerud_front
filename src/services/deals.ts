import { secureGetData, securePostData } from "@/lib/fetch";
import { DealDto } from "@definitions/dto";

export async function getDeals(): Promise<DealDto[]> {
  return secureGetData("https://appgrand.worldautogroup.ru/deals");
}

export async function getDealsAdmin(): Promise<DealDto[]> {
  return secureGetData("https://appgrand.worldautogroup.ru/deals/admin/get");
}

export async function createDeal(dealData: any): Promise<DealDto> {
  return securePostData("https://appgrand.worldautogroup.ru/deals", {
    ...dealData,
  });
}

export async function getDeal(id: string): Promise<DealDto> {
  return secureGetData(`https://appgrand.worldautogroup.ru/deals/${id}`);
}
