"use server";

import slugify from "slugify";
import mongoose from "mongoose";
import { currentUser } from "@clerk/nextjs/server";

import db from "@/utils/db";
import Resource from "@/models/resource";
import type { ResourceInput } from "@/utils/types/resource";

type ActionResult<T> = { ok: true; data: T } | { ok: false; error: string };

type ResourcePayload = ReturnType<typeof buildResourcePayload>;

type ResourceDocumentLike = ResourcePayload & {
  _id: mongoose.Types.ObjectId | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

export type SerializedResource = ResourcePayload & {
  _id: string;
  createdAt: string;
  updatedAt: string;
};

export type PaginatedResources = {
  resources: SerializedResource[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
};

const DEFAULT_RESOURCE_PAGE_SIZE = 12;

function normalizeOptionalString(value?: string) {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}

function normalizeStringArray(values: string[] = []) {
  return [...new Set(values.map((item) => item.trim()).filter(Boolean))];
}

async function generateUniqueSlug(name: string, excludeId?: string) {
  const baseSlug = slugify(name, {
    lower: true,
    strict: true,
    trim: true,
  });

  let slug = baseSlug;
  let counter = 2;

  while (
    await Resource.exists({
      slug,
      ...(excludeId ? { _id: { $ne: excludeId } } : {}),
    })
  ) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  return slug;
}

function buildResourcePayload(
  data: ResourceInput,
  user: Awaited<ReturnType<typeof currentUser>>,
  slug: string,
) {
  return {
    userId: user?.id,
    userEmail: user?.emailAddresses[0]?.emailAddress,

    name: data.name.trim(),
    slug,
    tagline: data.tagline.trim(),
    description: data.description.trim(),

    website: data.website.trim(),
    documentationUrl: normalizeOptionalString(data.documentationUrl),
    githubUrl: normalizeOptionalString(data.githubUrl),

    category: data.category,
    pricing: data.pricing,

    tags: normalizeStringArray(data.tags),
    useCases: data.useCases ?? [],
    alternatives: normalizeStringArray(data.alternatives),

    platforms: data.platforms ?? [],
    license: data.license || undefined,

    logo: normalizeOptionalString(data.logo),
    screenshots: normalizeStringArray(data.screenshots),

    headquarters: normalizeOptionalString(data.headquarters),
    country: normalizeOptionalString(data.country),

    communityRating: {
      average: data.communityRating?.average ?? 0,
      count: data.communityRating?.count ?? 0,
    },

    githubStats: {
      stars: data.githubStats?.stars ?? 0,
      forks: data.githubStats?.forks ?? 0,
      issues: data.githubStats?.issues ?? 0,
      lastCommitDate: data.githubStats?.lastCommitDate ?? null,
      repository: normalizeOptionalString(data.githubStats?.repository),
    },

    comparisonTargets: (data.comparisonTargets ?? []).map((item) => ({
      slug: item.slug.trim(),
      label: item.label.trim(),
    })),

    stackFit: {
      frontend: data.stackFit?.frontend ?? false,
      backend: data.stackFit?.backend ?? false,
      database: data.stackFit?.database ?? false,
      auth: data.stackFit?.auth ?? false,
      deployment: data.stackFit?.deployment ?? false,
      testing: data.stackFit?.testing ?? false,
      ai: data.stackFit?.ai ?? false,
    },

    developerEvents: (data.developerEvents ?? []).map((event) => ({
      name: event.name.trim(),
      type: event.type,
      website: normalizeOptionalString(event.website),
      startDate: event.startDate ?? null,
      endDate: event.endDate ?? null,
      location: event.location
        ? {
            venue: normalizeOptionalString(event.location.venue),
            city: normalizeOptionalString(event.location.city),
            country: normalizeOptionalString(event.location.country),
            latitude: event.location.latitude ?? null,
            longitude: event.location.longitude ?? null,
          }
        : undefined,
    })),

    featured: data.featured ?? false,
    published: data.published ?? false,
  };
}

function serializeResource(resource: ResourceDocumentLike): SerializedResource {
  return {
    ...resource,
    _id: resource._id.toString(),
    createdAt:
      resource.createdAt instanceof Date
        ? resource.createdAt.toISOString()
        : (resource.createdAt ?? ""),
    updatedAt:
      resource.updatedAt instanceof Date
        ? resource.updatedAt.toISOString()
        : (resource.updatedAt ?? ""),
  };
}

async function getAuthenticatedUser() {
  const user = await currentUser();

  if (!user) {
    return { ok: false as const, error: "You need to sign in first." };
  }

  return { ok: true as const, data: user };
}

function buildOwnerQuery(user: Awaited<ReturnType<typeof currentUser>>) {
  const userEmail = user?.emailAddresses[0]?.emailAddress;

  return {
    $or: [{ userId: user?.id }, ...(userEmail ? [{ userEmail }] : [])],
  };
}

export const saveResourceToDB = async (
  data: ResourceInput,
): Promise<ActionResult<SerializedResource>> => {
  try {
    await db();

    const userResult = await getAuthenticatedUser();
    if (!userResult.ok) {
      return userResult;
    }

    const user = userResult.data;
    const slug = await generateUniqueSlug(data.name);
    const resourceToSave = buildResourcePayload(data, user, slug);

    const resource = await Resource.create(resourceToSave);

    return {
      ok: true,
      data: serializeResource(resource.toObject()),
    };
  } catch (error) {
    console.error("Error saving resource:", error);
    return {
      ok: false,
      error: "Something went wrong while saving the resource.",
    };
  }
};

export const updateResourceInDB = async (
  _id: string,
  data: ResourceInput,
): Promise<ActionResult<SerializedResource>> => {
  try {
    await db();

    if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
      return { ok: false, error: "Invalid resource id." };
    }

    const userResult = await getAuthenticatedUser();
    if (!userResult.ok) {
      return userResult;
    }

    const user = userResult.data;
    const ownerQuery = buildOwnerQuery(user);

    const existingResource = await Resource.findOne({
      _id,
      ...ownerQuery,
    });

    if (!existingResource) {
      return {
        ok: false,
        error: "You are not allowed to update this resource.",
      };
    }

    const slug =
      existingResource.name === data.name.trim()
        ? existingResource.slug
        : await generateUniqueSlug(data.name, _id);

    const updatePayload = buildResourcePayload(data, user, slug);

    const updatedResource = await Resource.findOneAndUpdate(
      {
        _id,
        ...ownerQuery,
      },
      updatePayload,
      {
        new: true,
        runValidators: true,
      },
    ).lean();

    if (!updatedResource) {
      return {
        ok: false,
        error: "Resource could not be updated.",
      };
    }

    return {
      ok: true,
      data: serializeResource(updatedResource),
    };
  } catch (error) {
    console.error("Error updating resource:", error);
    return {
      ok: false,
      error: "Something went wrong while updating the resource.",
    };
  }
};

export const getUserResourcesFromDB = async (): Promise<
  ActionResult<SerializedResource[]>
> => {
  try {
    await db();

    const userResult = await getAuthenticatedUser();
    if (!userResult.ok) {
      return userResult;
    }

    const user = userResult.data;

    const resources = await Resource.find({
      ...buildOwnerQuery(user),
    })
      .sort({ createdAt: -1 })
      .lean();

    return {
      ok: true,
      data: resources.map(serializeResource),
    };
  } catch (error) {
    console.error("Error fetching user resources:", error);
    return {
      ok: false,
      error: "Something went wrong while fetching your resources.",
    };
  }
};

export const getResourceFromDB = async (
  _id: string,
): Promise<ActionResult<SerializedResource>> => {
  try {
    await db();

    if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
      return { ok: false, error: "Invalid resource id." };
    }

    const userResult = await getAuthenticatedUser();
    if (!userResult.ok) {
      return userResult;
    }

    const user = userResult.data;

    const resource = await Resource.findOne({
      _id,
      ...buildOwnerQuery(user),
    }).lean();

    if (!resource) {
      return {
        ok: false,
        error:
          "You are not allowed to view this resource, or it does not exist.",
      };
    }

    return {
      ok: true,
      data: serializeResource(resource),
    };
  } catch (error) {
    console.error("Error fetching resource:", error);
    return {
      ok: false,
      error: "Something went wrong while fetching the resource.",
    };
  }
};

export const setPublishedStatusInDB = async (
  _id: string,
  published: boolean,
): Promise<ActionResult<SerializedResource>> => {
  try {
    await db();

    if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
      return { ok: false, error: "Invalid resource id." };
    }

    const userResult = await getAuthenticatedUser();
    if (!userResult.ok) {
      return userResult;
    }

    const user = userResult.data;
    const ownerQuery = buildOwnerQuery(user);

    const updatedResource = await Resource.findOneAndUpdate(
      {
        _id,
        ...ownerQuery,
      },
      {
        $set: { published },
      },
      {
        new: true,
        runValidators: true,
      },
    ).lean();

    if (!updatedResource) {
      return {
        ok: false,
        error: "You are not allowed to update this resource.",
      };
    }

    return {
      ok: true,
      data: serializeResource(updatedResource),
    };
  } catch (error) {
    console.error("Error setting published status:", error);
    return {
      ok: false,
      error: "Something went wrong while updating publish status.",
    };
  }
};

export const getLatestResourcesFromDB = async (
  page = 1,
  limit = DEFAULT_RESOURCE_PAGE_SIZE,
): Promise<ActionResult<PaginatedResources>> => {
  try {
    await db();

    const safePage = Math.max(1, page);
    const safeLimit = Math.max(1, limit);

    const query = { published: true };

    const [resources, totalCount] = await Promise.all([
      Resource.find(query)
        .sort({ createdAt: -1 })
        .skip((safePage - 1) * safeLimit)
        .limit(safeLimit)
        .lean(),
      Resource.countDocuments(query),
    ]);

    return {
      ok: true,
      data: {
        resources: resources.map(serializeResource),
        totalCount,
        page: safePage,
        limit: safeLimit,
        totalPages: Math.ceil(totalCount / safeLimit),
      },
    };
  } catch (error) {
    console.error("Error fetching latest resources:", error);

    return {
      ok: false,
      error: "Something went wrong while fetching the latest resources.",
    };
  }
};
