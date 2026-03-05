"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useResource } from "@/context/resource";
import { ResourceState } from "@/utils/types/resource";

interface InputField {
  name: string;
  type: string;
  label: string;
  placeholder?: string;
  required: boolean;
  accept?: string;
}
//name, slug, description, website, documentationUrl, githubUrl, category, pricing, tags, logo, headquarters, country
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
    placeholder: "Enter slug",
    required: true,
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Enter resource description",
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
    placeholder: "Enter GitHub URL",
    required: false,
  },
  {
    name: "category",
    label: "Category",
    type: "text",
    placeholder: "Select category option",
    required: true,
  },
  {
    name: "pricing",
    label: "Pricing",
    type: "select",
    placeholder: "Select pricing option",
    required: true,
  },
  {
    name: "tags",
    label: "Tags",
    type: "text",
    placeholder:
      "Enter tags separated by commas: e.g. react, css, testing, database",
    required: false,
  },
  {
    name: "logoFile",
    label: "Upload Logo",
    type: "file",
    accept: "image/*",
    required: false,
  },
  {
    name: "logoUrl",
    label: "Logo URL",
    type: "url",
    placeholder: "https://example.com/logo.png",
    required: false,
  },
  {
    name: "headquarters",
    label: "Headquarters",
    type: "text",
    placeholder: "Enter headquarters location",
    required: false,
  },
  {
    name: "country",
    label: "Country",
    type: "text",
    placeholder: "Enter country ISO code",
    required: false,
  },
];
const AddResourcePage = () => {
  const { resource, handleChange, handleSubmit } = useResource();

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      <div className="flex flex-col lg:w-1/2 p-4 lg:order-last lg:flex lg:justify-center lg:items-center overflow-y-auto">
        Preview
      </div>
      <div className="flex flex-col lg:w-1/2 p-4 lg:order-first lg:flex overflow-y-auto">
        <h1>List your resource for free and help the community!</h1>
        {inputFields.map((item, index) => (
          <div key={index} className="my-2 w-full">
            <label htmlFor={item.name} className="text-xs">
              {item.label}
            </label>
            <Input
              name={item.name}
              type={item.type}
              placeholder={item.placeholder}
              required={item.required}
              accept={item.accept}
              onChange={handleChange}
              value={
                (resource[item.name as keyof ResourceState] || "") as string
              }
            />
          </div>
        ))}
        <Button onClick={handleSubmit} type="submit" className="my-5">
          Submit Resource
        </Button>
      </div>
    </div>
  );
};
export default AddResourcePage;
