"use client";

import React, { createContext, useContext } from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import { useRouter, usePathname, useParams } from "next/navigation";
import toast from "react-hot-toast";

import {
  defaultResourceFormState,
  type ResourceFormState,
  type Resource,
} from "@/utils/types/resource";
import {
  normalizeResourceFormState,
  validateResourceFormState,
  validateResourceInput,
} from "@/lib/validators/resource";

interface ApiSuccess<T> {
  ok: true;
  data: T;
}

interface ApiError {
  ok: false;
  error: string;
}

type ApiResult<T> = ApiSuccess<T> | ApiError;

interface ResourceContextType {
  resource: ResourceFormState;
  setResource: React.Dispatch<React.SetStateAction<ResourceFormState>>;
  initialState: ResourceFormState;
  setInitialState: React.Dispatch<React.SetStateAction<ResourceFormState>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isHydrated: boolean;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  resources: Resource[];
  setResources: React.Dispatch<React.SetStateAction<Resource[]>>;
  setLogoFromUpload: (url: string) => void;
  removeLogo: () => void;
  addScreenshotsFromUpload: (urls: string[]) => void;
  setPublishedStatus: (id: string, published: boolean) => Promise<void>;
}

const ResourceContext = createContext<ResourceContextType | undefined>(
  undefined,
);

const LOCAL_STORAGE_KEY = "resource";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const mapResourceToFormState = (
  input: Partial<ResourceFormState> | Partial<Resource>,
): ResourceFormState => {
  const resolvedLogo = typeof input.logo === "string" ? input.logo : "";

  return {
    ...defaultResourceFormState,
    ...input,
    logo: resolvedLogo,
    logoMode: "logoMode" in input && input.logoMode ? input.logoMode : "upload",
    tags: Array.isArray(input.tags)
      ? input.tags.join(", ")
      : (input.tags ?? ""),
    useCases: Array.isArray(input.useCases)
      ? input.useCases.join(", ")
      : (input.useCases ?? ""),
    alternatives: Array.isArray(input.alternatives)
      ? input.alternatives.join(", ")
      : (input.alternatives ?? ""),
    platforms: Array.isArray(input.platforms)
      ? input.platforms.join(", ")
      : (input.platforms ?? ""),
    screenshots: Array.isArray(input.screenshots)
      ? input.screenshots.join(", ")
      : (input.screenshots ?? ""),
    comparisonTargets: Array.isArray(input.comparisonTargets)
      ? input.comparisonTargets
      : [],
    developerEvents: Array.isArray(input.developerEvents)
      ? input.developerEvents
      : [],
    communityRating: input.communityRating ?? {
      average: 0,
      count: 0,
    },
    githubStats: input.githubStats ?? {
      stars: 0,
      forks: 0,
      issues: 0,
      lastCommitDate: null,
      repository: "",
    },
    stackFit: {
      ...defaultResourceFormState.stackFit,
      ...(input.stackFit ?? {}),
    },
  };
};

async function parseApiResponse<T>(response: Response): Promise<ApiResult<T>> {
  const contentType = response.headers.get("content-type") ?? "";
  const url = response.url;
  const status = response.status;
  const statusText = response.statusText;
  const redirected = response.redirected;

  if (!contentType.includes("application/json")) {
    const text = await response.text();

    console.error(
      [
        "Non-JSON API response",
        `url: ${url}`,
        `status: ${status}`,
        `statusText: ${statusText}`,
        `redirected: ${redirected}`,
        `contentType: ${contentType || "(empty)"}`,
        `bodyPreview: ${text.slice(0, 500) || "(empty)"}`,
      ].join("\n"),
    );

    return {
      ok: false,
      error: `The server returned a non-JSON response (${status}).`,
    };
  }

  try {
    return (await response.json()) as ApiResult<T>;
  } catch (error) {
    console.error(
      [
        "Failed to parse JSON response",
        `url: ${url}`,
        `status: ${status}`,
        `statusText: ${statusText}`,
        `redirected: ${redirected}`,
        `contentType: ${contentType || "(empty)"}`,
        `error: ${error instanceof Error ? error.message : String(error)}`,
      ].join("\n"),
    );

    return {
      ok: false,
      error: "The server returned an invalid response.",
    };
  }
}

export const ResourceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [resource, setResource] = React.useState<ResourceFormState>(
    defaultResourceFormState,
  );
  const [initialState, setInitialState] = React.useState<ResourceFormState>(
    defaultResourceFormState,
  );
  const [loading, setLoading] = React.useState(false);
  const [isHydrated, setIsHydrated] = React.useState(false);
  const [resources, setResources] = React.useState<Resource[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const { openSignIn } = useClerk();
  const { isSignedIn } = useUser();

  const router = useRouter();
  const pathname = usePathname();
  const params = useParams<{ id?: string | string[] }>();

  const idParam = params?.id;
  const resourceId = typeof idParam === "string" ? idParam : undefined;

  const isDashboardPage = pathname === "/dashboard";
  const isAddPage = pathname === "/resources/add";
  const isEditPage = pathname.startsWith("/dashboard/edit/");

  const setLogoFromUpload = React.useCallback((url: string) => {
    setResource((prev) => ({
      ...prev,
      logo: url,
      logoMode: "upload",
    }));
  }, []);

  const removeLogo = React.useCallback(() => {
    setResource((prev) => ({
      ...prev,
      logo: "",
    }));
  }, []);

  const addScreenshotsFromUpload = React.useCallback((urls: string[]) => {
    setResource((prev) => {
      const existing = prev.screenshots
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      const merged = [...new Set([...existing, ...urls])];

      return {
        ...prev,
        screenshots: merged.join(", "),
      };
    });
  }, []);

  const getUserResources = React.useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/resources", {
        method: "GET",
        cache: "no-store",
      });

      const result = await parseApiResponse<Resource[]>(response);

      if (!result.ok) {
        setError(result.error);
        toast.error(result.error);
        setResources([]);
        return;
      }

      setResources(result.data);
    } catch (error) {
      console.error("❌ Failed to fetch user resources:", error);
      setError("Something went wrong while fetching your resources.");
      toast.error("Something went wrong while fetching your resources.");
      setResources([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const getResource = React.useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/resources/${id}`, {
        method: "GET",
        cache: "no-store",
      });

      const result = await parseApiResponse<Resource>(response);

      if (!result.ok) {
        setError(result.error);
        toast.error(result.error);
        setResource(defaultResourceFormState);
        setInitialState(defaultResourceFormState);
        return;
      }

      const mappedResource = mapResourceToFormState(result.data);
      setResource(mappedResource);
      setInitialState(mappedResource);
    } catch (error) {
      console.error("❌ Failed to fetch resource:", error);
      setError("Something went wrong while fetching the resource.");
      toast.error("Something went wrong while fetching the resource.");
      setResource(defaultResourceFormState);
      setInitialState(defaultResourceFormState);
    } finally {
      setLoading(false);
      setIsHydrated(true);
    }
  }, []);

  const setPublishedStatus = React.useCallback(
    async (id: string, published: boolean) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/resources/${id}/publish`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ published }),
        });

        const result = await parseApiResponse<Resource>(response);

        if (!result.ok) {
          setError(result.error);
          toast.error(result.error);
          return;
        }

        const updatedResource = mapResourceToFormState(result.data);

        setResources((prev) =>
          prev.map((item) =>
            item._id === result.data._id ? result.data : item,
          ),
        );

        if (resourceId === result.data._id) {
          setResource(updatedResource);
          setInitialState(updatedResource);
        }

        toast.success(
          published
            ? "Resource published successfully."
            : "Resource unpublished successfully.",
        );
      } catch (error) {
        console.error("❌ Failed to update published status:", error);
        setError("Something went wrong while updating publish status.");
        toast.error("Something went wrong while updating publish status.");
      } finally {
        setLoading(false);
      }
    },
    [resourceId],
  );

  React.useEffect(() => {
    if (!isDashboardPage) return;
    void getUserResources();
  }, [isDashboardPage, getUserResources]);

  React.useEffect(() => {
    setIsHydrated(false);
    setError(null);

    if (isEditPage) {
      if (resourceId) {
        void getResource(resourceId);
      } else {
        setResource(defaultResourceFormState);
        setInitialState(defaultResourceFormState);
        setIsHydrated(true);
      }
      return;
    }

    if (isAddPage) {
      try {
        const savedResource = localStorage.getItem(LOCAL_STORAGE_KEY);

        if (savedResource) {
          const parsed = JSON.parse(savedResource);
          const mappedResource = mapResourceToFormState(parsed);
          setResource(mappedResource);
          setInitialState(defaultResourceFormState);
        } else {
          setResource(defaultResourceFormState);
          setInitialState(defaultResourceFormState);
        }
      } catch (error) {
        console.error(
          "❌ Failed to read resource draft from localStorage:",
          error,
        );
        setError("Failed to restore your saved draft.");
        setResource(defaultResourceFormState);
        setInitialState(defaultResourceFormState);
      } finally {
        setIsHydrated(true);
      }
      return;
    }

    setResource(defaultResourceFormState);
    setInitialState(defaultResourceFormState);
    setIsHydrated(true);
  }, [isAddPage, isEditPage, resourceId, getResource]);

  React.useEffect(() => {
    if (!isHydrated || !isAddPage) return;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(resource));
  }, [resource, isHydrated, isAddPage]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setResource((prev) => {
      const updatedResource: ResourceFormState = {
        ...prev,
        [name]: value,
      };

      if (name === "name") {
        const previousAutoSlug = slugify(prev.name);
        const nextAutoSlug = slugify(value);

        const slugWasEmpty = !prev.slug;
        const slugWasAutoGenerated = prev.slug === previousAutoSlug;

        if (slugWasEmpty || slugWasAutoGenerated) {
          updatedResource.slug = nextAutoSlug;
        }
      }

      return updatedResource;
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    if (!isSignedIn) {
      toast.error("Please sign in to manage resources.");
      openSignIn();
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const formValidation = validateResourceFormState(resource);

      if (!formValidation.success) {
        console.error("Form validation failed:", formValidation.error.issues);
        setError("Please correct the form fields before submitting.");
        toast.error("Please correct the form fields before submitting.");
        return;
      }

      const normalizedResource = normalizeResourceFormState(resource);
      const inputValidation = validateResourceInput(normalizedResource);

      if (!inputValidation.success) {
        console.error(
          "Normalized input validation failed:",
          inputValidation.error.issues,
        );
        setError("The resource data is invalid after normalization.");
        toast.error("The resource data is invalid after normalization.");
        return;
      }

      const payload = inputValidation.data;
      const toastId = toast.loading(
        isEditPage ? "Updating resource..." : "Saving resource...",
      );

      const response = await fetch(
        isEditPage && resourceId
          ? `/api/resources/${resourceId}`
          : "/api/resources",
        {
          method: isEditPage && resourceId ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const result = await parseApiResponse<Resource>(response);

      if (!result.ok) {
        setError(result.error);
        toast.error(result.error, { id: toastId });
        return;
      }

      toast.success(
        isEditPage
          ? "🎉 Resource updated successfully!"
          : "🎉 Resource saved successfully!",
        { id: toastId },
      );

      const mappedResource = mapResourceToFormState(result.data);
      setResource(mappedResource);
      setInitialState(mappedResource);

      if (isEditPage) {
        router.push(`/dashboard/edit/${result.data._id}`);
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("❌ Failed to save resource:", error);
      setError("Something went wrong while saving the resource.");
      toast.error("Something went wrong while saving the resource.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ResourceContext.Provider
      value={{
        resource,
        setResource,
        initialState,
        setInitialState,
        loading,
        setLoading,
        isHydrated,
        error,
        setError,
        handleChange,
        handleSubmit,
        resources,
        setResources,
        setLogoFromUpload,
        removeLogo,
        addScreenshotsFromUpload,
        setPublishedStatus,
      }}
    >
      {children}
    </ResourceContext.Provider>
  );
};

export const useResource = () => {
  const context = useContext(ResourceContext);

  if (!context) {
    throw new Error("useResource must be used within a ResourceProvider");
  }

  return context;
};
