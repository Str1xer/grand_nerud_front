import { secureGetData } from "@/lib/fetch";
import { StageDto } from "@definitions/dto";

export async function getStages(): Promise<StageDto[]> {
  return secureGetData("https://appgrand.worldautogroup.ru/stages");
}
