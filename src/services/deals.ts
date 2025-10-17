import {
  secureDeleteData,
  secureGetData,
  securePatchData,
  securePostData,
} from "@/lib/fetch";
import { DealDto } from "@definitions/dto";
import { CreateDealRequest, UpdateDealRequest } from "@definitions/requests";
import { DealFilters } from "@features/deals/definitions";

export async function getDeals(
  params: {
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: string;
    includeDeleted?: boolean;
    includeRelations?: boolean;
    filters?: DealFilters;
  } = {},
  options: RequestInit = {}
): Promise<{
  items: DealDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}> {
  const pageSize = params?.pageSize || 25;
  const page = params?.page || 1;
  const sortBy = params?.sortBy || "createdAt";
  const sortOrder = params?.sortOrder || "desc";

  const filters = Object.entries(params.filters || {}).reduce(
    (pv, [key, val]) => (val === "all" ? pv : `${pv}&${key}=${val}`),
    ""
  );

  return secureGetData(
    `https://appgrand.worldautogroup.ru/deals?sortBy=${sortBy}&sortOrder=${sortOrder}&page_size=${pageSize}&page=${page}&includeDeleted=${
      params.includeDeleted === false ? "False" : "True"
    }&includeRelations=${params.includeRelations ? "True" : "False"}${filters}`,
    options
  );
}

export async function getDealsAdmin(): Promise<{
  items: DealDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}> {
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
