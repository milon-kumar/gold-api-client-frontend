import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import * as LucideIcons from "lucide-react";
import { toast } from "sonner";

import { useApiQuery } from "@/hooks/useAppQuery";
import { useApiMutation } from "@/hooks/useAppMutation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// A handful of ready-made gradients — the "color" field just needs Tailwind
// `from-*`/`to-*` classes, custom values are also allowed.
const COLOR_PRESETS = [
  { label: "Indigo", value: "from-indigo-500 to-indigo-600" },
  { label: "Emerald", value: "from-emerald-500 to-emerald-600" },
  { label: "Amber", value: "from-amber-500 to-amber-600" },
  { label: "Rose", value: "from-rose-500 to-rose-600" },
  { label: "Sky", value: "from-sky-500 to-sky-600" },
  { label: "Purple", value: "from-purple-500 to-purple-600" },
  { label: "Slate", value: "from-slate-500 to-slate-600" },
];

const slugify = (str = "") =>
  str
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const emptyForm = () => ({
  name: "",
  slug: "",
  icon: "Box",
  color: COLOR_PRESETS[0].value,
  group_name: "",
  group_slug: "",
  group_sort_order: 0,
  sort_order: 0,
  status: "active",
  is_core: false,
  meta: "{}", // kept as a raw JSON string in the form, parsed on submit
});

const ModuleSave = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id && id !== "new";

  const [form, setForm] = useState(emptyForm());
  const [metaError, setMetaError] = useState("");

  const { data: response, isLoading: loadingModule } = useApiQuery({
    url: `/admin/modules/${id}`,
    enabled: isEditMode,
  });

  const { mutate: saveModule, isLoading: saving } = useApiMutation({
    url: "/admin/modules",
    method: "POST", // store() handles both create & update via `id`
  });

  useEffect(() => {
    if (!response?.data?.data) return;
    const m = response.data.data;

    setForm({
      name: m.name || "",
      slug: m.slug || "",
      icon: m.icon || "Box",
      color: m.color || COLOR_PRESETS[0].value,
      group_name: m.group_name || "",
      group_slug: m.group_slug || "",
      group_sort_order: m.group_sort_order ?? 0,
      sort_order: m.sort_order ?? 0,
      status: m.status || "active",
      is_core: !!m.is_core,
      meta: m.meta ? JSON.stringify(m.meta, null, 2) : "{}",
    });
  }, [response]);

  const set = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  // Slug auto-follows the name until the user edits the slug by hand.
  const handleNameChange = (value) => {
    setForm((prev) => ({
      ...prev,
      name: value,
      slug: prev.slug === slugify(prev.name) ? slugify(value) : prev.slug,
    }));
  };

  const handleGroupNameChange = (value) => {
    setForm((prev) => ({
      ...prev,
      group_name: value,
      // Only auto-fill the slug while it hasn't been hand-edited away from the derived value
      group_slug: prev.group_slug === slugify(prev.group_name) ? slugify(value) : prev.group_slug,
    }));
  };

  const IconPreview = LucideIcons[form.icon] || LucideIcons.Box;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }

    // Validate meta JSON before sending
    let metaParsed = {};
    if (form.meta.trim()) {
      try {
        metaParsed = JSON.parse(form.meta);
        setMetaError("");
      } catch (err) {
        setMetaError("Meta must be valid JSON.");
        toast.error("Fix the Meta field — it must be valid JSON.");
        return;
      }
    }

    const payload = {
      id: isEditMode ? id : undefined,
      name: form.name,
      slug: form.slug || slugify(form.name),
      icon: form.icon,
      color: form.color,
      group_name: form.group_name,
      group_slug: form.group_slug || slugify(form.group_name),
      group_sort_order: Number(form.group_sort_order) || 0,
      sort_order: Number(form.sort_order) || 0,
      status: form.status,
      is_core: !!form.is_core,
      meta: metaParsed,
    };

    const res = await saveModule(payload);
    if (res?.success) {
      toast.success(res?.message || (isEditMode ? "Module updated" : "Module created"));
      navigate("/admin/modules");
    } else {
      toast.error(res?.message || "Failed to save module");
    }
  };

  if (isEditMode && loadingModule) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="w-full mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/admin/modules")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {isEditMode ? "Edit Module" : "Add Module"}
          </h1>
          <p className="text-muted-foreground">
            {isEditMode ? "Update this module's details" : "Add a new module to the catalog"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Name, icon and visual identity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Title *</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g., Notice Board"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={form.slug}
                  onChange={(e) => set("slug", slugify(e.target.value))}
                  placeholder="notice-board"
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Auto-filled from the title — edit it directly to override.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="icon">Icon (Lucide name)</Label>
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-md border bg-muted shrink-0">
                    <IconPreview className="h-4 w-4" />
                  </span>
                  <Input
                    id="icon"
                    value={form.icon}
                    onChange={(e) => set("icon", e.target.value)}
                    placeholder="e.g., FolderOpen"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Must match a component name from{" "}
                  <a
                    href="https://lucide.dev/icons"
                    target="_blank"
                    rel="noreferrer"
                    className="underline"
                  >
                    lucide.dev/icons
                  </a>{" "}
                  (PascalCase).
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex flex-wrap items-center gap-2">
                {COLOR_PRESETS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => set("color", c.value)}
                    title={c.label}
                    className={`h-8 w-8 rounded-full bg-linear-to-br ${c.value} border-2 transition-all ${
                      form.color === c.value
                        ? "border-slate-900 scale-110"
                        : "border-transparent hover:scale-105"
                    }`}
                  />
                ))}
              </div>
              <Input
                value={form.color}
                onChange={(e) => set("color", e.target.value)}
                placeholder="from-indigo-500 to-indigo-600"
                className="font-mono text-xs mt-1"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Group & Ordering</CardTitle>
            <CardDescription>Controls how modules are grouped and sorted in listings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="group_name">Group Name</Label>
                <Input
                  id="group_name"
                  value={form.group_name}
                  onChange={(e) => handleGroupNameChange(e.target.value)}
                  placeholder="e.g., Content"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="group_slug">Group Slug</Label>
                <Input
                  id="group_slug"
                  value={form.group_slug}
                  onChange={(e) => set("group_slug", e.target.value)}
                  placeholder="content"
                  className="font-mono text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="group_sort_order">Group Sort Order</Label>
                <Input
                  id="group_sort_order"
                  type="number"
                  value={form.group_sort_order}
                  onChange={(e) => set("group_sort_order", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sort_order">Sort Order</Label>
                <Input
                  id="sort_order"
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => set("sort_order", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status & Access</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={form.status} onValueChange={(v) => set("status", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Core Module</Label>
                <div className="flex items-center justify-between rounded-lg border p-3 h-9.5">
                  <span className="text-sm text-muted-foreground">
                    Always assigned, cannot be unassigned
                  </span>
                  <Switch
                    checked={form.is_core}
                    onCheckedChange={(v) => set("is_core", v)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Meta (JSON)</CardTitle>
            <CardDescription>
              Free-form settings for this module — must be valid JSON.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Textarea
              value={form.meta}
              onChange={(e) => {
                set("meta", e.target.value);
                if (metaError) setMetaError("");
              }}
              rows={8}
              className="font-mono text-xs"
              placeholder='{ "key": "value" }'
            />
            {metaError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{metaError}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-4 pt-2 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/modules")}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditMode ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {isEditMode ? "Update Module" : "Create Module"}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ModuleSave;