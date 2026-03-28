"use server";

import type { ResourceFormState } from "@/utils/types/resource";
import {
  aiGenerateResourceDescriptionFromForm,
  GenerateResourceDescriptionError,
} from "@/lib/ai/generate-resource-description";

export interface GenerateResourceDescriptionActionResult {
  success: boolean;
  description: string;
  error?: string;
}

type ResourceFormStateForAI = Pick<
  ResourceFormState,
  | "name"
  | "tagline"
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

export async function generateResourceDescriptionAction(
  form: ResourceFormStateForAI,
): Promise<GenerateResourceDescriptionActionResult> {
  try {
    const result = await aiGenerateResourceDescriptionFromForm(form);

    return {
      success: true,
      description: result.description,
    };
  } catch (error) {
    if (error instanceof GenerateResourceDescriptionError) {
      return {
        success: false,
        description: "",
        error: error.message,
      };
    }

    return {
      success: false,
      description: "",
      error: "Something went wrong while generating the description.",
    };
  }
}
