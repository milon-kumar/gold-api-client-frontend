import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FolderTree, Loader2 } from "lucide-react";
import { SearchableSelectPopover } from "@/components/ui/searchable-select-popover";

const CategoryCard = ({ categories, categoryId, onChange, loading }) => {
  const categoryItems = (categories || []).map((c) => ({
    value: c.id,
    label: c.name,
  }));
  
  return (
   
    <Card className="shadow-sm">
      <CardHeader className="border-b bg-gray-50/50">
        <CardTitle className="flex items-center gap-2 text-xl">
          <FolderTree className="h-5 w-5 text-indigo-600" />
          Category
        </CardTitle>
        <CardDescription>Select a category for this item</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div>
          <SearchableSelectPopover
              items={categoryItems}
              value={categoryId}
              onSelect={(value) => onChange(value)}
              placeholder="Select Category"
              searchPlaceholder="Search category..."
              emptyText="No categoyr found."
              disabled={loading}
            />
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;