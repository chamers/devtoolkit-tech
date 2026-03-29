import "server-only";

import { GoogleGenAI } from "@google/genai";
import type {
  ResourceFormState,
  ResourcePlatform,
  ResourceUseCase,
} from "@/utils/types/resource";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Primary (fast but unstable sometimes)
//const PRIMARY_MODEL = "gemini-3-flash-preview";

// Fallback (more stable)
//const FALLBACK_MODEL = "gemini-1.5-flash";

const MODEL = "gemini-3-flash-preview";

export interface GenerateResourceTaglineResult {
  tagline: string;
}

export class GenerateResourceTaglineError extends Error {
  code:
    | "MISSING_API_KEY"
    | "INVALID_INPUT"
    | "EMPTY_RESPONSE"
    | "GENERATION_FAILED";

  constructor(
    message: string,
    code:
      | "MISSING_API_KEY"
      | "INVALID_INPUT"
      | "EMPTY_RESPONSE"
      | "GENERATION_FAILED",
    cause?: unknown,
  ) {
    super(message, cause ? { cause } : undefined);
    this.name = "GenerateResourceTaglineError";
    this.code = code;
  }
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

function clean(value?: string | null): string {
  return (value ?? "").trim();
}

function splitCsv(value?: string | null): string[] {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parsePlatforms(value?: string | null): ResourcePlatform[] {
  return splitCsv(value) as ResourcePlatform[];
}

function parseUseCases(value?: string | null): ResourceUseCase[] {
  return splitCsv(value) as ResourceUseCase[];
}

function toIsoDate(value?: Date | string | null): string | null {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString();
  return value;
}

function getEnabledStackFit(
  stackFit?: ResourceFormState["stackFit"],
): string[] {
  if (!stackFit) return [];

  return Object.entries(stackFit)
    .filter(([, enabled]) => Boolean(enabled))
    .map(([key]) => key);
}

function buildPrompt(form: ResourceFormStateForAI): string {
  const payload = {
    name: clean(form.name),
    description: clean(form.description),
    website: clean(form.website),
    documentationUrl: clean(form.documentationUrl),
    githubUrl: clean(form.githubUrl),
    category: form.category || null,
    pricing: form.pricing || null,
    platforms: parsePlatforms(form.platforms),
    license: form.license || null,
    useCases: parseUseCases(form.useCases),
    tags: splitCsv(form.tags),
    alternatives: splitCsv(form.alternatives),
    githubStats: form.githubStats
      ? {
          stars: form.githubStats.stars ?? 0,
          forks: form.githubStats.forks ?? 0,
          issues: form.githubStats.issues ?? 0,
          lastCommitDate: toIsoDate(form.githubStats.lastCommitDate),
          repository: clean(form.githubStats.repository),
        }
      : null,
    stackFit: getEnabledStackFit(form.stackFit),
  };

  return `
You are writing a concise tagline for a curated developer resources platform.

The platform is a dev-toolkit: an all-in-one resource hub for frontend, backend, design, code management, deployment, testing, AI tools, and related developer workflows.

Your task:
Write a short, one-line tagline.

Rules:
- Write 8 to 16 words
- Keep it clear, practical, and natural
- Focus on what the resource does
- No hype or buzzwords
- Do not wrap the answer in quotes.
- Output plain text only.
- Keep the tone modern, clean, and useful for developers evaluating tools.

Resource data:
${JSON.stringify(payload, null, 2)}
  `.trim();
}

export async function aiGenerateResourceTaglineFromForm(
  form: ResourceFormStateForAI,
): Promise<GenerateResourceTaglineResult> {
  if (!process.env.GEMINI_API_KEY) {
    throw new GenerateResourceTaglineError(
      "Missing GEMINI_API_KEY environment variable.",
      "MISSING_API_KEY",
    );
  }

  if (!clean(form.name)) {
    throw new GenerateResourceTaglineError(
      "Resource name is required to generate a tagline.",
      "INVALID_INPUT",
    );
  }

  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: buildPrompt(form),
      config: {
        temperature: 0.4,
      },
    });

    const tagline = response.text?.trim();

    if (!tagline) {
      throw new GenerateResourceTaglineError(
        "The model returned an empty tagline.",
        "EMPTY_RESPONSE",
      );
    }

    return { tagline };
  } catch (error) {
    if (error instanceof GenerateResourceTaglineError) {
      throw error;
    }

    throw new GenerateResourceTaglineError(
      "Failed to generate resource tagline.",
      "GENERATION_FAILED",
      error,
    );
  }
}

// import "server-only";

// import { GoogleGenAI } from "@google/genai";
// import type { ResourceFormState } from "@/utils/types/resource";

// const ai = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY,
// });

// // Primary (fast but unstable sometimes)
// const PRIMARY_MODEL = "gemini-3-flash-preview";

// // Fallback (more stable)
// const FALLBACK_MODEL = "gemini-1.5-flash";

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

// export class GenerateTaglineError extends Error {
//   constructor(
//     message: string,
//     public code:
//       | "MISSING_API_KEY"
//       | "INVALID_INPUT"
//       | "EMPTY_RESPONSE"
//       | "GENERATION_FAILED" = "GENERATION_FAILED",
//     cause?: unknown,
//   ) {
//     super(message, cause ? { cause } : undefined);
//     this.name = "GenerateTaglineError";
//   }
// }

// function clean(value?: string | null): string {
//   return (value ?? "").trim();
// }

// function splitCsv(value?: string | null): string[] {
//   return (value ?? "")
//     .split(",")
//     .map((item) => item.trim())
//     .filter(Boolean);
// }

// function buildPrompt(form: ResourceFormStateForAI): string {
//   const payload = {
//     name: clean(form.name),
//     website: clean(form.website),
//     documentationUrl: clean(form.documentationUrl),
//     githubUrl: clean(form.githubUrl),
//     category: form.category || null,
//     pricing: form.pricing || null,
//     tags: splitCsv(form.tags),
//     useCases: splitCsv(form.useCases),
//   };

//   return `
// You are writing a concise tagline for a developer resource in a curated dev-toolkit platform.

// Write a short, one-line tagline.

// Rules:
// - 8 to 16 words
// - Clear and practical
// - No hype or buzzwords
// - No quotes

// Resource:
// ${JSON.stringify(payload, null, 2)}
//   `.trim();
// }

// function wait(ms: number) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

// function getStatus(error: any): number | undefined {
//   return error?.status;
// }

// async function generateWithModel(
//   model: string,
//   form: ResourceFormStateForAI,
// ): Promise<string> {
//   const response = await ai.models.generateContent({
//     model,
//     contents: buildPrompt(form),
//     config: {
//       temperature: 0.5,
//     },
//   });

//   const tagline = response.text?.trim();

//   if (!tagline) {
//     throw new GenerateTaglineError(
//       "Empty tagline returned",
//       "EMPTY_RESPONSE",
//     );
//   }

//   return tagline;
// }

// export async function aiGenerateTaglineFromForm(
//   form: ResourceFormStateForAI,
// ): Promise<string> {
//   if (!process.env.GEMINI_API_KEY) {
//     throw new GenerateTaglineError(
//       "Missing GEMINI_API_KEY",
//       "MISSING_API_KEY",
//     );
//   }

//   if (!clean(form.name)) {
//     throw new GenerateTaglineError(
//       "Resource name is required",
//       "INVALID_INPUT",
//     );
//   }

//   // 1️⃣ Try primary model
//   try {
//     return await generateWithModel(PRIMARY_MODEL, form);
//   } catch (error: any) {
//     console.error("Primary model failed:", error);

//     const status = getStatus(error);

//     // 2️⃣ Retry once if 503
//     if (status === 503) {
//       try {
//         await wait(1000);
//         return await generateWithModel(PRIMARY_MODEL, form);
//       } catch (retryError: any) {
//         console.error("Retry failed:", retryError);

//         // 3️⃣ Fallback model
//         try {
//           console.log("➡️ Using fallback model...");
//           return await generateWithModel(FALLBACK_MODEL, form);
//         } catch (fallbackError) {
//           console.error("Fallback failed:", fallbackError);

//           throw new GenerateTaglineError(
//             "AI services are busy. Please try again shortly.",
//             "GENERATION_FAILED",
//             fallbackError,
//           );
//         }
//       }
//     }

//     throw new GenerateTaglineError(
//       "Failed to generate tagline",
//       "GENERATION_FAILED",
//       error,
//     );
//   }
// }
