import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import { Fragment } from "react";

export default function Page({
  children,
  breadcrumbLinks = [],
}: {
  children: React.ReactNode;
  breadcrumbLinks?: Array<{ href: string; label: string }>;
}) {
  return (
    <>
      <header className="flex shrink-0 items-center gap-2 border-b px-4 pb-2">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbLinks &&
              breadcrumbLinks.length > 0 &&
              breadcrumbLinks.map((link, index) =>
                index < breadcrumbLinks.length - 1 ? (
                  <Fragment key={link.href}>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href={link.href}>
                        {link.label}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                  </Fragment>
                ) : (
                  <BreadcrumbItem key={link.href}>
                    <BreadcrumbPage>{link.label}</BreadcrumbPage>
                  </BreadcrumbItem>
                )
              )}
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="px-4">{children}</div>
    </>
  );
}
