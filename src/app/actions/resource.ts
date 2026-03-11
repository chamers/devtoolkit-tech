"use server";

import slugify from "slugify";
import { currentUser } from "@clerk/nextjs/server";

import db from "@/utils/db";
import Resource from "@/models/resource";
import type { ResourceInput } from "@/utils/types/resource";

function normalizeOptionalString(value?: string) {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}

function normalizeStringArray(values: string[] = []) {
  return values.map((item) => item.trim()).filter(Boolean);
}

async function generateUniqueSlug(name: string) {
  const baseSlug = slugify(name, {
    lower: true,
    strict: true,
    trim: true,
  });

  let slug = baseSlug;
  let counter = 2;

  while (await Resource.exists({ slug })) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  return slug;
}

export const saveResourceToDB = async (data: ResourceInput) => {
  try {
    await db();

    const user = await currentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const slug = await generateUniqueSlug(data.name);

    const resourceToSave = {
      userId: user.id,
      userEmail: user.emailAddresses[0]?.emailAddress,

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

    const resource = await Resource.create(resourceToSave);
    return JSON.parse(JSON.stringify(resource));
  } catch (error) {
    console.error("Error saving resource:", error);
    throw error;
  }
};
