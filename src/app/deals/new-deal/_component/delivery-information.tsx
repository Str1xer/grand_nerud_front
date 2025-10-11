"use client";

import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export default function DeliveryInformationSection({
  formData,
}: {
  formData: any;
}) {
  if (!formData.serviceId || !formData.companyId) {
    return null;
  }

  return (
    <FieldSet>
      <FieldLegend>Доставка</FieldLegend>
      <FieldDescription>
        Заполните информацию о доставке ниже.
      </FieldDescription>
      <FieldGroup>
        {formData.serviceId === "687a88e6b6b13b70b6a575f4" && (
          <div className="flex items-center space-x-2">
            <Switch
              checked={formData.deliveryOssig}
              onClick={() => formData.setDeliveryOssig(!formData.deliveryOssig)}
              name="ossig"
            />
            <Label htmlFor="ossig">ОССиГ</Label>
          </div>
        )}
        {formData.serviceId === "687a88dfb6b13b70b6a575f3" && (
          <Field>
            <FieldLabel htmlFor="receivingMethod">
              Способ получения товара
            </FieldLabel>
            <Select
              name="receivingMethod"
              value={formData.receivingMethod}
              onValueChange={(e) =>
                formData.setReceivingMethod(e as "самовывоз" | "доставка")
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Выберите способ получения" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="доставка">Доставка</SelectItem>
                  <SelectItem value="самовывоз">Самовывоз</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        )}
        <Field>
          <FieldLabel htmlFor="shippingAddress">Адрес доставки</FieldLabel>
          <Input
            name="shippingAddress"
            value={formData.deliveryAddress}
            onChange={(e) => formData.setDeliveryAddress(e.target.value)}
            type="text"
            placeholder="Введите адрес доставки"
          />
        </Field>
      </FieldGroup>
    </FieldSet>
  );
}
