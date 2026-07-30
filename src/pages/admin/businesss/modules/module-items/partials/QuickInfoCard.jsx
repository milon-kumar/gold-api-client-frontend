import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

const QuickInfoCard = ({ item }) => {
  if (!item) return null;

  return (
    <Card className="shadow-sm border-blue-200 bg-blue-50/30">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <Calendar className="h-4 w-4 text-blue-600" />
          Item Info
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
        <div className="flex justify-between">
          <span className="text-muted-foreground">ID</span>
          <span className="font-medium">#{item.id}</span>
        </div>
        {item.description && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Has Description</span>
            <span className="font-medium">{item.description.length > 100 ? "Yes (Long)" : "Yes"}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuickInfoCard;