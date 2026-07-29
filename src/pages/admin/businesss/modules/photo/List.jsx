// List.jsx
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
  Image,
  Search,
  Grid3x3,
  List,
  Star,
  Images,
} from 'lucide-react';
import { useApiQuery } from '@/hooks/useAppQuery';
import { useApiMutation } from '@/hooks/useAppMutation';
import PageHeader from '@/components/shear/PageHeader';
import DeleteConfirmation from '@/components/shear/DeleteConfirmation';
import StatusBadge from '@/components/shear/StatusBadge';
import FeaturedBadge from '@/components/shear/FeaturedBadge';
import { MODULES } from '@/store/default/modules';

const PhotosListing = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [featuredFilter, setFeaturedFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [viewingItem, setViewingItem] = useState(null);

  // Fetch module items
  const {
    data: response,
    loading: itemsLoading,
    refetch: refetchItems
  } = useApiQuery({
    url: "/admin/business-module-items",
    params: {
      module_slug: MODULES?.PHOTOS || 'photos',
      search: searchTerm || undefined,
      status: statusFilter !== 'all' ? statusFilter : undefined,
      is_featured: featuredFilter !== 'all' ? featuredFilter : undefined,
    }
  });

  const items = response?.data?.data || [];

  // Delete mutation
  const {
    mutate: itemDeleteMutation,
    isLoading: itemDeleteLoading
  } = useApiMutation({
    url: `/admin/business-module-items/${selectedItem?.id}`,
    method: 'DELETE'
  });

  const handleDelete = async () => {
    try {
      const response = await itemDeleteMutation();
      if (response?.success) {
        toast.success(response?.message || "Photo deleted successfully");
        await refetchItems();
        setSelectedItem(null);
        setOpenDeleteModal(false);
      }
    } catch (e) {
      console.log("Delete error - ", e);
      toast.error("Failed to delete photo");
    }
  };

  const handleViewItem = (item) => {
    setViewingItem(item);
    setOpenViewModal(true);
  };

  const handleEditItem = (item) => {
    navigate(`/admin/photos/save/${item?.id}`);
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

  // Grid View Card Component
  const PhotoGridCard = ({ item }) => {
    return (
      <Card className="group relative overflow-hidden cursor-pointer rounded-xl border-0 bg-white pt-0 shadow-sm transition-all duration-300 hover:shadow-md">
        <div className="relative overflow-hidden">
          <img
            src={item.image_full_path || item.image}
            alt={item.title}
            className="h-56 w-full object-cover transition-all duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />

          {item.is_featured && (
            <div className="absolute top-3 left-3 z-20">
              <FeaturedBadge />
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

          <div className="absolute bottom-3 left-3 z-20">
            <StatusBadge status={item.status} />
          </div>
        </div>

        <CardContent className="p-4">
          <div>
            <h3 className="line-clamp-1 text-lg font-bold">
              {item.title}
            </h3>
            {item.sub_title && (
              <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                {item.sub_title}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  // Table View
  const TableView = () => (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40">
            <TableHead className="w-12">#</TableHead>
            <TableHead>Photo</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Sub Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Featured</TableHead>
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
                <img
                  src={item.image_full_path || item.image}
                  alt={item.title}
                  className="h-16 w-24 rounded-lg border object-cover"
                />
              </TableCell>

              <TableCell>
                <p className="font-medium line-clamp-1">{item.title}</p>
              </TableCell>

              <TableCell>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {item.sub_title || '—'}
                </p>
              </TableCell>

              <TableCell>
                <StatusBadge status={item.status} />
              </TableCell>

              <TableCell>
                {item.is_featured ? (
                  <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">
                    ⭐ Featured
                  </Badge>
                ) : (
                  <span className="text-muted-foreground text-sm">—</span>
                )}
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
            <DialogTitle className="text-2xl">Photo Details</DialogTitle>
            <DialogDescription>
              View photo and details
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={item.image_full_path || item.image}
                alt={item.title}
                className="w-full max-h-80 object-cover"
              />
              <div className="absolute top-3 right-3">
                <StatusBadge status={item.status} />
              </div>
              {item.is_featured && (
                <div className="absolute top-3 left-3">
                  <FeaturedBadge />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold">{item.title}</h3>
              {item.sub_title && (
                <p className="text-lg text-muted-foreground">{item.sub_title}</p>
              )}
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
                Edit Photo
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
        title="Photos"
        subtitle={`Manage your photos (${items.length} total)`}
        primaryAction={{
          title: "Add Photo",
          icon: "plus",
          onClick: () => navigate("/admin/photos/save")
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
              placeholder="Search by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Select value={featuredFilter} onValueChange={setFeaturedFilter}>
            <SelectTrigger className="w-[150px]">
              <Star className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Featured" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="true">Featured</SelectItem>
              <SelectItem value="false">Not Featured</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground mr-2">
            {items.length} photo{items.length !== 1 ? 's' : ''}
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
              <div className="h-56 bg-gray-200 rounded-t-xl"></div>
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
            <Images className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No photos found</p>
            <Button
              variant="link"
              onClick={() => navigate("/admin/photos/save")}
              className="mt-2"
            >
              Add your first photo
            </Button>
          </CardContent>
        </Card>
      ) : (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <PhotoGridCard key={item.id} item={item} />
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
        loading={itemDeleteLoading}
      />
    </div>
  );
};

export default PhotosListing;