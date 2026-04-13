"use client";

import * as React from "react";
import Link from "next/link";
import {
  BookOpen,
  Check,
  ExternalLink,
  Github,
  Globe,
  MapPin,
  Monitor,
  Star,
  BadgeCheck,
  Copy,
  ShieldAlert,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SerializedResource } from "@/app/actions/resource";
import { getMaintenanceStatusLabel } from "@/utils/constants/resource-taxonomy";
import type { ResourceMaintenanceStatus } from "@/utils/types/resource";
import { cn } from "@/lib/utils";
import { getCategoryStyle } from "@/utils/category-styles";
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

export default function ResourceHighlightCard({
  resource,
  isLoading = false,
}: ResourceHighlightCardProps) {
  if (isLoading) {
    return <ResourceHighlightCardSkeleton />;
  }

  const categoryStyle = getCategoryStyle(resource.category);
  const categoryLabel = getSafeCategoryLabel(resource.category);
  const pricingLabel = formatEnumLabel(resource.pricing);
  const licenseLabel = formatEnumLabel(resource.license);
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
    maintenanceStatus && maintenanceStatus !== "unknown";

  return (
    <aside
      className={cn(
        "relative space-y-6 overflow-hidden rounded-2xl border p-5 shadow-sm transition-all duration-300",
        "hover:-translate-y-0.5 hover:shadow-lg",
        categoryStyle.card,
        categoryStyle.hoverGlow,
      )}
    >
      <div
        className={cn("absolute inset-y-0 left-0 w-1", categoryStyle.accent)}
        aria-hidden="true"
      />

      <div className="space-y-3 pl-2">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Details
        </h3>

        <div className="flex flex-wrap gap-2">
          <Badge
            className={cn(
              "rounded-full border px-2.5 py-1 text-xs font-medium",
              categoryStyle.badge,
            )}
          >
            {categoryLabel}
          </Badge>

          {pricingLabel ? (
            <Badge variant="outline">{pricingLabel}</Badge>
          ) : null}

          {licenseLabel ? (
            <Badge variant="outline">{licenseLabel}</Badge>
          ) : null}

          {resource.featured ? <Badge>Featured</Badge> : null}

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

        {showPublicMaintenanceBadge && maintenanceNotes ? (
          <div
            className={cn(
              "flex items-start gap-2 rounded-xl border px-3 py-3 text-sm",
              "bg-background/70",
              categoryStyle.card,
            )}
          >
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <p className="text-muted-foreground">{maintenanceNotes}</p>
          </div>
        ) : null}
      </div>

      <div className="space-y-3 pl-2">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Links
        </h4>

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
            categoryStyle={categoryStyle}
          />

          <div className="grid gap-2 sm:grid-cols-2">
            <ActionLink
              href={docsHref}
              icon={<BookOpen className="h-4 w-4" />}
              label="Documentation"
              showExternalHint
              categoryStyle={categoryStyle}
            />

            <ActionLink
              href={githubHref}
              icon={<Github className="h-4 w-4" />}
              label="GitHub"
              showExternalHint
              categoryStyle={categoryStyle}
            />
          </div>
        </div>
      </div>

      <div className="space-y-3 pl-2">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Overview
        </h4>

        <div className="grid gap-3 text-sm">
          <InfoRow
            icon={<MapPin className="h-4 w-4" />}
            label="Location"
            value={locationLabel}
            categoryStyle={categoryStyle}
          />

          <InfoRow
            icon={<Monitor className="h-4 w-4" />}
            label="Platforms"
            value={platformsLabel}
            categoryStyle={categoryStyle}
          />

          {hasCommunityRating ? (
            <InfoRow
              icon={<BadgeCheck className="h-4 w-4" />}
              label="Community rating"
              value={`${resource.communityRating.average.toFixed(1)} / 5 (${resource.communityRating.count} reviews)`}
              categoryStyle={categoryStyle}
            />
          ) : null}

          {hasGithubStars ? (
            <InfoRow
              icon={<Star className="h-4 w-4" />}
              label="GitHub stars"
              value={formatCompactNumber(resource.githubStats.stars)}
              categoryStyle={categoryStyle}
            />
          ) : null}
        </div>
      </div>
    </aside>
  );
}

interface ActionLinkProps {
  href: string | null;
  icon: React.ReactNode;
  label: string;
  showExternalHint?: boolean;
  trailingAction?: React.ReactNode;
  categoryStyle: ReturnType<typeof getCategoryStyle>;
}

function ActionLink({
  href,
  icon,
  label,
  showExternalHint = false,
  trailingAction,
  categoryStyle,
}: ActionLinkProps) {
  if (!href) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 rounded-xl border px-3 py-3 text-muted-foreground",
          "bg-background/60",
          categoryStyle.card,
        )}
      >
        <div className="shrink-0">{icon}</div>
        <span className="min-w-0 flex-1 truncate text-sm">{label}</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group flex items-center gap-2 rounded-xl border px-3 py-2 transition-colors",
        "bg-background/80 hover:bg-background",
        categoryStyle.card,
      )}
    >
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

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  categoryStyle: ReturnType<typeof getCategoryStyle>;
}

function InfoRow({ icon, label, value, categoryStyle }: InfoRowProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl border px-3 py-3 transition-colors",
        "bg-background/60 hover:bg-background/90",
        categoryStyle.card,
      )}
    >
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
    <aside className="space-y-6 rounded-2xl border bg-card p-5 shadow-sm">
      <div className="space-y-3">
        <div className="h-4 w-20 animate-pulse rounded bg-muted" />
        <div className="flex flex-wrap gap-2">
          <div className="h-6 w-24 animate-pulse rounded-full bg-muted" />
          <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
          <div className="h-6 w-24 animate-pulse rounded-full bg-muted" />
        </div>
      </div>

      <div className="space-y-3">
        <div className="h-3 w-12 animate-pulse rounded bg-muted" />
        <div className="space-y-2">
          <div className="h-12 w-full animate-pulse rounded-xl bg-muted" />
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="h-12 w-full animate-pulse rounded-xl bg-muted" />
            <div className="h-12 w-full animate-pulse rounded-xl bg-muted" />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="h-3 w-16 animate-pulse rounded bg-muted" />
        <div className="space-y-3">
          <div className="h-16 w-full animate-pulse rounded-xl bg-muted" />
          <div className="h-16 w-full animate-pulse rounded-xl bg-muted" />
          <div className="h-16 w-full animate-pulse rounded-xl bg-muted" />
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
