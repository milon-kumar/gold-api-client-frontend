import React, { useState, useEffect } from "react";
import { useApiQuery } from "@/hooks/useAppQuery";
import { useApiMutation } from "@/hooks/useAppMutation";
import { useParams, useNavigate } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Sparkles, LayoutGrid, Loader2, icons } from "lucide-react";
import { toast } from "sonner";

const DEFAULT_FORM = {
  name: "",
  slug: "",
  icon: "LayoutGrid",
  color: "from-purple-500 to-purple-600",
  group_name: "",
  group_slug: "",
  group_sort_order: 1,
  sort_order: 1,
  status: "active",
  is_core: false,
  meta: "",
};

const slugify = (str = "") =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const STATUS_STYLES = {
  active:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  inactive: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
  draft: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
};

const Save = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [form, setForm] = useState(DEFAULT_FORM);
  const [slugTouched, setSlugTouched] = useState(false);
  const [groupSlugTouched, setGroupSlugTouched] = useState(false);
  const [errors, setErrors] = useState({});

  const {
    data: moduleResponse,
    isLoading: moduleLoading,
    error: moduleError,
    refetch: moduleRefetch,
  } = useApiQuery({
    url: `admin/modules/${id}`,
    enabled: isEditMode,
  });

  useEffect(() => {
    const module = moduleResponse?.data?.data;
    if (!module) return;

    setForm({
      name: module.name ?? "",
      slug: module.slug ?? "",
      icon: module.icon ?? "LayoutGrid",
      color: module.color ?? DEFAULT_FORM.color,
      group_name: module.group_name ?? "",
      group_slug: module.group_slug ?? "",
      group_sort_order: module.group_sort_order ?? 1,
      sort_order: module.sort_order ?? 1,
      status: module.status ?? "active",
      is_core: !!module.is_core,
      meta: module.meta
        ? typeof module.meta === "string"
          ? module.meta
          : JSON.stringify(module.meta, null, 2)
        : "",
    });
    // Existing records shouldn't have their slugs auto-overwritten
    setSlugTouched(true);
    setGroupSlugTouched(true);
  }, [moduleResponse]);

  // ---- Save mutation ----
  const { mutate: saveModule, isPending: isSaving } = useApiMutation({
    url: `admin/modules`,
    method: "POST",
  });

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleNameChange = (value) => {
    setForm((prev) => ({
      ...prev,
      name: value,
      slug: slugTouched ? prev.slug : slugify(value),
    }));
  };

  const handleGroupNameChange = (value) => {
    setForm((prev) => ({
      ...prev,
      group_name: value,
      group_slug: groupSlugTouched ? prev.group_slug : slugify(value),
    }));
  };

  const handleSave = async () => {
    const payload = {
      ...form,
      id: id || null,
      group_sort_order: Number(form.group_sort_order) || 0,
      sort_order: Number(form.sort_order) || 0,
      meta: form.meta.trim() ? JSON.parse(form.meta) : null,
    };

    console.log("Payload - ", payload);
    const response = await saveModule(payload);

    if (response.success) {
      await moduleRefetch();
      toast.success(response.message || "Module save successfully.");
    }
  };

  const PreviewIcon = icons[form.icon] || LayoutGrid;

  if (isEditMode && moduleLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground gap-2">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading module...
      </div>
    );
  }

  if (isEditMode && moduleError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-sm text-destructive">Failed to load this module.</p>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Go back
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-y-1 gap-3">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {isEditMode ? "Edit Navigation Item" : "Create Navigation Item"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isEditMode
                ? "Update this page, dashboard link, or module in your system routing."
                : "Add a new page, dashboard link, or module to your system routing."}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            className={"rounded-[5px]"}
            variant="disctrive"
            onClick={() => navigate(-1)}
            disabled={isSaving}
          >
            Go back
          </Button>
          <Button
            className={"rounded-[5px]"}
            onClick={handleSave}
            disabled={isSaving}
            size="lg"
          >
            {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {isEditMode ? "Update Module" : "Save Module"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
              <CardDescription>
                Configure the user-facing details for this item.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Display Name</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Analytics Dashboard"
                    aria-invalid={!!errors.name}
                  />
                  {errors.name && (
                    <p className="text-xs text-destructive">{errors.name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug (URL Path)</Label>
                  <Input
                    id="slug"
                    value={form.slug}
                    onChange={(e) => {
                      setSlugTouched(true);
                      setField("slug", slugify(e.target.value));
                    }}
                    placeholder="e.g. analytics-dashboard"
                    aria-invalid={!!errors.slug}
                  />
                  {errors.slug && (
                    <p className="text-xs text-destructive">{errors.slug}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="icon">Lucide Icon Name</Label>
                  <div className="relative">
                    <Input
                      id="icon"
                      value={form.icon}
                      onChange={(e) => setField("icon", e.target.value)}
                      placeholder="e.g. LayoutDashboard"
                      className="pr-10"
                    />
                    <span className="absolute right-3 top-2.5 text-muted-foreground text-xs font-mono">
                      <PreviewIcon className="h-4 w-4" />
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Theme Color / Gradient CSS</Label>
                  <Input
                    id="color"
                    value={form.color}
                    onChange={(e) => setField("color", e.target.value)}
                    placeholder="e.g. from-blue-500 to-cyan-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Group & Sorting</CardTitle>
              <CardDescription>
                Determine where this item lives inside your navigation layout
                tree.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="group_name">Parent Group Name</Label>
                  <Input
                    id="group_name"
                    value={form.group_name}
                    onChange={(e) => handleGroupNameChange(e.target.value)}
                    placeholder="e.g. Management"
                    aria-invalid={!!errors.group_name}
                  />
                  {errors.group_name && (
                    <p className="text-xs text-destructive">
                      {errors.group_name}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="group_slug">Parent Group Slug</Label>
                  <Input
                    id="group_slug"
                    value={form.group_slug}
                    onChange={(e) => {
                      setGroupSlugTouched(true);
                      setField("group_slug", slugify(e.target.value));
                    }}
                    placeholder="e.g. management"
                    aria-invalid={!!errors.group_slug}
                  />
                  {errors.group_slug && (
                    <p className="text-xs text-destructive">
                      {errors.group_slug}
                    </p>
                  )}
                </div>
              </div>

              <Separator className="my-2" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="group_sort_order">
                    Group Order Placement
                  </Label>
                  <Input
                    id="group_sort_order"
                    type="number"
                    min={0}
                    value={form.group_sort_order}
                    onChange={(e) =>
                      setField("group_sort_order", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sort_order">Item Order Within Group</Label>
                  <Input
                    id="sort_order"
                    type="number"
                    min={0}
                    value={form.sort_order}
                    onChange={(e) => setField("sort_order", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column - Status, Metadata & Live Preview */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System & Visibility Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(value) => setField("status", value)}
                >
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="flex items-center justify-between space-x-2">
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="is_core">Core Architecture Module</Label>
                  <p className="text-xs text-muted-foreground">
                    If toggled, this feature cannot be disabled by standard
                    users.
                  </p>
                </div>
                <Switch
                  id="is_core"
                  checked={form.is_core}
                  onCheckedChange={(checked) => setField("is_core", checked)}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="meta">Extended Meta Metadata (JSON)</Label>
                <textarea
                  id="meta"
                  value={form.meta}
                  onChange={(e) => setField("meta", e.target.value)}
                  placeholder='{"roles": ["admin"], "hidden": false}'
                  className="flex min-h-20 w-full rounded-[5px] border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                />
                {errors.meta && (
                  <p className="text-xs text-destructive">{errors.meta}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Live preview driven by form state */}
          <Card className="bg-slate-50 dark:bg-slate-900 border-dashed">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-semibold tracking-wider text-muted-foreground uppercase flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-purple-500" /> Card UI Live
                Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-3 rounded-[5px] bg-white dark:bg-black border shadow-sm">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2.5 rounded-[5px] bg-linear-to-br ${form.color} text-white`}
                  >
                    <PreviewIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">
                      {form.name || "Untitled"} 
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {form.group_name || "No group"}
                    </div>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className={`capitalize ${STATUS_STYLES[form.status] || ""}`}
                >
                  {form.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Save;
