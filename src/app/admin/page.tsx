"use client";

import useAuthContext from "@/contexts/auth-context";
import { DealDto, UserDto } from "@definitions/dto";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const { user } = useAuthContext();
  const [users, setUsers] = useState<UserDto[]>([]);
  const [allDeals, setAllDeals] = useState<DealDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || !user.admin) return;

    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [usersRes, dealsRes] = await Promise.all([
          fetch("https://appgrand.worldautogroup.ru/auth/all", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("https://appgrand.worldautogroup.ru/deals/admin/get", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!usersRes.ok || !dealsRes.ok) {
          throw new Error("Failed to fetch admin data");
        }

        const [usersData, dealsData] = await Promise.all([
          usersRes.json(),
          dealsRes.json(),
        ]);

        setUsers(usersData);
        setAllDeals(dealsData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load admin data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [user]);

  if (!user) {
    return (
      <div className="text-center py-10">
        <p>Пожалуйста, войдите чтобы получить доступ</p>
      </div>
    );
  }

  if (!user.admin) {
    return (
      <div className="text-center py-10">
        <p>У вас нет прав доступа к этой странице</p>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center py-10">Загрузка админ-панели...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Админ-панель</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            Пользователи ({users.length})
          </h2>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user._id} className="border-b pb-2">
                <p className="font-medium">{user.email}</p>
                <p className="text-sm text-gray-500">ID: {user._id}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            Все сделки ({allDeals.length})
          </h2>
          <div className="space-y-4">
            {allDeals.map((deal) => (
              <div key={deal._id} className="border-b pb-2">
                <p className="font-medium">Сделка #{deal._id.slice(0, 6)}</p>
                <p className="text-sm">
                  Пользователь: {deal.userId.slice(0, 6)}...
                </p>
                <p className="text-sm">Сумма: {deal.totalAmount || 0} ₽</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Статистика</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">Всего сделок</p>
            <p className="text-2xl font-bold">{allDeals.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-800">Активные сделки</p>
            <p className="text-2xl font-bold">
              {allDeals.filter((d) => !!d.deletedAt).length}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-800">Общая сумма</p>
            <p className="text-2xl font-bold">
              {allDeals
                .reduce((sum, deal) => sum + (deal.totalAmount || 0), 0)
                .toLocaleString()}{" "}
              ₽
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
