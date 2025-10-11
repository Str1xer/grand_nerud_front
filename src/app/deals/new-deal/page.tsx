"use client";

import { Page } from "@/components/blocks";
import useAuthContext from "@/contexts/auth-context";
import {
  CompanyDto,
  MaterialDto,
  ServiceDto,
  StageDto,
} from "@definitions/dto";
import { useEffect, useState } from "react";
import DealForm from "./_component/deal-form";

export default function NewDealPage() {
  const { user } = useAuthContext();
  const [services, setServices] = useState<ServiceDto[]>([]);
  const [stages, setStages] = useState<StageDto[]>([]);
  const [materials, setMaterials] = useState<MaterialDto[]>([]);
  const [companies, setCompanies] = useState<CompanyDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getCookie = (name: string) => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${name}=`))
      ?.split("=")[1];
  };

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const token = getCookie("tg_news_bot_access_token");
        // const token = localStorage.getItem('token')

        const [servicesRes, stagesRes, materialsRes, companiesRes] =
          await Promise.all([
            fetch("https://appgrand.worldautogroup.ru/services", {
              headers: { ...(token && { "x-user-id": token }) },
            }),
            fetch("https://appgrand.worldautogroup.ru/stages", {
              headers: { ...(token && { "x-user-id": token }) },
            }),
            fetch("https://appgrand.worldautogroup.ru/materials", {
              headers: { ...(token && { "x-user-id": token }) },
            }),
            fetch("https://appgrand.worldautogroup.ru/companies", {
              headers: { ...(token && { "x-user-id": token }) },
            }),
          ]);

        if (
          !servicesRes.ok ||
          !stagesRes.ok ||
          !materialsRes.ok ||
          !companiesRes.ok
        ) {
          throw new Error("Failed to fetch required data");
        }

        const [servicesData, stagesData, materialsData, companiesData] =
          await Promise.all([
            servicesRes.json(),
            stagesRes.json(),
            materialsRes.json(),
            companiesRes.json(),
          ]);

        setServices(servicesData);
        setStages(stagesData);
        setMaterials(materialsData);
        setCompanies(companiesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (!user) {
    return (
      <div className="text-center py-10">
        <p>Пожалуйста, войдите чтобы создать сделку</p>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center py-10">Загрузка данных...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <Page
      breadcrumbLinks={[
        {
          label: "Сделки",
          href: "/deals",
        },
        {
          label: "Новая сделка",
          href: "/deals/new-deal",
        },
      ]}
    >
      <DealForm
        services={services}
        stages={stages}
        materials={materials}
        companies={companies}
      />
    </Page>
  );
}
