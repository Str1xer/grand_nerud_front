"use client";

import { Page } from "@/components/blocks";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableRow,
} from "@/components/ui/table";
import useAuthContext from "@/contexts/auth-context";
import { formatCurrency } from "@/lib/formatters";
import { capitalizeFirstLetter } from "@/lib/typography";
import { DealDto } from "@definitions/dto";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function DealDetailPage() {
  const { id } = useParams();
  const { user } = useAuthContext();
  const [deal, setDeal] = useState<DealDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getCookie = (name: string) => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${name}=`))
      ?.split("=")[1];
  };

  useEffect(() => {
    if (!user) return;

    const fetchDeal = async () => {
      try {
        const token = getCookie("tg_news_bot_access_token");

        const response = await fetch(
          `https://appgrand.worldautogroup.ru/deals/${id}`,
          {
            headers: {
              ...(token && { "x-user-id": token }),
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch deal");
        }

        const dealData = await response.json();
        setDeal(dealData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load deal");
      } finally {
        setLoading(false);
      }
    };

    fetchDeal();
  }, [id, user]);

  if (!user) {
    return (
      <div className="text-center py-10">
        <p>Пожалуйста, войдите чтобы просмотреть сделку</p>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center py-10">Загрузка данных сделки...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  if (!deal) {
    return <div className="text-center py-10">Сделка не найдена</div>;
  }

  return (
    <Page
      breadcrumbLinks={[
        {
          label: "Сделки",
          href: "/deals",
        },
        {
          label: `Сделка #${deal._id}`,
          href: `/deals/${deal._id}`,
        },
      ]}
    >
      <Table>
        <TableBody>
          <TableRow>
            <TableCell
              className="font-medium text-lg pointer-events-none"
              colSpan={2}
            >
              Основная информация
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium w-1/3">Тип услуги</TableCell>
            <TableCell>
              {deal.service
                ? capitalizeFirstLetter(deal.service.name)
                : "Не указано"}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium w-1/3">Статус</TableCell>
            <TableCell>
              {deal.stage
                ? capitalizeFirstLetter(deal.stage.name)
                : "Не указано"}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium w-1/3">Менеджер</TableCell>
            <TableCell>
              {capitalizeFirstLetter(deal.user?.name || "Не указано")}{" "}
              {deal.user?.email}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium w-1/3">Дата создания</TableCell>
            <TableCell>
              {new Date(deal.createdAt).toLocaleDateString("ru-RU")}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell
              className="font-medium text-lg pointer-events-none"
              colSpan={2}
            >
              Финансовая информация
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium w-1/3">Сумма закупки</TableCell>
            <TableCell>{formatCurrency(deal.amountPurchase)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium w-1/3">Доставка</TableCell>
            <TableCell>{formatCurrency(deal.amountDelivery)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium w-1/3">
              Прибыль компании
            </TableCell>
            <TableCell>{formatCurrency(deal.companyProfit)}</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell className="w-1/3">Итого</TableCell>
            <TableCell>{formatCurrency(deal.totalAmount)}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell
              className="font-medium text-lg pointer-events-none"
              colSpan={2}
            >
              Дополнительная информация
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium w-1/3">Способ оплаты</TableCell>
            <TableCell>{capitalizeFirstLetter(deal.paymentMethod)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium w-1/3">
              Способ получения
            </TableCell>
            <TableCell>{capitalizeFirstLetter(deal.methodReceiving)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium w-1/3">Дедлайн</TableCell>
            <TableCell>
              {deal.deadline
                ? new Date(deal.deadline).toLocaleDateString("ru-RU")
                : "Не указано"}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium w-1/3">ОССиГ</TableCell>
            <TableCell>{deal.OSSIG ? "Да" : "Нет"}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium w-1/3">Примечания</TableCell>
            <TableCell>{deal.notes || "Нет примечаний"}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <div className="inline-flex gap-2.5 mt-6">
        <Button variant="destructive" onClick={() => window.history.back()}>
          Удалить
        </Button>
        <Button
          onClick={() => alert("Редактирование сделки пока не реализовано")}
        >
          Редактировать
        </Button>
      </div>
    </Page>
  );
}
