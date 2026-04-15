import PaginationControls from "@/components/shared/pagination-controls";
import ResourceFilters from "@/components/filters/resource-filters";
import AdminResourcesTable from "@/components/admin/admin-resources-table";
import AdminSubnav from "@/components/nav/admin-subnav";

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
    status?: "pending" | "published" | "rejected";
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
  const selectedStatus = resolvedSearchParams.status?.trim() as
    | "pending"
    | "published"
    | "rejected"
    | undefined;

  const [resourcesResult, tagsResult] = await Promise.all([
    getAllResourcesForAdminFromDB(page, undefined, {
      category: selectedCategory,
      tag: selectedTag,
      status: selectedStatus,
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

  return (
    <div className="flex min-h-screen flex-col items-center gap-6 px-4 py-10">
      <div className="w-full max-w-7xl space-y-3 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Resources</h1>

        <p className="text-sm text-muted-foreground">
          {totalCount} resources • Page {page} of {totalPages}
        </p>
      </div>

      <div className="w-full max-w-7xl space-y-8">
        <AdminSubnav current="all" />

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
              basePath="/dashboard/admin"
            />
          </div>
        )}

        <div className="rounded-xl border p-4">
          <ResourceFilters categories={RESOURCE_CATEGORIES} />
        </div>
      </div>
    </div>
  );
}
