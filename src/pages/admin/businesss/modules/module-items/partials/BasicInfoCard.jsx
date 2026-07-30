import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Info } from "lucide-react";
import { RICH_TEXT_VARIANTS, RichTextEditor } from "@/components/ui/rich-text-editor";

const BasicInfoCard = ({ formData, onFieldChange, moduleTitle }) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="border-b bg-gray-50/50">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Info className="h-5 w-5 text-blue-600" />
          {moduleTitle} Information
        </CardTitle>
        <CardDescription>Enter the {moduleTitle.toLowerCase()} details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div>
          <Label htmlFor="title" className="text-sm font-semibold">
            Title <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={(e) => onFieldChange("title", e.target.value)}
            placeholder={`Enter ${moduleTitle.toLowerCase()} name`}
            className="mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="sub_title" className="text-sm font-semibold">Sub Title</Label>
          <Input
            id="sub_title"
            name="sub_title"
            value={formData.sub_title}
            onChange={(e) => onFieldChange("sub_title", e.target.value)}
            placeholder="Enter sub title (optional)"
            className="mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="sub_description" className="text-sm font-semibold">Short Description</Label>
          <Textarea
            id="sub_description"
            name="sub_description"
            value={formData.sub_description}
            onChange={(e) => onFieldChange("sub_description", e.target.value)}
            placeholder="Enter a brief description"
            rows={3}
            className="mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="description" className="text-sm font-semibold">Full Description</Label>
          <RichTextEditor
            variant={RICH_TEXT_VARIANTS.SIMPLE}
            value={formData.description}
            onChange={(content) => onFieldChange("description", content)}
            placeholder="Enter detailed description"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicInfoCard;