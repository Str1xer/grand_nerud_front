"use client";

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function FinancialInformationSection({
  formData,
}: {
  formData: any;
}) {
  if (!formData.serviceId || !formData.companyId) {
    return null;
  }

  return (
    <FieldSet>
      <FieldLegend>Финансовая информация</FieldLegend>
      <FieldDescription>
        Заполните финансовую информацию о сделке ниже.
      </FieldDescription>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="paymentMethod">Тип расчета</FieldLabel>
          <Select
            name="paymentMethod"
            value={formData.paymentMethod}
            onValueChange={(e) =>
              formData.setPaymentMethod(
                e as "безналичный расчет" | "наличный расчет"
              )
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Выберите тип расчета" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="безналичный расчет">Наличные</SelectItem>
                <SelectItem value="наличный расчет">Безналичные</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
        <div className="grid grid-cols-3 gap-4">
          <Field>
            <FieldLabel htmlFor="profit">Надбавка фирмы</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <InputGroupText>₽</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                name="profit"
                value={formData.total.companyProfit}
                disabled
                onChange={(e) => {
                  const formatted = e.target.value.replace(/[^0-9]/g, "");
                  formData.setAmountPerUnit(Number(formatted));
                }}
                placeholder="0.00"
              />
            </InputGroup>
          </Field>
          <Field>
            <FieldLabel htmlFor="managerProfit">Доход менеджера</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <InputGroupText>₽</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                name="managerProfit"
                value={formData.total.managerProfit}
                disabled
                readOnly
                placeholder="0.00"
              />
            </InputGroup>
          </Field>
        </div>
      </FieldGroup>
    </FieldSet>
  );
}
