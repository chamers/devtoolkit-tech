"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import CategoryFilter, { type CategoryFilterOption } from "./category-filter";
import TagFilter from "./tag-filter";

interface ResourceFiltersProps {
  categories: readonly CategoryFilterOption[];
  tags: readonly string[];
}

export default function ResourceFilters({
  categories,
  tags,
}: ResourceFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedCategory = searchParams.get("category") ?? undefined;
  const selectedTag = searchParams.get("tag") ?? undefined;
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
    params.delete("tag");
    params.delete("page");
    // deliberately preserve "published"

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  }

  const hasActiveFilters = Boolean(selectedCategory || selectedTag);

  return (
    <aside className="w-full rounded-2xl border bg-background p-4 shadow-sm">
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-base font-semibold tracking-tight">Filters</h2>

            {selectedPublished ? (
              <p className="text-xs text-muted-foreground">
                Status:{" "}
                {selectedPublished === "true" ? "Published" : "Unpublished"}
              </p>
            ) : null}
          </div>

          {hasActiveFilters ? (
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
            >
              Clear all
            </button>
          ) : null}
        </div>

        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={(value) => updateParam("category", value)}
        />

        <TagFilter
          tags={tags}
          selectedTag={selectedTag}
          onTagChange={(value) => updateParam("tag", value)}
        />
      </div>
    </aside>
  );
}
