import "server-only";

import { GoogleGenAI } from "@google/genai";
import {
  RESOURCE_PLATFORMS,
  RESOURCE_USE_CASES,
} from "@/utils/constants/resource-taxonomy";
import type {
  ResourceFormState,
  ResourcePlatform,
  ResourceUseCase,
} from "@/utils/types/resource";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const MODEL = "gemini-3-flash-preview";

const ALLOWED_USE_CASES = RESOURCE_USE_CASES.map((item) => item.value);
const ALLOWED_PLATFORMS = RESOURCE_PLATFORMS.map((item) => item.value);

export interface GenerateResourceMetadataResult {
  tags: string[];
  alternatives: string[];
  useCases: ResourceUseCase[];
  platforms: ResourcePlatform[];
}

export class GenerateResourceMetadataError extends Error {
  code:
    | "MISSING_API_KEY"
    | "INVALID_INPUT"
    | "EMPTY_RESPONSE"
    | "INVALID_JSON"
    | "GENERATION_FAILED";

  constructor(
    message: string,
    code:
      | "MISSING_API_KEY"
      | "INVALID_INPUT"
      | "EMPTY_RESPONSE"
      | "INVALID_JSON"
      | "GENERATION_FAILED",
    cause?: unknown,
  ) {
    super(message, cause ? { cause } : undefined);
    this.name = "GenerateResourceMetadataError";
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
    platforms: splitCsv(form.platforms),
    license: form.license || null,
    useCases: splitCsv(form.useCases),
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
You are helping curate metadata for a developer resources platform.

Your task:
Suggest metadata for this resource.

Return valid JSON only with this exact shape:
{
  "tags": string[],
  "alternatives": string[],
  "useCases": string[],
  "platforms": string[]
}

Rules:
- tags: 4 to 8 short lowercase phrases
- alternatives: 0 to 5 realistic alternative tools or products
- useCases: only choose from this list: ${JSON.stringify(ALLOWED_USE_CASES)}
- platforms: only choose from this list: ${JSON.stringify(ALLOWED_PLATFORMS)}
- Do not invent nonsense
- Keep results practical and relevant
- Do not include duplicate items
- Return JSON only, no markdown

Resource data:
${JSON.stringify(payload, null, 2)}
  `.trim();
}

function uniqueStrings(values: string[]): string[] {
  return [...new Set(values.map((item) => item.trim()).filter(Boolean))];
}

export async function aiGenerateResourceMetadataFromForm(
  form: ResourceFormStateForAI,
): Promise<GenerateResourceMetadataResult> {
  if (!process.env.GEMINI_API_KEY) {
    throw new GenerateResourceMetadataError(
      "Missing GEMINI_API_KEY environment variable.",
      "MISSING_API_KEY",
    );
  }

  if (!clean(form.name)) {
    throw new GenerateResourceMetadataError(
      "Resource name is required to generate metadata.",
      "INVALID_INPUT",
    );
  }

  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: buildPrompt(form),
      config: {
        temperature: 0.3,
      },
    });

    const text = response.text?.trim();

    if (!text) {
      throw new GenerateResourceMetadataError(
        "The model returned an empty response.",
        "EMPTY_RESPONSE",
      );
    }

    const parsed = JSON.parse(text) as {
      tags?: string[];
      alternatives?: string[];
      useCases?: string[];
      platforms?: string[];
    };

    const useCases = uniqueStrings(parsed.useCases ?? []).filter((item) =>
      ALLOWED_USE_CASES.includes(item as ResourceUseCase),
    ) as ResourceUseCase[];

    const platforms = uniqueStrings(parsed.platforms ?? []).filter((item) =>
      ALLOWED_PLATFORMS.includes(item as ResourcePlatform),
    ) as ResourcePlatform[];

    return {
      tags: uniqueStrings(parsed.tags ?? []).map((item) => item.toLowerCase()),
      alternatives: uniqueStrings(parsed.alternatives ?? []),
      useCases,
      platforms,
    };
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new GenerateResourceMetadataError(
        "The model returned invalid JSON.",
        "INVALID_JSON",
        error,
      );
    }

    if (error instanceof GenerateResourceMetadataError) {
      throw error;
    }

    throw new GenerateResourceMetadataError(
      "Failed to generate resource metadata.",
      "GENERATION_FAILED",
      error,
    );
  }
}
