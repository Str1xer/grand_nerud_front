import { secureGetData } from "@/lib/fetch";
import { ServiceDto } from "@definitions/dto";

export async function getServices(
  options: RequestInit = {}
): Promise<ServiceDto[]> {
  return secureGetData("https://appgrand.worldautogroup.ru/services", options);
}
