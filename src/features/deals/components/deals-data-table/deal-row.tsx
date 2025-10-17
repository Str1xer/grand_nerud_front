"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/formatters";
import { capitalizeFirstLetter } from "@/lib/typography";
import { DealDto } from "@definitions/dto";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DealRow({ deal }: { deal: DealDto }) {
  const router = useRouter();

  return (
    <TableRow key={deal._id}>
      <TableCell>
        {deal.service ? capitalizeFirstLetter(deal.service.name) : "Не указано"}
      </TableCell>
      <TableCell>
        {deal.material
          ? capitalizeFirstLetter(deal.material.name)
          : "Не указано"}
      </TableCell>
      <TableCell>
        {deal.stage ? capitalizeFirstLetter(deal.stage.name) : "Не указано"}
      </TableCell>
      <TableCell>{deal.user?.name}</TableCell>
      <TableCell>{formatCurrency(deal.totalAmount)}</TableCell>
      <TableCell>{new Date(deal.createdAt).toLocaleDateString()}</TableCell>
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
              <DropdownMenuItem
                onClick={() => router.push(`/deals/${deal._id}/edit`)}
              >
                Редактировать
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
}
