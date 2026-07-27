import useImageUpload from "@/hooks/use-image-upload";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

// ShadCN Components
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Check, ChevronsUpDown } from "lucide-react";

import PageHeader from "@/components/shear/PageHeader";
import StatusBadge from "@/components/shear/StatusBadge";
import { STATUS } from "@/store/default/types";

// Icons
import * as LucideIcons from "lucide-react";
import {
  FileText,
  Globe,
  Info,
  Link2,
  Loader2,
  MessageSquare,
  Save as SaveIcon,
  LayoutTemplate,
  FilePenLine,
  Settings,
  Newspaper,
  Files,
  Building2,
  Bell,
  Image,
  Video,
  Phone,
} from "lucide-react";

import { useApiMutation } from "@/hooks/useAppMutation";
import { useApiQuery } from "@/hooks/useAppQuery";
import SearchableSelect from "@/components/ui/searchable-select";
import IconRenderer from "@/components/partials/IconRenderer";
import PageHeroRenderer from "@/components/renderers/PageHeroRenderer";

const pageTypes = [
  {
    label: "Default",
    value: "default",
    icon: "LayoutTemplate",
  },
  {
    label: "Custom",
    value: "custom",
    icon: "Link2",
  },
  // {
  //   label: "Link",
  //   value: "link",
  //   icon: "FilePenLine",
  // },
  {
    label: "Custom Page",
    value: "custom_page",
    icon: "FilePenLine",
  },
];

const defaultPages = [
  {
    name: "About Us",
    slug: "about-us",
    url: "/about-us",
    icon: FileText,
  },
  {
    name: "Organizations",
    slug: "organizations",
    url: "/organizations",
    icon: Newspaper,
  },
  {
    name: "Photo Gallery",
    slug: "photo-gallery",
    url: "/photo-gallery",
    icon: Image,
  },
  {
    name: "Video Gallery",
    slug: "video-gallery",
    url: "/video-gallery",
    icon: Video,
  },
  {
    name: "All staff",
    slug: "all-staffs",
    url: "/all-staff",
    icon: Video,
  },
  {
    name: "Contact Us",
    slug: "contact-us",
    url: "/contact-us",
    icon: Phone,
  },
];
const defaultPageHeaders = [
  {
    name: "Gradient",
    icon: "Palette",
    template: "gradient",
  },
  {
    name: "Editorial",
    icon: "Newspaper",
    template: "editorial",
  },
  {
    name: "Wave",
    icon: "Waves",
    template: "wave",
  },
  {
    name: "Minimal",
    icon: "Minus",
    template: "minimal",
  },
  {
    name: "Split",
    icon: "Columns2",
    template: "split",
  },
  {
    name: "Aurora",
    icon: "SquareDashed",
    template: "aurora",
  },
];
const languageOptions = [
  {
    label: "Bangladesh",
    value: "bn",
  },
  {
    label: "Austrility",
    value: "au",
  },
];

const statusOptions = Object.values(STATUS).map((s) => {
  return {
    label: s,
    value: s,
  };
});

const SavePage = () => {
  const { setting } = useSelector((state) => state);
  const [selectedPage, setSelectedPage] = useState("");
  const [headerTemplate, setHeaderTemplate] = useState("aurora")

  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [parentPageOpen, setParentPageOpen] = useState(false);
  const [pageType, setPageType] = useState(pageTypes[0].value);

  const [formData, setFormData] = useState({
    page_title: "",
    page_slug: "",
    page_type: "",
    lang_slug: "en",
    parent_id: null,
    sort_order: 0,
    status: STATUS.ACTIVE,
    custom_link: "",
    file_name: "",
  });

  const [pageContent, setPageContent] = useState({
    page_content: "",
  });

  const [seoData, setSeoData] = useState({
    seo_title: "",
    seo_keywords: "",
    seo_content: "",
  });

  const [heroContent, setHeroContent] = useState({
    badge: "",
    title: "",
    heightlight: "",
    description: ""
  })

  const [selectedParent, setSelectedParent] = useState(null);

  // Fetch page data for edit
  const {
    data: pageGetQuery,
    isLoading: pageGetLoading,
    refetch: pageFetchQuery,
  } = useApiQuery({
    url: `/admin/pages/${id}`,
    enabled: !!id,
  });

  // Fetch parent pages for dropdown
  const { data: parentPagesQuery, isLoading: parentPagesLoading } = useApiQuery(
    {
      url: `/admin/parent-pages`,
      params: {
        parent_id: null,
        status: STATUS.ACTIVE,
        limit: 100,
      },
      enabled: true,
    },
  );

  const parentPages =
    parentPagesQuery?.data?.map((p) => {
      return {
        label: p.page_title,
        value: p.id,
      };
    }) || [];

  // Set form data when editing
  useEffect(() => {
    if (!pageGetQuery?.success) return;
    const item = pageGetQuery.data;
    console.log("item", item);
    setFormData({
      page_title: item.page_title || "",
      page_slug: selectedPage || null,
      page_type: item.page_type || "standard",
      lang_slug: item.lang_slug || "en",
      parent_id: item.parent_id || null,
      sort_order: item.sort_order || 0,
      status: item.status || STATUS.ACTIVE,
      custom_link: item.custom_link || "",
      file_name: item.file_name || "",
    });

    setPageContent({
      page_content: item.page_content || "",
    });

    setSeoData({
      seo_title: item.seo_title || "",
      seo_keywords: item.seo_keywords || "",
      seo_content: item.seo_content || "",
    });

    if (item.parent_id) {
      setSelectedParent(item.parent_id);
    }

    if (item.page_type) {
      setPageType(item.page_type);
    }
    setSelectedPage(item?.page_slug || null)

    const meta = JSON.parse(item?.meta);
    if (meta?.heroContent) {
      setHeroContent(meta.heroContent)
    }

    if (meta?.headerTemplate) {
      setHeaderTemplate(meta?.headerTemplate)
    }
  }, [pageGetQuery]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      page_type: pageType,
    }));
  }, [pageType, setPageType]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle content changes
  const handleContentChange = (e) => {
    const { name, value } = e.target;
    setPageContent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle SEO changes
  const handleSeoChange = (e) => {
    const { name, value } = e.target;
    setSeoData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handelChangeHeroContent = (e) => {
    const { name, value } = e.target;
    setHeroContent((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // Handle switch changes
  const handleSwitchChange = (checked) => {
    // Add any switch fields if needed
  };

  // Handle status change
  const handleStatusChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      status: value,
    }));
  };

  // Handle parent page selection
  const handleParentSelect = (parentId) => {
    setFormData((prev) => ({
      ...prev,
      parent_id: parentId === "null" ? null : parseInt(parentId),
    }));
    setSelectedParent(parentId);
    setParentPageOpen(false);
  };


  const {
    mutate: pagePostMutation,
    isLoading: pagePostLoading,
    errors: pagePostErrors,
  } = useApiMutation({
    url: "/admin/pages",
    method: "POST",
  });

  const handelPageCustomize = () => {
    navigate(`/admin/navigations/custom-page/${pageGetQuery.data.id}`)
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      id: id || null,
      page_title: formData.page_title,
      page_type: formData.page_type || "",
      page_slug: selectedPage || null,
      lang_slug: formData.lang_slug,
      parent_id: formData.parent_id || null,
      sort_order: parseInt(formData.sort_order) || 0,
      status: formData.status,
      custom_link: formData.custom_link || "",
      file_name: formData.file_name || "",
      page_content: pageContent.page_content,
      seo_title: seoData.seo_title || "",
      seo_keywords: seoData.seo_keywords || "",
      seo_content: seoData.seo_content || "",
      meta: JSON.stringify({
        heroContent: heroContent,
        headerTemplate: headerTemplate,
      })
    };



    try {
      const response = await pagePostMutation(payload);
      console.log("What is the response - ", response);
      if (response?.success) {
        if (response.data.page_type === "custom_page") {
          navigate("/admin/navigations/custom-page");
        }
        toast.success(response?.message || "Page saved successfully!");
        navigate("/admin/navigations");
      } else {
        toast.error(response?.message || "Failed to save page");
      }
    } catch (error) {
      console.error("Error saving page:", error);
      toast.error(error?.message || "Error saving page");
    } finally {
      setSaving(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      page_title: "",
      page_slug: "",
      page_type: "standard",
      lang_slug: "en",
      parent_id: null,
      sort_order: 0,
      status: STATUS.ACTIVE,
      custom_link: "",
      file_name: "",
    });

    setPageContent({
      page_content: "",
    });

    setSeoData({
      seo_title: "",
      seo_keywords: "",
      seo_content: "",
    });

    setSelectedParent(null);
    setSelectedPage(null);
  };

  // Loading skeleton
  if (id && pageGetLoading) {
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
    <div className="w-full min-h-screen bg-gray-50/50">
      <div className="mx-auto space-y-6">
        {/* Header */}
        <PageHeader
          title={id ? "Edit Page" : "Create New Page"}
          subtitle={
            id
              ? "Update page details and content"
              : "Add a new page to your website"
          }
          showBackButton={true}
          onBackClick={() => navigate("/admin/navigations")}
          secondaryAction={
            pageGetQuery?.data?.page_type === "custom_page" && {
              onClick: handelPageCustomize,
              disabled: pagePostLoading,
              icon: "save",
              title: "Customize Page",
              variant: "default",
            }
          }
          primaryAction={{
            onClick: handleSubmit,
            disabled: pagePostLoading,
            icon: "save",
            title: id && id !== "new" ? "Update Page" : "Create Page",
          }}

        />

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content - Left Side */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    {/* Left */}
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Basic Information
                      </CardTitle>
                      <CardDescription>
                        Enter the main details for this page.
                      </CardDescription>
                    </div>

                    {/* Right */}
                    <div className="flex flex-col items-start gap-2 lg:items-end">
                      <span className="text-sm font-medium">
                        Select Page Type
                      </span>

                      <ButtonGroup className={"rounded-[5px]"}>
                        {pageTypes?.map((p) => {
                          const Icon = LucideIcons[p.icon];
                          return (
                            <Button
                              className={"rounded-[5px]"}
                              type="button"
                              variant={
                                pageType === p.value ? "default" : "outline"
                              }
                              size="lg"
                              onClick={() => setPageType(p.value)}
                            >
                              <Icon className="h-4 w-4" />
                              {p.label}
                            </Button>
                          );
                        })}
                      </ButtonGroup>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="page_title">Page Title *</Label>
                    <Input
                      id="page_title"
                      name="page_title"
                      value={formData.page_title}
                      onChange={handleInputChange}
                      placeholder="Enter page title"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                    {/* Parent Page */}
                    <div className="space-y-2">
                      <Label>Parent Page</Label>

                      <SearchableSelect
                        value={formData.parent_id}
                        options={parentPages}
                        placeholder="Select Parent Page"
                        searchPlaceholder="Search parent page..."
                        onChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            parent_id: value,
                          }))
                        }
                      />
                    </div>

                    {/* Language */}
                    <div className="space-y-2">
                      <Label>Language</Label>

                      <SearchableSelect
                        value={formData.lang_slug}
                        options={languageOptions}
                        placeholder="Select Language"
                        searchPlaceholder="Search language..."
                        onChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            lang_slug: value,
                          }))
                        }
                      />
                    </div>

                    {/* Sort Order */}
                    <div className="space-y-2">
                      <Label>Sort Order</Label>

                      <Input
                        id="sort_order"
                        name="sort_order"
                        type="number"
                        value={formData.sort_order}
                        onChange={handleInputChange}
                        placeholder="0"
                      />
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                      <Label>Status</Label>

                      <SearchableSelect
                        value={formData.status}
                        options={statusOptions}
                        placeholder="Select Status"
                        searchPlaceholder="Search status..."
                        onChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            status: value,
                          }))
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {pageType === "default" && (
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Link2 className="h-5 w-5" />
                        Default Pages
                      </CardTitle>
                      <CardDescription>Select default page</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                        {defaultPages.map((page) => {
                          const Icon = page.icon;
                          const selected = selectedPage === page.slug;

                          return (
                            <button
                              key={page.slug}
                              type="button"
                              onClick={() => setSelectedPage(page.slug)}
                              className={`relative flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-left transition-all duration-200 ${selected
                                ? "border-primary bg-primary/10 ring-2 ring-primary/20 shadow-sm"
                                : "border-border bg-background hover:border-primary/40 hover:bg-muted/50"
                                }`}
                            >
                              {/* Selected Badge */}
                              {selected && (
                                <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                  ✓
                                </div>
                              )}

                              {/* Icon */}
                              <div
                                className={`flex h-9 w-9 items-center justify-center rounded-md transition-colors ${selected
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-primary/10 text-primary"
                                  }`}
                              >
                                <Icon className="h-4 w-4" />
                              </div>

                              {/* Content */}
                              <div className="min-w-0">
                                <h3 className="truncate text-sm font-semibold">
                                  {page.name}
                                </h3>
                                <p className="truncate text-xs text-muted-foreground">
                                  {page.url}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className={'mt-6'}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Link2 className="h-5 w-5" />
                        Page Header Hero
                      </CardTitle>
                      <CardDescription>Select default page</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-6 gap-3">
                        {
                          defaultPageHeaders?.map((item) => {
                            const selected = headerTemplate === item.template
                            return (
                              <button
                                key={item.template}
                                type="button"
                                onClick={() => setHeaderTemplate(item.template)}
                                className={`relative flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-left transition-all duration-200 ${selected
                                  ? "border-primary bg-primary/10 ring-2 ring-primary/20 shadow-sm"
                                  : "border-border bg-background hover:border-primary/40 hover:bg-muted/50"
                                  }`}
                              >
                                {selected && (
                                  <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                    ✓
                                  </div>
                                )}

                                {/* Icon */}
                                <div
                                  className={`flex h-9 w-9 items-center justify-center rounded-md transition-colors ${selected
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-primary/10 text-primary"
                                    }`}
                                >
                                  <IconRenderer icon={item?.icon} className={`h-4 w-4`} color={selected ? 'white' : 'black'} />
                                </div>

                                {/* Content */}
                                <div className="min-w-0">
                                  <h3 className="truncate text-sm font-semibold">
                                    {item?.name}
                                  </h3>
                                  <p className="truncate text-xs text-muted-foreground">
                                    {item?.template}
                                  </p>
                                </div>
                              </button>
                            )
                          })
                        }
                      </div>
                    </CardContent>
                  </Card>
                 <div className="mt-6">
                    <PageHeroRenderer
                      variant={headerTemplate}
                      eyebrow={heroContent?.badge}
                      title={heroContent?.title}
                      highlight={heroContent?.heightlight}
                      description={heroContent?.description}
                      breadcrumbs={[{ label: "Home", href: "/" }, { label: headerTemplate }]}
                    />
                 </div>
                </div>
              )}

              {/* Page Content */}
              {pageType === "custom" && (
                <div>
                  <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Page Content
                    </CardTitle>
                    <CardDescription>
                      Write the main content of your page
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label htmlFor="page_content">Content</Label>
                      <Textarea
                        id="page_content"
                        name="page_content"
                        value={pageContent.page_content}
                        onChange={handleContentChange}
                        placeholder="Enter page content here..."
                        className="min-h-75"
                      />
                    </div>
                  </CardContent>
                </Card>
                <Card className={'mt-6'}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Link2 className="h-5 w-5" />
                        Page Header Hero
                      </CardTitle>
                      <CardDescription>Select default page</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-6 gap-3">
                        {
                          defaultPageHeaders?.map((item) => {
                            const selected = headerTemplate === item.template
                            return (
                              <button
                                key={item.template}
                                type="button"
                                onClick={() => setHeaderTemplate(item.template)}
                                className={`relative flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-left transition-all duration-200 ${selected
                                  ? "border-primary bg-primary/10 ring-2 ring-primary/20 shadow-sm"
                                  : "border-border bg-background hover:border-primary/40 hover:bg-muted/50"
                                  }`}
                              >
                                {selected && (
                                  <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                    ✓
                                  </div>
                                )}

                                {/* Icon */}
                                <div
                                  className={`flex h-9 w-9 items-center justify-center rounded-md transition-colors ${selected
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-primary/10 text-primary"
                                    }`}
                                >
                                  <IconRenderer icon={item?.icon} className={`h-4 w-4`} color={selected ? 'white' : 'black'} />
                                </div>

                                {/* Content */}
                                <div className="min-w-0">
                                  <h3 className="truncate text-sm font-semibold">
                                    {item?.name}
                                  </h3>
                                  <p className="truncate text-xs text-muted-foreground">
                                    {item?.template}
                                  </p>
                                </div>
                              </button>
                            )
                          })
                        }
                      </div>
                    </CardContent>
                  </Card>
                   <PageHeroRenderer
                      variant={headerTemplate}
                      eyebrow={heroContent?.badge}
                      title={heroContent?.title}
                      highlight={heroContent?.heightlight}
                      description={heroContent?.description}
                      breadcrumbs={[{ label: "Home", href: "/" }, { label: headerTemplate }]}
                    />
                </div>
              )}

              {/* Additional Fields */}
              {pageType === "link" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Link2 className="h-5 w-5" />
                      Additional Settings
                    </CardTitle>
                    <CardDescription>
                      Custom link and file settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="custom_link">Custom Link</Label>
                      <Input
                        id="custom_link"
                        name="custom_link"
                        value={formData.custom_link}
                        onChange={handleInputChange}
                        placeholder="https://example.com/custom-link"
                      />
                      <p className="text-xs text-muted-foreground">
                        Optional: Override the default page URL
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Status & Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Page Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Status</span>
                    <StatusBadge status={formData.status} />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Page Type</span>
                    <span className="text-sm capitalize">
                      {formData.page_type}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Language</span>
                    <span className="text-sm uppercase">
                      {formData.lang_slug}
                    </span>
                  </div>
                  {formData.parent_id && (
                    <>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Parent</span>
                        <span className="text-sm">
                          {parentPages.find(
                            (p) => p.id === parseInt(formData.parent_id),
                          )?.page_title || "N/A"}
                        </span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* SEO Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    SEO Settings
                  </CardTitle>
                  <CardDescription>
                    Optimize your page for search engines
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="seo_title">SEO Title</Label>
                    <Input
                      id="seo_title"
                      name="seo_title"
                      value={seoData.seo_title}
                      onChange={handleSeoChange}
                      placeholder="SEO title"
                    />
                    <p className="text-xs text-muted-foreground">
                      {seoData.seo_title?.length || 0}/60 characters
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="seo_keywords">SEO Keywords</Label>
                    <Input
                      id="seo_keywords"
                      name="seo_keywords"
                      value={seoData.seo_keywords}
                      onChange={handleSeoChange}
                      placeholder="keyword1, keyword2, keyword3"
                    />
                    <p className="text-xs text-muted-foreground">
                      Comma-separated keywords
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="seo_content">SEO Description</Label>
                    <Textarea
                      id="seo_content"
                      name="seo_content"
                      value={seoData.seo_content}
                      onChange={handleSeoChange}
                      placeholder="Brief description for search engines"
                      className="min-h-25"
                    />
                    <p className="text-xs text-muted-foreground">
                      {seoData.seo_content?.length || 0}/160 characters
                    </p>
                  </div>
                </CardContent>
              </Card>

              {(pageType === "default" || pageType === 'custom') && (
                  <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Hero Section Content
                  </CardTitle>
                  <CardDescription>
                    Given page hero section content
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="badge">Badge</Label>
                    <Input
                      id="badge"
                      name="badge"
                      value={heroContent.badge}
                      onChange={handelChangeHeroContent}
                      placeholder="Hero section badge"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={heroContent.title}
                      onChange={handelChangeHeroContent}
                      placeholder="Hero section title"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="heightlight">Heightlight title</Label>
                    <Input
                      id="heightlight"
                      name="heightlight"
                      value={heroContent.heightlight}
                      onChange={handelChangeHeroContent}
                      placeholder="Hero section heightlight"
                    />
                  </div>
                  

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description"
                      name="description"
                      value={heroContent.description}
                      onChange={handelChangeHeroContent}
                      placeholder="Hero section description"
                      rows="3"
                    />
                  </div>
                </CardContent>
              </Card>
                )
              }
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SavePage;
