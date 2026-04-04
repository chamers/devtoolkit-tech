"use client";

import { useParams } from "next/navigation";
import PreviewCard from "@/components/resource/preview/preview-card";
import ResourceForm from "@/components/resource/forms/resource-form";
import { Button } from "@/components/ui/button";
import { useResource } from "@/context/resource";

const EditResourcePage = () => {
  const params = useParams<{ id?: string | string[] }>();
  const idParam = params?.id;
  const resourceId = typeof idParam === "string" ? idParam : "";

  const {
    resource,
    handleChange,
    handleSubmit,
    isHydrated,
    loading,
    error,
    setLogoFromUpload,
    removeLogo,
    setResource,
    setPublishedStatus,
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
        <h1 className="mb-4 text-xl font-semibold">Edit your resource</h1>

        {error && (
          <div className="mb-4 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <ResourceForm
          resource={resource}
          loading={loading}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onLogoUploaded={setLogoFromUpload}
          onLogoRemoved={removeLogo}
          onDescriptionChange={(description) =>
            setResource((prev) => ({
              ...prev,
              description,
            }))
          }
          onDescriptionGenerated={(description) =>
            setResource((prev) => ({
              ...prev,
              description,
            }))
          }
          onTaglineGenerated={(tagline) =>
            setResource((prev) => ({
              ...prev,
              tagline,
            }))
          }
          onMetadataGenerated={(data) =>
            setResource((prev) => ({
              ...prev,
              tags: data.tags,
              alternatives: data.alternatives,
              useCases: data.useCases,
              platforms: data.platforms,
            }))
          }
          footerActions={
            resourceId ? (
              <Button
                type="button"
                variant="outline"
                disabled={loading}
                onClick={() =>
                  void setPublishedStatus(resourceId, !resource.published)
                }
              >
                {resource.published ? "Unpublish" : "Publish"}
              </Button>
            ) : null
          }
        />
      </div>
    </div>
  );
};

export default EditResourcePage;
