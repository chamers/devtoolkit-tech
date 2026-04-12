"use client";

import { Star } from "lucide-react";

type StarRatingProps = {
  rating: number;
  maxRating?: number;
  size?: number;
  className?: string;
};

const StarRating = ({
  rating,
  maxRating = 5,
  size = 18,
  className = "text-yellow-400",
}: StarRatingProps) => {
  const safeRating = Math.max(0, Math.min(rating, maxRating));

  return (
    <div
      className="flex items-center gap-1"
      aria-label={`Rating: ${safeRating} out of ${maxRating}`}
    >
      {Array.from({ length: maxRating }).map((_, index) => {
        const starNumber = index + 1;

        let fillPercentage = 0;

        if (safeRating >= starNumber) {
          fillPercentage = 100;
        } else if (safeRating > index) {
          fillPercentage = (safeRating - index) * 100;
        }

        return (
          <div
            key={index}
            className="relative inline-flex"
            style={{ width: size, height: size }}
          >
            <Star
              size={size}
              className="absolute inset-0 text-muted-foreground/30"
            />

            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fillPercentage}%` }}
            >
              <Star size={size} className={className} fill="currentColor" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StarRating;
