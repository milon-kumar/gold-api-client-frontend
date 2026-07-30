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

const CategoryCard = ({ categories, categoryId, onChange, loading }) => {
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
          <Label htmlFor="category" className="text-sm font-semibold">
            Category <span className="text-red-500">*</span>
          </Label>
          <Select value={categoryId ? String(categoryId) : ""} onValueChange={(value) => onChange(value)} disabled={loading}>
            <SelectTrigger className="mt-1.5">
              <SelectValue placeholder={loading ? "Loading categories..." : "Select a category"} />
            </SelectTrigger>
            <SelectContent>
              {categories.length === 0 ? (
                <div className="p-2 text-sm text-muted-foreground flex items-center gap-2">
                  {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  {loading ? "Loading..." : "No categories found"}
                </div>
              ) : (
                categories.map((category) => (
                  <SelectItem key={category.id} value={String(category.id)}>
                    {category.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;