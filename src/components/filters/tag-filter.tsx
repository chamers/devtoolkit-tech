"use client";

import { Tag } from "lucide-react";

interface TagFilterProps {
  tags: readonly string[];
  selectedTag?: string;
  onTagChange: (value?: string) => void;
}

export default function TagFilter({
  tags,
  selectedTag,
  onTagChange,
}: TagFilterProps) {
  if (tags.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Tag className="h-4 w-4 text-muted-foreground relative top-[-5px]" />
        <h2 className="text-sm font-semibold tracking-tight">Tags</h2>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onTagChange(undefined)}
          className={`rounded-full border px-3 py-1.5 text-sm transition ${
            !selectedTag
              ? "border-foreground bg-foreground text-background"
              : "border-border bg-background text-foreground hover:bg-muted"
          }`}
        >
          All
        </button>

        {tags.map((tag) => {
          const isActive = selectedTag === tag;

          return (
            <button
              key={tag}
              type="button"
              onClick={() => onTagChange(tag)}
              className={`rounded-full border px-3 py-1.5 text-sm transition ${
                isActive
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-background text-foreground hover:bg-muted"
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>
    </div>
  );
}
