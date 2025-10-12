import { secureGetData } from "@/lib/fetch";
import { ServiceDto } from "@definitions/dto";

export async function getServices(): Promise<ServiceDto[]> {
  return secureGetData("https://appgrand.worldautogroup.ru/services");
}
