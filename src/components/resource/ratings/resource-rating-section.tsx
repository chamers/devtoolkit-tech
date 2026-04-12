import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import StarRating from "@/components/shared/star-rating";
import ResourceRatingForm from "./resource-rating-form";

interface ResourceRatingSectionProps {
  resourceId: string;
  slug: string;
  average: number;
  count: number;
}

const ResourceRatingSection = ({
  resourceId,
  slug,
  average,
  count,
}: ResourceRatingSectionProps) => {
  const hasRatings = count > 0;

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Community rating</h3>

        {hasRatings ? (
          <div className="flex items-center gap-3">
            <StarRating rating={average} />
            <p className="text-sm text-muted-foreground">
              {average.toFixed(1)} ({count} rating{count === 1 ? "" : "s"})
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No ratings yet</p>
        )}
      </div>

      <SignedIn>
        <ResourceRatingForm resourceId={resourceId} slug={slug} />
      </SignedIn>

      <SignedOut>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Sign in to rate this resource.
          </p>

          <SignInButton mode="modal">
            <Button type="button" variant="outline">
              Sign in to rate
            </Button>
          </SignInButton>
        </div>
      </SignedOut>
    </div>
  );
};

export default ResourceRatingSection;
