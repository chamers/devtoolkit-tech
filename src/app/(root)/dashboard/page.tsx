"use client";

import PreviewCard from "@/components/resource/preview/preview-card";
import { useResource } from "@/context/resource";
import Link from "next/link";

const Dashboard = () => {
  const { resources } = useResource();
  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5 text-center">Dashboard</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {resources.map((resource, index) => (
          <Link
            key={index}
            href={`/dashboard/resource/edit/${resource._id}`}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
          >
            <div>
              <PreviewCard resource={resource}></PreviewCard>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
export default Dashboard;
