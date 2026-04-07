"use client";

import { Layers } from "lucide-react";

export interface CategoryFilterOption {
  value: string;
  label: string;
  slug: string;
}

interface CategoryFilterProps {
  categories: readonly CategoryFilterOption[];
  selectedCategory?: string;
  onCategoryChange: (value?: string) => void;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Layers className="h-4 w-4 text-muted-foreground relative top-[-5px]" />
        <h2 className="text-sm font-semibold tracking-tight">Categories</h2>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onCategoryChange(undefined)}
          className={`rounded-full border px-3 py-1.5 text-sm transition ${
            !selectedCategory
              ? "border-foreground bg-foreground text-background"
              : "border-border bg-background text-foreground hover:bg-muted"
          }`}
        >
          All
        </button>

        {categories.map((category) => {
          const isActive = selectedCategory === category.slug;

          return (
            <button
              key={category.slug}
              type="button"
              onClick={() => onCategoryChange(category.slug)}
              className={`rounded-full border px-3 py-1.5 text-sm transition ${
                isActive
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-background text-foreground hover:bg-muted"
              }`}
            >
              {category.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
