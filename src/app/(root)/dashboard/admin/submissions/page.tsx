import PaginationControls from "@/components/shared/pagination-controls";
import AdminResourcesTable from "@/components/admin/admin-resources-table";
import { getAllResourcesForAdminFromDB } from "@/app/actions/resource";
import AdminSubnav from "@/components/nav/admin-subnav";

interface PendingSubmissionsPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function PendingSubmissionsPage({
  searchParams,
}: PendingSubmissionsPageProps) {
  const resolvedSearchParams = await searchParams;

  const pageParam = resolvedSearchParams.page;
  const parsedPage = pageParam ? Number.parseInt(pageParam, 10) : 1;
  const page = Number.isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage;

  const result = await getAllResourcesForAdminFromDB(page, undefined, {
    status: "pending",
  });

  if (!result.ok) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <p className="text-red-500">{result.error}</p>
      </div>
    );
  }

  const { resources, totalCount, totalPages } = result.data;

  return (
    <div className="flex min-h-screen flex-col items-center gap-6 px-4 py-10">
      <div className="w-full max-w-7xl space-y-3 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          Pending submissions
        </h1>
        <AdminSubnav current="pending" />

        <p className="text-sm text-muted-foreground">
          {totalCount} pending submissions • Page {page} of {totalPages}
        </p>
      </div>

      <div className="w-full max-w-7xl space-y-6">
        {resources.length === 0 ? (
          <div className="flex min-h-[300px] w-full items-center justify-center rounded-xl border border-dashed">
            <p className="text-muted-foreground">
              No pending submissions found.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-xl border">
              <AdminResourcesTable resources={resources} />
            </div>

            <PaginationControls
              currentPage={page}
              totalPages={totalPages}
              basePath="/dashboard/admin/submissions"
            />
          </>
        )}
      </div>
    </div>
  );
}
