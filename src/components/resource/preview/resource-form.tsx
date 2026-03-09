"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  RESOURCE_CATEGORIES,
  RESOURCE_PLATFORMS,
  RESOURCE_PRICING,
  RESOURCE_USE_CASES,
} from "@/utils/constants/resource-taxonomy";
import type { ResourceFormState } from "@/utils/types/resource";

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
  submitLabel = "Submit Resource",
}: ResourceFormProps) => {
  const getValue = (name: keyof ResourceFormState) => {
    const value = resource[name];

    if (value && typeof value === "object") {
      return "";
    }

    return (value ?? "") as string | number | boolean;
  };

  return (
    <form onSubmit={onSubmit} className="w-full space-y-3">
      {inputFields.map((item) => (
        <div key={item.name} className="w-full">
          <label htmlFor={item.name} className="mb-1 block text-xs">
            {item.label}
          </label>

          {item.type === "textarea" ? (
            <textarea
              id={item.name}
              name={item.name}
              placeholder={item.placeholder}
              required={item.required}
              onChange={onChange}
              value={String(getValue(item.name))}
              disabled={loading}
              className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60"
            />
          ) : item.type === "select" ? (
            <select
              id={item.name}
              name={item.name}
              required={item.required}
              onChange={onChange}
              value={String(getValue(item.name))}
              disabled={loading}
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
              disabled={loading}
            />
          )}
        </div>
      ))}

      <Button type="submit" disabled={loading} className="my-5 min-w-[170px]">
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Submitting...
          </span>
        ) : (
          submitLabel
        )}
      </Button>
    </form>
  );
};

export default ResourceForm;
