"use server";

import mongoose from "mongoose";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import db from "@/utils/db";
import Resource from "@/models/resource";
import Rating from "@/models/rating";
import { isValidRating } from "@/lib/validators/rating";

type ActionResult<T> = { ok: true; data: T } | { ok: false; error: string };

async function updateResourceCommunityRating(resourceId: string) {
  const resourceObjectId = new mongoose.Types.ObjectId(resourceId);

  const stats = await Rating.aggregate([
    {
      $match: {
        resourceId: resourceObjectId,
      },
    },
    {
      $group: {
        _id: "$resourceId",
        average: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  const average = stats[0]?.average ?? 0;
  const count = stats[0]?.count ?? 0;

  await Resource.findByIdAndUpdate(resourceId, {
    $set: {
      communityRating: {
        average: Number(average.toFixed(1)),
        count,
      },
    },
  });
}

export const submitResourceRating = async ({
  resourceId,
  rating,
  slug,
}: {
  resourceId: string;
  rating: number;
  slug: string;
}): Promise<ActionResult<{ rating: number }>> => {
  try {
    await db();

    const user = await currentUser();

    if (!user) {
      return {
        ok: false,
        error: "You must be signed in to rate a resource.",
      };
    }

    if (!mongoose.Types.ObjectId.isValid(resourceId)) {
      return { ok: false, error: "Invalid resource id." };
    }

    if (!isValidRating(rating)) {
      return { ok: false, error: "Rating must be between 1 and 5." };
    }

    const resource = await Resource.findOne({
      _id: resourceId,
      status: "published",
    }).select("_id slug");

    if (!resource) {
      return { ok: false, error: "Resource not found." };
    }

    await Rating.findOneAndUpdate(
      {
        resourceId,
        userId: user.id,
      },
      {
        $set: {
          resourceId,
          userId: user.id,
          rating,
        },
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
      },
    );

    await updateResourceCommunityRating(resourceId);

    revalidatePath("/resources");
    revalidatePath(`/resources/${slug}`);

    return {
      ok: true,
      data: { rating },
    };
  } catch (error) {
    console.error("Error submitting resource rating:", error);
    return {
      ok: false,
      error: "Something went wrong while saving your rating.",
    };
  }
};

export const getUserRatingForResource = async (
  resourceId: string,
): Promise<ActionResult<{ rating: number | null }>> => {
  try {
    await db();

    const user = await currentUser();

    if (!mongoose.Types.ObjectId.isValid(resourceId)) {
      return { ok: false, error: "Invalid resource id." };
    }

    if (!user) {
      return {
        ok: true,
        data: { rating: null },
      };
    }

    const existingRating = await Rating.findOne({
      resourceId,
      userId: user.id,
    }).select("rating");

    return {
      ok: true,
      data: {
        rating: existingRating?.rating ?? null,
      },
    };
  } catch (error) {
    console.error("Error fetching user rating:", error);
    return {
      ok: false,
      error: "Something went wrong while fetching your rating.",
    };
  }
};
