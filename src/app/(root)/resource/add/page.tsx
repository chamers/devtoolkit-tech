"use client";

import PreviewCard from "@/components/resource/preview/preview-card";
import ResourceForm from "@/components/resource/forms/resource-form";
import { useResource } from "@/context/resource";

const AddResourcePage = () => {
  const {
    resource,
    handleChange,
    handleSubmit,
    isHydrated,
    loading,
    setLogoFromUpload,
    removeLogo,
    setResource,
  } = useResource();

  if (!isHydrated) {
    return (
      <div className="flex h-screen items-center justify-center p-4">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span>Loading resource form...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col lg:flex-row">
      <div className="min-h-88.5 flex flex-col overflow-y-auto p-4 lg:order-last lg:w-1/2 lg:items-center lg:justify-center">
        <PreviewCard resource={resource} />
      </div>

      <div className="flex flex-col overflow-y-auto p-4 lg:order-first lg:w-1/2">
        <h1 className="mb-4 text-xl font-semibold">
          List your resource for free and help the community
        </h1>

        <ResourceForm
          resource={resource}
          loading={loading}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onLogoUploaded={setLogoFromUpload}
          onLogoRemoved={removeLogo}
          onDescriptionGenerated={(description) =>
            setResource((prev) => ({
              ...prev,
              description,
            }))
          }
        />
      </div>
    </div>
  );
};

export default AddResourcePage;
