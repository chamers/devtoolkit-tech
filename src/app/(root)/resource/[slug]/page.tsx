import type { Metadata } from "next"; //gives correct type for metadata object
import type { JSONContent } from "@tiptap/react"; //types your JSONContent correctly, ensuring you get proper type checking and autocompletion when working with Tiptap's content structure.
import { getResourceBySlugFromDB } from "@/app/actions/resource";
import SingleResourceCard from "@/components/resource/cards/single-resource-card";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL!;
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

export async function generateMetadata({
  params,
}: ResourcePageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getResourceBySlugFromDB(slug);

  const canonicalUrl = `${SITE_URL}/resource/${slug}`;

  if (!result.ok || !result.data) {
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

  const imageUrl = resource.logo
    ? resource.logo.startsWith("http")
      ? resource.logo
      : `${SITE_URL}${resource.logo}`
    : `${SITE_URL}/logos/default.png`;

  const plainDescription = extractTextFromJsonContent(resource.description);

  const description =
    stripHtmlAndTruncate(plainDescription, 160) ||
    `Explore ${resource.name} on DevToolkit.`;

  return {
    title: resource.name,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: resource.name,
      description,
      url: canonicalUrl,
      siteName: "DevToolkit",
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

  return (
    <div className="m-20 space-y-6">
      <SingleResourceCard resource={result.data} />
      <pre>{JSON.stringify(result.data, null, 2)}</pre>
    </div>
  );
}
