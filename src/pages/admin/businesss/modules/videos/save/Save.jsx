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
    Video,
    Link2,
    Play,
} from 'lucide-react';

// YouTube URL validation and ID extraction
const getYouTubeVideoId = (url) => {
    if (!url) return null;

    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
        /youtube\.com\/embed\/([^&\n?#]+)/,
        /youtube\.com\/v\/([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }

    return null;
};

const isValidYouTubeUrl = (url) => {
    return getYouTubeVideoId(url) !== null;
};

const Save = () => {
    const { module, setting } = useSelector((state) => state);
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [existingImageUrl, setExistingImageUrl] = useState('');
    const [videoPreview, setVideoPreview] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        sub_title: '',
        sub_description: '',
        is_featured: false,
        status: 'active',
    });

    // Meta data state
    const [metaData, setMetaData] = useState({
        url: '',
        source: 'youtube',
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
            is_featured: item.is_featured || false,
            status: item.status || 'active',
        });

        if (item.image) {
            setExistingImageUrl(item.image_full_path);
            setImageUrl(item.image_full_path);
        }

        if (item.meta) {
            const meta = typeof item.meta === 'string'
                ? JSON.parse(item.meta)
                : item.meta;
            setMetaData({
                url: meta.url || '',
                source: meta.source || 'youtube',
            });

            // Set video preview
            if (meta.url) {
                setVideoPreview(meta.url);
            }
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

    const handleMetaChange = (field, value) => {
        setMetaData(prev => ({
            ...prev,
            [field]: value
        }));

        // Update video preview when URL changes
        if (field === 'url') {
            setVideoPreview(value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.title.trim()) {
            toast.error('Title is required');
            return;
        }
        if (!imageBase64 && !existingImageUrl) {
            toast.error('Thumbnail image is required');
            return;
        }
        if (!metaData.url.trim()) {
            toast.error('YouTube video URL is required');
            return;
        }
        if (!isValidYouTubeUrl(metaData.url)) {
            toast.error('Please enter a valid YouTube URL');
            return;
        }

        setSaving(true);

        const payload = {
            id: id && id !== 'new' ? id : undefined,
            module_slug: MODULES?.VIDEOS || 'videos',
            title: formData.title,
            sub_title: formData.sub_title,
            sub_description: formData.sub_description,
            is_featured: formData.is_featured ? 1 : 0,
            status: formData.status,
            meta: JSON.stringify(metaData),
            image: imageBase64 || null,
        };

        try {
            const response = await itemMutation(payload);
            if (response?.success) {
                toast.success(response?.message || "Video saved successfully");
                navigate('/admin/videos');
            } else {
                toast.error(response?.message || "Failed to save video");
            }
        } catch (error) {
            console.error('Error saving video:', error);
            toast.error('Error saving video data');
        } finally {
            setSaving(false);
        }
    };

    const handleRemoveImage = () => {
        resetImage();
        setExistingImageUrl('');
    };

    const currentImagePreview = preview || (existingImageUrl ? existingImageUrl : null);
    const videoId = getYouTubeVideoId(metaData.url);

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
                title={id && id !== 'new' ? 'Edit Video' : 'Add New Video'}
                subtitle={id && id !== 'new' ? `Update video information` : `Add a new video to the module`}
                showBackButton={true}
                onBackClick={() => navigate('/admin/videos')}
                primaryAction={{
                    onClick: handleSubmit,
                    disabled: saving,
                    icon: 'save',
                    title: id && id !== 'new' ? 'Update Video' : 'Create Video'
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
                                    Video Information
                                </CardTitle>
                                <CardDescription>
                                    Enter the video details
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
                                        placeholder="Enter video title"
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
                                    <Label htmlFor="sub_description" className="text-sm font-semibold">Description</Label>
                                    <Textarea
                                        id="sub_description"
                                        name="sub_description"
                                        value={formData.sub_description}
                                        onChange={handleInputChange}
                                        placeholder="Enter video description"
                                        rows="3"
                                        className="mt-1.5"
                                    />
                                </div>

                                <Separator />

                                {/* YouTube URL */}
                                <div>
                                    <Label htmlFor="video_url" className="text-sm font-semibold">
                                        YouTube URL <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative mt-1.5">
                                        <Link2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="video_url"
                                            value={metaData.url}
                                            onChange={(e) => handleMetaChange('url', e.target.value)}
                                            placeholder="https://www.youtube.com/watch?v=..."
                                            className="pl-9"
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1.5">
                                        Enter a valid YouTube video URL (e.g., https://www.youtube.com/watch?v=g7ZjMy71aEY)
                                    </p>

                                    {/* Video Preview */}
                                    {videoId && (
                                        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-red-100 rounded-full">
                                                    <Video className="h-4 w-4 text-red-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-blue-700">
                                                        Video detected
                                                    </p>
                                                    <p className="text-xs text-blue-600">
                                                        Video ID: {videoId}
                                                    </p>
                                                </div>
                                                <Badge className="bg-green-100 text-green-800 border-0">
                                                    Valid
                                                </Badge>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Status & Featured Card */}
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
                                            Mark this video as featured
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

                    {/* Right Column - Thumbnail Upload */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Thumbnail Card */}
                        <Card className="shadow-sm">
                            <CardHeader className="border-b bg-gray-50/50">
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <ImageIcon className="h-5 w-5 text-green-600" />
                                    Thumbnail
                                </CardTitle>
                                <CardDescription>
                                    Upload a thumbnail image (Max {setting?.setting?.item?.image_size || 5}MB)
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
                                            Choose Thumbnail
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
                                            Thumbnail loaded successfully! Ready to upload.
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
                                        Video Info
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
                                    {videoId && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Video ID</span>
                                            <span className="font-medium">{videoId}</span>
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