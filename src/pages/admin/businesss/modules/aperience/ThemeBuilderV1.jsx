import { useState, useEffect, useRef } from "react";
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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GripVertical,
  Trash2,
  Plus,
  Save,
  Eye,
  EyeOff,
  Settings2,
  Rocket,
  LayoutTemplate,
  PanelTop,
  PanelBottom,
  Palette,
} from "lucide-react";
import { useApiMutation } from "@/hooks/useAppMutation";
import { toast } from "sonner";

/* ==================================================================
   Section Registry — সাইটের সব সেকশনের মাস্টার লিস্ট
   নতুন সেকশন যোগ করতে চাইলে শুধু এখানে entry বাড়ান —
   builder আর backend দুটোই অটো সাপোর্ট করবে।
   options = কোন কোন কনফিগ এই সেকশনে দেখাবে
================================================================== */
export const SECTION_REGISTRY = {
  hero_banner: {
    label: "হিরো ব্যানার / স্লাইডার",
    options: ["title", "subtitle"],
    defaults: { title: "", subtitle: "" },
  },
  president_message: {
    label: "কেন্দ্রীয় সভাপতির বাণী",
    options: ["title", "image_position"],
    defaults: { title: "কেন্দ্রীয় সভাপতির বাণী", image_position: "right" },
  },
  about: {
    label: "আমাদের পরিচিতি",
    options: ["title", "image_position"],
    defaults: { title: "আমাদের পরিচিতি", image_position: "left" },
  },
  what_we_want: {
    label: "আমরা কী চাই?",
    options: ["title", "image_position"],
    defaults: { title: "আমরা কী চাই?", image_position: "right" },
  },
  amir_intro: {
    label: "আমীরে জামাআতের পরিচয়",
    options: ["title", "image_position"],
    defaults: { title: "আমীরে জামা'আতের পরিচয়", image_position: "left" },
  },
  programs: {
    label: "চলমান কর্মসূচী",
    options: ["title", "columns", "limit"],
    defaults: { title: "চলমান কর্মসূচী", columns: 3, limit: 6 },
  },
  committee: {
    label: "কেন্দ্রীয় কর্মপরিষদ",
    options: ["title", "columns", "limit"],
    defaults: { title: "কেন্দ্রীয় কর্মপরিষদ", columns: 4, limit: 8 },
  },
  photo_gallery: {
    label: "ছবি সমূহ",
    options: ["title", "columns", "limit", "show_tabs"],
    defaults: { title: "ছবি সমূহ", columns: 3, limit: 6, show_tabs: true },
  },
  video_gallery: {
    label: "বয়ান ও ভিডিও",
    options: ["title", "columns", "limit"],
    defaults: { title: "বয়ান ও ভিডিও", columns: 3, limit: 3 },
  },
  archive: {
    label: "আর্কাইভ",
    options: ["title", "columns", "limit"],
    defaults: { title: "আর্কাইভ", columns: 4, limit: 4 },
  },
  annual_plan: {
    label: "বাৎসরিক পরিকল্পনা",
    options: ["title", "columns", "limit"],
    defaults: { title: "বাৎসরিক পরিকল্পনা", columns: 4, limit: 4 },
  },
  regular_activities: {
    label: "নিয়মিত কার্যক্রম",
    options: ["title", "columns", "limit"],
    defaults: { title: "নিয়মিত কার্যক্রম", columns: 3, limit: 3 },
  },
  social_activities: {
    label: "সামাজিক কার্যক্রম",
    options: ["title", "columns", "limit"],
    defaults: { title: "সামাজিক কার্যক্রম", columns: 3, limit: 3 },
  },
  notices: {
    label: "নোটিশ",
    options: ["title", "limit"],
    defaults: { title: "নোটিশ", limit: 5 },
  },
};

let uid = 1000;
const newId = (prefix) => `${prefix}-${++uid}-${Date.now()}`;

// ---- Theme এর ডিজাইন সেটিংস (colors, fonts, style) ----
export const FONT_OPTIONS = [
  { value: "'Hind Siliguri', sans-serif", label: "Hind Siliguri (বাংলা)" },
  { value: "'Noto Sans Bengali', sans-serif", label: "Noto Sans Bengali" },
  { value: "'Tiro Bangla', serif", label: "Tiro Bangla" },
  { value: "'Inter', sans-serif", label: "Inter" },
  { value: "'Poppins', sans-serif", label: "Poppins" },
];

const defaultStyle = () => ({
  primary_color: "#1e40af", // মূল ব্র্যান্ড কালার (বাটন, লিংক)
  secondary_color: "#0ea5e9", // অ্যাকসেন্ট
  background_color: "#ffffff", // সেকশনের ব্যাকগ্রাউন্ড
  section_alt_bg: "#f8fafc", // জোড়/বেজোড় সেকশনের বিকল্প bg
  heading_color: "#0f172a",
  text_color: "#334155",
  font_family: FONT_OPTIONS[0].value,
  heading_font: FONT_OPTIONS[0].value,
  border_radius: 12, // কার্ডের গোলতা (px)
  container_width: "7xl", // max-w-7xl / 6xl / 5xl
});

const emptyTheme = () => ({
  id: null,
  name: "",
  is_published: false,
  navbar_id: null,
  footer_id: null,
  style: defaultStyle(),
});

// ডিফল্ট: registry-র সব সেকশন visible অবস্থায়
const defaultSections = () =>
  Object.entries(SECTION_REGISTRY).map(([key, def], i) => ({
    id: newId("s"),
    section_key: key,
    is_visible: true,
    config: { ...def.defaults },
  }));

/* ==================================================================
   Sortable Section Row
================================================================== */
function SortableSection({
  section,
  index,
  expanded,
  onToggleExpand,
  onToggleVisible,
  onRemove,
  onUpdateConfig,
}) {
  const { ref, handleRef, isDragging } = useSortable({
    id: section.id,
    index,
  });
  const def = SECTION_REGISTRY[section.section_key];
  if (!def) return null;
  const cfg = section.config || {};
  const set = (patch) => onUpdateConfig(section.id, { ...cfg, ...patch });
  const has = (opt) => def.options.includes(opt);

  return (
    <div ref={ref} className={isDragging ? "opacity-40" : ""}>
      <div
        className={`flex items-center gap-2 rounded-lg border px-2 py-2 ${
          section.is_visible ? "bg-white" : "bg-slate-50 opacity-60"
        }`}
      >
        <button
          ref={handleRef}
          className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 touch-none"
          aria-label="Drag to reorder"
        >
          <GripVertical className="w-4 h-4" />
        </button>
        <span className="text-sm font-medium flex-1 truncate">
          {cfg.title || def.label}
          <span className="text-[10px] text-slate-400 ml-2">({def.label})</span>
        </span>
        {has("columns") && (
          <span className="text-[10px] rounded-full border px-2 py-0 text-slate-500">
            {cfg.columns} কলাম
          </span>
        )}
        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            title={section.is_visible ? "লুকান" : "দেখান"}
            onClick={() => onToggleVisible(section.id)}
          >
            {section.is_visible ? (
              <Eye className="w-3.5 h-3.5" />
            ) : (
              <EyeOff className="w-3.5 h-3.5 text-slate-400" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            title="কাস্টমাইজ"
            onClick={() => onToggleExpand(section.id)}
          >
            <Settings2 className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-red-500 hover:text-red-600"
            onClick={() => onRemove(section.id)}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* -------- কনফিগ প্যানেল -------- */}
      {expanded && (
        <div className="mt-1.5 ml-6 rounded-lg border bg-slate-50 p-3 grid grid-cols-2 gap-3">
          {has("title") && (
            <div className="space-y-1 col-span-2">
              <Label className="text-xs">সেকশন টাইটেল</Label>
              <Input
                value={cfg.title || ""}
                onChange={(e) => set({ title: e.target.value })}
                className="h-8 text-sm bg-white"
              />
            </div>
          )}
          {has("subtitle") && (
            <div className="space-y-1 col-span-2">
              <Label className="text-xs">সাবটাইটেল</Label>
              <Input
                value={cfg.subtitle || ""}
                onChange={(e) => set({ subtitle: e.target.value })}
                className="h-8 text-sm bg-white"
              />
            </div>
          )}
          {has("columns") && (
            <div className="space-y-1">
              <Label className="text-xs">কলাম সংখ্যা</Label>
              <Select
                value={String(cfg.columns)}
                onValueChange={(v) => set({ columns: +v })}
              >
                <SelectTrigger className="h-8 text-sm bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n} কলাম
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {has("limit") && (
            <div className="space-y-1">
              <Label className="text-xs">কয়টা আইটেম দেখাবে</Label>
              <Input
                type="number"
                min={1}
                max={24}
                value={cfg.limit}
                onChange={(e) => set({ limit: +e.target.value })}
                className="h-8 text-sm bg-white"
              />
            </div>
          )}
          {has("image_position") && (
            <div className="space-y-1">
              <Label className="text-xs">ছবির পজিশন</Label>
              <Select
                value={cfg.image_position}
                onValueChange={(v) => set({ image_position: v })}
              >
                <SelectTrigger className="h-8 text-sm bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">বামে</SelectItem>
                  <SelectItem value="right">ডানে</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          {has("show_tabs") && (
            <label className="flex items-center gap-2 text-xs text-slate-600 self-end pb-1">
              <Switch
                checked={cfg.show_tabs}
                onCheckedChange={(v) => set({ show_tabs: v })}
              />
              ট্যাব ফিল্টার (All/Explorer/Event)
            </label>
          )}
        </div>
      )}
    </div>
  );
}

/* ==================================================================
   Main ThemeBuilder
================================================================== */
const ThemeBuilder = () => {
  const [themes, setThemes] = useState([]);
  const [navbars, setNavbars] = useState([]);
  const [footers, setFooters] = useState([]);
  const [current, setCurrent] = useState(emptyTheme());
  const [sections, setSections] = useState(defaultSections());
  const [expandedId, setExpandedId] = useState(null);
  const [addKey, setAddKey] = useState("");

  /* ---------------- API ---------------- */
  const { mutate: fetchThemes } = useApiMutation({
    url: "/admin/themes/list",
    method: "GET", // GET সাপোর্ট না থাকলে axios দিয়ে বদলান
  });
  const { mutate: fetchNavbars } = useApiMutation({
    url: "/admin/navbars/list",
    method: "GET",
  });
  const { mutate: fetchFooters } = useApiMutation({
    url: "/admin/footers/list",
    method: "GET",
  });
  const { mutate: saveTheme, isLoading: saving } = useApiMutation({
    url: "/admin/themes/save",
  });
  const { mutate: publishTheme } = useApiMutation({
    url: "/admin/themes/publish",
  });
  const { mutate: deleteTheme } = useApiMutation({
    url: "/admin/themes/delete",
  });

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadAll = async () => {
    const [t, n, f] = await Promise.all([
      fetchThemes(),
      fetchNavbars(),
      fetchFooters(),
    ]);
    if (t?.success) setThemes(t.data);
    if (n?.success) setNavbars(n.data);
    if (f?.success) setFooters(f.data);
  };

  /* -------- backend template → builder state -------- */
  const selectTheme = (t) => {
    setExpandedId(null);
    setCurrent({
      id: t.id,
      name: t.name,
      is_published: !!t.is_published,
      navbar_id: t.navbar_id,
      footer_id: t.footer_id,
      style: { ...defaultStyle(), ...(t.style_config || {}) },
    });
    setSections(
      (t.sections || []).map((s) => ({
        id: `s-${s.id}`,
        section_key: s.section_key,
        is_visible: !!s.is_visible,
        config: s.config || SECTION_REGISTRY[s.section_key]?.defaults || {},
      })),
    );
  };

  const startNew = () => {
    setCurrent(emptyTheme());
    setSections(defaultSections());
    setExpandedId(null);
  };

  /* ---------------- Section helpers ---------------- */
  const toggleVisible = (id) =>
    setSections((s) =>
      s.map((sec) =>
        sec.id === id ? { ...sec, is_visible: !sec.is_visible } : sec,
      ),
    );

  const removeSection = (id) =>
    setSections((s) => s.filter((sec) => sec.id !== id));

  const updateConfig = (id, config) =>
    setSections((s) =>
      s.map((sec) => (sec.id === id ? { ...sec, config } : sec)),
    );

  const addSection = () => {
    if (!addKey) return;
    const def = SECTION_REGISTRY[addKey];
    setSections((s) => [
      ...s,
      {
        id: newId("s"),
        section_key: addKey,
        is_visible: true,
        config: { ...def.defaults },
      },
    ]);
    setAddKey("");
  };

  // যেগুলো এখনো লিস্টে নেই সেগুলোই যোগ করা যাবে
  const availableToAdd = Object.entries(SECTION_REGISTRY).filter(
    ([key]) => !sections.some((s) => s.section_key === key),
  );

  /* ---------------- Save / Publish / Delete ---------------- */
  const save = async () => {
    if (!current.name.trim()) {
      toast.error("Theme এর একটা নাম দিন।");
      return;
    }
    const payload = {
      id: current.id,
      name: current.name,
      navbar_id: current.navbar_id,
      footer_id: current.footer_id,
      style_config: current.style,
      sections: sections.map((s, i) => ({
        section_key: s.section_key,
        is_visible: s.is_visible,
        config: s.config,
        sort_order: i,
      })),
    };
    const res = await saveTheme(payload);
    if (res?.success) {
      toast.success(res.message || "Theme সেভ হয়েছে।");
      loadAll();
      if (!current.id && res.data?.id) {
        setCurrent((c) => ({ ...c, id: res.data.id }));
      }
    }
  };

  const publish = async (id) => {
    const res = await publishTheme({ id });
    if (res?.success) {
      toast.success("Theme টি এখন লাইভ! 🎉");
      loadAll();
      if (current.id === id) {
        setCurrent((c) => ({ ...c, is_published: true }));
      }
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("এই theme টি মুছে ফেলতে চান?")) return;
    const res = await deleteTheme({ id });
    if (res?.success) {
      toast.success("Theme মুছে ফেলা হয়েছে।");
      if (current.id === id) startNew();
      loadAll();
    }
  };

  /* ================================================================
     UI
  ================================================================ */
  return (
    <div className="space-y-6">
      {/* -------- Theme লিস্ট -------- */}
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-sm flex items-center gap-2">
              <LayoutTemplate className="w-4 h-4" /> আপনার Theme গুলো
            </CardTitle>
            <CardDescription className="text-xs">
              একাধিক theme বানান — যেকোনো একটা publish থাকবে
            </CardDescription>
          </div>
          <Button size="sm" variant="outline" onClick={startNew}>
            <Plus className="w-4 h-4 mr-1" /> নতুন Theme
          </Button>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {themes.length === 0 && (
            <p className="text-xs text-slate-400">
              এখনো কোনো theme সেভ করা হয়নি।
            </p>
          )}
          {themes.map((t) => (
            <div
              key={t.id}
              className={`flex items-center gap-1.5 rounded-md border px-2 py-1 text-sm cursor-pointer ${
                current.id === t.id
                  ? "border-primary bg-primary/5"
                  : "hover:bg-slate-50"
              }`}
              onClick={() => selectTheme(t)}
            >
              <span>{t.name}</span>
              {!!t.is_published && (
                <span className="text-[10px] rounded-full bg-emerald-100 text-emerald-700 px-1.5 py-0 font-medium">
                  Published
                </span>
              )}
              {!t.is_published && (
                <button
                  className="text-emerald-600 hover:text-emerald-700"
                  title="Publish করুন"
                  onClick={(e) => {
                    e.stopPropagation();
                    publish(t.id);
                  }}
                >
                  <Rocket className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                className="text-red-400 hover:text-red-600"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(t.id);
                }}
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* -------- নাম + Header/Footer সিলেক্ট + Save -------- */}
      <Card>
        <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-1">
            <Label className="text-xs">Theme এর নাম</Label>
            <Input
              value={current.name}
              onChange={(e) =>
                setCurrent((c) => ({ ...c, name: e.target.value }))
              }
              placeholder="যেমন: ঈদ স্পেশাল থিম"
              className="h-9"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs flex items-center gap-1">
              <PanelTop className="w-3 h-3" /> Header (Navbar)
            </Label>
            <Select
              value={current.navbar_id ? String(current.navbar_id) : ""}
              onValueChange={(v) =>
                setCurrent((c) => ({ ...c, navbar_id: +v }))
              }
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Navbar বাছাই করুন" />
              </SelectTrigger>
              <SelectContent>
                {navbars.map((n) => (
                  <SelectItem key={n.id} value={String(n.id)}>
                    {n.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs flex items-center gap-1">
              <PanelBottom className="w-3 h-3" /> Footer
            </Label>
            <Select
              value={current.footer_id ? String(current.footer_id) : ""}
              onValueChange={(v) =>
                setCurrent((c) => ({ ...c, footer_id: +v }))
              }
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Footer বাছাই করুন" />
              </SelectTrigger>
              <SelectContent>
                {footers.map((f) => (
                  <SelectItem key={f.id} value={String(f.id)}>
                    {f.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={save} disabled={saving}>
            <Save className="w-4 h-4 mr-1" />
            {saving ? "সেভ হচ্ছে..." : "Theme সেভ করুন"}
          </Button>
        </CardContent>
      </Card>

      {/* -------- ডিজাইন সেটিংস (Theme এর মূল অংশ) -------- */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Palette className="w-4 h-4" /> ডিজাইন সেটিংস
          </CardTitle>
          <CardDescription className="text-xs">
            রঙ, ফন্ট, স্টাইল — পুরো সাইটে CSS variable হিসেবে অ্যাপ্লাই হবে
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            ["primary_color", "প্রাইমারি কালার"],
            ["secondary_color", "সেকেন্ডারি কালার"],
            ["background_color", "ব্যাকগ্রাউন্ড"],
            ["section_alt_bg", "বিকল্প সেকশন bg"],
            ["heading_color", "হেডিং কালার"],
            ["text_color", "টেক্সট কালার"],
          ].map(([key, label]) => (
            <div key={key} className="space-y-1">
              <Label className="text-xs">{label}</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={current.style?.[key] || "#000000"}
                  onChange={(e) =>
                    setCurrent((c) => ({
                      ...c,
                      style: { ...c.style, [key]: e.target.value },
                    }))
                  }
                  className="h-8 w-10 rounded border cursor-pointer p-0.5"
                />
                <span className="text-[10px] text-slate-400 font-mono">
                  {current.style?.[key]}
                </span>
              </div>
            </div>
          ))}

          <div className="space-y-1 col-span-2">
            <Label className="text-xs">বডি ফন্ট</Label>
            <Select
              value={current.style?.font_family}
              onValueChange={(v) =>
                setCurrent((c) => ({
                  ...c,
                  style: { ...c.style, font_family: v },
                }))
              }
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FONT_OPTIONS.map((f) => (
                  <SelectItem key={f.value} value={f.value} className="text-xs">
                    {f.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1 col-span-2">
            <Label className="text-xs">হেডিং ফন্ট</Label>
            <Select
              value={current.style?.heading_font}
              onValueChange={(v) =>
                setCurrent((c) => ({
                  ...c,
                  style: { ...c.style, heading_font: v },
                }))
              }
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FONT_OPTIONS.map((f) => (
                  <SelectItem key={f.value} value={f.value} className="text-xs">
                    {f.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">কার্ডের গোলতা (px)</Label>
            <Input
              type="number"
              min={0}
              max={32}
              value={current.style?.border_radius}
              onChange={(e) =>
                setCurrent((c) => ({
                  ...c,
                  style: { ...c.style, border_radius: +e.target.value },
                }))
              }
              className="h-8 text-sm"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">কন্টেইনার প্রস্থ</Label>
            <Select
              value={current.style?.container_width}
              onValueChange={(v) =>
                setCurrent((c) => ({
                  ...c,
                  style: { ...c.style, container_width: v },
                }))
              }
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5xl">সরু (5xl)</SelectItem>
                <SelectItem value="6xl">মাঝারি (6xl)</SelectItem>
                <SelectItem value="7xl">চওড়া (7xl)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* মিনি কালার প্রিভিউ */}
          <div
            className="col-span-2 md:col-span-3 lg:col-span-6 rounded-lg border p-4 flex items-center gap-3"
            style={{
              background: current.style?.background_color,
              fontFamily: current.style?.font_family,
            }}
          >
            <span
              className="font-bold"
              style={{
                color: current.style?.heading_color,
                fontFamily: current.style?.heading_font,
              }}
            >
              হেডিং নমুনা
            </span>
            <span
              style={{ color: current.style?.text_color }}
              className="text-sm"
            >
              সাধারণ টেক্সট এরকম দেখাবে।
            </span>
            <button
              className="ml-auto px-4 py-1.5 text-sm text-white"
              style={{
                background: current.style?.primary_color,
                borderRadius: current.style?.border_radius,
              }}
            >
              প্রাইমারি বাটন
            </button>
            <button
              className="px-4 py-1.5 text-sm text-white"
              style={{
                background: current.style?.secondary_color,
                borderRadius: current.style?.border_radius,
              }}
            >
              সেকেন্ডারি
            </button>
          </div>
        </CardContent>
      </Card>

      {/* -------- Section লিস্ট -------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">হোমপেজের সেকশন</CardTitle>
            <CardDescription className="text-xs">
              ☰ টেনে সাজান · 👁 দিয়ে show/hide · ⚙ দিয়ে কাস্টমাইজ
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-1.5">
            <DragDropProvider
              onDragEnd={(event) => {
                if (event.canceled) return;
                const { source } = event.operation;
                if (isSortable(source)) {
                  const { initialIndex, index } = source;
                  if (initialIndex !== index) {
                    setSections((items) => {
                      const next = [...items];
                      const [moved] = next.splice(initialIndex, 1);
                      next.splice(index, 0, moved);
                      return next;
                    });
                  }
                }
              }}
            >
              {sections.map((section, index) => (
                <SortableSection
                  key={section.id}
                  section={section}
                  index={index}
                  expanded={expandedId === section.id}
                  onToggleExpand={(id) =>
                    setExpandedId(expandedId === id ? null : id)
                  }
                  onToggleVisible={toggleVisible}
                  onRemove={removeSection}
                  onUpdateConfig={updateConfig}
                />
              ))}
            </DragDropProvider>

            {/* মুছে ফেলা সেকশন আবার যোগ করা */}
            {availableToAdd.length > 0 && (
              <div className="flex gap-2 pt-3 border-t mt-3">
                <Select value={addKey} onValueChange={setAddKey}>
                  <SelectTrigger className="h-8 text-xs flex-1">
                    <SelectValue placeholder="+ সেকশন যোগ করুন" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableToAdd.map(([key, def]) => (
                      <SelectItem key={key} value={key} className="text-xs">
                        {def.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button size="sm" variant="outline" onClick={addSection}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* -------- মিনি প্রিভিউ (skeleton) -------- */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">লেআউট প্রিভিউ</CardTitle>
            <CardDescription className="text-xs">
              visible সেকশনগুলোর ক্রম
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border overflow-hidden text-[10px]">
              <div className="bg-slate-800 text-white px-2 py-1.5 flex justify-between">
                <span>
                  {navbars.find((n) => n.id === current.navbar_id)?.name ||
                    "Navbar"}
                </span>
                <span>☰</span>
              </div>
              {sections
                .filter((s) => s.is_visible)
                .map((s) => {
                  const def = SECTION_REGISTRY[s.section_key];
                  const cols = s.config?.columns;
                  return (
                    <div key={s.id} className="border-t px-2 py-2 bg-white">
                      <p className="font-medium text-slate-600 mb-1">
                        {s.config?.title || def?.label}
                      </p>
                      {cols ? (
                        <div
                          className="grid gap-1"
                          style={{
                            gridTemplateColumns: `repeat(${cols}, 1fr)`,
                          }}
                        >
                          {Array.from({
                            length: Math.min(cols, s.config?.limit || cols),
                          }).map((_, i) => (
                            <div key={i} className="h-6 rounded bg-slate-100" />
                          ))}
                        </div>
                      ) : (
                        <div className="h-6 rounded bg-slate-100" />
                      )}
                    </div>
                  );
                })}
              <div className="bg-slate-800 text-slate-400 px-2 py-1.5 border-t">
                {footers.find((f) => f.id === current.footer_id)?.name ||
                  "Footer"}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ThemeBuilder;
