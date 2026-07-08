// Settings.jsx
import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Alert,
    AlertDescription,
} from '@/components/ui/alert';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Building2,
    Copy,
    Database,
    Server,
    CheckCircle2,
    Calendar,
    Link2,
    Image as ImageIcon,
    Save,
    Loader2,
    Edit,
    Settings as SettingsIcon,
    Layout,
    FileText,
    AlertCircle,
    CheckCircle,
    Upload,
    Trash2,
    Globe,
} from 'lucide-react';
import { FiFacebook, FiYoutube } from 'react-icons/fi';
import { toast } from 'sonner';
import { useApiQuery } from '@/hooks/useAppQuery';
import { useApiMutation } from '@/hooks/useAppMutation';
import PageHeader from '@/components/shear/PageHeader';
import useImageUpload from '@/hooks/use-image-upload';

const SettingsView = () => {
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editField, setEditField] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [editLabel, setEditLabel] = useState('');
    const [editKey, setEditKey] = useState('');
    const [isImageUpload, setIsImageUpload] = useState(false);

    // Image upload hook for logo and favicon
    const {
        image: imageBase64,
        preview,
        error: imageError,
        handleImageChange,
        resetImage,
        setImageUrl
    } = useImageUpload(5);

    // Fetch settings
    const {
        data: settingsResponse,
        isLoading: settingsLoading,
        refetch: refetchSettings
    } = useApiQuery({
        url: `/admin/business-settings`,
    });

    const data = settingsResponse?.data || {};
    const business = data?.business || {};
    const settings = data?.settings || {};

    // Update mutation
    const {
        mutate: updateMutation,
        isLoading: updateLoading,
    } = useApiMutation({
        url: '/admin/business-settings',
        method: 'POST',
    });

    const copyToClipboard = (text, label) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        toast.success(`${label} copied to clipboard`);
    };

    const handleEdit = (key, value, label, isImage = false, previewUrl = null) => {
        setEditKey(key);
        setEditValue(value || '');
        setEditLabel(label);
        setIsImageUpload(isImage);

        // If it's an image field, set the preview
        if (isImage && value) {
            setImageUrl({
                image: value,
                preview: previewUrl,
            });
        } else {
            resetImage();
        }

        setEditModalOpen(true);
    };

    const handleSave = async () => {
        let payload = {};

        if (isImageUpload) {
            // For image uploads, send base64
            if (!imageBase64 && !editValue) {
                toast.error('Please select an image');
                return;
            }
            payload = {
                [editKey]: imageBase64 || null,
            };
        } else {
            payload = {
                [editKey]: editValue,
            };
        }

        try {
            const response = await updateMutation(payload);
            if (response?.success) {
                toast.success(`${editLabel} updated successfully`);
                await refetchSettings();
                setEditModalOpen(false);
                resetImage();
            } else {
                toast.error(response?.message || "Failed to update");
            }
        } catch (error) {
            console.error('Error updating settings:', error);
            toast.error('Error updating settings');
        }
    };

    const handleRemoveImage = () => {
        resetImage();
        setEditValue('');
    };

    if (settingsLoading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="space-y-4">
                    <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-64 bg-white rounded-lg animate-pulse"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <PageHeader
                title="Business Settings"
                subtitle="Manage your business information and settings"
                showBackButton={false}
            />

            <div className="space-y-6">
                {/* Business Information Card */}
                <Card className="shadow-sm">
                    <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2 text-2xl">
                                    <Building2 className="h-6 w-6 text-blue-600" />
                                    Business Information
                                </CardTitle>
                                <CardDescription>
                                    Core business details and identification
                                </CardDescription>
                            </div>
                            <Badge className="bg-green-100 text-green-800 border-0">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Active
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Business Name */}
                            <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 rounded-full">
                                            <Building2 className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Business Name</p>
                                            <p className="font-semibold text-lg">{business.name || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleEdit('name', business.name, 'Business Name')}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Business ID */}
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-100 rounded-full">
                                        <Copy className="h-4 w-4 text-purple-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground">Business ID</p>
                                        <p className="font-mono text-sm">#{business.id}</p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => copyToClipboard(business.id, 'Business ID')}
                                    >
                                        <Copy className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>

                            {/* Status */}
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-100 rounded-full">
                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Status</p>
                                        <Badge className="bg-green-100 text-green-800 border-0 capitalize">
                                            {business.status}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            {/* Created At */}
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-100 rounded-full">
                                        <Calendar className="h-4 w-4 text-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Created</p>
                                        <p className="font-medium text-sm">
                                            {business.created_at ? new Date(business.created_at).toLocaleDateString() : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Subdomain */}
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-cyan-100 rounded-full">
                                        <Globe className="h-4 w-4 text-cyan-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground">Subdomain</p>
                                        <p className="font-medium text-sm">{business.subdomain || 'N/A'}</p>
                                    </div>
                                    {business.subdomain && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => copyToClipboard(business.subdomain, 'Subdomain')}
                                        >
                                            <Copy className="h-3 w-3" />
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Domain */}
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-teal-100 rounded-full">
                                        <Globe className="h-4 w-4 text-teal-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground">Domain</p>
                                        <p className="font-medium text-sm">{business.domain || 'N/A'}</p>
                                    </div>
                                    {business.domain && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => copyToClipboard(business.domain, 'Domain')}
                                        >
                                            <Copy className="h-3 w-3" />
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Database Type */}
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-orange-100 rounded-full">
                                        <Database className="h-4 w-4 text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Database Type</p>
                                        <Badge variant="outline" className="capitalize">
                                            {business.database_type || 'N/A'}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            {/* Language */}
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-pink-100 rounded-full">
                                        <Globe className="h-4 w-4 text-pink-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Language</p>
                                        <p className="font-medium text-sm uppercase">{settings.lang_slug || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Settings Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Branding Settings */}
                    <Card className="shadow-sm">
                        <CardHeader className="border-b bg-linear-to-r from-emerald-50 to-teal-50">
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <ImageIcon className="h-5 w-5 text-emerald-600" />
                                Branding
                            </CardTitle>
                            <CardDescription>Logo, favicon and brand assets</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            {/* Logo */}
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-100 rounded-full">
                                        <ImageIcon className="h-4 w-4 text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Logo</p>
                                        {settings.logo && settings.logo_full_path ? (
                                            <div className="mt-1">
                                                <img
                                                    src={settings.logo_full_path}
                                                    alt="Logo"
                                                    className="h-12 w-auto object-contain"
                                                />
                                            </div>
                                        ) : (
                                            <p className="text-xs text-muted-foreground">No logo uploaded</p>
                                        )}
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEdit('logo', settings.logo, 'Logo', true, settings?.logo_full_path)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Edit className="h-4 w-4" />
                                </Button>
                            </div>

                            {/* Favicon */}
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-orange-100 rounded-full">
                                        <ImageIcon className="h-4 w-4 text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Favicon</p>
                                        {settings.favicon && settings.favicon_full_path ? (
                                            <div className="mt-1">
                                                <img
                                                    src={settings.favicon_full_path}
                                                    alt="Favicon"
                                                    className="h-8 w-8 object-contain"
                                                />
                                            </div>
                                        ) : (
                                            <p className="text-xs text-muted-foreground">No favicon uploaded</p>
                                        )}
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEdit('favicon', settings.favicon, 'Favicon', true, settings.favicon_full_path)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Edit className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Social Media Settings */}
                    <Card className="shadow-sm">
                        <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-sky-50">
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <Link2 className="h-5 w-5 text-blue-600" />
                                Social Media
                            </CardTitle>
                            <CardDescription>Connect your social media profiles</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            {/* Facebook */}
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-full">
                                        <FiFacebook className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Facebook</p>
                                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                            {settings.facebook_link || 'Not set'}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEdit('facebook_link', settings.facebook_link, 'Facebook Link')}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Edit className="h-4 w-4" />
                                </Button>
                            </div>

                            {/* YouTube */}
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-red-100 rounded-full">
                                        <FiYoutube className="h-4 w-4 text-red-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">YouTube</p>
                                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                            {settings.youtube_link || 'Not set'}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEdit('youtube_link', settings.youtube_link, 'YouTube Link')}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Edit className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Content Settings */}
                    <Card className="shadow-sm">
                        <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-violet-50">
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <FileText className="h-5 w-5 text-purple-600" />
                                Content
                            </CardTitle>
                            <CardDescription>About text and copyright information</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            {/* About */}
                            <div className="p-3 bg-gray-50 rounded-lg group">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-purple-100 rounded-full">
                                            <FileText className="h-4 w-4 text-purple-600" />
                                        </div>
                                        <p className="text-sm font-medium">About</p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleEdit('abouts', settings.abouts, 'About')}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2 ml-11">
                                    {settings.abouts || 'No about text set'}
                                </p>
                            </div>

                            {/* Copyright */}
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-100 rounded-full">
                                        <Copy className="h-4 w-4 text-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Copyright Text</p>
                                        <p className="text-xs text-muted-foreground">
                                            {settings.copyright_text || 'Not set'}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEdit('copyright_text', settings.copyright_text, 'Copyright Text')}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Edit className="h-4 w-4" />
                                </Button>
                            </div>

                            {/* Language */}
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-pink-100 rounded-full">
                                        <Globe className="h-4 w-4 text-pink-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Language</p>
                                        <p className="text-xs text-muted-foreground uppercase">
                                            {settings.lang_slug || 'Not set'}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEdit('lang_slug', settings.lang_slug, 'Language')}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Edit className="h-4 w-4" />
                                </Button>
                            </div>

                            {/* Module Order */}
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-amber-100 rounded-full">
                                        <Layout className="h-4 w-4 text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Module Order</p>
                                        <p className="text-xs text-muted-foreground">
                                            {settings.module_order ? 'Custom order set' : 'Default order'}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEdit('module_order', settings.module_order, 'Module Order')}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Edit className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Database Information */}
                    <Card className="shadow-sm">
                        <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-slate-50">
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <Server className="h-5 w-5 text-slate-600" />
                                Database Information
                            </CardTitle>
                            <CardDescription>Database connection details</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                {business.database_type !== 'shared' && (
                                    <>
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            <p className="text-xs text-muted-foreground">Host</p>
                                            <p className="font-mono text-sm">{business.db_host || 'N/A'}</p>
                                        </div>
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            <p className="text-xs text-muted-foreground">Port</p>
                                            <p className="font-mono text-sm">{business.db_port || 'N/A'}</p>
                                        </div>
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            <p className="text-xs text-muted-foreground">Database</p>
                                            <p className="font-mono text-sm">{business.db_name || 'N/A'}</p>
                                        </div>
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            <p className="text-xs text-muted-foreground">User</p>
                                            <p className="font-mono text-sm">{business.db_user || 'N/A'}</p>
                                        </div>
                                    </>
                                )}
                                {business.database_type === 'shared' && (
                                    <div className="col-span-2 p-4 bg-green-50 rounded-lg text-center">
                                        <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                                        <p className="text-sm font-medium text-green-800">Shared Database</p>
                                        <p className="text-xs text-green-600">Using shared database configuration</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Edit Modal with Image Upload */}
                <Dialog open={editModalOpen} onOpenChange={(open) => {
                    if (!open) {
                        resetImage();
                    }
                    setEditModalOpen(open);
                }}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <SettingsIcon className="h-5 w-5 text-blue-600" />
                                Edit {editLabel}
                            </DialogTitle>
                            <DialogDescription>
                                {isImageUpload
                                    ? `Upload a new ${editLabel.toLowerCase()} for your business`
                                    : `Update the ${editLabel.toLowerCase()} for your business`
                                }
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            {isImageUpload ? (
                                // Image Upload Section
                                <div className="space-y-4">
                                    {preview ? (
                                        <div className="relative">
                                            <div className="relative overflow-hidden rounded-lg border bg-gray-50">
                                                <div className="flex h-48 w-full items-center justify-center bg-gray-100">
                                                    <img
                                                        src={preview}
                                                        alt={editLabel}
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
                                        <div className="flex h-48 flex-col items-center justify-center rounded-lg border-2 border-dashed bg-gray-50/30 p-6 transition-colors hover:border-primary">
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
                                                accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                                                onChange={handleImageChange}
                                                className="hidden"
                                            />
                                            <p className="mt-3 text-sm text-muted-foreground text-center">
                                                Click to browse or drag and drop
                                            </p>
                                            <p className="mt-1 text-xs text-muted-foreground text-center">
                                                Supported formats: JPEG, PNG, WebP, GIF, SVG | Max: 5MB
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
                                </div>
                            ) : (
                                // Regular Input
                                editKey === 'abouts' ? (
                                    <Textarea
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        placeholder={`Enter ${editLabel.toLowerCase()}`}
                                        rows={4}
                                        className="resize-none"
                                    />
                                ) : editKey === 'module_order' ? (
                                    <Input
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        placeholder="e.g., ['slider','photos','video']"
                                    />
                                ) : (
                                    <Input
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        placeholder={`Enter ${editLabel.toLowerCase()}`}
                                    />
                                )
                            )}

                            {!isImageUpload && (
                                <p className="text-xs text-muted-foreground">
                                    This will update the {editLabel.toLowerCase()} for your business
                                </p>
                            )}
                        </div>

                        <DialogFooter className="gap-2">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setEditModalOpen(false);
                                    resetImage();
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSave}
                                disabled={updateLoading || (isImageUpload && !imageBase64 && !editValue)}
                                className="gap-2"
                            >
                                {updateLoading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default SettingsView;