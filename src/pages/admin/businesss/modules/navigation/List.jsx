import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useApiQuery } from "@/hooks/useAppQuery";
import { useApiMutation } from "@/hooks/useAppMutation";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Grid3x3,
  List,
  Filter,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";

// shadcn/ui imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PageListing = () => {
  const navigate = useNavigate();

  // Filter states
  const [filters, setFilters] = useState({
    search: "",
    parent_id: "all",
    lang_slug: "all",
    page_type: "all",
    status: "all",
    has_children: "all",
    order_by: "sort_order",
    order_direction: "asc",
    limit: 15,
    page: 1,
  });

  const [viewMode, setViewMode] = useState("table");
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedPage, setSelectedPage] = useState(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [expandedPages, setExpandedPages] = useState([]);

  // Fetch pages
  const {
    data: response,
    loading: pageGetLoading,
    refetch: refetchPages,
  } = useApiQuery({
    url: "/admin/pages",
    params: {
      ...filters,
      parent_id: filters.parent_id === "all" ? null : filters.parent_id,
      lang_slug: filters.lang_slug === "all" ? null : filters.lang_slug,
      page_type: filters.page_type === "all" ? null : filters.page_type,
      status: filters.status === "all" ? null : filters.status,
      has_children:
        filters.has_children === "all" ? null : filters.has_children,
    },
  });

  const pages = response?.data?.data || [];
  const meta = response?.data || {};

  // Extract unique filter options
  const languages = [
    "all",
    ...new Set(pages.map((p) => p.lang_slug).filter(Boolean)),
  ];
  const pageTypes = [
    "all",
    ...new Set(pages.map((p) => p.page_type).filter(Boolean)),
  ];
  const statuses = [
    "all",
    ...new Set(pages.map((p) => p.status).filter(Boolean)),
  ];

  // Toggle expanded page
  const toggleExpand = (pageId) => {
    setExpandedPages((prev) =>
      prev.includes(pageId)
        ? prev.filter((id) => id !== pageId)
        : [...prev, pageId],
    );
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    refetchPages();
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      search: "",
      parent_id: "all",
      lang_slug: "all",
      page_type: "all",
      status: "all",
      has_children: "all",
      order_by: "sort_order",
      order_direction: "asc",
      limit: 15,
      page: 1,
    });
    setShowAdvancedFilters(false); 
  };

  // Navigation
  const onEdit = (page) => {
    if(page?.page_type === 'custom_page'){
      navigate(`/admin/navigations/custom-page/${page?.id}`);
    }
    navigate(`/admin/navigations/save/${page?.id}`);
  };

  const onView = (page) => {
    return;
    navigate(`/admin/navigations/view/${page?.id}`);
  };

  const onCreate = () => {
    navigate("/admin/navigations/save");
  };

  const { mutate: pageDeleteMutation, isLoading: pageDeleteLoading } =
    useApiMutation({
      url: `/admin/pages/${selectedPage?.id}`,
      method: "DELETE",
    });

  const handleDelete = async () => {
    try {
      const response = await pageDeleteMutation();
      if (response?.success) {
        await refetchPages();
        setSelectedPage(null);
        setOpenDeleteModal(false);
        toast.success(response?.message || "Page deleted successfully");
      }
    } catch (e) {
      console.log("Page delete error - ", e);
      toast.error(e?.message || "Failed to delete page");
    }
  };

  // Status Badge
  const StatusBadge = ({ status }) => {
    const variants = {
      active: "default",
      inactive: "secondary",
      draft: "outline",
      archived: "destructive",
    };

    const colors = {
      active: "bg-green-100 text-green-800 border-green-200",
      inactive: "bg-gray-100 text-gray-800 border-gray-200",
      draft: "bg-yellow-100 text-yellow-800 border-yellow-200",
      archived: "bg-red-100 text-red-800 border-red-200",
    };

    return (
      <Badge variant="outline" className={colors[status] || colors.inactive}>
        {status || "Inactive"}
      </Badge>
    );
  };

  // Grid View
  const GridView = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {pages.map((page) => (
        <Card key={page.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg line-clamp-2">
                {page.page_title}
              </CardTitle>
              <StatusBadge status={page.status} />
            </div>
            <CardDescription className="text-xs">
              /{page.page_slug}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type:</span>
                <span>{page.page_type || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Language:</span>
                <span>{page.lang_slug || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Children:</span>
                <span>{page.children?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order:</span>
                <span>{page.sort_order || 0}</span>
              </div>
            </div>

            {page.children?.length > 0 && (
              <Collapsible
                className="mt-3"
                open={expandedPages.includes(page.id)}
                onOpenChange={() => toggleExpand(page.id)}
              >
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-0 h-auto">
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        expandedPages.includes(page.id) ? "rotate-180" : ""
                      }`}
                    />
                    <span className="ml-1 text-xs">
                      {page.children.length} children
                    </span>
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2 space-y-1">
                  {page.children.map((child) => (
                    <div
                      key={child.id}
                      className="text-xs bg-muted p-2 rounded-[5px]"
                    >
                      <div className="font-medium">{child.page_title}</div>
                      <div className="text-muted-foreground">
                        /{child.page_slug}
                      </div>
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            )}
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onView(page)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>View</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(page)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Edit</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedPage(page);
                      setOpenDeleteModal(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  // Table View
  const TableView = () => (
    <div className="rounded-[5px] border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Language</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Order</TableHead>
            <TableHead>Children</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pages.map((page) => (
            <React.Fragment key={page.id}>
              <TableRow>
                <TableCell>
                  <div className="flex items-center gap-2 cursor-pointer" onClick={() => onEdit(page)}>
                    {page.children?.length > 0 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => toggleExpand(page.id)}
                      >
                        {expandedPages.includes(page.id) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                    <div>
                       <div className="font-medium">ID: {page.id}</div>
                      <div className="font-medium">{page.page_title}</div>
                      <div className="text-sm text-muted-foreground">
                        /page/{page.page_slug}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{page.page_type || "-"}</TableCell>
                <TableCell>{page.lang_slug || "-"}</TableCell>
                <TableCell>
                  <StatusBadge status={page.status} />
                </TableCell>
                <TableCell>{page.sort_order || 0}</TableCell>
                <TableCell>{page.children?.length || 0}</TableCell>
                <TableCell>
                  {format(new Date(page.created_at), "MMM d, yyyy")}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onView(page)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(page)}>
                        <Edit2 className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      {page?.is_deletable && (
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => {
                            setSelectedPage(page);
                            setOpenDeleteModal(true);
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
              {expandedPages.includes(page.id) && page.children?.length > 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="bg-muted/50">
                    <div className="ml-8 space-y-2">
                      <div className="text-sm font-medium">Child Pages:</div>
                      {page.children.map((child) => (
                        <div
                          key={child.id}
                          className="flex items-center gap-4 text-sm"
                        >
                          <span>{child.page_title}</span>
                          <span className="text-muted-foreground">
                            /page/{child.page_slug}
                          </span>
                          <StatusBadge status={child.status} />
                        </div>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  // Loading Skeleton
  const LoadingSkeleton = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[...Array(8)].map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <div className="flex justify-between">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-16" />
            </div>
            <Skeleton className="h-4 w-24 mt-2" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Pages</h1>
          <p className="text-muted-foreground">
            Manage your website pages and their hierarchy
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => navigate("/admin/settings/themes")}>
            Theme builder
          </Button>

          <Button onClick={() => navigate("/admin/navigations/builder")}>
            Nav and footer builder
          </Button>
          <Button onClick={onCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Create Page
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSearch}>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search pages..."
                    value={filters.search}
                    onChange={(e) =>
                      handleFilterChange("search", e.target.value)
                    }
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                  <ChevronDown
                    className={`ml-2 h-4 w-4 transition-transform ${
                      showAdvancedFilters ? "rotate-180" : ""
                    }`}
                  />
                </Button>

                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3x3 className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant={viewMode === "table" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setViewMode("table")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>

                <Button type="submit">Search</Button>
              </div>
            </div>

            {/* Advanced Filters */}
            {showAdvancedFilters && (
              <div className="mt-4 pt-4 border-t">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <div>
                    <Label>Parent Page</Label>
                    <Select
                      value={filters.parent_id}
                      onValueChange={(value) =>
                        handleFilterChange("parent_id", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select parent" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Pages</SelectItem>
                        <SelectItem value="null">Root Pages</SelectItem>
                        {pages
                          .filter((p) => p.parent_id)
                          .map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.page_title}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Language</Label>
                    <Select
                      value={filters.lang_slug}
                      onValueChange={(value) =>
                        handleFilterChange("lang_slug", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang} value={lang}>
                            {lang === "all" ? "All Languages" : lang}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Page Type</Label>
                    <Select
                      value={filters.page_type}
                      onValueChange={(value) =>
                        handleFilterChange("page_type", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {pageTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type === "all" ? "All Types" : type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Status</Label>
                    <Select
                      value={filters.status}
                      onValueChange={(value) =>
                        handleFilterChange("status", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status === "all"
                              ? "All Status"
                              : status.charAt(0).toUpperCase() +
                                status.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Has Children</Label>
                    <Select
                      value={filters.has_children}
                      onValueChange={(value) =>
                        handleFilterChange("has_children", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="true">Has Children</SelectItem>
                        <SelectItem value="false">No Children</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Sort By</Label>
                    <Select
                      value={filters.order_by}
                      onValueChange={(value) =>
                        handleFilterChange("order_by", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sort_order">Sort Order</SelectItem>
                        <SelectItem value="page_title">Title</SelectItem>
                        <SelectItem value="page_slug">Slug</SelectItem>
                        <SelectItem value="page_type">Type</SelectItem>
                        <SelectItem value="lang_slug">Language</SelectItem>
                        <SelectItem value="status">Status</SelectItem>
                        <SelectItem value="created_at">Created Date</SelectItem>
                        <SelectItem value="updated_at">Updated Date</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Direction</Label>
                    <Select
                      value={filters.order_direction}
                      onValueChange={(value) =>
                        handleFilterChange("order_direction", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Direction" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asc">Ascending</SelectItem>
                        <SelectItem value="desc">Descending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Per Page</Label>
                    <Select
                      value={filters.limit.toString()}
                      onValueChange={(value) =>
                        handleFilterChange("limit", parseInt(value))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Items per page" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15</SelectItem>
                        <SelectItem value="30">30</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetFilters}
                      className="w-full"
                    >
                      Reset Filters
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      {pageGetLoading ? (
        <LoadingSkeleton />
      ) : (
        <>
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{pages.length}</span>{" "}
              {pages.length === 1 ? "page" : "pages"}
            </div>
          </div>

          {pages.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground">No pages found</p>
                <Button variant="link" onClick={onCreate} className="mt-2">
                  Create your first page
                </Button>
              </CardContent>
            </Card>
          ) : viewMode === "grid" ? (
            <GridView />
          ) : (
            <TableView />
          )}

          {/* Pagination */}
          {meta?.last_page > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
              <div className="text-sm text-muted-foreground">
                Page {meta?.current_page || 1} of {meta?.last_page || 1}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleFilterChange(
                      "page",
                      Math.max(1, (meta?.current_page || 1) - 1),
                    )
                  }
                  disabled={meta?.current_page <= 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleFilterChange(
                      "page",
                      Math.min(
                        meta?.last_page || 1,
                        (meta?.current_page || 1) + 1,
                      ),
                    )
                  }
                  disabled={meta?.current_page >= meta?.last_page}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteModal} onOpenChange={setOpenDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the page "
              {selectedPage?.page_title}"?
              {selectedPage?.children?.length > 0 && (
                <span className="text-destructive block mt-2">
                  Warning: This page has {selectedPage.children.length} child
                  page(s) that will also be deleted.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDeleteModal(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={pageDeleteLoading}
            >
              {pageDeleteLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PageListing;
