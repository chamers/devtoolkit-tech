"use server";

import type { ResourceAIInput } from "@/utils/types/resource";
import {
  aiGenerateResourceMetadataFromForm,
  GenerateResourceMetadataError,
} from "@/lib/ai/generate-resource-metadata";

export interface GenerateResourceMetadataActionResult {
  success: boolean;
  tags: string[];
  alternatives: string[];
  useCases: string[];
  platforms: string[];
  error?: string;
}

type ResourceFormStateForAI = Pick<
  ResourceAIInput,
  | "name"
  | "description"
  | "website"
  | "documentationUrl"
  | "githubUrl"
  | "category"
  | "pricing"
  | "platforms"
  | "license"
  | "useCases"
  | "tags"
  | "alternatives"
  | "githubStats"
  | "stackFit"
>;

export async function generateResourceMetadataAction(
  form: ResourceFormStateForAI,
): Promise<GenerateResourceMetadataActionResult> {
  try {
    const result = await aiGenerateResourceMetadataFromForm(form);

    return {
      success: true,
      tags: result.tags,
      alternatives: result.alternatives,
      useCases: result.useCases,
      platforms: result.platforms,
    };
  } catch (error) {
    if (error instanceof GenerateResourceMetadataError) {
      return {
        success: false,
        tags: [],
        alternatives: [],
        useCases: [],
        platforms: [],
        error: error.message,
      };
    }

    return {
      success: false,
      tags: [],
      alternatives: [],
      useCases: [],
      platforms: [],
      error: "Something went wrong while generating metadata.",
    };
  }
}
