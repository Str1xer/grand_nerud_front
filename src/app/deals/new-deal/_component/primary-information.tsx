"use client";

import { CompanyCombobox } from "@/components/inputs/company-combobox";
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
import { capitalizeFirstLetter } from "@/lib/typography";
import {
    CompanyDto,
    MaterialDto,
    ServiceDto,
    StageDto,
} from "@definitions/dto";

export default function PrimaryInformationSection({
  formData,
  services,
  companies,
  stages,
  materials,
}: {
  formData: any;
  services: ServiceDto[];
  companies: CompanyDto[];
  stages: StageDto[];
  materials: MaterialDto[];
}) {
  return (
    <FieldSet>
      <FieldLegend>Основная информация</FieldLegend>
      <FieldDescription>
        Заполните основную информацию о сделке ниже.
      </FieldDescription>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="customer">Заказчик</FieldLabel>
          <CompanyCombobox
            value={formData.companyId}
            onChange={formData.setCompanyId}
            companies={companies || []}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="service">Услуга</FieldLabel>
          <Select
            value={formData.serviceId}
            onValueChange={formData.setServiceId}
            name="service"
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Выберите услугу" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {services.map((service) => (
                  <SelectItem
                    key={`service-${service._id}`}
                    value={service._id}
                  >
                    {capitalizeFirstLetter(service.name)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
        {!!formData.serviceId && !!formData.companyId && (
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="stage">Этап сделки</FieldLabel>
              <Select
                name="stage"
                value={formData.stageId}
                onValueChange={formData.setStageId}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Выберите этап" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {stages.map((stage) => (
                      <SelectItem key={`stage-${stage._id}`} value={stage._id}>
                        {capitalizeFirstLetter(stage.name)}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="material">Материал</FieldLabel>
              <Select
                name="material"
                value={formData.materialId}
                onValueChange={formData.setMaterialId}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Выберите материал" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {materials.map((material) => (
                      <SelectItem
                        key={`material-${material._id}`}
                        value={material._id}
                      >
                        {capitalizeFirstLetter(material.name)}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </div>
        )}
        {!!formData.serviceId && !!formData.companyId && (
          <div className="grid grid-cols-3 gap-4">
            <div className="grid grid-cols-2 gap-2.5">
              <Field>
                <FieldLabel htmlFor="measurementUnit">
                  Единица измерения
                </FieldLabel>
                <Select
                  name="measurementUnit"
                  value={formData.measurementUnit}
                  onValueChange={(e) =>
                    formData.setMeasurementUnit(e as "тонна" | "куб.м" | "шт")
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Выберите единицу измерения" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="тонна">Тонна</SelectItem>
                      <SelectItem value="куб.м">Кубический метр</SelectItem>
                      <SelectItem value="шт">Штука</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="quantity">Количество</FieldLabel>
                <Input
                  type="number"
                  name="quantity"
                  placeholder="Введите количество"
                  value={formData.quantity}
                  onChange={(e) => {
                    const formatted = e.target.value.replace(/[^0-9]/g, "");
                    formData.setQuantity(Number(formatted));
                  }}
                />
              </Field>
            </div>
            {formData.serviceId === "687a88dfb6b13b70b6a575f3" && (
              <Field>
                <FieldLabel htmlFor="amountPerUnit">Цена за единицу</FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <InputGroupText>₽</InputGroupText>
                  </InputGroupAddon>
                  <InputGroupInput
                    name="amountPerUnit"
                    value={formData.amountPerUnit}
                    onChange={(e) => {
                      const formatted = e.target.value.replace(/[^0-9]/g, "");
                      formData.setAmountPerUnit(Number(formatted));
                    }}
                    placeholder="0.00"
                  />
                </InputGroup>
              </Field>
            )}
            {formData.serviceId === "687a88dfb6b13b70b6a575f3" && (
              <Field>
                <FieldLabel htmlFor="purchaseTotal">
                  Итоговая сумма закупки
                </FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <InputGroupText>₽</InputGroupText>
                  </InputGroupAddon>
                  <InputGroupInput
                    name="purchaseTotal"
                    value={formData.total.purchase}
                    disabled
                    onChange={(e) => {
                      const formatted = e.target.value.replace(/[^0-9]/g, "");
                      formData.setAmountPerUnit(Number(formatted));
                    }}
                    placeholder="0.00"
                  />
                </InputGroup>
              </Field>
            )}
          </div>
        )}
      </FieldGroup>
    </FieldSet>
  );
}
