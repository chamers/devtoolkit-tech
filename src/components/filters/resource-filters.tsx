"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import CategoryFilter, { type CategoryFilterOption } from "./category-filter";

interface ResourceFiltersProps {
  categories: readonly CategoryFilterOption[];
}

export default function ResourceFilters({ categories }: ResourceFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedCategory = searchParams.get("category") ?? undefined;
  const selectedPublished = searchParams.get("published") ?? undefined;

  function updateParam(key: string, value?: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (!value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    params.delete("page");

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  }

  function clearFilters() {
    const params = new URLSearchParams(searchParams.toString());

    params.delete("category");
    params.delete("page");

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  }

  const hasActiveFilters = Boolean(selectedCategory);

  return (
    <aside className="w-full">
      <div className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Browse
            </h2>

            {hasActiveFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
              >
                Clear
              </button>
            ) : null}
          </div>

          {selectedPublished ? (
            <p className="text-xs text-muted-foreground">
              Status:{" "}
              {selectedPublished === "true" ? "Published" : "Unpublished"}
            </p>
          ) : null}
        </div>

        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={(value) => updateParam("category", value)}
        />
      </div>
    </aside>
  );
}
