export type TaxonomyOption<T extends string> = {
  value: T;
  label: string;
  slug: string;
};

const createTaxonomyHelpers = <T extends readonly TaxonomyOption<string>[]>(
  options: T,
) => {
  const getLabel = (value: string) =>
    options.find((option) => option.value === value)?.label ?? value;

  const getSlug = (value: string) =>
    options.find((option) => option.value === value)?.slug ?? value;

  const getValueBySlug = (slug: string) =>
    options.find((option) => option.slug === slug)?.value;

  return {
    options,
    getLabel,
    getSlug,
    getValueBySlug,
  };
};

export const RESOURCE_CATEGORIES = [
  { value: "frontend", label: "Frontend", slug: "frontend" },
  { value: "backend", label: "Backend", slug: "backend" },
  { value: "fullstack", label: "Fullstack", slug: "fullstack" },
  { value: "devops", label: "DevOps", slug: "devops" },
  { value: "testing", label: "Testing", slug: "testing" },
  { value: "database", label: "Database", slug: "database" },
  { value: "design", label: "Design", slug: "design" },
  { value: "api", label: "API", slug: "api" },
  { value: "cms", label: "CMS", slug: "cms" },
  { value: "hosting", label: "Hosting", slug: "hosting" },
  {
    value: "authentication",
    label: "Authentication",
    slug: "authentication",
  },
  { value: "ai", label: "AI", slug: "ai" },
  { value: "analytics", label: "Analytics", slug: "analytics" },
  { value: "productivity", label: "Productivity", slug: "productivity" },
  { value: "security", label: "Security", slug: "security" },
  { value: "mobile", label: "Mobile", slug: "mobile" },
  { value: "deployment", label: "Deployment", slug: "deployment" },
  { value: "monitoring", label: "Monitoring", slug: "monitoring" },
  {
    value: "collaboration",
    label: "Collaboration",
    slug: "collaboration",
  },
  { value: "learning", label: "Learning", slug: "learning" },
] as const satisfies readonly TaxonomyOption<string>[];

export const RESOURCE_PRICING = [
  { value: "free", label: "Free", slug: "free" },
  { value: "freemium", label: "Freemium", slug: "freemium" },
  { value: "paid", label: "Paid", slug: "paid" },
  {
    value: "open-source",
    label: "Open Source",
    slug: "open-source",
  },
  {
    value: "subscription",
    label: "Subscription",
    slug: "subscription",
  },
  { value: "enterprise", label: "Enterprise", slug: "enterprise" },
  {
    value: "custom-pricing",
    label: "Custom Pricing",
    slug: "custom-pricing",
  },
] as const satisfies readonly TaxonomyOption<string>[];

export const RESOURCE_PLATFORMS = [
  { value: "web", label: "Web", slug: "web" },
  { value: "windows", label: "Windows", slug: "windows" },
  { value: "mac", label: "Mac", slug: "mac" },
  { value: "linux", label: "Linux", slug: "linux" },
  { value: "ios", label: "iOS", slug: "ios" },
  { value: "android", label: "Android", slug: "android" },
  {
    value: "cross-platform",
    label: "Cross Platform",
    slug: "cross-platform",
  },
  { value: "cli", label: "CLI", slug: "cli" },
] as const satisfies readonly TaxonomyOption<string>[];

export const RESOURCE_LICENSES = [
  { value: "proprietary", label: "Proprietary", slug: "proprietary" },
  { value: "open-source", label: "Open Source", slug: "open-source" },
  { value: "mit", label: "MIT", slug: "mit" },
  { value: "apache-2.0", label: "Apache 2.0", slug: "apache-2-0" },
  { value: "gpl", label: "GPL", slug: "gpl" },
  { value: "bsd", label: "BSD", slug: "bsd" },
  { value: "custom", label: "Custom", slug: "custom" },
] as const satisfies readonly TaxonomyOption<string>[];

export const RESOURCE_USE_CASES = [
  { value: "ui-design", label: "UI Design", slug: "ui-design" },
  {
    value: "component-library",
    label: "Component Library",
    slug: "component-library",
  },
  { value: "styling", label: "Styling", slug: "styling" },
  {
    value: "api-development",
    label: "API Development",
    slug: "api-development",
  },
  {
    value: "authentication",
    label: "Authentication",
    slug: "authentication",
  },
  {
    value: "database-management",
    label: "Database Management",
    slug: "database-management",
  },
  { value: "deployment", label: "Deployment", slug: "deployment" },
  { value: "hosting", label: "Hosting", slug: "hosting" },
  { value: "testing", label: "Testing", slug: "testing" },
  { value: "monitoring", label: "Monitoring", slug: "monitoring" },
  {
    value: "collaboration",
    label: "Collaboration",
    slug: "collaboration",
  },
  {
    value: "documentation",
    label: "Documentation",
    slug: "documentation",
  },
  { value: "learning", label: "Learning", slug: "learning" },
  { value: "automation", label: "Automation", slug: "automation" },
  {
    value: "ai-assistance",
    label: "AI Assistance",
    slug: "ai-assistance",
  },
  { value: "productivity", label: "Productivity", slug: "productivity" },
] as const satisfies readonly TaxonomyOption<string>[];

export const RESOURCE_EVENT_TYPES = [
  { value: "conference", label: "Conference", slug: "conference" },
  { value: "meetup", label: "Meetup", slug: "meetup" },
  { value: "workshop", label: "Workshop", slug: "workshop" },
  { value: "hackathon", label: "Hackathon", slug: "hackathon" },
  { value: "webinar", label: "Webinar", slug: "webinar" },
] as const satisfies readonly TaxonomyOption<string>[];

// Reusable helper exports
export const categoryTaxonomy = createTaxonomyHelpers(RESOURCE_CATEGORIES);
export const pricingTaxonomy = createTaxonomyHelpers(RESOURCE_PRICING);
export const platformTaxonomy = createTaxonomyHelpers(RESOURCE_PLATFORMS);
export const licenseTaxonomy = createTaxonomyHelpers(RESOURCE_LICENSES);
export const useCaseTaxonomy = createTaxonomyHelpers(RESOURCE_USE_CASES);
export const eventTypeTaxonomy = createTaxonomyHelpers(RESOURCE_EVENT_TYPES);

// Handy direct helper exports
export const getCategoryLabel = categoryTaxonomy.getLabel;
export const getCategorySlug = categoryTaxonomy.getSlug;
export const getCategoryValueBySlug = categoryTaxonomy.getValueBySlug;

export const getPricingLabel = pricingTaxonomy.getLabel;
export const getPricingSlug = pricingTaxonomy.getSlug;
export const getPricingValueBySlug = pricingTaxonomy.getValueBySlug;

export const getUseCaseLabel = useCaseTaxonomy.getLabel;
export const getUseCaseSlug = useCaseTaxonomy.getSlug;
export const getUseCaseValueBySlug = useCaseTaxonomy.getValueBySlug;
