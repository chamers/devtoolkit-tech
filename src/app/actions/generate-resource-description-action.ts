"use server";

import type { ResourceAIInput } from "@/utils/types/resource";
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
  ResourceAIInput,
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

    // ✅ Debug logs (very important for now)
    console.log("AI description result (server action):", result);
    console.log("AI description text:", result?.description);

    // ✅ Guard: empty response
    if (!result?.description?.trim()) {
      return {
        success: false,
        description: "",
        error: "No description was generated.",
      };
    }

    // ✅ Success
    return {
      success: true,
      description: result.description,
    };
  } catch (error) {
    console.error("generateResourceDescriptionAction error:", error);

    // ✅ Known AI error
    if (error instanceof GenerateResourceDescriptionError) {
      return {
        success: false,
        description: "",
        error: error.message,
      };
    }

    // ✅ Unknown error
    return {
      success: false,
      description: "",
      error:
        error instanceof Error
          ? error.message
          : "Something went wrong while generating the description.",
    };
  }
}
