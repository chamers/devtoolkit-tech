"use client";

import PreviewCard from "@/components/resource/preview/preview-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useResource } from "@/context/resource";
import {
  RESOURCE_CATEGORIES,
  RESOURCE_PRICING,
  RESOURCE_USE_CASES,
  getCategoryLabel,
  getPricingLabel,
  getUseCaseLabel,
} from "@/utils/constants/resource-taxonomy";
import { ResourceState } from "@/utils/types/resource";

interface InputField {
  name: string;
  type: "text" | "url" | "textarea" | "select";
  label: string;
  placeholder?: string;
  required: boolean;
  options?: { label: string; value: string }[];
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

const AddResourcePage = () => {
  const { resource, handleChange, handleSubmit, isHydrated } = useResource();

  const getValue = (name: keyof ResourceState) => {
    const value = resource[name];

    if (Array.isArray(value)) {
      return value.join(", ");
    }

    return (value ?? "") as string;
  };

  return (
    <div className="flex h-screen flex-col lg:flex-row">
      {/* Preview */}

      <div className="flex flex-col overflow-y-auto p-4 lg:order-last lg:w-1/2 lg:items-center lg:justify-center min-h-88.5">
        <PreviewCard resource={resource} />
      </div>

      {/* Form */}
      <div className="flex flex-col overflow-y-auto p-4 lg:order-first lg:w-1/2">
        <h1 className="mb-4 text-xl font-semibold">
          List your resource for free and help the community
        </h1>

        <form onSubmit={handleSubmit} className="w-full space-y-3">
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
                  onChange={handleChange}
                  value={getValue(item.name as keyof ResourceState)}
                  className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              ) : item.type === "select" ? (
                <select
                  id={item.name}
                  name={item.name}
                  required={item.required}
                  onChange={handleChange}
                  value={getValue(item.name as keyof ResourceState)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
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
                  onChange={handleChange}
                  value={getValue(item.name as keyof ResourceState)}
                />
              )}
            </div>
          ))}

          <Button type="submit" className="my-5">
            Submit Resource
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddResourcePage;
