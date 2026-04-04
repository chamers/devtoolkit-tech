"use server";

import type { ResourceAIInput } from "@/utils/types/resource";
import {
  aiGenerateResourceTaglineFromForm,
  GenerateResourceTaglineError,
} from "@/lib/ai/generate-resource-tagline";

export interface GenerateResourceTaglineActionResult {
  success: boolean;
  tagline: string;
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

export async function generateResourceTaglineAction(
  form: ResourceFormStateForAI,
): Promise<GenerateResourceTaglineActionResult> {
  try {
    const result = await aiGenerateResourceTaglineFromForm(form);

    return {
      success: true,
      tagline: result.tagline,
    };
  } catch (error) {
    if (error instanceof GenerateResourceTaglineError) {
      return {
        success: false,
        tagline: "",
        error: error.message,
      };
    }

    return {
      success: false,
      tagline: "",
      error: "Something went wrong while generating the tagline.",
    };
  }
}
