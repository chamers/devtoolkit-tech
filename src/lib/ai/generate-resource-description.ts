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

const MODEL = "gemini-3-flash-preview";

export interface GenerateResourceDescriptionResult {
  description: string;
}

export class GenerateResourceDescriptionError extends Error {
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
    this.name = "GenerateResourceDescriptionError";
    this.code = code;
  }
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
    tagline: clean(form.tagline),
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
You are writing editorial copy for a curated developer resources platform.

The platform is a dev-toolkit: an all-in-one resource hub for frontend, backend, design, code management, deployment, testing, AI tools, and related developer workflows.

Your task:
Write only the description for this resource.

Rules:
- Write 2 to 4 sentences.
- Keep it clear, practical, and natural.
- Focus on what the resource does and why a developer would use it.
- Mention relevant developer workflows or use cases when supported by the input.
- Avoid hype, fluff, and exaggerated marketing language.
- Do not invent features, integrations, or claims.
- Do not use bullet points.
- Do not wrap the answer in quotes.
- Output plain text only.
- Keep the tone modern, clean, and useful for developers evaluating tools.

Resource data:
${JSON.stringify(payload, null, 2)}
  `.trim();
}

export async function aiGenerateResourceDescriptionFromForm(
  form: ResourceFormStateForAI,
): Promise<GenerateResourceDescriptionResult> {
  if (!process.env.GEMINI_API_KEY) {
    throw new GenerateResourceDescriptionError(
      "Missing GEMINI_API_KEY environment variable.",
      "MISSING_API_KEY",
    );
  }

  if (!clean(form.name)) {
    throw new GenerateResourceDescriptionError(
      "Resource name is required to generate a description.",
      "INVALID_INPUT",
    );
  }

  try {
    const prompt = buildPrompt(form);

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        temperature: 0.4,
      },
    });

    console.log("Gemini description text:", response.text);
    console.log("Gemini full response:", response);

    const description = response.text?.trim();

    if (!description) {
      throw new GenerateResourceDescriptionError(
        "The model returned an empty description.",
        "EMPTY_RESPONSE",
      );
    }

    return { description };
  } catch (error) {
    if (error instanceof GenerateResourceDescriptionError) {
      throw error;
    }

    console.error("aiGenerateResourceDescriptionFromForm failed:", error);

    throw new GenerateResourceDescriptionError(
      "Failed to generate resource description.",
      "GENERATION_FAILED",
      error,
    );
  }
}
