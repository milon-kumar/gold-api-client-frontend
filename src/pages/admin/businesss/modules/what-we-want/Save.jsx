// Save.jsx
import useImageUpload from '@/hooks/use-image-upload';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from "sonner";

// ShadCN Components
import {
  Alert,
  AlertDescription,
} from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

import PageHeader from '@/components/shear/PageHeader';
import StatusBadge from '@/components/shear/StatusBadge';
import { useApiMutation } from '@/hooks/useAppMutation';
import { useApiQuery } from '@/hooks/useAppQuery';
import { MODULES } from '@/store/default/modules';

// Icons
import {
  AlertCircle,
  CheckCircle,
  Edit,
  Image as ImageIcon,
  MessageSquare,
  Settings,
  Trash2,
  Upload,
  Target,
  Lightbulb,
} from 'lucide-react';

const Save = () => {
  const { module, setting } = useSelector((state) => state);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [existingImageUrl, setExistingImageUrl] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [itemId, setItemId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    sub_title: '',
    short_description: '',
    description: '',
    status: 'active',
  });

  const {
    image: imageBase64,
    preview,
    error: imageError,
    handleImageChange,
    resetImage,
    setImageUrl
  } = useImageUpload(setting?.setting?.item?.image_size || 5);

  const {
    data: itemGetQuery,
    isLoading: itemGetLoading,
    refetch: refetchItem
  } = useApiQuery({
    url: `/admin/business-modules/${MODULES?.WHAT_WE_WANT}`,
    params: {
      module_slug: MODULES?.WHAT_WE_WANT || 'what-we-want',
      limit: 1,
    }
  });

  useEffect(() => {
    const item = itemGetQuery?.data || [];

    if (item) {
      setIsEditing(true);
      setItemId(item.id);

      setFormData({
        title: item.title || '',
        sub_title: item.sub_title || '',
        short_description: item.short_description || '',
        description: item.description || '',
        status: item.status || 'active',
      });

      if (item.image) {
        setExistingImageUrl(item.image);
        setImageUrl({
          image: item.image,
          preview: item.image_full_path,
        });
      }
    } else {
      setIsEditing(false);
      setItemId(null);
      setFormData({
        title: '',
        sub_title: '',
        short_description: '',
        description: '',
        status: 'active',
      });
      resetImage();
      setExistingImageUrl('');
    }
  }, [itemGetQuery]);

  const {
    mutate: itemMutation,
    isLoading: itemMutationLoading,
  } = useApiMutation({
    url: '/admin/business-modules',
    method: 'POST',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStatusChange = (value) => {
    setFormData(prev => ({
      ...prev,
      status: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('Description is required');
      return;
    }

    setSaving(true);

    const payload = {
      id: isEditing ? itemId : undefined,
      module_slug: MODULES?.WHAT_WE_WANT || 'what-we-want',
      title: formData.title,
      sub_title: formData.sub_title,
      short_description: formData.short_description,
      description: formData.description,
      is_featured: 0,
      status: formData.status,
      image: imageBase64 || null,
    };

    try {
      const response = await itemMutation(payload);
      if (response?.success) {
        toast.success(response?.message || "What We Want saved successfully");
        await refetchItem();
        setIsEditing(true);
        if (response?.data?.id) {
          setItemId(response.data.id);
        }
      } else {
        toast.error(response?.message || "Failed to save what we want");
      }
    } catch (error) {
      console.error('Error saving what we want:', error);
      toast.error('Error saving what we want data');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveImage = () => {
    resetImage();
    setExistingImageUrl('');
  };

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
        title={isEditing ? 'Update What We Want' : 'Create What We Want'}
        subtitle={isEditing ? 'Update your goals and vision' : 'Define what we want to achieve'}
        showBackButton={false}
        primaryAction={{
          onClick: handleSubmit,
          disabled: saving,
          icon: 'save',
          title: isEditing ? 'Update' : 'Create'
        }}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-sm">
              <CardHeader className="border-b bg-gray-50/50">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Target className="h-5 w-5 text-blue-600" />
                  What We Want
                </CardTitle>
                <CardDescription>
                  Define our goals, vision, and aspirations
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
                    placeholder="e.g., Our Vision, Our Goals, What We Stand For"
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
                    placeholder="e.g., Building a Better Future Together"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="short_description" className="text-sm font-semibold">Short Description</Label>
                  <Textarea
                    id="short_description"
                    name="short_description"
                    value={formData.short_description}
                    onChange={handleInputChange}
                    placeholder="Enter a brief overview of what we want to achieve"
                    rows="3"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-sm font-semibold">
                    Full Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe in detail what we want to achieve, our goals, vision, and aspirations..."
                    rows="12"
                    className="mt-1.5 resize-y min-h-[300px]"
                  />
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Write a comprehensive description of your goals, vision, and what you want to accomplish.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-sm">
              <CardHeader className="border-b bg-gray-50/50">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <ImageIcon className="h-5 w-5 text-green-600" />
                  Image
                </CardTitle>
                <CardDescription>
                  Upload a representative image (Max {setting?.setting?.item?.image_size || 5}MB)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                {preview ? (
                  <div className="relative">
                    <div className="relative overflow-hidden rounded-lg border bg-gray-50">
                      <div className="flex h-72 w-full items-center justify-center bg-gray-100">
                        <img
                          src={preview}
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
                  <div className="flex h-72 flex-col items-center justify-center rounded-lg border-2 border-dashed bg-gray-50/30 p-6 transition-colors hover:border-primary">
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

            <Card className="shadow-sm">
              <CardHeader className="border-b bg-gray-50/50">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Settings className="h-5 w-5 text-orange-600" />
                  Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
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
                  <div className="mt-3">
                    <StatusBadge status={formData.status} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Only active content will be displayed on the website.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-blue-200 bg-blue-50/30">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <MessageSquare className="h-4 w-4 text-blue-600" />
                  Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <StatusBadge status={formData.status} />
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Description Length</span>
                  <span className="font-medium">
                    {formData.description?.length || 0} characters
                  </span>
                </div>
                {isEditing && (
                  <>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Updated</span>
                      <span className="font-medium">
                        {new Date().toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ID</span>
                      <span className="font-medium">#{itemId || 'N/A'}</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-sm border-purple-200 bg-purple-50/30">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <Lightbulb className="h-4 w-4 text-purple-600" />
                  Writing Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Clearly define your goals and vision</li>
                  <li>Be specific about what you want to achieve</li>
                  <li>Explain why these goals matter</li>
                  <li>Inspire and motivate your audience</li>
                  <li>Include actionable objectives</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Save;