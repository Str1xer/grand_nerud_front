"use client";

import { Button } from "@/components/ui/button";
import { DealDto } from "@definitions/dto";
import AdditionalInformationSection from "./additional-information";
import { useDataFormHook } from "./data-form-hook";
import DeliveryInformationSection from "./delivery-information";
import FinancialInformationSection from "./financial-information";
import PrimaryInformationSection from "./primary-information";

export default function DealForm({ defaultDeal }: { defaultDeal?: DealDto }) {
  const formData = useDataFormHook(defaultDeal);

  return (
    <form onSubmit={formData.handleSubmit} className="flex flex-col gap-8">
      <PrimaryInformationSection
        formData={formData}
        defaultDeal={defaultDeal}
      />
      <FinancialInformationSection formData={formData} />
      <DeliveryInformationSection formData={formData} />
      <AdditionalInformationSection formData={formData} />
      {!!formData.serviceId && !!formData.customerId && (
        <div className="flex flex-col gap-4">
          <p className="text-xl text-slate-800">
            <span className="font-light text-slate-600">Итоговая сумма:</span>{" "}
            {formData.calculatedData.totalAmount} ₽
          </p>
          <div className="inline-flex gap-4">
            <Button
              type="submit"
              disabled={
                !formData.customerId ||
                !formData.stageId ||
                !formData.materialId ||
                !formData.serviceId
              }
            >
              Создать сделку
            </Button>
          </div>
        </div>
      )}
    </form>
  );
}
