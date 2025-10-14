import {
  secureDeleteData,
  secureGetData,
  securePatchData,
  securePostData,
} from "@/lib/fetch";
import { DealDto } from "@definitions/dto";
import { CreateDealRequest, UpdateDealRequest } from "@definitions/requests";

export async function getDeals(): Promise<DealDto[]> {
  return secureGetData("https://appgrand.worldautogroup.ru/deals");
}

export async function getDealsAdmin(): Promise<DealDto[]> {
  return secureGetData("https://appgrand.worldautogroup.ru/deals/admin/get");
}

export async function createDeal(
  dealData: CreateDealRequest
): Promise<DealDto> {
  return securePostData("https://appgrand.worldautogroup.ru/deals", {
    ...dealData,
  });
}

export async function getDeal(id: string): Promise<DealDto> {
  return secureGetData(`https://appgrand.worldautogroup.ru/deals/${id}`);
}

export async function updateDeal(id: string, body: UpdateDealRequest) {
  return securePatchData(
    `https://appgrand.worldautogroup.ru/deals/${id}`,
    body
  );
}

export async function deleteDeal(id: string) {
  return secureDeleteData(`https://appgrand.worldautogroup.ru/deals/${id}`);
}
