// Save.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router';
import { toast } from "sonner";
import useImageUpload from '@/hooks/use-image-upload';

// ShadCN Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Alert,
  AlertDescription,
} from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import PageHeader from '@/components/shear/PageHeader';
import StatusBadge from '@/components/shear/StatusBadge';
import { useApiQuery } from '@/hooks/useAppQuery';
import { useApiMutation } from '@/hooks/useAppMutation';
import { MODULES } from '@/store/default/modules';

// Icons
import {
  Save as SaveIcon,
  Image as ImageIcon,
  Loader2,
  Star,
  AlertCircle,
  CheckCircle,
  Upload,
  Trash2,
  Info,
  Settings,
  Calendar,
  Building2,
  FileText,
  Search,
  Share2,
} from 'lucide-react';
import {FiTwitter as Twitter,} from 'react-icons/fi';
import { RICH_TEXT_VARIANTS, RichTextEditor } from '@/components/ui/rich-text-editor';

/* ------------------------------------------------------------------
   Same SEO shape used across the app (module settings, footer, etc.)
   Saved into meta.seo_content on the backend.
------------------------------------------------------------------ */
const emptySeoContent = () => ({
  meta_title: '',
  meta_description: '',
  meta_keywords: '',
  og_title: '',
  og_description: '',
  og_image: '',
  twitter_title: '',
  twitter_description: '',
  twitter_image: '',
  canonical_url: '',
  robots: 'index, follow',
});

const Save = () => {
  const { module, setting } = useSelector((state) => state);
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [existingImageUrl, setExistingImageUrl] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    sub_title: '',
    sub_description: '',
    description: '',
    is_featured: false,
    status: 'active',
    seo_content: emptySeoContent(),
  });

  // Image upload hook
  const {
    image: imageBase64,
    preview,
    error: imageError,
    handleImageChange,
    resetImage,
    setImageUrl
  } = useImageUpload(setting?.setting?.item?.image_size || 5);

  // OG / Twitter image — each can either reuse the organization's own image,
  // or have its own uploaded image. Default: use the organization image.
  const [ogUseItemImage, setOgUseItemImage] = useState(true);
  const [twitterUseItemImage, setTwitterUseItemImage] = useState(true);

  const ogImageUpload = useImageUpload(setting?.setting?.item?.image_size || 5);
  const twitterImageUpload = useImageUpload(setting?.setting?.item?.image_size || 5);

  // Fetch item data for edit mode
  const {
    data: itemGetQuery,
    isLoading: itemGetLoading,
  } = useApiQuery({
    url: `/admin/business-module-items/${id}`,
    enabled: !!id,
    params: {
      module_slug: MODULES.ORGANIZATIONS
    }
  });

  useEffect(() => {
    if (!itemGetQuery?.success) return;
    const item = itemGetQuery.data;

    setFormData({
      title: item.title || '',
      sub_title: item.sub_title || '',
      sub_description: item.sub_description || '',
      description: item.description || '',
      is_featured: item.is_featured || false,
      status: item.status || 'active',
      seo_content: {
        ...emptySeoContent(),
        ...(item.meta?.seo_content || {}),
      },
    });

    if (item.image) {
      setExistingImageUrl(item.image);
      setImageUrl({
        image: item?.image,
        preview: item?.image_full_path
      });
    }

    // OG image: if a custom one was saved before, load it and switch out of "use organization image"
    const savedOgImage = item.meta?.seo_content?.og_image;
    if (savedOgImage) {
      setOgUseItemImage(false);
      ogImageUpload.setImageUrl({ image: savedOgImage, preview: savedOgImage });
    } else {
      setOgUseItemImage(true);
    }

    // Twitter image: same logic
    const savedTwitterImage = item.meta?.seo_content?.twitter_image;
    if (savedTwitterImage) {
      setTwitterUseItemImage(false);
      twitterImageUpload.setImageUrl({ image: savedTwitterImage, preview: savedTwitterImage });
    } else {
      setTwitterUseItemImage(true);
    }
  }, [itemGetQuery]);

  // Create/Update mutation
  const {
    mutate: itemMutation,
    isLoading: itemMutationLoading,
  } = useApiMutation({
    url: "/admin/business-module-items",
    method: 'POST',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSwitchChange = (checked) => {
    setFormData(prev => ({
      ...prev,
      is_featured: checked
    }));
  };

  const handleStatusChange = (value) => {
    setFormData(prev => ({
      ...prev,
      status: value
    }));
  };

  // SEO field change — keeps seo_content nested and isolated from the rest of the form
  const handleSeoChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      seo_content: {
        ...prev.seo_content,
        [field]: value,
      },
    }));
  };

  const handleToggleOgUseItemImage = (checked) => {
    setOgUseItemImage(checked);
    if (checked) ogImageUpload.resetImage();
  };

  const handleToggleTwitterUseItemImage = (checked) => {
    setTwitterUseItemImage(checked);
    if (checked) twitterImageUpload.resetImage();
  };

  // Resolves the final value to save for an SEO image:
  // - "use organization image" -> empty string (frontend/backend falls back to the item image)
  // - custom -> newly uploaded base64, or the previously saved value if nothing new was chosen
  const resolveSeoImageValue = (useItemImage, uploadState, storedValue) => {
    if (useItemImage) return '';
    return uploadState.image || storedValue || '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    setSaving(true);

    const payload = {
      id: id && id !== 'new' ? id : undefined,
      module_slug: MODULES?.ORGANIZATIONS || 'organizations',
      title: formData.title,
      sub_title: formData.sub_title,
      sub_description: formData.sub_description,
      description: formData.description,
      is_featured: formData.is_featured ? 1 : 0,
      status: formData.status,
      image: imageBase64 || null,
      meta: {
        seo_content: {
          ...formData.seo_content,
          og_image: resolveSeoImageValue(ogUseItemImage, ogImageUpload, formData.seo_content.og_image),
          twitter_image: resolveSeoImageValue(twitterUseItemImage, twitterImageUpload, formData.seo_content.twitter_image),
        },
      },
    };

    try {
      const response = await itemMutation(payload);
      if (response?.success) {
        toast.success(response?.message || "Organization saved successfully");
        navigate('/admin/organizations');
      } else {
        toast.error(response?.message || "Failed to save organization");
      }
    } catch (error) {
      console.error('Error saving organization:', error);
      toast.error('Error saving organization data');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveImage = () => {
    resetImage();
    setExistingImageUrl('');
  };

  const currentImagePreview = preview || (existingImageUrl ? existingImageUrl : null);

  if (itemGetLoading) {
    return (
      <div className="w-full min-h-screen bg-gray-50">
        <div className="space-y-4 p-6">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-96 bg-white rounded-lg animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title={id && id !== 'new' ? 'Edit Organization' : 'Add New Organization'}
        subtitle={id && id !== 'new' ? `Update organization information` : `Add a new organization to the module`}
        showBackButton={true}
        onBackClick={() => navigate('/admin/organizations')}
        primaryAction={{
          onClick: handleSubmit,
          disabled: saving,
          icon: 'save',
          title: id && id !== 'new' ? 'Update Organization' : 'Create Organization'
        }}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information Card */}
            <Card className="shadow-sm">
              <CardHeader className="border-b bg-gray-50/50">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Info className="h-5 w-5 text-blue-600" />
                  Organization Information
                </CardTitle>
                <CardDescription>
                  Enter the organization details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div>
                  <Label htmlFor="title" className="text-sm font-semibold">
                    Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter organization name"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="sub_title" className="text-sm font-semibold">Sub Title</Label>
                  <Input
                    id="sub_title"
                    name="sub_title"
                    value={formData.sub_title}
                    onChange={handleInputChange}
                    placeholder="Enter sub title (optional)"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="sub_description" className="text-sm font-semibold">Short Description</Label>
                  <Textarea
                    id="sub_description"
                    name="sub_description"
                    value={formData.sub_description}
                    onChange={handleInputChange}
                    placeholder="Enter a brief description"
                    rows="3"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-sm font-semibold">Full Description</Label>
                  <RichTextEditor
                    variant={RICH_TEXT_VARIANTS.SIMPLE}
                    name="description"
                    value={formData.description}
                    onChange={(content) => {
                      handleInputChange({
                        target:{
                          name:'description',
                          value: content
                        }
                      })
                    }}
                  />
                  {/* <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter detailed description"
                    rows="5"
                    className="mt-1.5"
                  /> */}
                </div>
              </CardContent>
            </Card>

            {/* Status & Settings Card */}
            <Card className="shadow-sm">
              <CardHeader className="border-b bg-gray-50/50">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Settings className="h-5 w-5 text-orange-600" />
                  Status & Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="font-semibold">Featured</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Mark this organization as featured
                    </p>
                  </div>
                  <Switch
                    checked={formData.is_featured}
                    onCheckedChange={handleSwitchChange}
                  />
                </div>

                <Separator />

                <div>
                  <Label htmlFor="status" className="text-sm font-semibold">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={handleStatusChange}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="mt-2">
                    <StatusBadge status={formData.status} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Image Upload */}
          <div className="lg:col-span-1 space-y-6">
            {/* Image Card */}
            <Card className="shadow-sm">
              <CardHeader className="border-b bg-gray-50/50">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <ImageIcon className="h-5 w-5 text-green-600" />
                  Logo / Image
                </CardTitle>
                <CardDescription>
                  Upload a logo or image (Max {setting?.setting?.item?.image_size || 5}MB)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                {currentImagePreview ? (
                  <div className="relative">
                    <div className="relative overflow-hidden rounded-lg border bg-gray-50">
                      <div className="flex h-64 w-full items-center justify-center bg-gray-100">
                        <img
                          src={currentImagePreview}
                          alt="Preview"
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div className="absolute top-2 right-2">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={handleRemoveImage}
                          className="gap-1"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-64 flex-col items-center justify-center rounded-lg border-2 border-dashed bg-gray-50/30 p-6 transition-colors hover:border-primary">
                    <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                    <Label
                      htmlFor="image-upload"
                      className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
                    >
                      <ImageIcon className="h-4 w-4" />
                      Choose Image
                    </Label>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <p className="mt-3 text-sm text-muted-foreground text-center">
                      Click to browse or drag and drop
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground text-center">
                      Supported formats: JPEG, PNG, WebP, GIF
                    </p>
                  </div>
                )}

                {imageError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{imageError}</AlertDescription>
                  </Alert>
                )}

                {imageBase64 && !imageError && (
                  <Alert>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <AlertDescription className="text-sm">
                      Image loaded successfully! Ready to upload.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>


            {/* SEO Card — same shape/pattern as the module & footer SEO content (meta.seo_content) */}
            <Card className="shadow-sm">
              <CardHeader className="border-b bg-gray-50/50">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Search className="h-5 w-5 text-emerald-600" />
                  SEO Settings
                </CardTitle>
                <CardDescription>
                  Controls how this organization appears in search results and when shared.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Tabs defaultValue="general">
                  <TabsList>
                    <TabsTrigger value="general">
                      <Search className="w-3.5 h-3.5 mr-1" /> General
                    </TabsTrigger>
                    <TabsTrigger value="og">
                      <Share2 className="w-3.5 h-3.5 mr-1" /> Open Graph
                    </TabsTrigger>
                    <TabsTrigger value="twitter">
                      <Twitter className="w-3.5 h-3.5 mr-1" /> Twitter
                    </TabsTrigger>
                  </TabsList>

                  {/* -------- General -------- */}
                  <TabsContent value="general" className="space-y-4 pt-4">
                    <div>
                      <Label className="text-sm font-semibold">Meta Title</Label>
                      <Input
                        value={formData.seo_content.meta_title}
                        onChange={(e) => handleSeoChange('meta_title', e.target.value)}
                        placeholder="Title shown in search engine results"
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">Meta Description</Label>
                      <Textarea
                        value={formData.seo_content.meta_description}
                        onChange={(e) => handleSeoChange('meta_description', e.target.value)}
                        placeholder="A short summary shown under the title in search results"
                        rows="3"
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">Meta Keywords</Label>
                      <Input
                        value={formData.seo_content.meta_keywords}
                        onChange={(e) => handleSeoChange('meta_keywords', e.target.value)}
                        placeholder="Comma separated keywords"
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">Canonical URL</Label>
                      <Input
                        value={formData.seo_content.canonical_url}
                        onChange={(e) => handleSeoChange('canonical_url', e.target.value)}
                        placeholder="https://example.com/organizations/slug"
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">Robots</Label>
                      <Select
                        value={formData.seo_content.robots}
                        onValueChange={(v) => handleSeoChange('robots', v)}
                      >
                        <SelectTrigger className="mt-1.5">
                          <SelectValue placeholder="Select robots directive" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="index, follow">Index, Follow</SelectItem>
                          <SelectItem value="index, nofollow">Index, No Follow</SelectItem>
                          <SelectItem value="noindex, follow">No Index, Follow</SelectItem>
                          <SelectItem value="noindex, nofollow">No Index, No Follow</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>

                  {/* -------- Open Graph -------- */}
                  <TabsContent value="og" className="space-y-4 pt-4">
                    <div>
                      <Label className="text-sm font-semibold">OG Title</Label>
                      <Input
                        value={formData.seo_content.og_title}
                        onChange={(e) => handleSeoChange('og_title', e.target.value)}
                        placeholder="Title shown when shared on Facebook/LinkedIn"
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">OG Description</Label>
                      <Textarea
                        value={formData.seo_content.og_description}
                        onChange={(e) => handleSeoChange('og_description', e.target.value)}
                        rows="3"
                        className="mt-1.5"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-semibold">OG Image</Label>
                        <label className="flex items-center gap-2 text-xs text-muted-foreground">
                          Use organization image
                          <Switch
                            checked={ogUseItemImage}
                            onCheckedChange={handleToggleOgUseItemImage}
                          />
                        </label>
                      </div>

                      {ogUseItemImage ? (
                        <div className="flex items-center gap-3 rounded-lg border bg-gray-50 p-3">
                          {currentImagePreview ? (
                            <img
                              src={currentImagePreview}
                              alt="Organization"
                              className="h-14 w-14 rounded-md border object-cover"
                            />
                          ) : (
                            <div className="flex h-14 w-14 items-center justify-center rounded-md border bg-gray-100 text-[10px] text-muted-foreground">
                              No image
                            </div>
                          )}
                          <p className="text-xs text-muted-foreground">
                            The organization's logo/image will be used automatically when this is shared.
                          </p>
                        </div>
                      ) : (
                        <div>
                          {ogImageUpload.preview ? (
                            <div className="relative overflow-hidden rounded-lg border">
                              <img
                                src={ogImageUpload.preview}
                                alt="OG preview"
                                className="h-32 w-full object-cover"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2 gap-1"
                                onClick={() => ogImageUpload.resetImage()}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                Remove
                              </Button>
                            </div>
                          ) : (
                            <Label
                              htmlFor="og-image-upload"
                              className="flex h-28 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed bg-gray-50/30 text-xs text-muted-foreground transition-colors hover:border-primary"
                            >
                              <Upload className="h-5 w-5" />
                              Upload OG image
                              <input
                                id="og-image-upload"
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/gif"
                                className="hidden"
                                onChange={ogImageUpload.handleImageChange}
                              />
                            </Label>
                          )}
                          {ogImageUpload.error && (
                            <Alert variant="destructive" className="mt-2">
                              <AlertCircle className="h-4 w-4" />
                              <AlertDescription>{ogImageUpload.error}</AlertDescription>
                            </Alert>
                          )}
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  {/* -------- Twitter -------- */}
                  <TabsContent value="twitter" className="space-y-4 pt-4">
                    <div>
                      <Label className="text-sm font-semibold">Twitter Title</Label>
                      <Input
                        value={formData.seo_content.twitter_title}
                        onChange={(e) => handleSeoChange('twitter_title', e.target.value)}
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">Twitter Description</Label>
                      <Textarea
                        value={formData.seo_content.twitter_description}
                        onChange={(e) => handleSeoChange('twitter_description', e.target.value)}
                        rows="3"
                        className="mt-1.5"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-semibold">Twitter Image</Label>
                        <label className="flex items-center gap-2 text-xs text-muted-foreground">
                          Use organization image
                          <Switch
                            checked={twitterUseItemImage}
                            onCheckedChange={handleToggleTwitterUseItemImage}
                          />
                        </label>
                      </div>

                      {twitterUseItemImage ? (
                        <div className="flex items-center gap-3 rounded-lg border bg-gray-50 p-3">
                          {currentImagePreview ? (
                            <img
                              src={currentImagePreview}
                              alt="Organization"
                              className="h-14 w-14 rounded-md border object-cover"
                            />
                          ) : (
                            <div className="flex h-14 w-14 items-center justify-center rounded-md border bg-gray-100 text-[10px] text-muted-foreground">
                              No image
                            </div>
                          )}
                          <p className="text-xs text-muted-foreground">
                            The organization's logo/image will be used automatically when this is shared.
                          </p>
                        </div>
                      ) : (
                        <div>
                          {twitterImageUpload.preview ? (
                            <div className="relative overflow-hidden rounded-lg border">
                              <img
                                src={twitterImageUpload.preview}
                                alt="Twitter preview"
                                className="h-32 w-full object-cover"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2 gap-1"
                                onClick={() => twitterImageUpload.resetImage()}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                Remove
                              </Button>
                            </div>
                          ) : (
                            <Label
                              htmlFor="twitter-image-upload"
                              className="flex h-28 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed bg-gray-50/30 text-xs text-muted-foreground transition-colors hover:border-primary"
                            >
                              <Upload className="h-5 w-5" />
                              Upload Twitter image
                              <input
                                id="twitter-image-upload"
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/gif"
                                className="hidden"
                                onChange={twitterImageUpload.handleImageChange}
                              />
                            </Label>
                          )}
                          {twitterImageUpload.error && (
                            <Alert variant="destructive" className="mt-2">
                              <AlertCircle className="h-4 w-4" />
                              <AlertDescription>{twitterImageUpload.error}</AlertDescription>
                            </Alert>
                          )}
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Quick Info (Edit Mode) */}
            {id && id !== 'new' && itemGetQuery?.data && (
              <Card className="shadow-sm border-blue-200 bg-blue-50/30">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    Organization Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created</span>
                    <span className="font-medium">
                      {new Date(itemGetQuery.data.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Updated</span>
                    <span className="font-medium">
                      {new Date(itemGetQuery.data.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ID</span>
                    <span className="font-medium">#{itemGetQuery.data.id}</span>
                  </div>
                  {itemGetQuery.data.description && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Has Description</span>
                      <span className="font-medium">
                        {itemGetQuery.data.description.length > 100 ? 'Yes (Long)' : 'Yes'}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default Save;