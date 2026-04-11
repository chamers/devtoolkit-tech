"use client";

import { useState } from "react";
import Image from "next/image";
import type { JSONContent } from "@tiptap/core";
import { Loader2, Send, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ImageUpload from "@/components/resource/uploads/image-upload-wrapper";
import RichTextEditor from "@/components/editor/rich-text-editor";
import {
  RESOURCE_CATEGORIES,
  RESOURCE_LICENSES,
  RESOURCE_PLATFORMS,
  RESOURCE_PRICING,
  RESOURCE_USE_CASES,
} from "@/utils/constants/resource-taxonomy";
import type { ResourceFormState } from "@/utils/types/resource";
import { generateResourceDescriptionAction } from "@/app/actions/generate-resource-description-action";
import { generateResourceTaglineAction } from "@/app/actions/generate-resource-tagline-action";
import { generateResourceMetadataAction } from "@/app/actions/generate-resource-metadata-action";

interface InputField {
  name: keyof ResourceFormState;
  type: "text" | "url" | "textarea" | "select";
  label: string;
  placeholder?: string;
  required: boolean;
  options?: { label: string; value: string }[];
}

interface ResourceFormProps {
  resource: ResourceFormState;
  loading?: boolean;
  onChange: (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onLogoUploaded: (url: string) => void;
  onLogoRemoved?: () => void;
  onDescriptionGenerated: (description: JSONContent) => void;
  onTaglineGenerated: (tagline: string) => void;
  onMetadataGenerated: (data: {
    tags: string;
    alternatives: string;
    useCases: string;
    platforms: string;
  }) => void;
  onDescriptionChange: (description: JSONContent) => void;
  submitLabel?: string;
  footerActions?: React.ReactNode;
}

const categoryOptions = RESOURCE_CATEGORIES.map((item) => ({
  label: item.label,
  value: item.value,
}));

const pricingOptions = RESOURCE_PRICING.map((item) => ({
  label: item.label,
  value: item.value,
}));

const licenseOptions = RESOURCE_LICENSES.map((item) => ({
  label: item.label,
  value: item.value,
}));

const useCaseOptions = RESOURCE_USE_CASES.map((item) => ({
  label: item.label,
  value: item.value,
}));

const platformOptions = RESOURCE_PLATFORMS.map((item) => ({
  label: item.label,
  value: item.value,
}));

const inputFields: InputField[] = [
  {
    name: "name",
    label: "Resource Name",
    type: "text",
    placeholder: "Enter resource name",
    required: true,
  },
  {
    name: "slug",
    label: "Slug",
    type: "text",
    placeholder: "Auto-generated from resource name",
    required: true,
  },
  {
    name: "tagline",
    label: "Tagline",
    type: "text",
    placeholder: "A short one-line summary",
    required: true,
  },
  {
    name: "website",
    label: "Website",
    type: "url",
    placeholder: "Enter website URL",
    required: true,
  },
  {
    name: "documentationUrl",
    label: "Documentation URL",
    type: "url",
    placeholder: "Enter documentation URL",
    required: false,
  },
  {
    name: "githubUrl",
    label: "GitHub URL",
    type: "url",
    placeholder: "Enter GitHub repository URL",
    required: false,
  },
  {
    name: "category",
    label: "Category",
    type: "select",
    placeholder: "Select category",
    required: true,
    options: categoryOptions,
  },
  {
    name: "pricing",
    label: "Pricing",
    type: "select",
    placeholder: "Select pricing",
    required: true,
    options: pricingOptions,
  },
  {
    name: "license",
    label: "License",
    type: "select",
    placeholder: "Select license",
    required: false,
    options: licenseOptions,
  },
  {
    name: "tags",
    label: "Tags",
    type: "text",
    placeholder: "react, ui, css, testing",
    required: false,
  },
  {
    name: "alternatives",
    label: "Alternatives",
    type: "text",
    placeholder: "next.js, remix, astro",
    required: false,
  },
  {
    name: "useCases",
    label: "Use Cases",
    type: "text",
    placeholder: useCaseOptions.map((item) => item.value).join(", "),
    required: false,
  },
  {
    name: "platforms",
    label: "Platforms",
    type: "text",
    placeholder: platformOptions.map((item) => item.value).join(", "),
    required: false,
  },
  {
    name: "screenshots",
    label: "Screenshots",
    type: "text",
    placeholder:
      "https://example.com/shot-1.png, https://example.com/shot-2.png",
    required: false,
  },
  {
    name: "headquarters",
    label: "Headquarters",
    type: "text",
    placeholder: "City, Country",
    required: false,
  },
  {
    name: "country",
    label: "Country Code",
    type: "text",
    placeholder: "e.g. US, UK, NL",
    required: false,
  },
];

const createParagraphDoc = (text: string): JSONContent => {
  const trimmed = text.trim();

  if (!trimmed) {
    return {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [],
        },
      ],
    };
  }

  const paragraphs = trimmed
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => ({
      type: "paragraph",
      content: [{ type: "text", text: paragraph }],
    }));

  return {
    type: "doc",
    content:
      paragraphs.length > 0
        ? paragraphs
        : [
            {
              type: "paragraph",
              content: [{ type: "text", text: trimmed }],
            },
          ],
  };
};

const getPlainTextFromDescription = (
  description: ResourceFormState["description"],
) => {
  if (!description?.content) return "";

  const extractText = (node: JSONContent): string => {
    if (node.type === "text") {
      return node.text ?? "";
    }

    if (!node.content?.length) {
      return "";
    }

    const childText = node.content.map(extractText).join("");

    if (
      node.type === "paragraph" ||
      node.type === "heading" ||
      node.type === "blockquote" ||
      node.type === "codeBlock" ||
      node.type === "listItem"
    ) {
      return `${childText}\n`;
    }

    return childText;
  };

  return extractText(description).trim();
};

const ResourceForm = ({
  resource,
  loading = false,
  onChange,
  onSubmit,
  onLogoUploaded,
  onLogoRemoved,
  onDescriptionGenerated,
  onTaglineGenerated,
  onMetadataGenerated,
  onDescriptionChange,
  submitLabel = "Submit Resource",
  footerActions,
}: ResourceFormProps) => {
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [isGeneratingTagline, setIsGeneratingTagline] = useState(false);
  const [isGeneratingMetadata, setIsGeneratingMetadata] = useState(false);

  const [descriptionError, setDescriptionError] = useState<string | null>(null);
  const [taglineError, setTaglineError] = useState<string | null>(null);
  const [metadataError, setMetadataError] = useState<string | null>(null);

  const isGenerating =
    isGeneratingDescription || isGeneratingTagline || isGeneratingMetadata;

  const getValue = (name: keyof ResourceFormState) => {
    const value = resource[name];

    if (value && typeof value === "object") {
      return "";
    }

    return (value ?? "") as string | number | boolean;
  };

  const handleGenerateDescription = async () => {
    setDescriptionError(null);
    setIsGeneratingDescription(true);

    try {
      const result = await generateResourceDescriptionAction({
        name: resource.name,
        tagline: resource.tagline,
        website: resource.website,
        documentationUrl: resource.documentationUrl,
        githubUrl: resource.githubUrl,
        category: resource.category,
        pricing: resource.pricing,
        platforms: resource.platforms,
        license: resource.license,
        useCases: resource.useCases,
        tags: resource.tags,
        alternatives: resource.alternatives,
        githubStats: resource.githubStats,
        stackFit: resource.stackFit,
      });

      console.log("Description generation result:", result);

      if (!result.success) {
        setDescriptionError(result.error ?? "Failed to generate description.");
        return;
      }

      if (!result.description?.trim()) {
        setDescriptionError("No description was generated.");
        return;
      }
      console.log("Passing generated description to form:", result.description);

      onDescriptionGenerated(createParagraphDoc(result.description));
    } catch (error) {
      console.error("Generate description failed:", error);
      setDescriptionError("Failed to generate description.");
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const handleGenerateTagline = async () => {
    setTaglineError(null);
    setIsGeneratingTagline(true);

    try {
      const result = await generateResourceTaglineAction({
        name: resource.name,
        description: getPlainTextFromDescription(resource.description),
        website: resource.website,
        documentationUrl: resource.documentationUrl,
        githubUrl: resource.githubUrl,
        category: resource.category,
        pricing: resource.pricing,
        platforms: resource.platforms,
        license: resource.license,
        useCases: resource.useCases,
        tags: resource.tags,
        alternatives: resource.alternatives,
        githubStats: resource.githubStats,
        stackFit: resource.stackFit,
      });

      console.log("Tagline generation result:", result);

      if (!result.success) {
        setTaglineError(result.error ?? "Failed to generate tagline.");
        return;
      }

      if (!result.tagline?.trim()) {
        setTaglineError("No tagline was generated.");
        return;
      }

      onTaglineGenerated(result.tagline);
    } catch (error) {
      console.error("Generate tagline failed:", error);
      setTaglineError("Failed to generate tagline.");
    } finally {
      setIsGeneratingTagline(false);
    }
  };

  const handleGenerateMetadata = async () => {
    setMetadataError(null);
    setIsGeneratingMetadata(true);

    try {
      const result = await generateResourceMetadataAction({
        name: resource.name,
        description: getPlainTextFromDescription(resource.description),
        website: resource.website,
        documentationUrl: resource.documentationUrl,
        githubUrl: resource.githubUrl,
        category: resource.category,
        pricing: resource.pricing,
        platforms: resource.platforms,
        license: resource.license,
        useCases: resource.useCases,
        tags: resource.tags,
        alternatives: resource.alternatives,
        githubStats: resource.githubStats,
        stackFit: resource.stackFit,
      });

      console.log("Metadata generation result:", result);

      if (!result.success) {
        setMetadataError(result.error ?? "Failed to generate metadata.");
        return;
      }

      onMetadataGenerated({
        tags: result.tags.join(", "),
        alternatives: result.alternatives.join(", "),
        useCases: result.useCases.join(", "),
        platforms: result.platforms.join(", "),
      });
    } catch (error) {
      console.error("Generate metadata failed:", error);
      setMetadataError("Failed to generate metadata.");
    } finally {
      setIsGeneratingMetadata(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="w-full space-y-3">
      {inputFields.map((item) => (
        <div key={item.name} className="w-full">
          <div className="mb-1 flex items-center justify-between gap-3">
            <label htmlFor={item.name} className="block text-xs">
              {item.label}
            </label>

            {item.name === "tagline" ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={loading || isGenerating}
                onClick={handleGenerateTagline}
                className="h-8"
              >
                {isGeneratingTagline ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate tagline
                  </>
                )}
              </Button>
            ) : null}

            {item.name === "tags" ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={loading || isGenerating}
                onClick={handleGenerateMetadata}
                className="h-8"
              >
                {isGeneratingMetadata ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate metadata
                  </>
                )}
              </Button>
            ) : null}
          </div>

          {item.type === "select" ? (
            <select
              id={item.name}
              name={item.name}
              required={item.required}
              onChange={onChange}
              value={String(getValue(item.name))}
              disabled={loading || isGenerating}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="" disabled>
                {item.placeholder}
              </option>

              {item.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <Input
              id={item.name}
              name={item.name}
              type={item.type}
              placeholder={item.placeholder}
              required={item.required}
              onChange={onChange}
              value={String(getValue(item.name))}
              disabled={loading || isGenerating}
            />
          )}

          {item.name === "tagline" && taglineError ? (
            <p className="mt-2 text-xs text-destructive">{taglineError}</p>
          ) : null}

          {item.name === "tags" && metadataError ? (
            <p className="mt-2 text-xs text-destructive">{metadataError}</p>
          ) : null}
        </div>
      ))}

      <div className="w-full">
        <div className="mb-1 flex items-center justify-between gap-3">
          <label className="block text-xs">Description</label>

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={loading || isGenerating}
            onClick={handleGenerateDescription}
            className="h-8"
          >
            {isGeneratingDescription ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate description
              </>
            )}
          </Button>
        </div>

        <RichTextEditor
          value={resource.description}
          onChange={onDescriptionChange}
        />

        {descriptionError ? (
          <p className="mt-2 text-xs text-destructive">{descriptionError}</p>
        ) : null}
      </div>

      <div className="w-full space-y-3 rounded-lg border p-4">
        <div>
          <label htmlFor="logoMode" className="mb-1 block text-xs">
            Logo Source
          </label>

          <select
            id="logoMode"
            name="logoMode"
            value={resource.logoMode}
            onChange={onChange}
            disabled={loading || isGenerating}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="upload">Upload logo</option>
            <option value="url">Use image URL</option>
          </select>
        </div>

        {resource.logoMode === "upload" ? (
          <div className="space-y-2">
            <label className="block text-xs">Upload Logo</label>

            <ImageUpload
              multiple={false}
              maxFiles={1}
              accept="image/*"
              buttonText={resource.logo ? "Replace logo" : "Upload logo"}
              onUploaded={(urls) => {
                if (urls[0]) {
                  onLogoUploaded(urls[0]);
                }
              }}
            />
          </div>
        ) : (
          <div>
            <label htmlFor="logo" className="mb-1 block text-xs">
              Logo URL
            </label>
            <Input
              id="logo"
              name="logo"
              type="url"
              placeholder="https://example.com/logo.png"
              value={resource.logo}
              onChange={onChange}
              disabled={loading || isGenerating}
            />
          </div>
        )}

        {resource.logo ? (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
              Current logo preview
            </p>

            <div className="relative h-20 w-20 overflow-hidden rounded-md border bg-muted">
              <Image
                src={resource.logo}
                alt={resource.name || "Logo preview"}
                fill
                className="object-cover"
              />
            </div>

            <p className="break-all text-xs text-muted-foreground">
              {resource.logo}
            </p>

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={loading || isGenerating}
              onClick={onLogoRemoved}
            >
              Remove logo
            </Button>
          </div>
        ) : null}
      </div>

      <div className="my-5 flex items-center justify-between gap-3">
        <Button
          type="submit"
          disabled={loading || isGenerating}
          className="min-w-[170px] flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              {submitLabel}
            </>
          )}
        </Button>

        <div>{footerActions}</div>
      </div>
    </form>
  );
};

export default ResourceForm;
