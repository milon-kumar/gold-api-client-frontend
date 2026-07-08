import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link } from "react-router";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    MoreHorizontal,
    Search,
    Settings,
    Eye,
    Edit,
    Trash2,
    Copy,
    Download, Sun, Moon
} from "lucide-react";
import {useApiQuery} from "@/hooks/useAppQuery.js";

const BusinessList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);


    // Get status badge variant
    const getStatusBadge = (status) => {
        switch (status) {
            case 'active':
                return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>;
            case 'inactive':
                return <Badge className={'bg-gray-300 hover:bg-gray-500 hover:text-white'} variant="secondary">Inactive</Badge>;
            case 'pending':
                return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Pending</Badge>;
            case 'suspended':
                return <Badge variant="destructive">Suspended</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    // Handle export
    const handleExport = () => {
        const csv = [
            ['ID', 'Name', 'Subdomain', 'Domain', 'Database Type', 'Status', 'Created At', 'Updated At'],
            ...filteredOrganizations.map(org => [
                org.id,
                org.name,
                org.subdomain,
                org.domain,
                org.database_type,
                org.status,
                org.created_at,
                org.updated_at
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `organizations_${new Date().toISOString()}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };


    const { data: response } = useApiQuery({
        url: "/admin/businesses",
    });

    const businesses = response?.data?.data?.data || [];


    return (
        <div className="space-y-4">
            {/* Header and Search */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Businesses</h2>
                    <p className="text-muted-foreground">
                        Manage all businesses in your system
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleExport}>
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                    <Button>
                        Add business
                    </Button>
                </div>
            </div>

            <div className="relative max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search by name, subdomain or domain..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                />
            </div>

            {/* Table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Subdomain</TableHead>
                            <TableHead>Domain</TableHead>
                            <TableHead>Database Type</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Settings</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead>Updated At</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {businesses?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={10} className="text-center text-muted-foreground">
                                    No organizations found
                                </TableCell>
                            </TableRow>
                        ) : (
                            businesses?.map((business) => (
                                <TableRow key={business?.id}>
                                    <TableCell className="font-mono text-xs">{business?.id}</TableCell>
                                    <Link to={`/admin/businesses/${business?.id}`}>
                                        <TableCell className="font-medium">{business?.name}</TableCell>
                                    </Link>
                                    <TableCell className="font-mono text-xs">{business?.subdomain}</TableCell>
                                    <TableCell className="font-mono text-xs">{business?.domain}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{business?.database_type}</Badge>
                                    </TableCell>
                                    <TableCell className={'cursor-pointer'} >{getStatusBadge(business?.status)}</TableCell>
                                    <TableCell>
                                        {/*<Button variant="ghost" size="sm">*/}
                                            <Settings className="h-4 w-4" />
                                        {/*</Button>*/}
                                    </TableCell>
                                    <TableCell className="text-sm">{formatDate(business?.created_at)}</TableCell>
                                    <TableCell className="text-sm">{formatDate(business?.updated_at)}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination
            {filteredOrganizations.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-muted-foreground">
                        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredOrganizations.length)} of {filteredOrganizations.length} organizations
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => goToPage(1)}
                            disabled={currentPage === 1}
                        >
                            <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum;
                                if (totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (currentPage <= 3) {
                                    pageNum = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                } else {
                                    pageNum = currentPage - 2 + i;
                                }
                                return (
                                    <Button
                                        key={pageNum}
                                        variant={currentPage === pageNum ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => goToPage(pageNum)}
                                        className="w-9"
                                    >
                                        {pageNum}
                                    </Button>
                                );
                            })}
                        </div>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => goToPage(totalPages)}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronsRight className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Rows per page:</span>
                        <select
                            className="border rounded-md px-2 py-1 text-sm"
                            value={itemsPerPage}
                            onChange={(e) => {
                                setItemsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                        >
                            {[5, 10, 20, 50].map(page => (
                                <option key={page} value={page}>{page}</option>
                            ))}
                        </select>
                    </div>
                </div>
            )} */}
        </div>
    );
};

export default BusinessList;
