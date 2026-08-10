import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Phone,
  Mail,
  MapPin,
  Plus,
  X,
  Key,
} from "lucide-react";
import { FiFacebook, FiYoutube, FiInstagram, FiLinkedin } from "react-icons/fi";
import { toast } from "sonner";
import { useApiQuery } from "@/hooks/useAppQuery";
import { useApiMutation } from "@/hooks/useAppMutation";
import useImageUpload from "@/hooks/use-image-upload";
import ContentSettings from "./ContentSettings";
import SeoSettings from "./SeoSettings";

const emptySeoContent = {
  meta_title: "",
  meta_description: "",
  meta_keywords: "",
  og_title: "",
  og_description: "",
  og_image: "",
  twitter_title: "",
  twitter_description: "",
  twitter_image: "",
  canonical_url: "",
  robots: "index, follow",
};

const BusinessSettingTab = () => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editField, setEditField] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [editLabel, setEditLabel] = useState("");
  const [editKey, setEditKey] = useState("");
  const [isImageUpload, setIsImageUpload] = useState(false);
  const [isJsonField, setIsJsonField] = useState(false);
  const [isMetaField, setIsMetaField] = useState(false);
  const [metaEntries, setMetaEntries] = useState([]);
  const [newMetaKey, setNewMetaKey] = useState("");
  const [newMetaValue, setNewMetaValue] = useState("");

  const [settingsMeta, setSettingsMeta] = useState({
    navbar_id: null,
    home_page_id: null,
    footer_id: null,
  });

  const [seoContent, setSeoContent] = useState(emptySeoContent);

  const {
    image: imageBase64,
    preview,
    error: imageError,
    handleImageChange,
    resetImage,
    setImageUrl,
  } = useImageUpload(5);

  const {
    data: settingsResponse,
    isLoading: settingsLoading,
    refetch: refetchSettings,
  } = useApiQuery({
    url: `/admin/business-settings`,
  });

  const data = settingsResponse?.data || {};
  const business = data?.business || {};
  const settings = data?.settings || {};

  const { mutate: updateMutation, isLoading: updateLoading } = useApiMutation({
    url: "/admin/business-settings",
    method: "POST",
  });

  useEffect(() => {
    setSettingsMeta((p) => ({
      home_page_id: settings?.meta?.home_page_id,
      navbar_id: settings?.meta?.navbar_id,
      footer_id: settings?.meta?.footer_id,
    }));

    setSeoContent({ ...emptySeoContent, ...(settings?.meta?.seo_content || {}) });
  }, [settings]);

  const copyToClipboard = (text, label) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const handleEdit = (
    key,
    value,
    label,
    isImage = false,
    previewUrl = null,
    isJson = false,
    isMeta = false,
  ) => {
    setEditKey(key);
    setEditValue(value || "");
    setEditLabel(label);
    setIsImageUpload(isImage);
    setIsJsonField(isJson);
    setIsMetaField(isMeta);

    if (isMeta && value) {
      try {
        const parsed = typeof value === "string" ? JSON.parse(value) : value;
        const entries = Object.entries(parsed).map(([k, v]) => ({
          key: k,
          value: typeof v === "string" ? v : JSON.stringify(v),
        }));
        setMetaEntries(entries);
      } catch (error) {
        setMetaEntries([]);
      }
    } else {
      setMetaEntries([]);
    }

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

  const handleAddMetaEntry = () => {
    if (!newMetaKey.trim()) {
      toast.error("Please enter a key");
      return;
    }
    if (!newMetaValue.trim()) {
      toast.error("Please enter a value");
      return;
    }
    if (metaEntries.some((entry) => entry.key === newMetaKey.trim())) {
      toast.error("Key already exists");
      return;
    }
    setMetaEntries([
      ...metaEntries,
      { key: newMetaKey.trim(), value: newMetaValue.trim() },
    ]);
    setNewMetaKey("");
    setNewMetaValue("");
  };

  const handleRemoveMetaEntry = (index) => {
    setMetaEntries(metaEntries.filter((_, i) => i !== index));
  };

  const handleUpdateMetaEntry = (index, field, value) => {
    const updated = [...metaEntries];
    updated[index][field] = value;
    setMetaEntries(updated);
  };

  const handleSave = async () => {
    let payload = {};

    if (isImageUpload) {
      if (!imageBase64 && !editValue) {
        toast.error("Please select an image");
        return;
      }
      payload = {
        [editKey]: imageBase64 || null,
      };
    } else if (isMetaField) {
      const metaObject = {};
      metaEntries.forEach((entry) => {
        if (entry.key.trim()) {
          metaObject[entry.key.trim()] = entry.value.trim();
        }
      });
      payload = {
        [editKey]: metaObject,
      };
    } else if (isJsonField) {
      try {
        const parsedValue = JSON.parse(editValue);
        payload = {
          [editKey]: parsedValue,
        };
      } catch (error) {
        toast.error("Invalid JSON format");
        return;
      }
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
        setMetaEntries([]);
      } else {
        toast.error(response?.message || "Failed to update");
      }
    } catch (error) {
      toast.error("Error updating settings");
    }
  };

  const handleRemoveImage = () => {
    resetImage();
    setEditValue("");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const { mutate: updateBusinessMeta, isLoading: updatingBusinessmeta } = useApiMutation({
    url: "/admin/update-business-meta",
  });

  const handelSaveBusinessMeta = async (payload) => {
    try {
      const response = await updateBusinessMeta(payload);
      if (response.success) {
        toast.success(response.message || "Meta update success");
        await refetchSettings();
      }
    } catch (error) {
      toast.error(error.message || "Meta update failed");
    }
  };

  const renderMetaEntries = () => {
    if (metaEntries.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <Key className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No meta entries added yet</p>
          <p className="text-sm">Add key-value pairs below</p>
        </div>
      );
    }

    return (
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {metaEntries.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg group">
            <div className="flex-1 grid grid-cols-2 gap-2">
              <Input
                value={entry.key}
                onChange={(e) => handleUpdateMetaEntry(index, "key", e.target.value)}
                placeholder="Key"
                className="bg-white"
              />
              <Input
                value={entry.value}
                onChange={(e) => handleUpdateMetaEntry(index, "value", e.target.value)}
                placeholder="Value"
                className="bg-white"
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveMetaEntry(index)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    );
  };

  if (settingsLoading) {
    return (
      <div className="p-6">
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
    <div className="space-y-6">
      <Card className="shadow-sm mb-0 pt-0 mt-0">
        <CardHeader className="border-b bg-linear-to-r from-blue-50 to-indigo-50 p-0 m-0">
          <div className="flex items-center justify-between p-6">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Building2 className="h-6 w-6 text-blue-600" />
                Business Information
              </CardTitle>
              <CardDescription>Core business details and identification</CardDescription>
            </div>
            <Badge className="bg-green-100 text-green-800 border-0">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Active
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Building2 className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Business Name</p>
                    <p className="font-semibold text-lg">{business.name || "N/A"}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit("name", business.name, "Business Name")}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-full">
                  <Copy className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Business ID</p>
                  <p className="font-mono text-sm">#{business.id}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(business.id, "Business ID")}>
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <Badge className="bg-green-100 text-green-800 border-0 capitalize">{business.status}</Badge>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-full">
                  <Calendar className="h-4 w-4 text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Created</p>
                  <p className="font-medium text-sm">{formatDate(business.created_at)}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-100 rounded-full">
                  <Globe className="h-4 w-4 text-cyan-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Subdomain</p>
                  <p className="font-medium text-sm">{business.subdomain || "N/A"}</p>
                </div>
                {business.subdomain && (
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(business.subdomain, "Subdomain")}>
                    <Copy className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-teal-100 rounded-full">
                  <Globe className="h-4 w-4 text-teal-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Domain</p>
                  <p className="font-medium text-sm">{business.domain || "N/A"}</p>
                </div>
                {business.domain && (
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(business.domain, "Domain")}>
                    <Copy className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-full">
                  <Database className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Database Type</p>
                  <Badge variant="outline" className="capitalize">{business.database_type || "N/A"}</Badge>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-100 rounded-full">
                  <Globe className="h-4 w-4 text-pink-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Language</p>
                  <p className="font-medium text-sm uppercase">{settings.lang_slug || "N/A"}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-full">
                  <Mail className="h-4 w-4 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium text-sm truncate">{business.email || "N/A"}</p>
                </div>
                {business.email && (
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(business.email, "Email")}>
                    <Copy className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <Phone className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="font-medium text-sm">{business.phone || "N/A"}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-full">
                  <MapPin className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="font-medium text-sm truncate">{business.location || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card className="shadow-sm">
          <CardHeader className="border-b bg-linear-to-r from-emerald-50 to-teal-50">
            <CardTitle className="flex items-center gap-2 text-xl">
              <ImageIcon className="h-5 w-5 text-emerald-600" />
              Branding
            </CardTitle>
            <CardDescription>Logo, favicon and brand assets</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-full">
                  <ImageIcon className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Logo</p>
                  {settings.logo && settings.logo_full_path ? (
                    <div className="mt-1">
                      <img src={settings.logo_full_path} alt="Logo" className="h-12 w-auto object-contain" />
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">No logo uploaded</p>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit("logo", settings.logo, "Logo", true, settings?.logo_full_path)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-full">
                  <ImageIcon className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Favicon</p>
                  {settings.favicon && settings.favicon_full_path ? (
                    <div className="mt-1">
                      <img src={settings.favicon_full_path} alt="Favicon" className="h-8 w-8 object-contain" />
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">No favicon uploaded</p>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit("favicon", settings.favicon, "Favicon", true, settings.favicon_full_path)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-full">
                  <ImageIcon className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Footer Logo</p>
                  {settings.footer_logo && settings.footer_logo_full_path ? (
                    <div className="mt-1">
                      <img src={settings.footer_logo_full_path} alt="Footer Logo" className="h-10 w-auto object-contain" />
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">No footer logo uploaded</p>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit("footer_logo", settings.footer_logo, "Footer Logo", true, settings?.footer_logo_full_path)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-sky-50">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Link2 className="h-5 w-5 text-blue-600" />
              Social Media
            </CardTitle>
            <CardDescription>Connect your social media profiles</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {[
              { key: "facebook_link", label: "Facebook Link", icon: FiFacebook, iconBg: "bg-blue-100", iconColor: "text-blue-600" },
              { key: "youtube_link", label: "YouTube Link", icon: FiYoutube, iconBg: "bg-red-100", iconColor: "text-red-600" },
              { key: "instagram_link", label: "Instagram Link", icon: FiInstagram, iconBg: "bg-pink-100", iconColor: "text-pink-600" },
              { key: "linkedin_link", label: "LinkedIn Link", icon: FiLinkedin, iconBg: "bg-indigo-100", iconColor: "text-indigo-600" },
              { key: "play_store_link", label: "Play Store Link", icon: Link2, iconBg: "bg-green-100", iconColor: "text-green-600" },
              { key: "app_store_link", label: "App Store Link", icon: Link2, iconBg: "bg-blue-100", iconColor: "text-blue-600" },
            ].map(({ key, label, icon: Icon, iconBg, iconColor }) => (
              <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group">
                <div className="flex items-center gap-3">
                  <div className={`p-2 ${iconBg} rounded-full`}>
                    <Icon className={`h-4 w-4 ${iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{label.replace(" Link", "")}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[200px]">{settings[key] || "Not set"}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(key, settings[key], label)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <SeoSettings
          seoContent={seoContent}
          setSeoContent={setSeoContent}
          logo={settings.logo}
          logoFullPath={settings.logo_full_path}
          handelSaveBusinessMeta={handelSaveBusinessMeta}
          updatingBusinessmeta={updatingBusinessmeta}
        />
        {/* <Card className="shadow-sm">
          <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-slate-50">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Server className="h-5 w-5 text-slate-600" />
              Database Information
            </CardTitle>
            <CardDescription>Database connection details</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {business.database_type !== "shared" && (
                <>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Host</p>
                    <p className="font-mono text-sm">{business.db_host || "N/A"}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Port</p>
                    <p className="font-mono text-sm">{business.db_port || "N/A"}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Database</p>
                    <p className="font-mono text-sm">{business.db_name || "N/A"}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-muted-foreground">User</p>
                    <p className="font-mono text-sm">{business.db_user || "N/A"}</p>
                  </div>
                </>
              )}
              {business.database_type === "shared" && (
                <div className="col-span-2 p-4 bg-green-50 rounded-lg text-center">
                  <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-green-800">Shared Database</p>
                  <p className="text-xs text-green-600">Using shared database configuration</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card> */}

        <ContentSettings
          settingsMeta={settingsMeta}
          setSettingsMeta={setSettingsMeta}
          handelSaveBusinessMeta={handelSaveBusinessMeta}
          updatingBusinessmeta={updatingBusinessmeta}
        />
      </div>

      <Dialog
        open={editModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            resetImage();
            setMetaEntries([]);
            setNewMetaKey("");
            setNewMetaValue("");
          }
          setEditModalOpen(open);
        }}
      >
        <DialogContent className={isMetaField ? "max-w-2xl" : "max-w-md"}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5 text-blue-600" />
              Edit {editLabel}
            </DialogTitle>
            <DialogDescription>
              {isImageUpload
                ? `Upload a new ${editLabel.toLowerCase()} for your business`
                : isMetaField
                  ? `Add key-value pairs for your meta settings`
                  : `Update the ${editLabel.toLowerCase()} for your business`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {isImageUpload ? (
              <div className="space-y-4">
                {preview ? (
                  <div className="relative">
                    <div className="relative overflow-hidden rounded-lg border bg-gray-50">
                      <div className="flex h-48 w-full items-center justify-center bg-gray-100">
                        <img src={preview} alt={editLabel} className="max-h-full max-w-full object-contain" />
                      </div>
                      <div className="absolute top-2 right-2">
                        <Button type="button" variant="destructive" size="sm" onClick={handleRemoveImage} className="gap-1">
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
                    <p className="mt-3 text-sm text-muted-foreground text-center">Click to browse or drag and drop</p>
                    <p className="mt-1 text-xs text-muted-foreground text-center">Supported formats: JPEG, PNG, WebP, GIF, SVG | Max: 5MB</p>
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
                    <AlertDescription className="text-sm">Image loaded successfully! Ready to upload.</AlertDescription>
                  </Alert>
                )}
              </div>
            ) : isMetaField ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <Input value={newMetaKey} onChange={(e) => setNewMetaKey(e.target.value)} placeholder="Enter key" className="bg-white" />
                    <Input value={newMetaValue} onChange={(e) => setNewMetaValue(e.target.value)} placeholder="Enter value" className="bg-white" />
                  </div>
                  <Button onClick={handleAddMetaEntry} size="sm" className="gap-1">
                    <Plus className="h-4 w-4" />
                    Add
                  </Button>
                </div>

                <div className="border rounded-lg p-4 bg-gray-50/50">{renderMetaEntries()}</div>

                {metaEntries.length > 0 && (
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs text-blue-700">
                      <strong>{metaEntries.length}</strong> meta entries configured
                    </p>
                  </div>
                )}
              </div>
            ) : isJsonField ? (
              <Textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                placeholder={`Enter ${editLabel.toLowerCase()} in JSON format`}
                rows={8}
                className="resize-none font-mono text-sm"
              />
            ) : (
              <Input value={editValue} onChange={(e) => setEditValue(e.target.value)} placeholder={`Enter ${editLabel.toLowerCase()}`} />
            )}

            {!isImageUpload && !isJsonField && !isMetaField && (
              <p className="text-xs text-muted-foreground">This will update the {editLabel.toLowerCase()} for your business</p>
            )}
            {isJsonField && <p className="text-xs text-muted-foreground">Enter valid JSON format for the {editLabel.toLowerCase()}</p>}
            {isMetaField && (
              <p className="text-xs text-muted-foreground">Add key-value pairs for your meta settings. These will be stored as JSON.</p>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setEditModalOpen(false);
                resetImage();
                setMetaEntries([]);
                setNewMetaKey("");
                setNewMetaValue("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={updateLoading || (isImageUpload && !imageBase64 && !editValue) || (isMetaField && metaEntries.length === 0)}
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
  );
};

export default BusinessSettingTab;