// import {
//   RESOURCE_CATEGORIES,
//   RESOURCE_EVENT_TYPES,
//   RESOURCE_LICENSES,
//   RESOURCE_PLATFORMS,
//   RESOURCE_PRICING,
//   RESOURCE_USE_CASES,
// } from "@/utils/constants/resource-taxonomy";

// export type ResourceCategory = (typeof RESOURCE_CATEGORIES)[number]["value"];
// export type ResourcePricing = (typeof RESOURCE_PRICING)[number]["value"];
// export type ResourcePlatform = (typeof RESOURCE_PLATFORMS)[number]["value"];
// export type ResourceLicense = (typeof RESOURCE_LICENSES)[number]["value"];
// export type ResourceUseCase = (typeof RESOURCE_USE_CASES)[number]["value"];
// export type ResourceEventType = (typeof RESOURCE_EVENT_TYPES)[number]["value"];

// export interface GithubStats {
//   stars: number;
//   forks: number;
//   issues: number;
//   lastCommitDate: Date | string | null;
//   repository?: string;
// }

// export interface CommunityRating {
//   average: number;
//   count: number;
// }

// export interface EventLocation {
//   venue?: string;
//   city?: string;
//   country?: string;
//   latitude?: number | null;
//   longitude?: number | null;
// }

// export interface DeveloperEvent {
//   name: string;
//   type: ResourceEventType;
//   website?: string;
//   startDate?: Date | string | null;
//   endDate?: Date | string | null;
//   location?: EventLocation;
// }

// export interface ComparisonReference {
//   slug: string;
//   label: string;
// }

// export interface StackFit {
//   frontend?: boolean;
//   backend?: boolean;
//   database?: boolean;
//   auth?: boolean;
//   deployment?: boolean;
//   testing?: boolean;
//   ai?: boolean;
// }

// export interface ResourceState {
//   id: string;
//   userId: string;

//   name: string;
//   slug: string;
//   tagline: string;
//   description: string;

//   website: string;
//   documentationUrl?: string;
//   githubUrl?: string;

//   category: ResourceCategory | "";
//   pricing: ResourcePricing;

//   tags: string[];
//   useCases: ResourceUseCase[];
//   alternatives: string[];

//   platforms: ResourcePlatform[];
//   license: ResourceLicense | "";

//   logo?: string;
//   screenshots?: string[];

//   headquarters?: string;
//   country?: string;

//   communityRating: CommunityRating;
//   githubStats: GithubStats;

//   comparisonTargets: ComparisonReference[];
//   stackFit: StackFit;

//   developerEvents: DeveloperEvent[];

//   featured: boolean;
//   published: boolean;

//   createdAt: Date | string;
//   updatedAt: Date | string;
// }

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

export interface ResourceBase {
  name: string;
  slug: string;
  tagline: string;
  description: string;

  website: string;
  documentationUrl?: string;
  githubUrl?: string;

  tags: string[];
  alternatives: string[];

  logo?: string;
  screenshots: string[];

  headquarters?: string;
  country?: string;

  communityRating: CommunityRating;
  githubStats: GithubStats;

  comparisonTargets: ComparisonReference[];
  stackFit: StackFit;

  developerEvents: DeveloperEvent[];

  featured: boolean;
  published: boolean;
}

export interface ResourceFormState extends Omit<
  ResourceBase,
  "tags" | "alternatives" | "screenshots" | "useCases" | "platforms"
> {
  category: ResourceCategory | "";
  pricing: ResourcePricing | "";
  license: ResourceLicense | "";

  tags: string;
  alternatives: string;
  screenshots: string;
  useCases: string;
  platforms: string;
}

export interface ResourceInput extends ResourceBase {
  category: ResourceCategory;
  pricing: ResourcePricing;
  useCases: ResourceUseCase[];
  platforms: ResourcePlatform[];
  license?: ResourceLicense;
}

export interface Resource extends ResourceInput {
  id: string;
  userId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export const defaultResourceFormState: ResourceFormState = {
  name: "",
  slug: "",
  tagline: "",
  description: "",

  website: "",
  documentationUrl: "",
  githubUrl: "",

  category: "",
  pricing: "",
  tags: "",
  useCases: "",
  alternatives: "",

  platforms: "",
  license: "",

  logo: "",
  screenshots: "",

  headquarters: "",
  country: "",

  communityRating: {
    average: 0,
    count: 0,
  },

  githubStats: {
    stars: 0,
    forks: 0,
    issues: 0,
    lastCommitDate: null,
    repository: "",
  },

  comparisonTargets: [],
  stackFit: {
    frontend: false,
    backend: false,
    database: false,
    auth: false,
    deployment: false,
    testing: false,
    ai: false,
  },

  developerEvents: [],

  featured: false,
  published: false,
};
