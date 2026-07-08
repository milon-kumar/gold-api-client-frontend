// Save.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router';
import { toast } from "sonner"
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
import { Check, ChevronsUpDown } from "lucide-react";
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

import PageHeader from '@/components/shear/PageHeader';

// Icons
import {
    Save as SaveIcon,
    Image as ImageIcon,
    Loader2,
    Star,
    Link2,
    MessageSquare,
    AlertCircle,
    CheckCircle,
    Upload,
    Trash2,
    Info,
    Settings,
    Layout,
} from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { useApiMutation } from '@/hooks/useAppMutation';
import { MODULES } from '@/store/default/modules';
import { useApiQuery } from '@/hooks/useAppQuery';
import StatusBadge from '@/components/shear/StatusBadge';
import { STATUS } from '@/store/default/types';
const Save = () => {
    const { module, setting } = useSelector((state) => state);

    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [existingImageUrl, setExistingImageUrl] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        sub_title: '',
        sub_description: '',
        description: '',
        is_featured: true,
        status: STATUS.ACTIVE,
    });

    const [metaData, setMetaData] = useState({
        primary_button_title: 'Read more',
        primary_button_link: '/read-more',
        secondary_button_title: 'About Us',
        secondary_button_link: '/about-us',
        slogan: '',
    });

    const {
        image: imageBase64,
        preview,
        error: imageError,
        handleImageChange,
        resetImage
    } = useImageUpload(setting?.setting?.item?.image_size);


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
    };

    const {
        data: sliderGetQuery,
        isLoading: sliderGetLoading,
        refetch: sliderFetchQuery
    } = useApiQuery({
        url: `/admin/module-items/${id}`,
        enabled: !!id,
    })

    useEffect(() => {
        if (!sliderGetQuery?.success) return;
        const item = sliderGetQuery.data;

        setFormData({
            title: item.title || '',
            slug: item.slug || '',
            sub_title: item.sub_title || '',
            sub_description: item.sub_description || '',
            description: item.description || '',
            is_featured: item.is_featured || false,
            status: item.status || 'active',
            image: item.image_full_path || null,
        });

        setMetaData({
            ...item?.meta
        })
    }, [sliderGetQuery]);

    const {
        mutate: sliderPostMutation,
        isLoading: sliderPostLoading,
        errors: sliderPostErrors
    } = useApiMutation({
        url: "/admin/business-module-items",
    })

    const handleSubmit = async (e) => {
        const payload = {
            module_slug: MODULES?.SLIDERS,
            title: formData.title,
            slug: formData.slug,
            sub_title: formData.sub_title,
            sub_description: formData.sub_description,
            description: formData.description,
            is_featured: formData.is_featured ? 1 : 0,
            status: formData.status,
            meta: JSON.stringify(metaData),
            image: imageBase64 || null,
        };

        try {
            const response = await sliderPostMutation(payload)
            if (response?.success) {
                toast.success(response?.message || "Data save success...")
                navigate('/admin/sliders')
            }
        } catch (error) {
            console.error('Error saving module item:', error);
            toast.error('Error saving data');
        } finally {
            resetForm()
        }
    };

    const resetForm = () => {
        setFormData({
            title: null,
            slug: null,
            sub_title: null,
            sub_description: null,
            description: null,
            is_featured: false,
            status: null,
        });

        setMetaData({
            primary_button_title: null,
            primary_button_link: null,
            secondary_button_title: null,
            secondary_button_link: null,
            slogan: null,
        });

        resetImage();
    };

    const currentImagePreview = preview || (existingImageUrl ? existingImageUrl : null);

    if (sliderPostLoading) {
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
        <div>
            <PageHeader
                title={id && id !== 'new' ? 'Edit Slider Item' : 'Create New Slider'}
                subtitle={id && id !== 'new' ? `Update your slider content and settings` : `Add a new slider to your module`}
                status={formData?.status || null}
                showBackButton={true}
                onBackClick={() => navigate('/admin/sliders')}
                primaryAction={{
                    onClick: handleSubmit,
                    disabled: sliderPostLoading,
                    icon: 'save',
                    title: id ? 'Update' : 'Save'
                }}
            />

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-6">
                        {/* Slogan Card */}
                        <Card className="">
                            <CardHeader className="border-b bg-gray-50/50">
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <MessageSquare className="h-5 w-5 text-purple-600" />
                                    Slogan <span className="text-red-500">*</span>
                                </CardTitle>
                                <CardDescription>
                                    Add a catchy slogan to grab attention
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Textarea
                                    value={metaData.slogan}
                                    onChange={(e) => handleMetaChange('slogan', e.target.value)}
                                    placeholder="Enter a catchy slogan for your slider"
                                    rows="2"
                                    className="text-lg"
                                />
                            </CardContent>
                        </Card>
                        {/* Basic Information Card */}
                        <Card className="">
                            <CardHeader className="border-b bg-gray-50/50">
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <Info className="h-5 w-5 text-blue-600" />
                                    Basic Information
                                </CardTitle>
                                <CardDescription>
                                    Enter the core information for your slider
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="title" className="text-sm font-semibold">
                                        Title <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        placeholder="Enter slider title"
                                        className="mt-1.5"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="sub_title" className="text-sm font-semibold">Sub Title
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="sub_title"
                                        name="sub_title"
                                        value={formData.sub_title}
                                        onChange={handleInputChange}
                                        placeholder="Enter sub title"
                                        className="mt-1.5"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="sub_description" className="text-sm font-semibold">Sub Description</Label>
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
                                    <Textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="Enter detailed description"
                                        rows="5"
                                        className="mt-1.5"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Primary Button Card */}
                        <Card className="">
                            <CardHeader className="border-b bg-gray-50/50">
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <Link2 className="h-5 w-5 text-blue-600" />
                                    Primary Button
                                </CardTitle>
                                <CardDescription>
                                    Configure the main call-to-action button
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="primary_button_title" className="text-sm font-semibold">Button Title</Label>
                                    <Input
                                        id="primary_button_title"
                                        value={metaData.primary_button_title}
                                        onChange={(e) => handleMetaChange('primary_button_title', e.target.value)}
                                        placeholder="e.g., Learn More, Get Started"
                                        className="mt-1.5"
                                    />
                                </div>
                                <div>
                                    <Label
                                        htmlFor="primary_button_link"
                                        className="text-sm font-semibold"
                                    >
                                        Button Link
                                    </Label>

                                    <div className="mt-1.5 flex">
                                        <span className="inline-flex items-center rounded-l-md border border-r-0 bg-muted px-3 text-sm text-muted-foreground">
                                            https://example.com
                                        </span>

                                        <Input
                                            id="primary_button_link"
                                            value={metaData.primary_button_link}
                                            onChange={(e) =>
                                                handleMetaChange('primary_button_link', e.target.value)
                                            }
                                            placeholder="/about-us"
                                            className="rounded-l-none"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Media Card */}
                        <Card className="shadow-sm">
                            <CardHeader className="border-b bg-gray-50/50">
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <ImageIcon className="h-5 w-5 text-green-600" />
                                    Slider Image
                                </CardTitle>
                                <CardDescription>
                                    Upload an image for your slider (Max 3MB)
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {currentImagePreview ? (
                                    <div className="relative">
                                        <div className="relative overflow-hidden rounded-lg border bg-gray-50">
                                            {/* Fixed Preview Area */}
                                            <div className="flex h-72 w-full items-center justify-center bg-gray-100">
                                                <img
                                                    src={currentImagePreview}
                                                    alt="Preview"
                                                    className="max-h-full max-w-full object-contain"
                                                />
                                            </div>

                                            <div className="absolute top-3 right-3">
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={resetImage}
                                                    className="gap-1"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    Remove
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex h-72 flex-col items-center justify-center rounded-lg border-2 border-dashed bg-gray-50/30 p-8 transition-colors hover:border-primary">
                                        <Upload className="mb-4 h-12 w-12 text-muted-foreground" />

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

                                        <p className="mt-4 text-sm text-muted-foreground">
                                            Click to browse or drag and drop
                                        </p>

                                        <p className="mt-2 text-xs text-muted-foreground">
                                            Supported formats: JPEG, PNG, WebP, GIF | Max size:{" "}
                                            {setting?.setting?.item?.image_size}MB
                                        </p>
                                    </div>
                                )}

                                {imageError && (
                                    <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>{imageError}</AlertDescription>
                                    </Alert>
                                )}

                                {imageBase64 && (
                                    <Alert>
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <AlertDescription className="text-sm">
                                            Image loaded successfully! Ready to upload.
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </CardContent>
                        </Card>

                        {/* Status & Settings Card */}
                        <Card className="shadow-sm border-0 bg-white">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                                    <Settings className="h-5 w-5 text-orange-500" />
                                    Status & Settings
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-5">
                                {/* Featured */}
                                <div className="rounded-xl border bg-muted/30 p-4 transition-all hover:bg-muted/50">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-yellow-100">
                                                    <Star className="h-4 w-4 text-yellow-600" />
                                                </div>

                                                <div>
                                                    <h4 className="font-semibold">
                                                        Featured Item
                                                    </h4>

                                                    <p className="text-xs text-muted-foreground">
                                                        Highlight this content on your website.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <Switch
                                            checked={formData.is_featured}
                                            onCheckedChange={handleSwitchChange}
                                        />
                                    </div>
                                </div>

                                {/* Status */}
                                <div className="rounded-xl border p-4">
                                    <div className="mb-3 flex items-center justify-between">
                                        <div>
                                            <h4 className="font-semibold">
                                                Publication Status
                                            </h4>

                                            <p className="text-xs text-muted-foreground">
                                                Choose the current visibility status.
                                            </p>
                                        </div>

                                        {
                                            formData.status && (
                                                <StatusBadge status={formData.status} />
                                            )
                                        }
                                    </div>

                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="w-full justify-between"
                                            >
                                                {formData.status
                                                    ? formData.status.charAt(0).toUpperCase() +
                                                    formData.status.slice(1)
                                                    : "Select status"}

                                                <ChevronsUpDown className="h-4 w-4 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>

                                        <PopoverContent className="w-[250px] p-0">
                                            <Command>
                                                <CommandInput placeholder="Search status..." />

                                                <CommandEmpty>
                                                    No status found.
                                                </CommandEmpty>

                                                <CommandGroup>
                                                    {[
                                                        "active",
                                                        "pending",
                                                        "inactive",
                                                    ].map((status) => (
                                                        <CommandItem
                                                            key={status}
                                                            value={status}
                                                            onSelect={() =>
                                                                handleStatusChange(status)
                                                            }
                                                        >
                                                            <Check
                                                                className={`mr-2 h-4 w-4 ${formData.status === status
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                                    }`}
                                                            />

                                                            {status.charAt(0).toUpperCase() +
                                                                status.slice(1)}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Secondary Button Card */}
                        <Card className="shadow-sm">
                            <CardHeader className="border-b bg-gray-50/50">
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <Link2 className="h-5 w-5 text-gray-600" />
                                    Secondary Button
                                </CardTitle>
                                <CardDescription>
                                    Configure the secondary call-to-action button
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="secondary_button_title" className="text-sm font-semibold">Button Title</Label>
                                    <Input
                                        id="secondary_button_title"
                                        value={metaData.secondary_button_title}
                                        onChange={(e) => handleMetaChange('secondary_button_title', e.target.value)}
                                        placeholder="e.g., Contact Us, Read More"
                                        className="mt-1.5"
                                    />
                                </div>
                                <div>
                                    <Label
                                        htmlFor="primary_button_link"
                                        className="text-sm font-semibold"
                                    >
                                        Button Link
                                    </Label>

                                    <div className="mt-1.5 flex">
                                        <span className="inline-flex items-center rounded-l-md border border-r-0 bg-muted px-3 text-sm text-muted-foreground">
                                            https://example.com
                                        </span>

                                        <Input
                                            id="secondary_button_link"
                                            value={metaData.secondary_button_link}
                                            onChange={(e) =>
                                                handleMetaChange('secondary_button_link', e.target.value)
                                            }
                                            placeholder="/about-us"
                                            className="rounded-l-none"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

            </form>
        </div>
    );
};

export default Save;