import type { Metadata } from "next";
import type { JSONContent } from "@tiptap/react";
import { getResourceBySlugFromDB } from "@/app/actions/resource";
import SingleResourceCard from "@/components/resource/cards/single-resource-card";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "DevToolkit";

interface ResourcePageProps {
  params: Promise<{ slug: string }>;
}

function extractTextFromJsonContent(content: JSONContent | null): string {
  if (!content) return "";

  let text = "";

  if (typeof content.text === "string") {
    text += content.text + " ";
  }

  if (Array.isArray(content.content)) {
    for (const child of content.content) {
      text += extractTextFromJsonContent(child) + " ";
    }
  }

  return text.trim();
}

function stripHtmlAndTruncate(text: string, maxLength: number): string {
  const strippedText = text.replace(/(<([^>]+)>)/gi, "");
  const cleanedText = strippedText.replace(/\s+/g, " ").trim();

  return cleanedText.length > maxLength
    ? cleanedText.substring(0, maxLength).trim() + "..."
    : cleanedText;
}

function getImageUrl(logo?: string | null): string {
  if (!logo) return `${SITE_URL}/logos/default.png`;
  return logo.startsWith("http") ? logo : `${SITE_URL}${logo}`;
}

export async function generateMetadata({
  params,
}: ResourcePageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getResourceBySlugFromDB(slug);

  const canonicalUrl = `${SITE_URL}/resource/${slug}`;

  if (!result.ok) {
    return {
      title: "Resource not found",
      description: "The requested resource could not be found.",
      alternates: {
        canonical: canonicalUrl,
      },
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const resource = result.data;
  const imageUrl = getImageUrl(resource.logo);
  const plainDescription = extractTextFromJsonContent(resource.description);

  const description =
    stripHtmlAndTruncate(plainDescription, 160) ||
    `Explore ${resource.name} on ${APP_NAME}.`;

  const keywords = [
    resource.name,
    "developer tools",
    "software development",
    ...(resource.category ? [resource.category] : []),
    ...(Array.isArray(resource.tags) ? resource.tags : []),
  ];

  return {
    title: resource.name,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: resource.name,
      description,
      url: canonicalUrl,
      siteName: APP_NAME,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: resource.name,
        },
      ],
      locale: "en_GB",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: resource.name,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ResourcePage({ params }: ResourcePageProps) {
  const { slug } = await params;
  const result = await getResourceBySlugFromDB(slug);

  if (!result.ok) {
    return <div className="m-20">{result.error}</div>;
  }

  const resource = result.data;
  const imageUrl = getImageUrl(resource.logo);
  const plainDescription = extractTextFromJsonContent(resource.description);

  const description =
    stripHtmlAndTruncate(plainDescription, 160) ||
    `Explore ${resource.name} on ${APP_NAME}.`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: resource.name,
    description,
    applicationCategory: resource.category || "DeveloperTool",
    operatingSystem: "All",
    url: `${SITE_URL}/resource/${resource.slug ?? slug}`,
    image: imageUrl,
  };

  return (
    <div className="m-20 space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SingleResourceCard resource={resource} />
      <pre>{JSON.stringify(resource, null, 2)}</pre>
    </div>
  );
}
