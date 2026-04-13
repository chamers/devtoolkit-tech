import { getCategoryLabel } from "@/utils/constants/resource-taxonomy";

export function normalizeUrl(url?: string): string | null {
  if (!url?.trim()) return null;
  const trimmed = url.trim();
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export function getDisplayUrl(url?: string): string {
  if (!url?.trim()) return "";
  return url
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/\/$/, "");
}

export function getLocationLabel(
  headquarters?: string,
  country?: string,
): string {
  if (headquarters && country) return `${headquarters}, ${country}`;
  if (headquarters) return headquarters;
  if (country) return country;
  return "Location not specified";
}

export function formatEnumLabel(value?: string | null): string {
  if (!value) return "";
  return value
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function getPlatformsLabel(platforms?: string[]): string {
  if (!platforms?.length) return "Platforms not specified";
  return platforms.map(formatEnumLabel).join(", ");
}

export function getSafeCategoryLabel(category?: string): string {
  return category ? getCategoryLabel(category as never) : "No category";
}

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}
