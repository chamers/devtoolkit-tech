// import mongoose, { Schema, model, models, Document } from "mongoose";
// import {
//   RESOURCE_CATEGORIES,
//   RESOURCE_EVENT_TYPES,
//   RESOURCE_LICENSES,
//   RESOURCE_PLATFORMS,
//   RESOURCE_PRICING,
//   RESOURCE_USE_CASES,
// } from "@/utils/constants/resource-taxonomy";
// import type {
//   ResourceCategory,
//   ResourcePricing,
//   ResourcePlatform,
//   ResourceLicense,
//   ResourceUseCase,
//   ResourceEventType,
// } from "@/utils/types/resource";

// export interface IResource extends Document {
//   userId: mongoose.Types.ObjectId;

//   name: string;
//   slug: string;
//   tagline: string;
//   description: string;

//   website: string;
//   documentationUrl?: string;
//   githubUrl?: string;

//   category: ResourceCategory;
//   pricing: ResourcePricing;

//   tags: string[];
//   useCases: ResourceUseCase[];
//   alternatives: string[];

//   platforms: ResourcePlatform[];
//   license?: ResourceLicense;

//   logo?: string;
//   screenshots: string[];

//   headquarters?: string;
//   country?: string;

//   communityRating: {
//     average: number;
//     count: number;
//   };

//   githubStats: {
//     stars: number;
//     forks: number;
//     issues: number;
//     lastCommitDate: Date | null;
//     repository?: string;
//   };

//   comparisonTargets: {
//     slug: string;
//     label: string;
//   }[];

//   stackFit: {
//     frontend?: boolean;
//     backend?: boolean;
//     database?: boolean;
//     auth?: boolean;
//     deployment?: boolean;
//     testing?: boolean;
//     ai?: boolean;
//   };

//   developerEvents: {
//     name: string;
//     type: ResourceEventType;
//     website?: string;
//     startDate?: Date | null;
//     endDate?: Date | null;
//     location?: {
//       venue?: string;
//       city?: string;
//       country?: string;
//       latitude?: number | null;
//       longitude?: number | null;
//     };
//   }[];

//   featured: boolean;
//   published: boolean;

//   createdAt: Date;
//   updatedAt: Date;
// }

// const resourceCategoryValues = RESOURCE_CATEGORIES.map((item) => item.value);
// const resourcePricingValues = RESOURCE_PRICING.map((item) => item.value);
// const resourcePlatformValues = RESOURCE_PLATFORMS.map((item) => item.value);
// const resourceLicenseValues = RESOURCE_LICENSES.map((item) => item.value);
// const resourceUseCaseValues = RESOURCE_USE_CASES.map((item) => item.value);
// const resourceEventTypeValues = RESOURCE_EVENT_TYPES.map((item) => item.value);

// const ResourceSchema = new Schema<IResource>(
//   {
//     userId: {
//       type: Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//       index: true,
//     },

//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     slug: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//       index: true,
//     },
//     tagline: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     description: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     website: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     documentationUrl: {
//       type: String,
//       trim: true,
//     },
//     githubUrl: {
//       type: String,
//       trim: true,
//     },

//     category: {
//       type: String,
//       required: true,
//       enum: resourceCategoryValues,
//       index: true,
//     },
//     pricing: {
//       type: String,
//       required: true,
//       enum: resourcePricingValues,
//       index: true,
//     },

//     tags: {
//       type: [String],
//       default: [],
//     },
//     useCases: {
//       type: [String],
//       enum: resourceUseCaseValues,
//       default: [],
//     },
//     alternatives: {
//       type: [String],
//       default: [],
//     },

//     platforms: {
//       type: [String],
//       enum: resourcePlatformValues,
//       default: [],
//     },
//     license: {
//       type: String,
//       enum: resourceLicenseValues,
//       default: undefined,
//     },

//     logo: {
//       type: String,
//       trim: true,
//     },
//     screenshots: {
//       type: [String],
//       default: [],
//     },

//     headquarters: {
//       type: String,
//       trim: true,
//     },
//     country: {
//       type: String,
//       trim: true,
//     },

//     communityRating: {
//       average: {
//         type: Number,
//         default: 0,
//         min: 0,
//         max: 5,
//       },
//       count: {
//         type: Number,
//         default: 0,
//         min: 0,
//       },
//     },

//     githubStats: {
//       stars: {
//         type: Number,
//         default: 0,
//         min: 0,
//       },
//       forks: {
//         type: Number,
//         default: 0,
//         min: 0,
//       },
//       issues: {
//         type: Number,
//         default: 0,
//         min: 0,
//       },
//       lastCommitDate: {
//         type: Date,
//         default: null,
//       },
//       repository: {
//         type: String,
//         trim: true,
//       },
//     },

//     comparisonTargets: [
//       {
//         slug: {
//           type: String,
//           required: true,
//           trim: true,
//         },
//         label: {
//           type: String,
//           required: true,
//           trim: true,
//         },
//       },
//     ],

//     stackFit: {
//       frontend: { type: Boolean, default: false },
//       backend: { type: Boolean, default: false },
//       database: { type: Boolean, default: false },
//       auth: { type: Boolean, default: false },
//       deployment: { type: Boolean, default: false },
//       testing: { type: Boolean, default: false },
//       ai: { type: Boolean, default: false },
//     },

//     developerEvents: [
//       {
//         name: {
//           type: String,
//           required: true,
//           trim: true,
//         },
//         type: {
//           type: String,
//           required: true,
//           enum: resourceEventTypeValues,
//         },
//         website: {
//           type: String,
//           trim: true,
//         },
//         startDate: {
//           type: Date,
//           default: null,
//         },
//         endDate: {
//           type: Date,
//           default: null,
//         },
//         location: {
//           venue: { type: String, trim: true },
//           city: { type: String, trim: true },
//           country: { type: String, trim: true },
//           latitude: { type: Number, default: null },
//           longitude: { type: Number, default: null },
//         },
//       },
//     ],

//     featured: {
//       type: Boolean,
//       default: false,
//       index: true,
//     },
//     published: {
//       type: Boolean,
//       default: false,
//       index: true,
//     },
//   },
//   {
//     timestamps: true,
//   },
// );

// ResourceSchema.index({
//   name: "text",
//   tagline: "text",
//   description: "text",
//   tags: "text",
// });

// const Resource =
//   models.Resource || model<IResource>("Resource", ResourceSchema);

// export default Resource;

import mongoose, { Schema, model, models, Document } from "mongoose";
import {
  RESOURCE_CATEGORIES,
  RESOURCE_EVENT_TYPES,
  RESOURCE_LICENSES,
  RESOURCE_PLATFORMS,
  RESOURCE_PRICING,
  RESOURCE_USE_CASES,
} from "@/utils/constants/resource-taxonomy";
import type {
  ResourceCategory,
  ResourcePricing,
  ResourcePlatform,
  ResourceLicense,
  ResourceUseCase,
  ResourceEventType,
} from "@/utils/types/resource";

export interface IResource extends Document {
  userId: mongoose.Types.ObjectId;

  name: string;
  slug: string;
  tagline: string;
  description: string;

  website: string;
  documentationUrl?: string;
  githubUrl?: string;

  category: ResourceCategory;
  pricing: ResourcePricing;

  tags: string[];
  useCases: ResourceUseCase[];
  alternatives: string[];

  platforms: ResourcePlatform[];
  license?: ResourceLicense;

  logo?: string;
  screenshots: string[];

  headquarters?: string;
  country?: string;

  communityRating: {
    average: number;
    count: number;
  };

  githubStats: {
    stars: number;
    forks: number;
    issues: number;
    lastCommitDate: Date | null;
    repository?: string;
  };

  comparisonTargets: {
    slug: string;
    label: string;
  }[];

  stackFit: {
    frontend: boolean;
    backend: boolean;
    database: boolean;
    auth: boolean;
    deployment: boolean;
    testing: boolean;
    ai: boolean;
  };

  developerEvents: {
    name: string;
    type: ResourceEventType;
    website?: string;
    startDate?: Date | null;
    endDate?: Date | null;
    location?: {
      venue?: string;
      city?: string;
      country?: string;
      latitude?: number | null;
      longitude?: number | null;
    };
  }[];

  featured: boolean;
  published: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const resourceCategoryValues = RESOURCE_CATEGORIES.map((item) => item.value);
const resourcePricingValues = RESOURCE_PRICING.map((item) => item.value);
const resourcePlatformValues = RESOURCE_PLATFORMS.map((item) => item.value);
const resourceLicenseValues = RESOURCE_LICENSES.map((item) => item.value);
const resourceUseCaseValues = RESOURCE_USE_CASES.map((item) => item.value);
const resourceEventTypeValues = RESOURCE_EVENT_TYPES.map((item) => item.value);

const ResourceSchema = new Schema<IResource>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    tagline: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },

    website: {
      type: String,
      required: true,
      trim: true,
    },
    documentationUrl: {
      type: String,
      trim: true,
      default: undefined,
    },
    githubUrl: {
      type: String,
      trim: true,
      default: undefined,
    },

    category: {
      type: String,
      required: true,
      enum: resourceCategoryValues,
      index: true,
    },
    pricing: {
      type: String,
      required: true,
      enum: resourcePricingValues,
      index: true,
    },

    tags: {
      type: [String],
      default: [],
    },
    useCases: {
      type: [String],
      enum: resourceUseCaseValues,
      default: [],
    },
    alternatives: {
      type: [String],
      default: [],
    },

    platforms: {
      type: [String],
      enum: resourcePlatformValues,
      default: [],
    },
    license: {
      type: String,
      enum: resourceLicenseValues,
      default: undefined,
    },

    logo: {
      type: String,
      trim: true,
      default: undefined,
    },
    screenshots: {
      type: [String],
      default: [],
    },

    headquarters: {
      type: String,
      trim: true,
      default: undefined,
    },
    country: {
      type: String,
      trim: true,
      default: undefined,
    },

    communityRating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
        min: 0,
      },
    },

    githubStats: {
      stars: {
        type: Number,
        default: 0,
        min: 0,
      },
      forks: {
        type: Number,
        default: 0,
        min: 0,
      },
      issues: {
        type: Number,
        default: 0,
        min: 0,
      },
      lastCommitDate: {
        type: Date,
        default: null,
      },
      repository: {
        type: String,
        trim: true,
        default: undefined,
      },
    },

    comparisonTargets: [
      {
        slug: {
          type: String,
          required: true,
          trim: true,
        },
        label: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],

    stackFit: {
      frontend: { type: Boolean, default: false },
      backend: { type: Boolean, default: false },
      database: { type: Boolean, default: false },
      auth: { type: Boolean, default: false },
      deployment: { type: Boolean, default: false },
      testing: { type: Boolean, default: false },
      ai: { type: Boolean, default: false },
    },

    developerEvents: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        type: {
          type: String,
          required: true,
          enum: resourceEventTypeValues,
        },
        website: {
          type: String,
          trim: true,
          default: undefined,
        },
        startDate: {
          type: Date,
          default: null,
        },
        endDate: {
          type: Date,
          default: null,
        },
        location: {
          venue: { type: String, trim: true, default: undefined },
          city: { type: String, trim: true, default: undefined },
          country: { type: String, trim: true, default: undefined },
          latitude: { type: Number, default: null },
          longitude: { type: Number, default: null },
        },
      },
    ],

    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    published: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

ResourceSchema.index({
  name: "text",
  tagline: "text",
  description: "text",
  tags: "text",
});

const Resource =
  models.Resource || model<IResource>("Resource", ResourceSchema);

export default Resource;
