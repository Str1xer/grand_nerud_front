"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useAuthContext from "@/contexts/auth-context";
import { useDebounce } from "@/lib/debouncer";
import { dealsService } from "@/services";
import { DealDto } from "@definitions/dto";
import { applyDealFilters } from "@features/deals/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ManagerFilter,
  MaterialFilter,
  ServiceFilter,
  StageFilter,
} from "../filters";
import { DealRow, DealsDataEmpty } from "./";

export default function DealsDataTable({}: {}) {
  const router = useRouter();
  const { user } = useAuthContext();
  const [deals, setDeals] = useState<DealDto[]>([]);
  const [filteredDeals, setFilteredDeals] = useState<DealDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleFetchDeals = () => {
    if (user === null) return;
    (user.admin ? dealsService.getDealsAdmin() : dealsService.getDeals())
      .then((data) =>
        setDeals(
          data.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        )
      )
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load deals")
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    handleFetchDeals();
  }, [user]);

  // Filters
  const [stageFilter, setStageFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("all");
  const [materialFilter, setMaterialFilter] = useState("all");

  const filters = useDebounce(
    {
      stage: stageFilter,
      service: serviceFilter,
      user: userFilter,
      material: materialFilter,
    },
    300
  );

  useEffect(() => {
    setFilteredDeals(applyDealFilters(deals, filters));
  }, [filters, deals]);

  return (
    <>
      <div className="inline-flex justify-between w-full">
        <div className="inline-flex gap-2.5">
          <ServiceFilter value={serviceFilter} onChange={setServiceFilter} />
          <StageFilter value={stageFilter} onChange={setStageFilter} />
          <ManagerFilter
            deals={deals}
            value={userFilter}
            onChange={setUserFilter}
          />
          <MaterialFilter value={materialFilter} onChange={setMaterialFilter} />
        </div>
        <div className="inline-flex">
          <Button
            onClick={() => router.push("/deals/create")}
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
                <TableHead>Услуга</TableHead>
                <TableHead>Материал</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Менеджер</TableHead>
                <TableHead>Сумма</TableHead>
                <TableHead>Дата создания</TableHead>
                <TableHead>Дедлайн</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDeals.length === 0 && <DealsDataEmpty />}
              {filteredDeals.length > 0 &&
                filteredDeals.map((deal) => (
                  <DealRow key={deal._id} deal={deal} />
                ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}
