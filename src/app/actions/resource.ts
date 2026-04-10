"use server";

import slugify from "slugify";
import mongoose from "mongoose";
import { currentUser } from "@clerk/nextjs/server";
import type { JSONContent } from "@tiptap/core";

import db from "@/utils/db";
import Resource from "@/models/resource";
import type { ResourceCategory, ResourceInput } from "@/utils/types/resource";
import { assertAdmin } from "@/lib/auth/assert-admin";

type ActionResult<T> = { ok: true; data: T } | { ok: false; error: string };

function extractTextFromJsonContent(content: JSONContent | null): string {
  if (!content) return "";

  let text = "";

  if (typeof content.text === "string") {
    text += `${content.text} `;
  }

  if (Array.isArray(content.content)) {
    for (const child of content.content) {
      text += extractTextFromJsonContent(child);
    }
  }

  return text.replace(/\s+/g, " ").trim();
}

function getErrorMessage(
  error: unknown,
  fallback = "Something went wrong.",
): string {
  return error instanceof Error ? error.message : fallback;
}

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

export type AutocompleteResource = {
  _id: string;
  name: string;
  slug: string;
  category: ResourceCategory;
  tags: string[];
  logo?: string;
};

export type ResourceListFilters = {
  category?: string;
  tag?: string;
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
  overrides?: Partial<{
    status: "pending" | "published" | "rejected";
    published: boolean;
    approvedBy?: string;
    approvedAt?: Date | null;
    rejectedBy?: string;
    rejectedAt?: Date | null;
    rejectionReason?: string;
  }>,
) {
  return {
    userId: user?.id,
    userEmail: user?.emailAddresses[0]?.emailAddress,
    name: data.name.trim(),
    slug,
    tagline: data.tagline.trim(),
    description: data.description ?? null,
    descriptionText: extractTextFromJsonContent(data.description ?? null),
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
    status: overrides?.status ?? "pending",
    published: overrides?.published ?? false,
    approvedBy: overrides?.approvedBy,
    approvedAt: overrides?.approvedAt ?? null,
    rejectedBy: overrides?.rejectedBy,
    rejectedAt: overrides?.rejectedAt ?? null,
    rejectionReason: overrides?.rejectionReason,
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
  } catch (error: unknown) {
    console.error("Error saving resource:", error);
    return {
      ok: false,
      error: getErrorMessage(
        error,
        "Something went wrong while saving the resource.",
      ),
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

    const resourceObjectId = new mongoose.Types.ObjectId(_id);

    const userResult = await getAuthenticatedUser();
    if (!userResult.ok) {
      return userResult;
    }

    const user = userResult.data;

    const isAdmin = user.publicMetadata?.role === "admin";

    const existingResource = await Resource.findById(resourceObjectId).lean();

    if (!existingResource) {
      return {
        ok: false,
        error: "Resource not found.",
      };
    }

    const isOwner =
      existingResource.userId === user.id ||
      (user.emailAddresses[0]?.emailAddress &&
        existingResource.userEmail === user.emailAddresses[0]?.emailAddress);

    const canEditPending = existingResource.status === "pending" && isOwner;
    const canEditPublished = existingResource.status === "published" && isAdmin;
    const canEditRejected = existingResource.status === "rejected" && isAdmin;

    if (!canEditPending && !canEditPublished && !canEditRejected) {
      return {
        ok: false,
        error: "You are not allowed to update this resource.",
      };
    }

    const nextName = data.name.trim();

    const slug =
      existingResource.name === nextName
        ? existingResource.slug
        : await generateUniqueSlug(nextName, _id);

    const updatePayload = buildResourcePayload(data, user, slug, {
      status: existingResource.status,
      published: existingResource.published,
      approvedBy: existingResource.approvedBy,
      approvedAt: existingResource.approvedAt,
      rejectedBy: existingResource.rejectedBy,
      rejectedAt: existingResource.rejectedAt,
      rejectionReason: existingResource.rejectionReason,
    });

    const updatedResource = await Resource.findByIdAndUpdate(
      resourceObjectId,
      { $set: updatePayload },
      {
        new: true,
        runValidators: true,
        lean: true,
      },
    );

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
  } catch (error: unknown) {
    console.error("Error updating resource:", error);
    return {
      ok: false,
      error: getErrorMessage(
        error,
        "Something went wrong while updating the resource.",
      ),
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
  } catch (error: unknown) {
    console.error("Error fetching user resources:", error);
    return {
      ok: false,
      error: getErrorMessage(
        error,
        "Something went wrong while fetching your resources.",
      ),
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
    const isAdmin = user.publicMetadata?.role === "admin";

    const resource = await Resource.findById(_id).lean();

    if (!resource) {
      return {
        ok: false,
        error: "Resource not found.",
      };
    }

    const isOwner =
      resource.userId === user.id ||
      (user.emailAddresses[0]?.emailAddress &&
        resource.userEmail === user.emailAddresses[0]?.emailAddress);

    const canViewPending = resource.status === "pending" && isOwner;
    const canViewPublished = resource.status === "published" && isAdmin;
    const canViewRejected = resource.status === "rejected" && isAdmin;

    if (!canViewPending && !canViewPublished && !canViewRejected) {
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
  } catch (error: unknown) {
    console.error("Error fetching resource:", error);
    return {
      ok: false,
      error: getErrorMessage(
        error,
        "Something went wrong while fetching the resource.",
      ),
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
  } catch (error: unknown) {
    console.error("Error setting published status:", error);
    return {
      ok: false,
      error: getErrorMessage(
        error,
        "Something went wrong while updating publish status.",
      ),
    };
  }
};

export const getLatestResourcesFromDB = async (
  page = 1,
  limit = DEFAULT_RESOURCE_PAGE_SIZE,
  filters: ResourceListFilters = {},
): Promise<ActionResult<PaginatedResources>> => {
  try {
    await db();

    const safePage = Math.max(1, page);
    const safeLimit = Math.max(1, limit);

    const query: {
      status: "published";
      category?: string;
      tags?: string;
    } = {
      status: "published",
    };

    if (filters.category?.trim()) {
      query.category = filters.category.trim();
    }

    if (filters.tag?.trim()) {
      query.tags = filters.tag.trim();
    }

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
  } catch (error: unknown) {
    console.error("Error fetching latest resources:", error);

    return {
      ok: false,
      error: getErrorMessage(
        error,
        "Something went wrong while fetching the latest resources.",
      ),
    };
  }
};

export const getResourceBySlugFromDB = async (
  slug: string,
): Promise<ActionResult<SerializedResource>> => {
  try {
    await db();

    const normalizedSlug = typeof slug === "string" ? slug.trim() : "";

    if (!normalizedSlug) {
      return { ok: false, error: "Invalid resource slug." };
    }

    const resource = await Resource.findOne({
      slug: normalizedSlug,
      status: "published",
    }).lean();

    if (!resource) {
      return {
        ok: false,
        error: "Resource not found.",
      };
    }

    return {
      ok: true,
      data: serializeResource(resource),
    };
  } catch (error: unknown) {
    console.error("Error fetching resource by slug:", error);
    return {
      ok: false,
      error: getErrorMessage(
        error,
        "Something went wrong while fetching the resource.",
      ),
    };
  }
};

export const searchResourcesFromDB = async (
  query: string,
): Promise<ActionResult<SerializedResource[]>> => {
  try {
    await db();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      return {
        ok: true,
        data: [],
      };
    }

    if (trimmedQuery.length < 3) {
      const escapedQuery = trimmedQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      const resources = await Resource.find({
        status: "published",
        name: { $regex: `^${escapedQuery}`, $options: "i" },
      })
        .sort({ name: 1 })
        .limit(10)
        .lean();

      return {
        ok: true,
        data: resources.map(serializeResource),
      };
    }

    const resources = await Resource.find(
      {
        status: "published",
        $text: { $search: trimmedQuery },
      },
      {
        score: { $meta: "textScore" },
      },
    )
      .sort({ score: { $meta: "textScore" }, createdAt: -1 })
      .limit(20)
      .lean();

    return {
      ok: true,
      data: resources.map(serializeResource),
    };
  } catch (error: unknown) {
    console.error("Error searching resources:", error);

    return {
      ok: false,
      error: getErrorMessage(
        error,
        "Something went wrong while searching resources.",
      ),
    };
  }
};

export const autocompleteResourcesFromDB = async (
  query: string,
): Promise<ActionResult<AutocompleteResource[]>> => {
  try {
    await db();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      return {
        ok: true,
        data: [],
      };
    }

    const escapedQuery = trimmedQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const resources = await Resource.find({
      status: "published",
      name: { $regex: `^${escapedQuery}`, $options: "i" },
    })
      .select("_id name slug category tags logo")
      .sort({ name: 1 })
      .limit(8)
      .lean();

    return {
      ok: true,
      data: resources.map((resource) => ({
        _id: resource._id.toString(),
        name: resource.name,
        slug: resource.slug,
        category: resource.category,
        tags: resource.tags ?? [],
        logo: resource.logo,
      })),
    };
  } catch (error: unknown) {
    console.error("Error autocompleting resources:", error);

    return {
      ok: false,
      error: getErrorMessage(
        error,
        "Something went wrong while autocompleting resources.",
      ),
    };
  }
};

export const getUniqueTagsFromDB = async (): Promise<
  ActionResult<string[]>
> => {
  try {
    await db();

    const tags = await Resource.distinct("tags", {
      status: "published",
    });

    const normalizedTags = [
      ...new Set(
        tags
          .filter((tag): tag is string => typeof tag === "string")
          .map((tag) => tag.trim())
          .filter(Boolean),
      ),
    ].sort((a, b) => a.localeCompare(b));

    return {
      ok: true,
      data: normalizedTags,
    };
  } catch (error: unknown) {
    console.error("Error fetching unique tags:", error);

    return {
      ok: false,
      error: getErrorMessage(
        error,
        "Something went wrong while fetching tags.",
      ),
    };
  }
};

type AdminResourceListFilters = ResourceListFilters & {
  status?: "pending" | "published" | "rejected";
};

export const getAllResourcesForAdminFromDB = async (
  page = 1,
  limit = DEFAULT_RESOURCE_PAGE_SIZE,
  filters: AdminResourceListFilters = {},
): Promise<ActionResult<PaginatedResources>> => {
  try {
    await db();
    await assertAdmin();

    const safePage = Math.max(1, page);
    const safeLimit = Math.max(1, limit);

    const query: {
      status?: "pending" | "published" | "rejected";
      category?: string;
      tags?: { $in: string[] };
    } = {};

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.category?.trim()) {
      query.category = filters.category.trim();
    }

    if (filters.tag?.trim()) {
      query.tags = { $in: [filters.tag.trim()] };
    }

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
  } catch (error: unknown) {
    console.error("Error fetching admin resources:", error);

    return {
      ok: false,
      error: getErrorMessage(
        error,
        "Something went wrong while fetching admin resources.",
      ),
    };
  }
};

export const approveResourceInDB = async (
  _id: string,
): Promise<ActionResult<SerializedResource>> => {
  try {
    await db();

    if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
      return { ok: false, error: "Invalid resource id." };
    }

    const admin = await assertAdmin();

    const updatedResource = await Resource.findByIdAndUpdate(
      _id,
      {
        $set: {
          status: "published",
          published: true,
          approvedBy: admin.id,
          approvedAt: new Date(),
          rejectedBy: undefined,
          rejectedAt: null,
          rejectionReason: undefined,
        },
      },
      {
        new: true,
        runValidators: true,
        lean: true,
      },
    );

    if (!updatedResource) {
      return {
        ok: false,
        error: "Resource not found.",
      };
    }

    return {
      ok: true,
      data: serializeResource(updatedResource),
    };
  } catch (error: unknown) {
    console.error("Error approving resource:", error);

    return {
      ok: false,
      error: getErrorMessage(
        error,
        "Something went wrong while approving the resource.",
      ),
    };
  }
};

export const rejectResourceInDB = async (
  _id: string,
  rejectionReason?: string,
): Promise<ActionResult<SerializedResource>> => {
  try {
    await db();

    if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
      return { ok: false, error: "Invalid resource id." };
    }

    const admin = await assertAdmin();

    const updatedResource = await Resource.findByIdAndUpdate(
      _id,
      {
        $set: {
          status: "rejected",
          published: false,
          rejectedBy: admin.id,
          rejectedAt: new Date(),
          rejectionReason: rejectionReason?.trim() || undefined,
          approvedBy: undefined,
          approvedAt: null,
        },
      },
      {
        new: true,
        runValidators: true,
        lean: true,
      },
    );

    if (!updatedResource) {
      return {
        ok: false,
        error: "Resource not found.",
      };
    }

    return {
      ok: true,
      data: serializeResource(updatedResource),
    };
  } catch (error: unknown) {
    console.error("Error rejecting resource:", error);

    return {
      ok: false,
      error: getErrorMessage(
        error,
        "Something went wrong while rejecting the resource.",
      ),
    };
  }
};
