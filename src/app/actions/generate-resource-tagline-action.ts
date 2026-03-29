"use server";

import type { ResourceFormState } from "@/utils/types/resource";
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
  ResourceFormState,
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

// "use server";

// import type { ResourceFormState } from "@/utils/types/resource";
// import {
//   aiGenerateTaglineFromForm,
//   GenerateTaglineError,
// } from "@/lib/ai/generate-resource-tagline";

// export interface GenerateResourceTaglineActionResult {
//   success: boolean;
//   tagline: string;
//   error?: string;
// }

// type ResourceFormStateForAI = Pick<
//   ResourceFormState,
//   | "name"
//   | "website"
//   | "documentationUrl"
//   | "githubUrl"
//   | "category"
//   | "pricing"
//   | "tags"
//   | "useCases"
// >;

// export async function generateResourceTaglineAction(
//   form: ResourceFormStateForAI,
// ): Promise<GenerateResourceTaglineActionResult> {
//   try {
//     const tagline = await aiGenerateTaglineFromForm(form);

//     return {
//       success: true,
//       tagline,
//     };
//   } catch (error) {
//     console.error("Tagline generation error:", error);

//     if (error instanceof GenerateTaglineError) {
//       return {
//         success: false,
//         tagline: "",
//         error: error.message,
//       };
//     }

//     return {
//       success: false,
//       tagline: "",
//       error: "Something went wrong while generating the tagline.",
//     };
//   }
// }
