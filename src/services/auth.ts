import { secureGetData, securePostData } from "@/lib/fetch";

export async function getMe() {
  return secureGetData("https://appgrand.worldautogroup.ru/auth/me");
}

export async function logout() {
  return securePostData("https://appgrand.worldautogroup.ru/auth/logout", {});
}
