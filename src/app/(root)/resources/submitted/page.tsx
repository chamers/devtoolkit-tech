import Link from "next/link";
import { CheckCircle2, Clock3 } from "lucide-react";

import { Button } from "@/components/ui/button";

const ResourceSubmittedPage = () => {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-3xl items-center justify-center px-4 py-12">
      <div className="w-full rounded-2xl border bg-background p-8 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 rounded-full bg-green-100 p-3 dark:bg-green-950/40">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <h1 className="text-3xl font-semibold tracking-tight">
            Resource submitted successfully
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
            Your resource is now under review. It will appear on the public
            resources page once it has been approved by an admin.
          </p>

          <div className="mt-6 flex items-center gap-2 rounded-lg border px-4 py-3 text-sm text-muted-foreground">
            <Clock3 className="h-4 w-4" />
            <span>Status: Pending review</span>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild>
              <Link href="/dashboard">Go to dashboard</Link>
            </Button>

            <Button asChild variant="outline">
              <Link href="/resources">Browse resources</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceSubmittedPage;
