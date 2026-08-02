import { useState, useEffect } from "react";
import { DragDropProvider } from "@dnd-kit/react";
import { useSortable, isSortable } from "@dnd-kit/react/sortable";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GripVertical,
  ChevronRight,
  ChevronLeft,
  Pencil,
  Trash2,
  Plus,
  Link2,
  FileText,
  ExternalLink,
  Save,
  Image as ImageIcon,
  LayoutPanelTop,
  MousePointerClick,
  Copy,
  Check,
  Settings2,
  ChevronDown,
} from "lucide-react";
import { useApiMutation } from "@/hooks/useAppMutation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
/* ------------------------------------------------------------------
   Helper
------------------------------------------------------------------ */
let uid = 1000;
const newId = (prefix) => `${prefix}-${++uid}-${Date.now()}`;

const TypeBadge = ({ type }) => (
  <span className="text-[10px] capitalize rounded-full border px-2 py-0">
    {type}
  </span>
);

/* ------------------------------------------------------------------
   Navbar variants — same data, 5 different looks
------------------------------------------------------------------ */
const NAVBAR_VARIANTS = [
  {
    value: "simple",
    label: "Simple",
    hint: "Logo left · links left · buttons right",
  },
  {
    value: "centered",
    label: "Centered",
    hint: "Logo centered on top, links centered below",
  },
  {
    value: "split",
    label: "Split",
    hint: "Links split around a centered logo, pill buttons",
  },
  {
    value: "minimal",
    label: "Minimal",
    hint: "Slim, borderless, understated links",
  },
  {
    value: "bold",
    label: "Bold",
    hint: "Dark background, high-contrast CTA",
  },
];

const buttonVariantClass = (variant, tone = "light") => {
  const base = "text-xs font-medium rounded-md px-3 py-1.5 transition-colors";
  if (variant === "primary") {
    return tone === "dark"
      ? `${base} bg-white text-slate-900 hover:bg-slate-100`
      : `${base} bg-primary text-primary-foreground hover:opacity-90`;
  }
  if (variant === "outline") {
    return tone === "dark"
      ? `${base} border border-white/30 text-white hover:bg-white/10`
      : `${base} border border-slate-300 text-slate-700 hover:bg-slate-50`;
  }
  // ghost
  return tone === "dark"
    ? `${base} text-white/80 hover:text-white`
    : `${base} text-slate-600 hover:text-slate-900`;
};

const LogoBlock = ({ left, tone = "light", size = "h-8" }) => (
  <div className="flex items-center gap-2 shrink-0">
    {left.logo_type !== "text" && left.logo_url ? (
      <img
        src={left.logo_url}
        alt="logo"
        className={`${size} w-auto object-contain`}
        onError={(e) => (e.currentTarget.style.display = "none")}
      />
    ) : left.logo_type !== "text" ? (
      <div
        className={`${size} aspect-square rounded-md flex items-center justify-center text-[10px] ${
          tone === "dark" ? "bg-white/10 text-white/50" : "bg-slate-100 text-slate-400"
        }`}
      >
        LOGO
      </div>
    ) : null}
    {left.logo_type !== "image" && (
      <span
        className={`font-semibold text-sm ${
          tone === "dark" ? "text-white" : "text-slate-900"
        }`}
      >
        {left.logo_text || "Site name"}
      </span>
    )}
  </div>
);

const MiddleLinks = ({ items, tone = "light", justify = "start" }) => {
  const parents = items.filter((it) => it.depth === 0);
  const childrenOf = (id) =>
    items.filter(
      (it, i) => it.depth === 1 && items.indexOf(it) > items.indexOf(id),
    );

  // group flat depth list into parent + its following depth-1 children
  const groups = [];
  items.forEach((it) => {
    if (it.depth === 0) groups.push({ parent: it, children: [] });
    else if (groups.length) groups[groups.length - 1].children.push(it);
  });

  return (
    <div
      className={`flex items-center gap-5 flex-wrap ${
        justify === "center" ? "justify-center" : "justify-start"
      }`}
    >
      {groups.map(({ parent, children }) => (
        <div key={parent.id} className="relative group/nav">
          <button
            type="button"
            className={`flex items-center gap-1 text-sm ${
              tone === "dark"
                ? "text-white/85 hover:text-white"
                : "text-slate-700 hover:text-slate-950"
            }`}
          >
            {parent.label}
            {children.length > 0 && <ChevronDown className="w-3 h-3 opacity-60" />}
          </button>
          {children.length > 0 && (
            <div
              className={`invisible group-hover/nav:visible opacity-0 group-hover/nav:opacity-100 transition-opacity absolute left-0 top-full mt-2 min-w-[160px] rounded-lg border shadow-lg py-1 z-10 ${
                tone === "dark"
                  ? "bg-slate-800 border-white/10"
                  : "bg-white border-slate-200"
              }`}
            >
              {children.map((c) => (
                <div
                  key={c.id}
                  className={`px-3 py-1.5 text-xs ${
                    tone === "dark"
                      ? "text-white/80 hover:bg-white/5"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {c.label}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      {groups.length === 0 && (
        <span
          className={`text-xs ${
            tone === "dark" ? "text-white/30" : "text-slate-300"
          }`}
        >
          No menu links yet
        </span>
      )}
    </div>
  );
};

const RightButtons = ({ items, tone = "light" }) => (
  <div className="flex items-center gap-2 shrink-0">
    {items.map((b) => (
      <span key={b.id} className={buttonVariantClass(b.variant, tone)}>
        {b.label}
      </span>
    ))}
  </div>
);

/* -------- Individual variant layouts (same data, different design) -------- */
function VariantSimple({ left, middle, right, sticky }) {
  return (
    <div className="rounded-lg border bg-white overflow-hidden">
      <div
        className={`flex items-center justify-between px-5 py-3 border-b ${
          sticky ? "ring-1 ring-primary/20" : ""
        }`}
      >
        <div className="flex items-center gap-8">
          <LogoBlock left={left} />
          <MiddleLinks items={middle} />
        </div>
        <RightButtons items={right} />
      </div>
    </div>
  );
}

function VariantCentered({ left, middle, right, sticky }) {
  return (
    <div className="rounded-lg border bg-white overflow-hidden">
      <div className={`flex flex-col items-center gap-2 px-5 py-3 ${sticky ? "ring-1 ring-primary/20" : ""}`}>
        <div className="w-full flex items-center justify-between">
          <div className="w-24" />
          <LogoBlock left={left} />
          <RightButtons items={right} />
        </div>
        <div className="border-t w-full pt-2">
          <MiddleLinks items={middle} justify="center" />
        </div>
      </div>
    </div>
  );
}

function VariantSplit({ left, middle, right, sticky }) {
  const half = Math.ceil(middle.filter((m) => m.depth === 0).length / 2);
  const groups = [];
  middle.forEach((it) => {
    if (it.depth === 0) groups.push({ parent: it, children: [] });
    else if (groups.length) groups[groups.length - 1].children.push(it);
  });
  const leftGroup = groups.slice(0, half);
  const rightGroup = groups.slice(half);
  const flat = (g) => g.flatMap((x) => [x.parent, ...x.children]);

  return (
    <div className={`rounded-full border bg-white overflow-hidden px-2 ${sticky ? "ring-1 ring-primary/20" : ""}`}>
      <div className="flex items-center justify-between px-4 py-2.5 gap-4">
        <MiddleLinks items={flat(leftGroup)} />
        <LogoBlock left={left} size="h-7" />
        <div className="flex items-center gap-4">
          <MiddleLinks items={flat(rightGroup)} />
          <RightButtons items={right} />
        </div>
      </div>
    </div>
  );
}

function VariantMinimal({ left, middle, right, sticky }) {
  return (
    <div className={`bg-white overflow-hidden ${sticky ? "ring-1 ring-primary/10" : ""}`}>
      <div className="flex items-center justify-between px-1 py-3">
        <LogoBlock left={left} size="h-6" />
        <MiddleLinks items={middle} />
        <div className="flex items-center gap-4">
          {right.map((b) => (
            <span key={b.id} className="text-xs text-slate-600 hover:text-slate-900">
              {b.label}
            </span>
          ))}
        </div>
      </div>
      <div className="h-px bg-slate-100" />
    </div>
  );
}

function VariantBold({ left, middle, right, sticky }) {
  return (
    <div
      className={`rounded-lg overflow-hidden bg-slate-900 ${
        sticky ? "ring-1 ring-white/20" : ""
      }`}
    >
      <div className="flex items-center justify-between px-5 py-3.5">
        <div className="flex items-center gap-8">
          <LogoBlock left={left} tone="dark" />
          <MiddleLinks items={middle} tone="dark" />
        </div>
        <RightButtons items={right} tone="dark" />
      </div>
    </div>
  );
}

const VARIANT_COMPONENTS = {
  simple: VariantSimple,
  centered: VariantCentered,
  split: VariantSplit,
  minimal: VariantMinimal,
  bold: VariantBold,
};

/* ------------------------------------------------------------------
   Live preview wrapper — picks the right variant component
------------------------------------------------------------------ */
function NavbarPreview({ left, middle, right, meta }) {
  const Variant = VARIANT_COMPONENTS[meta.navbarVarients] || VariantSimple;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500">Live preview</span>
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
          {meta.navbarSticky && (
            <span className="rounded-full border px-2 py-0.5">Sticky</span>
          )}
          <span className="rounded-full border px-2 py-0.5 capitalize">
            {meta.navbarVarients}
          </span>
        </div>
      </div>
      <Variant left={left} middle={middle} right={right} sticky={meta.navbarSticky} />
    </div>
  );
}

/* ------------------------------------------------------------------
   Variant picker — small thumbnails to choose from, 5 options
------------------------------------------------------------------ */
function VariantPicker({ value, onChange }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
      {NAVBAR_VARIANTS.map((v) => (
        <button
          type="button"
          key={v.value}
          onClick={() => onChange(v.value)}
          className={`text-left rounded-lg border p-3 transition-colors ${
            value === v.value
              ? "border-primary bg-primary/5"
              : "hover:bg-slate-50"
          }`}
        >
          <div
            className={`h-10 rounded-md mb-2 flex items-center px-2 gap-1 ${
              v.value === "bold" ? "bg-slate-900" : "bg-slate-100"
            } ${v.value === "split" ? "rounded-full" : "rounded-md"}`}
          >
            <span
              className={`w-4 h-4 rounded-sm ${
                v.value === "bold" ? "bg-white/30" : "bg-slate-300"
              }`}
            />
            <span
              className={`flex-1 flex gap-1 ${
                v.value === "centered" ? "justify-center" : "justify-start"
              }`}
            >
              <span className={`h-1.5 w-4 rounded-full ${v.value === "bold" ? "bg-white/20" : "bg-slate-300"}`} />
              <span className={`h-1.5 w-4 rounded-full ${v.value === "bold" ? "bg-white/20" : "bg-slate-300"}`} />
            </span>
          </div>
          <div className="text-xs font-medium flex items-center gap-1.5">
            {v.label}
            {value === v.value && <Check className="w-3 h-3 text-primary" />}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">{v.hint}</div>
        </button>
      ))}
    </div>
  );
}

const emptyNavbar = () => ({
  id: null, // null means new navbar (will be created in backend)
  name: "",
  is_active: true,
  left: {
    logo_type: "image", // image | text | both
    logo_url: "",
    logo_text: "",
    link: "/",
    height: 40,
  },
  middle: [], // [{ id, page_id, label, type, url, depth, newTab }]
  right: [], // [{ id, label, url, variant, newTab }]
  meta: {
    navbarSticky: true,
    navbarVarients: "simple",
  },
});

/* ==================================================================
   Sortable Item — Middle (Links + Dropdown)
   depth = 0 → main link, depth = 1 → dropdown item
================================================================== */
function SortableMenuItem({
  item,
  index,
  onIndent,
  onEdit,
  onRemove,
  editing,
  onUpdate,
  onCloseEdit,
}) {
  const { ref, handleRef, isDragging } = useSortable({ id: item.id, index });

  return (
    <div
      ref={ref}
      style={{ marginLeft: item.depth * 32 }}
      className={isDragging ? "opacity-40" : ""}
    >
      <div
        className={`flex items-center gap-2 rounded-lg border bg-white px-2 py-1.5 ${
          item.depth ? "bg-slate-50" : ""
        }`}
      >
        <button
          ref={handleRef}
          className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 touch-none"
          aria-label="Drag to reorder"
        >
          <GripVertical className="w-4 h-4" />
        </button>
        {item.depth > 0 && <span className="text-slate-300 text-xs">└</span>}
        <span className="text-sm font-medium flex-1 truncate">
          {item.label}
        </span>
        <TypeBadge type={item.type} />
        {item.newTab && <ExternalLink className="w-3 h-3 text-slate-400" />}
        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            title="Remove from dropdown"
            onClick={() => onIndent(index, -1)}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            title="Make dropdown item"
            onClick={() => onIndent(index, 1)}
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onEdit(item.id)}
          >
            <Pencil className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-red-500 hover:text-red-600"
            onClick={() => onRemove(item.id)}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {editing && (
        <div className="mt-1.5 ml-6 rounded-lg border bg-slate-50 p-3 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Label</Label>
              <Input
                value={item.label}
                onChange={(e) => onUpdate(item.id, { label: e.target.value })}
                className="h-8 text-sm bg-white"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">URL</Label>
              <Input
                value={item.url}
                onChange={(e) => onUpdate(item.id, { url: e.target.value })}
                className="h-8 text-sm bg-white"
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs text-slate-600">
              <Switch
                checked={item.newTab}
                onCheckedChange={(v) => onUpdate(item.id, { newTab: v })}
              />
              Open in new tab
            </label>
            <Button size="sm" variant="secondary" onClick={onCloseEdit}>
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==================================================================
   Sortable Item — Right (Buttons: Login / Join, etc.)
   */
function SortableButtonItem({ item, index, onUpdate, onRemove }) {
  const { ref, handleRef, isDragging } = useSortable({ id: item.id, index });

  return (
    <div
      ref={ref}
      className={`rounded-lg border bg-white p-3 space-y-2 ${
        isDragging ? "opacity-40" : ""
      }`}
    >
      <div className="flex items-center gap-2">
        <button
          ref={handleRef}
          className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 touch-none"
        >
          <GripVertical className="w-4 h-4" />
        </button>
        <span className="text-sm font-medium flex-1">{item.label}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-red-500"
          onClick={() => onRemove(item.id)}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label className="text-xs">Label</Label>
          <Input
            value={item.label}
            onChange={(e) => onUpdate(item.id, { label: e.target.value })}
            className="h-8 text-sm"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">URL</Label>
          <Input
            value={item.url}
            onChange={(e) => onUpdate(item.id, { url: e.target.value })}
            className="h-8 text-sm"
            placeholder="/login"
          />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Label className="text-xs">Style</Label>
          <Select
            value={item.variant}
            onValueChange={(v) => onUpdate(item.id, { variant: v })}
          >
            <SelectTrigger className="h-8 w-28 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="primary">Primary</SelectItem>
              <SelectItem value="outline">Outline</SelectItem>
              <SelectItem value="ghost">Ghost / Link</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <label className="flex items-center gap-2 text-xs text-slate-600">
          <Switch
            checked={item.newTab}
            onCheckedChange={(v) => onUpdate(item.id, { newTab: v })}
          />
          New tab
        </label>
      </div>
    </div>
  );
}

/* ==================================================================
   Main Builder
================================================================== */
export const HeaderMenuBuilder = ({ allActivePages = [] }) => {
  const [navbars, setNavbars] = useState([]); // All saved navbars list
  const [current, setCurrent] = useState(emptyNavbar()); // Currently being edited
  const [searchTerm, setSearchTerm] = useState("");
  const [checked, setChecked] = useState([]);
  const [customLabel, setCustomLabel] = useState("");
  const [customUrl, setCustomUrl] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  /* ---------------- API hooks ---------------- */
  const { mutate: fetchNavbars } = useApiMutation({
    url: "/admin/navbars/list",
    method: "GET",
  });

  const { mutate: saveNavbar, isLoading: saving } = useApiMutation({
    url: "/admin/navbars/save",
  });

  const { mutate: deleteNavbar } = useApiMutation({
    url: "/admin/navbars/delete",
  });

  useEffect(() => {
    loadNavbars();
  }, []);

  const loadNavbars = async () => {
    const res = await fetchNavbars();
    if (res?.success) setNavbars(res.data);
  };

  /* -------- Backend navbar → builder state -------- */
  const selectNavbar = (nb) => {
    setEditingId(null);
    setCurrent({
      id: nb.id,
      name: nb.name,
      is_active: !!nb.is_active,
      left: nb.left_config || emptyNavbar().left,
      // Convert nested items (parent → children) to flat + depth
      middle: (nb.items || []).flatMap((it) => [
        {
          id: `m-${it.id}`,
          page_id: it.page_id,
          label: it.label,
          type: it.type,
          url: it.url,
          depth: 0,
          newTab: it.target === "_blank",
        },
        ...(it.children || []).map((c) => ({
          id: `m-${c.id}`,
          page_id: c.page_id,
          label: c.label,
          type: c.type,
          url: c.url,
          depth: 1,
          newTab: c.target === "_blank",
        })),
      ]),
      right: (nb.right_config || []).map((b, i) => ({
        id: newId("b"),
        ...b,
      })),
      meta: {
        ...emptyNavbar().meta,
        ...(nb.meta || {}),
      },
    });
  };

  /* ---------------- Middle section helpers ---------------- */
  const filteredActivePages = allActivePages.filter((p) =>
    p.page_title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const addPages = () => {
    const items = allActivePages
      .filter((p) => checked.includes(p.id))
      .map((p) => ({
        id: newId("m"),
        page_id: p.id,
        label: p.page_title,
        type: p.page_type,
        url: p.custom_link || p.page_slug,
        depth: 0,
        newTab: p.page_type === "link",
      }));
    setCurrent((c) => ({ ...c, middle: [...c.middle, ...items] }));
    setChecked([]);
  };

  const addCustom = () => {
    if (!customLabel || !customUrl) return;
    setCurrent((c) => ({
      ...c,
      middle: [
        ...c.middle,
        {
          id: newId("m"),
          page_id: null,
          label: customLabel,
          type: "external",
          url: customUrl,
          depth: 0,
          newTab: true,
        },
      ],
    }));
    setCustomLabel("");
    setCustomUrl("");
  };

  const indent = (i, dir) => {
    setCurrent((c) => {
      const items = c.middle;
      const d = items[i].depth + dir;
      if (d < 0 || d > 1 || (d === 1 && i === 0)) return c;
      const next = [...items];
      next[i] = { ...next[i], depth: d };
      return { ...c, middle: next };
    });
  };

  const updateMiddle = (id, patch) =>
    setCurrent((c) => ({
      ...c,
      middle: c.middle.map((it) => (it.id === id ? { ...it, ...patch } : it)),
    }));

  const removeMiddle = (id) =>
    setCurrent((c) => ({
      ...c,
      middle: c.middle.filter((it) => it.id !== id),
    }));

  /* ---------------- Right section helpers ---------------- */
  const addButton = () =>
    setCurrent((c) => ({
      ...c,
      right: [
        ...c.right,
        {
          id: newId("b"),
          label: "Login",
          url: "/login",
          variant: "outline",
          newTab: false,
        },
      ],
    }));

  const updateRight = (id, patch) =>
    setCurrent((c) => ({
      ...c,
      right: c.right.map((it) => (it.id === id ? { ...it, ...patch } : it)),
    }));

  const removeRight = (id) =>
    setCurrent((c) => ({ ...c, right: c.right.filter((it) => it.id !== id) }));

  /* ---------------- Meta / settings helpers ---------------- */
  const updateMeta = (patch) =>
    setCurrent((c) => ({ ...c, meta: { ...c.meta, ...patch } }));

  /* -------- Drag end (same logic for both lists) -------- */
  const makeDragEnd = (key) => (event) => {
    if (event.canceled) return;
    const { source } = event.operation;
    if (isSortable(source)) {
      const { initialIndex, index } = source;
      if (initialIndex !== index) {
        setCurrent((c) => {
          const next = [...c[key]];
          const [moved] = next.splice(initialIndex, 1);
          next.splice(index, 0, moved);
          return { ...c, [key]: next };
        });
      }
    }
  };

  /* ---------------- Save ---------------- */
  const save = async () => {
    if (!current.name.trim()) {
      toast.error("Give the navbar a name.");
      return;
    }
    const payload = {
      id: current.id,
      name: current.name,
      is_active: current.is_active,
      left: current.left,
      // Send flat list with depth — backend will create parent_id
      middle: current.middle.map((it, i) => ({
        page_id: it.page_id ?? null,
        label: it.label,
        type: it.type,
        url: it.url,
        depth: it.depth,
        target: it.newTab ? "_blank" : "_self",
        sort_order: i,
      })),
      right: current.right.map(({ id, ...b }, i) => ({
        ...b,
        sort_order: i,
      })),
      meta: current.meta,
    };

    const res = await saveNavbar(payload);
    if (res?.success) {
      toast.success(res.message || "Navbar saved.");
      loadNavbars();
      if (!current.id && res.data?.id) {
        setCurrent((c) => ({ ...c, id: res.data.id }));
      }
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Do you want to delete this navbar?")) return;
    const res = await deleteNavbar({ id });
    if (res?.success) {
      toast.success("Navbar deleted.");
      if (current.id === id) setCurrent(emptyNavbar());
      loadNavbars();
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
      if(copiedId){
        toast.success("Copied successfully.");
      }
      setTimeout(() => {
        setCopiedId(null);
      }, 1500);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  /* ================================================================
     UI
  ================================================================ */
  return (
    <div className="space-y-6">
      {/* -------- Navbar list + create new -------- */}
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-sm flex items-center gap-2">
              <LayoutPanelTop className="w-4 h-4" /> Navbars
            </CardTitle>
            <CardDescription className="text-xs">
              Select one and edit it, or create a new one.
            </CardDescription>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCurrent(emptyNavbar())}
          >
            <Plus className="w-4 h-4 mr-1" /> Create Navbar
          </Button>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {navbars.length === 0 && (
            <p className="text-xs text-slate-400">
              No navbar has been saved yet.
            </p>
          )}
          {navbars.map((nb) => (
            <div
              key={nb.id}
              className={`flex items-center gap-2 rounded-md border px-2 py-1 text-sm cursor-pointer ${
                current.id === nb.id
                  ? "border-primary bg-primary/5"
                  : "hover:bg-slate-50"
              }`}
              onClick={() => selectNavbar(nb)}
            >
              <span className="font-medium">{nb.name}</span>

              <Badge variant="secondary" className="text-[10px] px-1.5">
                #{nb.id}
              </Badge>

              {!!nb.is_active && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              )}

              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 ml-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopyId(nb.id);
                }}
              >
                {copiedId === nb.id ? (
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
                  handleDelete(nb.id);
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* -------- Navbar settings (name + active) -------- */}
      <Card>
        <CardContent className="pt-4 flex flex-wrap items-end gap-4">
          <div className="space-y-1 flex-1 min-w-52">
            <Label className="text-xs">Navbar name</Label>
            <Input
              value={current.name}
              onChange={(e) =>
                setCurrent((c) => ({ ...c, name: e.target.value }))
              }
              placeholder="EX: Main Navbar"
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
          <Button onClick={save} disabled={saving}>
            <Save className="w-4 h-4 mr-1" />
            {saving ? "Saving..." : "Navbar Save"}
          </Button>
        </CardContent>
      </Card>

      {/* -------- 4 sections -------- */}
      <Tabs defaultValue="middle">
        <TabsList>
          <TabsTrigger value="left" className={'cursor-pointer'}>
            <ImageIcon className="w-3.5 h-3.5 mr-1" /> Left Section (Logo)
          </TabsTrigger>
          <TabsTrigger value="middle" className={'cursor-pointer'}>
            <FileText className="w-3.5 h-3.5 mr-1" />
            Middle Section (Links)
          </TabsTrigger>
          <TabsTrigger value="right" className={'cursor-pointer'}>
            <MousePointerClick className="w-3.5 h-3.5 mr-1" />
            Right Section (Buttons)
          </TabsTrigger>
          <TabsTrigger value="settings" className={'cursor-pointer'}>
            <Settings2 className="w-3.5 h-3.5 mr-1" />
            Settings & Preview
          </TabsTrigger>
        </TabsList>

        {/* ================= LEFT : LOGO ================= */}
        <TabsContent value="left">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Logo Section</CardTitle>
              <CardDescription className="text-xs">
                You can show images, text, or both.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-w-xl">
              <div className="space-y-1">
                <Label className="text-xs">Logo type</Label>
                <Select
                  value={current.left.logo_type}
                  onValueChange={(v) =>
                    setCurrent((c) => ({
                      ...c,
                      left: { ...c.left, logo_type: v },
                    }))
                  }
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="image">Image Only</SelectItem>
                    <SelectItem value="text">Text Only</SelectItem>
                    <SelectItem value="both">Image + Text</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {current.left.logo_type !== "text" && (
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1 col-span-2">
                    <Label className="text-xs">Logo Image URL</Label>
                    <Input
                      value={current.left.logo_url}
                      onChange={(e) =>
                        setCurrent((c) => ({
                          ...c,
                          left: { ...c.left, logo_url: e.target.value },
                        }))
                      }
                      placeholder="/uploads/logo.png"
                      className="h-9"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">Height (px)</Label>
                    <Input
                      type="number"
                      value={current.left.height}
                      onChange={(e) =>
                        setCurrent((c) => ({
                          ...c,
                          left: { ...c.left, height: +e.target.value },
                        }))
                      }
                      className="h-9"
                    />
                  </div>
                </div>
              )}

              {current.left.logo_type !== "image" && (
                <div className="space-y-1">
                  <Label className="text-xs">Logo text / Site name</Label>
                  <Input
                    value={current.left.logo_text}
                    onChange={(e) =>
                      setCurrent((c) => ({
                        ...c,
                        left: { ...c.left, logo_text: e.target.value },
                      }))
                    }
                    className="h-9"
                  />
                </div>
              )}

              <div className="space-y-1">
                <Label className="text-xs">Where to go when logo is clicked</Label>
                <Input
                  value={current.left.link}
                  onChange={(e) =>
                    setCurrent((c) => ({
                      ...c,
                      left: { ...c.left, link: e.target.value },
                    }))
                  }
                  placeholder="/"
                  className="h-9"
                />
              </div>

              {/* Preview */}
              {current.left.logo_url && (
                <div className="rounded-lg border p-3 flex items-center gap-3 bg-slate-50">
                  <img
                    src={current.left.logo_url}
                    alt="logo preview"
                    style={{ height: current.left.height }}
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                  {current.left.logo_type !== "image" && (
                    <span className="font-semibold">
                      {current.left.logo_text}
                    </span>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ================= MIDDLE : LINKS ================= */}
        <TabsContent value="middle">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left panel */}
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Add from pages
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <input
                    type="search"
                    placeholder="Search page..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-md border px-3 py-2 text-sm"
                  />
                  <div className="max-h-56 overflow-y-auto space-y-1 pr-1 slim-scrollbar">
                    {filteredActivePages.map((p) => (
                      <label
                        key={p.id}
                        className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-slate-50 cursor-pointer"
                      >
                        <Checkbox
                          checked={checked.includes(p.id)}
                          onCheckedChange={(v) =>
                            setChecked(
                              v
                                ? [...checked, p.id]
                                : checked.filter((c) => c !== p.id),
                            )
                          }
                        />
                        <span className="text-sm flex-1 truncate">
                          {p.page_title}
                        </span>
                        <TypeBadge type={p.page_type} />
                      </label>
                    ))}
                  </div>
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={addPages}
                    disabled={!checked.length}
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add to menu{" "}
                    {checked.length ? `(${checked.length})` : ""}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Link2 className="w-4 h-4" /> Custom Link
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Label</Label>
                    <Input
                      value={customLabel}
                      onChange={(e) => setCustomLabel(e.target.value)}
                      placeholder="e.g., Facebook page"
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">URL</Label>
                    <Input
                      value={customUrl}
                      onChange={(e) => setCustomUrl(e.target.value)}
                      placeholder="https://..."
                      className="h-8 text-sm"
                    />
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={addCustom}
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add link
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Right panel: sortable list */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Menu Structure</CardTitle>
                <CardDescription className="text-xs">
                  ☰ Drag to arrange · → Make dropdown item
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-1.5">
                <DragDropProvider onDragEnd={makeDragEnd("middle")}>
                  {current.middle.map((item, index) => (
                    <SortableMenuItem
                      key={item.id}
                      item={item}
                      index={index}
                      editing={editingId === item.id}
                      onIndent={indent}
                      onEdit={(id) =>
                        setEditingId(editingId === id ? null : id)
                      }
                      onCloseEdit={() => setEditingId(null)}
                      onUpdate={updateMiddle}
                      onRemove={removeMiddle}
                    />
                  ))}
                </DragDropProvider>
                {current.middle.length === 0 && (
                  <div className="text-center text-sm text-slate-400 py-10 border border-dashed rounded-lg">
                    Add pages or custom links from the left panel
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ================= RIGHT : BUTTONS ================= */}
        <TabsContent value="right">
          <Card className="max-w-2xl">
            <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-sm">Right section buttons</CardTitle>
                <CardDescription className="text-xs">
                  Login, Join, Donate — add anything you want
                </CardDescription>
              </div>
              <Button size="sm" variant="outline" onClick={addButton}>
                <Plus className="w-4 h-4 mr-1" /> Add button
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              <DragDropProvider onDragEnd={makeDragEnd("right")}>
                {current.right.map((item, index) => (
                  <SortableButtonItem
                    key={item.id}
                    item={item}
                    index={index}
                    onUpdate={updateRight}
                    onRemove={removeRight}
                  />
                ))}
              </DragDropProvider>
              {current.right.length === 0 && (
                <div className="text-center text-sm text-slate-400 py-10 border border-dashed rounded-lg">
                  No buttons yet
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ================= SETTINGS : META + VARIANT + LIVE PREVIEW ================= */}
        <TabsContent value="settings">
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Behavior</CardTitle>
                <CardDescription className="text-xs">
                  General settings saved in the navbar's meta.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <label className="flex items-center justify-between rounded-lg border p-3 max-w-md">
                  <span>
                    <span className="text-sm font-medium block">
                      Sticky navbar
                    </span>
                    <span className="text-xs text-slate-400">
                      Keeps the navbar fixed at the top while scrolling.
                    </span>
                  </span>
                  <Switch
                    checked={!!current.meta.navbarSticky}
                    onCheckedChange={(v) => updateMeta({ navbarSticky: v })}
                  />
                </label>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Navbar variant</CardTitle>
                <CardDescription className="text-xs">
                  Same links, logo and buttons — pick how they should look.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <VariantPicker
                  value={current.meta.navbarVarients}
                  onChange={(v) => updateMeta({ navbarVarients: v })}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Preview</CardTitle>
                <CardDescription className="text-xs">
                  This is how the navbar will look with the current data.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-xl border bg-slate-50 p-4">
                  <NavbarPreview
                    left={current.left}
                    middle={current.middle}
                    right={current.right}
                    meta={current.meta}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};