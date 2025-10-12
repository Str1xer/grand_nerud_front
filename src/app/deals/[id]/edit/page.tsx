import { Page } from "@/components/blocks";
import EditDealForm from "./_components/edit-form";

export default async function EditDealPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: dealId } = await params;

  if (!dealId) {
    return <div className="p-8">ID сделки не указан</div>;
  }

  return (
    <Page
      breadcrumbLinks={[
        {
          label: "Сделки",
          href: "/deals",
        },
        {
          label: `Редактирование сделки #${dealId}`,
          href: `/deals/${dealId}/edit`,
        },
      ]}
    >
      <EditDealForm dealId={dealId} />
    </Page>
  );
}
