import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import {
    User,
    Mail,
    Phone,
    Calendar,
    Shield,
    CheckCircle,
    Clock,
    Activity,
    Building2,
    Globe,
    MapPin,
    Users,
    Settings,
    LayoutDashboard,
    BarChart3,
    Bell,
    HelpCircle,
} from "lucide-react";

const RootDashboard = () => {
    const { user } = useAuth(); // Assuming you have auth hook

    // You can also get user from localStorage or context
    const adminData = user || {
        id: 1,
        business_id: null,
        name: "Super Admin",
        email: "superadmin@org.com",
        phone: null,
        avatar: null,
        type: "super_admin",
        email_verified_at: "2026-06-17T09:18:58.000000Z",
        last_login_at: null,
        last_login_ip: null,
        meta: null,
        created_at: null,
        updated_at: null,
        avatar_full_path: null,
    };

    // Get initials for avatar fallback
    const getInitials = (name) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'Never';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    // Get user type badge
    const getUserTypeBadge = (type) => {
        switch (type) {
            case 'super_admin':
                return <Badge className="bg-purple-600 hover:bg-purple-700">Super Admin</Badge>;
            case 'admin':
                return <Badge className="bg-blue-600 hover:bg-blue-700">Admin</Badge>;
            case 'business':
                return <Badge className="bg-green-600 hover:bg-green-700">Business</Badge>;
            case 'manager':
                return <Badge className="bg-orange-600 hover:bg-orange-700">Manager</Badge>;
            default:
                return <Badge variant="secondary">{type}</Badge>;
        }
    };

    // Stats cards data
    const stats = [
        {
            title: "Total Businesses",
            value: "24",
            icon: Building2,
            color: "bg-blue-500",
            bgColor: "bg-blue-50",
            textColor: "text-blue-600"
        },
        {
            title: "Active Users",
            value: "156",
            icon: Users,
            color: "bg-green-500",
            bgColor: "bg-green-50",
            textColor: "text-green-600"
        },
        {
            title: "System Status",
            value: "Online",
            icon: Activity,
            color: "bg-emerald-500",
            bgColor: "bg-emerald-50",
            textColor: "text-emerald-600"
        },
        {
            title: "Last Login",
            value: formatDate(adminData.last_login_at),
            icon: Clock,
            color: "bg-purple-500",
            bgColor: "bg-purple-50",
            textColor: "text-purple-600"
        },
    ];

    // Quick actions
    const quickActions = [
        { title: "Manage Businesses", icon: Building2, color: "text-blue-600" },
        { title: "User Management", icon: Users, color: "text-green-600" },
        { title: "System Settings", icon: Settings, color: "text-purple-600" },
        { title: "Analytics", icon: BarChart3, color: "text-orange-600" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Welcome Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Dashboard
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            Welcome back, {adminData.name}! Here's what's happening with your platform.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm" className="relative">
                            <Bell className="h-4 w-4" />
                            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
                                3
                            </span>
                        </Button>
                        <Button variant="outline" size="sm">
                            <HelpCircle className="h-4 w-4 mr-2" />
                            Help
                        </Button>
                    </div>
                </div>

                {/* Admin Profile Card */}
                <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-800 dark:to-blue-800">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            {/* Avatar */}
                            <Avatar className="h-24 w-24 border-4 border-white/20 shadow-xl">
                                {adminData.avatar_full_path ? (
                                    <AvatarImage src={adminData.avatar_full_path} alt={adminData.name} />
                                ) : (
                                    <AvatarFallback className="bg-white/20 text-white text-2xl">
                                        {getInitials(adminData.name)}
                                    </AvatarFallback>
                                )}
                            </Avatar>

                            {/* Admin Info */}
                            <div className="flex-1 text-center md:text-left">
                                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                                    <h2 className="text-2xl font-bold text-white">
                                        {adminData.name}
                                    </h2>
                                    {getUserTypeBadge(adminData.type)}
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-white/90">
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4" />
                                        <span className="text-sm">{adminData.email}</span>
                                    </div>
                                    {adminData.phone && (
                                        <div className="flex items-center gap-2">
                                            <Phone className="h-4 w-4" />
                                            <span className="text-sm">{adminData.phone}</span>
                                        </div>
                                    )}
                                    {adminData.email_verified_at && (
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4" />
                                            <span className="text-sm">Email Verified</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Quick Badge */}
                            <div className="hidden lg:block">
                                <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                                    <Shield className="h-3 w-3 mr-1" />
                                    Full Access
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, index) => (
                        <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            {stat.title}
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                            {stat.value}
                                        </p>
                                    </div>
                                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                                        <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Quick Actions & Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Quick Actions */}
                    <Card className="lg:col-span-2 border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg">Quick Actions</CardTitle>
                            <CardDescription>
                                Manage your platform with these common tasks
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                {quickActions.map((action, index) => (
                                    <Button
                                        key={index}
                                        variant="outline"
                                        className="h-auto py-4 px-6 flex flex-col items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                                    >
                                        <action.icon className={`h-6 w-6 ${action.color}`} />
                                        <span className="text-sm font-medium">{action.title}</span>
                                    </Button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Admin Details */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg">Account Details</CardTitle>
                            <CardDescription>
                                Your account information
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center justify-between py-2 border-b dark:border-gray-700">
                                <span className="text-sm text-gray-500">User ID</span>
                                <span className="text-sm font-mono">#{adminData.id}</span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b dark:border-gray-700">
                                <span className="text-sm text-gray-500">Role</span>
                                <span className="text-sm font-medium capitalize">
                                    {adminData.type?.replace('_', ' ')}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b dark:border-gray-700">
                                <span className="text-sm text-gray-500">Email Verified</span>
                                <span className="text-sm">
                                    {adminData.email_verified_at ? (
                                        <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
                                            Verified
                                        </Badge>
                                    ) : (
                                        <Badge variant="destructive">Not Verified</Badge>
                                    )}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b dark:border-gray-700">
                                <span className="text-sm text-gray-500">Joined</span>
                                <span className="text-sm">
                                    {formatDate(adminData.created_at)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="text-sm text-gray-500">Last Login</span>
                                <span className="text-sm">
                                    {formatDate(adminData.last_login_at)}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Footer */}
                <div className="text-center text-sm text-gray-500 dark:text-gray-400 pt-4">
                    <p>© {new Date().getFullYear()} Your Platform. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default RootDashboard;