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
    Search,
    Star,
    Calendar,
    Activity,
} from 'lucide-react';
import { useApiQuery } from '@/hooks/useAppQuery';
import { useApiMutation } from '@/hooks/useAppMutation';
import PageHeader from '@/components/shear/PageHeader';
import DeleteConfirmation from '@/components/shear/DeleteConfirmation';
import StatusBadge from '@/components/shear/StatusBadge';
import FeaturedBadge from '@/components/shear/FeaturedBadge';
import { MODULES } from '@/store/default/modules';

const RegularActivitiesListing = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [featuredFilter, setFeaturedFilter] = useState('all');
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
            module_slug: MODULES?.REGULAR_ACTIVITIES || 'regular-activities',
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
        url: `/admin/module-items/${selectedItem?.id}`,
        method: 'DELETE'
    });

    const handleDelete = async () => {
        try {
            const response = await itemDeleteMutation();
            if (response?.success) {
                toast.success(response?.message || "Regular activity deleted successfully");
                await refetchItems();
                setSelectedItem(null);
                setOpenDeleteModal(false);
            }
        } catch (e) {
            console.log("Delete error - ", e);
            toast.error("Failed to delete regular activity");
        }
    };

    const handleViewItem = (item) => {
        setViewingItem(item);
        setOpenViewModal(true);
    };

    const handleEditItem = (item) => {
        navigate(`/admin/regular-activities/save/${item?.id}`);
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

    // Strip HTML tags for description preview
    const stripHtml = (html) => {
        if (!html) return '';
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    };

    // View Modal
    const ViewModal = ({ item, open, onOpenChange }) => {
        if (!item) return null;

        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl flex items-center gap-2">
                            <Activity className="h-6 w-6 text-green-600" />
                            Regular Activity Details
                        </DialogTitle>
                        <DialogDescription>
                            Complete information about the regular activity
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
                        {/* Image */}
                        {(item.image_full_path || item.image) && (
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
                        )}

                        {/* Info */}
                        <div className="space-y-3">
                            <h3 className="text-2xl font-bold">{item.title}</h3>
                            {item.sub_title && (
                                <p className="text-lg text-muted-foreground">{item.sub_title}</p>
                            )}
                            {item.sub_description && (
                                <p className="text-muted-foreground">{item.sub_description}</p>
                            )}
                            {item.description && (
                                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm whitespace-pre-wrap">{item.description}</p>
                                </div>
                            )}
                        </div>

                        {/* Meta Info */}
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                            <div>
                                <p className="text-sm text-muted-foreground">Status</p>
                                <StatusBadge status={item.status} />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Featured</p>
                                {item.is_featured ? (
                                    <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">
                                        ⭐ Featured
                                    </Badge>
                                ) : (
                                    <span className="text-muted-foreground text-sm">No</span>
                                )}
                            </div>
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
                                Edit Activity
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
                title="Regular Activities"
                subtitle={`Manage your regular activities (${items.length} total)`}
                primaryAction={{
                    title: "Add Activity",
                    icon: "plus",
                    onClick: () => navigate("/admin/regular-activities/save")
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
                            placeholder="Search by title or description..."
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

                <div className="text-sm text-muted-foreground">
                    {items.length} activit{items.length !== 1 ? 'ies' : 'y'} found
                </div>
            </div>

            {/* Table View */}
            {itemsLoading ? (
                <Card>
                    <CardContent className="py-8">
                        <div className="space-y-3">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="h-16 bg-gray-100 rounded animate-pulse"></div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            ) : items.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Activity className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No regular activities found</p>
                        <Button
                            variant="link"
                            onClick={() => navigate("/admin/regular-activities/save")}
                            className="mt-2"
                        >
                            Create your first regular activity
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/40">
                                <TableHead className="w-12">#</TableHead>
                                <TableHead>Image</TableHead>
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
                                        {(item.image_full_path || item.image) ? (
                                            <img
                                                src={item.image_full_path || item.image}
                                                alt={item.title}
                                                className="h-16 w-24 rounded-lg border object-cover"
                                            />
                                        ) : (
                                            <div className="h-16 w-24 rounded-lg border bg-gray-100 flex items-center justify-center">
                                                <Activity className="h-8 w-8 text-gray-400" />
                                            </div>
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        <div className="space-y-1">
                                            <p className="font-medium line-clamp-1">{item.title}</p>
                                            {item.sub_description && (
                                                <p className="text-xs text-muted-foreground line-clamp-1">
                                                    {item.sub_description}
                                                </p>
                                            )}
                                            {item.description && (
                                                <p className="text-xs text-muted-foreground line-clamp-1">
                                                    {stripHtml(item.description).substring(0, 60)}
                                                    {stripHtml(item.description).length > 60 ? '...' : ''}
                                                </p>
                                            )}
                                        </div>
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

export default RegularActivitiesListing;