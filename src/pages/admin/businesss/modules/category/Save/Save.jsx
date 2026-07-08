// src/pages/Categories/Save.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router';
import { toast } from "sonner";
import useImageUpload from '@/hooks/use-image-upload';

// ShadCN Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Textarea } from '@/components/ui/textarea';

import PageHeader from '@/components/shear/PageHeader';
import { useApiQuery } from '@/hooks/useAppQuery';
import { useApiMutation } from '@/hooks/useAppMutation';

// Icons
import {
    Save as SaveIcon,
    Image as ImageIcon,
    Loader2,
    AlertCircle,
    CheckCircle,
    Upload,
    Trash2,
    Info,
    Calendar,
    FolderOpen,
    Tag,
    Layers,
} from 'lucide-react';

const Save = () => {
    const { setting } = useSelector((state) => state);
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [existingImageUrl, setExistingImageUrl] = useState('');

    // Form state
    const [formData, setFormData] = useState({
        business_id: '',
        type: '',
        name: '',
        description: '',
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

    // Fetch businesses for dropdown
    const {
        data: businessesResponse,
        isLoading: businessesLoading,
    } = useApiQuery({
        url: "/admin/businesses",
        params: { limit: 100 }
    });

    const businesses = businessesResponse?.data?.data || [];

    // Fetch category data for edit mode
    const {
        data: categoryGetQuery,
        isLoading: categoryGetLoading,
    } = useApiQuery({
        url: `/admin/categories/${id}`,
        enabled: !!id && id !== 'new',
    });

    useEffect(() => {
        if (!categoryGetQuery?.success) return;
        const category = categoryGetQuery.data;

        setFormData({
            business_id: category.business_id?.toString() || '',
            type: category.type || '',
            name: category.name || '',
            description: category.description || '',
        });

        if (category.image) {
            setExistingImageUrl(category.image_full_path);
            setImageUrl(category.image_full_path);
        }
    }, [categoryGetQuery]);

    // Create/Update mutation
    const {
        mutate: categoryMutation,
        isLoading: categoryMutationLoading,
    } = useApiMutation({
        url: "/admin/categories",
        method: id && id !== 'new' ? 'PUT' : 'POST',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.business_id) {
            toast.error('Please select a business');
            return;
        }
        if (!formData.type) {
            toast.error('Please select a type');
            return;
        }
        if (!formData.name.trim()) {
            toast.error('Category name is required');
            return;
        }

        setSaving(true);

        const payload = {
            id: id && id !== 'new' ? id : undefined,
            business_id: parseInt(formData.business_id),
            type: formData.type,
            name: formData.name.trim(),
            description: formData.description?.trim() || null,
            image: imageBase64 || null,
        };

        try {
            const response = await categoryMutation(payload);
            if (response?.success) {
                toast.success(response?.message || "Category saved successfully");
                navigate('/admin/categories');
            } else {
                toast.error(response?.message || "Failed to save category");
            }
        } catch (error) {
            console.error('Error saving category:', error);
            toast.error('Error saving category data');
        } finally {
            setSaving(false);
        }
    };

    const handleRemoveImage = () => {
        resetImage();
        setExistingImageUrl('');
    };

    const currentImagePreview = preview || (existingImageUrl ? existingImageUrl : null);

    if (categoryGetLoading) {
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
                title={id && id !== 'new' ? 'Edit Category' : 'Add New Category'}
                subtitle={id && id !== 'new' ? `Update category information` : `Add a new category`}
                showBackButton={true}
                onBackClick={() => navigate('/admin/categories')}
                primaryAction={{
                    onClick: handleSubmit,
                    disabled: saving,
                    icon: 'save',
                    title: id && id !== 'new' ? 'Update Category' : 'Create Category'
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
                                    Category Information
                                </CardTitle>
                                <CardDescription>
                                    Enter the category details
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-6">
                                {/* Business Selection */}
                                <div>
                                    <Label htmlFor="business_id" className="text-sm font-semibold">
                                        Business <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={formData.business_id}
                                        onValueChange={(value) => handleSelectChange('business_id', value)}
                                        disabled={businessesLoading}
                                    >
                                        <SelectTrigger className="mt-1.5">
                                            <SelectValue placeholder="Select business" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {businesses.map((business) => (
                                                <SelectItem key={business.id} value={business.id.toString()}>
                                                    {business.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Type Selection */}
                                <div>
                                    <Label htmlFor="type" className="text-sm font-semibold">
                                        Type <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={formData.type}
                                        onValueChange={(value) => handleSelectChange('type', value)}
                                    >
                                        <SelectTrigger className="mt-1.5">
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="product">Product</SelectItem>
                                            <SelectItem value="service">Service</SelectItem>
                                            <SelectItem value="blog">Blog</SelectItem>
                                            <SelectItem value="portfolio">Portfolio</SelectItem>
                                            <SelectItem value="gallery">Gallery</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {formData.type && (
                                        <div className="mt-2">
                                            <Badge className="bg-blue-100 text-blue-700 border-blue-300">
                                                <Tag className="h-3 w-3 mr-1" />
                                                {formData.type}
                                            </Badge>
                                        </div>
                                    )}
                                </div>

                                <Separator />

                                {/* Name */}
                                <div>
                                    <Label htmlFor="name" className="text-sm font-semibold">
                                        Name <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Enter category name"
                                        className="mt-1.5"
                                    />
                                    {formData.name && (
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            Slug will be auto-generated: {formData.name.toLowerCase().replace(/\s+/g, '-')}
                                        </p>
                                    )}
                                </div>

                                {/* Description */}
                                <div>
                                    <Label htmlFor="description" className="text-sm font-semibold">Description</Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="Enter category description (optional)"
                                        className="mt-1.5"
                                        rows={4}
                                    />
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {formData.description?.length || 0} characters
                                    </p>
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
                                    <FolderOpen className="h-5 w-5 text-green-600" />
                                    Category Image
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
                        {id && id !== 'new' && categoryGetQuery?.data && (
                            <Card className="shadow-sm border-blue-200 bg-blue-50/30">
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                                        <Calendar className="h-4 w-4 text-blue-600" />
                                        Category Info
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Created</span>
                                        <span className="font-medium">
                                            {new Date(categoryGetQuery.data.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Last Updated</span>
                                        <span className="font-medium">
                                            {new Date(categoryGetQuery.data.updated_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Slug</span>
                                        <span className="font-medium">
                                            <Badge variant="outline">{categoryGetQuery.data.slug}</Badge>
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">ID</span>
                                        <span className="font-medium">#{categoryGetQuery.data.id}</span>
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