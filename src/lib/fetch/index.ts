import { getCookie } from "../cookies";

export async function getData(url: string, options: RequestInit = {}) {
  if (window !== undefined) {
    console.warn("getData should be used in a browser environment only");
  }

  const response = await fetch(url, {
    ...options,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.detail || `HTTP error! status: ${response.status}`
    );
  }

  return response.json();
}

export async function secureGetData(url: string, options: RequestInit = {}) {
  if (window !== undefined) {
    console.warn("secureGetData should be used in a browser environment only");
  }

  const token = getCookie("tg_news_bot_access_token");

  const response = await fetch(url, {
    ...options,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { "x-user-id": token }),
      ...options.headers,
    },
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.detail || `HTTP error! status: ${response.status}`
    );
  }

  return response.json();
}

export async function securePostData(
  url: string,
  data: any,
  options: RequestInit = {}
) {
  if (window !== undefined) {
    console.warn("securePostData should be used in a browser environment only");
  }

  const token = getCookie("tg_news_bot_access_token");

  return fetch(url, {
    ...options,
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      ...(token && { "x-user-id": token }),
      ...options.headers,
    },
    credentials: "include",
  });
}
