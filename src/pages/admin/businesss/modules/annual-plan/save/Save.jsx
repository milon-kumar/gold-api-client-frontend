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

import PageHeader from '@/components/shear/PageHeader';
import StatusBadge from '@/components/shear/StatusBadge';
import { useApiQuery } from '@/hooks/useAppQuery';
import { useApiMutation } from '@/hooks/useAppMutation';
import { MODULES } from '@/store/default/modules';

// ShadCN EditorX
// import { EditorX } from '@/components/editor';
// import '@shadcn-editor/editor-x/styles.css';
// import { Editor } from '@/components/ui/editorx';
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
    CalendarDays,
} from 'lucide-react';

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

    // Fetch item data for edit mode
    const {
        data: itemGetQuery,
        isLoading: itemGetLoading,
    } = useApiQuery({
        url: `/admin/module-items/${id}`,
        enabled: !!id && id !== 'new',
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
        });

        if (item.image) {
            setExistingImageUrl(item.image);
            setImageUrl(item.image);
        }
    }, [itemGetQuery]);

    // Create/Update mutation
    const {
        mutate: itemMutation,
        isLoading: itemMutationLoading,
    } = useApiMutation({
        url: "/admin/business-module-items",
        method: id && id !== 'new' ? 'PUT' : 'POST',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDescriptionChange = (value) => {
        setFormData(prev => ({
            ...prev,
            description: value
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
            module_slug: MODULES?.ANNUAL_PLANS || 'annual-plans',
            title: formData.title,
            sub_title: formData.sub_title,
            sub_description: formData.sub_description,
            description: formData.description,
            is_featured: formData.is_featured ? 1 : 0,
            status: formData.status,
            image: imageBase64 || null,
        };

        try {
            const response = await itemMutation(payload);
            if (response?.success) {
                toast.success(response?.message || "Annual plan saved successfully");
                navigate('/admin/annual-plans');
            } else {
                toast.error(response?.message || "Failed to save annual plan");
            }
        } catch (error) {
            console.error('Error saving annual plan:', error);
            toast.error('Error saving annual plan data');
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
                title={id && id !== 'new' ? 'Edit Annual Plan' : 'Add New Annual Plan'}
                subtitle={id && id !== 'new' ? `Update annual plan information` : `Add a new annual plan to the module`}
                showBackButton={true}
                onBackClick={() => navigate('/admin/annual-plans')}
                primaryAction={{
                    onClick: handleSubmit,
                    disabled: saving,
                    icon: 'save',
                    title: id && id !== 'new' ? 'Update Plan' : 'Create Plan'
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
                                    Annual Plan Information
                                </CardTitle>
                                <CardDescription>
                                    Enter the annual plan details
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
                                        placeholder="Enter annual plan title"
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
                                    <Label htmlFor="description" className="text-sm font-semibold">
                                        Full Description <span className="text-xs text-muted-foreground">(Rich Text)</span>
                                    </Label>
                                    <div className="mt-1.5 border rounded-lg overflow-hidden">
                                        {/* <Editor
                                            value={formData.description}
                                            onChange={handleDescriptionChange}
                                            placeholder="Enter detailed description with rich text formatting..."
                                            className="min-h-[300px]"
                                        /> */}
                                        <Textarea name="description" value={formData.description}
                                            onChange={handleInputChange} />
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1.5">
                                        Use the toolbar to format your content with bold, italic, lists, links, and more.
                                    </p>
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
                                            Mark this annual plan as featured
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
                                    Image
                                </CardTitle>
                                <CardDescription>
                                    Upload an image (Max {setting?.setting?.item?.image_size || 5}MB)
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

                        {/* Quick Info (Edit Mode) */}
                        {id && id !== 'new' && itemGetQuery?.data && (
                            <Card className="shadow-sm border-blue-200 bg-blue-50/30">
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                                        <Calendar className="h-4 w-4 text-blue-600" />
                                        Plan Info
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
                                                {itemGetQuery.data.description.length > 100 ? 'Yes (Rich Text)' : 'Yes'}
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