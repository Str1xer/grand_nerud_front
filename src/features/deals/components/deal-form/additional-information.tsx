"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import { ru } from "react-day-picker/locale";
import { DealDataFormHook } from "./data-form-hook";

export default function AdditionalInformationSection({
  formData,
}: {
  formData: DealDataFormHook;
}) {
  const [open, setOpen] = useState(false);

  if (!formData.serviceId || !formData.customerId) {
    return null;
  }

  return (
    <FieldSet>
      <FieldLegend>Дополнительно</FieldLegend>
      <FieldDescription>
        Заполните дополнительную информацию о сделке ниже.
      </FieldDescription>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="deadline">Срок выполнения</FieldLabel>
          <div className="flex flex-row gap-4 justify-start">
            <div className="flex flex-row gap-2.5">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="date-picker"
                    className="w-40 justify-between font-normal"
                  >
                    {formData.deliveryDate
                      ? formData.deliveryDate.toLocaleDateString()
                      : "Выбрать дату"}
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                >
                  <Calendar
                    locale={ru}
                    mode="single"
                    onSelect={(date) => {
                      formData.setDeliveryDate(date);
                      setOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="inline-flex gap-2">
              <Input
                value={formData.deliveryTime}
                onChange={(e) => formData.setDeliveryTime(e.target.value)}
                name="time"
                type="time"
                step="1"
                className="bg-background max-w-[6rem] appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
            </div>
          </div>
        </Field>
      </FieldGroup>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="notes">Примечания</FieldLabel>
          <Textarea
            value={formData.notes}
            onChange={(e) => formData.setNotes(e.target.value)}
            id="notes"
            placeholder="Введите примечания"
          />
        </Field>
      </FieldGroup>
    </FieldSet>
  );
}
