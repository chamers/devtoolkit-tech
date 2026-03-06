"use client";

import { ResourceState } from "@/utils/types/resource";
import React, { createContext, useContext } from "react";

const initialState: ResourceState = {
  id: "",
  userId: "",

  name: "",
  slug: "",
  description: "",

  website: "",
  documentationUrl: "",
  githubUrl: "",

  category: "",
  // subCategory: "",

  pricing: "free",

  tags: [],

  logo: "",
  screenshots: [],

  headquarters: "",
  country: "",

  published: false,

  createdAt: new Date(),
  updatedAt: new Date(),
};

interface ResourceContextType {
  resource: ResourceState;
  setResource: React.Dispatch<React.SetStateAction<ResourceState>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const ResourceContext = createContext<ResourceContextType | undefined>(
  undefined,
);

export const ResourceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [resource, setResource] = React.useState<ResourceState>(() => {
    if (typeof window === "undefined") return initialState;

    const savedResource = localStorage.getItem("resource");
    if (!savedResource) return initialState;

    try {
      const parsed = JSON.parse(savedResource);
      return {
        ...initialState,
        ...parsed,
        createdAt: parsed.createdAt ? new Date(parsed.createdAt) : new Date(),
        updatedAt: parsed.updatedAt ? new Date(parsed.updatedAt) : new Date(),
      };
    } catch {
      return initialState;
    }
  });

  const [loading, setLoading] = React.useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setResource((prevResource) => {
      const updatedResource = {
        ...prevResource,
        [name]: value,
        updatedAt: new Date(),
      };

      localStorage.setItem("resource", JSON.stringify(updatedResource));
      return updatedResource;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(resource);
  };

  return (
    <ResourceContext.Provider
      value={{
        resource,
        setResource,
        loading,
        setLoading,
        handleChange,
        handleSubmit,
      }}
    >
      {children}
    </ResourceContext.Provider>
  );
};

export const useResource = () => {
  const context = useContext(ResourceContext);
  if (context === undefined) {
    throw new Error("useResource must be used within a ResourceProvider");
  }
  return context;
};
