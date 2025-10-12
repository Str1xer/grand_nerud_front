import { Page } from "@/components/blocks";
import { DealsDataTable } from "@features/components";

export default function DealsPage() {
  return (
    <Page
      breadcrumbLinks={[
        {
          label: "Сделки",
          href: "/deals",
        },
      ]}
    >
      <DealsDataTable />
    </Page>
  );
}
