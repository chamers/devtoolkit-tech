import { z } from "zod";
import {
  RESOURCE_CATEGORIES,
  RESOURCE_EVENT_TYPES,
  RESOURCE_LICENSES,
  RESOURCE_PLATFORMS,
  RESOURCE_PRICING,
  RESOURCE_USE_CASES,
} from "@/utils/constants/resource-taxonomy";
import type { ResourceFormState, ResourceInput } from "@/utils/types/resource";

const resourceCategoryValues = RESOURCE_CATEGORIES.map((item) => item.value);
const resourcePricingValues = RESOURCE_PRICING.map((item) => item.value);
const resourcePlatformValues = RESOURCE_PLATFORMS.map((item) => item.value);
const resourceLicenseValues = RESOURCE_LICENSES.map((item) => item.value);
const resourceUseCaseValues = RESOURCE_USE_CASES.map((item) => item.value);
const resourceEventTypeValues = RESOURCE_EVENT_TYPES.map((item) => item.value);

const includesString = (list: readonly string[], value: unknown): boolean =>
  typeof value === "string" && list.includes(value);

const resourceCategoryEnum = z.custom<ResourceInput["category"]>(
  (value) => includesString(resourceCategoryValues, value),
  { message: "Invalid category" },
);

const resourcePricingEnum = z.custom<ResourceInput["pricing"]>(
  (value) => includesString(resourcePricingValues, value),
  { message: "Invalid pricing" },
);

const resourcePlatformEnum = z.custom<ResourceInput["platforms"][number]>(
  (value) => includesString(resourcePlatformValues, value),
  { message: "Invalid platform" },
);

const resourceLicenseEnum = z.custom<NonNullable<ResourceInput["license"]>>(
  (value) => includesString(resourceLicenseValues, value),
  { message: "Invalid license" },
);

const resourceUseCaseEnum = z.custom<ResourceInput["useCases"][number]>(
  (value) => includesString(resourceUseCaseValues, value),
  { message: "Invalid use case" },
);

const resourceEventTypeEnum = z.custom<
  ResourceInput["developerEvents"][number]["type"]
>((value) => includesString(resourceEventTypeValues, value), {
  message: "Invalid event type",
});

const allowedUseCases = new Set<string>(resourceUseCaseValues);
const allowedPlatforms = new Set<string>(resourcePlatformValues);

const optionalTrimmedString = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value && value.length > 0 ? value : undefined));

const githubStatsSchema = z.object({
  stars: z.number().min(0).default(0),
  forks: z.number().min(0).default(0),
  issues: z.number().min(0).default(0),
  lastCommitDate: z.union([z.date(), z.string(), z.null()]).default(null),
  repository: optionalTrimmedString,
});

const communityRatingSchema = z.object({
  average: z.number().min(0).max(5).default(0),
  count: z.number().min(0).default(0),
});

const eventLocationSchema = z.object({
  venue: optionalTrimmedString,
  city: optionalTrimmedString,
  country: optionalTrimmedString,
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
});

const developerEventSchema = z.object({
  name: z.string().trim().min(1, "Event name is required"),
  type: resourceEventTypeEnum,
  website: z
    .union([z.string().trim().url("Invalid event website URL"), z.literal("")])
    .optional()
    .transform((value) => (value ? value : undefined)),
  startDate: z.union([z.date(), z.string(), z.null()]).optional(),
  endDate: z.union([z.date(), z.string(), z.null()]).optional(),
  location: eventLocationSchema.optional(),
});

const comparisonReferenceSchema = z.object({
  slug: z.string().trim().min(1, "Comparison slug is required"),
  label: z.string().trim().min(1, "Comparison label is required"),
});

const stackFitSchema = z.object({
  frontend: z.boolean().optional().default(false),
  backend: z.boolean().optional().default(false),
  database: z.boolean().optional().default(false),
  auth: z.boolean().optional().default(false),
  deployment: z.boolean().optional().default(false),
  testing: z.boolean().optional().default(false),
  ai: z.boolean().optional().default(false),
});

export const resourceInputSchema: z.ZodType<ResourceInput> = z.object({
  name: z.string().trim().min(1, "Name is required"),
  slug: z.string().trim().min(1, "Slug is required"),
  tagline: z.string().trim().min(1, "Tagline is required"),
  description: z.string().trim().min(1, "Description is required"),

  website: z.string().trim().url("Website must be a valid URL"),
  documentationUrl: z
    .union([
      z.string().trim().url("Documentation URL must be valid"),
      z.literal(""),
    ])
    .optional()
    .transform((value) => (value ? value : undefined)),
  githubUrl: z
    .union([z.string().trim().url("GitHub URL must be valid"), z.literal("")])
    .optional()
    .transform((value) => (value ? value : undefined)),

  category: resourceCategoryEnum,
  pricing: resourcePricingEnum,

  tags: z.array(z.string().trim().min(1)).default([]),
  useCases: z.array(resourceUseCaseEnum).default([]),
  alternatives: z.array(z.string().trim().min(1)).default([]),

  platforms: z.array(resourcePlatformEnum).default([]),
  license: z
    .union([resourceLicenseEnum, z.literal("")])
    .optional()
    .transform((value) => (value ? value : undefined)),

  logo: optionalTrimmedString,
  screenshots: z
    .array(z.string().trim().url("Screenshot must be a valid URL"))
    .default([]),

  headquarters: optionalTrimmedString,
  country: optionalTrimmedString,

  communityRating: communityRatingSchema.default({
    average: 0,
    count: 0,
  }),

  githubStats: githubStatsSchema.default({
    stars: 0,
    forks: 0,
    issues: 0,
    lastCommitDate: null,
    repository: undefined,
  }),

  comparisonTargets: z.array(comparisonReferenceSchema).default([]),
  stackFit: stackFitSchema.default({
    frontend: false,
    backend: false,
    database: false,
    auth: false,
    deployment: false,
    testing: false,
    ai: false,
  }),

  developerEvents: z.array(developerEventSchema).default([]),

  featured: z.boolean().default(false),
  published: z.boolean().default(false),
});

export const resourceFormSchema: z.ZodType<ResourceFormState> = z.object({
  name: z.string().trim().min(1, "Name is required"),
  slug: z.string().trim().min(1, "Slug is required"),
  tagline: z.string().trim().min(1, "Tagline is required"),
  description: z.string().trim().min(1, "Description is required"),

  website: z.string().trim().url("Website must be a valid URL"),
  documentationUrl: z.string().trim().optional().default(""),
  githubUrl: z.string().trim().optional().default(""),

  category: z
    .union([resourceCategoryEnum, z.literal("")])
    .refine((value) => value !== "", {
      message: "Category is required",
    }),
  pricing: z
    .union([resourcePricingEnum, z.literal("")])
    .refine((value) => value !== "", {
      message: "Pricing is required",
    }),

  tags: z.string().default(""),
  useCases: z.string().default(""),
  alternatives: z.string().default(""),

  platforms: z.string().default(""),
  license: z.union([resourceLicenseEnum, z.literal("")]).default(""),

  logo: z.string().optional().default(""),
  screenshots: z.string().default(""),

  headquarters: z.string().optional().default(""),
  country: z.string().optional().default(""),

  communityRating: communityRatingSchema,
  githubStats: githubStatsSchema,

  comparisonTargets: z.array(comparisonReferenceSchema).default([]),
  stackFit: stackFitSchema,

  developerEvents: z.array(developerEventSchema).default([]),

  featured: z.boolean().default(false),
  published: z.boolean().default(false),
});

export type ValidatedResourceInput = z.infer<typeof resourceInputSchema>;
export type ValidatedResourceFormState = z.infer<typeof resourceFormSchema>;

const commaSeparatedToArray = (value = "") =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const isValidUrl = (value: string) => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

export const normalizeResourceFormState = (
  values: ResourceFormState,
): ResourceInput => {
  const normalizedUseCases = commaSeparatedToArray(values.useCases).filter(
    (value): value is ResourceInput["useCases"][number] =>
      allowedUseCases.has(value),
  );

  const normalizedPlatforms = commaSeparatedToArray(values.platforms).filter(
    (value): value is ResourceInput["platforms"][number] =>
      allowedPlatforms.has(value),
  );

  const normalizedScreenshots = commaSeparatedToArray(
    values.screenshots,
  ).filter(isValidUrl);

  return {
    name: values.name.trim(),
    slug: values.slug.trim().toLowerCase(),
    tagline: values.tagline.trim(),
    description: values.description.trim(),

    website: values.website.trim(),
    documentationUrl: values.documentationUrl?.trim() || undefined,
    githubUrl: values.githubUrl?.trim() || undefined,

    category: values.category as ResourceInput["category"],
    pricing: values.pricing as ResourceInput["pricing"],

    tags: commaSeparatedToArray(values.tags),
    useCases: normalizedUseCases,
    alternatives: commaSeparatedToArray(values.alternatives),

    platforms: normalizedPlatforms,
    license: values.license || undefined,

    logo: values.logo?.trim() || undefined,
    screenshots: normalizedScreenshots,

    headquarters: values.headquarters?.trim() || undefined,
    country: values.country?.trim() || undefined,

    communityRating: {
      average: values.communityRating.average ?? 0,
      count: values.communityRating.count ?? 0,
    },

    githubStats: {
      stars: values.githubStats.stars ?? 0,
      forks: values.githubStats.forks ?? 0,
      issues: values.githubStats.issues ?? 0,
      lastCommitDate: values.githubStats.lastCommitDate ?? null,
      repository: values.githubStats.repository?.trim() || undefined,
    },

    comparisonTargets: values.comparisonTargets.map((item) => ({
      slug: item.slug.trim(),
      label: item.label.trim(),
    })),

    stackFit: {
      frontend: values.stackFit.frontend ?? false,
      backend: values.stackFit.backend ?? false,
      database: values.stackFit.database ?? false,
      auth: values.stackFit.auth ?? false,
      deployment: values.stackFit.deployment ?? false,
      testing: values.stackFit.testing ?? false,
      ai: values.stackFit.ai ?? false,
    },

    developerEvents: values.developerEvents.map((event) => ({
      name: event.name.trim(),
      type: event.type,
      website: event.website?.trim() || undefined,
      startDate: event.startDate ?? null,
      endDate: event.endDate ?? null,
      location: event.location
        ? {
            venue: event.location.venue?.trim() || undefined,
            city: event.location.city?.trim() || undefined,
            country: event.location.country?.trim() || undefined,
            latitude: event.location.latitude ?? null,
            longitude: event.location.longitude ?? null,
          }
        : undefined,
    })),

    featured: values.featured ?? false,
    published: values.published ?? false,
  };
};

export const validateResourceFormState = (values: unknown) => {
  return resourceFormSchema.safeParse(values);
};

export const validateResourceInput = (values: unknown) => {
  return resourceInputSchema.safeParse(values);
};
