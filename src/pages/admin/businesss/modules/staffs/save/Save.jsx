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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

import PageHeader from '@/components/shear/PageHeader';
import StatusBadge from '@/components/shear/StatusBadge';
import { useApiQuery } from '@/hooks/useAppQuery';
import { useApiMutation } from '@/hooks/useAppMutation';

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
    Mail,
    Phone,
    User,
    Shield,
    Calendar,
    Eye,
    EyeOff,
} from 'lucide-react';

const Save = () => {
    const { module, setting } = useSelector((state) => state);
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [existingImageUrl, setExistingImageUrl] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        avatar: '',
        status: 'active',
        meta: {
            position: '',
        }
    });

    // Avatar upload hook
    const {
        image: imageBase64,
        preview,
        error: imageError,
        handleImageChange,
        resetImage,
        setImageUrl
    } = useImageUpload(setting?.setting?.item?.image_size || 5);

    // Fetch staff data for edit mode
    const {
        data: staffGetQuery,
        isLoading: staffGetLoading,
    } = useApiQuery({
        url: `/admin/staffs/${id}`,
        enabled: !!id && id !== 'new',
    });

    useEffect(() => {
        if (!staffGetQuery?.success) return;
        const staff = staffGetQuery.data;

        setFormData({
            name: staff.name || '',
            email: staff.email || '',
            phone: staff.phone || '',
            status: staff.status || 'active',
            meta: {
                position: staff.meta.position || '',
            }
        });

        if (staff.avatar_full_path) {
            setExistingImageUrl(staff.avatar_full_path);
            setImageUrl(staff.avatar_full_path);
        }
    }, [staffGetQuery]);

    // Create/Update mutation
    const {
        mutate: staffMutation,
        isLoading: staffMutationLoading,
        errors: staffMutationErrors,
    } = useApiMutation({
        url: '/admin/staffs',
        method: 'POST',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name.includes(".")) {
            const [parent, child] = name.split(".");

            setFormData((prev) => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value,
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
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
        if (!formData.name.trim()) {
            toast.error('Name is required');
            return;
        }
        if (!formData.email.trim()) {
            toast.error('Email is required');
            return;
        }

        setSaving(true);

        const payload = {
            id: id && id !== 'new' ? id : undefined,
            business_id: module?.business_id || '',
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            status: formData.status,
            avatar: imageBase64 || null,
            meta: formData.meta || {},
        };

        try {
            const response = await staffMutation(payload);
            if (response?.success) {
                toast.success(response?.message || "Staff saved successfully");
                navigate('/admin/staffs');
            } else {
                toast.error(response?.message || "Failed to save staff");
            }
        } catch (error) {
            console.error('Error saving staff:', error);
            toast.error('Error saving staff data');
        } finally {
            setSaving(false);
        }
    };

    const handleRemoveImage = () => {
        resetImage();
        setExistingImageUrl('');
    };

    const currentImagePreview = preview || (existingImageUrl ? existingImageUrl : null);

    const getInitials = (name) => {
        return name?.split(' ').map(word => word[0]).join('').toUpperCase() || '?';
    };

    if (staffGetLoading) {
        return (
            <div className="w-full min-h-screen bg-gray-50">
                <div className="space-y-4 p-6">
                    <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-96 bg-white rounded-lg animate-pulse"></div>
                </div>
            </div>
        );
    }

    console.log("staffMutationErrors - ", staffMutationErrors)

    return (
        <div className="min-h-screen bg-gray-50">
            <PageHeader
                title={id && id !== 'new' ? 'Edit Staff Member' : 'Add New Staff'}
                subtitle={id && id !== 'new' ? `Update staff information` : `Create a new staff account`}
                showBackButton={true}
                onBackClick={() => navigate('/admin/staffs')}
                primaryAction={{
                    onClick: handleSubmit,
                    disabled: saving,
                    icon: 'save',
                    title: id && id !== 'new' ? 'Update Staff' : 'Create Staff'
                }}
            />

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Profile & Basic Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Information Card */}
                        <Card className="shadow-sm">
                            <CardHeader className="border-b bg-gray-50/50">
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <User className="h-5 w-5 text-blue-600" />
                                    Basic Information
                                </CardTitle>
                                <CardDescription>
                                    Enter the staff member's personal details
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="pt-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Name */}
                                    <div>
                                        <Label htmlFor="name" className="text-sm font-semibold">
                                            Full Name <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="Enter full name"
                                            className="mt-1.5"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <Label htmlFor="email" className="text-sm font-semibold">
                                            Email Address <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="Enter email address"
                                            className="mt-1.5"
                                        />
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <Label htmlFor="phone" className="text-sm font-semibold">
                                            Phone Number
                                        </Label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="Enter phone number"
                                            className="mt-1.5"
                                        />
                                    </div>

                                    {/* Position */}
                                    <div>
                                        <Label htmlFor="position" className="text-sm font-semibold">
                                            Position
                                        </Label>
                                        <Input
                                            id="meta.position"
                                            name="meta.position"
                                            value={formData.meta.position}
                                            onChange={handleInputChange}
                                            placeholder="Enter job position"
                                            className="mt-1.5"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Status & Settings Card */}
                        <Card className="shadow-sm">
                            <CardHeader className="border-b bg-gray-50/50">
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <Settings className="h-5 w-5 text-orange-600" />
                                    Account Settings
                                </CardTitle>
                                <CardDescription>
                                    Configure account status and permissions
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-6">
                                <div>
                                    <Label htmlFor="status" className="text-sm font-semibold">Account Status</Label>
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
                                    <p className="text-xs text-muted-foreground mt-1.5">
                                        Active staff can access the system, inactive staff cannot
                                    </p>
                                </div>

                                {id && id !== 'new' && (
                                    <>
                                        <Separator />
                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-green-100 rounded-full">
                                                    <Shield className="h-4 w-4 text-green-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">Email Verified</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {staffGetQuery?.data?.email_verified_at ?
                                                            `Verified on ${new Date(staffGetQuery.data.email_verified_at).toLocaleDateString()}` :
                                                            'Not verified yet'}
                                                    </p>
                                                </div>
                                            </div>
                                            <Badge className={staffGetQuery?.data?.email_verified_at ?
                                                'bg-green-100 text-green-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }>
                                                {staffGetQuery?.data?.email_verified_at ? 'Verified' : 'Pending'}
                                            </Badge>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Avatar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Avatar Card */}
                        <Card className="shadow-sm">
                            <CardHeader className="border-b bg-gray-50/50">
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <ImageIcon className="h-5 w-5 text-green-600" />
                                    Profile Photo
                                </CardTitle>
                                <CardDescription>
                                    Upload a profile photo (Max {setting?.setting?.item?.image_size || 5}MB)
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-6">
                                <div className="flex flex-col items-center">
                                    {currentImagePreview ? (
                                        <div className="relative w-full">
                                            <div className="relative overflow-hidden rounded-lg border bg-gray-50">
                                                <div className="flex h-48 w-full items-center justify-center bg-gray-100">
                                                    <img
                                                        src={currentImagePreview}
                                                        alt="Avatar Preview"
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

                                            {/* Display name with avatar */}
                                            <div className="mt-3 flex items-center justify-center gap-3">
                                                <Avatar className="h-12 w-12 border">
                                                    <AvatarImage src={currentImagePreview} />
                                                    <AvatarFallback className="bg-blue-100 text-blue-600">
                                                        {getInitials(formData.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium">{formData.name || 'No name'}</p>
                                                    <p className="text-xs text-muted-foreground">{formData.email || 'No email'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed bg-gray-50/30 p-6 transition-colors hover:border-primary">
                                            <Avatar className="h-24 w-24 mb-4 border-2 border-dashed border-gray-300">
                                                <AvatarFallback className="text-4xl bg-gray-100 text-gray-400">
                                                    {getInitials(formData.name)}
                                                </AvatarFallback>
                                            </Avatar>

                                            <Label
                                                htmlFor="avatar-upload"
                                                className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
                                            >
                                                <Upload className="h-4 w-4" />
                                                Upload Photo
                                            </Label>

                                            <input
                                                id="avatar-upload"
                                                type="file"
                                                accept="image/jpeg,image/png,image/webp,image/gif"
                                                onChange={handleImageChange}
                                                className="hidden"
                                            />

                                            <p className="mt-3 text-sm text-muted-foreground text-center">
                                                Click to browse or drag and drop
                                            </p>

                                            <p className="mt-1 text-xs text-muted-foreground text-center">
                                                Supported formats: JPEG, PNG, WebP, GIF | Max size: {setting?.setting?.item?.image_size || 5}MB
                                            </p>
                                        </div>
                                    )}
                                </div>

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

                        {/* Quick Info Card (Edit Mode Only) */}
                        {id && id !== 'new' && staffGetQuery?.data && (
                            <Card className="shadow-sm border-blue-200 bg-blue-50/30">
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                                        <Calendar className="h-4 w-4 text-blue-600" />
                                        Account Info
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Joined</span>
                                        <span className="font-medium">
                                            {new Date(staffGetQuery.data.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Last Updated</span>
                                        <span className="font-medium">
                                            {new Date(staffGetQuery.data.updated_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">ID</span>
                                        <span className="font-medium">#{staffGetQuery.data.id}</span>
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