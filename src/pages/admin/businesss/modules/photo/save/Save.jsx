// Save.jsx
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router";
import { toast } from "sonner";
import useImageUpload from "@/hooks/use-image-upload";
import { cn } from "@/lib/utils";
// ShadCN Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

import PageHeader from "@/components/shear/PageHeader";
import StatusBadge from "@/components/shear/StatusBadge";
import { useApiQuery } from "@/hooks/useAppQuery";
import { useApiMutation } from "@/hooks/useAppMutation";
import { MODULES } from "@/store/default/modules";

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
  Images,
  Check,
  ChevronsUpDown,
} from "lucide-react";

const Save = () => {
  const { module, setting } = useSelector((state) => state);
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [existingImageUrl, setExistingImageUrl] = useState("");

  // Form state - FIXED: Changed categoyr_id to category_id
  const [formData, setFormData] = useState({
    category_id: "", // Fixed typo
    title: "",
    sub_title: "",
    is_featured: false,
    status: "active",
  });

  // Image upload hook
  const {
    image: imageBase64,
    preview,
    error: imageError,
    handleImageChange,
    resetImage,
    setImageUrl,
  } = useImageUpload(setting?.setting?.item?.image_size || 5);

  console.log("Form data - ", formData);

  // Fetch category data for edit mode
  const { data: categoryGetQuery, isLoading: categoryGetLoading } = useApiQuery(
    {
      url: `/admin/business-module-item-categories-by-slug/${MODULES.PHOTOS}`,
    },
  );

  const categories =
    categoryGetQuery?.data?.map((i) => {
      return {
        id: i.id,
        name: i.name,
      };
    }) || [];

  // Fetch item data for edit mode
  const { data: itemGetQuery, isLoading: itemGetLoading } = useApiQuery({
    url: `/admin/business-module-items/${id}`,
    enabled: !!id && id !== "new",
  });

  useEffect(() => {
    if (!itemGetQuery?.success) return;
    const item = itemGetQuery.data;

    setFormData({
      category_id: item.category_id || null, // Fixed typo
      title: item.title || "",
      sub_title: item.sub_title || "",
      is_featured: item.is_featured || false,
      status: item.status || "active",
    });

    if (item.image) {
      setExistingImageUrl(item.image_full_path);
      setImageUrl(item.image_full_path);
    }
  }, [itemGetQuery]);

  // Create/Update mutation
  const { mutate: itemMutation, isLoading: itemMutationLoading } =
    useApiMutation({
      url: "/admin/business-module-items",
      method: "POST",
    });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = (checked) => {
    setFormData((prev) => ({
      ...prev,
      is_featured: checked,
    }));
  };

  const handleStatusChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      status: value,
    }));
  };

  // FIXED: Added handler for category selection
  const handleCategorySelect = (categoryId) => {
    setFormData((prev) => ({
      ...prev,
      category_id: categoryId,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!imageBase64 && !existingImageUrl) {
      toast.error("Photo is required");
      return;
    }

    setSaving(true);

    const payload = {
      id: id && id !== "new" ? id : undefined,
      module_slug: MODULES?.PHOTOS || "photos",
      category_id: formData.category_id || null, // Fixed typo
      title: formData.title,
      sub_title: formData.sub_title,
      is_featured: formData.is_featured ? 1 : 0,
      status: formData.status,
      image: imageBase64 || null,
    };

    try {
      const response = await itemMutation(payload);
      if (response?.success) {
        toast.success(response?.message || "Photo saved successfully");
        navigate("/admin/photos");
      } else {
        toast.error(response?.message || "Failed to save photo");
      }
    } catch (error) {
      console.error("Error saving photo:", error);
      toast.error("Error saving photo data");
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveImage = () => {
    resetImage();
    setExistingImageUrl("");
  };

  const currentImagePreview =
    preview || (existingImageUrl ? existingImageUrl : null);

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
        title={id && id !== "new" ? "Edit Photo" : "Add New Photo"}
        subtitle={
          id && id !== "new"
            ? `Update photo information`
            : `Add a new photo to the module`
        }
        showBackButton={true}
        onBackClick={() => navigate("/admin/photos")}
        primaryAction={{
          onClick: handleSubmit,
          disabled: saving,
          icon: "save",
          title: id && id !== "new" ? "Update Photo" : "Create Photo",
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
                  Photo Information
                </CardTitle>
                <CardDescription>Enter the photo details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">
                    Type <span className="text-red-500">*</span>
                  </Label>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between font-normal"
                      >
                        {formData.category_id ? (
                          <span className="capitalize">
                            {categories.find(
                              (c) => c.id === formData.category_id,
                            )?.name || "Select type"}
                          </span>
                        ) : (
                          "Select type"
                        )}

                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent
                      className="w-(--radix-popover-trigger-width) p-0"
                      align="start"
                    >
                      <Command>
                        <CommandInput placeholder="Search module..." />
                        <CommandEmpty>No module found.</CommandEmpty>
                        <CommandGroup className="max-h-72 overflow-y-auto">
                          {categories.map((category) => {
                            console.log("category", category);
                            return (
                              <CommandItem
                                key={category.id}
                                value={String(category.id)}
                                onSelect={() => {
                                  handleCategorySelect(category.id); // Using the new handler
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    formData.category_id === category.id
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {category.name}
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label htmlFor="title" className="text-sm font-semibold">
                    Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter photo title"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="sub_title" className="text-sm font-semibold">
                    Sub Title
                  </Label>
                  <Input
                    id="sub_title"
                    name="sub_title"
                    value={formData.sub_title}
                    onChange={handleInputChange}
                    placeholder="Enter sub title (optional)"
                    className="mt-1.5"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="font-semibold">Featured</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Mark this photo as featured
                    </p>
                  </div>
                  <Switch
                    checked={formData.is_featured}
                    onCheckedChange={handleSwitchChange}
                  />
                </div>

                <Separator />

                <div>
                  <Label htmlFor="status" className="text-sm font-semibold">
                    Status
                  </Label>
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
                  <Images className="h-5 w-5 text-green-600" />
                  Photo
                </CardTitle>
                <CardDescription>
                  Upload a photo (Max {setting?.setting?.item?.image_size || 5}
                  MB)
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
                      Choose Photo
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
                      Photo loaded successfully! Ready to upload.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Quick Info (Edit Mode) */}
            {id && id !== "new" && itemGetQuery?.data && (
              <Card className="shadow-sm border-blue-200 bg-blue-50/30">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    Photo Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created</span>
                    <span className="font-medium">
                      {new Date(
                        itemGetQuery.data.created_at,
                      ).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Updated</span>
                    <span className="font-medium">
                      {new Date(
                        itemGetQuery.data.updated_at,
                      ).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ID</span>
                    <span className="font-medium">#{itemGetQuery.data.id}</span>
                  </div>
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
