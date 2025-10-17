import { secureGetData } from "@/lib/fetch";
import { CompanyDto } from "@definitions/dto";

export async function getCompanies(): Promise<CompanyDto[]> {
  return secureGetData("https://appgrand.worldautogroup.ru/companies");
}
