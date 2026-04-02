"use client";

import SkeletonCard from "@/components/resource/cards/skeleton-card";
import PreviewCard from "@/components/resource/preview/preview-card";
import { useResource } from "@/context/resource";
import Link from "next/link";

const Dashboard = () => {
  const { resources, loading } = useResource();

  if (loading) {
    return (
      <div>
        <p className="my-5 text-center">Loading...</p>
        <div className="grid grid-cols-1 gap-4 m-5 px-5 md:grid-cols-2 lg:grid-cols-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  if (!resources.length) {
    return (
      <div className="p-5">
        <h1 className="mb-5 text-center text-2xl font-bold">Dashboard</h1>
        <p className="text-center text-muted-foreground">No resources found.</p>
      </div>
    );
  }

  return (
    <div className="p-5">
      <h1 className="mb-5 text-center text-2xl font-bold">Dashboard</h1>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {resources.map((resource) => (
          <Link
            key={resource._id}
            href={`/dashboard/edit/${resource._id}`}
            className="rounded-lg bg-white p-4 shadow-md transition-shadow hover:shadow-lg dark:bg-gray-800"
          >
            <PreviewCard resource={resource} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
