import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Boxes, Plus, Edit, Trash2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { useApiQuery } from "@/hooks/useAppQuery";
import { useApiMutation } from "@/hooks/useAppMutation";
import ModuleFormModal from "./ModuleFormModal";

const ModuleManageTab = () => {
  const [formOpen, setFormOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const {
    data: modulesResponse,
    isLoading: modulesLoading,
    refetch: refetchModules,
  } = useApiQuery({
    url: "/admin/modules",
  });

  const modules = modulesResponse?.data || [];

  const { mutate: deleteModule, isLoading: deleting } = useApiMutation({
    url: `/admin/modules/${deleteTarget?.id}`,
    method: "DELETE",
  });

  const openCreate = () => {
    setSelectedModule(null);
    setFormOpen(true);
  };

  const openEdit = (module) => {
    setSelectedModule(module);
    setFormOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await deleteModule();
      if (response?.success) {
        toast.success("Module deleted successfully");
        await refetchModules();
      } else {
        toast.error(response?.message || "Failed to delete module");
      }
    } catch (error) {
      toast.error("Error deleting module");
    } finally {
      setDeleteTarget(null);
    }
  };

  if (modulesLoading) {
    return (
      <div className="p-6 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-white rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader className="border-b bg-linear-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Boxes className="h-5 w-5 text-blue-600" />
                Modules
              </CardTitle>
              <CardDescription>Manage the modules available for this business</CardDescription>
            </div>
            <Button onClick={openCreate} className="gap-2">
              <Plus className="h-4 w-4" />
              New Module
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {modules.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Boxes className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No modules created yet</p>
              <p className="text-sm">Click "New Module" to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {modules?.length > 0 && modules?.map((module) => (
                <div key={module.id} className="p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors group">
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 rounded-md bg-white border flex items-center justify-center overflow-hidden shrink-0">
                      {module.image_full_path ? (
                        <img src={module.image_full_path} alt={module.title} className="h-full w-full object-cover" />
                      ) : (
                        <ImageIcon className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{module.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{module.module_slug}</p>
                      <div className="flex items-center gap-2 mt-2">
                        {module.meta?.category_required && (
                          <Badge variant="outline" className="text-xs">Category Required</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(module)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => setDeleteTarget(module)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <ModuleFormModal open={formOpen} onOpenChange={setFormOpen} module={selectedModule} onSaved={refetchModules} />

      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Module</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteTarget?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={deleting} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ModuleManageTab;