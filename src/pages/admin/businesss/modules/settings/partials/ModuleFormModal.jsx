import React, { useEffect, useRef, useState } from "react";
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
import { ImageIcon, Upload, Trash2, AlertCircle, Loader2, Save, Boxes, X } from "lucide-react";
import { toast } from "sonner";
import { useApiMutation } from "@/hooks/useAppMutation";
import useImageUpload from "@/hooks/use-image-upload";
import { generateSlug } from "@/lib/helper";
import { RICH_TEXT_VARIANTS, RichTextEditor } from "@/components/ui/rich-text-editor";

const emptyForm = {
  slug: "",
  title: "",
  sub_title: "",
  short_description: "",
  description: "",
  category_required: false,
  seo_content: {
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    og_title: "",
    og_description: "",
    og_image: "",
    twitter_title: "",
    twitter_description: "",
    twitter_image: "",
    canonical_url: "",
    robots: "index, follow",
  },
};

const ModuleFormModal = ({ open, onOpenChange, module, onSaved }) => {
  const [form, setForm] = useState(emptyForm);
  const [seoUseModuleImage, setSeoUseModuleImage] = useState(false);
  const isEdit = Boolean(module?.id);

  const ogFileInputRef = useRef(null);
  const twitterFileInputRef = useRef(null);

  const {
    image: imageBase64,
    preview,
    error: imageError,
    handleImageChange,
    resetImage,
    setImageUrl,
  } = useImageUpload(5);

  const {
    image: ogImageBase64,
    preview: ogImagePreview,
    error: ogImageError,
    handleImageChange: handleOgImageChange,
    resetImage: resetOgImage,
    setImageUrl: setOgImageUrl,
  } = useImageUpload(5);

  const {
    image: twitterImageBase64,
    preview: twitterImagePreview,
    error: twitterImageError,
    handleImageChange: handleTwitterImageChange,
    resetImage: resetTwitterImage,
    setImageUrl: setTwitterImageUrl,
  } = useImageUpload(5);

  const { mutate: createModule, isLoading: creating } = useApiMutation({
    url: "/admin/business-modules",
    method: "POST",
  });

  const { mutate: updateModule, isLoading: updating } = useApiMutation({
    url: `/admin/business-modules/${module?.id}`,
    method: "PUT",
  });

  const isSaving = creating || updating;

  useEffect(() => {
    setForm((prev) => ({ ...prev, slug: generateSlug(prev.title) }));
  }, [form.title]);

  useEffect(() => {
    if (!open) return;

    if (module) {
      const savedSeo = { ...emptyForm.seo_content, ...(module.meta?.seo_content || {}) };
      const usingModuleImage =
        Boolean(module.image) && savedSeo.og_image === module.image && savedSeo.twitter_image === module.image;
      console.log("module - ",module)
      setForm({
        slug: module.title_slug || "",
        title: module.title || "",
        sub_title: module.sub_title || "",
        short_description: module.short_description || "",
        description: module.description || "",
        category_required: Boolean(module.meta?.category_required),
        seo_content: savedSeo,
      });

      if (module.image) {
        setImageUrl({ image: module.image, preview: module.image_full_path });
      } else {
        resetImage();
      }

      setSeoUseModuleImage(usingModuleImage);
      if (usingModuleImage) {
        resetOgImage();
        resetTwitterImage();
      } else {
        setOgImageUrl({ image: savedSeo.og_image, preview: savedSeo.og_image });
        setTwitterImageUrl({ image: savedSeo.twitter_image, preview: savedSeo.twitter_image });
      }
    } else {
      setForm(emptyForm);
      resetImage();
      resetOgImage();
      resetTwitterImage();
      setSeoUseModuleImage(false);
    }
  }, [open, module]);

  useEffect(() => {
    if (!seoUseModuleImage) return;
    const moduleImageValue = imageBase64 || module?.image || "";
    setForm((prev) => ({
      ...prev,
      seo_content: { ...prev.seo_content, og_image: moduleImageValue, twitter_image: moduleImageValue },
    }));
  }, [seoUseModuleImage, imageBase64]);

  useEffect(() => {
    if (seoUseModuleImage || !ogImageBase64) return;
    setForm((prev) => ({ ...prev, seo_content: { ...prev.seo_content, og_image: ogImageBase64 } }));
  }, [ogImageBase64, seoUseModuleImage]);

  useEffect(() => {
    if (seoUseModuleImage || !twitterImageBase64) return;
    setForm((prev) => ({ ...prev, seo_content: { ...prev.seo_content, twitter_image: twitterImageBase64 } }));
  }, [twitterImageBase64, seoUseModuleImage]);

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const updateSeoField = (key, value) => setForm((prev) => ({ ...prev, seo_content: { ...prev.seo_content, [key]: value } }));

  const handleToggleSeoModuleImage = (checked) => {
    setSeoUseModuleImage(checked);
    if (checked) {
      resetOgImage();
      resetTwitterImage();
    }
  };

  const handleRemoveOgImage = () => {
    resetOgImage();
    updateSeoField("og_image", "");
  };

  const handleRemoveTwitterImage = () => {
    resetTwitterImage();
    updateSeoField("twitter_image", "");
  };

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
      module_type: "custom",
      meta: {
        seo_content: form.seo_content,
        category_required: form.category_required,
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
      console.log("Error -",error)
      toast.error(error.message || "Error saving module");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Boxes className="h-5 w-5 text-blue-600" />
            {isEdit ? "Edit Module" : "Create Module"}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? "Update the module details below" : "Fill in the details to create a new module"}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger className="cursor-pointer" value="general">General</TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="meta">Meta</TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="social">Open Graph & Twitter</TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <div className="mt-4 h-137.5 overflow-hidden hide-scrollbar">
            <TabsContent value="general" className="space-y-4 pt-4 h-full overflow-y-auto hide-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input value={form.title} onChange={(e) => updateField("title", e.target.value)} placeholder="Module title" />
                </div>
                <div className="space-y-2">
                  <Label>Module Slug</Label>
                  <Input value={form.slug} disabled placeholder="module-slug" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Sub Title</Label>
                <Input value={form.sub_title} onChange={(e) => updateField("sub_title", e.target.value)} placeholder="Sub title" />
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

            <TabsContent value="meta" className="space-y-4 pt-4 h-full overflow-y-auto hide-scrollbar">
              <div className="space-y-2">
                <Label>Meta Title</Label>
                <Input value={form.seo_content.meta_title} onChange={(e) => updateSeoField("meta_title", e.target.value)} placeholder="Meta title" />
              </div>
              <div className="space-y-2">
                <Label>Meta Description</Label>
                <Textarea
                  value={form.seo_content.meta_description}
                  onChange={(e) => updateSeoField("meta_description", e.target.value)}
                  rows={3}
                  placeholder="Meta description"
                />
              </div>
              <div className="space-y-2">
                <Label>Meta Keywords</Label>
                <Input
                  value={form.seo_content.meta_keywords}
                  onChange={(e) => updateSeoField("meta_keywords", e.target.value)}
                  placeholder="Comma separated keywords"
                />
              </div>
            </TabsContent>

            <TabsContent value="social" className="space-y-6 pt-4 h-full overflow-y-auto hide-scrollbar">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">Use Module Image for SEO</p>
                  <p className="text-xs text-muted-foreground">
                    Automatically use the module's image for Open Graph and Twitter previews
                  </p>
                </div>
                <Switch checked={seoUseModuleImage} onCheckedChange={handleToggleSeoModuleImage} />
              </div>

              <div className="space-y-4">
                <p className="text-sm font-semibold text-muted-foreground">Open Graph</p>
                <div className="space-y-2">
                  <Label>OG Title</Label>
                  <Input value={form.seo_content.og_title} onChange={(e) => updateSeoField("og_title", e.target.value)} placeholder="OG title" />
                </div>
                <div className="space-y-2">
                  <Label>OG Description</Label>
                  <Textarea
                    value={form.seo_content.og_description}
                    onChange={(e) => updateSeoField("og_description", e.target.value)}
                    rows={2}
                    placeholder="OG description"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>OG Image</Label>
                    {!seoUseModuleImage && (
                      <div className="flex items-center gap-2">
                        <Button type="button" size="sm" variant="outline" onClick={() => ogFileInputRef.current?.click()}>
                          <Upload className="h-4 w-4" />
                        </Button>
                        {form.seo_content.og_image && (
                          <Button type="button" size="sm" variant="destructive" onClick={handleRemoveOgImage}>
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                        <input
                          ref={ogFileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleOgImageChange}
                        />
                      </div>
                    )}
                  </div>

                  {seoUseModuleImage ? (
                    <div className="flex items-center gap-3 p-2 border rounded-lg bg-gray-50">
                      {preview ? (
                        <img src={preview} alt="Module" className="h-10 w-10 rounded object-cover" />
                      ) : (
                        <ImageIcon className="h-5 w-5 text-muted-foreground" />
                      )}
                      <p className="text-xs text-muted-foreground">Using the module image</p>
                    </div>
                  ) : (
                    <>
                      {ogImagePreview && (
                        <img src={ogImagePreview} alt="OG preview" className="h-20 w-auto rounded-md border object-cover" />
                      )}
                      <Input
                        value={form.seo_content.og_image}
                        onChange={(e) => updateSeoField("og_image", e.target.value)}
                        placeholder="https://..."
                      />
                      {ogImageError && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{ogImageError}</AlertDescription>
                        </Alert>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-semibold text-muted-foreground">Twitter</p>
                <div className="space-y-2">
                  <Label>Twitter Title</Label>
                  <Input
                    value={form.seo_content.twitter_title}
                    onChange={(e) => updateSeoField("twitter_title", e.target.value)}
                    placeholder="Twitter title"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Twitter Description</Label>
                  <Textarea
                    value={form.seo_content.twitter_description}
                    onChange={(e) => updateSeoField("twitter_description", e.target.value)}
                    rows={2}
                    placeholder="Twitter description"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Twitter Image</Label>
                    {!seoUseModuleImage && (
                      <div className="flex items-center gap-2">
                        <Button type="button" size="sm" variant="outline" onClick={() => twitterFileInputRef.current?.click()}>
                          <Upload className="h-4 w-4" />
                        </Button>
                        {form.seo_content.twitter_image && (
                          <Button type="button" size="sm" variant="destructive" onClick={handleRemoveTwitterImage}>
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                        <input
                          ref={twitterFileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleTwitterImageChange}
                        />
                      </div>
                    )}
                  </div>

                  {seoUseModuleImage ? (
                    <div className="flex items-center gap-3 p-2 border rounded-lg bg-gray-50">
                      {preview ? (
                        <img src={preview} alt="Module" className="h-10 w-10 rounded object-cover" />
                      ) : (
                        <ImageIcon className="h-5 w-5 text-muted-foreground" />
                      )}
                      <p className="text-xs text-muted-foreground">Using the module image</p>
                    </div>
                  ) : (
                    <>
                      {twitterImagePreview && (
                        <img src={twitterImagePreview} alt="Twitter preview" className="h-20 w-auto rounded-md border object-cover" />
                      )}
                      <Input
                        value={form.seo_content.twitter_image}
                        onChange={(e) => updateSeoField("twitter_image", e.target.value)}
                        placeholder="https://..."
                      />
                      {twitterImageError && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{twitterImageError}</AlertDescription>
                        </Alert>
                      )}
                    </>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4 pt-4 h-full overflow-y-auto hide-scrollbar">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">Category Required</p>
                  <p className="text-xs text-muted-foreground">Require a category selection for this module</p>
                </div>
                <Switch checked={form.category_required} onCheckedChange={(checked) => updateField("category_required", checked)} />
              </div>
              <div className="space-y-2">
                <Label>Canonical URL</Label>
                <Input
                  value={form.seo_content.canonical_url}
                  onChange={(e) => updateSeoField("canonical_url", e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label>Robots</Label>
                <Input value={form.seo_content.robots} onChange={(e) => updateSeoField("robots", e.target.value)} placeholder="index, follow" />
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="gap-2">
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