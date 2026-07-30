import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, FolderOpen, Info } from "lucide-react";

const DetailsSidebar = ({ item }) => {
  return (
    <div className="space-y-6">
      {item.category && (
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <FolderOpen className="h-4 w-4 text-indigo-600" />
              Category
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-3">
              {item.category.image_full_path ? (
                <img
                  src={item.category.image_full_path}
                  alt={item.category.name}
                  className="h-10 w-10 rounded-md object-cover border"
                />
              ) : (
                <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center">
                  <FolderOpen className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
              <div>
                <p className="text-sm font-medium">{item.category.name}</p>
                {item.category.description && (
                  <p className="text-xs text-muted-foreground line-clamp-1">{item.category.description}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-sm border-blue-200 bg-blue-50/30">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <Calendar className="h-4 w-4 text-blue-600" />
            Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Created</span>
            <span className="font-medium">{new Date(item.created_at).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Last Updated</span>
            <span className="font-medium">{new Date(item.updated_at).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Slug</span>
            <Badge variant="outline">{item.slug}</Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">ID</span>
            <span className="font-medium">#{item.id}</span>
          </div>
        </CardContent>
      </Card>

      {item.meta?.seo_content && (
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Info className="h-4 w-4 text-purple-600" />
              SEO Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border p-3 bg-white">
              <p className="text-blue-700 text-sm truncate">
                {item.meta.seo_content.meta_title || item.title}
              </p>
              <p className="text-green-700 text-xs truncate">{item.meta.seo_content.canonical_url}</p>
              <p className="text-muted-foreground text-xs line-clamp-2 mt-1">
                {item.meta.seo_content.meta_description || item.sub_description}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DetailsSidebar;