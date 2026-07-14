import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Eye,
  EyeOff,
  LayoutTemplate,
  Palette,
  Plus,
  Settings2,
  Sparkles,
  Trash2,
  Wand2,
} from "lucide-react";
import { toast } from "sonner";
import { useApiQuery } from "@/hooks/useAppQuery";

const FONT_OPTIONS = [
  { value: "'Hind Siliguri', sans-serif", label: "Hind Siliguri" },
  { value: "'Noto Sans Bengali', sans-serif", label: "Noto Sans Bengali" },
  { value: "'Inter', sans-serif", label: "Inter" },
  { value: "'Poppins', sans-serif", label: "Poppins" },
];

const THEME_VARIANTS = [
  {
    id: "classic",
    name: "Classic",
    description: "Traditional blue theme",
    style: {
      primary_color: "#1e40af",
      secondary_color: "#0ea5e9",
      background_color: "#ffffff",
      section_alt_bg: "#f8fafc",
      heading_color: "#0f172a",
      text_color: "#334155",
      font_family: FONT_OPTIONS[0].value,
      heading_font: FONT_OPTIONS[0].value,
      border_radius: 12,
      container_width: "7xl",
    },
  },
  {
    id: "dark",
    name: "Dark Aura",
    description: "Deep contrast for premium presentation",
    style: {
      primary_color: "#8b5cf6",
      secondary_color: "#f59e0b",
      background_color: "#0f172a",
      section_alt_bg: "#111827",
      heading_color: "#f8fafc",
      text_color: "#cbd5e1",
      font_family: FONT_OPTIONS[3].value,
      heading_font: FONT_OPTIONS[3].value,
      border_radius: 16,
      container_width: "7xl",
    },
  },
  {
    id: "green",
    name: "Green Focus",
    description: "Fresh, modern and calm",
    style: {
      primary_color: "#047857",
      secondary_color: "#10b981",
      background_color: "#f0fdf4",
      section_alt_bg: "#ecfccb",
      heading_color: "#14532d",
      text_color: "#365314",
      font_family: FONT_OPTIONS[1].value,
      heading_font: FONT_OPTIONS[1].value,
      border_radius: 10,
      container_width: "6xl",
    },
  },
];

const buildDefaultSections = (SECTION_REGISTRY) =>
  Object.entries(SECTION_REGISTRY).map(([key, definition], index) => ({
    id: `section-${index + 1}`,
    section_key: key,
    is_visible: true,
    config: { ...definition.defaults },
  }));

const createSectionId = (prefix = "section") =>
  `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

export default function ThemeBuilder() {
  const { data: navs } = useApiQuery({
    url: "/admin/navbars/list",
  });

  console.log("navs - ", navs);

  const SECTION_REGISTRY = {
    hero_banner: {
      label: "হিরো ব্যানার / স্লাইডার",
      description: "স্লাইডার, হেডলাইন, CTA",
      options: ["title", "subtitle"],
      defaults: { title: "স্বাগতম", subtitle: "আপনার ব্র্যান্ডের বার্তা" },
    },
    president_message: {
      label: "সভাপতির বাণী",
      description: "প্রেসিডেন্টের পরিচিতি / বাণী",
      options: ["title", "image_position"],
      defaults: { title: "সভাপতির বাণী", image_position: "right" },
    },
    about: {
      label: "আমাদের পরিচিতি",
      description: "সংগঠনের পরিচয়",
      options: ["title", "image_position"],
      defaults: { title: "আমাদের পরিচিতি", image_position: "left" },
    },
    what_we_want: {
      label: "আমরা কী চাই",
      description: "ভিশন ও লক্ষ্য",
      options: ["title", "image_position"],
      defaults: { title: "আমরা কী চাই", image_position: "right" },
    },
    programs: {
      label: "চলমান কর্মসূচী",
      description: "কার্যক্রমের তালিকা",
      options: ["title", "columns", "limit"],
      defaults: { title: "চলমান কর্মসূচী", columns: 3, limit: 6 },
    },
    committee: {
      label: "কেন্দ্রীয় কর্মপরিষদ",
      description: "কমিটি সদস্য তালিকা",
      options: ["title", "columns", "limit"],
      defaults: { title: "কেন্দ্রীয় কর্মপরিষদ", columns: 4, limit: 8 },
    },
    photo_gallery: {
      label: "ছবি সমূহ",
      description: "ফটো গ্যালারি",
      options: ["title", "columns", "limit", "show_tabs"],
      defaults: { title: "ছবি সমূহ", columns: 3, limit: 6, show_tabs: true },
    },
    video_gallery: {
      label: "ভিডিও / বয়ান",
      description: "ভিডিও সেকশন",
      options: ["title", "columns", "limit"],
      defaults: { title: "ভিডিও / বয়ান", columns: 3, limit: 3 },
    },
    archive: {
      label: "আর্কাইভ",
      description: "পূর্বের তথ্য",
      options: ["title", "columns", "limit"],
      defaults: { title: "আর্কাইভ", columns: 4, limit: 4 },
    },
    annual_plan: {
      label: "বাৎসরিক পরিকল্পনা",
      description: "পরিকল্পনা তালিকা",
      options: ["title", "columns", "limit"],
      defaults: { title: "বাৎসরিক পরিকল্পনা", columns: 4, limit: 4 },
    },
    regular_activities: {
      label: "নিয়মিত কার্যক্রম",
      description: "নিয়মিত কাজের তালিকা",
      options: ["title", "columns", "limit"],
      defaults: { title: "নিয়মিত কার্যক্রম", columns: 3, limit: 3 },
    },
    social_activities: {
      label: "সামাজিক কার্যক্রম",
      description: "সামাজিক উদ্যোগ",
      options: ["title", "columns", "limit"],
      defaults: { title: "সামাজিক কার্যক্রম", columns: 3, limit: 3 },
    },
  };

  const [themeName, setThemeName] = useState("Dynamic Theme");
  const [sections, setSections] = useState(
    buildDefaultSections(SECTION_REGISTRY),
  );
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [style, setStyle] = useState(THEME_VARIANTS[0].style);
  const [addKey, setAddKey] = useState("");

  const selectedSection = useMemo(
    () =>
      sections.find((section) => section.id === selectedSectionId) ||
      sections[0] ||
      null,
    [sections, selectedSectionId],
  );

  const selectedRegistry = selectedSection
    ? SECTION_REGISTRY[selectedSection.section_key]
    : null;

  const availableSections = Object.entries(SECTION_REGISTRY).filter(
    ([key]) => !sections.some((section) => section.section_key === key),
  );

  const toggleSectionVisibility = (sectionId) => {
    setSections((current) =>
      current.map((section) =>
        section.id === sectionId
          ? { ...section, is_visible: !section.is_visible }
          : section,
      ),
    );
  };

  const removeSection = (sectionId) => {
    setSections((current) =>
      current.filter((section) => section.id !== sectionId),
    );
    setSelectedSectionId((current) => (current === sectionId ? null : current));
  };

  const addSection = () => {
    if (!addKey) return;
    const definition = SECTION_REGISTRY[addKey];
    if (!definition) return;
    const nextSection = {
      id: createSectionId(),
      section_key: addKey,
      is_visible: true,
      config: { ...definition.defaults },
    };
    setSections((current) => [...current, nextSection]);
    setSelectedSectionId(nextSection.id);
    setAddKey("");
  };

  const updateSectionConfig = (sectionId, patch) => {
    setSections((current) =>
      current.map((section) =>
        section.id === sectionId
          ? { ...section, config: { ...section.config, ...patch } }
          : section,
      ),
    );
  };

  const applyVariant = (variant) => {
    setStyle(variant.style);
    toast.success(`${variant.name} applied`);
  };

  const saveTheme = () => {
    toast.success(`Theme saved: ${themeName}`);
  };

  return (
    <div className="space-y-6">
      <Card className="border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-sm">
                <LayoutTemplate className="h-4 w-4" /> Dynamic Theme Builder
              </CardTitle>
              <CardDescription className="text-xs">
                Manage sections, toggle visibility, customize content, and
                preview the full page in one place.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Input
                value={themeName}
                onChange={(event) => setThemeName(event.target.value)}
                placeholder="Theme name"
                className="h-9 w-48"
              />
              <Button onClick={saveTheme}>
                <Wand2 className="mr-2 h-4 w-4" /> Save Theme
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)_340px]">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <LayoutTemplate className="h-4 w-4" /> Modules / Sections
            </CardTitle>
            <CardDescription className="text-xs">
              Add a section, show or hide it, or remove it from the theme.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {sections.map((section) => {
              const definition = SECTION_REGISTRY[section.section_key];
              return (
                <div
                  key={section.id}
                  className={`rounded-lg border p-2 transition ${selectedSectionId === section.id ? "border-primary bg-primary/5" : "bg-white"}`}
                >
                  <div className="flex items-center gap-2">
                    <button
                      className="flex-1 text-left"
                      onClick={() => setSelectedSectionId(section.id)}
                    >
                      <div className="font-medium text-sm">
                        {definition?.label || section.section_key}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {definition?.description || "Section"}
                      </div>
                    </button>
                    <button
                      className="rounded p-1.5 hover:bg-slate-100"
                      onClick={() => toggleSectionVisibility(section.id)}
                      title={section.is_visible ? "Hide" : "Show"}
                    >
                      {section.is_visible ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-slate-400" />
                      )}
                    </button>
                    <button
                      className="rounded p-1.5 text-red-500 hover:bg-slate-100"
                      onClick={() => removeSection(section.id)}
                      title="Delete section"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}

            <div className="space-y-2 pt-2 border-t">
              <Label className="text-xs">Add Section</Label>
              <Select value={addKey} onValueChange={setAddKey}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  {availableSections.map(([key, definition]) => (
                    <SelectItem key={key} value={key}>
                      {definition.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button className="w-full" variant="outline" onClick={addSection}>
                <Plus className="mr-2 h-4 w-4" /> Add Section
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Sparkles className="h-4 w-4" /> Theme Preview
            </CardTitle>
            <CardDescription className="text-xs">
              The center panel previews the live arrangement of visible
              sections.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className="overflow-hidden rounded-xl border shadow-sm"
              style={{
                backgroundColor: style.background_color,
                color: style.text_color,
                fontFamily: style.font_family,
              }}
            >
              <div
                className="px-4 py-3 text-sm font-semibold"
                style={{
                  background: `linear-gradient(90deg, ${style.primary_color}, ${style.secondary_color})`,
                  color: "#fff",
                }}
              >
                Navbar / Header
              </div>
              <div className="p-4 space-y-3">
                {sections
                  .filter((section) => section.is_visible)
                  .map((section) => {
                    const definition = SECTION_REGISTRY[section.section_key];
                    const config = section.config || {};
                    const cols = config.columns || 3;
                    const limit = config.limit || 3;
                    return (
                      <div
                        key={section.id}
                        className="rounded-lg border p-3"
                        style={{
                          backgroundColor: style.section_alt_bg,
                          borderColor: `${style.primary_color}22`,
                        }}
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <div>
                            <h4
                              className="text-sm font-semibold"
                              style={{
                                color: style.heading_color,
                                fontFamily: style.heading_font,
                              }}
                            >
                              {config.title || definition?.label}
                            </h4>
                            {definition?.description && (
                              <p className="text-[11px] text-slate-500">
                                {definition.description}
                              </p>
                            )}
                          </div>
                          <span
                            className="rounded-full border px-2 py-0.5 text-[10px]"
                            style={{
                              borderColor: `${style.primary_color}44`,
                              color: style.primary_color,
                            }}
                          >
                            {section.is_visible ? "Visible" : "Hidden"}
                          </span>
                        </div>
                        {cols ? (
                          <div
                            className="grid gap-2"
                            style={{
                              gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                            }}
                          >
                            {Array.from({ length: Math.min(limit, cols) }).map(
                              (_, index) => (
                                <div
                                  key={index}
                                  className="h-12 rounded-md"
                                  style={{
                                    backgroundColor: `${style.primary_color}15`,
                                  }}
                                />
                              ),
                            )}
                          </div>
                        ) : (
                          <div
                            className="h-12 rounded-md"
                            style={{
                              backgroundColor: `${style.primary_color}15`,
                            }}
                          />
                        )}
                      </div>
                    );
                  })}
              </div>
              <div
                className="border-t px-4 py-3 text-sm"
                style={{ backgroundColor: `${style.primary_color}10` }}
              >
                Footer / Copyright
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Settings2 className="h-4 w-4" /> Section Customization
            </CardTitle>
            <CardDescription className="text-xs">
              Configure the currently selected module from the left panel.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs">Theme variants</Label>
              <div className="grid gap-2">
                {THEME_VARIANTS.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => applyVariant(variant)}
                    className="rounded-lg border p-2 text-left hover:border-primary"
                  >
                    <div className="text-sm font-medium">{variant.name}</div>
                    <div className="text-[11px] text-slate-500">
                      {variant.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Brand colors</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  ["primary_color", "Primary"],
                  ["secondary_color", "Secondary"],
                  ["background_color", "Background"],
                  ["section_alt_bg", "Section BG"],
                  ["heading_color", "Heading"],
                  ["text_color", "Text"],
                ].map(([key, label]) => (
                  <div key={key} className="space-y-1">
                    <Label className="text-[11px]">{label}</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={style[key] || "#000000"}
                        onChange={(event) =>
                          setStyle((current) => ({
                            ...current,
                            [key]: event.target.value,
                          }))
                        }
                        className="h-8 w-10 rounded border"
                      />
                      <span className="text-[10px] font-mono">
                        {style[key]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Typography</Label>
              <div className="grid gap-2">
                <Select
                  value={style.font_family}
                  onValueChange={(value) =>
                    setStyle((current) => ({ ...current, font_family: value }))
                  }
                >
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="Body font" />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_OPTIONS.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={style.heading_font}
                  onValueChange={(value) =>
                    setStyle((current) => ({ ...current, heading_font: value }))
                  }
                >
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="Heading font" />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_OPTIONS.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {selectedSection && selectedRegistry && (
              <div className="space-y-3 rounded-lg border bg-slate-50 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold">
                      {selectedRegistry.label}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {selectedRegistry.description}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={selectedSection.is_visible}
                      onCheckedChange={() =>
                        toggleSectionVisibility(selectedSection.id)
                      }
                    />
                    <span className="text-xs">Visible</span>
                  </div>
                </div>

                {selectedRegistry.options.includes("title") && (
                  <div className="space-y-1">
                    <Label className="text-xs">Title</Label>
                    <Input
                      value={selectedSection.config?.title || ""}
                      onChange={(event) =>
                        updateSectionConfig(selectedSection.id, {
                          title: event.target.value,
                        })
                      }
                      className="h-9"
                    />
                  </div>
                )}

                {selectedRegistry.options.includes("subtitle") && (
                  <div className="space-y-1">
                    <Label className="text-xs">Subtitle</Label>
                    <Input
                      value={selectedSection.config?.subtitle || ""}
                      onChange={(event) =>
                        updateSectionConfig(selectedSection.id, {
                          subtitle: event.target.value,
                        })
                      }
                      className="h-9"
                    />
                  </div>
                )}

                {selectedRegistry.options.includes("columns") && (
                  <div className="space-y-1">
                    <Label className="text-xs">Columns</Label>
                    <Select
                      value={String(selectedSection.config?.columns || 3)}
                      onValueChange={(value) =>
                        updateSectionConfig(selectedSection.id, {
                          columns: Number(value),
                        })
                      }
                    >
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6].map((value) => (
                          <SelectItem key={value} value={String(value)}>
                            {value} columns
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {selectedRegistry.options.includes("limit") && (
                  <div className="space-y-1">
                    <Label className="text-xs">Item limit</Label>
                    <Input
                      type="number"
                      min={1}
                      max={24}
                      value={selectedSection.config?.limit || 3}
                      onChange={(event) =>
                        updateSectionConfig(selectedSection.id, {
                          limit: Number(event.target.value),
                        })
                      }
                      className="h-9"
                    />
                  </div>
                )}

                {selectedRegistry.options.includes("image_position") && (
                  <div className="space-y-1">
                    <Label className="text-xs">Image position</Label>
                    <Select
                      value={selectedSection.config?.image_position || "left"}
                      onValueChange={(value) =>
                        updateSectionConfig(selectedSection.id, {
                          image_position: value,
                        })
                      }
                    >
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="left">Left</SelectItem>
                        <SelectItem value="right">Right</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {selectedRegistry.options.includes("show_tabs") && (
                  <div className="flex items-center justify-between rounded border bg-white px-3 py-2">
                    <div>
                      <div className="text-sm font-medium">Show tabs</div>
                      <div className="text-[11px] text-slate-500">
                        All / Explorer / Event
                      </div>
                    </div>
                    <Switch
                      checked={Boolean(selectedSection.config?.show_tabs)}
                      onCheckedChange={(value) =>
                        updateSectionConfig(selectedSection.id, {
                          show_tabs: value,
                        })
                      }
                    />
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
