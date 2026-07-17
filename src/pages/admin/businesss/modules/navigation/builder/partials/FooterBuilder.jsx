import { useState, useRef, useEffect } from "react";
import { DragDropProvider } from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";
import { CollisionPriority } from "@dnd-kit/abstract";
import { move } from "@dnd-kit/helpers";
import { Badge } from "lucide-react";
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

  // const addCustomLink = (colId) => {
  //   const label = prompt("Link label:");
  //   if (!label) return;
  //   const url = prompt("URL:");
  //   if (!url) return;
  //   setLinks((l) => ({
  //     ...l,
  //     [colId]: [
  //       ...(l[colId] || []),
  //       { id: newId("l"), page_id: null, label, url, target: "_blank" },
  //     ],
  //   }));
  // };

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
        <p className="text-xs text-slate-400 mb-2">Preview</p>
        <div className="rounded-xl bg-slate-900 text-slate-300 p-6">
          <div
            className="grid gap-6 text-sm"
            style={{
              gridTemplateColumns: `repeat(${Math.max(columns.length, 1)}, minmax(0, 1fr))`,
            }}
          >
            {columns.map((col) => (
              <div key={col.id}>
                <h4 className="text-white font-semibold text-xs mb-2 uppercase tracking-wide">
                  {col.title}
                </h4>
                {col.type === "links" && (
                  <ul className="space-y-1.5">
                    {(links[col.id] || []).map((it) => (
                      <li
                        key={it.id}
                        className="text-xs hover:text-white cursor-pointer"
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
                        onError={(e) =>
                          (e.currentTarget.style.display = "none")
                        }
                      />
                    )}
                    <p className="text-xs">{col.config?.about_text}</p>
                  </div>
                )}
                {col.type === "contact" && (
                  <ul className="space-y-1.5 text-xs">
                    {col.config?.show_email && <li>✉ {col.config.email}</li>}
                    {col.config?.show_phone && <li>☎ {col.config.phone}</li>}
                    {col.config?.show_location && (
                      <li>⚲ {col.config.location}</li>
                    )}
                  </ul>
                )}
                {col.type === "social" && (
                  <ul className="space-y-1.5 text-xs">
                    {SOCIAL_KEYS.filter(
                      ({ key }) => col.config?.[key]?.enabled,
                    ).map(({ key, label }) => (
                      <li key={key} className="hover:text-white">
                        {label}
                      </li>
                    ))}
                  </ul>
                )}
                {col.type === "custom_text" && (
                  <p className="text-xs whitespace-pre-line">
                    {col.config?.text}
                  </p>
                )}
              </div>
            ))}
          </div>
          <div className="border-t border-slate-700 mt-5 pt-3 text-[11px] text-slate-500 text-center">
            {current.copyright_text}
          </div>
        </div>
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
