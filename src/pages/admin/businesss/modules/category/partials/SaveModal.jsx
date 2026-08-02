import React, { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

import { useApiQuery } from "@/hooks/useAppQuery";
import { useApiMutation } from "@/hooks/useAppMutation";
import { Check, ChevronsUpDown, Loader2, Plus, Save, Tag, Trash2 } from "lucide-react";

const emptyRow = () => ({ title: "", description: "" });

const SaveModal = ({ open, onOpenChange, onSaved }) => {
  const [type, setType] = useState("");
  const [typePopoverOpen, setTypePopoverOpen] = useState(false);
  const [rows, setRows] = useState([emptyRow()]);

  const { data: modulesResponse, isLoading: modulesLoading } = useApiQuery({
    url: "/admin/business-modules",
  });

  const modules = modulesResponse?.data?.data || [];
  const selectedModule = modules.find((module) => module.title_slug === type);

  const { mutate: categoryMutation, isLoading: saving } = useApiMutation({
    url: "/admin/business-module-item-categories/bulk",
    method: "POST",
  });

  const updateRow = (index, key, value) => {
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, [key]: value } : row)));
  };

  const addRow = () => setRows((prev) => [...prev, emptyRow()]);

  const removeRow = (index) => setRows((prev) => prev.filter((_, i) => i !== index));

  const resetForm = () => {
    setType("");
    setRows([emptyRow()]);
  };

  const handleSubmit = async () => {
    if (!type) {
      toast.error("Please select a module type");
      return;
    }

    const validRows = rows.filter((row) => row.title.trim());
    if (validRows.length === 0) {
      toast.error("Add at least one category title");
      return;
    }

    const payload = {
      type,
      categories: validRows.map((row) => ({
        title: row.title.trim(),
        description: row.description?.trim() || null,
      })),
    };

    try {
      const response = await categoryMutation(payload);
      if (response?.success) {
        toast.success(response?.message || "Categories saved successfully");
        onSaved?.();
        resetForm();
        onOpenChange(false);
      } else {
        toast.error(response?.message || "Failed to save categories");
      }
    }catch(error){
      if(error.message){
        toast.error(error.message || "Failed to save categories")
      }
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) resetForm();
        onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-blue-600" />
            Add Categories
          </DialogTitle>
          <DialogDescription>Select a module type and add one or more categories for it</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label className="text-sm font-semibold">
              Module Type <span className="text-red-500">*</span>
            </Label>

            <Popover open={typePopoverOpen} onOpenChange={setTypePopoverOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" className="w-full justify-between font-normal">
                  {selectedModule ? selectedModule.title : "Select module type"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
{console.log("Modules data:", modules)}
              <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search module..." />
                  <CommandEmpty>{modulesLoading ? "Loading..." : "No module found."}</CommandEmpty>
                  <CommandGroup className="max-h-72 overflow-y-auto">
                    {modules.map((module) => (
                      <CommandItem
                        key={module.id}
                        value={module.title}
                        onSelect={() => {
                          setType(module.title_slug);
                          setTypePopoverOpen(false);
                        }}
                      >
                        <Check
                          className={cn("mr-2 h-4 w-4", type === module.title_slug ? "opacity-100" : "opacity-0")}
                        />
                        {module.title} - ({module?.module_type === 'system' ? 'Page Module' : 'Custom'})
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>

            {selectedModule && (
              <Badge className="bg-blue-100 text-blue-700 border-blue-300">
                <Tag className="mr-1 h-3 w-3" />
                {selectedModule.title}
              </Badge>
            )}
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">Categories</Label>
              <Button type="button" size="sm" variant="outline" onClick={addRow} className="gap-1">
                <Plus className="h-3.5 w-3.5" />
                Add More
              </Button>
            </div>

            {rows.map((row, index) => (
              <div key={index} className="relative space-y-3 rounded-lg border bg-gray-50 p-3">
                {rows.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeRow(index)}
                    className="absolute top-2 right-2 text-red-500 hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}

                <div className="space-y-1.5 pr-8">
                  <Label className="text-xs text-muted-foreground">Title</Label>
                  <Input
                    value={row.title}
                    onChange={(e) => updateRow(index, "title", e.target.value)}
                    placeholder="Enter category title"
                    className="bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Description</Label>
                  <Textarea
                    value={row.description}
                    onChange={(e) => updateRow(index, "description", e.target.value)}
                    placeholder="Enter description (optional)"
                    rows={2}
                    className="bg-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={saving} className="gap-2">
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Categories
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaveModal;