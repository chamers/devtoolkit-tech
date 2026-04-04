import StarterKit from "@tiptap/starter-kit";
import { generateHTML } from "@tiptap/html";

interface RichTextRendererProps {
  content: unknown;
}

const normalizeRichText = (value: unknown) => {
  if (!value) return null;

  if (typeof value === "string") {
    return {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: value,
            },
          ],
        },
      ],
    };
  }

  if (typeof value === "object" && value !== null) {
    return value;
  }

  return null;
};

const isValidTiptapDoc = (value: unknown): boolean => {
  if (!value || typeof value !== "object") return false;

  const doc = value as {
    type?: string;
    content?: unknown;
  };

  return doc.type === "doc" && Array.isArray(doc.content);
};

const RichTextRenderer = ({ content }: RichTextRendererProps) => {
  const normalizedContent = normalizeRichText(content);

  if (!normalizedContent) {
    return (
      <div className="text-sm text-muted-foreground">
        No description available.
      </div>
    );
  }

  if (!isValidTiptapDoc(normalizedContent)) {
    console.error(
      "Invalid rich text content passed to RichTextRenderer:",
      content,
    );

    return (
      <div className="text-sm text-muted-foreground">
        Description could not be displayed.
      </div>
    );
  }

  let html = "";

  try {
    html = generateHTML(normalizedContent, [StarterKit]);
  } catch (error) {
    console.error("Failed to render rich text content:", error, content);

    return (
      <div className="text-sm text-muted-foreground">
        Description could not be displayed.
      </div>
    );
  }

  // ✅ JSX OUTSIDE try/catch
  return (
    <div
      className="prose prose-sm max-w-none dark:prose-invert"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
export default RichTextRenderer;
