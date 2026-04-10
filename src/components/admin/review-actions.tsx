"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  approveResourceInDB,
  rejectResourceInDB,
} from "@/app/actions/resource";
import { Button } from "@/components/ui/button";

interface ReviewActionsProps {
  resourceId: string;
  status: "pending" | "published" | "rejected";
}

const ReviewActions = ({ resourceId, status }: ReviewActionsProps) => {
  const router = useRouter();
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectBox, setShowRejectBox] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleApprove = () => {
    setError(null);

    startTransition(async () => {
      const result = await approveResourceInDB(resourceId);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      router.refresh();
      router.push("/dashboard/admin/submissions");
    });
  };

  const handleReject = () => {
    setError(null);

    startTransition(async () => {
      const result = await rejectResourceInDB(resourceId, rejectReason);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      router.refresh();
      router.push("/dashboard/admin/submissions");
    });
  };

  return (
    <div className="space-y-3">
      {status === "pending" ? (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <Button type="button" onClick={handleApprove} disabled={isPending}>
              Approve
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => setShowRejectBox((prev) => !prev)}
              disabled={isPending}
            >
              Reject
            </Button>
          </div>

          {showRejectBox ? (
            <div className="space-y-2 rounded-lg border p-3">
              <label
                htmlFor="rejectReason"
                className="block text-sm font-medium"
              >
                Rejection reason (optional)
              </label>

              <textarea
                id="rejectReason"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                disabled={isPending}
                rows={4}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Explain why this submission was rejected"
              />

              <div>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleReject}
                  disabled={isPending}
                >
                  Confirm rejection
                </Button>
              </div>
            </div>
          ) : null}
        </>
      ) : null}

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
};

export default ReviewActions;
