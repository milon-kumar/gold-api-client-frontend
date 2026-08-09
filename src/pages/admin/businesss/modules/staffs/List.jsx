// List.jsx
import React, { useEffect, useState } from 'react';
import { toast } from "sonner";
import { useNavigate } from 'react-router';
import { DragDropProvider } from '@dnd-kit/react';
import { useSortable } from '@dnd-kit/react/sortable';
import { move } from '@dnd-kit/helpers';
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
    Eye,
    Pencil,
    Trash2,
    Filter,
    Users,
    Mail,
    Phone,
    Calendar,
    MoreVertical,
    Search,
    UserPlus,
    RefreshCw,
    GripVertical,
} from 'lucide-react';
import { useApiQuery } from '@/hooks/useAppQuery';
import { useApiMutation } from '@/hooks/useAppMutation';
import PageHeader from '@/components/shear/PageHeader';
import DeleteConfirmation from '@/components/shear/DeleteConfirmation';
import StatusBadge from '@/components/shear/StatusBadge';
import { cn } from '@/lib/utils';

/* ---------------------------------- */
/*  Sortable row                      */
/* ---------------------------------- */
// useSortable is a hook, so each row needs to be its own component —
// it can't be called inside the .map() callback of the parent.
const SortableStaffRow = ({ staff, index, disabled, children }) => {
    const { ref, handleRef, isDragging } = useSortable({
        id: staff.id,
        index,
        disabled,
    });

    return (
        <TableRow
            ref={ref}
            className={cn(
                'group transition-colors hover:bg-muted/30',
                isDragging && 'bg-blue-50/70 opacity-60'
            )}
        >
            <TableCell className="w-8">
                <button
                    ref={handleRef}
                    type="button"
                    disabled={disabled}
                    title={disabled ? 'Clear search/filters to reorder' : 'Drag to reorder'}
                    className={cn(
                        'flex h-8 w-8 items-center justify-center rounded text-muted-foreground',
                        disabled ? 'cursor-not-allowed opacity-30' : 'cursor-grab hover:bg-muted active:cursor-grabbing'
                    )}
                >
                    <GripVertical className="h-4 w-4" />
                </button>
            </TableCell>
            {children}
        </TableRow>
    );
};

const StaffListing = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [emailVerifiedFilter, setEmailVerifiedFilter] = useState('all');
    const [openViewModal, setOpenViewModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [viewingStaff, setViewingStaff] = useState(null);

    // Local, re-orderable copy of the staff list. Kept separate from the
    // raw query response so a drag can update the UI immediately, without
    // waiting for a refetch.
    const [orderedStaffs, setOrderedStaffs] = useState([]);

    const {
        data: response,
        loading: staffLoading,
        refetch: refetchStaff
    } = useApiQuery({
        url: "/admin/staffs",
        params: {
            search: searchTerm || undefined,
            status: statusFilter !== 'all' ? statusFilter : undefined,
            email_verified: emailVerifiedFilter !== 'all' ? emailVerifiedFilter : undefined,
            // Ask the backend to return staff already sorted by sort_order.
            sort_by: 'sort_order',
            sort_direction: 'asc',
        }
    });

    // Keep the local, draggable list in sync with fresh server data.
    // Client-side sort is a safety net in case a given endpoint/filter
    // combination doesn't apply sort_by itself.
    useEffect(() => {
        const data = response?.data?.data;
        if (Array.isArray(data)) {
            const sorted = [...data].sort(
                (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
            );
            setOrderedStaffs(sorted);
        } else {
            setOrderedStaffs([]);
        }
    }, [response]);

    const staffs = orderedStaffs;

    // Reordering only makes sense against the full, unfiltered list — a
    // dragged position inside filtered results doesn't map to a real
    // sort_order. Disable drag while any search/filter is active.
    const canReorder = !searchTerm && statusFilter === 'all' && emailVerifiedFilter === 'all';

    // Delete mutation
    const {
        mutate: staffDeleteMutation,
        isLoading: staffDeleteLoading
    } = useApiMutation({
        url: `/admin/staffs/${selectedStaff?.id}`,
        method: 'DELETE'
    });

    // Reorder mutation — sends the full new order so the backend can
    // rewrite every affected row's sort_order in one request.
    const {
        mutate: staffReorderMutation,
        isLoading: staffReorderLoading
    } = useApiMutation({
        url: '/admin/staffs/reorder',
        method: 'POST',
    });

    const persistOrder = async (newOrder) => {
        const payload = {
            orders: newOrder.map((staff, index) => ({
                id: staff.id,
                sort_order: index + 1,
            })),
        };

        try {
            const res = await staffReorderMutation(payload);
            if (!res?.success) {
                toast.error(res?.message || 'Failed to save new order');
                refetchStaff(); // revert to whatever the server actually has
            }
        } catch (e) {
            console.log('Staff reorder error - ', e);
            toast.error('Failed to save new order');
            refetchStaff();
        }
    };

    const handleDragEnd = (event) => {
        if (!canReorder) return;

        setOrderedStaffs((items) => {
            const newOrder = move(items, event);

            // Only hit the API if the order actually changed (drag cancelled
            // / dropped back in place shouldn't trigger a save).
            const changed = newOrder.some((staff, index) => staff.id !== items[index]?.id);
            if (changed) {
                persistOrder(newOrder);
            }

            return newOrder;
        });
    };

    const handleDelete = async () => {
        try {
            const response = await staffDeleteMutation();
            if (response?.success) {
                toast.success(response?.message || "Staff deleted successfully");
                await refetchStaff();
                setSelectedStaff(null);
                setOpenDeleteModal(false);
            }
        } catch (e) {
            console.log("Staff delete error - ", e);
            toast.error("Failed to delete staff");
        }
    };

    const handleViewStaff = (staff) => {
        setViewingStaff(staff);
        setOpenViewModal(true);
    };

    const handleEditStaff = (staff) => {
        navigate(`/admin/all-staff/save/${staff?.id}`);
    };

    const handleDeleteStaff = (staff) => {
        setSelectedStaff(staff);
        setOpenDeleteModal(true);
    };

    const getInitials = (name) => {
        return name?.split(' ').map(word => word[0]).join('').toUpperCase() || '?';
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'inactive':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Staff Detail View Modal
    const StaffDetailModal = ({ staff, open, onOpenChange }) => {
        if (!staff) return null;

        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">Staff Details</DialogTitle>
                        <DialogDescription>
                            Complete information about the staff member
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                        <div className="flex items-center gap-6 p-6 bg-linear-to-r from-blue-50 to-purple-50 rounded-xl">
                            <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                                <AvatarImage src={staff.avatar_full_path} alt={staff.name} />
                                <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">
                                    {getInitials(staff.name)}
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex-1">
                                <h3 className="text-2xl font-bold">{staff.name}</h3>
                                <div className="flex items-center gap-3 mt-1">
                                    <Badge className={getStatusColor(staff.status)}>
                                        {staff.status?.toUpperCase()}
                                    </Badge>
                                    {staff.email_verified_at && (
                                        <Badge className="bg-green-100 text-green-800">
                                            ✓ Verified
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Staff Information Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                    <Mail className="h-4 w-4" />
                                    Email
                                </div>
                                <p className="font-medium">{staff.email}</p>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                    <Phone className="h-4 w-4" />
                                    Phone
                                </div>
                                <p className="font-medium">{staff.phone || 'Not provided'}</p>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                    <Users className="h-4 w-4" />
                                    Role
                                </div>
                                <p className="font-medium capitalize">{staff.type}</p>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                    <Calendar className="h-4 w-4" />
                                    Joined
                                </div>
                                <p className="font-medium">{formatDate(staff.created_at)}</p>
                            </div>
                        </div>

                        {/* Action Buttons */}
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
                                    handleEditStaff(staff);
                                }}
                            >
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit Staff
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
                title="Staff Management"
                subtitle={`Manage your staff members (${staffs.length} total)`}
                primaryAction={{
                    title: "Add Staff",
                    icon: "plus",
                    onClick: () => navigate("/admin/all-staff/save")
                }}
                secondaryAction={{
                    title: "Refresh",
                    icon: "refresh",
                    onClick: refetchStaff
                }}
            />

            {/* Filters */}
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-1 items-center gap-3">
                    <div className="relative flex-1 md:max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search by name, email or phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9"
                        />
                    </div>

                    <Select value={emailVerifiedFilter} onValueChange={setEmailVerifiedFilter}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Verification" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="true">Verified</SelectItem>
                            <SelectItem value="false">Unverified</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>{staffs.length} staff{staffs.length !== 1 ? 's' : ''} found</span>
                    <span className="hidden text-xs md:inline">
                        {canReorder ? '• Drag rows to reorder' : '• Clear search/filters to reorder'}
                    </span>
                </div>
            </div>

            {/* Staff Table */}
            {staffs.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Users className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No staff members found</p>
                        <Button
                            variant="link"
                            onClick={() => navigate("/admin/all-staff/save")}
                            className="mt-2"
                        >
                            Add your first staff member
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
                    <DragDropProvider onDragEnd={handleDragEnd}>
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/40">
                                    <TableHead className="w-8" />
                                    <TableHead className="w-12">#</TableHead>
                                    <TableHead>Staff</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Position</TableHead>
                                    <TableHead>Verification</TableHead>
                                    <TableHead>Joined</TableHead>
                                    <TableHead>Last Login</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {staffs.map((staff, index) => (
                                    <SortableStaffRow
                                        key={staff.id}
                                        staff={staff}
                                        index={index}
                                        disabled={!canReorder}
                                    >
                                        <TableCell className="font-medium">
                                            {index + 1}
                                        </TableCell>

                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10 border">
                                                    <AvatarImage src={staff.avatar_full_path} alt={staff.name} />
                                                    <AvatarFallback className="bg-blue-100 text-blue-600 text-sm">
                                                        {getInitials(staff.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium">{staff.name}</p>
                                                    <p className="text-xs text-muted-foreground capitalize">
                                                        {staff.type}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Mail className="h-3 w-3 text-muted-foreground" />
                                                    <span>{staff.email}</span>
                                                </div>
                                                {staff.phone && (
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Phone className="h-3 w-3" />
                                                        <span>{staff.phone}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <span className='border px-2 py-1 rounded-full'>{staff?.meta?.position}</span>
                                        </TableCell>

                                        <TableCell>
                                            {staff.email_verified_at ? (
                                                <Badge className="bg-green-100 text-green-800 border-green-200">
                                                    ✓ Verified
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="text-muted-foreground">
                                                    ✗ Unverified
                                                </Badge>
                                            )}
                                        </TableCell>

                                        <TableCell className="text-sm text-muted-foreground">
                                            {formatDate(staff.created_at)}
                                        </TableCell>
                                        <TableCell>
                                            {
                                                staff.last_login_at ? formatDate(staff.last_login_at) : "No Login yeat"
                                            }
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex justify-end">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                        >
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => handleViewStaff(staff)}>
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleEditStaff(staff)}>
                                                            <Pencil className="h-4 w-4 mr-2" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => handleDeleteStaff(staff)}
                                                            className="text-red-600"
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </TableCell>
                                    </SortableStaffRow>
                                ))}
                            </TableBody>
                        </Table>
                    </DragDropProvider>
                </div>
            )}

            {/* View Modal */}
            <StaffDetailModal
                staff={viewingStaff}
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
                    setSelectedStaff(null);
                }}
                loading={staffDeleteLoading}
            />
        </div>
    );
};

export default StaffListing;