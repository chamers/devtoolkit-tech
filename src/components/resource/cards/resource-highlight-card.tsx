"use client";

import * as React from "react";
import Link from "next/link";
import {
  BookOpen,
  Check,
  Copy,
  ExternalLink,
  Github,
  Globe,
  MapPin,
  Monitor,
  Pin,
  ShieldAlert,
  Star,
  BadgeCheck,
  DollarSign,
  Scale,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SerializedResource } from "@/app/actions/resource";
import { getMaintenanceStatusLabel } from "@/utils/constants/resource-taxonomy";
import type { ResourceMaintenanceStatus } from "@/utils/types/resource";
import { cn } from "@/lib/utils";
import { getCategoryStyle } from "@/utils/category-styles";
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

interface ResourceHighlightCardProps {
  resource: SerializedResource;
  isLoading?: boolean;
}

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

export default function ResourceHighlightCard({
  resource,
  isLoading = false,
}: ResourceHighlightCardProps) {
  if (isLoading) {
    return <ResourceHighlightCardSkeleton />;
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

  const websiteHref = normalizeUrl(resource.website);
  const docsHref = normalizeUrl(resource.documentationUrl);
  const githubHref = normalizeUrl(resource.githubUrl);

  const websiteDisplay = getDisplayUrl(resource.website);

  const hasCommunityRating =
    (resource.communityRating?.count ?? 0) > 0 &&
    typeof resource.communityRating?.average === "number";

  const hasGithubStars = (resource.githubStats?.stars ?? 0) > 0;

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

  return (
    <aside
      className={cn(
        "relative space-y-5 overflow-visible rounded-md border p-0 shadow-sm transition-all duration-200",
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
              transparent 26px,
              rgba(15, 23, 42, 0.12) 27px,
              rgba(15, 23, 42, 0.12) 28px
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
            h-12 w-12
            text-red-600 fill-red-600 stroke-[1]
            dark:text-red-500 dark:fill-red-500
          "
        />
      </div>

      <div
        className={cn(
          "relative z-10 border-b px-5 pb-4 pt-6",
          categoryStyle.headerBg,
        )}
      >
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            className={cn(
              "rounded-sm border px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider",
              categoryStyle.badge,
            )}
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

        {hasCommunityRating ? (
          <div className="mt-4 rounded-md border border-black/10 bg-white/70 px-3 py-3 dark:border-white/10 dark:bg-black/30">
            <div className="flex items-center gap-2">
              <StarRating
                rating={resource.communityRating!.average}
                size={16}
              />
              <span className="text-sm font-medium text-foreground">
                {resource.communityRating!.average.toFixed(1)}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {resource.communityRating!.count} review
              {resource.communityRating!.count === 1 ? "" : "s"}
            </p>
          </div>
        ) : null}

        {showMaintenanceNotes ? (
          <div className="mt-4 flex items-start gap-2 rounded-md border bg-background/70 px-3 py-3 text-sm">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <p className="text-muted-foreground">{maintenanceNotes}</p>
          </div>
        ) : null}
      </div>

      <div className="relative z-10 space-y-5 px-5 pb-5">
        <Section title="Links">
          <div className="grid gap-2">
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

            <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-1 xl:grid-cols-2">
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

        <Section title="Quick facts">
          <div className="grid gap-3 text-sm">
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
                value={`${resource.communityRating!.average.toFixed(1)} / 5 (${resource.communityRating!.count} review${resource.communityRating!.count === 1 ? "" : "s"})`}
              />
            ) : null}

            {hasGithubStars ? (
              <InfoRow
                icon={<Star className="h-4 w-4" />}
                label="GitHub stars"
                value={formatCompactNumber(resource.githubStats!.stars)}
              />
            ) : null}
          </div>
        </Section>
      </div>
    </aside>
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
      <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {title}
      </h3>
      {children}
    </section>
  );
}

interface ActionLinkProps {
  href: string | null;
  icon: React.ReactNode;
  label: string;
  showExternalHint?: boolean;
  trailingAction?: React.ReactNode;
}

function ActionLink({
  href,
  icon,
  label,
  showExternalHint = false,
  trailingAction,
}: ActionLinkProps) {
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
        <p className="break-words text-sm">{value}</p>
      </div>
    </div>
  );
}

interface CopyUrlButtonProps {
  url: string;
  label?: string;
}

function CopyUrlButton({ url, label = "Copy URL" }: CopyUrlButtonProps) {
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

export function ResourceHighlightCardSkeleton() {
  return (
    <aside className="space-y-5 rounded-md border bg-card p-5 shadow-sm">
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <div className="h-6 w-24 animate-pulse rounded-sm bg-muted" />
          <div className="h-6 w-20 animate-pulse rounded-sm bg-muted" />
        </div>
        <div className="h-16 w-full animate-pulse rounded-md bg-muted" />
      </div>

      <div className="space-y-3">
        <div className="h-3 w-12 animate-pulse rounded bg-muted" />
        <div className="space-y-2">
          <div className="h-12 w-full animate-pulse rounded-md bg-muted" />
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="h-12 w-full animate-pulse rounded-md bg-muted" />
            <div className="h-12 w-full animate-pulse rounded-md bg-muted" />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="h-3 w-20 animate-pulse rounded bg-muted" />
        <div className="space-y-3">
          <div className="h-16 w-full animate-pulse rounded-md bg-muted" />
          <div className="h-16 w-full animate-pulse rounded-md bg-muted" />
          <div className="h-16 w-full animate-pulse rounded-md bg-muted" />
        </div>
      </div>
    </aside>
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
