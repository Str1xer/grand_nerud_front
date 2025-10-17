import {
  Pagination as ShadcnPagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface PaginationProps {
  total: number;
  current: number;
  onClick: (page: number) => void;
}

export default function Pagination({
  total,
  current,
  onClick,
}: PaginationProps) {
  if (total <= 1) return null;

  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (total <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate start and end of middle pages
      let start = Math.max(2, current - 1);
      let end = Math.min(total - 1, current + 1);

      // Adjust if we're at the beginning
      if (current <= 3) {
        end = 4;
      }

      // Adjust if we're at the end
      if (current >= total - 2) {
        start = total - 3;
      }

      // Add ellipsis after first page if needed
      if (start > 2) {
        pages.push("ellipsis-start");
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis before last page if needed
      if (end < total - 1) {
        pages.push("ellipsis-end");
      }

      // Always show last page
      pages.push(total);
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <ShadcnPagination>
      <PaginationContent>
        {/* Previous button */}
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (current > 1) onClick(current - 1);
            }}
            className={current === 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {/* Page numbers */}
        {pageNumbers.map((page, index) => (
          <PaginationItem key={index}>
            {page === "ellipsis-start" || page === "ellipsis-end" ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onClick(page as number);
                }}
                isActive={current === page}
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        {/* Next button */}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (current < total) onClick(current + 1);
            }}
            className={
              current === total ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </ShadcnPagination>
  );
}
