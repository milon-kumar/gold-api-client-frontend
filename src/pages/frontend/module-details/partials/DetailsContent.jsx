import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
// import "@/components/ui/rich-text-editor/rich-text-editor.css";

const DetailsContent = ({ item }) => {
  if (!item.sub_description && !item.description) return null;

  return (
    <Card className="shadow-sm">
      <CardHeader className="border-b bg-gray-50/50">
        <CardTitle className="flex items-center gap-2 text-xl">
          <FileText className="h-5 w-5 text-blue-600" />
          About
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        {item.sub_description && (
          <p className="text-muted-foreground leading-relaxed">{item.sub_description}</p>
        )}
        {item.description && (
          <div className="rte-content" dangerouslySetInnerHTML={{ __html: item.description }} />
        )}
      </CardContent>
    </Card>
  );
};

export default DetailsContent;