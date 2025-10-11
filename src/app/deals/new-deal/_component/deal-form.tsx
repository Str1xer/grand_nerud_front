import { Button } from "@/components/ui/button";
import {
    CompanyDto,
    MaterialDto,
    ServiceDto,
    StageDto,
} from "@definitions/dto";
import AdditionalInformationSection from "./additional-information";
import useDataFormHook from "./data-form-hook";
import DeliveryInformationSection from "./delivery-information";
import FinancialInformationSection from "./financial-information";
import PrimaryInformationSection from "./primary-information";

export default function DealForm({
  services,
  stages,
  materials,
  companies,
}: {
  services: ServiceDto[];
  stages: StageDto[];
  materials: MaterialDto[];
  companies: CompanyDto[];
}) {
  const formData = useDataFormHook();

  return (
    <form onSubmit={formData.handleSubmit} className="flex flex-col gap-8">
      <PrimaryInformationSection
        formData={formData}
        services={services}
        companies={companies}
        stages={stages}
        materials={materials}
      />
      <FinancialInformationSection formData={formData} />
      <DeliveryInformationSection formData={formData} />
      <AdditionalInformationSection formData={formData} />
      {!!formData.serviceId && !!formData.companyId && (
        <div className="inline-flex gap-4">
          <Button type="button" variant="outline">
            Отмена
          </Button>
          <Button type="submit">Создать сделку</Button>
        </div>
      )}
    </form>
  );
}
