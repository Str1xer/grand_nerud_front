import { secureGetData } from "@/lib/fetch";
import { UserDto } from "@definitions/dto";

export async function getUsers(): Promise<UserDto[]> {
  return secureGetData("https://appgrand.worldautogroup.ru/users");
}
