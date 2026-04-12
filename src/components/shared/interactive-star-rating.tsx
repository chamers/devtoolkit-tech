"use client";

import { Star } from "lucide-react";

type InteractiveStarRatingProps = {
  value: number;
  onChange: (value: number) => void;
  maxRating?: number;
  size?: number;
  className?: string;
  disabled?: boolean;
};

const InteractiveStarRating = ({
  value,
  onChange,
  maxRating = 5,
  size = 24,
  className = "text-yellow-400",
  disabled = false,
}: InteractiveStarRatingProps) => {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxRating }).map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= value;

        return (
          <button
            key={starValue}
            type="button"
            disabled={disabled}
            onClick={() => onChange(starValue)}
            className="transition hover:scale-110 disabled:cursor-not-allowed disabled:opacity-60"
            aria-label={`Rate ${starValue} out of ${maxRating}`}
          >
            <Star
              size={size}
              className={isFilled ? className : "text-muted-foreground/30"}
              fill={isFilled ? "currentColor" : "none"}
            />
          </button>
        );
      })}
    </div>
  );
};

export default InteractiveStarRating;
