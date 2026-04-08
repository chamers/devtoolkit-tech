import Link from "next/link";
import Image from "next/image";
import type { SerializedResource } from "@/app/actions/resource";

interface AdminResourcesTableProps {
  resources: SerializedResource[];
}

const AdminResourcesTable = ({ resources }: AdminResourcesTableProps) => {
  return (
    <table className="w-full text-sm">
      <thead className="bg-muted/50">
        <tr className="border-b">
          <th className="px-4 py-3 text-left font-medium">Resource</th>
          <th className="px-4 py-3 text-left font-medium">Category</th>
          <th className="px-4 py-3 text-left font-medium">Published</th>
          <th className="px-4 py-3 text-left font-medium">Created</th>
          <th className="px-4 py-3 text-left font-medium">Actions</th>
        </tr>
      </thead>

      <tbody>
        {resources.map((resource) => (
          <tr key={resource._id} className="border-b last:border-b-0">
            <td className="px-4 py-3">
              <div className="flex items-center gap-3">
                {resource.logo ? (
                  <Image
                    src={resource.logo}
                    alt={resource.name}
                    width={32}
                    height={32}
                    className="rounded-md object-contain border bg-white"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-md border text-xs text-muted-foreground">
                    {resource.name.charAt(0)}
                  </div>
                )}

                <span className="font-medium">{resource.name}</span>
              </div>
            </td>

            <td className="px-4 py-3">{resource.category}</td>

            <td className="px-4 py-3">
              <span
                className={[
                  "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
                  resource.published
                    ? "border-green-200 bg-green-100 text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-300"
                    : "border-red-200 bg-red-100 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300",
                ].join(" ")}
              >
                {resource.published ? "Published" : "Unpublished"}
              </span>
            </td>

            <td className="px-4 py-3">
              {new Date(resource.createdAt).toLocaleDateString()}
            </td>

            <td className="px-4 py-3">
              <Link
                href={`/dashboard/resources/edit/${resource._id}`}
                className="underline underline-offset-4 text-blue-500"
              >
                Edit
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AdminResourcesTable;
