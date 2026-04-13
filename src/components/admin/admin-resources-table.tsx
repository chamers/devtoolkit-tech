import Link from "next/link";
import Image from "next/image";
import type { SerializedResource } from "@/app/actions/resource";
import { getMaintenanceStatusLabel } from "@/utils/constants/resource-taxonomy";
import DeleteResourceButton from "./delete-resource-button";

interface AdminResourcesTableProps {
  resources: SerializedResource[];
}

const AdminResourcesTable = ({ resources }: AdminResourcesTableProps) => {
  const getStatusClasses = (status: SerializedResource["status"]) => {
    switch (status) {
      case "published":
        return "border-green-200 bg-green-100 text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-300";
      case "rejected":
        return "border-red-200 bg-red-100 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300";
      default:
        return "border-yellow-200 bg-yellow-100 text-yellow-700 dark:border-yellow-900 dark:bg-yellow-950 dark:text-yellow-300";
    }
  };

  const getMaintenanceStatusClasses = (
    status: SerializedResource["maintenanceStatus"],
  ) => {
    switch (status) {
      case "active":
        return "border-green-200 bg-green-100 text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-300";
      case "outdated":
        return "border-yellow-200 bg-yellow-100 text-yellow-700 dark:border-yellow-900 dark:bg-yellow-950 dark:text-yellow-300";
      case "deprecated":
        return "border-red-200 bg-red-100 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300";
      default:
        return "border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300";
    }
  };

  return (
    <table className="w-full text-sm">
      <thead className="bg-muted/50">
        <tr className="border-b">
          <th className="px-4 py-3 text-left font-medium">Resource</th>
          <th className="px-4 py-3 text-left font-medium">Category</th>
          <th className="px-4 py-3 text-left font-medium">Status</th>
          <th className="px-4 py-3 text-left font-medium">Maintenance</th>
          <th className="px-4 py-3 text-left font-medium">Created</th>
          <th className="px-4 py-3 text-left font-medium">Actions</th>
        </tr>
      </thead>

      <tbody>
        {resources.map((resource) => {
          const actionLabel =
            resource.status === "pending"
              ? "Review"
              : resource.status === "published"
                ? "Edit"
                : "Review";

          return (
            <tr key={resource._id} className="border-b last:border-b-0">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  {resource.logo ? (
                    <Image
                      src={resource.logo}
                      alt={resource.name}
                      width={32}
                      height={32}
                      className="rounded-md border bg-white object-contain"
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
                    "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium capitalize",
                    getStatusClasses(resource.status),
                  ].join(" ")}
                >
                  {resource.status}
                </span>
              </td>

              <td className="px-4 py-3">
                <span
                  className={[
                    "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium capitalize",
                    getMaintenanceStatusClasses(resource.maintenanceStatus),
                  ].join(" ")}
                >
                  {getMaintenanceStatusLabel(resource.maintenanceStatus)}
                </span>
              </td>

              <td className="px-4 py-3">
                {new Date(resource.createdAt).toLocaleDateString()}
              </td>

              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <Link
                    href={`/dashboard/edit/${resource._id}`}
                    className="text-blue-500 underline underline-offset-4"
                  >
                    {actionLabel}
                  </Link>

                  <DeleteResourceButton
                    resourceId={resource._id}
                    resourceName={resource.name}
                  />
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default AdminResourcesTable;
