"use client";

import { useEffect } from "react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import type { JSONContent } from "@tiptap/core";

interface RichTextEditorProps {
  value: JSONContent | null;
  onChange: (value: JSONContent) => void;
}

function ToolbarButton({
  label,
  onClick,
  isActive = false,
}: {
  label: string;
  onClick: () => void;
  isActive?: boolean;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`rounded-md border px-3 py-1 text-sm transition ${
        isActive
          ? "bg-foreground text-background"
          : "bg-background text-foreground hover:bg-muted"
      }`}
    >
      {label}
    </button>
  );
}

export default function RichTextEditor({
  value,
  onChange,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
    ],
    content: value ?? {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "" }],
        },
      ],
    },
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "tiptap min-h-[220px] w-full rounded-b-md border border-t-0 bg-background px-4 py-3 outline-none prose prose-sm max-w-none dark:prose-invert",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
  });

  useEffect(() => {
    if (!editor) return;

    const incomingValue = value ?? {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "" }],
        },
      ],
    };

    const currentValue = editor.getJSON();

    if (JSON.stringify(currentValue) !== JSON.stringify(incomingValue)) {
      editor.commands.setContent(incomingValue);
    }
  }, [editor, value]);

  const editorState = useEditorState({
    editor,
    selector: ({ editor }) => {
      if (!editor) {
        return {
          isBold: false,
          isItalic: false,
          isH2: false,
          isBullet: false,
          isQuote: false,
          isCode: false,
        };
      }

      return {
        isBold: editor.isActive("bold"),
        isItalic: editor.isActive("italic"),
        isH2: editor.isActive("heading", { level: 2 }),
        isBullet: editor.isActive("bulletList"),
        isQuote: editor.isActive("blockquote"),
        isCode: editor.isActive("code"),
      };
    },
  }) ?? {
    isBold: false,
    isItalic: false,
    isH2: false,
    isBullet: false,
    isQuote: false,
    isCode: false,
  };

  if (!editor) return null;

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 rounded-t-md border bg-muted/40 p-2">
        <ToolbarButton
          label="Bold"
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editorState.isBold}
        />

        <ToolbarButton
          label="Italic"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editorState.isItalic}
        />

        <ToolbarButton
          label="H2"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          isActive={editorState.isH2}
        />

        <ToolbarButton
          label="Bullet"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editorState.isBullet}
        />

        <ToolbarButton
          label="Quote"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editorState.isQuote}
        />

        <ToolbarButton
          label="Code"
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editorState.isCode}
        />
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
