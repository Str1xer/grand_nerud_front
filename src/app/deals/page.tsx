"use client";

import { Page } from "@/components/blocks";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useAuthContext from "@/contexts/auth-context";
import { useDebounce } from "@/lib/debouncer";
import { formatCurrency } from "@/lib/formatters";
import { capitalizeFirstLetter } from "@/lib/typography";
import { dealsService } from "@/services";
import { DealDto } from "@definitions/dto";
import { Handshake, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DealsPage() {
  const router = useRouter();
  const { user } = useAuthContext();
  const [deals, setDeals] = useState<DealDto[]>([]);
  const [filteredDeals, setFilteredDeals] = useState<DealDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Фильтры
  const [stageFilter, setStageFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("all");

  useEffect(() => {
    if (!user) return;

    const fetchDeals = async () => {
      try {
        const data: DealDto[] = user.admin
          ? await dealsService.getDealsAdmin()
          : await dealsService.getDeals();

        const sorted = data.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setDeals(sorted);
        setFilteredDeals(sorted);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load deals");
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, [user]);

  const appliedFilters = useDebounce(
    { stage: stageFilter, service: serviceFilter, user: userFilter },
    300
  );
  useEffect(() => {
    let filtered = [...deals];

    if (appliedFilters.stage) {
      filtered =
        appliedFilters.stage === "all"
          ? filtered
          : filtered.filter((d) => d.stage?._id === appliedFilters.stage);
    }
    if (appliedFilters.service) {
      filtered =
        appliedFilters.service === "all"
          ? filtered
          : filtered.filter((d) => d.service?._id === appliedFilters.service);
    }
    if (appliedFilters.user) {
      filtered =
        appliedFilters.user === "all"
          ? filtered
          : filtered.filter((d) => d.user?._id === appliedFilters.user);
    }

    setFilteredDeals(filtered);
  }, [appliedFilters, deals]);

  return (
    <Page
      breadcrumbLinks={[
        {
          label: "Сделки",
          href: "/deals",
        },
      ]}
    >
      <div className="inline-flex justify-between w-full">
        <div className="inline-flex gap-4">
          <Select
            value={stageFilter}
            onValueChange={(val) => setStageFilter(val)}
          >
            <SelectTrigger className="w-[180px] shadow-none">
              <SelectValue placeholder="Выберите стадию" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Стадии</SelectLabel>
                <SelectItem key="all" value="all">
                  Все стадии
                </SelectItem>
                {deals
                  .map((d) => ({
                    title: d.stage?.name
                      ? capitalizeFirstLetter(d.stage.name)
                      : "Без названия",
                    value: d.stage?._id,
                  }))
                  .reduce((acc: { value: string; title: string }[], cv) => {
                    if (!acc.some((item) => item.value === cv.value)) {
                      acc.push(cv);
                    }
                    return acc;
                  }, [])
                  .map((stage) =>
                    stage.title ? (
                      <SelectItem
                        key={`stage-${stage.value}`}
                        value={stage.value}
                      >
                        {stage.title}
                      </SelectItem>
                    ) : null
                  )}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select
            value={serviceFilter}
            onValueChange={(val) => setServiceFilter(val)}
          >
            <SelectTrigger className="w-[180px] shadow-none">
              <SelectValue placeholder="Выберите стадию" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Услуги</SelectLabel>
                <SelectItem key="all" value="all">
                  Все услуги
                </SelectItem>
                {deals
                  .map((d) => ({
                    title: d.service?.name
                      ? capitalizeFirstLetter(d.service.name)
                      : "Без названия",
                    value: d.service?._id,
                  }))
                  .reduce((acc: { value: string; title: string }[], cv) => {
                    if (!acc.some((item) => item.value === cv.value)) {
                      acc.push(cv);
                    }
                    return acc;
                  }, [])
                  .map((service) =>
                    service ? (
                      <SelectItem
                        key={`service-${service.value}`}
                        value={service.value}
                      >
                        {service.title}
                      </SelectItem>
                    ) : null
                  )}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select
            value={userFilter}
            onValueChange={(val) => setUserFilter(val)}
          >
            <SelectTrigger className="w-[180px] shadow-none">
              <SelectValue placeholder="Выберите менеджера" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Менеджеры</SelectLabel>
                <SelectItem key="all" value="all">
                  Все менеджеры
                </SelectItem>
                {deals
                  .map((d) => ({
                    title: d.user?.name
                      ? capitalizeFirstLetter(d.user.name)
                      : "Без имени",
                    value: d.user?._id,
                  }))
                  .reduce((acc: { value: string; title: string }[], cv) => {
                    if (!acc.some((item) => item.value === cv.value)) {
                      acc.push(cv);
                    }
                    return acc;
                  }, [])
                  .map((manager) =>
                    manager.title ? (
                      <SelectItem
                        key={`manager-${manager.value}`}
                        value={manager.value}
                      >
                        {manager.title}
                      </SelectItem>
                    ) : null
                  )}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="inline-flex">
          <Button
            onClick={() => router.push("/deals/new-deal")}
            variant="default"
          >
            Создать сделку
          </Button>
        </div>
      </div>
      {loading && (
        <div className="w-full flex-auto inline-flex items-center justify-center h-[70svh]">
          <Spinner className="w-10 h-10 m-auto mt-1/2" />
        </div>
      )}
      {!loading && (
        <div className="overflow-hidden rounded-md border mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Дата создания</TableHead>
                <TableHead>Услуга</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Менеджер</TableHead>
                <TableHead>Сумма</TableHead>
                <TableHead>Дедлайн</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDeals.length === 0 && (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={6}>
                    <Empty>
                      <EmptyHeader>
                        <EmptyMedia variant="icon">
                          <Handshake />
                        </EmptyMedia>
                        <EmptyTitle>Нет данных</EmptyTitle>
                        <EmptyDescription>
                          Похоже, что у вас нет сделок с такими фильтрами
                        </EmptyDescription>
                      </EmptyHeader>
                      <EmptyContent>
                        <Button
                          onClick={() => router.push("/deals/new-deal")}
                          type="button"
                          className="pointer-events-auto"
                        >
                          Создать сделку
                        </Button>
                      </EmptyContent>
                    </Empty>
                  </TableCell>
                </TableRow>
              )}
              {filteredDeals.length > 0 &&
                filteredDeals.map((deal) => (
                  <TableRow key={deal._id}>
                    <TableCell>
                      {new Date(deal.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {deal.service
                        ? capitalizeFirstLetter(deal.service.name)
                        : "Не указано"}
                    </TableCell>
                    <TableCell>
                      {deal.stage
                        ? capitalizeFirstLetter(deal.stage.name)
                        : "Не указано"}
                    </TableCell>
                    <TableCell>{deal.user?.name}</TableCell>
                    <TableCell>{formatCurrency(deal.totalAmount)}</TableCell>
                    <TableCell>
                      <div className="inline-flex w-full justify-between items-center">
                        {deal.deadline
                          ? new Date(deal.deadline).toLocaleDateString()
                          : "Не указано"}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Действия</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => router.push(`/deals/${deal._id}`)}
                            >
                              Подробнее
                            </DropdownMenuItem>
                            <DropdownMenuItem>Редактировать</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      )}
    </Page>
  );
}
