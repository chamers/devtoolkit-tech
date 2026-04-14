"use client";

import Image from "next/image";
import type { JSONContent } from "@tiptap/core";
import {
  BadgeInfo,
  BookOpen,
  DollarSign,
  Github,
  Globe,
  Lightbulb,
  Tags,
  Waypoints,
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
import {
  getCategoryLabel,
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
import { Button } from "@/components/ui/button";

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

function getStickerSeed(seed: string | undefined) {
  if (!seed) return 0;

  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }

  return Math.abs(hash);
}

function getStickerRotation(seed: string | undefined) {
  const rotations = [
    "rotate-[-3deg]",
    "rotate-[-2deg]",
    "rotate-[-1deg]",
    "rotate-[0deg]",
    "rotate-[1deg]",
    "rotate-[2deg]",
    "rotate-[3deg]",
  ];

  const hash = getStickerSeed(seed);
  return rotations[hash % rotations.length];
}

function getStickerOffset(seed: string | undefined) {
  const offsets = [
    "translate-y-0",
    "translate-y-px",
    "-translate-y-px",
    "translate-x-px",
    "-translate-x-px",
  ];

  const hash = getStickerSeed(seed);
  return offsets[hash % offsets.length];
}

const ResourceCardRedesign = ({ resource }: { resource: PreviewResource }) => {
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
  const showPublicMaintenanceNotes = Boolean(
    showPublicMaintenanceBadge && maintenanceNotes?.length,
  );

  const rotationClass = getStickerRotation(resource.name);
  const offsetClass = getStickerOffset(resource.name);

  return (
    <Card
      className={`
    relative flex flex-col gap-0 overflow-hidden rounded-md border p-0
    ${categoryStyle.card}
    ${categoryStyle.hoverGlow}
    transition-all duration-200
  `}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-90 dark:opacity-70"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              to bottom,
              transparent 0px,
              transparent 26px,
              rgba(15, 23, 42, 0.14) 27px,
              rgba(15, 23, 42, 0.14) 28px
            )
          `,
        }}
      />

      <CardHeader
        className={[
          "relative z-10 flex flex-row items-center gap-4 border-b px-6 py-4",
          categoryStyle.headerBg,
        ].join(" ")}
      >
        <div
          className={[
            "relative h-14 w-14 shrink-0 overflow-hidden rounded-md border shadow-sm",
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

        <div className="flex min-w-0 flex-1 items-center justify-between gap-4">
          <CardTitle className="line-clamp-1 font-handwritten text-4xl leading-tight tracking-wide text-foreground">
            {resource.name || "Resource name"}
          </CardTitle>

          <Badge
            className={[
              "relative shrink-0",
              "px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider",
              "rounded-sm",
              "bg-white/80 dark:bg-black/40",
              "border border-black/10 dark:border-white/10",
              rotationClass,
              offsetClass,
              "shadow-[1px_1px_0px_rgba(0,0,0,0.06),_-1px_2px_0px_rgba(0,0,0,0.04)]",
              "before:absolute before:inset-0 before:-z-10 before:translate-x-px before:translate-y-px before:rounded-sm before:border before:border-black/5",
              categoryStyle.badge,
            ].join(" ")}
          >
            {categoryText}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="relative z-10 flex-1 space-y-1 pl-6 pb-2 pt-3">
        <p className="mb-3 line-clamp-2 pb-4 font-mono text-sm tracking-wide text-foreground">
          <span
            className="
    px-1
    bg-[linear-gradient(to_bottom,transparent_30%,rgba(253,224,71,0.6)_30%,rgba(253,224,71,0.6)_85%,transparent_85%)]
    dark:bg-[linear-gradient(to_bottom,transparent_30%,rgba(250,204,21,0.4)_30%,rgba(250,204,21,0.4)_85%,transparent_85%)]
  "
          >
            {resource.tagline}
          </span>
        </p>

        {showPublicMaintenanceNotes ? (
          <p className="mb-3 line-clamp-2 text-xs text-muted-foreground">
            {maintenanceNotes}
          </p>
        ) : null}

        <div className="space-y-1 pb-1">
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

        <div className="space-y-1 pb-3">
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
      <CardFooter className="mt-auto flex flex-wrap gap-2  px-6 py-3">
        {resource.website && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="
        h-8 rounded-[3px] border border-black/10 bg-white/70 px-3
        font-mono text-xs tracking-wide text-foreground shadow-sm
        transition-all duration-200 hover:-translate-y-0.5 hover:bg-white
        dark:border-white/10 dark:bg-black/30 dark:hover:bg-black/40
      "
          >
            <Globe className="h-3.5 w-3.5" />
            Website
          </Button>
        )}

        {resource.githubUrl && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="
        h-8 rounded-[3px] border border-black/10 bg-white/70 px-3
        font-mono text-xs tracking-wide text-foreground shadow-sm
        transition-all duration-200 hover:-translate-y-0.5 hover:bg-white
        dark:border-white/10 dark:bg-black/30 dark:hover:bg-black/40
      "
          >
            <Github className="h-3.5 w-3.5" />
            GitHub
          </Button>
        )}

        {resource.documentationUrl && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="
        h-8 rounded-[3px] border border-black/10 bg-white/70 px-3
        font-mono text-xs tracking-wide text-foreground shadow-sm
        transition-all duration-200 hover:-translate-y-0.5 hover:bg-white
        dark:border-white/10 dark:bg-black/30 dark:hover:bg-black/40
      "
          >
            <BookOpen className="h-3.5 w-3.5" />
            Docs
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ResourceCardRedesign;

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

      <span className="line-clamp-2 font-mono tracking-wide text-foreground">
        {text}
      </span>
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
