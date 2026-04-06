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
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SerializedResource } from "@/app/actions/resource";
import { getCategoryLabel } from "@/utils/constants/resource-taxonomy";
import { cn } from "@/lib/utils";

interface SingleResourceCardProps {
  resource: SerializedResource;
  isLoading?: boolean;
}

export default function ResourceHighlightCard({
  resource,
  isLoading = false,
}: SingleResourceCardProps) {
  if (isLoading) {
    return <ResourceHighlightCardSkeleton />;
  }

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

  return (
    <aside className="space-y-6 rounded-2xl border bg-card p-5 shadow-sm">
      <div className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Details
        </h3>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{categoryLabel}</Badge>
          {pricingLabel ? (
            <Badge variant="outline">{pricingLabel}</Badge>
          ) : null}
          {licenseLabel ? (
            <Badge variant="outline">{licenseLabel}</Badge>
          ) : null}
          {resource.featured ? <Badge>Featured</Badge> : null}
        </div>
      </div>

      <div className="space-y-3">
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
          />

          <div className="grid gap-2 sm:grid-cols-2">
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
      </div>

      <div className="space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Overview
        </h4>

        <div className="grid gap-3 text-sm">
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
              value={`${resource.communityRating.average.toFixed(1)} / 5 (${resource.communityRating.count} reviews)`}
            />
          ) : null}

          {hasGithubStars ? (
            <InfoRow
              icon={<Star className="h-4 w-4" />}
              label="GitHub stars"
              value={formatCompactNumber(resource.githubStats.stars)}
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
      <div className="flex items-center gap-2 rounded-xl border bg-muted/30 px-3 py-3 text-muted-foreground">
        <div className="shrink-0">{icon}</div>
        <span className="min-w-0 flex-1 truncate text-sm">{label}</span>
      </div>
    );
  }

  return (
    <div className="group flex items-center gap-2 rounded-xl border bg-background px-3 py-2 transition-colors hover:bg-muted/40">
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
}

function InfoRow({ icon, label, value }: InfoRowProps) {
  return (
    <div className="flex items-start gap-3 rounded-xl border bg-muted/20 px-3 py-3 transition-colors hover:bg-muted/40">
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

function normalizeUrl(url?: string): string | null {
  if (!url?.trim()) return null;
  const trimmed = url.trim();
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function getDisplayUrl(url?: string): string {
  if (!url?.trim()) return "";
  return url
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/\/$/, "");
}

function getLocationLabel(headquarters?: string, country?: string): string {
  if (headquarters && country) return `${headquarters}, ${country}`;
  if (headquarters) return headquarters;
  if (country) return country;
  return "Location not specified";
}

function getPlatformsLabel(platforms?: string[]): string {
  if (!platforms?.length) return "Platforms not specified";
  return platforms.map(formatEnumLabel).join(", ");
}

function getSafeCategoryLabel(category?: string): string {
  return category ? getCategoryLabel(category as never) : "No category";
}

function formatEnumLabel(value?: string | null): string {
  if (!value) return "";
  return value
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}
