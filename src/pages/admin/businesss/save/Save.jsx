import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useApiQuery } from "@/hooks/useAppQuery";
import { useApiMutation } from "@/hooks/useAppMutation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {toast} from "sonner"
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

const BusinessSave = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEditMode = !!id;

  // Form state
  const [formData, setFormData] = useState({
    // Business fields
    name: "",
    email: "",
    phone: "",
    location: "",
    subdomain: "",
    domain: "",
    database_type: "shared",
    status: "active",
    settings: {
      theme: "default",
      language: "en",
    },
    // User fields
    user_name: "",
    user_email: "",
    user_phone: "",
    user_type: "business",
  });

  // Fetch business data if in edit mode
  const { data: response, isLoading: isLoadingBusiness } = useApiQuery({
    url: `/admin/businesses/${id}`,
    enabled: !!id,
  });

  // Single mutation for both business and user
  const { mutate: saveBusinessAndUser, isLoading: isSaving } = useApiMutation({
    url: isEditMode ? `/admin/businesses/${id}` : "/admin/businesses",
    method: isEditMode ? "PUT" : "POST",
    onSuccess: (data) => {
      toast({
        title: isEditMode ? "Business Updated" : "Business Created",
        description: isEditMode
          ? "Business and user information updated successfully"
          : "New business created successfully",
      });
      const businessId = data?.data?.data?.id || id;
      navigate(`/admin/businesses/${businessId}`);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to save business",
        variant: "destructive",
      });
    },
  });

  // Load business data when available
  useEffect(() => {
    if (response?.data?.data) {
      const businessData = response.data.data;
      const userData = businessData.user || {};

      setFormData({
        // Business fields
        name: businessData.name || "",
        email: businessData.email || "",
        phone: businessData.phone || "",
        location: businessData.location || "",
        subdomain: businessData.subdomain || "",
        domain: businessData.domain || "",
        database_type: businessData.database_type || "shared",
        status: businessData.status || "active",
        settings: businessData.settings
          ? typeof businessData.settings === "string"
            ? JSON.parse(businessData.settings)
            : businessData.settings
          : { theme: "default", language: "en" },
        // User fields
        user_name: userData.name || "",
        user_email: userData.email || "",
        user_phone: userData.phone || "",
        user_type: userData.type || "business",
      });
    }
  }, [response]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle settings changes
  const handleSettingsChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        [key]: value,
      },
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Prepare payload with both business and user data
      const payload = {
        // Business fields
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        subdomain: formData.subdomain,
        domain: formData.domain,
        database_type: formData.database_type,
        status: formData.status,
        settings: JSON.stringify(formData.settings),
        // User fields
        user: {
          name: formData.user_name,
          email: formData.user_email,
          phone: formData.user_phone,
          type: formData.user_type,
        },
      };

      // Save business with user in one API call
      saveBusinessAndUser(payload);
    } catch (error) {
      console.error("Error saving business:", error);
    }
  };

  if (isLoadingBusiness) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container max-w-5xl mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/admin/businesses")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {isEditMode ? "Edit Business" : "Create New Business"}
            </h1>
            <p className="text-muted-foreground">
              {isEditMode
                ? `Update business and user information`
                : "Add a new business with user account"}
            </p>
          </div>
        </div>
        {isEditMode && (
          <Badge
            variant={formData.status === "active" ? "default" : "secondary"}
          >
            {formData.status}
          </Badge>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="basic" className="space-y-4">
          <TabsList>
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="user">User Information</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            {isEditMode && <TabsTrigger value="advanced">Advanced</TabsTrigger>}
          </TabsList>

          {/* Basic Information Tab */}
          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Enter the core business details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Business Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter business name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Business Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="business@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Business Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+8801712345678"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="City, Country"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subdomain">Subdomain</Label>
                    <Input
                      id="subdomain"
                      name="subdomain"
                      value={formData.subdomain}
                      onChange={handleChange}
                      placeholder="business-subdomain"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="domain">Custom Domain</Label>
                    <Input
                      id="domain"
                      name="domain"
                      value={formData.domain}
                      onChange={handleChange}
                      placeholder="business.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="database_type">Database Type</Label>
                    <Select
                      value={formData.database_type}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          database_type: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select database type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="shared">Shared</SelectItem>
                        <SelectItem value="dedicated">Dedicated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, status: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Information Tab */}
          <TabsContent value="user">
            <Card>
              <CardHeader>
                <CardTitle>User Information</CardTitle>
                <CardDescription>
                  Manage the business owner/user account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="user_name">User Name *</Label>
                    <Input
                      id="user_name"
                      name="user_name"
                      value={formData.user_name}
                      onChange={handleChange}
                      placeholder="Enter user name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user_email">User Email *</Label>
                    <Input
                      id="user_email"
                      name="user_email"
                      type="email"
                      value={formData.user_email}
                      onChange={handleChange}
                      placeholder="user@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user_phone">User Phone</Label>
                    <Input
                      id="user_phone"
                      name="user_phone"
                      value={formData.user_phone}
                      onChange={handleChange}
                      placeholder="+8801712345678"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user_type">User Type</Label>
                    <Select
                      value={formData.user_type}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, user_type: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select user type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Business Settings</CardTitle>
                <CardDescription>
                  Configure business preferences and options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <Select
                      value={formData.settings?.theme || "default"}
                      onValueChange={(value) =>
                        handleSettingsChange("theme", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select
                      value={formData.settings?.language || "en"}
                      onValueChange={(value) =>
                        handleSettingsChange("language", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="bn">Bengali</SelectItem>
                        <SelectItem value="hi">Hindi</SelectItem>
                        <SelectItem value="ar">Arabic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced Tab (Edit Mode Only) */}
          {isEditMode && (
            <TabsContent value="advanced">
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Options</CardTitle>
                  <CardDescription>
                    Additional business configurations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Business ID</Label>
                    <Input
                      value={id}
                      disabled
                      className="font-mono text-sm bg-muted"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Created At</Label>
                    <Input
                      value={response?.data?.data?.created_at || ""}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Updated</Label>
                    <Input
                      value={response?.data?.data?.updated_at || ""}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/businesses")}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditMode ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {isEditMode ? "Update Business" : "Create Business"}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BusinessSave;
