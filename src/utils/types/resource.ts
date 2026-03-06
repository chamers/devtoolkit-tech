import {
  RESOURCE_CATEGORIES,
  RESOURCE_EVENT_TYPES,
  RESOURCE_LICENSES,
  RESOURCE_PLATFORMS,
  RESOURCE_PRICING,
  RESOURCE_USE_CASES,
} from "@/utils/constants/resource-taxonomy";

export type ResourceCategory = (typeof RESOURCE_CATEGORIES)[number]["value"];
export type ResourcePricing = (typeof RESOURCE_PRICING)[number]["value"];
export type ResourcePlatform = (typeof RESOURCE_PLATFORMS)[number]["value"];
export type ResourceLicense = (typeof RESOURCE_LICENSES)[number]["value"];
export type ResourceUseCase = (typeof RESOURCE_USE_CASES)[number]["value"];
export type ResourceEventType = (typeof RESOURCE_EVENT_TYPES)[number]["value"];

export interface GithubStats {
  stars: number;
  forks: number;
  issues: number;
  lastCommitDate: Date | string | null;
  repository?: string;
}

export interface CommunityRating {
  average: number;
  count: number;
}

export interface EventLocation {
  venue?: string;
  city?: string;
  country?: string;
  latitude?: number | null;
  longitude?: number | null;
}

export interface DeveloperEvent {
  name: string;
  type: ResourceEventType;
  website?: string;
  startDate?: Date | string | null;
  endDate?: Date | string | null;
  location?: EventLocation;
}

export interface ComparisonReference {
  slug: string;
  label: string;
}

export interface StackFit {
  frontend?: boolean;
  backend?: boolean;
  database?: boolean;
  auth?: boolean;
  deployment?: boolean;
  testing?: boolean;
  ai?: boolean;
}

export interface ResourceState {
  id: string;
  userId: string;

  name: string;
  slug: string;
  tagline: string;
  description: string;

  website: string;
  documentationUrl?: string;
  githubUrl?: string;

  category: ResourceCategory | "";
  pricing: ResourcePricing;

  tags: string[];
  useCases: ResourceUseCase[];
  alternatives: string[];

  platforms: ResourcePlatform[];
  license: ResourceLicense | "";

  logo?: string;
  screenshots?: string[];

  headquarters?: string;
  country?: string;

  communityRating: CommunityRating;
  githubStats: GithubStats;

  comparisonTargets: ComparisonReference[];
  stackFit: StackFit;

  developerEvents: DeveloperEvent[];

  featured: boolean;
  published: boolean;

  createdAt: Date | string;
  updatedAt: Date | string;
}
