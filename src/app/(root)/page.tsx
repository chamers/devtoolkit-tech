import Link from "next/link";

import PaginationControls from "@/components/shared/pagination-controls";
import { getLatestResourcesFromDB } from "../actions/resource";
import ResourceCard from "@/components/resource/cards/resource-card";

interface HomePageProps {
  searchParams?: {
    page?: string;
  };
}

export default async function Home({ searchParams }: HomePageProps) {
  const pageParam = searchParams?.page;
  const parsedPage = pageParam ? Number.parseInt(pageParam, 10) : 1;
  const page = Number.isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage;

  const result = await getLatestResourcesFromDB(page);

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
          Latest Resources
        </h1>

        <p className="text-sm text-muted-foreground">
          {totalCount} resources • Page {page} of {totalPages}
        </p>
      </div>

      {resources.length === 0 ? (
        <div className="flex min-h-[300px] w-full max-w-7xl items-center justify-center rounded-xl border border-dashed">
          <p className="text-muted-foreground">No published resources found.</p>
        </div>
      ) : (
        <>
          <div className="grid w-full max-w-7xl grid-cols-1 items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {resources.map((resource) => (
              <Link
                key={resource._id}
                href={`/resource/${resource.slug}`}
                className="block h-full"
              >
                <div className="h-full transform transition duration-300 hover:scale-[1.02]">
                  <ResourceCard resource={resource} />
                </div>
              </Link>
            ))}
          </div>

          <PaginationControls currentPage={page} totalPages={totalPages} />
        </>
      )}
    </div>
  );
}
