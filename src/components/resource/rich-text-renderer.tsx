import StarterKit from "@tiptap/starter-kit";
import { generateHTML } from "@tiptap/html";
import type { JSONContent } from "@tiptap/core";

interface RichTextRendererProps {
  content: unknown;
}

const normalizeRichText = (value: unknown): JSONContent | null => {
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
    return value as JSONContent;
  }

  return null;
};

const isValidTiptapDoc = (value: unknown): value is JSONContent => {
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

  return (
    <div
      className="
        max-w-none text-sm leading-7
        [&_p]:my-3
        [&_strong]:font-semibold
        [&_em]:italic
        [&_h2]:mt-6
        [&_h2]:mb-3
        [&_h2]:text-2xl
        [&_h2]:font-bold
        [&_ul]:my-4
        [&_ul]:list-disc
        [&_ul]:pl-6
        [&_li]:my-1
        [&_blockquote]:my-4
        [&_blockquote]:border-l-4
        [&_blockquote]:border-muted-foreground
        [&_blockquote]:pl-4
        [&_blockquote]:italic
        [&_blockquote]:text-muted-foreground
        [&_code]:rounded
        [&_code]:bg-muted
        [&_code]:px-1.5
        [&_code]:py-0.5
        [&_code]:font-mono
        [&_code]:text-[0.9em]
        [&_pre]:my-4
        [&_pre]:overflow-x-auto
        [&_pre]:rounded-md
        [&_pre]:bg-muted
        [&_pre]:p-4
        [&_pre_code]:bg-transparent
        [&_pre_code]:p-0
      "
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default RichTextRenderer;
