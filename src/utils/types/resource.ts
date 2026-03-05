export interface ResourceState {
  id: string; // database id
  userId: string; // who submitted it

  name: string;
  slug: string;
  description: string;

  website: string; // main URL
  documentationUrl?: string; // optional
  githubUrl?: string; // optional

  category: string; // e.g. Frontend, Backend, DevOps
  //subCategory: string; // e.g. React, Node.js, Kubernetes

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
