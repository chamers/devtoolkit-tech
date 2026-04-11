"use client";

import Image from "next/image";
import {
  BadgeInfo,
  DollarSign,
  Lightbulb,
  Tags,
  Waypoints,
  Globe,
  Github,
  BookOpen,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { JSONContent } from "@tiptap/core";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getCategoryLabel,
  getPricingLabel,
  getUseCaseLabel,
} from "@/utils/constants/resource-taxonomy";
import type {
  ResourceCategory,
  ResourcePricing,
  ResourceUseCase,
} from "@/utils/types/resource";

export type PreviewResource = {
  _id?: string;
  name?: string;
  slug?: string;
  tagline?: string;
  description?: JSONContent | string | null;
  website?: string;
  documentationUrl?: string;
  githubUrl?: string;
  category?: ResourceCategory | "";
  pricing?: ResourcePricing | "";
  tags?: string | string[];
  alternatives?: string | string[];
  useCases?: string | string[];
  logo?: string | null;
  status?: "pending" | "published" | "rejected";
};

const toArray = (value: string | string[] | undefined | null) => {
  if (Array.isArray(value)) {
    return value.map((item) => item.trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const isJsonContent = (value: unknown): value is JSONContent => {
  return typeof value === "object" && value !== null;
};

const extractTextFromJson = (
  content: JSONContent | null | undefined,
): string => {
  if (!content) return "";

  const walk = (node: JSONContent): string => {
    if (node.type === "text") {
      return node.text ?? "";
    }

    if (!node.content?.length) {
      return "";
    }

    const text = node.content.map(walk).join("");

    if (
      node.type === "paragraph" ||
      node.type === "heading" ||
      node.type === "blockquote" ||
      node.type === "codeBlock" ||
      node.type === "listItem"
    ) {
      return `${text}\n`;
    }

    return text;
  };

  return walk(content)
    .replace(/\n{2,}/g, "\n")
    .trim();
};

const getDescriptionText = (description: unknown): string => {
  if (typeof description === "string") {
    return description.trim();
  }

  if (isJsonContent(description)) {
    return extractTextFromJson(description);
  }

  return "";
};

const getStatusClasses = (status: "pending" | "published" | "rejected") => {
  switch (status) {
    case "published":
      return "border-green-200 bg-green-100 text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-300";
    case "rejected":
      return "border-red-200 bg-red-100 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300";
    default:
      return "border-yellow-200 bg-yellow-100 text-yellow-700 dark:border-yellow-900 dark:bg-yellow-950 dark:text-yellow-300";
  }
};

const PreviewCard = ({
  resource,
  showFooter = true,
}: {
  resource: PreviewResource;
  showFooter?: boolean;
}) => {
  const tags = toArray(resource.tags);
  const alternatives = toArray(resource.alternatives);
  const useCases = toArray(resource.useCases);

  const categoryText = resource.category
    ? getCategoryLabel(resource.category)
    : "No category";

  const pricingText = resource.pricing
    ? getPricingLabel(resource.pricing)
    : "Free";

  const taglineText = resource.tagline || "Short summary of the resource";
  const descriptionText =
    getDescriptionText(resource.description) ||
    "Resource description will appear here...";

  const alternativesText =
    alternatives.length > 0 ? alternatives.join(", ") : "No alternatives yet";

  const status = resource.status ?? "pending";

  return (
    <Card className="group flex h-full w-full flex-col border bg-card shadow-sm transition-all hover:-translate-y-px hover:shadow-md">
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border bg-muted shadow-sm">
          {resource.logo ? (
            <Image
              src={resource.logo}
              alt={resource.name || "Resource logo"}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-center">
              <span className="px-1 text-[10px] text-muted-foreground">
                No logo
              </span>
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="line-clamp-1 text-lg">
              {resource.name || "Resource name"}
            </CardTitle>

            <span
              className={[
                "inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 text-xs font-medium capitalize",
                getStatusClasses(status),
              ].join(" ")}
            >
              {status}
            </span>
          </div>

          <p className="line-clamp-1 text-sm text-muted-foreground">
            {categoryText}
          </p>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-3">
        <p className="line-clamp-3 text-sm">{descriptionText}</p>

        <div className="space-y-2">
          <InfoItem icon={BadgeInfo} label="Tagline" text={taglineText} />
          <InfoItem icon={DollarSign} label="Pricing" text={pricingText} />

          <div className="flex items-start gap-2 text-sm">
            <Tags className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="shrink-0 text-muted-foreground">Tags:</span>

            <div className="flex flex-wrap gap-1">
              {tags.length > 0 ? (
                <>
                  {tags.slice(0, 4).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {tags.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{tags.length - 4} more
                    </Badge>
                  )}
                </>
              ) : (
                <span className="text-xs text-muted-foreground">
                  No tags yet
                </span>
              )}
            </div>
          </div>

          <InfoItem
            icon={Waypoints}
            label="Alternatives"
            text={alternativesText}
          />

          <div className="flex items-start gap-2 text-sm">
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="shrink-0 text-muted-foreground">Use Cases:</span>

            <div className="flex flex-wrap gap-1">
              {useCases.length > 0 ? (
                <>
                  {useCases.slice(0, 3).map((useCase) => (
                    <Badge key={useCase} variant="outline" className="text-xs">
                      {getUseCaseLabel(useCase as ResourceUseCase)}
                    </Badge>
                  ))}
                  {useCases.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{useCases.length - 3} more
                    </Badge>
                  )}
                </>
              ) : (
                <span className="text-xs text-muted-foreground">
                  No use cases yet
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>

      {showFooter && (
        <CardFooter className="mt-auto flex flex-wrap gap-2 border-t pt-3 opacity-80 transition-all duration-200 group-hover:-translate-y-px group-hover:opacity-100">
          {resource.website && (
            <Button type="button" variant="outline" size="sm" className="gap-2">
              <Globe className="h-4 w-4" />
              Website
            </Button>
          )}

          {resource.githubUrl && (
            <Button type="button" variant="outline" size="sm" className="gap-2">
              <Github className="h-4 w-4" />
              GitHub
            </Button>
          )}

          {resource.documentationUrl && (
            <Button type="button" variant="outline" size="sm" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Docs
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default PreviewCard;

function InfoItem({
  icon: Icon,
  label,
  text,
}: {
  icon: LucideIcon;
  label: string;
  text: string;
}) {
  return (
    <div className="flex items-start gap-2 text-sm">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <span className="shrink-0 text-muted-foreground">{label}:</span>
      <span className="line-clamp-2">{text}</span>
    </div>
  );
}
