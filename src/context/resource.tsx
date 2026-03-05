"use client";

import { ResourceState } from "@/utils/types/resource";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

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
  //subCategory: "",

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

const resourceContext = createContext<ResourceContextType | undefined>(
  undefined,
);

export const ResourceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  //state to hold the resource being created/edited
  const [resource, setResource] = React.useState<ResourceState>(initialState);
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setResource((prevResource: ResourceState) => {
      const updateResource = { ...prevResource, [name]: value };
      return updateResource;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(resource);
  };

  return (
    <resourceContext.Provider
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
    </resourceContext.Provider>
  );
};

export const useResource = () => {
  const context = useContext(resourceContext);
  if (context === undefined) {
    throw new Error("useResource must be used within a ResourceProvider");
  }
  return context;
};
