"use client";

import { dealsService } from "@/services";
import { DealDto } from "@definitions/dto";
import DealForm from "@features/deals/components/deal-form/deal-form";
import { useEffect, useState } from "react";

export default function EditDealForm({ dealId }: { dealId: string }) {
  const [deal, setDeal] = useState<DealDto | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!dealId) return;

    dealsService
      .getDeal(dealId)
      .then((data) => {
        setDeal(data);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Ошибка при загрузке");
      })
      .finally(() => setLoading(false));
  }, [dealId]);

  if (loading) return <div className="p-8">Загрузка сделки...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!deal) return <div className="p-8">Сделка не найдена</div>;

  return <DealForm defaultDeal={deal} />;
}
