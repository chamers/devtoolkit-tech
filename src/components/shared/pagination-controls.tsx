import Link from "next/link";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

type PaginationControlsProps = {
  currentPage: number;
  totalPages: number;
  category?: string;
  tag?: string;
  published?: string;
  basePath?: string;
};

function getPageNumbers(currentPage: number, totalPages: number) {
  const pages: (number | "ellipsis")[] = [];

  if (totalPages <= 7) {
    for (let page = 1; page <= totalPages; page += 1) {
      pages.push(page);
    }
    return pages;
  }

  pages.push(1);

  if (currentPage > 3) {
    pages.push("ellipsis");
  }

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  if (currentPage < totalPages - 2) {
    pages.push("ellipsis");
  }

  pages.push(totalPages);

  return pages;
}

function createPageHref(
  page: number,
  category?: string,
  tag?: string,
  published?: string,
  basePath = "/",
) {
  const params = new URLSearchParams();

  if (page > 1) {
    params.set("page", String(page));
  }

  if (category) {
    params.set("category", category);
  }

  if (tag) {
    params.set("tag", tag);
  }

  if (published) {
    params.set("published", published);
  }

  const queryString = params.toString();
  return queryString ? `${basePath}?${queryString}` : basePath;
}

export default function PaginationControls({
  currentPage,
  totalPages,
  category,
  tag,
  published,
  basePath = "/",
}: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-wrap items-center justify-center gap-2"
    >
      <Link
        href={createPageHref(
          Math.max(1, currentPage - 1),
          category,
          tag,
          published,
          basePath,
        )}
        aria-disabled={currentPage === 1}
        className={[
          "inline-flex h-9 items-center justify-center rounded-md border px-3 text-sm font-medium transition-colors",
          currentPage === 1
            ? "pointer-events-none opacity-50"
            : "hover:bg-muted",
        ].join(" ")}
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Previous
      </Link>

      {pages.map((page, index) =>
        page === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            className="inline-flex h-9 w-9 items-center justify-center text-muted-foreground"
          >
            <MoreHorizontal className="h-4 w-4" />
          </span>
        ) : (
          <Link
            key={page}
            href={createPageHref(page, category, tag, published, basePath)}
            aria-current={page === currentPage ? "page" : undefined}
            className={[
              "inline-flex h-9 w-9 items-center justify-center rounded-md border text-sm font-medium transition-colors",
              page === currentPage
                ? "border-primary bg-primary text-primary-foreground"
                : "hover:bg-muted",
            ].join(" ")}
          >
            {page}
          </Link>
        ),
      )}

      <Link
        href={createPageHref(
          Math.min(totalPages, currentPage + 1),
          category,
          tag,
          published,
          basePath,
        )}
        aria-disabled={currentPage === totalPages}
        className={[
          "inline-flex h-9 items-center justify-center rounded-md border px-3 text-sm font-medium transition-colors",
          currentPage === totalPages
            ? "pointer-events-none opacity-50"
            : "hover:bg-muted",
        ].join(" ")}
      >
        Next
        <ChevronRight className="ml-1 h-4 w-4" />
      </Link>
    </nav>
  );
}
