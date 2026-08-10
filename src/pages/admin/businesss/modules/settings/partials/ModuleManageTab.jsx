import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
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
    url: "/admin/business-modules",
    params: {
      creation_type: "custom",
    },
  });
    
  const modules = modulesResponse?.data?.data || [];

  

  const { mutate: deleteModule, isLoading: deleting } = useApiMutation({
    url: `/admin/business-modules/${deleteTarget?.id}`,
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
      <Card className="shadow-sm p-0 m-0">
        <CardHeader className="border-b bg-linear-to-r from-blue-50 to-indigo-50 py-2">
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
        <CardContent className="pb-4">
          {modules.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Boxes className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No modules created yet</p>
              <p className="text-sm">Click "New Module" to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
               {modules.map((module) => {
                const isActive = module.status === "active";
                console.log("manage ment module", module);
                return (
                  <div
                    key={module.id}
                    className="group relative overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                  >
                    <div className="relative h-36 w-full overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50">
                      {module.image_full_path ? (
                        <img
                          src={module.image_full_path}
                          alt={module.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
                        </div>
                      )}
 
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
 
                      <div className="absolute top-2.5 left-2.5">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium backdrop-blur-sm",
                            isActive
                              ? "bg-green-500/15 text-green-700 ring-1 ring-inset ring-green-600/20"
                              : "bg-gray-500/15 text-gray-600 ring-1 ring-inset ring-gray-500/20",
                          )}
                        >
                          <span className={cn("h-1.5 w-1.5 rounded-full", isActive ? "bg-green-500" : "bg-gray-400")} />
                          {isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
 
                      <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => openEdit(module)}
                          className="flex h-7 w-7  cursor-pointer items-center justify-center rounded-md bg-white/90 text-gray-700 shadow-sm backdrop-blur-sm hover:bg-white"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(module)}
                          className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md bg-white/90 text-red-600 shadow-sm backdrop-blur-sm hover:bg-white"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
 
                    <div className="space-y-2 p-4">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-900">{module.title}</p>
                        {module.sub_title && (
                          <p className="truncate text-xs text-muted-foreground">{module.sub_title}</p>
                        )}
                      </div>
 
                      {module.short_description && (
                        <p className="line-clamp-2 text-xs text-muted-foreground">{module.short_description}</p>
                      )}
 
                      <div className="flex items-center justify-between pt-1">
                        <div className="gap-3">
                           <code className="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] text-muted-foreground">
                          {module.title_slug}
                        </code>
                        {
                          module.module_type && (
                            <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] capitalize font-medium backdrop-blur-sm">{module.module_type}</span>
                          )

                        }
                        </div>
                       
                        {module.meta?.category_required && (
                            <Badge variant="outline" className="h-5 text-[10px]">
                              Category Required
                            </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
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