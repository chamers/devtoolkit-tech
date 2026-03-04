"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface ResourceState {
  id: string; // database id
  userId: string; // who submitted it

  name: string;
  slug: string;
  description: string;

  website: string; // main URL
  documentationUrl?: string; // optional
  githubUrl?: string; // optional

  category: string; // e.g. Frontend, Backend, DevOps
  subCategory?: string;

  pricing: "free" | "freemium" | "paid" | "open-source";

  tags?: string[];

  logo?: string; // image URL
  screenshots?: string[];

  headquarters?: string; // city/country (optional)
  country?: string; // ISO code optional

  published: boolean;

  createdAt: Date | string;
  updatedAt: Date | string;
}

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
  subCategory: "",

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
}

const resourceContext = createContext<ResourceContextType | undefined>(
  undefined,
);

export const ResourceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [resource, setResource] = React.useState<ResourceState>(initialState);
  const [loading, setLoading] = React.useState<boolean>(false);

  return (
    <resourceContext.Provider
      value={{ resource, setResource, loading, setLoading }}
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
