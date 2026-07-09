// src/pages/Categories/List.jsx
import React, { useState } from 'react';
import { toast } from "sonner";
import { useNavigate } from 'react-router';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  Eye,
  Pencil,
  Trash2,
  Filter,
  Search,
  Grid3x3,
  List,
  FolderOpen,
  Tag,
  Layers,
} from 'lucide-react';
import { useApiQuery } from '@/hooks/useAppQuery';
import { useApiMutation } from '@/hooks/useAppMutation';
import PageHeader from '@/components/shear/PageHeader';
import DeleteConfirmation from '@/components/shear/DeleteConfirmation';
import StatusBadge from '@/components/shear/StatusBadge';

const CategoriesListing = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [viewMode, setViewMode] = useState('table');
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [viewingItem, setViewingItem] = useState(null);

  // Fetch categories
  const {
    data: response,
    loading: itemsLoading,
    refetch: refetchItems
  } = useApiQuery({
    url: "/admin/business-module-item-categories",
    params: {
      search: searchTerm || undefined,
      type: typeFilter !== 'all' ? typeFilter : undefined,
    }
  });

  const items = response?.data?.data || [];

  // Delete mutation
  const {
    mutate: categoryDeleteMutation,
    isLoading: categoryDeleteLoading
  } = useApiMutation({
    url: `/admin/categories/${selectedItem?.id}`,
    method: 'DELETE'
  });

  const handleDelete = async () => {
    try {
      const response = await categoryDeleteMutation();
      if (response?.success) {
        toast.success(response?.message || "Category deleted successfully");
        await refetchItems();
        setSelectedItem(null);
        setOpenDeleteModal(false);
      }
    } catch (e) {
      console.log("Delete error - ", e);
      toast.error("Failed to delete category");
    }
  };

  const handleViewItem = (item) => {
    setViewingItem(item);
    setOpenViewModal(true);
  };

  const handleEditItem = (item) => {
    navigate(`/admin/categories/save/${item?.id}`);
  };

  const handleDeleteItem = (item) => {
    setSelectedItem(item);
    setOpenDeleteModal(true);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getTypeBadgeColor = (type) => {
    const colors = {
      'product': 'bg-blue-100 text-blue-700 border-blue-300',
      'service': 'bg-green-100 text-green-700 border-green-300',
      'blog': 'bg-purple-100 text-purple-700 border-purple-300',
      'portfolio': 'bg-pink-100 text-pink-700 border-pink-300',
      'gallery': 'bg-orange-100 text-orange-700 border-orange-300',
    };
    return colors[type] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  // Grid View Card Component
  const CategoryGridCard = ({ item }) => {
    return (
      <Card className="group relative overflow-hidden cursor-pointer rounded-[5px] border-0 bg-white pt-0 shadow-sm transition-all duration-300 hover:shadow-md">
        <div className="relative overflow-hidden bg-linear-to-br from-gray-100 to-gray-200 p-8">
          {item.image ? (
            <img
              src={item.image_full_path || item.image}
              alt={item.name}
              className="h-40 w-full object-contain transition-all duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-40 items-center justify-center">
              <FolderOpen className="h-20 w-20 text-gray-400" />
            </div>
          )}
          
          <div className="absolute top-3 right-3 z-20 flex gap-2 opacity-0 transition-all duration-300 group-hover:opacity-100">
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 rounded-full bg-white/90 hover:bg-white"
              onClick={(e) => {
                e.stopPropagation();
                handleViewItem(item);
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 rounded-full bg-white/90 hover:bg-white"
              onClick={(e) => {
                e.stopPropagation();
                handleEditItem(item);
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              variant="destructive"
              className="h-8 w-8 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteItem(item);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="absolute top-3 left-3 z-20">
            <Badge className={getTypeBadgeColor(item.type)}>
              <Tag className="h-3 w-3 mr-1" />
              {item.type}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4">
          <div>
            <h3 className="line-clamp-1 text-lg font-bold">
              {item.name}
            </h3>
            {item.description && (
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {item.description}
              </p>
            )}
            <div className="mt-2 flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {item.slug}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Table View
  const TableView = () => (
    <div className="overflow-hidden rounded-[5px] border bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40">
            <TableHead className="w-12">#</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Business</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {items.map((item, index) => (
            <TableRow
              key={item.id}
              className="group transition-colors hover:bg-muted/30"
            >
              <TableCell className="font-medium">
                {index + 1}
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-3">
                  {item.image ? (
                    <img
                      src={item.image_full_path || item.image}
                      alt={item.name}
                      className="h-10 w-10 rounded-[5px] border object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-[5px] border bg-gray-100 flex items-center justify-center">
                      <FolderOpen className="h-5 w-5 text-gray-400" />
                    </div>
                  )}
                  <p className="font-medium line-clamp-1">{item.name}</p>
                </div>
              </TableCell>

              <TableCell>
                <Badge className={getTypeBadgeColor(item.type)}>
                  {item.type}
                </Badge>
              </TableCell>

              <TableCell>
                <Badge variant="outline" className="text-xs">
                  {item.slug}
                </Badge>
              </TableCell>

              <TableCell>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {item.description || '—'}
                </p>
              </TableCell>

              <TableCell>
                <span className="text-sm">
                  {item.business?.name || '—'}
                </span>
              </TableCell>

              <TableCell className="text-sm text-muted-foreground">
                {formatDate(item.created_at)}
              </TableCell>

              <TableCell>
                <div className="flex justify-end gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => handleViewItem(item)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => handleEditItem(item)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-red-500 hover:text-red-600"
                    onClick={() => handleDeleteItem(item)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  // View Modal
  const ViewModal = ({ item, open, onOpenChange }) => {
    if (!item) return null;

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Category Details</DialogTitle>
            <DialogDescription>
              View category information
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="relative overflow-hidden rounded-[5px] bg-gray-100 p-8">
              {item.image ? (
                <img
                  src={item.image_full_path || item.image}
                  alt={item.name}
                  className="w-full max-h-64 object-contain"
                />
              ) : (
                <div className="flex h-48 items-center justify-center">
                  <FolderOpen className="h-24 w-24 text-gray-400" />
                </div>
              )}
              <div className="absolute top-3 right-3">
                <Badge className={getTypeBadgeColor(item.type)}>
                  <Tag className="h-3 w-3 mr-1" />
                  {item.type}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold">{item.name}</h3>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{item.slug}</Badge>
                {item.business && (
                  <Badge variant="secondary">{item.business.name}</Badge>
                )}
              </div>
              {item.description && (
                <p className="text-muted-foreground mt-2">{item.description}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="font-medium">{formatDate(item.created_at)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="font-medium">{formatDate(item.updated_at)}</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  onOpenChange(false);
                  handleEditItem(item);
                }}
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit Category
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Categories"
        subtitle={`Manage your categories (${items.length} total)`}
        primaryAction={{
          title: "Add Category",
          icon: "plus",
          onClick: () => navigate("/admin/categories/save")
        }}
        secondaryAction={{
          title: "Refresh",
          icon: "refresh",
          onClick: refetchItems
        }}
      />

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 md:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-37.5">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="product">Product</SelectItem>
              <SelectItem value="service">Service</SelectItem>
              <SelectItem value="blog">Blog</SelectItem>
              <SelectItem value="portfolio">Portfolio</SelectItem>
              <SelectItem value="gallery">Gallery</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground mr-2">
            {items.length} categor{items.length !== 1 ? 'ies' : 'y'}
          </div>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid3x3 className="h-4 w-4 mr-2" />
            Grid
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('table')}
          >
            <List className="h-4 w-4 mr-2" />
            Table
          </Button>
        </div>
      </div>

      {/* Content */}
      {itemsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-40 bg-gray-200 rounded-t-xl"></div>
              <CardContent className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : items.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Layers className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No categories found</p>
            <Button
              variant="link"
              onClick={() => navigate("/admin/categories/save")}
              className="mt-2"
            >
              Add your first category
            </Button>
          </CardContent>
        </Card>
      ) : (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <CategoryGridCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <TableView />
        )
      )}

      {/* View Modal */}
      <ViewModal
        item={viewingItem}
        open={openViewModal}
        onOpenChange={setOpenViewModal}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmation
        open={openDeleteModal}
        onOpenChange={setOpenDeleteModal}
        onConfirm={handleDelete}
        onCancel={() => {
          setOpenDeleteModal(false);
          setSelectedItem(null);
        }}
        loading={categoryDeleteLoading}
      />
    </div>
  );
};

export default CategoriesListing;