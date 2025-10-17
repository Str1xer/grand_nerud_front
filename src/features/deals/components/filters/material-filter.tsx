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
import { materialsService } from "@/services";
import { useEffect, useState } from "react";

export default function MaterialFilter({
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
    materialsService
      .getMaterials()
      .then((materials) =>
        setOptions(
          materials.map((mat) => ({
            label: mat.name,
            value: mat._id,
          }))
        )
      )
      .catch((err) =>
        console.log(err instanceof Error ? err.message : "Failed to load deals")
      );
  }, []);

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px] shadow-none">
        <SelectValue placeholder="Выберите материал" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Материалы</SelectLabel>
          <SelectItem key="all" value="all">
            Все материалы
          </SelectItem>
          {options.map((option) =>
            option ? (
              <SelectItem key={`material-${option.value}`} value={option.value}>
                {capitalizeFirstLetter(option.label)}
              </SelectItem>
            ) : null
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
