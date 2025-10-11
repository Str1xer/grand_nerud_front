"use client";

import useAuthContext from "@/contexts/auth-context";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { loading } = useAuthContext();

  useEffect(() => {
    if (!loading) {
      router.replace("/deals");
    }
  }, [loading]);

  return null;
}
