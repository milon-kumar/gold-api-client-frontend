import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useApiQuery } from "@/hooks/useAppQuery.js";
import { Modules } from "@/pages/admin/businesss/details/Module.jsx";

import {
  Building2,
  Mail,
  Phone,
  Globe,
  Database,
  Settings,
  Calendar,
  Activity,
  Edit,
  RefreshCw,
  Key,
  Shield,
  User,
  CheckCircle,
  XCircle,
  Server,
  HardDrive,
  Share2,
  TrendingUp,
  Users,
  DollarSign,
  Eye,
  MoreVertical,
  Download,
  Printer,
  Layers2,
  Copy,
  AlertCircle,
  ArrowLeft,
  LayoutDashboard,
  Images,
  Video,
  Info,
  MenuSquare,
  Grid2x2,
  FolderKanban,
  ImageIcon,
  BarChart3,
  Layers3,
  UserPlus,
  HandCoins,
  Search,
  Filter,
  CheckSquare,
  Square,
  ChevronDown,
  ChevronUp,
  Save,
  Clock,
  Lock,
  Unlock,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx";
import { Checkbox } from "@/components/ui/checkbox.jsx";
import { useApiMutation } from "@/hooks/useAppMutation.js";
import { toast } from "sonner";

const Index = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [businessModulese, setBusinessModules] = useState([]);

  const {
    data: response,
    isLoading: businessLoading,
    refetch,
  } = useApiQuery({
    url: `/admin/businesses/${id}`,
    enabled: !!id,
  });

  const data = response?.data?.data || {};
  const { user = {}, modules: businessModules = [], ...business } = data;

  const { data: moduleGroupsResponse } = useApiQuery({
    url: "/admin/module-groups",
  });

  const [moduleName, setModuleName] = useState(null);
  const [moduleGroup, setModuleGroup] = useState("all");

  const { data: modulesResponse } = useApiQuery({
    url: "/admin/modules",
    params: {
      name: moduleName,
      group_slug: moduleGroup,
    },
  });

  // const business = response?.data?.data || {};
  // const user = business?.user || {};
  const moduleGroups = moduleGroupsResponse?.data?.data || [];
  const modules = modulesResponse?.data?.data || [];

  const { data: getBusinessModulesResponse } = useApiQuery({
    url: `/admin/businesses/${id}`,
    enabled: !!id,
  });

  const businessModuleIds =
    getBusinessModulesResponse?.data?.businessModuleIds || [];
  // console.log("getBusinessModulesResponse Index- ", businessModuleIds);

  // useEffect(() => {
  //     if (!modules) return;

  //     const coreModuleIds = Object.values(modules)
  //         .flat()
  //         .filter(module => module.is_core === 1)
  //         .map(module => module.id);

  //     setBusinessModules([
  //         ...new Set([
  //             ...coreModuleIds,
  //             ...(businessModuleIds || [])
  //         ])
  //     ]);
  // }, [modules, businessModuleIds]);

  //   const handleModuleSubmit = async () => {
  //     const response = await modulesCreate({
  //       business_id: business?.id,
  //       user_id: user?.id,
  //       business_modules_id: businessModules,
  //     });
  //     if (response.success) {
  //       toast.success(response.message || "Module assigned success.");
  //     }
  //   };

  if (businessLoading) {
    return (
      <div className="w-full min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-indigo-600 animate-pulse" />
            </div>
          </div>
          <p className="mt-6 text-slate-600 font-medium">
            Loading business details...
          </p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: Building2, count: null },
    { id: "database", label: "Database", icon: Database, count: null },
    { id: "activity", label: "Activity", icon: Activity, count: "12" },
    { id: "settings", label: "Settings", icon: Settings, count: null },
    { id: "modules", label: "Modules", icon: Layers2, count: null },
  ];

  const StatusBadge = ({ status }) => {
    const statusConfig = {
      active: {
        color: "bg-emerald-500",
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        icon: CheckCircle,
        label: "Active",
      },
      inactive: {
        color: "bg-rose-500",
        bg: "bg-rose-50",
        text: "text-rose-700",
        icon: XCircle,
        label: "Inactive",
      },
      pending: {
        color: "bg-amber-500",
        bg: "bg-amber-50",
        text: "text-amber-700",
        icon: Clock,
        label: "Pending",
      },
    };
    const config = statusConfig[status] || statusConfig.active;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${config.bg} ${config.text}`}
      >
        <Icon className="w-4 h-4 mr-1.5" />
        {config.label}
      </span>
    );
  };

  return (
    <div className="w-full min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50">
      {/* Premium Header with Stats */}
      <div className="w-full bg-white border-b border-slate-200 shadow-sm">
        <div className="w-full px-8 py-6">
          {/* Top Bar */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center space-x-4">
              <div className="bg-linear-to-br from-indigo-500 to-indigo-600 rounded-[5px] p-3 shadow-lg shadow-indigo-200">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold text-slate-900">
                    {business.name}
                  </h1>
                  <StatusBadge status={business.status} />
                </div>
                <p className="text-slate-500 flex items-center space-x-4">
                  <span className="flex items-center">
                    <Globe className="w-4 h-4 mr-1" />
                    {business.domain}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Since{" "}
                    {new Date(business?.created_at).toLocaleDateString(
                      "en-US",
                      { month: "long", year: "numeric" },
                    )}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-[5px] transition-all duration-200">
                <Download className="w-5 h-5" />
              </button>

              <button
                onClick={() => refetch()}
                className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-[5px] transition-all duration-200"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="text-sm font-medium">Refresh</span>
              </button>
              <Button>
                <Edit className="w-3 h-3" />
                <span className="text-sm font-medium">Edit Business</span>
              </Button>
              <Button
                variant={"destructive"}
                onClick={() => navigate("/admin/businesses")}
              >
                <ArrowLeft className="w-4 h-4" /> Go Back
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-linear-to-br from-indigo-50 to-indigo-100 rounded-[5px] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-600 text-sm font-medium">
                    Total Revenue
                  </p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    $124,592
                  </p>
                  <p className="text-emerald-600 text-xs mt-1 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +12.5% from last month
                  </p>
                </div>
                <div className="bg-white/50 rounded-[5px] p-2">
                  <DollarSign className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
            </div>
            <div className="bg-linear-to-br from-emerald-50 to-emerald-100 rounded-[5px] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-600 text-sm font-medium">
                    Total Users
                  </p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    2,847
                  </p>
                  <p className="text-emerald-600 text-xs mt-1 flex items-center">
                    <Users className="w-3 h-3 mr-1" />
                    +180 new this week
                  </p>
                </div>
                <div className="bg-white/50 rounded-[5px] p-2">
                  <Users className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </div>
            <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-[5px] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">
                    Page Views
                  </p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    89.4K
                  </p>
                  <p className="text-blue-600 text-xs mt-1 flex items-center">
                    <Eye className="w-3 h-3 mr-1" />
                    +23.1% increase
                  </p>
                </div>
                <div className="bg-white/50 rounded-[5px] p-2">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-linear-to-br from-amber-50 to-amber-100 rounded-[5px] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-600 text-sm font-medium">
                    Conversion Rate
                  </p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    3.24%
                  </p>
                  <p className="text-amber-600 text-xs mt-1 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +0.8% from target
                  </p>
                </div>
                <div className="bg-white/50 rounded-[5px] p-2">
                  <TrendingUp className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full py-8">
        {/* Premium Tabs */}
        <div className="bg-white rounded-[5px] shadow-sm border border-slate-200 overflow-hidden mb-8">
          <div className="border-b border-slate-200 px-6">
            <div className="flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                        relative cursor-pointer flex items-center space-x-2 py-4 px-1 text-sm font-semibold
                        transition-all duration-200 group
                        ${
                          activeTab === tab.id
                            ? "text-indigo-600"
                            : "text-slate-500 hover:text-slate-700"
                        }
                    `}
                  >
                    <Icon
                      className={`w-4 h-4 ${activeTab === tab.id ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-500"}`}
                    />
                    <span>{tab.label}</span>
                    {tab.count && (
                      <span className="bg-slate-100 text-slate-600 text-xs px-1.5 py-0.5 rounded-full">
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tab Content - Premium Design */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Business Info */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-[5px] shadow-sm border border-slate-200 overflow-hidden">
                  <div className="p-6 border-b border-slate-200">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center">
                      <Building2 className="w-5 h-5 mr-2 text-indigo-600" />
                      Business Information
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <PremiumInfoCard
                        icon={Globe}
                        label="Domain"
                        value={business.domain}
                        link={`https://${business.domain}`}
                      />
                      <PremiumInfoCard
                        icon={Share2}
                        label="Subdomain"
                        value={business.subdomain}
                        link={`https://${business.subdomain}.${business.domain}`}
                      />
                      <PremiumInfoCard
                        icon={Database}
                        label="Database Type"
                        value={
                          business.database_type?.toUpperCase() ||
                          "Shared Hosting"
                        }
                        badge="Primary"
                      />
                      <PremiumInfoCard
                        icon={Server}
                        label="Hosting Plan"
                        value="Business Pro"
                        badge="Premium"
                      />
                      <PremiumInfoCard
                        icon={Calendar}
                        label="Created At"
                        value={new Date(business.created_at).toLocaleString()}
                      />
                      <PremiumInfoCard
                        icon={Activity}
                        label="Last Updated"
                        value={new Date(business.updated_at).toLocaleString()}
                      />
                    </div>
                  </div>
                </div>

                {/* Recent Activity Feed */}
                <div className="bg-white rounded-[5px] shadow-sm border border-slate-200 overflow-hidden">
                  <div className="p-6 border-b border-slate-200">
                    <div className="flex justify-between items-center">
                      <h2 className="text-lg font-bold text-slate-900 flex items-center">
                        <Activity className="w-5 h-5 mr-2 text-indigo-600" />
                        Recent Activity
                      </h2>
                      <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                        View All →
                      </button>
                    </div>
                  </div>
                  <div className="divide-y divide-slate-100">
                    <PremiumActivityItem
                      icon={User}
                      title="Business Created"
                      description={`Business "${business.name}" was successfully created and configured`}
                      time={business.created_at}
                      type="success"
                    />
                    <PremiumActivityItem
                      icon={Key}
                      title="Admin Login"
                      description={`${user.name} logged in from IP ${user.last_login_ip}`}
                      time={user.last_login_at}
                      type="info"
                    />
                    <PremiumActivityItem
                      icon={Database}
                      title="Database Configured"
                      description="Database type set to shared hosting with automatic backups"
                      time={business.updated_at}
                      type="warning"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - User Profile */}
              <div className="space-y-6">
                {/* Premium Profile Card */}
                <div className="bg-white rounded-[5px] shadow-sm border border-slate-200 overflow-hidden">
                  <div className="bg-linear-to-r from-indigo-500 to-indigo-600 p-6">
                    <div className="flex justify-between items-start">
                      <div className="relative">
                        <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-[5px] flex items-center justify-center border-4 border-white/30">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="rounded-[5px] w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-12 h-12 text-white" />
                          )}
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-emerald-500 rounded-full p-1 border-4 border-white">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                      </div>
                      <button className="text-white/80 hover:text-white">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-xl font-bold text-white">
                        {user.name}
                      </h3>
                      <p className="text-indigo-100 text-sm mt-1">
                        {user.type?.toUpperCase()} Administrator
                      </p>
                      <div className="flex items-center mt-3 space-x-2">
                        <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-[5px]">
                          ID: #{user.id}
                        </span>
                        {user.email_verified_at && (
                          <span className="bg-emerald-500/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-[5px] flex items-center">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="space-y-3">
                      <PremiumDetailItem
                        icon={Mail}
                        label="Email"
                        value={user.email}
                        copyable
                      />
                      <PremiumDetailItem
                        icon={Phone}
                        label="Phone"
                        value={user.phone || "Not provided"}
                      />
                      <PremiumDetailItem
                        icon={Server}
                        label="Last IP"
                        value={user.last_login_ip || "Not recorded"}
                      />
                      <PremiumDetailItem
                        icon={Calendar}
                        label="Joined"
                        value={new Date(user.created_at).toLocaleDateString(
                          "en-US",
                          { month: "long", day: "numeric", year: "numeric" },
                        )}
                      />
                    </div>
                    <div className="pt-4 space-y-2">
                      <button className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-[5px] transition-all duration-200 font-medium">
                        <Key className="w-4 h-4" />
                        <span>Reset Password</span>
                      </button>
                      <button className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50 text-slate-700 rounded-[5px] transition-all duration-200 font-medium">
                        <Shield className="w-4 h-4" />
                        <span>Manage Permissions</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-linear-to-br from-slate-50 to-slate-100 rounded-[5px] p-6 border border-slate-200">
                  <h4 className="font-semibold text-slate-900 mb-3">
                    Quick Actions
                  </h4>
                  <div className="space-y-2">
                    <button className="w-full text-left px-3 py-2 hover:bg-white rounded-[5px] transition-all duration-200 text-sm text-slate-600 hover:text-indigo-600">
                      → View Business Analytics
                    </button>
                    <button className="w-full text-left px-3 py-2 hover:bg-white rounded-[5px] transition-all duration-200 text-sm text-slate-600 hover:text-indigo-600">
                      → Export Business Data
                    </button>
                    <button className="w-full text-left px-3 py-2 hover:bg-white rounded-[5px] transition-all duration-200 text-sm text-slate-600 hover:text-indigo-600">
                      → Configure Backup Settings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "database" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-[5px] shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center">
                    <Database className="w-5 h-5 mr-2 text-indigo-600" />
                    Database Configuration
                  </h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <PremiumInfoCard
                      icon={HardDrive}
                      label="Database Type"
                      value={business.database_type?.toUpperCase() || "MySQL"}
                    />
                    <PremiumInfoCard
                      icon={Server}
                      label="Host"
                      value={business.db_host || "localhost"}
                    />
                    <PremiumInfoCard
                      icon={Building2}
                      label="Database Name"
                      value={business.db_name || business.subdomain + "_db"}
                    />
                    <PremiumInfoCard
                      icon={User}
                      label="Database User"
                      value={business.db_user || business.subdomain + "_user"}
                    />
                  </div>
                </div>
              </div>
              <div className="bg-amber-50 rounded-[5px] p-6 border border-amber-200">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-amber-900">
                      Security Information
                    </h4>
                    <p className="text-sm text-amber-800 mt-1">
                      Database credentials are encrypted and stored securely.
                      For security reasons, passwords are not displayed. Contact
                      system administrator for database access.
                    </p>
                    <button className="mt-3 text-amber-700 text-sm font-medium hover:text-amber-800">
                      Request Database Access →
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-white rounded-[5px] shadow-sm border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-900 mb-4">
                  Database Statistics
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Size</span>
                    <span className="font-semibold text-slate-900">
                      124.5 MB
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Tables</span>
                    <span className="font-semibold text-slate-900">24</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Backups</span>
                    <span className="font-semibold text-slate-900">Daily</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "activity" && (
          <div className="bg-white rounded-[5px] shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-indigo-600" />
                Complete Activity Log
              </h2>
            </div>
            <div className="divide-y divide-slate-100">
              {[1, 2, 3, 4, 5].map((_, idx) => (
                <PremiumActivityItem
                  key={idx}
                  icon={idx % 2 === 0 ? User : Database}
                  title={
                    idx === 0
                      ? "Business Configuration Updated"
                      : idx === 1
                        ? "New User Registration"
                        : "Database Backup Completed"
                  }
                  description={
                    idx === 0
                      ? "Business settings were modified by administrator"
                      : "15 new users registered in the last 24 hours" ||
                        "Automated backup completed successfully"
                  }
                  time={new Date(Date.now() - idx * 86400000).toISOString()}
                  type={idx === 2 ? "success" : "info"}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-[5px] shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center">
                    <Settings className="w-5 h-5 mr-2 text-indigo-600" />
                    Business Settings
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  <PremiumSettingToggle
                    label="Maintenance Mode"
                    description="Put the website under maintenance mode"
                    defaultChecked={false}
                  />
                  <PremiumSettingToggle
                    label="Allow Registration"
                    description="Allow new user registrations"
                    defaultChecked={true}
                  />
                  <PremiumSettingToggle
                    label="Email Notifications"
                    description="Send email notifications for important events"
                    defaultChecked={true}
                  />
                  <PremiumSettingToggle
                    label="Auto Backup"
                    description="Automatically backup database daily"
                    defaultChecked={true}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-rose-50 to-rose-100 rounded-[5px] p-6 border border-rose-200">
                <h3 className="font-bold text-rose-900 mb-2">Danger Zone</h3>
                <p className="text-sm text-rose-800 mb-4">
                  Permanently delete this business and all associated data
                </p>
                <button className="w-full bg-white border border-rose-300 hover:border-rose-400 text-rose-700 px-4 py-2 rounded-[5px] transition-all duration-200 font-medium">
                  Delete Business
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "modules" && (
          <Modules
            business={business}
            user={user}
            businessModules={businessModules}
          />
        )}
      </div>
    </div>
  );
};

// Premium Helper Components
const PremiumInfoCard = ({ icon: Icon, label, value, link, badge }) => (
  <div className="group relative">
    <div className="bg-slate-50 rounded-[5px] p-4 hover:shadow-md transition-all duration-200 group-hover:border-indigo-200 border border-transparent">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-white rounded-[5px] p-2 shadow-sm">
            <Icon className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              {label}
            </p>
            {link ? (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-900 font-semibold hover:text-indigo-600 transition-colors"
              >
                {value}
              </a>
            ) : (
              <p className="text-slate-900 font-semibold">
                {value || "Not specified"}
              </p>
            )}
          </div>
        </div>
        {badge && (
          <span
            className={`text-xs px-2 py-1 rounded-[5px] font-medium ${
              badge === "Primary"
                ? "bg-indigo-100 text-indigo-700"
                : badge === "Premium"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-slate-100 text-slate-700"
            }`}
          >
            {badge}
          </span>
        )}
      </div>
    </div>
  </div>
);

const PremiumDetailItem = ({ icon: Icon, label, value, copyable }) => (
  <div className="flex items-center justify-between py-2">
    <div className="flex items-center space-x-2">
      <Icon className="w-4 h-4 text-slate-400" />
      <span className="text-sm text-slate-600">{label}</span>
    </div>
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium text-slate-900">{value}</span>
      {copyable && value !== "Not provided" && (
        <button className="text-slate-400 hover:text-indigo-600">
          <Copy className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  </div>
);

const PremiumActivityItem = ({
  icon: Icon,
  title,
  description,
  time,
  type,
}) => {
  const typeColors = {
    success: "bg-emerald-100 text-emerald-600",
    warning: "bg-amber-100 text-amber-600",
    info: "bg-blue-100 text-blue-600",
    default: "bg-slate-100 text-slate-600",
  };

  return (
    <div className="flex items-start space-x-4 p-4 hover:bg-slate-50 transition-all duration-200">
      <div
        className={`rounded-[5px] p-2 ${typeColors[type] || typeColors.default}`}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <h4 className="font-semibold text-slate-900">{title}</h4>
          <span className="text-xs text-slate-500">
            {new Date(time).toLocaleString()}
          </span>
        </div>
        <p className="text-sm text-slate-600 mt-1">{description}</p>
      </div>
    </div>
  );
};

const PremiumSettingToggle = ({ label, description, defaultChecked }) => {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-[5px]">
      <div>
        <h4 className="font-medium text-slate-900">{label}</h4>
        <p className="text-sm text-slate-500 mt-0.5">{description}</p>
      </div>
      <button
        onClick={() => setChecked(!checked)}
        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 ${
          checked ? "bg-indigo-600" : "bg-slate-300"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-all duration-300 ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
};

export default Index;
