import React, { useState } from "react";
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
import { Link, useNavigate } from "react-router";
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
  Download,
  Sun,
  Moon,
} from "lucide-react";
import { useApiQuery } from "@/hooks/useAppQuery.js";
import { useApiMutation } from "@/hooks/useAppMutation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const BusinessList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const navigate = useNavigate();
  // State for status change modal
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  // Get status badge variant
  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
        );
      case "inactive":
        return (
          <Badge
            className={"bg-gray-300 hover:bg-gray-500 hover:text-white"}
            variant="secondary"
          >
            Inactive
          </Badge>
        );
      case "pending":
        return (
          <Badge
            variant="outline"
            className="text-yellow-600 border-yellow-600"
          >
            Pending
          </Badge>
        );
      case "suspended":
        return <Badge variant="destructive">Suspended</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Handle export
  const handleExport = () => {
    const csv = [
      [
        "ID",
        "Name",
        "Subdomain",
        "Domain",
        "Database Type",
        "Status",
        "Created At",
        "Updated At",
      ],
      ...filteredOrganizations.map((org) => [
        org.id,
        org.name,
        org.subdomain,
        org.domain,
        org.database_type,
        org.status,
        org.created_at,
        org.updated_at,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `organizations_${new Date().toISOString()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // API queries and mutations
  const { data: response, refetch } = useApiQuery({
    url: "/admin/businesses",
  });

  const {
    mutate: updateBusinessStatus,
    isLoading: updateBusinessStatusLoading,
  } = useApiMutation({
    url: `/admin/businesses/${selectedBusiness?.id}/status`,
    method: "POST",
  });

  const { mutate: deleteBusiness } = useApiMutation({
    url: `/admin/businesses/${selectedBusiness?.id}`,
    method: "DELETE",
    onSuccess: () => {
      toast({
        title: "Business deleted",
        description: "Business has been deleted successfully",
      });
      setSelectedBusiness(null);
      refetch();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to delete business",
        variant: "destructive",
      });
    },
  });

  const businesses = response?.data?.data?.data || [];

  // Handle status change
  const handleStatusChange = (business) => {
    setSelectedBusiness(business);
    setNewStatus(business.status);
    setIsStatusModalOpen(true);
  };

  const handleConfirmStatusChange = async () => {
    if (selectedBusiness && newStatus) {
      const response = await updateBusinessStatus({ status: newStatus });
      if (response.success) {
        setIsStatusModalOpen(false);
        await refetch();
        toast.success(response?.message || "Status update success");
      }
    }
  };

  // Handle delete
  const handleDelete = (business) => {
    if (window.confirm(`Are you sure you want to delete "${business.name}"?`)) {
      setSelectedBusiness(business);
      deleteBusiness();
    }
  };

  // Handle edit
  const handleEdit = (business) => {
    navigate(`/admin/businesses/${business.id}/edit`)
  };

  const handleAddBusiness = () =>{
    navigate(`/admin/businesses/new`)
  }

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
          <Button onClick={handleAddBusiness}>Add business</Button>
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
              <TableHead>Created At</TableHead>
              <TableHead>Lust Updated At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {businesses?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="text-center text-muted-foreground"
                >
                  No organizations found
                </TableCell>
              </TableRow>
            ) : (
              businesses?.map((business) => (
                <TableRow key={business?.id}>
                  <TableCell className="font-mono text-xs">
                    {business?.id}
                  </TableCell>
                  <Link to={`/admin/businesses/${business?.id}`}>
                    <TableCell className="font-medium">
                      {business?.name}
                    </TableCell>
                  </Link>
                  <TableCell className="font-mono text-xs">
                    {business?.subdomain}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {business?.domain}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{business?.database_type}</Badge>
                  </TableCell>
                  <TableCell
                    className="cursor-pointer"
                    onClick={() => handleStatusChange(business)}
                  >
                    {getStatusBadge(business?.status)}
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatDate(business?.created_at)}
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatDate(business?.updated_at)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        {/* <DropdownMenuItem onClick={() => handleEdit(business)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem> */}
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(business)}
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          Change Status
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {/* <DropdownMenuItem
                          onClick={() => handleDelete(business)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem> */}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Status Change Modal */}
      <Dialog open={isStatusModalOpen} onOpenChange={setIsStatusModalOpen}>
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>Change Business Status</DialogTitle>
            <DialogDescription>
              Update the status for {selectedBusiness?.name}. This will affect
              the business's availability.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger className="col-span-3">
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-sm text-muted-foreground">
                Current
              </Label>
              <div className="col-span-3">
                {selectedBusiness && getStatusBadge(selectedBusiness.status)}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsStatusModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmStatusChange}
              disabled={updateBusinessStatusLoading}
            >
              {updateBusinessStatusLoading ? "Loading..." : "Update Status"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pagination - Uncomment and implement as needed */}
      {/* Pagination code here */}
    </div>
  );
};

export default BusinessList;
