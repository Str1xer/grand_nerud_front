"use client";

import { AuthForm } from "@/app/components/AuthForm";
import useAuthContext from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { user, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/deals");
    }
  }, [user, router]);

  if (loading) return <div>Проверка авторизации...</div>;
  if (user) return null;

  return (
    // <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <AuthForm type="login" />
    // </div>
  );
}
