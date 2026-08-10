"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Placeholder from "@tiptap/extension-placeholder";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import HardBreak from "@tiptap/extension-hard-break";
import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  List,
  ListOrdered,
  Pilcrow,
  Heading2,
  Heading3,
} from "lucide-react";

const BLOCK_TAG_PATTERN = /<(p|h[1-6]|ul|ol|li|blockquote|pre)(?:\s|>)/i;
const BREAK_PATTERN = /<br\s*\/?\s*>/gi;
const HAS_BREAK_PATTERN = /<br\s*\/?\s*>/i;
const PARAGRAPH_BREAK_PATTERN = /<br\s*\/?\s*>|\r?\n/gi;

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function normalizeEditorHtml(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";

  if (!BLOCK_TAG_PATTERN.test(trimmed)) {
    const source = /<[^>]+>/.test(trimmed) ? trimmed : escapeHtml(trimmed);
    return source
      .replace(BREAK_PATTERN, "\n")
      .split(/\r?\n/)
      .map((line) => `<p>${line || "<br>"}</p>`)
      .join("");
  }

  return trimmed.replace(
    /<p([^>]*)>([\s\S]*?)<\/p>/gi,
    (paragraph, attributes: string, content: string) => {
      if (!HAS_BREAK_PATTERN.test(content) && !/[\r\n]/.test(content)) return paragraph;
      if (/^\s*<br\s*\/?\s*>\s*$/i.test(content)) return paragraph;
      return content
        .split(PARAGRAPH_BREAK_PATTERN)
        .map((line) => `<p${attributes}>${line || "<br>"}</p>`)
        .join("");
    }
  );
}

function ToolbarButton({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`flex size-8 items-center justify-center rounded-lg transition ${
        active
          ? "bg-brasa/20 text-brasa"
          : "text-bruma-light/50 hover:bg-bruma-light/10 hover:text-bruma-light"
      }`}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-bruma-light/10 px-2 py-1.5">
      <ToolbarButton
        label="Parágrafo"
        active={editor.isActive("paragraph")}
        onClick={() => editor.chain().focus().setParagraph().run()}
      >
        <Pilcrow size={15} />
      </ToolbarButton>
      <ToolbarButton
        label="Título 2"
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 size={15} />
      </ToolbarButton>
      <ToolbarButton
        label="Título 3"
        active={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 size={15} />
      </ToolbarButton>
      <span className="mx-1 h-5 w-px bg-bruma-light/10" />
      <ToolbarButton
        label="Negrito"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <BoldIcon size={15} />
      </ToolbarButton>
      <ToolbarButton
        label="Itálico"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <ItalicIcon size={15} />
      </ToolbarButton>
      <span className="mx-1 h-5 w-px bg-bruma-light/10" />
      <ToolbarButton
        label="Lista com marcadores"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List size={15} />
      </ToolbarButton>
      <ToolbarButton
        label="Lista numerada"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered size={15} />
      </ToolbarButton>
    </div>
  );
}

export function RichTextEditor({
  value,
  onChange,
  placeholder,
  minHeight = 160,
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        document: false,
        paragraph: false,
        text: false,
        hardBreak: false,
        heading: false,
        bulletList: false,
        orderedList: false,
        bold: false,
        italic: false,
      }),
      Document,
      Paragraph,
      Text,
      HardBreak,
      Heading.configure({ levels: [2, 3] }),
      BulletList,
      OrderedList,
      Bold,
      Italic,
      Placeholder.configure({ placeholder: placeholder ?? "" }),
    ],
    content: normalizeEditorHtml(value),
    editorProps: {
      attributes: {
        class:
          "tiptap-content prose-instalsat min-h-[var(--rte-min-h)] px-3.5 py-3 text-sm text-bruma-light outline-none",
      },
    },
    onUpdate: ({ editor }) => onChange(normalizeEditorHtml(editor.getHTML())),
  });

  return (
    <div
      className="overflow-hidden rounded-xl border border-bruma-light/10 bg-bruma-light/5"
      style={{ ["--rte-min-h" as string]: `${minHeight}px` }}
    >
      {editor && <Toolbar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
}
