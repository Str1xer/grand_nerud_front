import { secureGetData } from "@/lib/fetch";
import { MaterialDto } from "@definitions/dto";

export async function getMaterials(): Promise<MaterialDto[]> {
  return secureGetData("https://appgrand.worldautogroup.ru/materials");
}
