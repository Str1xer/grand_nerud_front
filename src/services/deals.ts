import { secureGetData, securePostData } from "@/lib/fetch";

export async function getDeals() {
  return secureGetData("https://appgrand.worldautogroup.ru/deals");
}

export async function getDealsAdmin() {
  return secureGetData("https://appgrand.worldautogroup.ru/deals/admin/get");
}

export async function createDeal(dealData: any) {
  return securePostData("https://appgrand.worldautogroup.ru/deals", {
    ...dealData,
  });
}
