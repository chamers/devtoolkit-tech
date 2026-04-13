"use client";

import Image from "next/image";
import type { JSONContent } from "@tiptap/core";
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
  getMaintenanceStatusLabel,
  getPricingLabel,
  getUseCaseLabel,
} from "@/utils/constants/resource-taxonomy";
import type {
  ResourceFormState,
  ResourceMaintenanceStatus,
  ResourceUseCase,
} from "@/utils/types/resource";
import type { SerializedResource } from "@/app/actions/resource";
import StarRating from "@/components/shared/star-rating";
import { getCategoryStyle } from "@/utils/category-styles";

type PreviewResource =
  | Pick<
      SerializedResource,
      | "_id"
      | "name"
      | "slug"
      | "tagline"
      | "description"
      | "website"
      | "documentationUrl"
      | "githubUrl"
      | "category"
      | "pricing"
      | "tags"
      | "useCases"
      | "alternatives"
      | "logo"
      | "communityRating"
      | "maintenanceStatus"
      | "maintenanceNotes"
    >
  | ResourceFormState;

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

const extractTextFromRichText = (
  content: string | JSONContent | null | undefined,
): string => {
  if (!content) return "";

  if (typeof content === "string") {
    return content.trim();
  }

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

const ResourceCard = ({ resource }: { resource: PreviewResource }) => {
  const categoryStyle = getCategoryStyle(resource.category);

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
    extractTextFromRichText(resource.description) ||
    "Resource description will appear here...";

  const alternativesText =
    alternatives.length > 0 ? alternatives.join(", ") : "No alternatives yet";

  const useCasesText =
    useCases.length > 0
      ? useCases
          .map((useCase) => getUseCaseLabel(useCase as ResourceUseCase))
          .join(", ")
      : "No use cases yet";

  const ratingAverage = resource.communityRating?.average ?? 0;
  const ratingCount = resource.communityRating?.count ?? 0;

  const maintenanceStatus = resource.maintenanceStatus;
  const maintenanceNotes = resource.maintenanceNotes?.trim();
  const showPublicMaintenanceBadge =
    maintenanceStatus &&
    maintenanceStatus !== "unknown" &&
    maintenanceStatus !== "active";
  const showPublicMaintenanceNotes =
    showPublicMaintenanceBadge && maintenanceNotes?.length;

  return (
    <Card
      className={[
        "group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border shadow-sm transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-xl",
        categoryStyle.card,
        categoryStyle.hoverGlow,
      ].join(" ")}
    >
      <div
        className={`absolute inset-y-0 left-0 w-1 ${categoryStyle.accent}`}
        aria-hidden="true"
      />

      <CardHeader className="flex flex-row items-center gap-4 pl-6">
        <div
          className={[
            "relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border shadow-sm",
            categoryStyle.iconBg,
          ].join(" ")}
        >
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
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle className="line-clamp-1 text-lg">
              {resource.name || "Resource name"}
            </CardTitle>

            <Badge
              className={[
                "rounded-full border px-2.5 py-1 text-xs font-medium",
                categoryStyle.badge,
              ].join(" ")}
            >
              {categoryText}
            </Badge>

            {showPublicMaintenanceBadge ? (
              <Badge
                className={getMaintenanceBadgeClassName(
                  maintenanceStatus as ResourceMaintenanceStatus,
                )}
              >
                {getMaintenanceStatusLabel(
                  maintenanceStatus as ResourceMaintenanceStatus,
                )}
              </Badge>
            ) : null}
          </div>

          <p className="line-clamp-1 text-sm text-muted-foreground">
            {resource.tagline || "No tagline yet"}
          </p>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-1 pl-6">
        <p className="line-clamp-3 pb-4 text-sm">{descriptionText}</p>

        {showPublicMaintenanceNotes ? (
          <p className="mb-3 line-clamp-2 text-xs text-muted-foreground">
            {maintenanceNotes}
          </p>
        ) : null}

        <div className="pb-3">
          {ratingCount > 0 ? (
            <div className="flex items-center gap-2">
              <StarRating rating={ratingAverage} size={16} />
              <span className="text-sm text-muted-foreground">
                {ratingAverage.toFixed(1)} ({ratingCount})
              </span>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No ratings yet</p>
          )}
        </div>

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
                  {useCasesText}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="mt-auto flex flex-wrap gap-2 border-t pt-3 pl-6 opacity-80 transition-all duration-200 group-hover:opacity-100">
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
    </Card>
  );
};

export default ResourceCard;

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

function getMaintenanceBadgeClassName(status: ResourceMaintenanceStatus) {
  switch (status) {
    case "active":
      return "border-green-200 bg-green-100 text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-300";
    case "outdated":
      return "border-yellow-200 bg-yellow-100 text-yellow-700 dark:border-yellow-900 dark:bg-yellow-950 dark:text-yellow-300";
    case "deprecated":
      return "border-red-200 bg-red-100 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300";
    default:
      return "border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300";
  }
}
