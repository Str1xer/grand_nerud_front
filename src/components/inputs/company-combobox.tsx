"use client";

import { CompanyDto } from "@definitions/dto";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Input } from "../ui/input";

export function CompanyCombobox({
  companies,
  value = "",
  onChange = () => {},
}: {
  companies: CompanyDto[];
  value?: string;
  onChange?: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <Input
        readOnly
        value={companies.find((el) => el._id === value)?.name || ""}
        placeholder="Выберите компанию"
        onFocus={(e) => {
          e.target.blur();
          setOpen(true);
        }}
        className="truncate overflow-hidden"
      />
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Вводите название компании..." />
        <CommandList>
          <CommandEmpty>Нет компаний с похожим названием.</CommandEmpty>
          <CommandGroup heading="Копании">
            {companies.map((company) => (
              <CommandItem key={company._id}>
                <div
                  className="flex flex-col overflow-hidden"
                  onClick={() => {
                    onChange(company._id);
                    setOpen(false);
                  }}
                >
                  <p className="w-full truncate">{company.name}</p>
                  <div className="inline-flex mt-1">
                    <p className="text-sm text-slate-500">{company.inn}</p>
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
        <div className="py-2 px-2">
          <Button variant="outline" className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Добавить компанию
          </Button>
        </div>
      </CommandDialog>
    </>
  );
}
