"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface DeleteResourceButtonProps {
  resourceId: string;
  resourceName: string;
}

const DeleteResourceButton = ({
  resourceId,
  resourceName,
}: DeleteResourceButtonProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${resourceName}"? This action cannot be undone.`,
    );

    if (!confirmed) return;

    startTransition(async () => {
      try {
        const response = await fetch(`/api/admin/resources/${resourceId}`, {
          method: "DELETE",
        });

        const result = await response.json();

        if (!result.ok) {
          toast.error(result.error || "Failed to delete resource.");
          return;
        }

        toast.success("Resource deleted successfully.");
        router.refresh();
      } catch (error) {
        console.error("Failed to delete resource:", error);
        toast.error("Something went wrong while deleting the resource.");
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="text-red-600 underline underline-offset-4 disabled:opacity-50"
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
};

export default DeleteResourceButton;
