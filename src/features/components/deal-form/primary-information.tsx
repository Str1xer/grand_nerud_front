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
  companiesService,
  materialsService,
  servicesService,
  stagesService,
} from "@/services";
import {
  CompanyDto,
  MaterialDto,
  ServiceDto,
  StageDto,
} from "@definitions/dto";
import { useEffect, useState } from "react";

export default function PrimaryInformationSection({
  formData,
}: {
  formData: any;
}) {
  const [services, setServices] = useState<ServiceDto[]>([]);
  const [companies, setCompanies] = useState<CompanyDto[]>([]);
  const [stages, setStages] = useState<StageDto[]>([]);
  const [materials, setMaterials] = useState<MaterialDto[]>([]);

  useEffect(() => {
    Promise.all([
      servicesService.getServices(),
      stagesService.getStages(),
      materialsService.getMaterials(),
      companiesService.getCompanies(),
    ]).then(([servicesData, stagesData, materialsData, companiesData]) => {
      setServices(servicesData);
      setStages(stagesData);
      setMaterials(materialsData);
      setCompanies(companiesData);
    });
  }, []);

  return (
    <FieldSet>
      <FieldLegend>Основная информация</FieldLegend>
      <FieldDescription>
        Заполните основную информацию о сделке ниже.
      </FieldDescription>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="customer" className="gap-0.5">
            Заказчик<span className="text-red-600">*</span>
          </FieldLabel>
          <CompanyCombobox
            value={formData.companyId}
            onChange={formData.setCompanyId}
            companies={companies || []}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="service" className="gap-0.5">
            Услуга
            <span className="text-red-600">*</span>
          </FieldLabel>
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
              <FieldLabel htmlFor="stage" className="gap-0.5">
                Этап сделки<span className="text-red-600">*</span>
              </FieldLabel>
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
              <FieldLabel htmlFor="material" className="gap-0.5">
                Материал
                <span className="text-red-600">*</span>
              </FieldLabel>
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
                  min={1}
                  step={1}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (!isNaN(value) && value >= 0) {
                      formData.setQuantity(value);
                    }
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
                      const formatted = e.target.value.replace(/[^0-9.]/g, "");
                      formData.setAmountPerUnit(formatted);
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
                    value={formData.total.amountPurchase}
                    readOnly
                    disabled
                    placeholder="0.00"
                  />
                </InputGroup>
              </Field>
            )}
          </div>
        )}
        {formData.serviceId &&
          formData.serviceId === "687a88dfb6b13b70b6a575f3" && (
            <div className="grid grid-cols-3 gap-4">
              <Field>
                <FieldLabel htmlFor="purchaseTotal">Сумма продажи</FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <InputGroupText>₽</InputGroupText>
                  </InputGroupAddon>
                  <InputGroupInput
                    name="amountSale"
                    value={formData.amountSale}
                    onChange={(e) => {
                      const formatted = e.target.value.replace(/[^0-9.]/g, "");
                      formData.setAmountSale(formatted);
                    }}
                    placeholder="0.00"
                  />
                </InputGroup>
              </Field>
            </div>
          )}
      </FieldGroup>
    </FieldSet>
  );
}
