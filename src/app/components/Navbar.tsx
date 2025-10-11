"use client";

import useAuthContext from "@/contexts/auth-context";
import Link from "next/link";

export const Navbar = () => {
  const { user, logout } = useAuthContext();

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Гранд-неруд CRM
        </Link>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link href="/deals" className="hover:text-gray-300">
                Мои сделки
              </Link>
              {user.admin && (
                <Link href="/admin" className="hover:text-gray-300">
                  Админ-панель
                </Link>
              )}
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
              >
                Выйти
              </button>
              <span className="text-gray-300">{user.email}</span>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-gray-300">
                Вход
              </Link>
              <Link href="/register" className="hover:text-gray-300">
                Регистрация
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
