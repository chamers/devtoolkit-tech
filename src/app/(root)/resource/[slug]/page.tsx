import { getResourceBySlugFromDB } from "@/app/actions/resource";
import SingleResourceCard from "@/components/resource/cards/single-resource-card";
import RichTextRenderer from "@/components/resource/rich-text-renderer";

interface ResourcePageProps {
  params: Promise<{
    slug: string;
  }>;
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
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Description</h2>
        <RichTextRenderer content={result.data.description} />
      </section>
      <pre>{JSON.stringify(result.data, null, 2)}</pre>
    </div>
  );
}
