"use client";

import PreviewCard from "@/components/resource/preview/preview-card";
import { useResource } from "@/context/resource";
import Link from "next/link";

const Dashboard = () => {
  const { resources } = useResource();

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
