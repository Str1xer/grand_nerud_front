"use client";

import useAuthContext from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { loading } = useAuthContext();

  useEffect(() => {
    if (!loading) {
      router.replace("/deals");
    }
  }, [router, loading]);

  return null;
}
