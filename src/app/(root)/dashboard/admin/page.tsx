import Link from "next/link";

import PaginationControls from "@/components/shared/pagination-controls";
import ResourceFilters from "@/components/filters/resource-filters";
import AdminResourcesTable from "@/components/admin/admin-resources-table";

import { RESOURCE_CATEGORIES } from "@/utils/constants/resource-taxonomy";
import {
  getAllResourcesForAdminFromDB,
  getUniqueTagsFromDB,
} from "@/app/actions/resource";

interface AdminDashboardProps {
  searchParams: Promise<{
    page?: string;
    category?: string;
    tag?: string;
    published?: string;
  }>;
}

export default async function AdminDashboard({
  searchParams,
}: AdminDashboardProps) {
  const resolvedSearchParams = await searchParams;

  const pageParam = resolvedSearchParams.page;
  const parsedPage = pageParam ? Number.parseInt(pageParam, 10) : 1;
  const page = Number.isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage;

  const selectedCategory = resolvedSearchParams.category?.trim() || undefined;
  const selectedTag = resolvedSearchParams.tag?.trim() || undefined;
  const publishedParam = resolvedSearchParams.published?.trim();

  const selectedPublished =
    publishedParam === "true"
      ? true
      : publishedParam === "false"
        ? false
        : undefined;

  const [resourcesResult, tagsResult] = await Promise.all([
    getAllResourcesForAdminFromDB(page, undefined, {
      category: selectedCategory,
      tag: selectedTag,
      published: selectedPublished,
    }),
    getUniqueTagsFromDB(),
  ]);

  if (!resourcesResult.ok) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <p className="text-red-500">{resourcesResult.error}</p>
      </div>
    );
  }

  const tags = tagsResult.ok ? tagsResult.data : [];
  const { resources, totalCount, totalPages } = resourcesResult.data;

  const createPublishedFilterHref = (value?: "true" | "false") => {
    const params = new URLSearchParams();

    if (selectedCategory) {
      params.set("category", selectedCategory);
    }

    if (selectedTag) {
      params.set("tag", selectedTag);
    }

    if (value) {
      params.set("published", value);
    }

    const queryString = params.toString();
    return queryString ? `/dashboard/admin?${queryString}` : "/dashboard/admin";
  };

  return (
    <div className="flex min-h-screen flex-col items-center gap-6 px-4 py-10">
      <div className="w-full max-w-7xl space-y-3 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Resources</h1>

        <p className="text-sm text-muted-foreground">
          {totalCount} resources • Page {page} of {totalPages}
        </p>
      </div>

      <div className="w-full max-w-7xl space-y-8">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Link
            href={createPublishedFilterHref(undefined)}
            className={[
              "inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium transition-colors",
              selectedPublished === undefined
                ? "border-primary bg-primary text-primary-foreground"
                : "hover:bg-muted",
            ].join(" ")}
          >
            All
          </Link>

          <Link
            href={createPublishedFilterHref("true")}
            className={[
              "inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium transition-colors",
              selectedPublished === true
                ? "border-primary bg-primary text-primary-foreground"
                : "hover:bg-muted",
            ].join(" ")}
          >
            Published
          </Link>

          <Link
            href={createPublishedFilterHref("false")}
            className={[
              "inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium transition-colors",
              selectedPublished === false
                ? "border-primary bg-primary text-primary-foreground"
                : "hover:bg-muted",
            ].join(" ")}
          >
            Unpublished
          </Link>
        </div>

        {resources.length === 0 ? (
          <div className="flex min-h-[300px] w-full items-center justify-center rounded-xl border border-dashed">
            <p className="text-muted-foreground">
              No resources found for the selected filters.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="overflow-x-auto rounded-xl border">
              <AdminResourcesTable resources={resources} />
            </div>

            <PaginationControls
              currentPage={page}
              totalPages={totalPages}
              category={selectedCategory}
              tag={selectedTag}
              published={
                selectedPublished === undefined
                  ? undefined
                  : String(selectedPublished)
              }
              basePath="/dashboard/admin"
            />
          </div>
        )}

        <div className="rounded-xl border p-4">
          <ResourceFilters categories={RESOURCE_CATEGORIES} tags={tags} />
        </div>
      </div>
    </div>
  );
}
