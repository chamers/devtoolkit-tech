"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import type { JSONContent } from "@tiptap/core";
import {
  BadgeCheck,
  BookOpen,
  Check,
  Copy,
  ExternalLink,
  Github,
  Globe,
  Lightbulb,
  MapPin,
  Monitor,
  Pin,
  ShieldAlert,
  Sparkles,
  Star,
  Tags,
  Waypoints,
  DollarSign,
  Scale,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { SerializedResource } from "@/app/actions/resource";
import { getCategoryStyle } from "@/utils/category-styles";
import {
  getMaintenanceStatusLabel,
  getUseCaseLabel,
} from "@/utils/constants/resource-taxonomy";
import type {
  ResourceMaintenanceStatus,
  ResourceUseCase,
} from "@/utils/types/resource";
import { cn } from "@/lib/utils";
import StarRating from "@/components/shared/star-rating";
import {
  formatCompactNumber,
  formatEnumLabel,
  getDisplayUrl,
  getLocationLabel,
  getPlatformsLabel,
  getSafeCategoryLabel,
  normalizeUrl,
} from "@/utils/resource-card-helpers";

interface ResourceDetailCardProps {
  resource: SerializedResource;
  isLoading?: boolean;
}

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
    .replace(/\n{3,}/g, "\n\n")
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

export default function ResourceDetailCard({
  resource,
  isLoading = false,
}: ResourceDetailCardProps) {
  if (isLoading) {
    return <ResourceDetailCardSkeleton />;
  }

  const categoryStyle = getCategoryStyle(resource.category);
  const categoryLabel = getSafeCategoryLabel(resource.category);

  const pricingLabel = formatEnumLabel(resource.pricing) || "Not specified";
  const licenseLabel = formatEnumLabel(resource.license) || "Not specified";
  const locationLabel = getLocationLabel(
    resource.headquarters,
    resource.country,
  );
  const platformsLabel = getPlatformsLabel(resource.platforms);

  const tags = toArray(resource.tags);
  const alternatives = toArray(resource.alternatives);
  const useCases = toArray(resource.useCases);

  const websiteHref = normalizeUrl(resource.website);
  const docsHref = normalizeUrl(resource.documentationUrl);
  const githubHref = normalizeUrl(resource.githubUrl);

  const websiteDisplay = getDisplayUrl(resource.website);

  const descriptionText =
    extractTextFromRichText(resource.description) ||
    "A detailed description for this resource will appear here.";

  const taglineText =
    resource.tagline?.trim() || "Short summary of the resource";

  const ratingAverage = resource.communityRating?.average ?? 0;
  const ratingCount = resource.communityRating?.count ?? 0;
  const hasCommunityRating =
    ratingCount > 0 && typeof resource.communityRating?.average === "number";

  const githubStars = resource.githubStats?.stars ?? 0;
  const hasGithubStars = githubStars > 0;

  const maintenanceStatus = resource.maintenanceStatus;
  const maintenanceNotes = resource.maintenanceNotes?.trim();
  const showPublicMaintenanceBadge =
    maintenanceStatus &&
    maintenanceStatus !== "unknown" &&
    maintenanceStatus !== "active";
  const showMaintenanceNotes = Boolean(
    showPublicMaintenanceBadge && maintenanceNotes?.length,
  );

  const rotationClass = getStickerRotation(resource.name);
  const offsetClass = getStickerOffset(resource.name);

  return (
    <Card
      className={cn(
        "group relative flex flex-col gap-0 overflow-visible rounded-md border p-0",
        "transition-all duration-200",
        categoryStyle.card,
        categoryStyle.hoverGlow,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-90 dark:opacity-70"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              to bottom,
              transparent 0px,
              transparent 30px,
              rgba(15, 23, 42, 0.12) 31px,
              rgba(15, 23, 42, 0.12) 32px
            )
          `,
        }}
      />

      <div
        aria-hidden="true"
        className={`pointer-events-none absolute left-1/2 top-0 z-30 -translate-x-1/2 -translate-y-1/2 ${rotationClass}`}
      >
        <Pin
          className="
            h-15 w-15
            text-red-600 fill-red-600 stroke-[1]
            dark:text-red-500 dark:fill-red-500
          "
        />
      </div>

      <CardHeader
        className={cn(
          "relative z-10 border-b px-6 pb-4 pt-7",
          categoryStyle.headerBg,
        )}
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-start">
          <div
            className={cn(
              "relative h-20 w-20 shrink-0 overflow-hidden rounded-md border shadow-sm",
              categoryStyle.iconBg,
            )}
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
                <span className="px-2 text-[10px] text-muted-foreground">
                  No logo
                </span>
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div className="min-w-0">
                <CardTitle className="line-clamp-2 font-handwritten text-4xl leading-tight tracking-wide text-foreground md:text-5xl">
                  {resource.name || "Resource name"}
                </CardTitle>

                <div className="mt-3 flex flex-wrap items-center gap-2">
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
                    {categoryLabel}
                  </Badge>

                  {resource.featured ? (
                    <Badge className="rounded-sm px-2.5 py-1 uppercase tracking-wide">
                      Featured
                    </Badge>
                  ) : null}

                  {showPublicMaintenanceBadge ? (
                    <Badge
                      className={cn(
                        "rounded-sm px-2.5 py-1 uppercase tracking-wide",
                        getMaintenanceBadgeClassName(
                          maintenanceStatus as ResourceMaintenanceStatus,
                        ),
                      )}
                    >
                      {getMaintenanceStatusLabel(
                        maintenanceStatus as ResourceMaintenanceStatus,
                      )}
                    </Badge>
                  ) : null}
                </div>
              </div>

              {hasCommunityRating ? (
                <div className="flex shrink-0 flex-col items-start rounded-md border border-black/10 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-black/30">
                  <div className="flex items-center gap-2">
                    <StarRating rating={ratingAverage} size={16} />
                    <span className="text-sm font-medium text-foreground">
                      {ratingAverage.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {ratingCount} review{ratingCount === 1 ? "" : "s"}
                  </span>
                </div>
              ) : null}
            </div>

            <p className="mt-4 font-mono text-sm tracking-wide text-foreground">
              <span
                className="
                  px-1
                  bg-[linear-gradient(to_bottom,transparent_30%,rgba(253,224,71,0.6)_30%,rgba(253,224,71,0.6)_85%,transparent_85%)]
                  dark:bg-[linear-gradient(to_bottom,transparent_30%,rgba(250,204,21,0.4)_30%,rgba(250,204,21,0.4)_85%,transparent_85%)]
                "
              >
                {taglineText}
              </span>
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative z-10 space-y-6 px-6 pb-6 pt-5">
        {showMaintenanceNotes ? (
          <div
            className={cn("rounded-md border px-4 py-3", "bg-background/70")}
          >
            <div className="flex items-start gap-2">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {maintenanceNotes}
              </p>
            </div>
          </div>
        ) : null}

        <Section title="Description">
          <div className="space-y-4 text-sm leading-7 text-foreground">
            {descriptionText
              .split("\n")
              .filter(Boolean)
              .map((paragraph, index) => (
                <p
                  key={`${resource._id ?? resource.slug ?? "resource"}-${index}`}
                >
                  {paragraph}
                </p>
              ))}
          </div>
        </Section>

        <div className="grid gap-6 xl:grid-cols-2">
          <Section title="Quick facts">
            <div className="grid gap-3">
              <InfoRow
                icon={<DollarSign className="h-4 w-4" />}
                label="Pricing"
                value={pricingLabel}
              />

              <InfoRow
                icon={<Scale className="h-4 w-4" />}
                label="License"
                value={licenseLabel}
              />

              <InfoRow
                icon={<MapPin className="h-4 w-4" />}
                label="Location"
                value={locationLabel}
              />

              <InfoRow
                icon={<Monitor className="h-4 w-4" />}
                label="Platforms"
                value={platformsLabel}
              />

              {hasCommunityRating ? (
                <InfoRow
                  icon={<BadgeCheck className="h-4 w-4" />}
                  label="Community rating"
                  value={`${ratingAverage.toFixed(1)} / 5 (${ratingCount} review${ratingCount === 1 ? "" : "s"})`}
                />
              ) : null}

              {hasGithubStars ? (
                <InfoRow
                  icon={<Star className="h-4 w-4" />}
                  label="GitHub stars"
                  value={formatCompactNumber(githubStars)}
                />
              ) : null}
            </div>
          </Section>

          <Section title="Links">
            <div className="grid gap-3">
              <ActionLink
                href={websiteHref}
                icon={<Globe className="h-4 w-4" />}
                label={websiteDisplay || "Website not specified"}
                showExternalHint
                trailingAction={
                  websiteHref ? (
                    <CopyUrlButton url={websiteHref} label="Copy website URL" />
                  ) : null
                }
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <ActionLink
                  href={docsHref}
                  icon={<BookOpen className="h-4 w-4" />}
                  label="Documentation"
                  showExternalHint
                />

                <ActionLink
                  href={githubHref}
                  icon={<Github className="h-4 w-4" />}
                  label="GitHub"
                  showExternalHint
                />
              </div>
            </div>
          </Section>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <Section title="Tags">
            <div className="flex flex-wrap gap-2">
              {tags.length > 0 ? (
                tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No tags yet</p>
              )}
            </div>
          </Section>

          <Section title="Use cases">
            <div className="flex flex-wrap gap-2">
              {useCases.length > 0 ? (
                useCases.map((useCase) => (
                  <Badge key={useCase} variant="outline" className="text-xs">
                    {getUseCaseLabel(useCase as ResourceUseCase)}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No use cases yet
                </p>
              )}
            </div>
          </Section>

          <Section title="Alternatives">
            {alternatives.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {alternatives.map((alternative) => (
                  <Badge
                    key={alternative}
                    variant="outline"
                    className="rounded-sm text-xs"
                  >
                    {alternative}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No alternatives listed yet
              </p>
            )}
          </Section>
        </div>
      </CardContent>

      <CardFooter className="relative z-10 mt-auto flex flex-wrap gap-2 border-t px-6 py-4">
        {websiteHref ? (
          <ActionButton
            href={websiteHref}
            icon={<Globe className="h-3.5 w-3.5" />}
          >
            Website
          </ActionButton>
        ) : null}

        {githubHref ? (
          <ActionButton
            href={githubHref}
            icon={<Github className="h-3.5 w-3.5" />}
          >
            GitHub
          </ActionButton>
        ) : null}

        {docsHref ? (
          <ActionButton
            href={docsHref}
            icon={<BookOpen className="h-3.5 w-3.5" />}
          >
            Docs
          </ActionButton>
        ) : null}
      </CardFooter>
    </Card>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {title}
        </h3>
      </div>
      {children}
    </section>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-md border bg-background/60 px-3 py-3 transition-colors hover:bg-background/90">
      <div className="mt-0.5 shrink-0 text-muted-foreground">{icon}</div>

      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="break-words text-sm text-foreground">{value}</p>
      </div>
    </div>
  );
}

function ActionLink({
  href,
  icon,
  label,
  showExternalHint = false,
  trailingAction,
}: {
  href: string | null;
  icon: React.ReactNode;
  label: string;
  showExternalHint?: boolean;
  trailingAction?: React.ReactNode;
}) {
  if (!href) {
    return (
      <div className="flex items-center gap-2 rounded-md border bg-background/60 px-3 py-3 text-muted-foreground">
        <div className="shrink-0">{icon}</div>
        <span className="min-w-0 flex-1 truncate text-sm">{label}</span>
      </div>
    );
  }

  return (
    <div className="group flex items-center gap-2 rounded-md border bg-background/70 px-3 py-2 transition-colors hover:bg-background">
      <Button
        asChild
        variant="ghost"
        className="h-auto flex-1 justify-start px-0 py-0 hover:bg-transparent"
      >
        <Link
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-w-0 flex-1 items-center gap-2"
        >
          <span className="shrink-0 text-muted-foreground">{icon}</span>

          <span className="min-w-0 truncate text-sm font-medium">{label}</span>

          {showExternalHint ? (
            <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          ) : null}
        </Link>
      </Button>

      {trailingAction ? <div className="shrink-0">{trailingAction}</div> : null}
    </div>
  );
}

function ActionButton({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Button
      asChild
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
      <Link href={href} target="_blank" rel="noopener noreferrer">
        {icon}
        {children}
      </Link>
    </Button>
  );
}

function CopyUrlButton({
  url,
  label = "Copy URL",
}: {
  url: string;
  label?: string;
}) {
  const [copied, setCopied] = React.useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (error) {
      console.error("Failed to copy URL:", error);
    }
  }

  return (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      className="h-8 w-8"
      onClick={handleCopy}
      aria-label={label}
      title={label}
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </Button>
  );
}

export function ResourceDetailCardSkeleton() {
  return (
    <Card className="relative overflow-hidden rounded-md border p-0">
      <div className="space-y-6 px-6 pb-6 pt-8">
        <div className="flex gap-4">
          <div className="h-20 w-20 animate-pulse rounded-md bg-muted" />
          <div className="flex-1 space-y-3">
            <div className="h-10 w-2/3 animate-pulse rounded bg-muted" />
            <div className="h-5 w-1/3 animate-pulse rounded bg-muted" />
            <div className="h-5 w-1/2 animate-pulse rounded bg-muted" />
          </div>
        </div>

        <div className="h-28 w-full animate-pulse rounded-md bg-muted" />

        <div className="grid gap-4 md:grid-cols-2">
          <div className="h-48 animate-pulse rounded-md bg-muted" />
          <div className="h-48 animate-pulse rounded-md bg-muted" />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="h-28 animate-pulse rounded-md bg-muted" />
          <div className="h-28 animate-pulse rounded-md bg-muted" />
          <div className="h-28 animate-pulse rounded-md bg-muted" />
        </div>
      </div>
    </Card>
  );
}

function getMaintenanceBadgeClassName(status: ResourceMaintenanceStatus) {
  switch (status) {
    case "active":
      return cn(
        "border-green-200 bg-green-100 text-green-700",
        "dark:border-green-900 dark:bg-green-950 dark:text-green-300",
      );
    case "outdated":
      return cn(
        "border-yellow-200 bg-yellow-100 text-yellow-700",
        "dark:border-yellow-900 dark:bg-yellow-950 dark:text-yellow-300",
      );
    case "deprecated":
      return cn(
        "border-red-200 bg-red-100 text-red-700",
        "dark:border-red-900 dark:bg-red-950 dark:text-red-300",
      );
    default:
      return cn(
        "border-slate-200 bg-slate-100 text-slate-700",
        "dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300",
      );
  }
}
