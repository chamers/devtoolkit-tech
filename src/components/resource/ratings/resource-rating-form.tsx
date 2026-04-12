"use client";

import { useEffect, useState, useTransition } from "react";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

import InteractiveStarRating from "@/components/shared/interactive-star-rating";
import {
  getUserRatingForResource,
  submitResourceRating,
} from "@/app/actions/rating";

interface ResourceRatingFormProps {
  resourceId: string;
  slug: string;
}

const ResourceRatingForm = ({ resourceId, slug }: ResourceRatingFormProps) => {
  const [selectedRating, setSelectedRating] = useState(0);
  const [savedRating, setSavedRating] = useState<number | null>(null);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let ignore = false;

    async function loadUserRating() {
      setLoadingInitial(true);

      const result = await getUserRatingForResource(resourceId);

      if (ignore) return;

      if (!result.ok) {
        toast.error(result.error);
        setLoadingInitial(false);
        return;
      }

      setSavedRating(result.data.rating);
      setSelectedRating(result.data.rating ?? 0);
      setLoadingInitial(false);
    }

    void loadUserRating();

    return () => {
      ignore = true;
    };
  }, [resourceId]);

  const handleSubmit = () => {
    if (selectedRating < 1 || selectedRating > 5) {
      toast.error("Please select a rating between 1 and 5.");
      return;
    }

    startTransition(async () => {
      const wasAlreadyRated = savedRating !== null;

      const result = await submitResourceRating({
        resourceId,
        rating: selectedRating,
        slug,
      });

      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      setSavedRating(result.data.rating);

      toast.success(
        wasAlreadyRated
          ? "Your rating has been updated."
          : "Your rating has been submitted.",
      );
    });
  };

  if (loadingInitial) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading your rating...
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">
        {savedRating ? "Update your rating" : "Rate this resource"}
      </p>

      <InteractiveStarRating
        value={selectedRating}
        onChange={setSelectedRating}
        disabled={isPending}
      />

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isPending || selectedRating === 0}
          className="inline-flex items-center rounded-md bg-foreground px-4 py-2 text-sm text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : savedRating ? (
            "Update rating"
          ) : (
            "Submit rating"
          )}
        </button>

        {selectedRating > 0 && (
          <span className="text-sm text-muted-foreground">
            Selected: {selectedRating}/5
          </span>
        )}
      </div>
    </div>
  );
};

export default ResourceRatingForm;
