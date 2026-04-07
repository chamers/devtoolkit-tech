import Link from "next/link";

import PaginationControls from "@/components/shared/pagination-controls";
import ResourceCard from "@/components/resource/cards/resource-card";
import {
  getLatestResourcesFromDB,
  searchResourcesFromDB,
} from "@/app/actions/resource";

interface ResourcesPageProps {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}

export default async function ResourcesPage({
  searchParams,
}: ResourcesPageProps) {
  const resolvedSearchParams = await searchParams;

  const rawQuery = resolvedSearchParams?.query ?? "";
  const query = rawQuery.trim();

  const pageParam = resolvedSearchParams?.page;
  const parsedPage = pageParam ? Number.parseInt(pageParam, 10) : 1;
  const page = Number.isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage;

  if (query) {
    const result = await searchResourcesFromDB(query);

    if (!result.ok) {
      return (
        <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4 py-10">
          <p className="text-sm text-red-500">{result.error}</p>
        </div>
      );
    }

    const resources = result.data;

    return (
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Search results</h1>
          <p className="text-muted-foreground">
            {resources.length === 0
              ? `No resources found for "${query}".`
              : `Found ${resources.length} resource${resources.length === 1 ? "" : "s"} for "${query}".`}
          </p>
        </div>

        {resources.length === 0 ? (
          <div className="rounded-xl border bg-card p-8 text-center">
            <h2 className="text-lg font-semibold">No matches found</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Try a different keyword, category, or tag.
            </p>
          </div>
        ) : (
          <div className="grid w-full max-w-7xl grid-cols-1 items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {resources.map((resource) => (
              <Link
                key={resource._id}
                href={`/resources/${resource.slug}`}
                className="block h-full"
              >
                <div className="h-full transform transition duration-300 hover:scale-[1.02]">
                  <ResourceCard resource={resource} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  const result = await getLatestResourcesFromDB(page);

  if (!result.ok) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4 py-10">
        <p className="text-sm text-red-500">{result.error}</p>
      </div>
    );
  }

  const { resources, totalPages } = result.data;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">All resources</h1>
        <p className="text-muted-foreground">
          Browse the latest published developer resources.
        </p>
      </div>

      {resources.length === 0 ? (
        <div className="rounded-xl border bg-card p-8 text-center">
          <h2 className="text-lg font-semibold">No resources yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Published resources will appear here.
          </p>
        </div>
      ) : (
        <>
          <div className="grid w-full max-w-7xl grid-cols-1 items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {resources.map((resource) => (
              <Link
                key={resource._id}
                href={`/resources/${resource.slug}`}
                className="block h-full"
              >
                <div className="h-full transform transition duration-300 hover:scale-[1.02]">
                  <ResourceCard resource={resource} />
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <PaginationControls currentPage={page} totalPages={totalPages} />
          </div>
        </>
      )}
    </div>
  );
}
