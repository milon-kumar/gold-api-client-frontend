import React, { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Underline } from "@tiptap/extension-underline";
import { Link } from "@tiptap/extension-link";
import { Image } from "@tiptap/extension-image";
import { Placeholder } from "@tiptap/extension-placeholder";
import { TextStyle, FontSize } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { TextAlign } from "@tiptap/extension-text-align";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Link as LinkIcon,
  Quote,
  Image as ImageIcon,
  Undo2,
  Redo2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Palette,
  Code2,
  ChevronDown,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";


export const RICH_TEXT_VARIANTS = {
  MINIMAL: "minimal",
  SIMPLE: "simple",
  MEDIA: "media",
};

const VARIANT_CONFIG = {
  minimal: {
    undoRedo: false,
    blockType: false,
    fontSize: false,
    bold: true,
    italic: true,
    underline: true,
    strike: false,
    color: false,
    align: false,
    bulletList: true,
    orderedList: true,
    blockquote: false,
    link: true,
    htmlView: false,
    image: false,
  },
  simple: {
    undoRedo: true,
    blockType: true,
    fontSize: true,
    bold: true,
    italic: true,
    underline: true,
    strike: true,
    color: false,
    align: true,
    bulletList: true,
    orderedList: true,
    blockquote: true,
    link: false,
    htmlView: true,
    image: false,
  },
  media: {
    undoRedo: true,
    blockType: true,
    fontSize: true,
    bold: true,
    italic: true,
    underline: true,
    strike: true,
    color: true,
    align: true,
    bulletList: true,
    orderedList: true,
    blockquote: true,
    link: true,
    htmlView: true,
    image: true,
  },
};

const HEADING_LEVELS = [1, 2, 3, 4, 5, 6];

const BLOCK_TYPE_OPTIONS = [
  { value: "paragraph", label: "Paragraph" },
  ...HEADING_LEVELS.map((level) => ({ value: String(level), label: `Heading ${level}` })),
];

const FONT_SIZE_OPTIONS = [
  { value: "", label: "Default" },
  { value: "12px", label: "Small" },
  { value: "14px", label: "Normal" },
  { value: "16px", label: "Medium" },
  { value: "20px", label: "Large" },
  { value: "24px", label: "X-Large" },
  { value: "32px", label: "Huge" },
];

const COLOR_SWATCHES = [
  "#0f172a",
  "#475569",
  "#dc2626",
  "#ea580c",
  "#d97706",
  "#16a34a",
  "#0d9488",
  "#2563eb",
  "#4f46e5",
  "#9333ea",
  "#db2777",
  "#64748b",
];

// The schema is always fully loaded (all nodes/marks registered) regardless of
// variant. Only the toolbar buttons differ per variant. This avoids editor
// commands silently becoming unavailable if a variant's extension list ever
// ends up out of sync with its toolbar.
const getExtensions = (placeholder) => [
  StarterKit.configure({
    heading: { levels: HEADING_LEVELS },
    blockquote: {},
    codeBlock: false,
    horizontalRule: false,
    strike: {},
    underline: false,
    link: false,
  }),
  Placeholder.configure({ placeholder }),
  Underline,
  Link.configure({ openOnClick: false, autolink: true }),
  Image.configure({ inline: false }),
  TextStyle,
  Color,
  FontSize,
  TextAlign.configure({
    types: ["heading", "paragraph"],
    alignments: ["left", "center", "right", "justify"],
  }),
];

const preventFocusLoss = (e) => e.preventDefault();

const ToolbarButton = ({ onClick, isActive, disabled, title, children }) => (
  <Button
    type="button"
    variant="ghost"
    size="icon"
    title={title}
    disabled={disabled}
    onMouseDown={preventFocusLoss}
    onClick={onClick}
    className={cn(
      "h-6.5 w-6.5 text-muted-foreground hover:text-foreground",
      isActive && "bg-gray-200 text-foreground hover:bg-gray-200",
    )}
  >
    {children}
  </Button>
);

const ToolbarSeparator = () => <div className="w-px h-5 bg-border mx-0.5" />;

const ToolbarDropdown = ({ trigger, value, options, onSelect, widthClass = "w-36" }) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          onMouseDown={preventFocusLoss}
          className="h-6.5 flex items-center gap-1 rounded-md px-1.5 text-xs text-muted-foreground hover:bg-gray-100 hover:text-foreground"
        >
          {trigger}
          <ChevronDown className="h-3 w-3 shrink-0" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className={cn("p-1", widthClass)}>
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onMouseDown={preventFocusLoss}
            onClick={() => {
              onSelect(opt.value);
              setOpen(false);
            }}
            className={cn(
              "w-full flex items-center justify-between rounded-sm px-2 py-1.5 text-xs text-left hover:bg-gray-100",
              value === opt.value && "font-medium",
            )}
          >
            {opt.label}
            {value === opt.value && <Check className="h-3 w-3" />}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
};

const Toolbar = ({ editor, config, onImageUpload, htmlMode, onToggleHtml }) => {
  const fileInputRef = useRef(null);
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [colorOpen, setColorOpen] = useState(false);

  if (!editor) return null;

  const currentBlockType = (() => {
    const level = HEADING_LEVELS.find((l) => editor.isActive("heading", { level: l }));
    return level ? String(level) : "paragraph";
  })();

  const currentFontSize = editor.getAttributes("textStyle").fontSize || "";
  const currentColor = editor.getAttributes("textStyle").color || "";

  const applyBlockType = (val) => {
    if (val === "paragraph") {
      editor.chain().focus().setParagraph().run();
    } else {
      editor.chain().focus().setNode("heading", { level: Number(val) }).run();
    }
  };

  const applyFontSize = (val) => {
    if (!val) {
      editor.chain().focus().unsetFontSize().run();
    } else {
      editor.chain().focus().setFontSize(val).run();
    }
  };

  const applyLink = () => {
    if (!linkUrl.trim()) {
      editor.chain().focus().unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl.trim() }).run();
    }
    setLinkOpen(false);
    setLinkUrl("");
  };

  const applyColor = (color) => {
    editor.chain().focus().setColor(color).run();
    setColorOpen(false);
  };

  const pickImage = () => fileInputRef.current?.click();

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (onImageUpload) {
      const url = await onImageUpload(file);
      if (url) editor.chain().focus().setImage({ src: url }).run();
    } else {
      const reader = new FileReader();
      reader.onload = () => editor.chain().focus().setImage({ src: reader.result }).run();
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b bg-gray-50/70 p-1 rounded-t-md">
      {config.undoRedo && (
        <>
          <ToolbarButton title="Undo" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}>
            <Undo2 className="h-3.5 w-3.5" />
          </ToolbarButton>
          <ToolbarButton title="Redo" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}>
            <Redo2 className="h-3.5 w-3.5" />
          </ToolbarButton>
          <ToolbarSeparator />
        </>
      )}

      {config.blockType && (
        <ToolbarDropdown
          trigger={BLOCK_TYPE_OPTIONS.find((o) => o.value === currentBlockType)?.label}
          value={currentBlockType}
          options={BLOCK_TYPE_OPTIONS}
          onSelect={applyBlockType}
          widthClass="w-36"
        />
      )}

      {config.fontSize && (
        <ToolbarDropdown
          trigger={FONT_SIZE_OPTIONS.find((o) => o.value === currentFontSize)?.label || "Size"}
          value={currentFontSize}
          options={FONT_SIZE_OPTIONS}
          onSelect={applyFontSize}
          widthClass="w-28"
        />
      )}

      {(config.blockType || config.fontSize) && <ToolbarSeparator />}

      <ToolbarButton title="Bold" isActive={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
        <Bold className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton title="Italic" isActive={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <Italic className="h-3.5 w-3.5" />
      </ToolbarButton>

      {config.underline && (
        <ToolbarButton
          title="Underline"
          isActive={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon className="h-3.5 w-3.5" />
        </ToolbarButton>
      )}

      {config.strike && (
        <ToolbarButton
          title="Strikethrough"
          isActive={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="h-3.5 w-3.5" />
        </ToolbarButton>
      )}

      {config.color && (
        <Popover open={colorOpen} onOpenChange={setColorOpen}>
          <PopoverTrigger asChild>
            <ToolbarButton title="Text Color" onClick={() => setColorOpen(true)}>
              <Palette className="h-3.5 w-3.5" style={currentColor ? { color: currentColor } : undefined} />
            </ToolbarButton>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-44 p-2">
            <div className="grid grid-cols-6 gap-1.5">
              {COLOR_SWATCHES.map((color) => (
                <button
                  key={color}
                  type="button"
                  onMouseDown={preventFocusLoss}
                  onClick={() => applyColor(color)}
                  className="h-6 w-6 rounded-full border"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <button
              type="button"
              onMouseDown={preventFocusLoss}
              onClick={() => {
                editor.chain().focus().unsetColor().run();
                setColorOpen(false);
              }}
              className="mt-2 w-full text-xs text-muted-foreground hover:text-foreground text-left"
            >
              Reset color
            </button>
          </PopoverContent>
        </Popover>
      )}

      <ToolbarSeparator />

      {config.bulletList && (
        <ToolbarButton
          title="Bullet List"
          isActive={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-3.5 w-3.5" />
        </ToolbarButton>
      )}

      {config.orderedList && (
        <ToolbarButton
          title="Numbered List"
          isActive={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-3.5 w-3.5" />
        </ToolbarButton>
      )}

      {config.blockquote && (
        <ToolbarButton
          title="Quote"
          isActive={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="h-3.5 w-3.5" />
        </ToolbarButton>
      )}

      {config.align && (
        <>
          <ToolbarSeparator />
          <ToolbarButton
            title="Align Left"
            isActive={editor.isActive({ textAlign: "left" })}
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
          >
            <AlignLeft className="h-3.5 w-3.5" />
          </ToolbarButton>
          <ToolbarButton
            title="Align Center"
            isActive={editor.isActive({ textAlign: "center" })}
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
          >
            <AlignCenter className="h-3.5 w-3.5" />
          </ToolbarButton>
          <ToolbarButton
            title="Align Right"
            isActive={editor.isActive({ textAlign: "right" })}
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
          >
            <AlignRight className="h-3.5 w-3.5" />
          </ToolbarButton>
          <ToolbarButton
            title="Justify"
            isActive={editor.isActive({ textAlign: "justify" })}
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          >
            <AlignJustify className="h-3.5 w-3.5" />
          </ToolbarButton>
        </>
      )}

      {config.link && (
        <>
          <ToolbarSeparator />
          <Popover open={linkOpen} onOpenChange={setLinkOpen}>
            <PopoverTrigger asChild>
              <ToolbarButton
                title="Link"
                isActive={editor.isActive("link")}
                onClick={() => {
                  setLinkUrl(editor.getAttributes("link").href || "");
                  setLinkOpen(true);
                }}
              >
                <LinkIcon className="h-3.5 w-3.5" />
              </ToolbarButton>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2">
              <div className="flex items-center gap-1.5">
                <Input
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="h-7 text-xs"
                  onKeyDown={(e) => e.key === "Enter" && applyLink()}
                />
                <Button size="sm" className="h-7 px-2 text-xs" onMouseDown={preventFocusLoss} onClick={applyLink}>
                  Set
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </>
      )}

      {config.image && (
        <>
          <ToolbarSeparator />
          <ToolbarButton title="Insert Image" onClick={pickImage}>
            <ImageIcon className="h-3.5 w-3.5" />
          </ToolbarButton>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
        </>
      )}

      {config.htmlView && (
        <>
          <ToolbarSeparator />
          <ToolbarButton title="Edit HTML" isActive={htmlMode} onClick={onToggleHtml}>
            <Code2 className="h-3.5 w-3.5" />
          </ToolbarButton>
        </>
      )}
    </div>
  );
};

export const RichTextEditor = ({
  variant = RICH_TEXT_VARIANTS.SIMPLE,
  value = "",
  onChange,
  placeholder = "Write something...",
  onImageUpload,
  editable = true,
  className,
}) => {
  const config = VARIANT_CONFIG[variant] || VARIANT_CONFIG.simple;
  const [htmlMode, setHtmlMode] = useState(false);
  const [htmlDraft, setHtmlDraft] = useState("");

  const editor = useEditor({
    extensions: getExtensions(placeholder),
    content: value,
    editable,
    onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "rte-content min-h-[140px] px-3 py-2 focus:outline-none",
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (value !== editor.getHTML() && !editor.isFocused) {
      editor.commands.setContent(value || "", false);
    }
  }, [value, editor]);

  useEffect(() => {
    if (editor) editor.setEditable(editable);
  }, [editable, editor]);

  const toggleHtmlMode = () => {
    if (!htmlMode) {
      setHtmlDraft(editor.getHTML());
      setHtmlMode(true);
    } else {
      editor.commands.setContent(htmlDraft, false);
      onChange?.(editor.getHTML());
      setHtmlMode(false);
    }
  };

  return (
    <div className={cn("rounded-md border bg-white overflow-hidden", className)}>
      {editable && (
        <Toolbar editor={editor} config={config} onImageUpload={onImageUpload} htmlMode={htmlMode} onToggleHtml={toggleHtmlMode} />
      )}
      {htmlMode ? (
        <Textarea
          value={htmlDraft}
          onChange={(e) => setHtmlDraft(e.target.value)}
          className="min-h-[140px] rounded-none border-0 font-mono text-xs focus-visible:ring-0"
        />
      ) : (
        <EditorContent editor={editor} />
      )}
    </div>
  );
};
