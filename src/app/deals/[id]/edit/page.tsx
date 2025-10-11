"use client";

import { DealDto } from "@definitions/dto";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditDealPage() {
  const router = useRouter();
  const params = useParams();
  const dealId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [deal, setDeal] = useState<DealDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [notes, setNotes] = useState("");
  const [stageId, setStageId] = useState("");
  const [unitMeasurement, setUnitMeasurement] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [methodReceiving, setMethodReceiving] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [amountPurchase, setAmountPurchase] = useState(0);
  const [amountDelivery, setAmountDelivery] = useState(0);
  const [companyProfit, setCompanyProfit] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [managerProfit, setManagerProfit] = useState(0);
  const [ossig, setOssig] = useState(false);
  const [deadline, setDeadline] = useState("");
  const [material, setMaterial] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [serviceName, setServiceName] = useState("");

  const [stages, setStages] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);

  const getCookie = (name: string) => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${name}=`))
      ?.split("=")[1];
  };

  useEffect(() => {
    const fetchRefs = async () => {
      const token = getCookie("tg_news_bot_access_token");
      const headers: HeadersInit = token ? { "x-user-id": token } : {};
      const [s, m, c, a] = await Promise.all([
        fetch("https://appgrand.worldautogroup.ru/stages", { headers }),
        fetch("https://appgrand.worldautogroup.ru/materials", { headers }),
        fetch("https://appgrand.worldautogroup.ru/customers", { headers }),
        fetch("https://appgrand.worldautogroup.ru/addresses", { headers }),
      ]);
      const stagesData = await s.json();
      setStages(Array.isArray(stagesData) ? stagesData : []);
      const materialsData = await m.json();
      setMaterials(Array.isArray(materialsData) ? materialsData : []);
      const customersData = await c.json();
      setCustomers(Array.isArray(customersData) ? customersData : []);
      const addressesData = await a.json();
      setAddresses(Array.isArray(addressesData) ? addressesData : []);
    };
    fetchRefs();
  }, []);

  useEffect(() => {
    const fetchDeal = async () => {
      try {
        const token = getCookie("tg_news_bot_access_token");
        const response = await fetch(
          `https://appgrand.worldautogroup.ru/deals/${dealId}`,
          {
            headers: {
              ...(token && { "x-user-id": token }),
            },
          }
        );

        if (!response.ok) throw new Error("Не удалось загрузить сделку");

        const data = await response.json();
        setDeal(data);
        setNotes(data.notes || "");
        setStageId(data.stageId || "");
        setUnitMeasurement(data.unitMeasurement || "");
        setQuantity(data.quantity || 0);
        setMethodReceiving(data.methodReceiving || "");
        setPaymentMethod(data.paymentMethod || "");
        setAmountPurchase(data.amountPurchase || 0);
        setAmountDelivery(data.amountDelivery || 0);
        setCompanyProfit(data.companyProfit || 0);
        setTotalAmount(data.totalAmount || 0);
        setManagerProfit(data.managerProfit || 0);
        setOssig(data.OSSIG || false);
        setDeadline(data.deadline?.slice(0, 10) || "");
        setMaterial(data.materialId || "");
        setShippingAddress(data.shippingAddressId || "");
        setDeliveryAddress(data.deliveryAddressId || "");
        setCustomerName(data.customer?.name || "");
        setCreatedAt(data.createdAt?.slice(0, 10) || "");
        setServiceName(data.service?.name || "");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ошибка при загрузке");
      } finally {
        setLoading(false);
      }
    };
    if (dealId) fetchDeal();
  }, [dealId]);

  useEffect(() => {
    const total =
      Number(amountPurchase) + Number(amountDelivery) + Number(companyProfit);
    setTotalAmount(total);
  }, [amountPurchase, amountDelivery, companyProfit]);

  const handleSave = async () => {
    if (!stageId || !paymentMethod || quantity <= 0) {
      alert("Пожалуйста, заполните обязательные поля");
      return;
    }

    setSaving(true);
    try {
      const token = getCookie("tg_news_bot_access_token");
      const response = await fetch(
        `https://appgrand.worldautogroup.ru/deals/${dealId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(token && { "x-user-id": token }),
          },
          body: JSON.stringify({
            notes,
            stageId,
            unitMeasurement,
            quantity,
            methodReceiving,
            paymentMethod,
            amountPurchase,
            amountDelivery,
            companyProfit,
            totalAmount,
            managerProfit,
            deadline,
            OSSIG: ossig,
            shippingAddressId: shippingAddress,
            deliveryAddressId: deliveryAddress,
            materialId: material,
          }),
        }
      );

      if (!response.ok) throw new Error("Не удалось сохранить изменения");
      router.push("/deals");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Ошибка при сохранении");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8">Загрузка сделки...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!deal) return <div className="p-8">Сделка не найдена</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 bg-white shadow rounded-lg">
      <h1 className="text-xl font-semibold text-gray-800 mb-4">
        Редактирование сделки
      </h1>
      <span className="inline-flex items-center gap-x-1.5 py-2 px-3 rounded-full text-xs font-medium border border-blue-600 text-blue-600 dark:text-blue-500">
        {serviceName.toUpperCase()}
      </span>
      <h3 className="text-xl font-semibold text-gray-500 mb-4">
        {serviceName}
      </h3>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 text-sm leading-relaxed">
        {/* Дата создания и Тип услуги — просто текст, без input */}
        <div className="flex flex-col justify-center">
          <span className="text-gray-600 font-medium">Дата создания</span>
          <span className="mt-1 text-gray-800">{createdAt || "—"}</span>
        </div>

        <div className="flex flex-col">
          <label className="text-gray-600 font-medium mb-2">Заказчик</label>
          <input
            value={customerName}
            disabled
            placeholder="ФИО или компания"
            className="input w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 disabled:text-gray-600"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-600 font-medium mb-2">
            Стадия сделки
          </label>
          <select
            value={stageId}
            onChange={(e) => setStageId(e.target.value)}
            className="input w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Выбрать стадию</option>
            {stages.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col justify-center">
          <span className="text-gray-600 font-medium">Тип услуги</span>
          <span className="mt-1 text-gray-800">{serviceName || "—"}</span>
        </div>

        <div className="flex flex-col">
          <label className="text-gray-600 font-medium mb-2">Материал</label>
          <select
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            className="input w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Выбрать материал</option>
            {materials.map((m) => (
              <option key={m._id} value={m._id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-gray-600 font-medium mb-2">
            Единица измерения
          </label>
          <input
            value={unitMeasurement}
            onChange={(e) => setUnitMeasurement(e.target.value)}
            placeholder="Напр. кг, литры"
            className="input w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-600 font-medium mb-2">Количество</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            placeholder="0"
            className="input w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-600 font-medium mb-2">Тип расчета</label>
          <input
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            placeholder="нал / безнал"
            className="input w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {serviceName === "продажа сырья" && (
          <div className="flex flex-col">
            <label className="text-gray-600 font-medium mb-2">
              Способ получения
            </label>
            <input
              value={methodReceiving}
              onChange={(e) => setMethodReceiving(e.target.value)}
              placeholder="доставка / самовывоз"
              className="input w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        <div className="flex flex-col">
          <label className="text-gray-600 font-medium mb-2">
            Адрес отправления
          </label>
          <select
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            className="input w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Выбрать адрес</option>
            {addresses.map((a) => (
              <option key={a._id} value={a._id}>
                {a.address}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-gray-600 font-medium mb-2">
            Адрес доставки
          </label>
          <select
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            className="input w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Выбрать адрес</option>
            {addresses.map((a) => (
              <option key={a._id} value={a._id}>
                {a.address}
              </option>
            ))}
          </select>
        </div>

        {serviceName === "продажа сырья" && (
          <div className="flex flex-col">
            <label className="text-gray-600 font-medium mb-2">
              Сумма закупки
            </label>
            <input
              type="number"
              value={amountPurchase}
              onChange={(e) => setAmountPurchase(Number(e.target.value))}
              className="input w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        <div className="flex flex-col">
          <label className="text-gray-600 font-medium mb-2">
            Сумма доставки
          </label>
          <input
            type="number"
            value={amountDelivery}
            onChange={(e) => setAmountDelivery(Number(e.target.value))}
            className="input w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-600 font-medium mb-2">
            Надбавка фирме
          </label>
          <input
            type="number"
            value={companyProfit}
            onChange={(e) => setCompanyProfit(Number(e.target.value))}
            className="input w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-600 font-medium mb-2">
            Итоговая сумма
          </label>
          <input
            type="number"
            value={totalAmount}
            disabled
            className="input w-full px-3 py-2 border rounded bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-600 font-medium mb-2">
            Доход менеджеру
          </label>
          <input
            type="number"
            value={managerProfit}
            onChange={(e) => setManagerProfit(Number(e.target.value))}
            className="input w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-600 font-medium mb-2">Дедлайн</label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="input w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {serviceName === "утилизация" && (
          <div className="flex items-center gap-2 col-span-full text-gray-600">
            <input
              type="checkbox"
              checked={ossig}
              onChange={(e) => setOssig(e.target.checked)}
              className="cursor-pointer"
            />
            <label className="cursor-pointer select-none">ОССиГ</label>
          </div>
        )}
      </div>

      <div className="flex flex-col">
        <label className="text-gray-600 font-medium mb-2">Заметки</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
          placeholder="Дополнительная информация по сделке"
        />
      </div>

      <div className="bg-gray-50 border rounded px-4 py-3 text-sm text-gray-700 space-y-1">
        <p>
          <strong>Итог сделки:</strong>
        </p>
        <p>Сумма закупки: {amountPurchase} ₽</p>
        <p>Логистика: {amountDelivery} ₽</p>
        <p>Надбавка: {companyProfit} ₽</p>
        <p>Итоговая сумма заказчику: {totalAmount} ₽</p>
        <p>Доход менеджеру: {managerProfit} ₽</p>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm px-6 py-2 rounded shadow w-full sm:w-auto sm:px-8 sm:py-2 flex justify-between items-center"
      >
        <span>💾 Сохранить изменения</span>
        {saving && (
          <svg
            className="animate-spin h-5 w-5 ml-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
        )}
      </button>
    </div>
  );
}
function useAuth(): { user: any } {
  throw new Error("Function not implemented.");
}
