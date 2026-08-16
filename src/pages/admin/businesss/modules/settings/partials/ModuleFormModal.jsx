import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ImageIcon,
  Upload,
  Trash2,
  AlertCircle,
  Loader2,
  Save,
  Boxes,
  List,
  Info,
  Video,
  Music,
  User,
  ArrowLeftRight,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { useApiMutation } from "@/hooks/useAppMutation";
import useImageUpload from "@/hooks/use-image-upload";
import { generateSlug } from "@/lib/helper";
import { RICH_TEXT_VARIANTS, RichTextEditor } from "@/components/ui/rich-text-editor";
import { cn } from "@/lib/utils";
import DynamicIconPicker from "@/components/shear/DynamicIconPicker";
import { SearchableSelectPopover } from "@/components/ui/searchable-select-popover";

const listTypes = [
  { label: 'Default', value: 'default' },
  { label: 'Book', value: 'book' },
  { label: 'Simple', value: 'simple' },
];


// ---- Form state: শুধু module এর নিজস্ব content fields ----
const emptyForm = {
  slug: "",
  title: "",
  sub_title: "",
  short_description: "",
  description: "",
};

// ---- Meta state: এইখানে যা কিছু যোগ করবেন, সেটাই payload.meta এ চলে যাবে ----
// নতুন meta field লাগলে শুধু এখানে key-default value বসান, আর UI তে
// updateMetaField("new_key", value) কল করলেই কাজ শেষ।
const emptyMeta = {
  category_required: false,
  seo_enabled: true,
  sortable: true,
  sidebar_menu_icon: "",
  list_type: 'default',
};

// Each module type gets its own accent so the picker reads at a glance,
// not just a grid of identical grey tiles.
const MODULE_TYPES = [
  {
    key: "information",
    label: "Information",
    Icon: Info,
    description: "Static content blocks like about, policy, or FAQ text",
    accent: "text-sky-600",
    bg: "bg-sky-50",
    ring: "ring-sky-500",
    border: "border-sky-200",
    hoverBorder: "hover:border-sky-300",
  },
  {
    key: "list",
    label: "List",
    Icon: List,
    description: "A structured, sortable collection of items",
    accent: "text-violet-600",
    bg: "bg-violet-50",
    ring: "ring-violet-500",
    border: "border-violet-200",
    hoverBorder: "hover:border-violet-300",
  },
  {
    key: "image",
    label: "Image",
    Icon: ImageIcon,
    description: "Galleries, banners, or single image showcases",
    accent: "text-pink-600",
    bg: "bg-pink-50",
    ring: "ring-pink-500",
    border: "border-pink-200",
    hoverBorder: "hover:border-pink-300",
  },
  {
    key: "video",
    label: "Video",
    Icon: Video,
    description: "Embedded or uploaded video content",
    accent: "text-orange-600",
    bg: "bg-orange-50",
    ring: "ring-orange-500",
    border: "border-orange-200",
    hoverBorder: "hover:border-orange-300",
  },
  {
    key: "audio",
    label: "Audio",
    Icon: Music,
    description: "Podcasts, tracks, or other audio content",
    accent: "text-emerald-600",
    bg: "bg-emerald-50",
    ring: "ring-emerald-500",
    border: "border-emerald-200",
    hoverBorder: "hover:border-emerald-300",
  },
  {
    key: "user",
    label: "User",
    Icon: User,
    description: "Member, author, or profile-driven content",
    accent: "text-amber-600",
    bg: "bg-amber-50",
    ring: "ring-amber-500",
    border: "border-amber-200",
    hoverBorder: "hover:border-amber-300",
  },
];

const getModuleMeta = (key) => MODULE_TYPES.find((m) => m.key === key);

const ModuleFormModal = ({ open, onOpenChange, module, onSaved }) => {
  const [tab, setTab] = useState("general");
  const [form, setForm] = useState(emptyForm);
  const [meta, setMeta] = useState(emptyMeta);
  const [moduleType, setModuleType] = useState(module?.module_type || null);
  const isEdit = Boolean(module?.id);

  const {
    image: imageBase64,
    preview,
    error: imageError,
    handleImageChange,
    resetImage,
    setImageUrl,
  } = useImageUpload(5);

  const { mutate: createModule, isLoading: creating } = useApiMutation({
    url: "/admin/business-modules",
    method: "POST",
  });

  const isSaving = creating;

  useEffect(() => {
    setForm((prev) => ({ ...prev, slug: generateSlug(prev.title) }));
  }, [form.title]);

  useEffect(() => {
    if (!open) return;

    if (module) {
      setForm({
        slug: module.title_slug || "",
        title: module.title || "",
        sub_title: module.sub_title || "",
        short_description: module.short_description || "",
        description: module.description || "",
      });

      setMeta({
        category_required: Boolean(module.meta?.category_required),
        seo_enabled: module.meta?.seo_enabled ?? true,
        sortable: module.meta?.sortable ?? true,
        sidebar_menu_icon: module.meta?.sidebar_menu_icon || "",
        list_type: module.meta.list_type,
      });

      // initialize module type when editing
      setModuleType(module.module_type || null);

      if (module.image) {
        setImageUrl({ image: module.image, preview: module.image_full_path });
      } else {
        resetImage();
      }
    } else {
      setForm(emptyForm);
      setMeta(emptyMeta);
      resetImage();
      // reset module type when opening a fresh create modal
      setModuleType(null);
    }
  }, [open, module]);

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const updateMetaField = (key, value) => setMeta((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!form.slug.trim()) {
      toast.error("Module slug is required");
      return;
    }

    const payload = {
      id: module?.id || null,
      slug: form.slug.trim(),
      title: form.title.trim(),
      sub_title: form.sub_title.trim(),
      short_description: form.short_description.trim(),
      description: form.description,
      image: imageBase64 || module?.image || null,
      module_type: moduleType || "custom",
      meta: {
        ...meta,
      },
    };

    try {
      const response = await createModule(payload);
      if (response?.success) {
        toast.success(`Module ${isEdit ? "updated" : "created"} successfully`);
        onSaved?.();
        onOpenChange(false);
      } else {
        toast.error(response?.message || "Failed to save module");
      }
    } catch (error) {
      console.log("Error -", error);
      toast.error(error.message || "Error saving module");
    }
  };

  const selectedMeta = moduleType ? getModuleMeta(moduleType) : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto hide-scrollbar">
        <DialogHeader className="">
          <div className="flex items-center justify-between gap-2">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <Boxes className="h-5 w-5 text-blue-600" />
                {isEdit ? "Edit Module" : "Create Module"}
              </DialogTitle>
              <DialogDescription>
                {isEdit ? "Update the module details below" : "Fill in the details to create a new module"}
              </DialogDescription>
            </div>
            {moduleType ? (
              <div className="mr-8">
                <Button variant="outline" size="sm" onClick={() => setModuleType(null)} className="gap-1.5">
                  <ArrowLeftRight className="h-3.5 w-3.5" />
                  {moduleType ? selectedMeta?.label : "Change Type"}
                </Button>
              </div>
            ) : (
              <div className="mr-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setTab("general");
                    setModuleType(module?.module_type || "list");
                  }}
                  className="gap-1.5"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to General
                </Button>
              </div>
            )}
          </div>
        </DialogHeader>

        {!moduleType ? (
          <div className="">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {MODULE_TYPES.map(({ key, label, Icon, description, accent, bg, border, hoverBorder }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setModuleType(key)}
                  className={cn(
                    "group flex flex-col items-start gap-3 rounded-xl border bg-white p-4 text-left cursor-pointer",
                    "shadow-sm transition-all duration-200",
                    "hover:-translate-y-0.5 hover:shadow-md",
                    border,
                    hoverBorder
                  )}
                >
                  <div className={cn("flex h-11 w-11 items-center justify-center rounded-lg transition-colors", bg)}>
                    <Icon className={cn("h-5 w-5", accent)} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{label}</div>
                    <div className="mt-0.5 text-xs leading-snug text-muted-foreground">{description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <Tabs defaultValue={tab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger className="cursor-pointer" value="general">
                  General
                </TabsTrigger>
                <TabsTrigger className="cursor-pointer" value="advanced">
                  Advanced
                </TabsTrigger>
              </TabsList>

              <div className="mt-4 h-137.5 overflow-hidden hide-scrollbar">
                <TabsContent value="general" className="space-y-4 pt-4 h-full overflow-y-auto hide-scrollbar">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={form.title}
                        onChange={(e) => updateField("title", e.target.value)}
                        placeholder="Module title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Module Slug</Label>
                      <Input
                        value={form.slug}
                        onChange={(e) => updateField("slug", e.target.value)}
                        placeholder="module-slug"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Sub Title</Label>
                    <Input
                      value={form.sub_title}
                      onChange={(e) => updateField("sub_title", e.target.value)}
                      placeholder="Sub title"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Short Description</Label>
                    <Textarea
                      value={form.short_description}
                      onChange={(e) => updateField("short_description", e.target.value)}
                      rows={2}
                      placeholder="Short description"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <RichTextEditor
                      variant={RICH_TEXT_VARIANTS.SIMPLE}
                      value={form.description}
                      onChange={(content) => updateField("description", content)}
                      placeholder="Enter your module description"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Image</Label>
                    {preview ? (
                      <div className="relative overflow-hidden rounded-lg border bg-gray-50">
                        <div className="flex h-40 w-full items-center justify-center bg-gray-100">
                          <img src={preview} alt="Module" className="max-h-full max-w-full object-contain" />
                        </div>
                        <div className="absolute top-2 right-2">
                          <Button type="button" variant="destructive" size="sm" onClick={resetImage} className="gap-1">
                            <Trash2 className="h-4 w-4" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex h-40 flex-col items-center justify-center rounded-lg border-2 border-dashed bg-gray-50/30 p-6 hover:border-primary transition-colors">
                        <Upload className="h-10 w-10 text-muted-foreground mb-3" />
                        <Label
                          htmlFor="module-image-upload"
                          className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
                        >
                          <ImageIcon className="h-4 w-4" />
                          Choose Image
                        </Label>
                        <input
                          id="module-image-upload"
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </div>
                    )}
                    {imageError && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{imageError}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="advanced" className="space-y-4 pt-4 h-full overflow-y-auto hide-scrollbar">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Category Required</p>
                      <p className="text-xs text-muted-foreground">Require a category selection for this module</p>
                    </div>
                    <Switch
                      checked={meta.category_required}
                      onCheckedChange={(checked) => updateMetaField("category_required", checked)}
                    />
                  </div>
                  {
                    moduleType === 'list' && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="w-[70%]">
                          <p className="text-sm font-medium">Chose Your Listing Type</p>
                          <p className="text-xs text-muted-foreground">Default listing type are module default . available listing type have book,simple_list etc...</p>
                        </div>
                        <div className="w-[30%]">
                           <SearchableSelectPopover
                              items={listTypes}
                              value={meta.list_type}
                              onSelect={(value) => updateMetaField("list_type", value)}
                              placeholder="Select List Type"
                              searchPlaceholder="Search list type..."
                              emptyText="No list type found."
                            />
                        </div>
                       
                      </div>
                    )
                  }


                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">SEO enabled</p>
                      <p className="text-xs text-muted-foreground">Enable SEO for this module (default: true)</p>
                    </div>
                    <Switch
                      checked={meta.seo_enabled ?? true}
                      onCheckedChange={(checked) => updateMetaField("seo_enabled", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Sortable</p>
                      <p className="text-xs text-muted-foreground">
                        Allow sorting of items in this module (default: true)
                      </p>
                    </div>
                    <Switch
                      checked={meta.sortable ?? true}
                      onCheckedChange={(checked) => updateMetaField("sortable", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Sidebar menu icon</p>
                      <p className="text-xs text-muted-foreground">Display an icon in the sidebar for this module</p>
                    </div>
                    <DynamicIconPicker
                      value={meta.sidebar_menu_icon}
                      onChange={(value) => updateMetaField("sidebar_menu_icon", value)}
                    />
                  </div>

                  {/*
                    নতুন meta field যোগ করতে চাইলে:
                    1. উপরে emptyMeta object এ default value যোগ করুন
                    2. initialize useEffect এ module.meta থেকে সেই key পড়ুন
                    3. এখানে একটা Switch/Input বসিয়ে updateMetaField("key", value) কল করুন
                    payload বানানোর জায়গায় কিছু বদলাতে হবে না, কারণ পুরো meta state ই spread হয়ে যায়।
                  */}
                </TabsContent>
              </div>
            </Tabs>
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!moduleType || isSaving} className="gap-2">
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {isEdit ? "Update Module" : "Create Module"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModuleFormModal;