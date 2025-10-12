"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { capitalizeFirstLetter } from "@/lib/typography";
import { servicesService } from "@/services";
import { useEffect, useState } from "react";

export default function ServiceFilter({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [options, setOptions] = useState<{ label: string; value: string }[]>(
    []
  );

  useEffect(() => {
    servicesService.getServices().then((services) =>
      setOptions(
        services.map((serv) => ({
          label: serv.name,
          value: serv._id,
        }))
      )
    );
  }, []);

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px] shadow-none">
        <SelectValue placeholder="Выберите стадию" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Услуги</SelectLabel>
          <SelectItem key="all" value="all">
            Все услуги
          </SelectItem>
          {options.map((option) =>
            option ? (
              <SelectItem key={`service-${option.value}`} value={option.value}>
                {capitalizeFirstLetter(option.label)}
              </SelectItem>
            ) : null
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
