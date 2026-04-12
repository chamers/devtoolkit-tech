import Link from "next/link";

import PaginationControls from "@/components/shared/pagination-controls";
import ResourceCard from "@/components/resource/cards/resource-card";
import ResourceFilters from "@/components/filters/resource-filters";
import {
  getLatestResourcesFromDB,
  getUniqueTagsFromDB,
  searchResourcesFromDB,
} from "@/app/actions/resource";
import { RESOURCE_CATEGORIES } from "@/utils/constants/resource-taxonomy";

interface ResourcesPageProps {
  searchParams?: Promise<{
    query?: string;
    page?: string;
    category?: string;
    tag?: string;
    sort?: string;
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

  const selectedCategory = resolvedSearchParams?.category?.trim() || undefined;
  const selectedTag = resolvedSearchParams?.tag?.trim() || undefined;

  const tagsResult = await getUniqueTagsFromDB();
  const tags = tagsResult.ok ? tagsResult.data : [];
  const selectedSort = resolvedSearchParams?.sort?.trim() || "latest";
  if (query) {
    const result = await searchResourcesFromDB(query);

    if (!result.ok) {
      return (
        <div className="flex min-h-screen items-center justify-center px-4">
          <p className="text-red-500">{result.error}</p>
        </div>
      );
    }

    const resources = result.data;

    return (
      <div className="flex min-h-screen flex-col items-center gap-6 px-4 py-10">
        <div className="w-full max-w-7xl space-y-3 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            Search Results
          </h1>

          <p className="text-sm text-muted-foreground">
            {resources.length === 0
              ? `No resources found for "${query}".`
              : `Found ${resources.length} resource${resources.length === 1 ? "" : "s"} for "${query}".`}
          </p>
        </div>

        <div className="grid w-full max-w-7xl gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <div className="lg:sticky lg:top-6 lg:self-start">
            <ResourceFilters categories={RESOURCE_CATEGORIES} tags={tags} />
          </div>

          {resources.length === 0 ? (
            <div className="flex min-h-[300px] w-full items-center justify-center rounded-xl border border-dashed">
              <p className="text-muted-foreground">
                No published resources found for your search.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-3">
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
                {/* {resources.map((resource) => {
                  const mockResource = {
                    ...resource,
                    communityRating: {
                      average: 4.3,
                      count: 12,
                    },
                  };

                  return (
                    <Link
                      key={resource._id}
                      href={`/resources/${resource.slug}`}
                      className="block h-full"
                    >
                      <div className="h-full transform transition duration-300 hover:scale-[1.02]">
                        <ResourceCard resource={mockResource} />
                      </div>
                    </Link>
                  );
                })} */}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const resourcesResult = await getLatestResourcesFromDB(page, undefined, {
    category: selectedCategory,
    tag: selectedTag,
    sort: selectedSort === "highest-rated" ? "highest-rated" : "latest",
  });

  if (!resourcesResult.ok) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <p className="text-red-500">{resourcesResult.error}</p>
      </div>
    );
  }

  const { resources, totalCount, totalPages } = resourcesResult.data;

  return (
    <div className="flex min-h-screen flex-col items-center gap-6 px-4 py-10">
      <div className="w-full max-w-7xl space-y-3 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          Latest Resources
        </h1>

        <p className="text-sm text-muted-foreground">
          {totalCount} resources • Page {page} of {totalPages}
        </p>
      </div>

      <div className="grid w-full max-w-7xl gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="lg:sticky lg:top-6 lg:self-start">
          <ResourceFilters categories={RESOURCE_CATEGORIES} tags={tags} />
        </div>

        {resources.length === 0 ? (
          <div className="flex min-h-[300px] w-full items-center justify-center rounded-xl border border-dashed">
            <p className="text-muted-foreground">
              No published resources found for the selected filters.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-3">
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

            <PaginationControls
              currentPage={page}
              totalPages={totalPages}
              category={selectedCategory}
              tag={selectedTag}
            />
          </div>
        )}
      </div>
    </div>
  );
}
