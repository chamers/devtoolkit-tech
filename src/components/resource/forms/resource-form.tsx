"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ImageUpload from "@/components/resource/uploads/image-upload-wrapper";
import {
  RESOURCE_CATEGORIES,
  RESOURCE_PLATFORMS,
  RESOURCE_PRICING,
  RESOURCE_USE_CASES,
} from "@/utils/constants/resource-taxonomy";
import type { ResourceFormState } from "@/utils/types/resource";
import { Loader2, Send, Sparkles } from "lucide-react";
import { generateResourceDescriptionAction } from "@/app/actions/generate-resource-description-action";

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
  onDescriptionGenerated: (description: string) => void;
  submitLabel?: string;
}

const categoryOptions = RESOURCE_CATEGORIES.map((item) => ({
  label: item.label,
  value: item.value,
}));

const pricingOptions = RESOURCE_PRICING.map((item) => ({
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
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Describe what this tool does and who it is for",
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

const ResourceForm = ({
  resource,
  loading = false,
  onChange,
  onSubmit,
  onLogoUploaded,
  onLogoRemoved,
  onDescriptionGenerated,
  submitLabel = "Submit Resource",
}: ResourceFormProps) => {
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  const getValue = (name: keyof ResourceFormState) => {
    const value = resource[name];

    if (value && typeof value === "object") {
      return "";
    }

    return (value ?? "") as string | number | boolean;
  };

  const handleGenerateDescription = async () => {
    setGenerateError(null);
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

      if (!result.success) {
        setGenerateError(result.error ?? "Failed to generate description.");
        return;
      }

      onDescriptionGenerated(result.description);
    } catch {
      setGenerateError("Failed to generate description.");
    } finally {
      setIsGeneratingDescription(false);
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

            {item.name === "description" ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={loading || isGeneratingDescription}
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
            ) : null}
          </div>

          {item.type === "textarea" ? (
            <textarea
              id={item.name}
              name={item.name}
              placeholder={item.placeholder}
              required={item.required}
              onChange={onChange}
              value={String(getValue(item.name))}
              disabled={loading || isGeneratingDescription}
              className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60"
            />
          ) : item.type === "select" ? (
            <select
              id={item.name}
              name={item.name}
              required={item.required}
              onChange={onChange}
              value={String(getValue(item.name))}
              disabled={loading || isGeneratingDescription}
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
              disabled={loading || isGeneratingDescription}
            />
          )}

          {item.name === "description" && generateError ? (
            <p className="mt-2 text-xs text-destructive">{generateError}</p>
          ) : null}
        </div>
      ))}

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
            disabled={loading || isGeneratingDescription}
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
              disabled={loading || isGeneratingDescription}
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
              disabled={loading || isGeneratingDescription}
              onClick={onLogoRemoved}
            >
              Remove logo
            </Button>
          </div>
        ) : null}
      </div>

      <Button
        type="submit"
        disabled={loading || isGeneratingDescription}
        className="my-5 min-w-[170px] flex items-center gap-2"
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
    </form>
  );
};

export default ResourceForm;
