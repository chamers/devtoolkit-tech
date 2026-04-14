"use client";

import type { LucideIcon } from "lucide-react";
import {
  Blocks,
  Bot,
  Brush,
  Cable,
  ChartColumn,
  Database,
  Globe,
  GraduationCap,
  Layers,
  Lock,
  MonitorSmartphone,
  Server,
  Shield,
  SquareTerminal,
  TestTubeDiagonal,
  Workflow,
  Wrench,
  Rocket,
  BookOpen,
  Boxes,
  BarChart3,
  Users,
} from "lucide-react";

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

const categoryIcons: Record<string, LucideIcon> = {
  frontend: Blocks,
  backend: Server,
  fullstack: Layers,
  devops: Wrench,
  testing: TestTubeDiagonal,
  database: Database,
  design: Brush,
  api: Cable,
  cms: BookOpen,
  hosting: Globe,
  authentication: Lock,
  ai: Bot,
  analytics: BarChart3,
  productivity: SquareTerminal,
  security: Shield,
  mobile: MonitorSmartphone,
  deployment: Rocket,
  monitoring: ChartColumn,
  collaboration: Users,
  learning: GraduationCap,
};

export default function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => onCategoryChange(undefined)}
        className={`group flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors ${
          !selectedCategory
            ? "bg-muted font-medium text-foreground"
            : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
        }`}
      >
        <Layers className="h-4 w-4 shrink-0" />
        <span>All categories</span>
      </button>

      <div className="h-px bg-border" />

      <div className="space-y-1">
        {categories.map((category) => {
          const isActive = selectedCategory === category.slug;
          const Icon = categoryIcons[category.slug] ?? Boxes;

          return (
            <button
              key={category.slug}
              type="button"
              onClick={() => onCategoryChange(category.slug)}
              className={`group flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors ${
                isActive
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{category.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
