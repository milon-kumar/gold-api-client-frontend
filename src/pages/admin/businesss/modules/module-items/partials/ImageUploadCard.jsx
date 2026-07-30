import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Image as ImageIcon, Upload, Trash2, AlertCircle, CheckCircle } from "lucide-react";

const ImageUploadCard = ({ preview, imageError, imageBase64, imageMaxSize, onImageChange, onRemoveImage }) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="border-b bg-gray-50/50">
        <CardTitle className="flex items-center gap-2 text-xl">
          <ImageIcon className="h-5 w-5 text-green-600" />
          Logo / Image
        </CardTitle>
        <CardDescription>Upload a logo or image (Max {imageMaxSize}MB)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        {preview ? (
          <div className="relative">
            <div className="relative overflow-hidden rounded-lg border bg-gray-50">
              <div className="flex h-64 w-full items-center justify-center bg-gray-100">
                <img src={preview} alt="Preview" className="max-h-full max-w-full object-contain" />
              </div>
              <div className="absolute top-2 right-2">
                <Button type="button" variant="destructive" size="sm" onClick={onRemoveImage} className="gap-1">
                  <Trash2 className="h-4 w-4" />
                  Remove
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-64 flex-col items-center justify-center rounded-lg border-2 border-dashed bg-gray-50/30 p-6 transition-colors hover:border-primary">
            <Upload className="h-12 w-12 text-muted-foreground mb-4" />
            <Label
              htmlFor="image-upload"
              className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
            >
              <ImageIcon className="h-4 w-4" />
              Choose Image
            </Label>
            <input
              id="image-upload"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={onImageChange}
              className="hidden"
            />
            <p className="mt-3 text-sm text-muted-foreground text-center">Click to browse or drag and drop</p>
            <p className="mt-1 text-xs text-muted-foreground text-center">Supported formats: JPEG, PNG, WebP, GIF</p>
          </div>
        )}

        {imageError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{imageError}</AlertDescription>
          </Alert>
        )}

        {imageBase64 && !imageError && (
          <Alert>
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-sm">Image loaded successfully! Ready to upload.</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageUploadCard;