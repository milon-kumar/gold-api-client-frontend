import { useState, useRef, useEffect } from "react";
import { DragDropProvider } from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";
import { CollisionPriority } from "@dnd-kit/abstract";
import { move } from "@dnd-kit/helpers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  GripVertical,
  Trash2,
  Plus,
  Save,
  X,
  LayoutGrid,
  Link2,
  Info,
  Phone,
  Share2,
  Type,
  Copy,
  Check,
  Palette,
} from "lucide-react";
import { useApiMutation } from "@/hooks/useAppMutation";
import { toast } from "sonner";
import { getUUId } from "@/lib/helper";

let uid = getUUId();
const newId = (prefix) => `${prefix}-${++uid}-${Date.now()}`;

const COLUMN_TYPES = {
  links: { label: "Link List", icon: Link2 },
  about: { label: "About (Logo + About)", icon: Info },
  contact: { label: "Contact Information", icon: Phone },
  social: { label: "Social Links", icon: Share2 },
  custom_text: { label: "Custom Text", icon: Type },
};

const SOCIAL_KEYS = [
  { key: "facebook_link", label: "Facebook" },
  { key: "youtube_link", label: "YouTube" },
  { key: "instagram_link", label: "Instagram" },
  { key: "linkedin_link", label: "LinkedIn" },
];

/* ------------------------------------------------------------------
   Footer themes — same 6 identities as PageHeroRenderer
   (gradient / editorial / wave / minimal / split / aurora).
   Same data (columns, links, copyright), only the look changes.
------------------------------------------------------------------ */
const FOOTER_THEMES = [
  {
    value: "gradient",
    label: "Gradient",
    hint: "Dark emerald gradient + grid, amber accents",
    swatch: "bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900",
  },
  {
    value: "editorial",
    label: "Editorial",
    hint: "Light, dotted pattern, gold underline",
    swatch: "bg-[#f9fbf9] border border-slate-200",
  },
  {
    value: "wave",
    label: "Wave",
    hint: "Emerald–teal gradient, curved wave top",
    swatch: "bg-gradient-to-br from-emerald-700 to-teal-900",
  },
  {
    value: "minimal",
    label: "Minimal",
    hint: "Quiet, thin borders, understated",
    swatch: "bg-white border border-slate-200",
  },
  {
    value: "split",
    label: "Split",
    hint: "Dark brand panel + light content strip",
    swatch: "bg-gradient-to-r from-slate-900 to-slate-700",
  },
  {
    value: "aurora",
    label: "Aurora",
    hint: "Deep navy, soft aurora glow, premium",
    swatch: "bg-[#0b1120]",
  },
];

const FOOTER_THEME_STYLES = {
  gradient: {
    wrapper:
      "relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-slate-300 p-6",
    heading: "text-white",
    item: "text-emerald-100/70 hover:text-amber-300",
    border: "border-emerald-900/50",
    copyright: "text-slate-500",
  },
  editorial: {
    wrapper:
      "relative rounded-xl bg-[#f9fbf9] text-slate-600 p-6 border border-slate-200",
    heading: "text-slate-900",
    item: "text-slate-500 hover:text-emerald-700",
    border: "border-slate-200",
    copyright: "text-slate-400",
  },
  wave: {
    wrapper:
      "relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-700 to-teal-900 text-emerald-50 p-6 pt-12",
    heading: "text-white",
    item: "text-emerald-100/70 hover:text-amber-300",
    border: "border-emerald-600/40",
    copyright: "text-emerald-200/60",
  },
  minimal: {
    wrapper: "relative rounded-xl bg-white text-slate-500 p-6 border border-slate-100",
    heading: "text-slate-800",
    item: "text-slate-500 hover:text-slate-900",
    border: "border-slate-100",
    copyright: "text-slate-400",
  },
  split: {
    wrapper:
      "relative overflow-hidden rounded-xl bg-slate-900 text-slate-300 p-6",
    heading: "text-white",
    item: "text-slate-400 hover:text-amber-300",
    border: "border-white/10",
    copyright: "text-slate-500",
  },
  aurora: {
    wrapper: "relative overflow-hidden rounded-xl bg-[#0b1120] text-slate-300 p-6",
    heading: "text-white",
    item: "text-slate-400 hover:text-cyan-300",
    border: "border-white/10",
    copyright: "text-slate-500",
  },
};

/* Decorative background layers per theme — purely visual, sit behind content */
const GradientDecor = () => (
  <>
    <div
      className="absolute inset-0 opacity-[0.06]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }}
    />
    <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-400/10 blur-3xl" />
  </>
);

const WaveDecor = () => (
  <svg
    className="absolute inset-x-0 top-0 h-8 w-full"
    viewBox="0 0 400 24"
    preserveAspectRatio="none"
  >
    <path
      d="M0,12 C100,24 300,0 400,12 L400,0 L0,0 Z"
      fill="rgba(255,255,255,0.06)"
    />
  </svg>
);

const AuroraDecor = () => (
  <>
    <div className="absolute -left-16 top-0 h-48 w-48 rounded-full bg-emerald-500/15 blur-3xl" />
    <div className="absolute right-0 -bottom-10 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />
    <div className="absolute right-10 top-6 h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
  </>
);

const THEME_DECOR = {
  gradient: GradientDecor,
  wave: WaveDecor,
  aurora: AuroraDecor,
};

/* ------------------------------------------------------------------
   Theme picker — used in the Footer builder settings section
------------------------------------------------------------------ */
const ThemePicker = ({ value, onChange }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
    {FOOTER_THEMES.map((t) => (
      <button
        type="button"
        key={t.value}
        onClick={() => onChange(t.value)}
        className={`text-left rounded-lg border p-3 transition-colors ${
          value === t.value ? "border-primary bg-primary/5" : "hover:bg-slate-50"
        }`}
      >
        <div className={`h-10 rounded-md mb-2 ${t.swatch}`} />
        <div className="text-xs font-medium flex items-center gap-1.5">
          {t.label}
          {value === t.value && <Check className="w-3 h-3 text-primary" />}
        </div>
        <div className="text-[10px] text-slate-400 mt-0.5">{t.hint}</div>
      </button>
    ))}
  </div>
);

const defaultConfig = (type, setting) => {
  const s = setting?.settings || {};
  const b = setting?.business || {};

  switch (type) {
    case "about":
      return {
        show_logo: true,
        logo: s.footer_logo_full_path || s.logo_full_path || "",
        about_text: s.abouts || s.footer_text || "",
      };
    case "contact":
      return {
        show_email: true,
        show_phone: true,
        show_location: true,
        email: s.email || b.email || "",
        phone: s.phone || b.phone || "",
        location: s.location || b.location || "",
      };
    case "social":
      return SOCIAL_KEYS.reduce(
        (acc, { key }) => ({
          ...acc,
          [key]: { enabled: !!s[key], url: s[key] || "" },
        }),
        {},
      );
    case "custom_text":
      return { text: "" };
    default:
      return {};
  }
};

const emptyFooter = (setting) => ({
  id: null,
  name: "",
  is_active: true,
  copyright_text: setting?.settings?.copyright_text || "",
  meta: {
    theme: "aurora",
  },
});

const SortableLink = ({ link, index, columnId, onRemove }) => {
  const { ref, handleRef, isDragging } = useSortable({
    id: link.id,
    index,
    group: columnId,
    type: "link",
    accept: "link",
  });

  return (
    <div
      ref={ref}
      className={`flex items-center gap-1.5 rounded-md bg-slate-50 border border-slate-100 px-2 py-1.5 ${
        isDragging ? "opacity-40" : ""
      }`}
    >
      <button
        ref={handleRef}
        className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 touch-none"
      >
        <GripVertical className="w-3 h-3" />
      </button>
      <span className="text-xs flex-1 truncate">{link.label}</span>
      <button
        onClick={() => onRemove(columnId, link.id)}
        className="text-slate-400 hover:text-red-500"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
};

const SortableColumn = ({
  column,
  index,
  children,
  onUpdate,
  onRemoveColumn,
}) => {
  const { ref, handleRef, isDropTarget } = useSortable({
    id: column.id,
    index,
    type: "column",
    accept: ["column", "link"],
    collisionPriority: CollisionPriority.Low,
  });

  return (
    <Card ref={ref} className={isDropTarget ? "ring-2 ring-emerald-400" : ""}>
      <CardHeader className="pb-2 space-y-2">
        <div className="flex items-center gap-1">
          <button
            ref={handleRef}
            className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 touch-none shrink-0"
          >
            <GripVertical className="w-4 h-4" />
          </button>
          <Input
            value={column.title}
            onChange={(e) => onUpdate(column.id, { title: e.target.value })}
            className="h-7 text-sm font-semibold border-transparent hover:border-slate-200 focus:border-slate-300 px-1"
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-red-500 shrink-0"
            onClick={() => onRemoveColumn(column.id)}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
        <Select
          value={column.type}
          onValueChange={(v) => onUpdate(column.id, { type: v, reset: true })}
        >
          <SelectTrigger className="h-7 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(COLUMN_TYPES).map(([k, v]) => (
              <SelectItem key={k} value={k} className="text-xs">
                {v.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="space-y-2">{children}</CardContent>
    </Card>
  );
};

const ColumnConfigEditor = ({ column, onUpdateConfig }) => {
  const cfg = column.config || {};
  const set = (patch) => onUpdateConfig(column.id, { ...cfg, ...patch });

  if (column.type === "about") {
    return (
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-xs text-slate-600">
          <Switch
            checked={cfg.show_logo}
            onCheckedChange={(v) => set({ show_logo: v })}
          />
          Show Logo
        </label>
        {cfg.show_logo && (
          <Input
            value={cfg.logo}
            onChange={(e) => set({ logo: e.target.value })}
            placeholder="Logo path"
            className="h-8 text-xs"
          />
        )}
        <Textarea
          value={cfg.about_text}
          onChange={(e) => set({ about_text: e.target.value })}
          placeholder="Brief description..."
          className="text-xs min-h-20"
        />
      </div>
    );
  }

  if (column.type === "contact") {
    return (
      <div className="space-y-2">
        {[
          ["email", "show_email", "Email"],
          ["phone", "show_phone", "Phone"],
          ["location", "show_location", "Location"],
        ].map(([field, toggle, label]) => (
          <div key={field} className="space-y-1">
            <label className="flex items-center gap-2 text-xs text-slate-600">
              <Switch
                checked={cfg[toggle]}
                onCheckedChange={(v) => set({ [toggle]: v })}
              />
              {label}
            </label>
            {cfg[toggle] && (
              <Input
                value={cfg[field]}
                onChange={(e) => set({ [field]: e.target.value })}
                className="h-8 text-xs"
              />
            )}
          </div>
        ))}
      </div>
    );
  }

  if (column.type === "social") {
    return (
      <div className="space-y-2">
        {SOCIAL_KEYS.map(({ key, label }) => (
          <div key={key} className="space-y-1">
            <label className="flex items-center gap-2 text-xs text-slate-600">
              <Switch
                checked={cfg[key]?.enabled}
                onCheckedChange={(v) =>
                  set({ [key]: { ...cfg[key], enabled: v } })
                }
              />
              {label}
            </label>
            {cfg[key]?.enabled && (
              <Input
                value={cfg[key]?.url || ""}
                onChange={(e) =>
                  set({ [key]: { ...cfg[key], url: e.target.value } })
                }
                placeholder="https://..."
                className="h-8 text-xs"
              />
            )}
          </div>
        ))}
      </div>
    );
  }

  if (column.type === "custom_text") {
    return (
      <Textarea
        value={cfg.text}
        onChange={(e) => set({ text: e.target.value })}
        placeholder="Write anything..."
        className="text-xs min-h-28"
      />
    );
  }

  return null;
};

/* ------------------------------------------------------------------
   Themed footer preview — same data, look driven by meta.theme
------------------------------------------------------------------ */
const FooterThemedPreview = ({ columns, links, copyrightText, theme }) => {
  const style = FOOTER_THEME_STYLES[theme] || FOOTER_THEME_STYLES.aurora;
  const Decor = THEME_DECOR[theme];
  const isSplit = theme === "split";

  return (
    <div className={style.wrapper}>
      {Decor && <Decor />}
      <div className="relative z-10">
        <div
          className="grid gap-6 text-sm"
          style={{
            gridTemplateColumns: `repeat(${Math.max(columns.length, 1)}, minmax(0, 1fr))`,
          }}
        >
          {columns.map((col, idx) => (
            <div
              key={col.id}
              className={
                isSplit && idx === 0
                  ? "rounded-lg border border-emerald-400/20 bg-emerald-500/10 p-4"
                  : ""
              }
            >
              <h4
                className={`${style.heading} font-semibold text-xs mb-2 uppercase tracking-wide`}
              >
                {col.title}
              </h4>
              {col.type === "links" && (
                <ul className="space-y-1.5">
                  {(links[col.id] || []).map((it) => (
                    <li
                      key={it.id}
                      className={`text-xs cursor-pointer transition-colors ${style.item}`}
                    >
                      {it.label}
                    </li>
                  ))}
                </ul>
              )}
              {col.type === "about" && (
                <div className="space-y-2">
                  {col.config?.show_logo && col.config?.logo && (
                    <img
                      src={col.config.logo}
                      alt="logo"
                      className="h-10"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  )}
                  <p className={`text-xs ${style.item}`}>{col.config?.about_text}</p>
                </div>
              )}
              {col.type === "contact" && (
                <ul className={`space-y-1.5 text-xs ${style.item}`}>
                  {col.config?.show_email && <li>✉ {col.config.email}</li>}
                  {col.config?.show_phone && <li>☎ {col.config.phone}</li>}
                  {col.config?.show_location && <li>⚲ {col.config.location}</li>}
                </ul>
              )}
              {col.type === "social" && (
                <ul className="space-y-1.5 text-xs">
                  {SOCIAL_KEYS.filter(({ key }) => col.config?.[key]?.enabled).map(
                    ({ key, label }) => (
                      <li key={key} className={`cursor-pointer transition-colors ${style.item}`}>
                        {label}
                      </li>
                    ),
                  )}
                </ul>
              )}
              {col.type === "custom_text" && (
                <p className={`text-xs whitespace-pre-line ${style.item}`}>
                  {col.config?.text}
                </p>
              )}
            </div>
          ))}
        </div>
        <div
          className={`border-t ${style.border} mt-5 pt-3 text-[11px] text-center ${style.copyright}`}
        >
          {copyrightText}
        </div>
      </div>
    </div>
  );
};

export const FooterBuilder = ({ allActivePages = [], setting }) => {
  const [footers, setFooters] = useState([]);
  const [current, setCurrent] = useState(emptyFooter(setting));
  const [columns, setColumns] = useState([]);
  const [links, setLinks] = useState({});
  const snapshot = useRef(null);
  const [copiedId, setCopiedId] = useState(null);
  const [linkModal, setLinkModal] = useState({
    open: false,
    colId: null,
    label: "",
    url: "",
    target: "_blank",
  });

  const { mutate: fetchFooters } = useApiMutation({
    url: "/admin/footers/list",
    method: "GET",
  });
  const { mutate: saveFooter, isLoading: saving } = useApiMutation({
    url: "/admin/footers/save",
  });
  const { mutate: deleteFooter } = useApiMutation({
    url: "/admin/footers/delete",
  });

  useEffect(() => {
    loadFooters();
  }, []);

  const loadFooters = async () => {
    const res = await fetchFooters();
    if (res?.success) setFooters(res.data);
  };

  const selectFooter = (f) => {
    setCurrent({
      id: f.id,
      name: f.name,
      is_active: !!f.is_active,
      copyright_text: f.copyright_text || "",
      meta: {
        ...emptyFooter(setting).meta,
        ...(f.meta || {}),
      },
    });
    const cols = (f.columns || []).map((c) => ({
      id: `col-${c.id}`,
      title: c.title,
      type: c.type,
      config: c.config || {},
    }));
    setColumns(cols);
    const linkRecord = {};
    (f.columns || []).forEach((c) => {
      linkRecord[`col-${c.id}`] = (c.links || []).map((l) => ({
        id: `l-${l.id}`,
        page_id: l.page_id,
        label: l.label,
        url: l.url,
        target: l.target,
      }));
    });
    setLinks(linkRecord);
  };

  const startNew = () => {
    setCurrent(emptyFooter(setting));
    setColumns([]);
    setLinks({});
  };

  const addColumn = () => {
    if (columns.length >= 5) return;
    const id = newId("col");
    setColumns([
      ...columns,
      { id, title: "New Column", type: "links", config: {} },
    ]);
    setLinks((l) => ({ ...l, [id]: [] }));
  };

  const removeColumn = (id) => {
    setColumns((c) => c.filter((col) => col.id !== id));
    setLinks((l) => {
      const next = { ...l };
      delete next[id];
      return next;
    });
  };

  const updateColumn = (id, patch) => {
    setColumns((cols) =>
      cols.map((col) => {
        if (col.id !== id) return col;
        if (patch.reset) {
          return {
            ...col,
            type: patch.type,
            config: defaultConfig(patch.type, setting),
          };
        }
        return { ...col, ...patch };
      }),
    );
  };

  const updateConfig = (id, config) =>
    setColumns((cols) =>
      cols.map((col) => (col.id === id ? { ...col, config } : col)),
    );

  const updateMeta = (patch) =>
    setCurrent((c) => ({ ...c, meta: { ...c.meta, ...patch } }));

  const addLinkFromPage = (colId, pageId) => {
    const page = allActivePages.find((p) => p.id === Number(pageId));
    if (!page) return;
    setLinks((l) => ({
      ...l,
      [colId]: [
        ...(l[colId] || []),
        {
          id: newId("l"),
          page_id: page.id,
          label: page.page_title,
          url: page.custom_link || page.page_slug,
          target: "_self",
        },
      ],
    }));
  };

  const addCustomLink = (colId) => {
    setLinkModal({
      open: true,
      colId,
      label: "",
      url: "",
      target: "_blank",
    });
  };

  const saveCustomLink = () => {
    if (!linkModal.label || !linkModal.url) return;

    setLinks((prev) => ({
      ...prev,
      [linkModal.colId]: [
        ...(prev[linkModal.colId] || []),
        {
          id: newId("l"),
          page_id: null,
          label: linkModal.label,
          url: linkModal.url,
          target: linkModal.target,
        },
      ],
    }));

    setLinkModal({
      open: false,
      colId: null,
      label: "",
      url: "",
      target: "_blank",
    });
  };

  const removeLink = (colId, linkId) =>
    setLinks((l) => ({
      ...l,
      [colId]: l[colId].filter((it) => it.id !== linkId),
    }));

  const save = async () => {
    if (!current.name.trim()) {
      toast.error("Please provide a name for the footer.");
      return;
    }
    const payload = {
      id: current.id,
      name: current.name,
      is_active: current.is_active,
      copyright_text: current.copyright_text,
      meta: current.meta,
      columns: columns.map((col, ci) => ({
        title: col.title,
        type: col.type,
        config: col.type === "links" ? null : col.config,
        sort_order: ci,
        links:
          col.type === "links"
            ? (links[col.id] || []).map((l, li) => ({
                page_id: l.page_id ?? null,
                label: l.label,
                url: l.url,
                target: l.target || "_self",
                sort_order: li,
              }))
            : [],
      })),
    };

    const res = await saveFooter(payload);
    if (res?.success) {
      toast.success(res.message || "Footer saved successfully.");
      loadFooters();
      if (!current.id && res.data?.id) {
        setCurrent((c) => ({ ...c, id: res.data.id }));
      }
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this footer?")) return;
    const res = await deleteFooter({ id });
    if (res?.success) {
      toast.success("Footer deleted successfully.");
      if (current.id === id) startNew();
      loadFooters();
    }
  };

  const handleCopyId = async (id) => {
    const text = String(id);

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";

        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();

        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      setCopiedId(id);
      if (copiedId) {
        toast.success("Copied successfully.");
      }
      setTimeout(() => {
        setCopiedId(null);
      }, 1500);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-sm flex items-center gap-2">
              <LayoutGrid className="w-4 h-4" /> Your Footers
            </CardTitle>
            <CardDescription className="text-xs">
              Select one to edit, or create a new configuration
            </CardDescription>
          </div>
          <Button size="sm" variant="outline" onClick={startNew}>
            <Plus className="w-4 h-4 mr-1" /> New Footer
          </Button>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {footers.length === 0 && (
            <p className="text-xs text-slate-400">No footers saved yet.</p>
          )}
          {footers.map((f) => (
            <div
              key={f.id}
              className={`flex items-center gap-2 rounded-md border px-2 py-1 text-sm cursor-pointer ${
                current.id === f.id
                  ? "border-primary bg-primary/5"
                  : "hover:bg-slate-50"
              }`}
              onClick={() => selectFooter(f)}
            >
              <span className="font-medium">{f.name}</span>

              {!!f.is_active && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              )}

              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 ml-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopyId(f.id);
                }}
              >
                {copiedId === f.id ? (
                  <Check className="h-3.5 w-3.5 text-green-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-red-500 hover:text-red-600"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(f.id);
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4 flex flex-wrap items-end gap-4">
          <div className="space-y-1 flex-1 min-w-52">
            <Label className="text-xs">Footer Name</Label>
            <Input
              value={current.name}
              onChange={(e) =>
                setCurrent((c) => ({ ...c, name: e.target.value }))
              }
              placeholder="e.g., Main Footer"
              className="h-9"
            />
          </div>
          <label className="flex items-center gap-2 text-sm pb-1.5">
            <Switch
              checked={current.is_active}
              onCheckedChange={(v) =>
                setCurrent((c) => ({ ...c, is_active: v }))
              }
            />
            Active
          </label>
          <Button
            size="sm"
            variant="outline"
            onClick={addColumn}
            disabled={columns.length >= 5}
          >
            <Plus className="w-4 h-4 mr-1" /> Add Column ({columns.length}/5)
          </Button>
          <Button onClick={save} disabled={saving}>
            <Save className="w-4 h-4 mr-1" />
            {saving ? "Saving..." : "Save Footer"}
          </Button>
        </CardContent>
      </Card>

      {/* -------- Theme -------- */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Palette className="w-4 h-4" /> Footer theme
          </CardTitle>
          <CardDescription className="text-xs">
            Same columns, links and copyright — pick how the footer should look.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ThemePicker
            value={current.meta?.theme}
            onChange={(v) => updateMeta({ theme: v })}
          />
        </CardContent>
      </Card>

      <DragDropProvider
        onDragStart={() => {
          snapshot.current = {
            links: structuredClone(links),
            columns: [...columns],
          };
        }}
        onDragOver={(event) => {
          const { source } = event.operation;
          if (source?.type === "column") return;
          setLinks((items) => move(items, event));
        }}
        onDragEnd={(event) => {
          if (event.canceled) {
            if (snapshot.current) {
              setLinks(snapshot.current.links);
              setColumns(snapshot.current.columns);
            }
            return;
          }
          const { source } = event.operation;
          if (source?.type === "column") {
            setColumns((cols) => move(cols, event));
          }
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
          {columns.map((col, index) => (
            <SortableColumn
              key={col.id}
              column={col}
              index={index}
              onUpdate={updateColumn}
              onRemoveColumn={removeColumn}
            >
              {col.type === "links" ? (
                <>
                  <div className="space-y-1 min-h-[40px]">
                    {(links[col.id] || []).map((link, i) => (
                      <SortableLink
                        key={link.id}
                        link={link}
                        index={i}
                        columnId={col.id}
                        onRemove={removeLink}
                      />
                    ))}
                    {(links[col.id] || []).length === 0 && (
                      <p className="text-[11px] text-slate-400 text-center py-2 border border-dashed rounded-md">
                        Drag links here
                      </p>
                    )}
                  </div>
                  <select
                    className="w-full h-8 rounded-md border border-slate-200 text-xs px-2 bg-white text-slate-600"
                    value=""
                    onChange={(e) => addLinkFromPage(col.id, e.target.value)}
                  >
                    <option value="" disabled>
                      + Add link from page
                    </option>
                    {allActivePages.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.page_title} ({p.page_type})
                      </option>
                    ))}
                  </select>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-full h-7 text-xs text-slate-500"
                    onClick={() => addCustomLink(col.id)}
                  >
                    <Plus className="w-3 h-3 mr-1" /> Custom Link
                  </Button>
                </>
              ) : (
                <ColumnConfigEditor
                  column={col}
                  onUpdateConfig={updateConfig}
                />
              )}
            </SortableColumn>
          ))}
        </div>
      </DragDropProvider>

      {columns.length === 0 && (
        <div className="text-center text-sm text-slate-400 py-10 border border-dashed rounded-lg">
          Click "Add Column" to start building your footer (maximum 5 columns)
        </div>
      )}

      <Card>
        <CardContent className="pt-4">
          <div className="space-y-1 max-w-md">
            <Label className="text-xs">Copyright Text</Label>
            <Input
              value={current.copyright_text}
              onChange={(e) =>
                setCurrent((c) => ({ ...c, copyright_text: e.target.value }))
              }
              className="h-8 text-sm"
            />
          </div>
        </CardContent>
      </Card>

      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-slate-400">Preview</p>
          <span className="text-[10px] rounded-full border px-2 py-0.5 capitalize text-slate-400">
            {current.meta?.theme || "aurora"}
          </span>
        </div>
        <FooterThemedPreview
          columns={columns}
          links={links}
          copyrightText={current.copyright_text}
          theme={current.meta?.theme || "aurora"}
        />
      </div>

      {linkModal.open && (
        <Dialog
          open={linkModal.open}
          onOpenChange={(open) => setLinkModal((prev) => ({ ...prev, open }))}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Custom Link</DialogTitle>
              <DialogDescription>
                Create a new custom footer link.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label>Label</Label>
                <Input
                  value={linkModal.label}
                  onChange={(e) =>
                    setLinkModal((prev) => ({
                      ...prev,
                      label: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <Label>URL</Label>
                <Input
                  placeholder="https://example.com"
                  value={linkModal.url}
                  onChange={(e) =>
                    setLinkModal((prev) => ({
                      ...prev,
                      url: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <Label>Target</Label>
                <Select
                  value={linkModal.target}
                  onValueChange={(value) =>
                    setLinkModal((prev) => ({
                      ...prev,
                      target: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="_self">Same Tab</SelectItem>
                    <SelectItem value="_blank">New Tab</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() =>
                  setLinkModal((prev) => ({ ...prev, open: false }))
                }
              >
                Cancel
              </Button>

              <Button onClick={saveCustomLink}>Save Link</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};